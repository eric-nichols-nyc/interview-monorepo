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
import { Textarea } from "@repo/design-system/components/ui/textarea";
import {
  Building,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useProfileStore } from "../../../../stores/profile-store";
import type { WorkExperience } from "../../../../types/profile";

export function WorkExperienceForm() {
  const {
    profile,
    updateWorkExperience,
    addWorkExperience,
    updateWorkExperienceItem,
    removeWorkExperience,
    errors,
  } = useProfileStore();

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

  const handleAddWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      date: "",
      description: [""],
      technologies: [],
    };

    addWorkExperience(newExperience);

    // Open the newly added item
    const newIndex = profile.workExperience.length;
    setOpenItems((prev) => new Set([...prev, newIndex]));
  };

  const handleUpdateExperience = (
    index: number,
    updates: Partial<WorkExperience>
  ) => {
    updateWorkExperienceItem(index, updates);
  };

  const handleRemoveExperience = (index: number) => {
    removeWorkExperience(index);
    // Remove from open items
    const newOpenItems = new Set(openItems);
    newOpenItems.delete(index);
    setOpenItems(newOpenItems);
  };

  const handleAddDescriptionBullet = (experienceIndex: number) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedDescription = [...experience.description, ""];
    handleUpdateExperience(experienceIndex, {
      description: updatedDescription,
    });
  };

  const handleUpdateDescriptionBullet = (
    experienceIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedDescription = [...experience.description];
    updatedDescription[bulletIndex] = value;
    handleUpdateExperience(experienceIndex, {
      description: updatedDescription,
    });
  };

  const handleRemoveDescriptionBullet = (
    experienceIndex: number,
    bulletIndex: number
  ) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedDescription = experience.description.filter(
      (_, i) => i !== bulletIndex
    );
    handleUpdateExperience(experienceIndex, {
      description: updatedDescription,
    });
  };

  const handleAddTechnology = (experienceIndex: number, technology: string) => {
    if (!technology.trim()) {
      return;
    }

    const experience = profile.workExperience[experienceIndex];
    const updatedTechnologies = [...experience.technologies, technology.trim()];
    handleUpdateExperience(experienceIndex, {
      technologies: updatedTechnologies,
    });
  };

  const handleRemoveTechnology = (
    experienceIndex: number,
    techIndex: number
  ) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedTechnologies = experience.technologies.filter(
      (_, i) => i !== techIndex
    );
    handleUpdateExperience(experienceIndex, {
      technologies: updatedTechnologies,
    });
  };

  const handleTechnologyKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    experienceIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddTechnology(experienceIndex, input.value);
      input.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Work Experience */}
      {profile.workExperience.length > 0 && (
        <div className="space-y-4">
          {profile.workExperience.map((experience, index) => (
            <Card
              className="border-l-4 border-l-blue-500"
              key={experience.id || index}
            >
              <Collapsible
                onOpenChange={() => toggleItem(index)}
                open={openItems.has(index)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <Building className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {experience.company || "New Work Experience"}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center space-x-4">
                            {experience.position && (
                              <span>{experience.position}</span>
                            )}
                            {experience.location && (
                              <span className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {experience.location}
                              </span>
                            )}
                            {experience.date && (
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {experience.date}
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
                            handleRemoveExperience(index);
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
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company *</Label>
                        <Input
                          className={
                            getFieldError(`workExperience.${index}.company`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`company-${index}`}
                          onChange={(e) =>
                            handleUpdateExperience(index, {
                              company: e.target.value,
                            })
                          }
                          placeholder="Enter company name"
                          type="text"
                          value={experience.company}
                        />
                        {getFieldError(`workExperience.${index}.company`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`workExperience.${index}.company`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Position *</Label>
                        <Input
                          className={
                            getFieldError(`workExperience.${index}.position`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`position-${index}`}
                          onChange={(e) =>
                            handleUpdateExperience(index, {
                              position: e.target.value,
                            })
                          }
                          placeholder="Enter job title"
                          type="text"
                          value={experience.position}
                        />
                        {getFieldError(`workExperience.${index}.position`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`workExperience.${index}.position`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`location-${index}`}>Location *</Label>
                        <Input
                          className={
                            getFieldError(`workExperience.${index}.location`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`location-${index}`}
                          onChange={(e) =>
                            handleUpdateExperience(index, {
                              location: e.target.value,
                            })
                          }
                          placeholder="City, State/Country"
                          type="text"
                          value={experience.location}
                        />
                        {getFieldError(`workExperience.${index}.location`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`workExperience.${index}.location`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`date-${index}`}>Date *</Label>
                        <Input
                          className={
                            getFieldError(`workExperience.${index}.date`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`date-${index}`}
                          onChange={(e) =>
                            handleUpdateExperience(index, {
                              date: e.target.value,
                            })
                          }
                          placeholder="e.g., Jan 2023 - Present"
                          type="text"
                          value={experience.date}
                        />
                        {getFieldError(`workExperience.${index}.date`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`workExperience.${index}.date`)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description Bullet Points */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Job Responsibilities & Achievements</Label>
                        <Button
                          onClick={() => handleAddDescriptionBullet(index)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Bullet Point
                        </Button>
                      </div>

                      {experience.description.map((bullet, bulletIndex) => (
                        <div
                          className="flex items-start space-x-2"
                          key={bulletIndex}
                        >
                          <span className="mt-3 text-gray-400">•</span>
                          <div className="flex-1">
                            <Textarea
                              className="min-h-[80px]"
                              onChange={(e) =>
                                handleUpdateDescriptionBullet(
                                  index,
                                  bulletIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Describe your responsibilities and achievements..."
                              rows={2}
                              value={bullet}
                            />
                          </div>
                          {experience.description.length > 1 && (
                            <Button
                              className="mt-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() =>
                                handleRemoveDescriptionBullet(
                                  index,
                                  bulletIndex
                                )
                              }
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                      <Label>Technologies & Skills</Label>

                      {/* Technology Tags */}
                      {experience.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <Badge
                              className="cursor-pointer hover:bg-red-100"
                              key={techIndex}
                              onClick={() =>
                                handleRemoveTechnology(index, techIndex)
                              }
                              variant="secondary"
                            >
                              {tech}
                              <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Add Technology Input */}
                      <Input
                        className="mt-2"
                        onKeyPress={(e) => handleTechnologyKeyPress(e, index)}
                        placeholder="Type a technology/skill and press Enter (e.g., React, Python, AWS)"
                        type="text"
                      />
                      <p className="text-gray-500 text-xs">
                        Press Enter to add each technology. Click on tags to
                        remove them.
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Add Work Experience Button - Only show when there are existing entries */}
      {profile.workExperience.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            className="w-full max-w-md"
            onClick={handleAddWorkExperience}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Work Experience
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no work experience */}
      {profile.workExperience.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Building className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
              No work experience added
            </h3>
            <p className="mb-6 text-gray-600">
              Start building your professional profile by adding your work
              experience.
            </p>
            <Button onClick={handleAddWorkExperience} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Work Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
