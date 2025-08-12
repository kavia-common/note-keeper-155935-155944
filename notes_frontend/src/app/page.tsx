"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import { Note } from "@/types/note";
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from "@/lib/api";
import { debounce } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  // Load notes on mount
  useEffect(() => {
    let active = true;
    setLoading(true);
    listNotes()
      .then((data) => {
        if (!active) return;
        setNotes(data);
        // Select the most recent note by updatedAt if available
        if (data.length > 0) {
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setSelectedId(sorted[0].id);
        } else {
          setSelectedId(null);
        }
      })
      .catch((e) => {
        console.error(e);
        setError(
          "Failed to load notes. Please check your API or network connection."
        );
      })
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Debounced save to reduce API traffic while editing
  const debouncedSave = useRef(
    debounce(async (note: Note) => {
      try {
        setSaveState("saving");
        const updated = await updateNote(note.id, {
          title: note.title,
          content: note.content,
        });
        // merge returned server timestamps
        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, ...updated } : n))
        );
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 800);
      } catch (e) {
        console.error(e);
        setSaveState("error");
      }
    }, 450)
  ).current;

  const handleNewNote = useCallback(async () => {
    setError(null);
    try {
      const created = await createNote({
        title: "Untitled",
        content: "",
      });
      setNotes((prev) => [created, ...prev]);
      setSelectedId(created.id);
    } catch (e) {
      console.error(e);
      setError("Failed to create note.");
    }
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      // Select next available note
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    } catch (e) {
      console.error(e);
      setError("Failed to delete note.");
    }
  }, [notes]);

  const handleChange = useCallback(
    (patch: Partial<Note>) => {
      if (!selectedNote) return;
      const updatedLocal = { ...selectedNote, ...patch } as Note;
      setNotes((prev) =>
        prev.map((n) => (n.id === selectedNote.id ? updatedLocal : n))
      );
      debouncedSave(updatedLocal);
    },
    [selectedNote, debouncedSave]
  );

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.trim().toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <main className="container-app">
      {/* Sidebar */}
      <aside className="border-r border-[var(--color-border)] bg-white">
        <Sidebar
          notes={filteredNotes}
          selectedId={selectedId}
          search={search}
          onSearchChange={setSearch}
          onSelect={handleSelect}
          onNewNote={handleNewNote}
          loading={loading}
        />
      </aside>

      {/* Editor Area */}
      <section className="bg-white">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Note Keeper</span>
              <span className="badge">
                <span
                  className={`h-2 w-2 rounded-full ${
                    saveState === "saving"
                      ? "bg-yellow-500"
                      : saveState === "saved"
                      ? "bg-emerald-500"
                      : saveState === "error"
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                />
                {saveState === "saving"
                  ? "Saving..."
                  : saveState === "saved"
                  ? "Saved"
                  : saveState === "error"
                  ? "Error"
                  : "Idle"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary" onClick={handleNewNote}>
                New note
              </button>
              {selectedNote && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedNote.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-b border-red-200">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-auto p-4">
            {selectedNote ? (
              <Editor
                key={selectedNote.id}
                note={selectedNote}
                onChangeTitle={(title) => handleChange({ title })}
                onChangeContent={(content) => handleChange({ content })}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <p className="text-lg">No note selected</p>
                  <p className="text-sm mt-1">
                    Create a new note or select one from the sidebar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
