import React from "react";
import { StickyNote } from "lucide-react";
import { getStatus, formatRupiah } from "./helpers";

const RoomCard = ({ room, canEdit, onSelect }) => {
  const s = getStatus(room.status);
  return (
    <button
      onClick={() => onSelect(room)}
      className={`relative w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] cursor-pointer ${s.color} ${canEdit ? "hover:ring-2 " + s.ring : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xl font-extrabold leading-none">{room.room_number}</p>
          <p className="text-[10px] opacity-60 mt-0.5">Lantai {room.floor}</p>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${s.badge}`}>
          {s.label}
        </span>
      </div>
      <p className="text-[11px] font-semibold opacity-80 truncate">
        {room.room_type?.name || "-"}
      </p>
      <p className="text-[10px] opacity-50 mt-0.5">
        {formatRupiah(room.room_type?.base_price)}/malam
      </p>
      {room.notes && (
        <div className="absolute bottom-3 right-3 opacity-40">
          <StickyNote className="h-3.5 w-3.5" />
        </div>
      )}
    </button>
  );
};

export default RoomCard;
