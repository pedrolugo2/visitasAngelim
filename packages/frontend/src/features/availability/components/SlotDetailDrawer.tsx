import { useEffect } from "react";
import {
  Drawer,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { AvailabilitySlot } from "@visitas-angelim/shared";
import { useUnits } from "../../../hooks/useUnits";
import {
  createSlot,
  updateSlot,
  deleteSlot,
} from "../../../services/availability.service";

interface SlotDetailDrawerProps {
  open: boolean;
  slot: AvailabilitySlot | null;
  onClose: () => void;
}

export default function SlotDetailDrawer({
  open,
  slot,
  onClose,
}: SlotDetailDrawerProps) {
  const [form] = Form.useForm();
  const { units } = useUnits();
  const isNew = !slot;

  useEffect(() => {
    if (open) {
      if (slot) {
        form.setFieldsValue({
          unitId: slot.unitId,
          startTime: dayjs(slot.startTime as string),
          endTime: dayjs(slot.endTime as string),
          capacity: slot.capacity,
          isBookable: slot.isBookable,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ capacity: 5, isBookable: true });
      }
    }
  }, [open, slot, form]);

  async function handleSave() {
    try {
      const values = await form.validateFields();

      // Validate endTime is after startTime
      if (values.endTime.isBefore(values.startTime)) {
        message.error("Horário de término deve ser após o início");
        return;
      }

      const slotData = {
        unitId: values.unitId,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        capacity: values.capacity,
        isBookable: values.isBookable,
      };

      if (isNew) {
        await createSlot(slotData);
        message.success("Slot criado com sucesso");
      } else {
        await updateSlot(slot.id, slotData);
        message.success("Slot atualizado com sucesso");
      }

      onClose();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Erro ao salvar slot");
    }
  }

  async function handleDelete() {
    if (!slot) return;
    try {
      await deleteSlot(slot.id);
      message.success("Slot excluído");
      onClose();
    } catch {
      message.error("Erro ao excluir slot");
    }
  }

  return (
    <Drawer
      title={isNew ? "Novo Slot" : "Editar Slot"}
      open={open}
      onClose={onClose}
      width={480}
      extra={
        <Space>
          {!isNew && (
            <Popconfirm
              title="Excluir este slot?"
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
          name="unitId"
          label="Unidade"
          rules={[{ required: true, message: "Selecione a unidade" }]}
        >
          <Select
            placeholder="Selecione a unidade"
            options={units.map((u) => ({ value: u.id, label: u.name }))}
          />
        </Form.Item>

        <Form.Item
          name="startTime"
          label="Início"
          rules={[{ required: true, message: "Informe o horário de início" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: "100%" }}
            placeholder="Selecione data e hora"
          />
        </Form.Item>

        <Form.Item
          name="endTime"
          label="Término"
          rules={[{ required: true, message: "Informe o horário de término" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: "100%" }}
            placeholder="Selecione data e hora"
          />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Capacidade"
          rules={[{ required: true, message: "Informe a capacidade" }]}
        >
          <InputNumber
            min={1}
            max={50}
            style={{ width: "100%" }}
            placeholder="Número de vagas"
          />
        </Form.Item>

        <Form.Item
          name="isBookable"
          label="Disponível para reserva"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
