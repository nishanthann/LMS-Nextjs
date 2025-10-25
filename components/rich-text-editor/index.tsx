"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },

        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "custom-heading",
        },
      }),
    ],
    content:
      field?.value && field.value !== ""
        ? JSON.parse(field.value)
        : "<p>Hello world 🖐🖐</p>",

    immediatelyRender: false, // ✅ prevent SSR hydration issues
    editorProps: {
      attributes: {
        class: "min-h-[300px] border rounded-md  py-2 px-3 !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());

      field.onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
