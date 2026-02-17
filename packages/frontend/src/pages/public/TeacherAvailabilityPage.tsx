import { useState } from "react";
import { Form, Input, Select, DatePicker, Button, Card, Typography, Space, message, Result } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useUnits } from "../../hooks/useUnits";
import { createTeacherAvailability } from "../../services/teacherAvailability.service";
import { createSlot } from "../../services/availability.service";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const hourOptions = Array.from({ length: 14 }, (_, i) => {
  const h = i + 7;
  return { value: h, label: `${String(h).padStart(2, "0")}:00` };
});

export default function TeacherAvailabilityPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { units } = useUnits();

  async function handleSubmit() {
    try {
      const values = await form.validateFields();

      setSubmitting(true);

      const startTime = values.availableDate.hour(values.startHour).minute(0).second(0);
      const endTime = values.availableDate.hour(values.endHour).minute(0).second(0);

      if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
        message.error("Horário de término deve ser após o início");
        setSubmitting(false);
        return;
      }

      const data = {
        teacherName: values.teacherName,
        teacherEmail: values.teacherEmail,
        unitId: values.unitId,
        availableDates: [startTime.toISOString()],
        preferredTimes: [] as ("morning" | "afternoon")[],
        notes: values.notes || "",
        status: "pending" as const,
      };

      await createTeacherAvailability(data);

      // Auto-create an availability slot tagged with teacher's first name
      const firstName = values.teacherName.trim().split(/\s+/)[0];
      await createSlot({
        unitId: values.unitId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        capacity: 5,
        isBookable: true,
        tag: firstName,
      });

      setSubmitted(true);
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Erro ao enviar disponibilidade");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: "60px auto", padding: 24 }}>
        <Result
          status="success"
          icon={<CheckCircleOutlined />}
          title="Disponibilidade registrada!"
          subTitle="Obrigado por registrar sua disponibilidade. Entraremos em contato em breve."
          extra={[
            <Button type="primary" key="home" onClick={() => navigate("/")}>
              Voltar ao início
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
          Registro de Disponibilidade - Professores
        </Title>
        <Paragraph style={{ textAlign: "center", color: "#8c7b6b", marginBottom: 32 }}>
          Preencha este formulário para informar sua disponibilidade para
          conduzir visitas escolares
        </Paragraph>

        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="teacherName"
            label="Seu nome"
            rules={[{ required: true, message: "Nome é obrigatório" }]}
          >
            <Input placeholder="Nome completo" size="large" />
          </Form.Item>

          <Form.Item
            name="teacherEmail"
            label="Seu e-mail"
            rules={[
              { required: true, message: "E-mail é obrigatório" },
              { type: "email", message: "E-mail inválido" },
            ]}
          >
            <Input placeholder="email@exemplo.com" size="large" />
          </Form.Item>

          <Form.Item
            name="unitId"
            label="Unidade"
            rules={[{ required: true, message: "Selecione a unidade" }]}
          >
            <Select
              placeholder="Selecione a unidade"
              size="large"
              options={units.map((u) => ({ value: u.id, label: u.name }))}
            />
          </Form.Item>

          <Form.Item
            name="availableDate"
            label="Data"
            rules={[{ required: true, message: "Selecione a data" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              size="large"
              style={{ width: "100%" }}
              placeholder="Selecione a data"
            />
          </Form.Item>

          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="startHour"
              label="Hora de início"
              rules={[{ required: true, message: "Informe a hora" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Início" size="large" options={hourOptions} />
            </Form.Item>
            <Form.Item
              name="endHour"
              label="Hora de término"
              rules={[{ required: true, message: "Informe a hora" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Término" size="large" options={hourOptions} />
            </Form.Item>
          </Space.Compact>

          <Form.Item name="notes" label="Observações">
            <TextArea
              rows={3}
              placeholder="Informações adicionais ou restrições de horário"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleSubmit}
              loading={submitting}
            >
              Enviar Disponibilidade
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
