import { useState, useMemo } from "react";
import { Steps, Card, Button, Form, Radio, Space, Typography, Result, message } from "antd";

import { httpsCallable } from "firebase/functions";
import dayjs from "dayjs";
import { useUnits } from "../../hooks/useUnits";
import { useAvailableSlots } from "../../features/visits/hooks/useAvailableSlots";
import BookingForm from "../../features/visits/components/BookingForm";
import { functions } from "../../firebase";

const { Title, Text, Paragraph } = Typography;

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; startTime: string; endTime: string } | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const { units } = useUnits();

  // Load slots for next 60 days (memoized to avoid re-creating listeners on every render)
  const [startDate, endDate] = useMemo(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 60);
    return [start, end] as const;
  }, []);

  const { slots } = useAvailableSlots(selectedUnit || undefined, startDate, endDate);

  function handleUnitSelect(unitId: string) {
    setSelectedUnit(unitId);
    setCurrentStep(1);
  }

  function handleSlotSelect(slotId: string, startTime: string, endTime: string) {
    setSelectedSlot({ id: slotId, startTime, endTime });
    setCurrentStep(2);
  }

  async function handleSubmit() {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (!selectedUnit || !selectedSlot) {
        message.error("Selecione uma unidade e horário");
        return;
      }

      // Call the cloud function to book the visit
      const bookVisitFn = httpsCallable(functions, "bookVisit");
      const result = await bookVisitFn({
        parentName: values.parentName,
        parentEmail: values.parentEmail,
        parentPhone: values.parentPhone,
        childName: values.childName,
        childAge: values.childAge,
        childGradeOfInterest: values.childGradeOfInterest,
        unitId: selectedUnit,
        slotId: selectedSlot.id,
      });

      if (result.data && (result.data as any).success) {
        setBookingComplete(true);
        setCurrentStep(3);
      } else {
        message.error("Erro ao agendar visita");
      }
    } catch (err: any) {
      if (err && typeof err === "object" && "errorFields" in err) return;

      // Handle Firebase Functions errors (code format: "functions/error-code")
      const code = err?.code || "";
      const errMessage = err?.message || "";

      if (code.includes("resource-exhausted") || errMessage.includes("resource-exhausted")) {
        message.error("Este horário está lotado. Por favor, escolha outro horário.");
      } else if (code.includes("not-found") || errMessage.includes("not-found")) {
        message.error("Horário não encontrado. Por favor, recarregue a página.");
      } else if (code.includes("invalid-argument") || errMessage.includes("invalid-argument")) {
        message.error("Dados incompletos. Preencha todos os campos obrigatórios.");
      } else if (code.includes("failed-precondition") || errMessage.includes("failed-precondition")) {
        message.error("Este horário não está mais disponível para agendamento.");
      } else if (code.includes("unavailable") || errMessage.includes("Failed to fetch")) {
        message.error("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        message.error("Erro ao agendar visita. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (bookingComplete) {
    return (
      <div style={{ maxWidth: 600, margin: "60px auto", padding: 24 }}>
        <Result
          status="success"
          title="Visita agendada com sucesso!"
          subTitle={
            <div>
              <Paragraph>
                Sua visita foi confirmada para{" "}
                <strong>{dayjs(selectedSlot?.startTime).format("DD/MM/YYYY [às] HH:mm")}</strong>.
              </Paragraph>
              <Paragraph>
                Enviamos um e-mail de confirmação para{" "}
                <strong>{form.getFieldValue("parentEmail")}</strong> com todos os detalhes.
              </Paragraph>
            </div>
          }
          extra={[
            <Button type="primary" key="home" onClick={() => {
              setBookingComplete(false);
              setCurrentStep(0);
              setSelectedUnit(null);
              setSelectedSlot(null);
              form.resetFields();
            }}>
              Voltar ao início
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Agendar Visita
      </Title>

      <Steps
        current={currentStep}
        items={[
          { title: "Unidade" },
          { title: "Horário" },
          { title: "Dados" },
          { title: "Confirmação" },
        ]}
        style={{ marginBottom: 32 }}
      />

      {/* Step 1: Unit Selection */}
      {currentStep === 0 && (
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            Selecione a unidade
          </Title>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {units.map((unit) => (
              <Card
                key={unit.id}
                hoverable
                onClick={() => handleUnitSelect(unit.id)}
                style={{ cursor: "pointer" }}
              >
                <Title level={5} style={{ margin: 0 }}>
                  {unit.name}
                </Title>
                {unit.description && <Text type="secondary">{unit.description}</Text>}
              </Card>
            ))}
          </Space>
        </div>
      )}

      {/* Step 2: Slot Selection */}
      {currentStep === 1 && (
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            Selecione o horário
          </Title>
          {slots.length === 0 ? (
            <Card>
              <Text type="secondary">
                Não há horários disponíveis no momento. Por favor, entre em contato conosco.
              </Text>
            </Card>
          ) : (
            <Radio.Group style={{ width: "100%" }}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {slots.map((slot) => (
                  <Card
                    key={slot.id}
                    hoverable
                    onClick={() =>
                      handleSlotSelect(slot.id, slot.startTime as string, slot.endTime as string)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Space direction="vertical" size={0}>
                      <Text strong>
                        {dayjs(slot.startTime as string).format("DD/MM/YYYY")}
                      </Text>
                      <Text>
                        {dayjs(slot.startTime as string).format("HH:mm")} -{" "}
                        {dayjs(slot.endTime as string).format("HH:mm")}
                      </Text>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Radio.Group>
          )}
          <div style={{ marginTop: 24 }}>
            <Button onClick={() => setCurrentStep(0)}>Voltar</Button>
          </div>
        </div>
      )}

      {/* Step 3: Form */}
      {currentStep === 2 && (
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            Seus dados
          </Title>
          <Card>
            <BookingForm form={form} />
          </Card>
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <Button onClick={() => setCurrentStep(1)}>Voltar</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Confirmar Agendamento
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
