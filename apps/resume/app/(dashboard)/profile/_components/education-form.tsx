'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/design-system/components/ui/collapsible';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  X
} from 'lucide-react';
import { useProfileStore } from '../../../../stores/profile-store';
import { Education } from '../../../../types/profile';

export function EducationForm() {
  const { 
    profile, 
    addEducation, 
    updateEducationItem,
    removeEducation,
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

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: '',
      honors: [],
      coursework: [],
    };
    
    addEducation(newEducation);
    
    // Open the newly added item
    const newIndex = profile.education.length;
    setOpenItems(prev => new Set(Array.from(prev).concat([newIndex])));
  };

  const handleUpdateEducation = (index: number, updates: Partial<Education>) => {
    updateEducationItem(index, updates);
  };

  const handleRemoveEducation = (index: number) => {
    removeEducation(index);
    // Remove from open items
    const newOpenItems = new Set(openItems);
    newOpenItems.delete(index);
    setOpenItems(newOpenItems);
  };

  const handleAddHonor = (educationIndex: number) => {
    const education = profile.education[educationIndex];
    const updatedHonors = [...(education.honors || []), ''];
    handleUpdateEducation(educationIndex, { honors: updatedHonors });
  };

  const handleUpdateHonor = (educationIndex: number, honorIndex: number, value: string) => {
    const education = profile.education[educationIndex];
    const updatedHonors = [...(education.honors || [])];
    updatedHonors[honorIndex] = value;
    handleUpdateEducation(educationIndex, { honors: updatedHonors });
  };

  const handleRemoveHonor = (educationIndex: number, honorIndex: number) => {
    const education = profile.education[educationIndex];
    const updatedHonors = (education.honors || []).filter((_, i) => i !== honorIndex);
    handleUpdateEducation(educationIndex, { honors: updatedHonors });
  };

  const handleAddCoursework = (educationIndex: number, coursework: string) => {
    if (!coursework.trim()) return;
    
    const education = profile.education[educationIndex];
    const updatedCoursework = [...(education.coursework || []), coursework.trim()];
    handleUpdateEducation(educationIndex, { coursework: updatedCoursework });
  };

  const handleRemoveCoursework = (educationIndex: number, courseworkIndex: number) => {
    const education = profile.education[educationIndex];
    const updatedCoursework = (education.coursework || []).filter((_, i) => i !== courseworkIndex);
    handleUpdateEducation(educationIndex, { coursework: updatedCoursework });
  };

  const handleCourseworkKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, educationIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddCoursework(educationIndex, input.value);
      input.value = '';
    }
  };

  const handleBulkCourseworkUpdate = (educationIndex: number, courseworkText: string) => {
    // Parse comma-separated coursework
    const coursework = courseworkText
      .split(',')
      .map(course => course.trim())
      .filter(course => course.length > 0);
    
    handleUpdateEducation(educationIndex, { coursework });
  };

  const getBulkCourseworkText = (educationIndex: number): string => {
    const education = profile.education[educationIndex];
    return (education.coursework || []).join(', ');
  };

  const handleCurrentEducationToggle = (educationIndex: number, checked: boolean) => {
    const updates: Partial<Education> = { isCurrent: checked };
    if (checked) {
      updates.endDate = ''; // Clear end date if currently enrolled
    }
    handleUpdateEducation(educationIndex, updates);
  };

  return (
    <div className="space-y-6">
      {/* Existing Education */}
      {profile.education.length > 0 && (
        <div className="space-y-4">
          {profile.education.map((education, index) => (
            <Card key={education.id || index} className="border-l-4 border-l-blue-500">
              <Collapsible open={openItems.has(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {education.institution || 'New Education'}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-1">
                            {education.degree && (
                              <span className="text-sm">
                                {education.degree}
                                {education.fieldOfStudy && ` in ${education.fieldOfStudy}`}
                              </span>
                            )}
                            {education.location && (
                              <span className="flex items-center text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {education.location}
                              </span>
                            )}
                            {(education.startDate || education.endDate) && (
                              <span className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {education.startDate} 
                                {education.startDate && !education.isCurrent && education.endDate && ' - '}
                                {education.isCurrent ? ' - Present' : education.endDate}
                              </span>
                            )}
                            {education.gpa && (
                              <span className="flex items-center text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                GPA: {education.gpa}
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
                            handleRemoveEducation(index);
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
                    {/* Basic Education Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`institution-${index}`}>Institution *</Label>
                        <Input
                          id={`institution-${index}`}
                          type="text"
                          value={education.institution}
                          onChange={(e) => handleUpdateEducation(index, { institution: e.target.value })}
                          placeholder="Enter institution name"
                          className={getFieldError(`education.${index}.institution`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`education.${index}.institution`) && (
                          <p className="text-sm text-red-600">{getFieldError(`education.${index}.institution`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree *</Label>
                        <Input
                          id={`degree-${index}`}
                          type="text"
                          value={education.degree}
                          onChange={(e) => handleUpdateEducation(index, { degree: e.target.value })}
                          placeholder="e.g., Bachelor of Science"
                          className={getFieldError(`education.${index}.degree`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`education.${index}.degree`) && (
                          <p className="text-sm text-red-600">{getFieldError(`education.${index}.degree`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                        <Input
                          id={`fieldOfStudy-${index}`}
                          type="text"
                          value={education.fieldOfStudy || ''}
                          onChange={(e) => handleUpdateEducation(index, { fieldOfStudy: e.target.value })}
                          placeholder="e.g., Computer Science"
                          className={getFieldError(`education.${index}.fieldOfStudy`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`education.${index}.fieldOfStudy`) && (
                          <p className="text-sm text-red-600">{getFieldError(`education.${index}.fieldOfStudy`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`location-${index}`}>Location</Label>
                        <Input
                          id={`location-${index}`}
                          type="text"
                          value={education.location || ''}
                          onChange={(e) => handleUpdateEducation(index, { location: e.target.value })}
                          placeholder="e.g., Boston, MA"
                          className={getFieldError(`education.${index}.location`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`education.${index}.location`) && (
                          <p className="text-sm text-red-600">{getFieldError(`education.${index}.location`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`gpa-${index}`}>GPA</Label>
                        <Input
                          id={`gpa-${index}`}
                          type="text"
                          value={education.gpa || ''}
                          onChange={(e) => handleUpdateEducation(index, { gpa: e.target.value })}
                          placeholder="e.g., 3.8/4.0"
                          className={getFieldError(`education.${index}.gpa`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`education.${index}.gpa`) && (
                          <p className="text-sm text-red-600">{getFieldError(`education.${index}.gpa`)}</p>
                        )}
                      </div>
                    </div>

                    {/* Date Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="text"
                          value={education.startDate}
                          onChange={(e) => handleUpdateEducation(index, { startDate: e.target.value })}
                          placeholder="e.g., Aug 2020"
                          className={getFieldError(`education.${index}.startDate`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`education.${index}.startDate`) && (
                          <p className="text-sm text-red-600">{getFieldError(`education.${index}.startDate`)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id={`isCurrent-${index}`}
                            checked={education.isCurrent}
                            onCheckedChange={(checked) => handleCurrentEducationToggle(index, checked as boolean)}
                          />
                          <Label htmlFor={`isCurrent-${index}`} className="text-sm font-normal">
                            Currently enrolled
                          </Label>
                        </div>
                        {!education.isCurrent && (
                          <>
                            <Label htmlFor={`endDate-${index}`}>End Date</Label>
                            <Input
                              id={`endDate-${index}`}
                              type="text"
                              value={education.endDate || ''}
                              onChange={(e) => handleUpdateEducation(index, { endDate: e.target.value })}
                              placeholder="e.g., May 2024"
                              className={getFieldError(`education.${index}.endDate`) ? 'border-red-500' : ''}
                            />
                            {getFieldError(`education.${index}.endDate`) && (
                              <p className="text-sm text-red-600">{getFieldError(`education.${index}.endDate`)}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Relevant Coursework - Two Input Methods */}
                    <div className="space-y-4">
                      <Label>Relevant Coursework</Label>
                      
                      {/* Method 1: Bulk Comma-Separated Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`bulk-coursework-${index}`} className="text-sm font-normal">
                          Comma-separated list:
                        </Label>
                        <Input
                          id={`bulk-coursework-${index}`}
                          type="text"
                          value={getBulkCourseworkText(index)}
                          onChange={(e) => handleBulkCourseworkUpdate(index, e.target.value)}
                          placeholder="e.g., Data Structures, Algorithms, Database Systems, Software Engineering"
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Type courses separated by commas. Changes save automatically.
                        </p>
                      </div>

                      {/* Method 2: Individual Course Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`single-coursework-${index}`} className="text-sm font-normal">
                          Or add courses one by one:
                        </Label>
                        <Input
                          id={`single-coursework-${index}`}
                          type="text"
                          placeholder="Type a course name and press Enter"
                          onKeyPress={(e) => handleCourseworkKeyPress(e, index)}
                        />
                        <p className="text-xs text-gray-500">
                          Press Enter to add each course individually.
                        </p>
                      </div>

                      {/* Current Coursework Display */}
                      {(education.coursework || []).length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-normal">Current coursework:</Label>
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
                            {(education.coursework || []).map((course, courseworkIndex) => (
                              <Badge
                                key={courseworkIndex}
                                variant="secondary"
                                className="cursor-pointer hover:bg-red-100 transition-colors"
                                onClick={() => handleRemoveCoursework(index, courseworkIndex)}
                              >
                                {course}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            Click on any course badge to remove it.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Honors and Awards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Honors & Awards</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddHonor(index)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Honor/Award
                        </Button>
                      </div>
                      
                      {(education.honors || []).length > 0 && (
                        <div className="space-y-2">
                          {(education.honors || []).map((honor, honorIndex) => (
                            <div key={honorIndex} className="flex items-center space-x-2">
                              <span className="text-gray-400">•</span>
                              <div className="flex-1">
                                <Input
                                  value={honor}
                                  onChange={(e) => handleUpdateHonor(index, honorIndex, e.target.value)}
                                  placeholder="e.g., Dean's List, Magna Cum Laude, Academic Scholarship"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveHonor(index, honorIndex)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(education.honors || []).length === 0 && (
                        <p className="text-sm text-gray-500">
                          Add any honors, awards, scholarships, or academic achievements you received.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Add Education Button - Only show when there are existing education entries */}
      {profile.education.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleAddEducation}
            size="lg"
            className="w-full max-w-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Education
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no education */}
      {profile.education.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No education added</h3>
            <p className="text-gray-600 mb-6">
              Add your educational background including degrees, certifications, and relevant coursework.
            </p>
            <Button onClick={handleAddEducation} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}