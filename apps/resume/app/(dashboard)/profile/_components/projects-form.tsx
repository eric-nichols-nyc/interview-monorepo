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
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FolderOpen,
  Github,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useProfileStore } from "../../../../stores/profile-store";
import type { Project } from "../../../../types/profile";

export function ProjectsForm() {
  const { profile, addProject, updateProjectItem, removeProject, errors } =
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

  const handleAddProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
      highlights: [""],
    };

    addProject(newProject);

    // Open the newly added item
    const newIndex = profile.projects.length;
    setOpenItems((prev) => new Set(Array.from(prev).concat([newIndex])));
  };

  const handleUpdateProject = (index: number, updates: Partial<Project>) => {
    updateProjectItem(index, updates);
  };

  const handleRemoveProject = (index: number) => {
    removeProject(index);
    // Remove from open items
    const newOpenItems = new Set(openItems);
    newOpenItems.delete(index);
    setOpenItems(newOpenItems);
  };

  const handleAddHighlight = (projectIndex: number) => {
    const project = profile.projects[projectIndex];
    const updatedHighlights = [...(project.highlights || []), ""];
    handleUpdateProject(projectIndex, { highlights: updatedHighlights });
  };

  const handleUpdateHighlight = (
    projectIndex: number,
    highlightIndex: number,
    value: string
  ) => {
    const project = profile.projects[projectIndex];
    const updatedHighlights = [...(project.highlights || [])];
    updatedHighlights[highlightIndex] = value;
    handleUpdateProject(projectIndex, { highlights: updatedHighlights });
  };

  const handleRemoveHighlight = (
    projectIndex: number,
    highlightIndex: number
  ) => {
    const project = profile.projects[projectIndex];
    const updatedHighlights = (project.highlights || []).filter(
      (_, i) => i !== highlightIndex
    );
    handleUpdateProject(projectIndex, { highlights: updatedHighlights });
  };

  const handleAddTechnology = (projectIndex: number, technology: string) => {
    if (!technology.trim()) {
      return;
    }

    const project = profile.projects[projectIndex];
    const updatedTechnologies = [...project.technologies, technology.trim()];
    handleUpdateProject(projectIndex, { technologies: updatedTechnologies });
  };

  const handleRemoveTechnology = (projectIndex: number, techIndex: number) => {
    const project = profile.projects[projectIndex];
    const updatedTechnologies = project.technologies.filter(
      (_, i) => i !== techIndex
    );
    handleUpdateProject(projectIndex, { technologies: updatedTechnologies });
  };

  const handleTechnologyKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    projectIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddTechnology(projectIndex, input.value);
      input.value = "";
    }
  };

  const handleBulkTechnologiesUpdate = (
    projectIndex: number,
    techText: string
  ) => {
    // Parse comma-separated technologies
    const technologies = techText
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    handleUpdateProject(projectIndex, { technologies });
  };

  const getBulkTechnologiesText = (projectIndex: number): string => {
    const project = profile.projects[projectIndex];
    return project.technologies.join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Existing Projects */}
      {profile.projects.length > 0 && (
        <div className="space-y-4">
          {profile.projects.map((project, index) => (
            <Card
              className="border-l-4 border-l-purple-500"
              key={project.id || index}
            >
              <Collapsible
                onOpenChange={() => toggleItem(index)}
                open={openItems.has(index)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <FolderOpen className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {project.name || "New Project"}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center space-x-4">
                            {project.technologies.length > 0 && (
                              <span className="text-xs">
                                {project.technologies.slice(0, 3).join(", ")}
                                {project.technologies.length > 3 && "..."}
                              </span>
                            )}
                            {(project.startDate || project.endDate) && (
                              <span className="flex items-center text-xs">
                                <Calendar className="mr-1 h-3 w-3" />
                                {project.startDate}{" "}
                                {project.startDate && project.endDate && "- "}{" "}
                                {project.endDate}
                              </span>
                            )}
                            {project.url && (
                              <ExternalLink className="h-3 w-3" />
                            )}
                            {project.githubUrl && (
                              <Github className="h-3 w-3" />
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProject(index);
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
                    {/* Basic Project Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`name-${index}`}>Project Name *</Label>
                        <Input
                          className={
                            getFieldError(`projects.${index}.name`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`name-${index}`}
                          onChange={(e) =>
                            handleUpdateProject(index, { name: e.target.value })
                          }
                          placeholder="Enter project name"
                          type="text"
                          value={project.name}
                        />
                        {getFieldError(`projects.${index}.name`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`projects.${index}.name`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`url-${index}`}>Live URL</Label>
                        <Input
                          className={
                            getFieldError(`projects.${index}.url`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`url-${index}`}
                          onChange={(e) =>
                            handleUpdateProject(index, { url: e.target.value })
                          }
                          placeholder="https://project-demo.com"
                          type="url"
                          value={project.url || ""}
                        />
                        {getFieldError(`projects.${index}.url`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`projects.${index}.url`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`githubUrl-${index}`}>GitHub URL</Label>
                        <Input
                          className={
                            getFieldError(`projects.${index}.githubUrl`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`githubUrl-${index}`}
                          onChange={(e) =>
                            handleUpdateProject(index, {
                              githubUrl: e.target.value,
                            })
                          }
                          placeholder="https://github.com/user/repo"
                          type="url"
                          value={project.githubUrl || ""}
                        />
                        {getFieldError(`projects.${index}.githubUrl`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`projects.${index}.githubUrl`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          className={
                            getFieldError(`projects.${index}.startDate`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`startDate-${index}`}
                          onChange={(e) =>
                            handleUpdateProject(index, {
                              startDate: e.target.value,
                            })
                          }
                          placeholder="e.g., Jan 2023"
                          type="text"
                          value={project.startDate || ""}
                        />
                        {getFieldError(`projects.${index}.startDate`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`projects.${index}.startDate`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                        <Input
                          className={
                            getFieldError(`projects.${index}.endDate`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`endDate-${index}`}
                          onChange={(e) =>
                            handleUpdateProject(index, {
                              endDate: e.target.value,
                            })
                          }
                          placeholder="e.g., Mar 2023 or Present"
                          type="text"
                          value={project.endDate || ""}
                        />
                        {getFieldError(`projects.${index}.endDate`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`projects.${index}.endDate`)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>
                        Project Description *
                      </Label>
                      <Textarea
                        className={`min-h-[100px] ${getFieldError(`projects.${index}.description`) ? "border-red-500" : ""}`}
                        id={`description-${index}`}
                        onChange={(e) =>
                          handleUpdateProject(index, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe what this project does, its purpose, and key features..."
                        rows={4}
                        value={project.description}
                      />
                      {getFieldError(`projects.${index}.description`) && (
                        <p className="text-red-600 text-sm">
                          {getFieldError(`projects.${index}.description`)}
                        </p>
                      )}
                    </div>

                    {/* Technologies - Two Input Methods */}
                    <div className="space-y-4">
                      <Label>Technologies Used *</Label>

                      {/* Method 1: Bulk Comma-Separated Input */}
                      <div className="space-y-2">
                        <Label
                          className="font-normal text-sm"
                          htmlFor={`bulk-tech-${index}`}
                        >
                          Comma-separated list:
                        </Label>
                        <Input
                          className="font-mono text-sm"
                          id={`bulk-tech-${index}`}
                          onChange={(e) =>
                            handleBulkTechnologiesUpdate(index, e.target.value)
                          }
                          placeholder="e.g., React, TypeScript, Node.js, PostgreSQL"
                          type="text"
                          value={getBulkTechnologiesText(index)}
                        />
                        <p className="text-gray-500 text-xs">
                          Type technologies separated by commas. Changes save
                          automatically.
                        </p>
                      </div>

                      {/* Method 2: Individual Technology Input */}
                      <div className="space-y-2">
                        <Label
                          className="font-normal text-sm"
                          htmlFor={`single-tech-${index}`}
                        >
                          Or add technologies one by one:
                        </Label>
                        <Input
                          id={`single-tech-${index}`}
                          onKeyPress={(e) => handleTechnologyKeyPress(e, index)}
                          placeholder="Type a technology and press Enter"
                          type="text"
                        />
                        <p className="text-gray-500 text-xs">
                          Press Enter to add each technology individually.
                        </p>
                      </div>

                      {/* Current Technologies Display */}
                      {project.technologies.length > 0 && (
                        <div className="space-y-2">
                          <Label className="font-normal text-sm">
                            Current technologies:
                          </Label>
                          <div className="flex flex-wrap gap-2 rounded-md border bg-gray-50 p-3">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge
                                className="cursor-pointer transition-colors hover:bg-red-100"
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
                          <p className="text-gray-500 text-xs">
                            Click on any technology badge to remove it.
                          </p>
                        </div>
                      )}

                      {/* Technology validation error */}
                      {getFieldError(`projects.${index}.technologies`) && (
                        <p className="text-red-600 text-sm">
                          {getFieldError(`projects.${index}.technologies`)}
                        </p>
                      )}
                    </div>

                    {/* Project Highlights */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Key Features & Highlights</Label>
                        <Button
                          onClick={() => handleAddHighlight(index)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Highlight
                        </Button>
                      </div>

                      {(project.highlights || []).map(
                        (highlight, highlightIndex) => (
                          <div
                            className="flex items-start space-x-2"
                            key={highlightIndex}
                          >
                            <span className="mt-3 text-gray-400">•</span>
                            <div className="flex-1">
                              <Textarea
                                className="min-h-[80px]"
                                onChange={(e) =>
                                  handleUpdateHighlight(
                                    index,
                                    highlightIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Describe a key feature, achievement, or technical highlight..."
                                rows={2}
                                value={highlight}
                              />
                            </div>
                            {(project.highlights || []).length > 1 && (
                              <Button
                                className="mt-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                  handleRemoveHighlight(index, highlightIndex)
                                }
                                size="sm"
                                type="button"
                                variant="ghost"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Add Project Button - Only show when there are existing projects */}
      {profile.projects.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            className="w-full max-w-md"
            onClick={handleAddProject}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Project
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no projects */}
      {profile.projects.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
              No projects added
            </h3>
            <p className="mb-6 text-gray-600">
              Showcase your work by adding personal or professional projects
              that demonstrate your skills.
            </p>
            <Button onClick={handleAddProject} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
