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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@repo/design-system/components/ui/button";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DraggableBulletPoint } from "./draggable-bullet-point";

type BulletPointsSectionProps = {
  bulletPoints: string[];
  onUpdate: (bulletPoints: string[]) => void;
};

export function BulletPointsSection({
  bulletPoints,
  onUpdate,
}: BulletPointsSectionProps) {
  const [newBulletPoint, setNewBulletPoint] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const bulletPointIds = bulletPoints.map((_, index) => `bullet-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = bulletPointIds.indexOf(active.id as string);
      const newIndex = bulletPointIds.indexOf(over.id as string);

      const reorderedBulletPoints = arrayMove(bulletPoints, oldIndex, newIndex);
      onUpdate(reorderedBulletPoints);
    }
  };

  const addBulletPoint = () => {
    if (!newBulletPoint.trim()) {
      return;
    }
    const updatedBulletPoints = [...bulletPoints, newBulletPoint.trim()];
    onUpdate(updatedBulletPoints);
    setNewBulletPoint("");
  };

  const deleteBulletPoint = (index: number) => {
    const updatedBulletPoints = bulletPoints.filter((_, i) => i !== index);
    onUpdate(updatedBulletPoints);
  };

  const updateBulletPoint = (index: number, text: string) => {
    const updatedBulletPoints = [...bulletPoints];
    updatedBulletPoints[index] = text;
    onUpdate(updatedBulletPoints);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-sm">
        Key Responsibilities & Achievements
      </h3>

      {/* Existing bullet points with drag and drop */}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={bulletPointIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {bulletPoints.map((bulletPoint, index) => (
              <DraggableBulletPoint
                bulletPoint={bulletPoint}
                id={bulletPointIds[index]}
                index={index}
                key={bulletPointIds[index]}
                onDelete={deleteBulletPoint}
                onUpdate={updateBulletPoint}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add new bullet point */}
      <div className="rounded-lg border border-border border-dashed bg-card/50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <Textarea
            className="min-h-[60px] flex-1 resize-none border-none bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            onChange={(e) => setNewBulletPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addBulletPoint();
              }
            }}
            placeholder="Add a new responsibility or achievement..."
            value={newBulletPoint}
          />
        </div>
        {newBulletPoint.trim() && (
          <div className="mt-3 flex justify-end">
            <Button className="h-8" onClick={addBulletPoint} size="sm">
              <Plus className="mr-1 h-3 w-3" />
              Add Point
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
