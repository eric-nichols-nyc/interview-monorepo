# User Profile Data Management Strategy

## Overview

This document outlines the data management strategy for the user profile multi-step form with 5 tabbed sections. The form allows users to edit their profile information across multiple tabs and saves all changes only when they click "Save Changes".

## Profile Model Structure

Based on the `Profile` model in `packages/database/prisma/schema.prisma`:

```typescript
interface Profile {
  userId: string;
  // Basic Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  
  // Complex sections (JSON fields)
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

## Form Section Mapping

### 1. Basic Info
- `firstName`, `lastName`, `email`
- `phoneNumber`, `location`
- `website`, `linkedinUrl`, `githubUrl`

### 2. Work Experience
- `workExperience` (JSON array)
- Fields: company, position, startDate, endDate, description, etc.

### 3. Projects
- `projects` (JSON array)
- Fields: name, description, technologies, url, startDate, endDate, etc.

### 4. Education
- `education` (JSON array)
- Fields: institution, degree, fieldOfStudy, startDate, endDate, gpa, etc.

### 5. Skills
- `skills` (JSON array)
- Fields: name, category, proficiency, etc.

## Data Management Strategy

### Option 1: React Hook Form with Zod (Recommended)

**Advantages:**
- ✅ Built-in validation
- ✅ Optimized re-renders
- ✅ Easy form state management
- ✅ TypeScript support
- ✅ Works well with complex nested forms

**Implementation:**
```typescript
// lib/profile-schema.ts
import { z } from 'zod';

const workExperienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  workExperience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
});

// components/profile-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const ProfileForm = ({ initialData }: { initialData: Profile }) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormData) => {
    // Save to database
    await updateProfile(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Tabs>
        <TabsContent value="basic">
          <BasicInfoForm form={form} />
        </TabsContent>
        <TabsContent value="experience">
          <WorkExperienceForm form={form} />
        </TabsContent>
        {/* ... other tabs */}
      </Tabs>
      
      <Button type="submit">Save Changes</Button>
    </form>
  );
};
```

### Option 2: Context API + useReducer

**Advantages:**
- ✅ Full control over state management
- ✅ Good for complex state logic
- ✅ Can implement auto-save easily

**Implementation:**
```typescript
// context/profile-context.tsx
const ProfileContext = createContext<{
  profile: ProfileFormData;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateWorkExperience: (data: WorkExperience[]) => void;
  // ... other updaters
  saveProfile: () => Promise<void>;
  isDirty: boolean;
}>({});

export const ProfileProvider = ({ children, initialData }) => {
  const [state, dispatch] = useReducer(profileReducer, {
    data: initialData,
    originalData: initialData,
    isDirty: false,
  });

  const saveProfile = async () => {
    await updateProfile(state.data);
    dispatch({ type: 'MARK_CLEAN' });
  };

  return (
    <ProfileContext.Provider value={{ ...state, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

### Option 3: Zustand Store (Simple & Effective)

**Advantages:**
- ✅ Minimal boilerplate
- ✅ TypeScript-first
- ✅ Easy to implement
- ✅ Good performance

**Implementation:**
```typescript
// stores/profile-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProfileStore {
  profile: ProfileFormData;
  originalProfile: ProfileFormData;
  isDirty: boolean;
  
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateWorkExperience: (data: WorkExperience[]) => void;
  addWorkExperience: (item: WorkExperience) => void;
  removeWorkExperience: (index: number) => void;
  
  saveProfile: () => Promise<void>;
  resetForm: () => void;
  loadProfile: (data: ProfileFormData) => void;
}

export const useProfileStore = create<ProfileStore>()(
  devtools((set, get) => ({
    profile: initialProfile,
    originalProfile: initialProfile,
    isDirty: false,
    
    updateBasicInfo: (data) => 
      set((state) => ({
        profile: { ...state.profile, ...data },
        isDirty: true,
      })),
      
    updateWorkExperience: (data) =>
      set((state) => ({
        profile: { ...state.profile, workExperience: data },
        isDirty: true,
      })),
      
    saveProfile: async () => {
      const { profile } = get();
      await updateProfile(profile);
      set({ originalProfile: profile, isDirty: false });
    },
    
    resetForm: () =>
      set((state) => ({
        profile: state.originalProfile,
        isDirty: false,
      })),
  }))
);
```

## Recommended Architecture

### File Structure
```
apps/app/
├── components/
│   ├── profile/
│   │   ├── profile-form.tsx          # Main form wrapper
│   │   ├── basic-info-form.tsx       # Tab 1
│   │   ├── work-experience-form.tsx  # Tab 2
│   │   ├── projects-form.tsx         # Tab 3
│   │   ├── education-form.tsx        # Tab 4
│   │   └── skills-form.tsx           # Tab 5
│   └── ui/
│       └── tabs.tsx                  # Reusable tabs component
├── lib/
│   ├── profile-schema.ts             # Zod validation schemas
│   └── profile-actions.ts            # Server actions
└── stores/
    └── profile-store.ts              # Zustand store (if using)
```

### Key Features to Implement

1. **Auto-save Draft (Optional)**
   - Save form state to localStorage
   - Restore on page reload
   - Clear on successful save

2. **Validation**
   - Real-time validation per tab
   - Show validation errors before save
   - Prevent save if invalid

3. **Unsaved Changes Warning**
   - Warn user before navigating away
   - Show "unsaved changes" indicator

4. **Loading States**
   - Show loading during save
   - Disable form during save
   - Success/error notifications

### Implementation Steps

1. **Set up the form structure** with tabs component
2. **Choose state management solution** (recommend Zustand for simplicity)
3. **Implement validation schemas** with Zod
4. **Create individual tab forms** with proper form controls
5. **Add save functionality** with server actions
6. **Implement UX enhancements** (auto-save, validation, etc.)

### Server Actions

```typescript
// lib/profile-actions.ts
'use server';

export async function updateProfile(data: ProfileFormData) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Unauthorized');

  const validatedData = profileSchema.parse(data);
  
  return await prisma.profile.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, ...validatedData },
    update: validatedData,
  });
}

export async function getProfile(userId: string) {
  return await prisma.profile.findUnique({
    where: { userId },
  });
}
```

## Best Practices

- **Validate early and often** - Use schema validation for consistent data
- **Provide clear feedback** - Show users what's happening during saves
- **Handle errors gracefully** - Display meaningful error messages
- **Optimize performance** - Use proper React patterns to minimize re-renders
- **Test thoroughly** - Include unit tests for complex form logic

This strategy provides a robust, scalable solution for managing complex profile data across multiple form tabs while maintaining a great user experience.