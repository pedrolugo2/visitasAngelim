import { useState, useCallback } from "react";
import { Table, Button, Space, Typography, Popconfirm, message, Tag, Spin, Alert } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ChatFaq } from "@visitas-angelim/shared";
import { useFaqs } from "../hooks/useFaqs";
import { deleteFaq } from "../../../services/chat.service";
import FaqDrawer from "./FaqDrawer";

const { Title } = Typography;

export default function FaqList() {
  const { faqs, loading, error } = useFaqs();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<ChatFaq | null>(null);

  const handleNewFaq = useCallback(() => {
    setSelectedFaq(null);
    setDrawerOpen(true);
  }, []);

  const handleEditFaq = useCallback((faq: ChatFaq) => {
    setSelectedFaq(faq);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedFaq(null);
  }, []);

  async function handleDeleteFaq(id: string) {
    try {
      await deleteFaq(id);
      message.success("FAQ excluída com sucesso");
    } catch {
      message.error("Erro ao excluir FAQ");
    }
  }

  const columns = [
    {
      title: "Pergunta",
      dataIndex: "question",
      key: "question",
      width: "35%",
    },
    {
      title: "Resposta",
      dataIndex: "answer",
      key: "answer",
      width: "40%",
      render: (text: string) => (
        <div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Palavras-chave",
      dataIndex: "keywords",
      key: "keywords",
      render: (keywords: string[]) =>
        keywords?.map((kw, idx) => (
          <Tag key={idx} style={{ marginBottom: 4 }}>
            {kw}
          </Tag>
        )),
      width: "15%",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: ChatFaq) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditFaq(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir esta FAQ?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteFaq(record.id)}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
      width: "10%",
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Erro ao carregar FAQs"
        description={error.message}
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Perguntas Frequentes (FAQs)
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewFaq}
        >
          Nova FAQ
        </Button>
      </div>

      <Table
        dataSource={faqs}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />

      <FaqDrawer
        open={drawerOpen}
        faq={selectedFaq}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
