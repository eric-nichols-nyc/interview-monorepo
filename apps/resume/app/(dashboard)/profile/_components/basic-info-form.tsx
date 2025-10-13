"use client";

import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { useProfileStore } from "../../../../stores/profile-store";
import type { BasicInfo } from "../../../../types/profile";

export function BasicInfoForm() {
  const { profile, updateBasicInfo, errors } = useProfileStore();

  const handleInputChange = (field: keyof BasicInfo, value: string) => {
    updateBasicInfo({ [field]: value });
  };
  // look
  const getFieldError = (field: string): string | undefined =>
    errors[field]?.[0];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          className={getFieldError("firstName") ? "border-red-500" : ""}
          id="firstName"
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          placeholder="Enter your first name"
          type="text"
          value={profile.firstName || ""}
        />
        {getFieldError("firstName") && (
          <p className="text-red-600 text-sm">{getFieldError("firstName")}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          className={getFieldError("lastName") ? "border-red-500" : ""}
          id="lastName"
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          placeholder="Enter your last name"
          type="text"
          value={profile.lastName || ""}
        />
        {getFieldError("lastName") && (
          <p className="text-red-600 text-sm">{getFieldError("lastName")}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          className={getFieldError("email") ? "border-red-500" : ""}
          id="email"
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email address"
          type="email"
          value={profile.email || ""}
        />
        {getFieldError("email") && (
          <p className="text-red-600 text-sm">{getFieldError("email")}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          className={getFieldError("phoneNumber") ? "border-red-500" : ""}
          id="phoneNumber"
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          placeholder="Enter your phone number"
          type="tel"
          value={profile.phoneNumber || ""}
        />
        {getFieldError("phoneNumber") && (
          <p className="text-red-600 text-sm">{getFieldError("phoneNumber")}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          className={getFieldError("location") ? "border-red-500" : ""}
          id="location"
          onChange={(e) => handleInputChange("location", e.target.value)}
          placeholder="City, State/Country"
          type="text"
          value={profile.location || ""}
        />
        {getFieldError("location") && (
          <p className="text-red-600 text-sm">{getFieldError("location")}</p>
        )}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          className={getFieldError("website") ? "border-red-500" : ""}
          id="website"
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://your-website.com"
          type="url"
          value={profile.website || ""}
        />
        {getFieldError("website") && (
          <p className="text-red-600 text-sm">{getFieldError("website")}</p>
        )}
      </div>

      {/* LinkedIn URL */}
      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
        <Input
          className={getFieldError("linkedinUrl") ? "border-red-500" : ""}
          id="linkedinUrl"
          onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/username"
          type="url"
          value={profile.linkedinUrl || ""}
        />
        {getFieldError("linkedinUrl") && (
          <p className="text-red-600 text-sm">{getFieldError("linkedinUrl")}</p>
        )}
      </div>

      {/* GitHub URL */}
      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub Profile</Label>
        <Input
          className={getFieldError("githubUrl") ? "border-red-500" : ""}
          id="githubUrl"
          onChange={(e) => handleInputChange("githubUrl", e.target.value)}
          placeholder="https://github.com/username"
          type="url"
          value={profile.githubUrl || ""}
        />
        {getFieldError("githubUrl") && (
          <p className="text-red-600 text-sm">{getFieldError("githubUrl")}</p>
        )}
      </div>
    </div>
  );
}
