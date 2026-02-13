import { Tabs } from "antd";
import { CalendarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import VisitCalendar from "../../features/visits/components/VisitCalendar";
import VisitTable from "../../features/visits/components/VisitTable";

export default function VisitsPage() {
  return (
    <Tabs
      items={[
        {
          key: "calendar",
          label: (
            <span>
              <CalendarOutlined /> Calendário
            </span>
          ),
          children: <VisitCalendar />,
        },
        {
          key: "list",
          label: (
            <span>
              <UnorderedListOutlined /> Lista
            </span>
          ),
          children: <VisitTable />,
        },
      ]}
    />
  );
}
