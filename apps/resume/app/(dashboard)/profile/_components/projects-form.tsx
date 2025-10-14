'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/design-system/components/ui/collapsible';
import { Badge } from '@repo/design-system/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  FolderOpen, 
  ExternalLink,
  Github,
  Calendar,
  X
} from 'lucide-react';
import { useProfileStore } from '../../../../stores/profile-store';
import { Project } from '../../../../types/profile';

export function ProjectsForm() {
  const { 
    profile, 
    addProject, 
    updateProjectItem,
    removeProject,
    errors 
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

  const getFieldError = (field: string): string | undefined => {
    return errors[field]?.[0];
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      githubUrl: '',
      startDate: '',
      endDate: '',
      highlights: [''],
    };
    
    addProject(newProject);
    
    // Open the newly added item
    const newIndex = profile.projects.length;
    setOpenItems(prev => new Set(Array.from(prev).concat([newIndex])));
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
    const updatedHighlights = [...(project.highlights || []), ''];
    handleUpdateProject(projectIndex, { highlights: updatedHighlights });
  };

  const handleUpdateHighlight = (projectIndex: number, highlightIndex: number, value: string) => {
    const project = profile.projects[projectIndex];
    const updatedHighlights = [...(project.highlights || [])];
    updatedHighlights[highlightIndex] = value;
    handleUpdateProject(projectIndex, { highlights: updatedHighlights });
  };

  const handleRemoveHighlight = (projectIndex: number, highlightIndex: number) => {
    const project = profile.projects[projectIndex];
    const updatedHighlights = (project.highlights || []).filter((_, i) => i !== highlightIndex);
    handleUpdateProject(projectIndex, { highlights: updatedHighlights });
  };

  const handleAddTechnology = (projectIndex: number, technology: string) => {
    if (!technology.trim()) return;
    
    const project = profile.projects[projectIndex];
    const updatedTechnologies = [...project.technologies, technology.trim()];
    handleUpdateProject(projectIndex, { technologies: updatedTechnologies });
  };

  const handleRemoveTechnology = (projectIndex: number, techIndex: number) => {
    const project = profile.projects[projectIndex];
    const updatedTechnologies = project.technologies.filter((_, i) => i !== techIndex);
    handleUpdateProject(projectIndex, { technologies: updatedTechnologies });
  };

  const handleTechnologyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, projectIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddTechnology(projectIndex, input.value);
      input.value = '';
    }
  };

  const handleBulkTechnologiesUpdate = (projectIndex: number, techText: string) => {
    // Parse comma-separated technologies
    const technologies = techText
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
    
    handleUpdateProject(projectIndex, { technologies });
  };

  const getBulkTechnologiesText = (projectIndex: number): string => {
    const project = profile.projects[projectIndex];
    return project.technologies.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Existing Projects */}
      {profile.projects.length > 0 && (
        <div className="space-y-4">
          {profile.projects.map((project, index) => (
            <Card key={project.id || index} className="border-l-4 border-l-purple-500">
              <Collapsible open={openItems.has(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <FolderOpen className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {project.name || 'New Project'}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-1">
                            {project.technologies.length > 0 && (
                              <span className="text-xs">
                                {project.technologies.slice(0, 3).join(', ')}
                                {project.technologies.length > 3 && '...'}
                              </span>
                            )}
                            {(project.startDate || project.endDate) && (
                              <span className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {project.startDate} {project.startDate && project.endDate && '- '} {project.endDate}
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
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProject(index);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`name-${index}`}>Project Name *</Label>
                        <Input
                          id={`name-${index}`}
                          type="text"
                          value={project.name}
                          onChange={(e) => handleUpdateProject(index, { name: e.target.value })}
                          placeholder="Enter project name"
                          className={getFieldError(`projects.${index}.name`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`projects.${index}.name`) && (
                          <p className="text-sm text-red-600">{getFieldError(`projects.${index}.name`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`url-${index}`}>Live URL</Label>
                        <Input
                          id={`url-${index}`}
                          type="url"
                          value={project.url || ''}
                          onChange={(e) => handleUpdateProject(index, { url: e.target.value })}
                          placeholder="https://project-demo.com"
                          className={getFieldError(`projects.${index}.url`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`projects.${index}.url`) && (
                          <p className="text-sm text-red-600">{getFieldError(`projects.${index}.url`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`githubUrl-${index}`}>GitHub URL</Label>
                        <Input
                          id={`githubUrl-${index}`}
                          type="url"
                          value={project.githubUrl || ''}
                          onChange={(e) => handleUpdateProject(index, { githubUrl: e.target.value })}
                          placeholder="https://github.com/user/repo"
                          className={getFieldError(`projects.${index}.githubUrl`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`projects.${index}.githubUrl`) && (
                          <p className="text-sm text-red-600">{getFieldError(`projects.${index}.githubUrl`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="text"
                          value={project.startDate || ''}
                          onChange={(e) => handleUpdateProject(index, { startDate: e.target.value })}
                          placeholder="e.g., Jan 2023"
                          className={getFieldError(`projects.${index}.startDate`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`projects.${index}.startDate`) && (
                          <p className="text-sm text-red-600">{getFieldError(`projects.${index}.startDate`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                        <Input
                          id={`endDate-${index}`}
                          type="text"
                          value={project.endDate || ''}
                          onChange={(e) => handleUpdateProject(index, { endDate: e.target.value })}
                          placeholder="e.g., Mar 2023 or Present"
                          className={getFieldError(`projects.${index}.endDate`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`projects.${index}.endDate`) && (
                          <p className="text-sm text-red-600">{getFieldError(`projects.${index}.endDate`)}</p>
                        )}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Project Description *</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={project.description}
                        onChange={(e) => handleUpdateProject(index, { description: e.target.value })}
                        placeholder="Describe what this project does, its purpose, and key features..."
                        className={`min-h-[100px] ${getFieldError(`projects.${index}.description`) ? 'border-red-500' : ''}`}
                        rows={4}
                      />
                      {getFieldError(`projects.${index}.description`) && (
                        <p className="text-sm text-red-600">{getFieldError(`projects.${index}.description`)}</p>
                      )}
                    </div>

                    {/* Technologies - Two Input Methods */}
                    <div className="space-y-4">
                      <Label>Technologies Used *</Label>
                      
                      {/* Method 1: Bulk Comma-Separated Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`bulk-tech-${index}`} className="text-sm font-normal">
                          Comma-separated list:
                        </Label>
                        <Input
                          id={`bulk-tech-${index}`}
                          type="text"
                          value={getBulkTechnologiesText(index)}
                          onChange={(e) => handleBulkTechnologiesUpdate(index, e.target.value)}
                          placeholder="e.g., React, TypeScript, Node.js, PostgreSQL"
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Type technologies separated by commas. Changes save automatically.
                        </p>
                      </div>

                      {/* Method 2: Individual Technology Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`single-tech-${index}`} className="text-sm font-normal">
                          Or add technologies one by one:
                        </Label>
                        <Input
                          id={`single-tech-${index}`}
                          type="text"
                          placeholder="Type a technology and press Enter"
                          onKeyPress={(e) => handleTechnologyKeyPress(e, index)}
                        />
                        <p className="text-xs text-gray-500">
                          Press Enter to add each technology individually.
                        </p>
                      </div>

                      {/* Current Technologies Display */}
                      {project.technologies.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-normal">Current technologies:</Label>
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="secondary"
                                className="cursor-pointer hover:bg-red-100 transition-colors"
                                onClick={() => handleRemoveTechnology(index, techIndex)}
                              >
                                {tech}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            Click on any technology badge to remove it.
                          </p>
                        </div>
                      )}

                      {/* Technology validation error */}
                      {getFieldError(`projects.${index}.technologies`) && (
                        <p className="text-sm text-red-600">{getFieldError(`projects.${index}.technologies`)}</p>
                      )}
                    </div>

                    {/* Project Highlights */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Key Features & Highlights</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddHighlight(index)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Highlight
                        </Button>
                      </div>
                      
                      {(project.highlights || []).map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-3">•</span>
                          <div className="flex-1">
                            <Textarea
                              value={highlight}
                              onChange={(e) => handleUpdateHighlight(index, highlightIndex, e.target.value)}
                              placeholder="Describe a key feature, achievement, or technical highlight..."
                              className="min-h-[80px]"
                              rows={2}
                            />
                          </div>
                          {(project.highlights || []).length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveHighlight(index, highlightIndex)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
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
            onClick={handleAddProject}
            size="lg"
            className="w-full max-w-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Project
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no projects */}
      {profile.projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects added</h3>
            <p className="text-gray-600 mb-6">
              Showcase your work by adding personal or professional projects that demonstrate your skills.
            </p>
            <Button onClick={handleAddProject} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}