"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Sparkles, Trash2 } from "lucide-react";

type DraggableBulletPointProps = {
  id: string;
  bulletPoint: string;
  index: number;
  onUpdate: (index: number, text: string) => void;
  onDelete: (index: number) => void;
};

export function DraggableBulletPoint({
  id,
  bulletPoint,
  index,
  onUpdate,
  onDelete,
}: DraggableBulletPointProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="mt-1 cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        type="button"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <Textarea
        className="min-h-[60px] flex-1 resize-none border-none bg-transparent p-0 text-sm leading-relaxed focus-visible:ring-0"
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder="Describe your responsibility or achievement..."
        value={bulletPoint}
      />
      <div className="flex items-center gap-2">
        <Button
          className="h-8 w-8 text-muted-foreground opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
          onClick={() => onDelete(index)}
          size="icon"
          title="Delete bullet point"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          className="h-8 w-8 text-accent opacity-100 transition-all hover:bg-accent/10 hover:text-accent/80 md:opacity-0 md:group-hover:opacity-100"
          disabled
          size="icon"
          title="AI enhancement (coming soon)"
          variant="ghost"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}