"use client";

import { Note } from "@/types/note";
import { formatDistanceToNow } from "@/lib/utils";
import { useMemo } from "react";

type SidebarProps = {
  notes: Note[];
  selectedId: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  onNewNote: () => void;
  loading?: boolean;
};

export default function Sidebar({
  notes,
  selectedId,
  search,
  onSearchChange,
  onSelect,
  onNewNote,
  loading = false,
}: SidebarProps) {
  const countText = useMemo(() => {
    const c = notes.length;
    if (loading) return "Loading…";
    return `${c} note${c === 1 ? "" : "s"}`;
  }, [notes.length, loading]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[var(--color-border)] flex gap-2">
        <input
          className="input w-full"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notes"
        />
        <button className="btn btn-primary" onClick={onNewNote}>
          +
        </button>
      </div>
      <div className="px-4 py-2 text-xs text-slate-500">{countText}</div>
      <div className="overflow-auto">
        {notes.length === 0 && (
          <div className="px-4 py-8 text-sm text-slate-500">
            {loading ? "Loading notes…" : "No notes found."}
          </div>
        )}
        <ul className="space-y-1 px-2 pb-4">
          {notes.map((note) => {
            const isSelected = note.id === selectedId;
            return (
              <li key={note.id}>
                <button
                  onClick={() => onSelect(note.id)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-blue-50"
                      : "border-[var(--color-border)] hover:bg-slate-50"
                  }`}
                >
                  <div className="font-medium truncate">{note.title || "Untitled"}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {note.content || "No content"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Updated {formatDistanceToNow(new Date(note.updatedAt))}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
