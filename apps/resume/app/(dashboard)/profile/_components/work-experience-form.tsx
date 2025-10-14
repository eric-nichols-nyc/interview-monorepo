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
  Building, 
  MapPin, 
  Calendar,
  X
} from 'lucide-react';
import { useProfileStore } from '../../../../stores/profile-store';
import { WorkExperience } from '../../../../types/profile';

export function WorkExperienceForm() {
  const { 
    profile, 
    updateWorkExperience, 
    addWorkExperience, 
    updateWorkExperienceItem,
    removeWorkExperience,
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

  const handleAddWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      date: '',
      description: [''],
      technologies: [],
    };
    
    addWorkExperience(newExperience);
    
    // Open the newly added item
    const newIndex = profile.workExperience.length;
    setOpenItems(prev => new Set([...prev, newIndex]));
  };

  const handleUpdateExperience = (index: number, updates: Partial<WorkExperience>) => {
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
    const updatedDescription = [...experience.description, ''];
    handleUpdateExperience(experienceIndex, { description: updatedDescription });
  };

  const handleUpdateDescriptionBullet = (experienceIndex: number, bulletIndex: number, value: string) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedDescription = [...experience.description];
    updatedDescription[bulletIndex] = value;
    handleUpdateExperience(experienceIndex, { description: updatedDescription });
  };

  const handleRemoveDescriptionBullet = (experienceIndex: number, bulletIndex: number) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedDescription = experience.description.filter((_, i) => i !== bulletIndex);
    handleUpdateExperience(experienceIndex, { description: updatedDescription });
  };

  const handleAddTechnology = (experienceIndex: number, technology: string) => {
    if (!technology.trim()) return;
    
    const experience = profile.workExperience[experienceIndex];
    const updatedTechnologies = [...experience.technologies, technology.trim()];
    handleUpdateExperience(experienceIndex, { technologies: updatedTechnologies });
  };

  const handleRemoveTechnology = (experienceIndex: number, techIndex: number) => {
    const experience = profile.workExperience[experienceIndex];
    const updatedTechnologies = experience.technologies.filter((_, i) => i !== techIndex);
    handleUpdateExperience(experienceIndex, { technologies: updatedTechnologies });
  };

  const handleTechnologyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, experienceIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddTechnology(experienceIndex, input.value);
      input.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Work Experience */}
      {profile.workExperience.length > 0 && (
        <div className="space-y-4">
          {profile.workExperience.map((experience, index) => (
            <Card key={experience.id || index} className="border-l-4 border-l-blue-500">
              <Collapsible open={openItems.has(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <Building className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {experience.company || 'New Work Experience'}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-1">
                            {experience.position && (
                              <span>{experience.position}</span>
                            )}
                            {experience.location && (
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {experience.location}
                              </span>
                            )}
                            {experience.date && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {experience.date}
                              </span>
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
                            handleRemoveExperience(index);
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
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company *</Label>
                        <Input
                          id={`company-${index}`}
                          type="text"
                          value={experience.company}
                          onChange={(e) => handleUpdateExperience(index, { company: e.target.value })}
                          placeholder="Enter company name"
                          className={getFieldError(`workExperience.${index}.company`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`workExperience.${index}.company`) && (
                          <p className="text-sm text-red-600">{getFieldError(`workExperience.${index}.company`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Position *</Label>
                        <Input
                          id={`position-${index}`}
                          type="text"
                          value={experience.position}
                          onChange={(e) => handleUpdateExperience(index, { position: e.target.value })}
                          placeholder="Enter job title"
                          className={getFieldError(`workExperience.${index}.position`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`workExperience.${index}.position`) && (
                          <p className="text-sm text-red-600">{getFieldError(`workExperience.${index}.position`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`location-${index}`}>Location *</Label>
                        <Input
                          id={`location-${index}`}
                          type="text"
                          value={experience.location}
                          onChange={(e) => handleUpdateExperience(index, { location: e.target.value })}
                          placeholder="City, State/Country"
                          className={getFieldError(`workExperience.${index}.location`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`workExperience.${index}.location`) && (
                          <p className="text-sm text-red-600">{getFieldError(`workExperience.${index}.location`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`date-${index}`}>Date *</Label>
                        <Input
                          id={`date-${index}`}
                          type="text"
                          value={experience.date}
                          onChange={(e) => handleUpdateExperience(index, { date: e.target.value })}
                          placeholder="e.g., Jan 2023 - Present"
                          className={getFieldError(`workExperience.${index}.date`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`workExperience.${index}.date`) && (
                          <p className="text-sm text-red-600">{getFieldError(`workExperience.${index}.date`)}</p>
                        )}
                      </div>
                    </div>

                    {/* Description Bullet Points */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Job Responsibilities & Achievements</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddDescriptionBullet(index)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Bullet Point
                        </Button>
                      </div>
                      
                      {experience.description.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-3">•</span>
                          <div className="flex-1">
                            <Textarea
                              value={bullet}
                              onChange={(e) => handleUpdateDescriptionBullet(index, bulletIndex, e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                              className="min-h-[80px]"
                              rows={2}
                            />
                          </div>
                          {experience.description.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDescriptionBullet(index, bulletIndex)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
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
                              key={techIndex}
                              variant="secondary"
                              className="cursor-pointer hover:bg-red-100"
                              onClick={() => handleRemoveTechnology(index, techIndex)}
                            >
                              {tech}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Add Technology Input */}
                      <Input
                        type="text"
                        placeholder="Type a technology/skill and press Enter (e.g., React, Python, AWS)"
                        onKeyPress={(e) => handleTechnologyKeyPress(e, index)}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500">
                        Press Enter to add each technology. Click on tags to remove them.
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
            onClick={handleAddWorkExperience}
            size="lg"
            className="w-full max-w-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Work Experience
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no work experience */}
      {profile.workExperience.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No work experience added</h3>
            <p className="text-gray-600 mb-6">
              Start building your professional profile by adding your work experience.
            </p>
            <Button onClick={handleAddWorkExperience} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Work Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}