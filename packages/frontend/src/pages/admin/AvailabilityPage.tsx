import { Tabs } from "antd";
import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import SlotList from "../../features/availability/components/SlotList";
import TeacherAvailabilityList from "../../features/availability/components/TeacherAvailabilityList";

export default function AvailabilityPage() {
  return (
    <Tabs
      items={[
        {
          key: "slots",
          label: (
            <span>
              <CalendarOutlined /> Slots de Disponibilidade
            </span>
          ),
          children: <SlotList />,
        },
        {
          key: "teachers",
          label: (
            <span>
              <TeamOutlined /> Disponibilidade de Professores
            </span>
          ),
          children: <TeacherAvailabilityList />,
        },
      ]}
    />
  );
}
