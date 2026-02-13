import { Tabs } from "antd";
import { MessageOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import ChatSessionList from "../../features/chat/components/ChatSessionList";
import FaqList from "../../features/chat/components/FaqList";

export default function ChatPage() {
  return (
    <Tabs
      items={[
        {
          key: "conversations",
          label: (
            <span>
              <MessageOutlined /> Conversas
            </span>
          ),
          children: <ChatSessionList />,
        },
        {
          key: "faqs",
          label: (
            <span>
              <QuestionCircleOutlined /> FAQs
            </span>
          ),
          children: <FaqList />,
        },
      ]}
    />
  );
}
