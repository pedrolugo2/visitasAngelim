import { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Select,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import type { ChatFaq } from "@visitas-angelim/shared";
import {
  createFaq,
  updateFaq,
  deleteFaq,
} from "../../../services/chat.service";

const { TextArea } = Input;

interface FaqDrawerProps {
  open: boolean;
  faq: ChatFaq | null;
  onClose: () => void;
}

export default function FaqDrawer({
  open,
  faq,
  onClose,
}: FaqDrawerProps) {
  const [form] = Form.useForm();
  const isNew = !faq;

  useEffect(() => {
    if (open) {
      if (faq) {
        form.setFieldsValue(faq);
      } else {
        form.resetFields();
      }
    }
  }, [open, faq, form]);

  async function handleSave() {
    try {
      const values = await form.validateFields();

      if (isNew) {
        await createFaq(values);
        message.success("FAQ criada com sucesso");
      } else {
        await updateFaq(faq.id, values);
        message.success("FAQ atualizada com sucesso");
      }

      onClose();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Erro ao salvar FAQ");
    }
  }

  async function handleDelete() {
    if (!faq) return;
    try {
      await deleteFaq(faq.id);
      message.success("FAQ excluída");
      onClose();
    } catch {
      message.error("Erro ao excluir FAQ");
    }
  }

  return (
    <Drawer
      title={isNew ? "Nova FAQ" : "Editar FAQ"}
      open={open}
      onClose={onClose}
      width={520}
      extra={
        <Space>
          {!isNew && (
            <Popconfirm
              title="Excluir esta FAQ?"
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
          name="question"
          label="Pergunta"
          rules={[{ required: true, message: "Pergunta é obrigatória" }]}
        >
          <TextArea
            rows={2}
            placeholder="Ex: Qual o horário de funcionamento da escola?"
          />
        </Form.Item>

        <Form.Item
          name="answer"
          label="Resposta"
          rules={[{ required: true, message: "Resposta é obrigatória" }]}
        >
          <TextArea
            rows={4}
            placeholder="Digite a resposta automática que será enviada"
          />
        </Form.Item>

        <Form.Item
          name="keywords"
          label="Palavras-chave"
          help="Palavras ou frases que acionam esta resposta automática"
        >
          <Select
            mode="tags"
            placeholder="Digite as palavras-chave e pressione Enter"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
