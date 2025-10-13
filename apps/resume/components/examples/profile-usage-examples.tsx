'use client';

import { Avatar, AvatarFallback } from '@repo/design-system/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Loader2, User, Mail, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { 
  useProfile, 
  useCachedProfile, 
  usePrefetchProfile,
  useInvalidateProfile 
} from '../../lib/profile-queries';

/**
 * Example 1: Header/Navigation Profile Display
 * Shows cached profile data immediately without loading states
 */
export function ProfileHeader() {
  const { profile, hasCache } = useCachedProfile();
  
  if (!hasCache || !profile) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`;
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials || 'U'}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">
        {fullName || 'Anonymous User'}
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
            <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
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
          <p className="text-sm text-muted-foreground">No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">{initials || 'U'}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">
              {fullName || 'Complete Your Profile'}
            </CardTitle>
            {profile.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.email && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {profile.email}
                </Badge>
              )}
              {profile.website && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Website
                </Badge>
              )}
              {profile.githubUrl && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  GitHub
                </Badge>
              )}
              {profile.linkedinUrl && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {profile.workExperience?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {profile.projects?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {profile.skills?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Skills</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {profile.education?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Education</div>
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
              <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
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
          <CardDescription>Add skills to your profile to showcase your expertise</CardDescription>
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
                <span className="ml-1 text-xs text-muted-foreground">
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
      href="/profile"
      onMouseEnter={prefetchProfile}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
      onClick={handleRefreshProfile}
      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
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
          <p className="text-sm text-muted-foreground">Create your profile to get started</p>
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
  const completionPercentage = Math.round((completedFields / totalFields) * 100);
  
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
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completionPercentage < 100 
              ? `Complete your profile to improve your visibility`
              : `Great! Your profile is complete`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}