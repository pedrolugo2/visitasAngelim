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

const hourOptions = Array.from({ length: 14 }, (_, i) => {
  const h = i + 7;
  return { value: h, label: `${String(h).padStart(2, "0")}:00` };
});

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
        const start = dayjs(slot.startTime as string);
        const end = dayjs(slot.endTime as string);
        form.setFieldsValue({
          unitId: slot.unitId,
          startDate: start,
          startHour: start.hour(),
          endDate: end,
          endHour: end.hour(),
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

      const startTime = values.startDate.hour(values.startHour).minute(0).second(0);
      const endTime = values.endDate.hour(values.endHour).minute(0).second(0);

      if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
        message.error("Horário de término deve ser após o início");
        return;
      }

      const slotData = {
        unitId: values.unitId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
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

        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            name="startDate"
            label="Data de início"
            rules={[{ required: true, message: "Informe a data" }]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Data"
            />
          </Form.Item>
          <Form.Item
            name="startHour"
            label="Hora"
            rules={[{ required: true, message: "Informe a hora" }]}
            style={{ width: 120 }}
          >
            <Select placeholder="Hora" options={hourOptions} />
          </Form.Item>
        </Space.Compact>

        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            name="endDate"
            label="Data de término"
            rules={[{ required: true, message: "Informe a data" }]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Data"
            />
          </Form.Item>
          <Form.Item
            name="endHour"
            label="Hora"
            rules={[{ required: true, message: "Informe a hora" }]}
            style={{ width: 120 }}
          >
            <Select placeholder="Hora" options={hourOptions} />
          </Form.Item>
        </Space.Compact>

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
