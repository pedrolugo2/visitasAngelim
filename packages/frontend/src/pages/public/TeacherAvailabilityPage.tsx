import { useState } from "react";
import { Form, Input, Select, Checkbox, DatePicker, Button, Card, Typography, message, Result } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useUnits } from "../../hooks/useUnits";
import { createTeacherAvailability } from "../../services/teacherAvailability.service";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

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

      const data = {
        teacherName: values.teacherName,
        teacherEmail: values.teacherEmail,
        unitId: values.unitId,
        availableDates: values.availableDates.map((d: string) =>
          dayjs(d).toISOString()
        ),
        preferredTimes: values.preferredTimes || [],
        notes: values.notes || "",
        status: "pending" as const,
      };

      await createTeacherAvailability(data);
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
            name="availableDates"
            label="Datas disponíveis"
            rules={[
              { required: true, message: "Selecione ao menos uma data" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Selecione as datas"
              size="large"
              style={{ width: "100%" }}
            >
              {Array.from({ length: 30 }, (_, i) => {
                const date = dayjs().add(i, "day");
                return (
                  <Select.Option key={date.format("YYYY-MM-DD")} value={date.format("YYYY-MM-DD")}>
                    {date.format("DD/MM/YYYY (dddd)")}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name="preferredTimes" label="Períodos preferidos">
            <Checkbox.Group
              options={[
                { label: "Manhã", value: "morning" },
                { label: "Tarde", value: "afternoon" },
              ]}
            />
          </Form.Item>

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
