"use client";

import { Note } from "@/types/note";

type EditorProps = {
  note: Note;
  onChangeTitle: (title: string) => void;
  onChangeContent: (content: string) => void;
};

export default function Editor({
  note,
  onChangeTitle,
  onChangeContent,
}: EditorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <input
        className="editor-title mb-3"
        value={note.title}
        onChange={(e) => onChangeTitle(e.target.value)}
        placeholder="Title"
        aria-label="Note title"
      />
      <div className="separator mb-3" />
      <textarea
        className="editor-content"
        rows={20}
        value={note.content}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder="Write your note here..."
        aria-label="Note content"
      />
    </div>
  );
}
