import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Heading1,
  Heading2Icon,
  Italic,
  Strikethrough,
  StrikethroughIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
interface MenubarProps {
  editor: Editor | null;
}
export function Menubar({ editor }: MenubarProps) {
  if (!editor) return null;
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 border-b border-muted pb-2 mb-2">
        <Tooltip>
          <Toggle
            aria-label="Toggle italic"
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Toggle>

          <TooltipContent side="top">Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <Toggle
            aria-label="Toggle italic"
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Toggle>

          <TooltipContent side="top">Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Toggle
            aria-label="Toggle italic"
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikethroughIcon className="h-4 w-4" />
          </Toggle>

          <TooltipContent side="top">Bold</TooltipContent>
        </Tooltip>

        {/* heading */}
        <Tooltip>
          <Toggle
            aria-label="Toggle italic"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              editor.isActive("heading", { level: 1 }) &&
                "bg-muted text-muted-foreground"
            )}
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>

          <TooltipContent side="top">Bold</TooltipContent>
        </Tooltip>

        {/* heading */}
        <Tooltip>
          <Toggle
            aria-label="Toggle italic"
            // pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            // className={cn(
            //   editor.isActive("heading", { level: 2 }) &&
            //     "bg-muted text-muted-foreground"
            // )}
          >
            <Heading2Icon className="h-4 w-4" />
          </Toggle>

          <TooltipContent side="top">Bold</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

{
  /* <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "border rounded-md transition-colors",
                editor.isActive("bold") ? "text-green-500" : "text-red-600"
              )}
            >
              <Bold className="w-4 h-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="top">Bold</TooltipContent>
        </Tooltip> */
}
