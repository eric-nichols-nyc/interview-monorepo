'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Save } from 'lucide-react';
import { useProfileStore } from '../../../../stores/profile-store';
import { useUpdateProfile, useProfile } from '../../../../lib/profile-queries';
import { ProfileFormData, ProfileTab, TabConfig } from '../../../../types/profile';
import { BasicInfoForm } from './basic-info-form';
import { WorkExperienceForm, ProjectsForm, EducationForm, SkillsForm } from './form-placeholders';

const TABS: TabConfig[] = [
  { id: 'basic', label: 'Basic Info', description: 'Personal information and contact details' },
  { id: 'experience', label: 'Work Experience', description: 'Professional work history' },
  { id: 'projects', label: 'Projects', description: 'Personal and professional projects' },
  { id: 'education', label: 'Education', description: 'Educational background' },
  { id: 'skills', label: 'Skills', description: 'Technical and professional skills' },
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

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Load server data into Zustand store when available
  useEffect(() => {
    if (serverProfile && !isDirty) {
      const formData: ProfileFormData = {
        firstName: serverProfile.firstName || '',
        lastName: serverProfile.lastName || '',
        email: serverProfile.email || '',
        phoneNumber: serverProfile.phoneNumber || '',
        location: serverProfile.location || '',
        website: serverProfile.website || '',
        linkedinUrl: serverProfile.linkedinUrl || '',
        githubUrl: serverProfile.githubUrl || '',
        workExperience: Array.isArray(serverProfile.workExperience) ? serverProfile.workExperience : [],
        education: Array.isArray(serverProfile.education) ? serverProfile.education : [],
        skills: Array.isArray(serverProfile.skills) ? serverProfile.skills : [],
        projects: Array.isArray(serverProfile.projects) ? serverProfile.projects : [],
        certifications: Array.isArray(serverProfile.certifications) ? serverProfile.certifications : [],
      };
      loadProfile(formData);
    }
  }, [serverProfile, isDirty, loadProfile]);

  // Auto-clear save status after 3 seconds
  useEffect(() => {
    if (saveStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleSave = async () => {
    // Clear previous errors
    clearErrors();
    setSaveStatus('idle');
    setSaveMessage('');

    // Validate form
    if (!validateForm()) {
      setSaveStatus('error');
      setSaveMessage('Please fix validation errors before saving');
      return;
    }

    // Use TanStack Query mutation
    updateMutation.mutate(profile, {
      onSuccess: (result) => {
        if (result.success) {
          setSaveStatus('success');
          setSaveMessage('Profile saved successfully!');
          
          // Update the original profile in Zustand to mark as clean
          loadProfile(profile);
        } else {
          setSaveStatus('error');
          setSaveMessage(result.error || 'Failed to save profile');

          // Set field errors if provided
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          }
        }
      },
      onError: (error) => {
        console.error('Save error:', error);
        setSaveStatus('error');
        setSaveMessage(error.message || 'An unexpected error occurred');
      },
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as ProfileTab);
  };

  const getTabErrors = (tabId: ProfileTab): boolean => {
    const tabErrorKeys = Object.keys(errors);
    
    switch (tabId) {
      case 'basic':
        return tabErrorKeys.some(key => 
          ['firstName', 'lastName', 'email', 'phoneNumber', 'location', 'website', 'linkedinUrl', 'githubUrl'].includes(key)
        );
      case 'experience':
        return tabErrorKeys.some(key => key.startsWith('workExperience'));
      case 'projects':
        return tabErrorKeys.some(key => key.startsWith('projects'));
      case 'education':
        return tabErrorKeys.some(key => key.startsWith('education'));
      case 'skills':
        return tabErrorKeys.some(key => key.startsWith('skills'));
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information across multiple sections
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Save Status Indicator */}
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              {saveMessage}
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              {saveMessage}
            </div>
          )}
          
          {/* Unsaved Changes Indicator */}
          {isDirty && saveStatus === 'idle' && (
            <span className="text-sm text-orange-600">Unsaved changes</span>
          )}
          
          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending || isLoadingProfile}
            className="min-w-[120px]"
          >
            {(updateMutation.isPending || isLoadingProfile) ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {isLoadingProfile ? 'Loading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`relative ${getTabErrors(tab.id) ? 'text-red-600' : ''}`}
                >
                  {tab.label}
                  {getTabErrors(tab.id) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{tab.label}</h3>
                    <p className="text-sm text-muted-foreground">{tab.description}</p>
                  </div>

                  <div className="space-y-4">
                    {tab.id === 'basic' && <BasicInfoForm />}
                    {tab.id === 'experience' && <WorkExperienceForm />}
                    {tab.id === 'projects' && <ProjectsForm />}
                    {tab.id === 'education' && <EducationForm />}
                    {tab.id === 'skills' && <SkillsForm />}
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
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle size={20} />
              Form Validation Errors
            </CardTitle>
            <CardDescription className="text-red-700">
              Please fix the following errors before saving:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <strong>{field}:</strong> {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}