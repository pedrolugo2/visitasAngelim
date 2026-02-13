import { Form, Input, InputNumber, Select } from "antd";

interface BookingFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

export default function BookingForm({ form }: BookingFormProps) {
  return (
    <Form form={form} layout="vertical" requiredMark="optional">
      <Form.Item
        name="parentName"
        label="Nome do responsável"
        rules={[{ required: true, message: "Nome é obrigatório" }]}
      >
        <Input placeholder="Nome completo" size="large" />
      </Form.Item>

      <Form.Item
        name="parentEmail"
        label="E-mail"
        rules={[
          { required: true, message: "E-mail é obrigatório" },
          { type: "email", message: "E-mail inválido" },
        ]}
      >
        <Input placeholder="email@exemplo.com" size="large" />
      </Form.Item>

      <Form.Item
        name="parentPhone"
        label="Telefone"
        rules={[{ required: true, message: "Telefone é obrigatório" }]}
      >
        <Input placeholder="(00) 00000-0000" size="large" />
      </Form.Item>

      <Form.Item name="childName" label="Nome da criança">
        <Input placeholder="Nome da criança" size="large" />
      </Form.Item>

      <Form.Item name="childAge" label="Idade">
        <InputNumber
          min={0}
          max={18}
          style={{ width: "100%" }}
          placeholder="Idade"
          size="large"
        />
      </Form.Item>

      <Form.Item name="childGradeOfInterest" label="Série de interesse">
        <Select
          placeholder="Selecione"
          size="large"
          allowClear
          options={[
            { value: "maternal", label: "Maternal" },
            { value: "jardim", label: "Jardim" },
            { value: "1ano", label: "1º Ano" },
            { value: "2ano", label: "2º Ano" },
            { value: "3ano", label: "3º Ano" },
            { value: "4ano", label: "4º Ano" },
            { value: "5ano", label: "5º Ano" },
            { value: "6ano", label: "6º Ano" },
            { value: "7ano", label: "7º Ano" },
            { value: "8ano", label: "8º Ano" },
            { value: "9ano", label: "9º Ano" },
          ]}
        />
      </Form.Item>
    </Form>
  );
}
