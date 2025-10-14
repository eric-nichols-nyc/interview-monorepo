"use client";

import {
  Avatar,
  AvatarFallback,
} from "@repo/design-system/components/ui/avatar";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import {
  useCachedProfile,
  useInvalidateProfile,
  usePrefetchProfile,
  useProfile,
} from "../../hooks/queries/profile-queries";

/**
 * Example 1: Header/Navigation Profile Display
 * Shows cached profile data immediately without loading states
 */
export function ProfileHeader() {
  const { profile, hasCache } = useCachedProfile();

  if (!(hasCache && profile)) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`;
  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-sm">
        {fullName || "Anonymous User"}
      </span>
    </div>
  );
}

/**
 * Example 2: Profile Summary Card
 * Uses fresh data with loading states for main content areas
 */
export function ProfileSummaryCard() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm">
            No profile data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-xl">
              {fullName || "Complete Your Profile"}
            </CardTitle>
            {profile.location && (
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.location}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.email && (
                <Badge className="flex items-center gap-1" variant="secondary">
                  <Mail className="h-3 w-3" />
                  {profile.email}
                </Badge>
              )}
              {profile.website && (
                <Badge className="flex items-center gap-1" variant="secondary">
                  <Globe className="h-3 w-3" />
                  Website
                </Badge>
              )}
              {profile.githubUrl && (
                <Badge className="flex items-center gap-1" variant="secondary">
                  <Github className="h-3 w-3" />
                  GitHub
                </Badge>
              )}
              {profile.linkedinUrl && (
                <Badge className="flex items-center gap-1" variant="secondary">
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="font-bold text-2xl text-primary">
              {profile.workExperience?.length || 0}
            </div>
            <div className="text-muted-foreground text-sm">Experience</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-primary">
              {profile.projects?.length || 0}
            </div>
            <div className="text-muted-foreground text-sm">Projects</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-primary">
              {profile.skills?.length || 0}
            </div>
            <div className="text-muted-foreground text-sm">Skills</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-primary">
              {profile.education?.length || 0}
            </div>
            <div className="text-muted-foreground text-sm">Education</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Example 3: Skills Display
 * Shows how to use nested profile data arrays
 */
export function ProfileSkills() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                className="h-6 w-16 animate-pulse rounded bg-gray-200"
                key={i}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile?.skills?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add skills to your profile to showcase your expertise
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <Badge key={skill.id || index} variant="outline">
              {skill.name}
              {skill.proficiency && (
                <span className="ml-1 text-muted-foreground text-xs">
                  ({skill.proficiency})
                </span>
              )}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Example 4: Navigation Link with Prefetch
 * Shows how to prefetch profile data for better UX
 */
export function ProfileNavLink() {
  const prefetchProfile = usePrefetchProfile();

  return (
    <a
      className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100"
      href="/profile"
      onMouseEnter={prefetchProfile}
    >
      Edit Profile
    </a>
  );
}

/**
 * Example 5: Admin Actions
 * Shows how to invalidate cache when needed
 */
export function AdminProfileActions() {
  const invalidateProfile = useInvalidateProfile();

  const handleRefreshProfile = () => {
    invalidateProfile();
  };

  return (
    <button
      className="rounded bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
      onClick={handleRefreshProfile}
    >
      Refresh Profile Data
    </button>
  );
}

/**
 * Example 6: Dashboard Widget
 * Shows profile completeness and encourages completion
 */
export function ProfileCompletenessWidget() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm">
            Create your profile to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const fields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.location,
    profile.workExperience?.length > 0,
    profile.skills?.length > 0,
    profile.education?.length > 0,
  ];

  const completedFields = fields.filter(Boolean).length;
  const totalFields = fields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile Completeness</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            {completionPercentage < 100
              ? "Complete your profile to improve your visibility"
              : "Great! Your profile is complete"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
