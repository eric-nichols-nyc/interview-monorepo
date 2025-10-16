"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import type { Skill } from "../../../../../../types/profile";
import { DraggableSkillItem } from "./draggable-skill-item";

type DraggableSkillCategoryProps = {
  id: string;
  skillCategory: Skill;
  index: number;
  onUpdate: (index: number, field: keyof Skill, value: any) => void;
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
  const [isOpen, setIsOpen] = useState(index === 0); // First item open by default
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

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
  const subHeaderText = `${itemCount} skill${itemCount !== 1 ? 's' : ''}`;

  // Get all available skills from profile (flattened)
  const allProfileSkills = availableProfileSkills.flatMap(skill => skill.items);
  const currentSkills = skillCategory.items || [];
  const availableSkills = allProfileSkills.filter(skill => !currentSkills.includes(skill));

  const toggleSkillSelection = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
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
    const updatedItems = (skillCategory.items || []).filter((_, i) => i !== skillIndex);
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
      ref={setNodeRef}
      style={style}
      className={`border border-border rounded-lg bg-card/50 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Collapsible Header */}
        <CollapsibleTrigger asChild>
          <div className="group flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 flex-1">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab text-muted-foreground hover:text-foreground transition-colors active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
                type="button"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              
              {/* Content Preview */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {headerText}
                </div>
                <div className="text-muted-foreground text-xs truncate">
                  {subHeaderText}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Import Button */}
              <Popover open={isImportOpen} onOpenChange={setIsImportOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-accent/10 hover:text-accent"
                    onClick={(e) => e.stopPropagation()}
                    size="icon"
                    variant="ghost"
                    title="Import skills from profile"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Import Skills from Profile</h3>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {availableSkills.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No new skills available to import</p>
                      ) : (
                        availableSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedSkills.includes(skill)}
                              id={`skill-${skill}`}
                              onCheckedChange={() => toggleSkillSelection(skill)}
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
                        onClick={handleImportSkills}
                        disabled={selectedSkills.length === 0}
                      >
                        Import {selectedSkills.length} Skill{selectedSkills.length !== 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Delete Button */}
              {!isOnlyItem && (
                <Button
                  className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  size="icon"
                  variant="ghost"
                  title="Delete category"
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
          <div className="px-4 pb-4 space-y-6 border-t border-border/50">
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
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Existing Skills */}
              {skillCategory.items && skillCategory.items.length > 0 && (
                <DraggableSkillItem
                  skills={skillCategory.items}
                  onUpdate={updateSkillItem}
                  onDelete={deleteSkillItem}
                  onReorder={reorderSkills}
                />
              )}

              {/* Add New Skill */}
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Add a new skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addNewSkill();
                    }
                  }}
                />
                <Button
                  onClick={addNewSkill}
                  disabled={!newSkill.trim()}
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