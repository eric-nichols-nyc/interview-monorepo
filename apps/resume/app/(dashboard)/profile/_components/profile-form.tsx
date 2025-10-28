"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { AlertCircle, CheckCircle, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useProfile,
  useUpdateProfile,
} from "../../../../hooks/queries/profile-queries";
import { useProfileStore } from "../../../../stores/profile-store";
import type {
  ProfileFormData,
  ProfileTab,
  TabConfig,
} from "../../../../types/profile";
import { BasicInfoForm } from "./basic-info-form";
import { EducationForm } from "./education-form";
import { ProjectsForm } from "./projects-form";
import { SkillsForm } from "./skills-form";
import { WorkExperienceForm } from "./work-experience-form";

const TABS: TabConfig[] = [
  {
    id: "basic",
    label: "Basic Info",
    description: "Personal information and contact details",
  },
  {
    id: "experience",
    label: "Work Experience",
    description: "Professional work history",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Personal and professional projects",
  },
  {
    id: "education",
    label: "Education",
    description: "Educational background",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Technical and professional skills",
  },
];

export function ProfileForm() {
  const {
    profile,
    originalProfile,
    isDirty,
    errors,
    currentTab,
    loadProfile,
    setCurrentTab,
    setErrors,
    clearErrors,
    validateForm,
  } = useProfileStore();

  // TanStack Query hooks
  const { data: serverProfile, isLoading: isLoadingProfile } = useProfile();
  const updateMutation = useUpdateProfile();

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [saveMessage, setSaveMessage] = useState("");

  // Load server data into Zustand store when available
  useEffect(() => {
    if (serverProfile && !isDirty) {
      const formData: ProfileFormData = {
        firstName: serverProfile.firstName || "",
        lastName: serverProfile.lastName || "",
        email: serverProfile.email || "",
        phoneNumber: serverProfile.phoneNumber || "",
        location: serverProfile.location || "",
        website: serverProfile.website || "",
        linkedinUrl: serverProfile.linkedinUrl || "",
        githubUrl: serverProfile.githubUrl || "",
        workExperience: Array.isArray(serverProfile.workExperience)
          ? serverProfile.workExperience
          : [],
        education: Array.isArray(serverProfile.education)
          ? serverProfile.education
          : [],
        skills: Array.isArray(serverProfile.skills) ? serverProfile.skills : [],
        projects: Array.isArray(serverProfile.projects)
          ? serverProfile.projects
          : [],
        certifications: Array.isArray(serverProfile.certifications)
          ? serverProfile.certifications
          : [],
      };
      loadProfile(formData);
    }
  }, [serverProfile, isDirty, loadProfile]);

  // Auto-clear save status after 3 seconds
  useEffect(() => {
    if (saveStatus !== "idle") {
      const timer = setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleSave = async () => {
    // Clear previous errors
    clearErrors();
    setSaveStatus("idle");
    setSaveMessage("");

    // Validate form
    if (!validateForm()) {
      setSaveStatus("error");
      setSaveMessage("Please fix validation errors before saving");
      return;
    }

    // Use TanStack Query mutation
    updateMutation.mutate(profile, {
      onSuccess: (result) => {
        if (result.success) {
          setSaveStatus("success");
          setSaveMessage("Profile saved successfully!");

          // Update the original profile in Zustand to mark as clean
          loadProfile(profile);
        } else {
          setSaveStatus("error");
          setSaveMessage(result.error || "Failed to save profile");

          // Set field errors if provided
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          }
        }
      },
      onError: (error) => {
        setSaveStatus("error");
        setSaveMessage(error.message || "An unexpected error occurred");
      },
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as ProfileTab);
  };

  const getTabErrors = (tabId: ProfileTab): boolean => {
    const tabErrorKeys = Object.keys(errors);

    switch (tabId) {
      case "basic":
        return tabErrorKeys.some((key) =>
          [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "location",
            "website",
            "linkedinUrl",
            "githubUrl",
          ].includes(key)
        );
      case "experience":
        return tabErrorKeys.some((key) => key.startsWith("workExperience"));
      case "projects":
        return tabErrorKeys.some((key) => key.startsWith("projects"));
      case "education":
        return tabErrorKeys.some((key) => key.startsWith("education"));
      case "skills":
        return tabErrorKeys.some((key) => key.startsWith("skills"));
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information across multiple sections
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status Indicator */}
          {saveStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={16} />
              {saveMessage}
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {saveMessage}
            </div>
          )}

          {/* Unsaved Changes Indicator */}
          {isDirty && saveStatus === "idle" && (
            <span className="text-orange-600 text-sm">Unsaved changes</span>
          )}

          {/* Save Button */}
          <Button
            className="min-w-[120px]"
            disabled={!isDirty || updateMutation.isPending || isLoadingProfile}
            onClick={handleSave}
          >
            {updateMutation.isPending || isLoadingProfile ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} />
                {isLoadingProfile ? "Loading..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="mr-2" size={16} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <Card>
        <CardContent className="p-6">
          <Tabs onValueChange={handleTabChange} value={currentTab}>
            <TabsList className="grid w-full grid-cols-5">
              {TABS.map((tab) => (
                <TabsTrigger
                  className={`relative ${getTabErrors(tab.id) ? "text-red-600" : ""}`}
                  key={tab.id}
                  value={tab.id}
                >
                  {tab.label}
                  {getTabErrors(tab.id) && (
                    <span className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent className="mt-6" key={tab.id} value={tab.id}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{tab.label}</h3>
                    <p className="text-muted-foreground text-sm">
                      {tab.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {tab.id === "basic" && <BasicInfoForm />}
                    {tab.id === "experience" && <WorkExperienceForm />}
                    {tab.id === "projects" && <ProjectsForm />}
                    {tab.id === "education" && <EducationForm />}
                    {tab.id === "skills" && <SkillsForm />}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Global Form Errors */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              Form Validation Errors
            </CardTitle>
            <CardDescription className="text-red-700">
              Please fix the following errors before saving:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-red-700 text-sm">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <strong>{field}:</strong>{" "}
                  {Array.isArray(fieldErrors)
                    ? fieldErrors.join(", ")
                    : fieldErrors}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
