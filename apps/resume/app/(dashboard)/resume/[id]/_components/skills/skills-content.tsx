"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { Plus, RefreshCw, Upload } from "lucide-react";
import { useProfile } from "../../../../../../hooks/queries/profile-queries";
import {
  useResumeEditorStore,
  useResumeSkills,
} from "../../../../../../stores/resume-editor-store";
import type { Skill } from "../../../../../../types/profile";
import { DraggableSkillCategory } from "./draggable-skill-category";

export function SkillsContent() {
  const skills = useResumeSkills();
  const updateSkills = useResumeEditorStore((state) => state.updateSkills);
  const { data: profile, isLoading: profileLoading } = useProfile();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const skillCategoryIds = skills.map((_, index) => `category-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skillCategoryIds.indexOf(active.id as string);
      const newIndex = skillCategoryIds.indexOf(over.id as string);
      
      const reorderedSkills = arrayMove(skills, oldIndex, newIndex) as Skill[];
      updateSkills(reorderedSkills);
    }
  };

  // Add new skill category
  const addNewCategory = () => {
    const newCategory: Skill = {
      id: Date.now().toString(),
      category: "",
      items: [],
    };
    const updatedSkills = [...skills, newCategory];
    updateSkills(updatedSkills);
  };

  // Update a specific skill category
  const updateSkillCategory = (
    index: number,
    field: keyof Skill,
    value: any
  ) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    };
    updateSkills(updatedSkills);
  };

  // Delete skill category
  const deleteSkillCategory = (index: number) => {
    if (skills.length <= 1) {
      return; // Keep at least one
    }
    const updatedSkills = skills.filter(
      (_: Skill, i: number) => i !== index
    );
    updateSkills(updatedSkills);
  };

  // Import skills into a specific category
  const importSkillsToCategory = (categoryIndex: number, skillsToImport: string[]) => {
    const updatedSkills = [...skills];
    const currentItems = updatedSkills[categoryIndex].items || [];
    // Add new skills, avoiding duplicates
    const uniqueNewSkills = skillsToImport.filter(skill => !currentItems.includes(skill));
    updatedSkills[categoryIndex] = {
      ...updatedSkills[categoryIndex],
      items: [...currentItems, ...uniqueNewSkills],
    };
    updateSkills(updatedSkills);
  };

  // Import all skills from profile
  const importAllFromProfile = () => {
    if (profile?.skills?.length) {
      updateSkills(profile.skills);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          className="border-primary bg-transparent text-primary hover:bg-primary/10"
          onClick={addNewCategory}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
        <Button
          className="border-border bg-transparent"
          disabled={profileLoading || !profile?.skills?.length}
          onClick={importAllFromProfile}
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

      {/* Drag and Drop Skill Categories List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={skillCategoryIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {skills.map((skillCategory, index) => (
              <DraggableSkillCategory
                key={skillCategoryIds[index]}
                id={skillCategoryIds[index]}
                skillCategory={skillCategory}
                index={index}
                onUpdate={updateSkillCategory}
                onDelete={deleteSkillCategory}
                isOnlyItem={skills.length === 1}
                availableProfileSkills={profile?.skills || []}
                onImportSkills={importSkillsToCategory}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Help Text */}
      {skills.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          <p>No skill categories added yet.</p>
          <p>Click "Add Category" to get started.</p>
        </div>
      )}
    </div>
  );
}
