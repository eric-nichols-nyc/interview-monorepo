"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Card } from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useProfile } from "../../../../../../hooks/queries/profile-queries";
import {
  useResumeEditorStore,
  useResumeWorkExperience,
} from "../../../../../../stores/resume-editor-store";
import type { WorkExperience } from "../../../../../../types/profile";
import { BulletPointsSection } from "./bullet-points-section";

export function WorkContent() {
  const workExperiences = useResumeWorkExperience();
  const updateWorkExperience = useResumeEditorStore(
    (state) => state.updateWorkExperience
  );
  const { data: profile, isLoading: profileLoading } = useProfile();
  const [currentEditingIndex, setCurrentEditingIndex] = useState(0);

  // Get current work experience being edited
  const currentExperience = workExperiences[currentEditingIndex] || {
    id: Date.now().toString(),
    company: "",
    position: "",
    location: "",
    date: "",
    description: [],
    technologies: [],
  };

  // Update a specific field of current work experience
  const updateCurrentExperience = (
    field: keyof WorkExperience,
    value: WorkExperience[keyof WorkExperience]
  ) => {
    const updatedExperiences = [...workExperiences];
    if (currentEditingIndex >= updatedExperiences.length) {
      // Adding new experience
      updatedExperiences.push({ ...currentExperience, [field]: value });
    } else {
      // Updating existing experience
      updatedExperiences[currentEditingIndex] = {
        ...updatedExperiences[currentEditingIndex],
        [field]: value,
      };
    }
    updateWorkExperience(updatedExperiences);
  };

  // Add new work experience
  const addNewExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      date: "",
      description: [],
      technologies: [],
    };
    const updatedExperiences = [...workExperiences, newExperience];
    updateWorkExperience(updatedExperiences);
    setCurrentEditingIndex(updatedExperiences.length - 1);
  };

  // Delete current work experience
  const deleteCurrentExperience = () => {
    if (workExperiences.length <= 1) {
      return; // Keep at least one
    }
    const updatedExperiences = workExperiences.filter(
      (_: WorkExperience, index: number) => index !== currentEditingIndex
    );
    updateWorkExperience(updatedExperiences);
    setCurrentEditingIndex(Math.max(0, currentEditingIndex - 1));
  };

  // Import from profile
  const importFromProfile = () => {
    if (profile?.workExperience?.length) {
      updateWorkExperience(profile.workExperience);
      setCurrentEditingIndex(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          className="border-primary bg-transparent text-primary hover:bg-primary/10"
          onClick={addNewExperience}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Work Experience
        </Button>
        <Button
          className="border-border bg-transparent"
          disabled={profileLoading || !profile?.workExperience?.length}
          onClick={importFromProfile}
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

      {/* Experience Navigator */}
      {workExperiences.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Editing:</span>
          <div className="flex gap-1">
            {workExperiences.map((exp: WorkExperience, index: number) => (
              <Button
                className="h-8 w-8 p-0"
                key={exp.id}
                onClick={() => setCurrentEditingIndex(index)}
                size="sm"
                variant={currentEditingIndex === index ? "default" : "outline"}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <span className="text-muted-foreground text-xs">
            ({currentEditingIndex + 1} of {workExperiences.length})
          </span>
        </div>
      )}

      {/* Main Form Card */}
      <Card className="border-border bg-secondary/30 p-6">
        <div className="space-y-6">
          {/* Position Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                htmlFor="position"
              >
                Position
              </Label>
              {workExperiences.length > 1 && (
                <Button
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={deleteCurrentExperience}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              className="border-border bg-card font-medium text-base"
              id="position"
              onChange={(e) =>
                updateCurrentExperience("position", e.target.value)
              }
              placeholder="e.g., Senior Front-end Developer"
              value={currentExperience.position}
            />
          </div>

          {/* Company and Location Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                htmlFor="company"
              >
                Company
              </Label>
              <Input
                className="border-border bg-card"
                id="company"
                onChange={(e) =>
                  updateCurrentExperience("company", e.target.value)
                }
                placeholder="e.g., IBM"
                value={currentExperience.company}
              />
            </div>
            <div className="space-y-2">
              <Label
                className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
                htmlFor="location"
              >
                Location
              </Label>
              <Input
                className="border-border bg-card"
                id="location"
                onChange={(e) =>
                  updateCurrentExperience("location", e.target.value)
                }
                placeholder="e.g., New York, NY"
                value={currentExperience.location}
              />
            </div>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <Label
              className="font-medium text-muted-foreground text-xs uppercase tracking-wide"
              htmlFor="date"
            >
              Date
            </Label>
            <Input
              className="border-border bg-card"
              id="date"
              onChange={(e) => updateCurrentExperience("date", e.target.value)}
              placeholder="e.g., June 2019 - Present"
              value={currentExperience.date}
            />
            <p className="text-muted-foreground text-xs">
              Use &apos;Present&apos; in the date field for current positions
            </p>
          </div>

          {/* Key Responsibilities Section */}
          <BulletPointsSection
            bulletPoints={currentExperience.description}
            onUpdate={(bulletPoints) =>
              updateCurrentExperience("description", bulletPoints)
            }
          />
        </div>
      </Card>
    </div>
  );
}
