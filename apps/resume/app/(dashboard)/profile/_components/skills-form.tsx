"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  ChevronDown,
  ChevronUp,
  Code,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useProfileStore } from "../../../../stores/profile-store";
import type { Skill } from "../../../../types/profile";

export function SkillsForm() {
  const { profile, addSkill, updateSkillItem, removeSkill, errors } =
    useProfileStore();

  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const getFieldError = (field: string): string | undefined =>
    errors[field]?.[0];

  const handleAddSkillCategory = () => {
    const newSkillCategory: Skill = {
      id: crypto.randomUUID(),
      category: "",
      items: [],
    };

    addSkill(newSkillCategory);

    // Open the newly added item
    const newIndex = profile.skills.length;
    setOpenItems((prev) => new Set([...prev, newIndex]));
  };

  const handleUpdateSkillCategory = (
    index: number,
    updates: Partial<Skill>
  ) => {
    updateSkillItem(index, updates);
  };

  const handleRemoveSkillCategory = (index: number) => {
    removeSkill(index);
    // Remove from open items
    const newOpenItems = new Set(openItems);
    newOpenItems.delete(index);
    setOpenItems(newOpenItems);
  };

  const handleAddSkillItem = (categoryIndex: number, skillName: string) => {
    if (!skillName.trim()) {
      return;
    }

    const category = profile.skills[categoryIndex];
    const updatedItems = [...category.items, skillName.trim()];
    handleUpdateSkillCategory(categoryIndex, { items: updatedItems });
  };

  const handleRemoveSkillItem = (categoryIndex: number, skillIndex: number) => {
    const category = profile.skills[categoryIndex];
    const updatedItems = category.items.filter((_, i) => i !== skillIndex);
    handleUpdateSkillCategory(categoryIndex, { items: updatedItems });
  };

  const handleSkillKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    categoryIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddSkillItem(categoryIndex, input.value);
      input.value = "";
    }
  };

  const handleBulkSkillsUpdate = (
    categoryIndex: number,
    skillsText: string
  ) => {
    // Parse comma-separated skills
    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    handleUpdateSkillCategory(categoryIndex, { items: skills });
  };

  const getBulkSkillsText = (categoryIndex: number): string => {
    const category = profile.skills[categoryIndex];
    return category.items.join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Existing Skill Categories */}
      {profile.skills.length > 0 && (
        <div className="space-y-4">
          {profile.skills.map((skillCategory, index) => (
            <Card
              className="border-l-4 border-l-green-500"
              key={skillCategory.id || index}
            >
              <Collapsible
                onOpenChange={() => toggleItem(index)}
                open={openItems.has(index)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <Code className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {skillCategory.category || "New Skill Category"}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center space-x-2">
                            {skillCategory.items.length > 0 && (
                              <span className="flex items-center">
                                <Tag className="mr-1 h-3 w-3" />
                                {skillCategory.items.length} skill
                                {skillCategory.items.length !== 1 ? "s" : ""}
                              </span>
                            )}
                            {skillCategory.items.length > 0 && (
                              <span className="text-gray-400 text-xs">
                                {skillCategory.items.slice(0, 3).join(", ")}
                                {skillCategory.items.length > 3 && "..."}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSkillCategory(index);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {openItems.has(index) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`category-${index}`}>
                        Category Name *
                      </Label>
                      <Input
                        className={
                          getFieldError(`skills.${index}.category`)
                            ? "border-red-500"
                            : ""
                        }
                        id={`category-${index}`}
                        onChange={(e) =>
                          handleUpdateSkillCategory(index, {
                            category: e.target.value,
                          })
                        }
                        placeholder="e.g., Programming Languages, Frameworks, Tools"
                        type="text"
                        value={skillCategory.category}
                      />
                      {getFieldError(`skills.${index}.category`) && (
                        <p className="text-red-600 text-sm">
                          {getFieldError(`skills.${index}.category`)}
                        </p>
                      )}
                    </div>

                    {/* Skills Items - Two Input Methods */}
                    <div className="space-y-4">
                      <Label>Skills in this Category</Label>

                      {/* Method 1: Bulk Comma-Separated Input */}
                      <div className="space-y-2">
                        <Label
                          className="font-normal text-sm"
                          htmlFor={`bulk-skills-${index}`}
                        >
                          Comma-separated list:
                        </Label>
                        <Input
                          className="font-mono text-sm"
                          id={`bulk-skills-${index}`}
                          onChange={(e) =>
                            handleBulkSkillsUpdate(index, e.target.value)
                          }
                          placeholder="e.g., React, Vue.js, Angular, Svelte"
                          type="text"
                          value={getBulkSkillsText(index)}
                        />
                        <p className="text-gray-500 text-xs">
                          Type skills separated by commas. Changes save
                          automatically.
                        </p>
                      </div>

                      {/* Method 2: Individual Skill Input */}
                      <div className="space-y-2">
                        <Label
                          className="font-normal text-sm"
                          htmlFor={`single-skill-${index}`}
                        >
                          Or add skills one by one:
                        </Label>
                        <Input
                          id={`single-skill-${index}`}
                          onKeyPress={(e) => handleSkillKeyPress(e, index)}
                          placeholder="Type a skill and press Enter"
                          type="text"
                        />
                        <p className="text-gray-500 text-xs">
                          Press Enter to add each skill individually.
                        </p>
                      </div>

                      {/* Current Skills Display */}
                      {skillCategory.items.length > 0 && (
                        <div className="space-y-2">
                          <Label className="font-normal text-sm">
                            Current skills:
                          </Label>
                          <div className="flex flex-wrap gap-2 rounded-md border bg-gray-50 p-3">
                            {skillCategory.items.map((skill, skillIndex) => (
                              <Badge
                                className="cursor-pointer transition-colors hover:bg-red-100"
                                key={skillIndex}
                                onClick={() =>
                                  handleRemoveSkillItem(index, skillIndex)
                                }
                                variant="secondary"
                              >
                                {skill}
                                <X className="ml-1 h-3 w-3" />
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-500 text-xs">
                            Click on any skill badge to remove it.
                          </p>
                        </div>
                      )}

                      {/* Empty State for Skills */}
                      {skillCategory.items.length === 0 && (
                        <div className="rounded-md border-2 border-gray-200 border-dashed py-8 text-center">
                          <Tag className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-gray-500 text-sm">
                            No skills added to this category yet
                          </p>
                          <p className="mt-1 text-gray-400 text-xs">
                            Use either input method above to add skills
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Add Skill Category Button - Only show when there are existing categories */}
      {profile.skills.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            className="w-full max-w-md"
            onClick={handleAddSkillCategory}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Skill Category
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no skills */}
      {profile.skills.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Code className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
              No skill categories added
            </h3>
            <p className="mb-6 text-gray-600">
              Start organizing your skills by creating categories like
              "Programming Languages", "Frameworks", or "Tools".
            </p>
            <Button onClick={handleAddSkillCategory} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Skill Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
