import { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Popconfirm,
  message,
  Divider,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Lead, CreateLeadData } from "@visitas-angelim/shared";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
} from "@visitas-angelim/shared";
import {
  createLead,
  updateLead,
  deleteLead,
} from "../../../services/leads.service";

const { TextArea } = Input;

interface LeadDetailDrawerProps {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
}

export default function LeadDetailDrawer({
  open,
  lead,
  onClose,
}: LeadDetailDrawerProps) {
  const [form] = Form.useForm();
  const isNew = !lead;

  useEffect(() => {
    if (open) {
      if (lead) {
        form.setFieldsValue({
          ...lead,
          lastContactDate: lead.lastContactDate
            ? dayjs(lead.lastContactDate as string)
            : undefined,
          nextFollowUpDate: lead.nextFollowUpDate
            ? dayjs(lead.nextFollowUpDate as string)
            : undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: "new_lead" });
      }
    }
  }, [open, lead, form]);

  async function handleSave() {
    try {
      const values = await form.validateFields();

      const data = {
        ...values,
        lastContactDate: values.lastContactDate
          ? values.lastContactDate.toDate()
          : null,
        nextFollowUpDate: values.nextFollowUpDate
          ? values.nextFollowUpDate.toDate()
          : null,
      };

      if (isNew) {
        await createLead(data as CreateLeadData);
        message.success("Lead criado com sucesso");
      } else {
        await updateLead(lead.id, data);
        message.success("Lead atualizado com sucesso");
      }

      onClose();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Erro ao salvar lead");
    }
  }

  async function handleDelete() {
    if (!lead) return;
    try {
      await deleteLead(lead.id);
      message.success("Lead excluído");
      onClose();
    } catch {
      message.error("Erro ao excluir lead");
    }
  }

  return (
    <Drawer
      title={isNew ? "Novo Lead" : "Editar Lead"}
      open={open}
      onClose={onClose}
      width={480}
      extra={
        <Space>
          {!isNew && (
            <Popconfirm
              title="Excluir este lead?"
              description="Esta ação não pode ser desfeita."
              onConfirm={handleDelete}
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Excluir
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Salvar
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="parentName"
          label="Nome do responsável"
          rules={[{ required: true, message: "Nome é obrigatório" }]}
        >
          <Input placeholder="Nome completo" />
        </Form.Item>

        <Form.Item
          name="parentEmail"
          label="E-mail"
          rules={[
            { required: true, message: "E-mail é obrigatório" },
            { type: "email", message: "E-mail inválido" },
          ]}
        >
          <Input placeholder="email@exemplo.com" />
        </Form.Item>

        <Form.Item name="parentPhone" label="Telefone">
          <Input placeholder="(00) 00000-0000" />
        </Form.Item>

        <Divider style={{ margin: "12px 0" }} />

        <Form.Item name="childName" label="Nome da criança">
          <Input placeholder="Nome da criança" />
        </Form.Item>

        <Space style={{ width: "100%" }} size="middle">
          <Form.Item name="childAge" label="Idade" style={{ flex: 1 }}>
            <InputNumber
              min={0}
              max={18}
              style={{ width: "100%" }}
              placeholder="Idade"
            />
          </Form.Item>

          <Form.Item
            name="childGradeOfInterest"
            label="Série de interesse"
            style={{ flex: 2 }}
          >
            <Select
              placeholder="Selecione"
              allowClear
              options={[
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
        </Space>

        <Divider style={{ margin: "12px 0" }} />

        <Space style={{ width: "100%" }} size="middle">
          <Form.Item name="status" label="Status" style={{ flex: 1 }}>
            <Select
              options={LEAD_STATUSES.map((s) => ({
                value: s,
                label: LEAD_STATUS_LABELS[s],
              }))}
            />
          </Form.Item>

          <Form.Item name="source" label="Origem" style={{ flex: 1 }}>
            <Select
              placeholder="Selecione"
              allowClear
              options={LEAD_SOURCES.map((s) => ({
                value: s,
                label: LEAD_SOURCE_LABELS[s],
              }))}
            />
          </Form.Item>
        </Space>

        <Space style={{ width: "100%" }} size="middle">
          <Form.Item
            name="lastContactDate"
            label="Último contato"
            style={{ flex: 1 }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Selecione"
            />
          </Form.Item>

          <Form.Item
            name="nextFollowUpDate"
            label="Próximo acompanhamento"
            style={{ flex: 1 }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Selecione"
            />
          </Form.Item>
        </Space>

        <Form.Item name="notes" label="Observações">
          <TextArea
            rows={4}
            placeholder="Notas sobre o lead, histórico de contato, etc."
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
