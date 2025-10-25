"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar2 from "./menu-bar";

export function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing here...</p>", // ✅ give it some initial content
    immediatelyRender: false, // ✅ prevent SSR hydration issues
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md p-4">
      <MenuBar2 editor={editor} />

      {/* ✅ this actually renders the TipTap editable area */}
      <EditorContent
        editor={editor}
        // className="prose prose-sm mt-2 p-2 border rounded-md focus:outline-none min-h-[200px]"
      />
    </div>
  );
}
