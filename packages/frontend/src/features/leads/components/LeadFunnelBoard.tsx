import { useState, useCallback } from "react";
import { Button, Spin, Alert, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Lead, LeadStatus } from "@visitas-angelim/shared";
import { LEAD_STATUSES } from "@visitas-angelim/shared";
import { updateLeadStatus } from "../../../services/leads.service";
import { useLeads } from "../hooks/useLeads";
import LeadColumn from "./LeadColumn";
import LeadCard from "./LeadCard";
import LeadDetailDrawer from "./LeadDetailDrawer";

const { Title } = Typography;

export default function LeadFunnelBoard() {
  const { leadsByStatus, leads, loading, error } = useLeads();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeDragLead, setActiveDragLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  }, []);

  const handleNewLead = useCallback(() => {
    setSelectedLead(null);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedLead(null);
  }, []);

  function handleDragStart(event: DragStartEvent) {
    const lead = leads.find((l) => l.id === event.active.id);
    setActiveDragLead(lead ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDragLead(null);

    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Only update if dropped on a different column
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Check if the target is a valid status column
    if (!LEAD_STATUSES.includes(newStatus as LeadStatus)) return;

    try {
      await updateLeadStatus(leadId, newStatus);
    } catch {
      // onSnapshot will revert the UI automatically
    }
  }

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
        message="Erro ao carregar leads"
        description={error.message}
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Funil de Vendas
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewLead}
        >
          Novo Lead
        </Button>
      </div>

      {/* Kanban board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 16,
            height: "calc(100vh - 200px)",
          }}
        >
          {LEAD_STATUSES.map((status) => (
            <LeadColumn
              key={status}
              status={status}
              leads={leadsByStatus[status]}
              onLeadClick={handleLeadClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDragLead ? (
            <LeadCard lead={activeDragLead} onClick={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Detail drawer */}
      <LeadDetailDrawer
        open={drawerOpen}
        lead={selectedLead}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
