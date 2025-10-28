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
import { Plus, RefreshCw, Upload } from "lucide-react";
import { useProfile } from "../../../../../../hooks/queries/profile-queries";
import {
  useResumeEditorStore,
  useResumeWorkExperience,
} from "../../../../../../stores/resume-editor-store";
import type { WorkExperience } from "../../../../../../types/profile";
import { DraggableWorkExperience } from "./draggable-work-experience";

export function WorkContent() {
  const workExperiences = useResumeWorkExperience();
  const updateWorkExperience = useResumeEditorStore(
    (state) => state.updateWorkExperience
  );
  const { data: profile, isLoading: profileLoading } = useProfile();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const workExperienceIds = workExperiences.map((_, index) => `work-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = workExperienceIds.indexOf(active.id as string);
      const newIndex = workExperienceIds.indexOf(over.id as string);

      const reorderedExperiences = arrayMove(
        workExperiences,
        oldIndex,
        newIndex
      ) as WorkExperience[];
      updateWorkExperience(reorderedExperiences);
    }
  };

  // Add new work experience
  const addNewExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      date: "",
      description: [],
      technologies: [],
    };
    const updatedExperiences = [...workExperiences, newExperience];
    updateWorkExperience(updatedExperiences);
  };

  // Update a specific work experience
  const updateWorkExperienceItem = (
    index: number,
    field: keyof WorkExperience,
    value: any
  ) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    updateWorkExperience(updatedExperiences);
  };

  // Delete work experience
  const deleteWorkExperience = (index: number) => {
    if (workExperiences.length <= 1) {
      return; // Keep at least one
    }
    const updatedExperiences = workExperiences.filter(
      (_: WorkExperience, i: number) => i !== index
    );
    updateWorkExperience(updatedExperiences);
  };

  // Import from profile
  const importFromProfile = () => {
    if (profile?.workExperience?.length) {
      updateWorkExperience(profile.workExperience);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          className="border-primary bg-transparent text-primary hover:bg-primary/10"
          onClick={addNewExperience}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Work Experience
        </Button>
        <Button
          className="border-border bg-transparent"
          disabled={profileLoading || !profile?.workExperience?.length}
          onClick={importFromProfile}
          variant="outline"
        >
          {profileLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Import from Profile
        </Button>
      </div>

      {/* Drag and Drop Work Experience List */}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={workExperienceIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {workExperiences.map((workExperience, index) => (
              <DraggableWorkExperience
                id={workExperienceIds[index]}
                index={index}
                isOnlyItem={workExperiences.length === 1}
                key={workExperienceIds[index]}
                onDelete={deleteWorkExperience}
                onUpdate={updateWorkExperienceItem}
                workExperience={workExperience}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Help Text */}
      {workExperiences.length === 0 && (
        <div className="py-8 text-center text-muted-foreground text-sm">
          <p>No work experience added yet.</p>
          <p>Click "Add Work Experience" to get started.</p>
        </div>
      )}
    </div>
  );
}
