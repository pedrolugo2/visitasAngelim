import { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message, Alert, Modal, Card } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const { Title, Text } = Typography;

/** Map Firebase Auth error codes to user-friendly messages in Portuguese */
function getAuthErrorMessage(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? (err as { code: string }).code
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha inválidos.";
    case "auth/invalid-email":
      return "Formato de e-mail inválido.";
    case "auth/user-disabled":
      return "Esta conta foi desativada. Entre em contato com o administrador.";
    case "auth/too-many-requests":
      return "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.";
    case "auth/network-request-failed":
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    default:
      return "Erro ao realizar login. Tente novamente.";
  }
}

function getResetPasswordErrorMessage(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? (err as { code: string }).code
      : "";

  switch (code) {
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "E-mail não encontrado.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    case "auth/network-request-failed":
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    default:
      return "Erro ao enviar e-mail de recuperação. Tente novamente.";
  }
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn, resetPassword, error: authError } = useAuth();

  // Show error when user authenticates but is not in the admins collection
  useEffect(() => {
    if (authError?.message === "Usuário não autorizado") {
      message.error("Você não tem permissão para acessar o painel administrativo.");
    }
  }, [authError]);

  async function handleLogin(values: { email: string; password: string }) {
    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      navigate("/admin", { replace: true });
    } catch (err) {
      message.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword() {
    try {
      const values = await resetForm.validateFields();
      setResetSubmitting(true);
      await resetPassword(values.email);
      message.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setResetModalOpen(false);
      resetForm.resetFields();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(getResetPasswordErrorMessage(err));
    } finally {
      setResetSubmitting(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#FDF8F0",
        padding: 24,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 400 }} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={3} style={{ margin: 0, color: "#3E2723" }}>
            Escola Angelim
          </Title>
          <Text type="secondary">Painel Administrativo</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Informe seu e-mail" },
              { type: "email", message: "E-mail inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="E-mail"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Informe sua senha" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={submitting}
            >
              Entrar
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button type="link" onClick={() => setResetModalOpen(true)}>
              Esqueci minha senha
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        title="Recuperar senha"
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onOk={handleResetPassword}
        okText="Enviar"
        cancelText="Cancelar"
        confirmLoading={resetSubmitting}
      >
        <Form form={resetForm} layout="vertical">
          <Form.Item
            name="email"
            label="E-mail cadastrado"
            rules={[
              { required: true, message: "Informe seu e-mail" },
              { type: "email", message: "E-mail inválido" },
            ]}
          >
            <Input placeholder="email@exemplo.com" autoComplete="email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
