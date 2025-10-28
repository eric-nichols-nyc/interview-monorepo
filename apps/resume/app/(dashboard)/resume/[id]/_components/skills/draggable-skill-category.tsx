"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@repo/design-system/components/ui/button";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { ChevronDown, GripVertical, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { Skill } from "../../../../../../types/profile";
import { DraggableSkillItem } from "./draggable-skill-item";

type DraggableSkillCategoryProps = {
  id: string;
  skillCategory: Skill;
  index: number;
  onUpdate: (
    index: number,
    field: keyof Skill,
    value: string | string[]
  ) => void;
  onDelete: (index: number) => void;
  isOnlyItem: boolean;
  availableProfileSkills: Skill[];
  onImportSkills: (categoryIndex: number, skillsToImport: string[]) => void;
};

export function DraggableSkillCategory({
  id,
  skillCategory,
  index,
  onUpdate,
  onDelete,
  isOnlyItem,
  availableProfileSkills,
  onImportSkills,
}: DraggableSkillCategoryProps) {
  // Open by default if it's the first item OR if it's a new empty category
  const isNewCategory =
    !skillCategory.category &&
    (!skillCategory.items || skillCategory.items.length === 0);
  const [isOpen, setIsOpen] = useState(index === 0 || isNewCategory);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Auto-open newly created categories
  useEffect(() => {
    if (isNewCategory) {
      setIsOpen(true);
    }
  }, [isNewCategory]);

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
  const headerText = skillCategory.category || "New Category";
  const itemCount = skillCategory.items?.length || 0;
  const subHeaderText = `${itemCount} skill${itemCount !== 1 ? "s" : ""}`;

  // Get all available skills from profile (flattened)
  const allProfileSkills = availableProfileSkills.flatMap(
    (skill) => skill.items
  );
  const currentSkills = skillCategory.items || [];
  const availableSkills = allProfileSkills.filter(
    (skill) => !currentSkills.includes(skill)
  );

  const toggleSkillSelection = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleImportSkills = () => {
    if (selectedSkills.length > 0) {
      onImportSkills(index, selectedSkills);
      setSelectedSkills([]);
      setIsImportOpen(false);
    }
  };

  const addNewSkill = () => {
    if (newSkill.trim()) {
      const updatedItems = [...(skillCategory.items || []), newSkill.trim()];
      onUpdate(index, "items", updatedItems);
      setNewSkill("");
    }
  };

  const updateSkillItem = (skillIndex: number, value: string) => {
    const updatedItems = [...(skillCategory.items || [])];
    updatedItems[skillIndex] = value;
    onUpdate(index, "items", updatedItems);
  };

  const deleteSkillItem = (skillIndex: number) => {
    const updatedItems = (skillCategory.items || []).filter(
      (_, i) => i !== skillIndex
    );
    onUpdate(index, "items", updatedItems);
  };

  const reorderSkills = (oldIndex: number, newIndex: number) => {
    const items = [...(skillCategory.items || [])];
    const [reorderedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, reorderedItem);
    onUpdate(index, "items", items);
  };

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
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Import Button */}
              <Popover onOpenChange={setIsImportOpen} open={isImportOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="h-8 w-8 text-muted-foreground opacity-0 transition-all hover:bg-accent/10 hover:text-accent group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                    size="icon"
                    title="Import skills from profile"
                    variant="ghost"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">
                      Import Skills from Profile
                    </h3>
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {availableSkills.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No new skills available to import
                        </p>
                      ) : (
                        availableSkills.map((skill) => (
                          <div
                            className="flex items-center space-x-2"
                            key={skill}
                          >
                            <Checkbox
                              checked={selectedSkills.includes(skill)}
                              id={`skill-${skill}`}
                              onCheckedChange={() =>
                                toggleSkillSelection(skill)
                              }
                            />
                            <label
                              className="cursor-pointer text-sm leading-none"
                              htmlFor={`skill-${skill}`}
                            >
                              {skill}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {availableSkills.length > 0 && (
                      <Button
                        className="w-full"
                        disabled={selectedSkills.length === 0}
                        onClick={handleImportSkills}
                      >
                        Import {selectedSkills.length} Skill
                        {selectedSkills.length !== 1 ? "s" : ""}
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Delete Button */}
              {!isOnlyItem && (
                <Button
                  className="h-8 w-8 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  size="icon"
                  title="Delete category"
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
            {/* Category Name Field */}
            <div className="space-y-2 pt-4">
              <Label
                className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                htmlFor={`category-${index}`}
              >
                Category Name
              </Label>
              <Input
                className="border-border bg-background font-medium text-base"
                id={`category-${index}`}
                onChange={(e) => onUpdate(index, "category", e.target.value)}
                placeholder="e.g., Programming Languages"
                value={skillCategory.category}
              />
            </div>

            {/* Skills List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Skills
                </Label>
                <span className="text-muted-foreground text-xs">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Existing Skills */}
              {skillCategory.items && skillCategory.items.length > 0 && (
                <DraggableSkillItem
                  onDelete={deleteSkillItem}
                  onReorder={reorderSkills}
                  onUpdate={updateSkillItem}
                  skills={skillCategory.items}
                />
              )}

              {/* Add New Skill */}
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addNewSkill();
                    }
                  }}
                  placeholder="Add a new skill..."
                  value={newSkill}
                />
                <Button
                  disabled={!newSkill.trim()}
                  onClick={addNewSkill}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
