"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { useProfile } from "../../../../../hooks/queries/profile-queries";
import {
  useResumeBasicInfo,
  useResumeEditorStore,
  useResumeProfessionalSummary,
} from "../../../../../stores/resume-editor-store";

export function BasicInfoContent() {
  const basicInfo = useResumeBasicInfo();
  const professionalSummary = useResumeProfessionalSummary();
  const updateBasicInfo = useResumeEditorStore(
    (state) => state.updateBasicInfo
  );
  const updateProfessionalSummary = useResumeEditorStore(
    (state) => state.updateProfessionalSummary
  );
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useProfile();

  // Handler to update a specific field
  const handleFieldChange = (field: string, value: string) => {
    updateBasicInfo({ [field]: value });
  };

  // Handler to fill from profile data
  const handleFillFromProfile = async () => {
    // If no profile loaded yet, try to fetch it first
    if (!(profile || profileLoading)) {
      await refetchProfile();
    }

    // Use the profile data (either existing or newly fetched)
    const profileData = profile;
    if (profileData) {
      updateBasicInfo({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        location: profileData.location || "",
        website: profileData.website || "",
        linkedinUrl: profileData.linkedinUrl || "",
        githubUrl: profileData.githubUrl || "",
      });
    }
  };

  return (
    <div className="w-full pt-4">
      <div className="mb-4 flex w-full items-center justify-between">
        <Button
          className="h-[40px] w-full"
          disabled={profileLoading}
          onClick={handleFillFromProfile}
          size="sm"
          variant="outline"
        >
          {profileLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading Profile...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Fill from Profile
            </>
          )}
        </Button>
      </div>
      <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
              placeholder="Enter first name"
              value={basicInfo?.firstName || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
              placeholder="Enter last name"
              value={basicInfo?.lastName || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="email@example.com"
              type="email"
              value={basicInfo?.email || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              placeholder="+1 (555) 000-0000"
              type="tel"
              value={basicInfo?.phoneNumber || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              onChange={(e) => handleFieldChange("location", e.target.value)}
              placeholder="City, State"
              value={basicInfo?.location || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              onChange={(e) => handleFieldChange("website", e.target.value)}
              placeholder="https://example.com"
              type="url"
              value={basicInfo?.website || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              onChange={(e) => handleFieldChange("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              type="url"
              value={basicInfo?.linkedinUrl || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              onChange={(e) => handleFieldChange("githubUrl", e.target.value)}
              placeholder="https://github.com/username"
              type="url"
              value={basicInfo?.githubUrl || ""}
            />
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="professionalSummary">Professional Summary</Label>
          <Textarea
            className="resize-none"
            id="professionalSummary"
            onChange={(e) => updateProfessionalSummary(e.target.value)}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
            value={professionalSummary || ""}
          />
          <p className="text-muted-foreground text-xs">
            A concise overview of your professional background and key
            qualifications (2-4 sentences recommended).
          </p>
        </div>
      </div>
    </div>
  );
}
