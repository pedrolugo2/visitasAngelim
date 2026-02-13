import { Badge } from "antd";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Lead, LeadStatus } from "@visitas-angelim/shared";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@visitas-angelim/shared";
import LeadCard from "./LeadCard";

interface LeadColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export default function LeadColumn({ status, leads, onLeadClick }: LeadColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const color = LEAD_STATUS_COLORS[status];

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: "1 1 0",
        minWidth: 240,
        maxWidth: 320,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: "10px 12px",
          borderRadius: "8px 8px 0 0",
          borderTop: `3px solid ${color}`,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13, color: "#3E2723" }}>
          {LEAD_STATUS_LABELS[status]}
        </span>
        <Badge
          count={leads.length}
          style={{ backgroundColor: color }}
          overflowCount={99}
        />
      </div>

      {/* Card list */}
      <div
        style={{
          flex: 1,
          padding: 8,
          background: isOver ? `${color}15` : "#f9f5ef",
          borderRadius: "0 0 8px 8px",
          overflowY: "auto",
          transition: "background 200ms ease",
          minHeight: 120,
        }}
      >
        <SortableContext
          items={leads.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={onLeadClick} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 24,
              color: "#b0a090",
              fontSize: 13,
            }}
          >
            Nenhum lead
          </div>
        )}
      </div>
    </div>
  );
}
