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
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useProfileStore } from "../../../../stores/profile-store";
import type { Education } from "../../../../types/profile";

export function EducationForm() {
  const {
    profile,
    addEducation,
    updateEducationItem,
    removeEducation,
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

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      gpa: "",
      honors: [],
      coursework: [],
    };

    addEducation(newEducation);

    // Open the newly added item
    const newIndex = profile.education.length;
    setOpenItems((prev) => new Set(Array.from(prev).concat([newIndex])));
  };

  const handleUpdateEducation = (
    index: number,
    updates: Partial<Education>
  ) => {
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
    const updatedHonors = [...(education.honors || []), ""];
    handleUpdateEducation(educationIndex, { honors: updatedHonors });
  };

  const handleUpdateHonor = (
    educationIndex: number,
    honorIndex: number,
    value: string
  ) => {
    const education = profile.education[educationIndex];
    const updatedHonors = [...(education.honors || [])];
    updatedHonors[honorIndex] = value;
    handleUpdateEducation(educationIndex, { honors: updatedHonors });
  };

  const handleRemoveHonor = (educationIndex: number, honorIndex: number) => {
    const education = profile.education[educationIndex];
    const updatedHonors = (education.honors || []).filter(
      (_, i) => i !== honorIndex
    );
    handleUpdateEducation(educationIndex, { honors: updatedHonors });
  };

  const handleAddCoursework = (educationIndex: number, coursework: string) => {
    if (!coursework.trim()) {
      return;
    }

    const education = profile.education[educationIndex];
    const updatedCoursework = [
      ...(education.coursework || []),
      coursework.trim(),
    ];
    handleUpdateEducation(educationIndex, { coursework: updatedCoursework });
  };

  const handleRemoveCoursework = (
    educationIndex: number,
    courseworkIndex: number
  ) => {
    const education = profile.education[educationIndex];
    const updatedCoursework = (education.coursework || []).filter(
      (_, i) => i !== courseworkIndex
    );
    handleUpdateEducation(educationIndex, { coursework: updatedCoursework });
  };

  const handleCourseworkKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    educationIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleAddCoursework(educationIndex, input.value);
      input.value = "";
    }
  };

  const handleBulkCourseworkUpdate = (
    educationIndex: number,
    courseworkText: string
  ) => {
    // Parse comma-separated coursework
    const coursework = courseworkText
      .split(",")
      .map((course) => course.trim())
      .filter((course) => course.length > 0);

    handleUpdateEducation(educationIndex, { coursework });
  };

  const getBulkCourseworkText = (educationIndex: number): string => {
    const education = profile.education[educationIndex];
    return (education.coursework || []).join(", ");
  };

  const handleCurrentEducationToggle = (
    educationIndex: number,
    checked: boolean
  ) => {
    const updates: Partial<Education> = { isCurrent: checked };
    if (checked) {
      updates.endDate = ""; // Clear end date if currently enrolled
    }
    handleUpdateEducation(educationIndex, updates);
  };

  return (
    <div className="space-y-6">
      {/* Existing Education */}
      {profile.education.length > 0 && (
        <div className="space-y-4">
          {profile.education.map((education, index) => (
            <Card
              className="border-l-4 border-l-blue-500"
              key={education.id || index}
            >
              <Collapsible
                onOpenChange={() => toggleItem(index)}
                open={openItems.has(index)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            {education.institution || "New Education"}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center space-x-4">
                            {education.degree && (
                              <span className="text-sm">
                                {education.degree}
                                {education.fieldOfStudy &&
                                  ` in ${education.fieldOfStudy}`}
                              </span>
                            )}
                            {education.location && (
                              <span className="flex items-center text-xs">
                                <MapPin className="mr-1 h-3 w-3" />
                                {education.location}
                              </span>
                            )}
                            {(education.startDate || education.endDate) && (
                              <span className="flex items-center text-xs">
                                <Calendar className="mr-1 h-3 w-3" />
                                {education.startDate}
                                {education.startDate &&
                                  !education.isCurrent &&
                                  education.endDate &&
                                  " - "}
                                {education.isCurrent
                                  ? " - Present"
                                  : education.endDate}
                              </span>
                            )}
                            {education.gpa && (
                              <span className="flex items-center text-xs">
                                <Award className="mr-1 h-3 w-3" />
                                GPA: {education.gpa}
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
                            handleRemoveEducation(index);
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
                    {/* Basic Education Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`institution-${index}`}>
                          Institution *
                        </Label>
                        <Input
                          className={
                            getFieldError(`education.${index}.institution`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`institution-${index}`}
                          onChange={(e) =>
                            handleUpdateEducation(index, {
                              institution: e.target.value,
                            })
                          }
                          placeholder="Enter institution name"
                          type="text"
                          value={education.institution}
                        />
                        {getFieldError(`education.${index}.institution`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`education.${index}.institution`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree *</Label>
                        <Input
                          className={
                            getFieldError(`education.${index}.degree`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`degree-${index}`}
                          onChange={(e) =>
                            handleUpdateEducation(index, {
                              degree: e.target.value,
                            })
                          }
                          placeholder="e.g., Bachelor of Science"
                          type="text"
                          value={education.degree}
                        />
                        {getFieldError(`education.${index}.degree`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`education.${index}.degree`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`fieldOfStudy-${index}`}>
                          Field of Study
                        </Label>
                        <Input
                          className={
                            getFieldError(`education.${index}.fieldOfStudy`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`fieldOfStudy-${index}`}
                          onChange={(e) =>
                            handleUpdateEducation(index, {
                              fieldOfStudy: e.target.value,
                            })
                          }
                          placeholder="e.g., Computer Science"
                          type="text"
                          value={education.fieldOfStudy || ""}
                        />
                        {getFieldError(`education.${index}.fieldOfStudy`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`education.${index}.fieldOfStudy`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`location-${index}`}>Location</Label>
                        <Input
                          className={
                            getFieldError(`education.${index}.location`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`location-${index}`}
                          onChange={(e) =>
                            handleUpdateEducation(index, {
                              location: e.target.value,
                            })
                          }
                          placeholder="e.g., Boston, MA"
                          type="text"
                          value={education.location || ""}
                        />
                        {getFieldError(`education.${index}.location`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`education.${index}.location`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`gpa-${index}`}>GPA</Label>
                        <Input
                          className={
                            getFieldError(`education.${index}.gpa`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`gpa-${index}`}
                          onChange={(e) =>
                            handleUpdateEducation(index, {
                              gpa: e.target.value,
                            })
                          }
                          placeholder="e.g., 3.8/4.0"
                          type="text"
                          value={education.gpa || ""}
                        />
                        {getFieldError(`education.${index}.gpa`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`education.${index}.gpa`)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>
                          Start Date *
                        </Label>
                        <Input
                          className={
                            getFieldError(`education.${index}.startDate`)
                              ? "border-red-500"
                              : ""
                          }
                          id={`startDate-${index}`}
                          onChange={(e) =>
                            handleUpdateEducation(index, {
                              startDate: e.target.value,
                            })
                          }
                          placeholder="e.g., Aug 2020"
                          type="text"
                          value={education.startDate}
                        />
                        {getFieldError(`education.${index}.startDate`) && (
                          <p className="text-red-600 text-sm">
                            {getFieldError(`education.${index}.startDate`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="mb-2 flex items-center space-x-2">
                          <Checkbox
                            checked={education.isCurrent}
                            id={`isCurrent-${index}`}
                            onCheckedChange={(checked) =>
                              handleCurrentEducationToggle(
                                index,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            className="font-normal text-sm"
                            htmlFor={`isCurrent-${index}`}
                          >
                            Currently enrolled
                          </Label>
                        </div>
                        {!education.isCurrent && (
                          <>
                            <Label htmlFor={`endDate-${index}`}>End Date</Label>
                            <Input
                              className={
                                getFieldError(`education.${index}.endDate`)
                                  ? "border-red-500"
                                  : ""
                              }
                              id={`endDate-${index}`}
                              onChange={(e) =>
                                handleUpdateEducation(index, {
                                  endDate: e.target.value,
                                })
                              }
                              placeholder="e.g., May 2024"
                              type="text"
                              value={education.endDate || ""}
                            />
                            {getFieldError(`education.${index}.endDate`) && (
                              <p className="text-red-600 text-sm">
                                {getFieldError(`education.${index}.endDate`)}
                              </p>
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
                        <Label
                          className="font-normal text-sm"
                          htmlFor={`bulk-coursework-${index}`}
                        >
                          Comma-separated list:
                        </Label>
                        <Input
                          className="font-mono text-sm"
                          id={`bulk-coursework-${index}`}
                          onChange={(e) =>
                            handleBulkCourseworkUpdate(index, e.target.value)
                          }
                          placeholder="e.g., Data Structures, Algorithms, Database Systems, Software Engineering"
                          type="text"
                          value={getBulkCourseworkText(index)}
                        />
                        <p className="text-gray-500 text-xs">
                          Type courses separated by commas. Changes save
                          automatically.
                        </p>
                      </div>

                      {/* Method 2: Individual Course Input */}
                      <div className="space-y-2">
                        <Label
                          className="font-normal text-sm"
                          htmlFor={`single-coursework-${index}`}
                        >
                          Or add courses one by one:
                        </Label>
                        <Input
                          id={`single-coursework-${index}`}
                          onKeyPress={(e) => handleCourseworkKeyPress(e, index)}
                          placeholder="Type a course name and press Enter"
                          type="text"
                        />
                        <p className="text-gray-500 text-xs">
                          Press Enter to add each course individually.
                        </p>
                      </div>

                      {/* Current Coursework Display */}
                      {(education.coursework || []).length > 0 && (
                        <div className="space-y-2">
                          <Label className="font-normal text-sm">
                            Current coursework:
                          </Label>
                          <div className="flex flex-wrap gap-2 rounded-md border bg-gray-50 p-3">
                            {(education.coursework || []).map(
                              (course, courseworkIndex) => (
                                <Badge
                                  className="cursor-pointer transition-colors hover:bg-red-100"
                                  key={courseworkIndex}
                                  onClick={() =>
                                    handleRemoveCoursework(
                                      index,
                                      courseworkIndex
                                    )
                                  }
                                  variant="secondary"
                                >
                                  {course}
                                  <X className="ml-1 h-3 w-3" />
                                </Badge>
                              )
                            )}
                          </div>
                          <p className="text-gray-500 text-xs">
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
                          onClick={() => handleAddHonor(index)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Honor/Award
                        </Button>
                      </div>

                      {(education.honors || []).length > 0 && (
                        <div className="space-y-2">
                          {(education.honors || []).map((honor, honorIndex) => (
                            <div
                              className="flex items-center space-x-2"
                              key={honorIndex}
                            >
                              <span className="text-gray-400">•</span>
                              <div className="flex-1">
                                <Input
                                  onChange={(e) =>
                                    handleUpdateHonor(
                                      index,
                                      honorIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., Dean's List, Magna Cum Laude, Academic Scholarship"
                                  value={honor}
                                />
                              </div>
                              <Button
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                  handleRemoveHonor(index, honorIndex)
                                }
                                size="sm"
                                type="button"
                                variant="ghost"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(education.honors || []).length === 0 && (
                        <p className="text-gray-500 text-sm">
                          Add any honors, awards, scholarships, or academic
                          achievements you received.
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
            className="w-full max-w-md"
            onClick={handleAddEducation}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Education
          </Button>
        </div>
      )}

      {/* Empty State - Only show when no education */}
      {profile.education.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
              No education added
            </h3>
            <p className="mb-6 text-gray-600">
              Add your educational background including degrees, certifications,
              and relevant coursework.
            </p>
            <Button onClick={handleAddEducation} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
