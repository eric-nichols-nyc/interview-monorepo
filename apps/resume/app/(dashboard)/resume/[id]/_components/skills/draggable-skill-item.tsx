"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { GripVertical, Trash2 } from "lucide-react";

type DraggableSkillItemProps = {
  skills: string[];
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
};

type SingleSkillItemProps = {
  id: string;
  skill: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
};

function SingleSkillItem({
  id,
  skill,
  index,
  onUpdate,
  onDelete,
}: SingleSkillItemProps) {
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
      className={`group flex items-center gap-2 rounded border border-border bg-background p-2 transition-colors hover:border-primary/50 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
      ref={setNodeRef}
      style={style}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Input
        className="flex-1 border-none bg-transparent p-0 text-sm focus-visible:ring-0"
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder="Enter skill name..."
        value={skill}
      />

      <Button
        className="h-6 w-6 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        onClick={() => onDelete(index)}
        size="icon"
        title="Delete skill"
        variant="ghost"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function DraggableSkillItem({
  skills,
  onUpdate,
  onDelete,
  onReorder,
}: DraggableSkillItemProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const skillIds = skills.map((_, index) => `skill-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skillIds.indexOf(active.id as string);
      const newIndex = skillIds.indexOf(over.id as string);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={skillIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <SingleSkillItem
              id={skillIds[index]}
              index={index}
              key={skillIds[index]}
              onDelete={onDelete}
              onUpdate={onUpdate}
              skill={skill}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
