import { useEffect } from "react";
import {
  Drawer,
  Descriptions,
  Form,
  Select,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Divider,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Visit } from "@visitas-angelim/shared";
import { VISIT_STATUSES, VISIT_STATUS_LABELS } from "@visitas-angelim/shared";
import { updateVisit } from "../../../services/visits.service";
import { useUnits } from "../../../hooks/useUnits";

const { TextArea } = Input;

interface VisitDetailDrawerProps {
  open: boolean;
  visit: Visit | null;
  onClose: () => void;
}

export default function VisitDetailDrawer({
  open,
  visit,
  onClose,
}: VisitDetailDrawerProps) {
  const [form] = Form.useForm();
  const { units } = useUnits();

  useEffect(() => {
    if (open && visit) {
      form.setFieldsValue({
        status: visit.status,
        notes: visit.notes,
      });
    }
  }, [open, visit, form]);

  async function handleSave() {
    if (!visit) return;

    try {
      const values = await form.validateFields();
      await updateVisit(visit.id, values);
      message.success("Visita atualizada");
      onClose();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Erro ao atualizar visita");
    }
  }

  async function handleCancel() {
    if (!visit) return;

    try {
      await updateVisit(visit.id, { status: "cancelled" });
      message.success("Visita cancelada");
      onClose();
    } catch {
      message.error("Erro ao cancelar visita");
    }
  }

  if (!visit) return null;

  const unit = units.find((u) => u.id === visit.unitId);

  return (
    <Drawer
      title="Detalhes da Visita"
      open={open}
      onClose={onClose}
      width={520}
      extra={
        <Space>
          {visit.status !== "cancelled" && (
            <Popconfirm
              title="Cancelar esta visita?"
              description="O responsável será notificado."
              onConfirm={handleCancel}
              okText="Cancelar Visita"
              cancelText="Fechar"
              okButtonProps={{ danger: true }}
            >
              <Button danger>Cancelar Visita</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Salvar
          </Button>
        </Space>
      }
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Data/Hora">
          {dayjs(visit.visitDateTime as string).format("DD/MM/YYYY [às] HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Unidade">{unit?.name || visit.unitId}</Descriptions.Item>
        <Descriptions.Item label="Nome do Responsável">
          {visit.parentName}
        </Descriptions.Item>
        <Descriptions.Item label="E-mail">{visit.parentEmail}</Descriptions.Item>
        <Descriptions.Item label="Telefone">
          {visit.parentPhone || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Nome da Criança">
          {visit.childName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Idade">{visit.childAge || "-"}</Descriptions.Item>
        <Descriptions.Item label="Série de Interesse">
          {visit.childGradeOfInterest || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Agendado em">
          {dayjs(visit.createdAt as string).format("DD/MM/YYYY HH:mm")}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Form form={form} layout="vertical">
        <Form.Item name="status" label="Status">
          <Select
            options={VISIT_STATUSES.map((s) => ({
              value: s,
              label: VISIT_STATUS_LABELS[s],
            }))}
          />
        </Form.Item>

        <Form.Item name="notes" label="Observações">
          <TextArea
            rows={4}
            placeholder="Notas internas sobre a visita"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
