"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import type { WorkExperience } from "../../../../../../types/profile";
import { BulletPointsSection } from "./bullet-points-section";

type DraggableWorkExperienceProps = {
  id: string;
  workExperience: WorkExperience;
  index: number;
  onUpdate: (index: number, field: keyof WorkExperience, value: any) => void;
  onDelete: (index: number) => void;
  isOnlyItem: boolean;
};

export function DraggableWorkExperience({
  id,
  workExperience,
  index,
  onUpdate,
  onDelete,
  isOnlyItem,
}: DraggableWorkExperienceProps) {
  const [isOpen, setIsOpen] = useState(index === 0); // First item open by default

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

  // Display text for the header
  const headerText = workExperience.position || "New Position";
  const subHeaderText = workExperience.company
    ? `at ${workExperience.company}`
    : "Add company";

  return (
    <div
      className={`rounded-lg border border-border bg-card/50 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
      ref={setNodeRef}
      style={style}
    >
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        {/* Collapsible Header */}
        <CollapsibleTrigger asChild>
          <div className="group flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50">
            <div className="flex flex-1 items-center gap-3">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                aria-label="Drag to reorder"
                className="cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
                type="button"
              >
                <GripVertical className="h-4 w-4" />
              </button>

              {/* Content Preview */}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-sm">{headerText}</div>
                <div className="truncate text-muted-foreground text-xs">
                  {subHeaderText}
                  {workExperience.date && (
                    <span className="ml-2">• {workExperience.date}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete Button */}
              {!isOnlyItem && (
                <Button
                  className="h-8 w-8 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  size="icon"
                  title="Delete work experience"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              {/* Expand/Collapse Icon */}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Collapsible Content */}
        <CollapsibleContent>
          <div className="space-y-6 border-border/50 border-t px-4 pb-4">
            {/* Position Field */}
            <div className="space-y-2 pt-4">
              <Label
                className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                htmlFor={`position-${index}`}
              >
                Position
              </Label>
              <Input
                className="border-border bg-background font-medium text-base"
                id={`position-${index}`}
                onChange={(e) => onUpdate(index, "position", e.target.value)}
                placeholder="e.g., Senior Front-end Developer"
                value={workExperience.position}
              />
            </div>

            {/* Company and Location Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                  htmlFor={`company-${index}`}
                >
                  Company
                </Label>
                <Input
                  className="border-border bg-background"
                  id={`company-${index}`}
                  onChange={(e) => onUpdate(index, "company", e.target.value)}
                  placeholder="e.g., IBM"
                  value={workExperience.company}
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                  htmlFor={`location-${index}`}
                >
                  Location
                </Label>
                <Input
                  className="border-border bg-background"
                  id={`location-${index}`}
                  onChange={(e) => onUpdate(index, "location", e.target.value)}
                  placeholder="e.g., New York, NY"
                  value={workExperience.location}
                />
              </div>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <Label
                className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                htmlFor={`date-${index}`}
              >
                Date
              </Label>
              <Input
                className="border-border bg-background"
                id={`date-${index}`}
                onChange={(e) => onUpdate(index, "date", e.target.value)}
                placeholder="e.g., June 2019 - Present"
                value={workExperience.date}
              />
              <p className="text-muted-foreground text-xs">
                Use 'Present' in the date field for current positions
              </p>
            </div>

            {/* Key Responsibilities Section */}
            <BulletPointsSection
              bulletPoints={workExperience.description}
              onUpdate={(bulletPoints) =>
                onUpdate(index, "description", bulletPoints)
              }
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
