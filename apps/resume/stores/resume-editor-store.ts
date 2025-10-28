import { create } from "zustand";
import { updateResumeAction } from "../actions/resume/update-resume";
import type {
  BasicInfo,
  Certification,
  Education,
  Project,
  Skill,
  WorkExperience,
} from "../types/profile";
import type { Resume } from "../types/resume";

type ResumeEditorState = {
  // State
  resume: Resume | null;
  originalResume: Resume | null; // For conflict detection and change tracking
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  isAutoSaving: boolean;
  isSaving: boolean;
  error: string | null;

  // Initialization
  initializeResume: (resume: Resume) => void;
  resetStore: () => void;

  // Generic section updater
  updateSection: <T extends keyof Resume>(section: T, data: Resume[T]) => void;

  // Specific section updaters (type-safe convenience methods)
  updateBasicInfo: (info: Partial<BasicInfo>) => void;
  updateWorkExperience: (experience: WorkExperience[]) => void;
  updateEducation: (education: Education[]) => void;
  updateSkills: (skills: Skill[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateProfessionalSummary: (summary: string) => void;
  updateName: (name: string) => void;
  updateTargetRole: (targetRole: string) => void;
  updateSectionOrder: (order: string[]) => void;
  reorderSection: (fromIndex: number, toIndex: number) => void;

  // Save operations
  saveToDatabase: () => Promise<void>;
  markAsSaved: (updatedResume?: Resume) => void;
  setError: (error: string | null) => void;

  // Computed values
  getUnsavedChanges: () => Partial<Resume>;
  hasChangesInSection: (section: keyof Resume) => boolean;
};

export const useResumeEditorStore = create<ResumeEditorState>((set, get) => ({
  // Initial state
  resume: null,
  originalResume: null,
  hasUnsavedChanges: false,
  lastSaved: null,
  isAutoSaving: false,
  isSaving: false,
  error: null,

  // Initialize when loading resume
  initializeResume: (resume) =>
    set({
      resume,
      originalResume: structuredClone(resume),
      hasUnsavedChanges: false,
      error: null,
      lastSaved: null,
    }),

  // Reset store to initial state
  resetStore: () =>
    set({
      resume: null,
      originalResume: null,
      hasUnsavedChanges: false,
      lastSaved: null,
      isAutoSaving: false,
      isSaving: false,
      error: null,
    }),

  // Generic section updater
  updateSection: (section, data) => {
    const state = get();
    if (!state.resume) {
      return;
    }

    set({
      resume: {
        ...state.resume,
        [section]: data,
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
      error: null,
    });
  },

  // Convenience methods for type safety and better DX
  updateBasicInfo: (info) => {
    const state = get();
    if (!state.resume) {
      return;
    }

    set({
      resume: {
        ...state.resume,
        ...info,
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
      error: null,
    });
  },

  updateWorkExperience: (experience) =>
    get().updateSection("workExperience", experience),
  updateEducation: (education) => get().updateSection("education", education),
  updateSkills: (skills) => get().updateSection("skills", skills),
  updateProjects: (projects) => get().updateSection("projects", projects),
  updateCertifications: (certifications) =>
    get().updateSection("certifications", certifications),
  updateProfessionalSummary: (summary) =>
    get().updateSection("professionalSummary", summary),
  updateName: (name) => get().updateSection("name", name),
  updateTargetRole: (targetRole) =>
    get().updateSection("targetRole", targetRole),
  updateSectionOrder: (order) => get().updateSection("sectionOrder", order),
  reorderSection: (fromIndex, toIndex) => {
    const state = get();
    if (!state.resume?.sectionOrder) {
      return;
    }

    const currentOrder = [...state.resume.sectionOrder];
    const [movedSection] = currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, movedSection);

    get().updateSection("sectionOrder", currentOrder);
  },

  // Save operations
  saveToDatabase: async () => {
    const { resume, lastSaved } = get();
    if (!resume) {
      return;
    }

    set({ isAutoSaving: true, error: null });

    try {
      const result = await updateResumeAction({
        id: resume.id,
        data: resume,
        lastUpdated: lastSaved,
      });

      if (result.success && result.data) {
        get().markAsSaved(result.data);
      } else {
        set({
          error: result.error || "Failed to save resume",
          isAutoSaving: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        isAutoSaving: false,
      });
    }
  },

  markAsSaved: (updatedResume) => {
    const state = get();
    const resumeToSave = updatedResume || state.resume;

    set({
      hasUnsavedChanges: false,
      lastSaved: new Date(),
      originalResume: resumeToSave ? structuredClone(resumeToSave) : null,
      resume: updatedResume || state.resume,
      isAutoSaving: false,
      isSaving: false,
      error: null,
    });
  },

  setError: (error) => set({ error }),

  // Computed helpers
  getUnsavedChanges: () => {
    const { resume, originalResume } = get();
    if (!(resume && originalResume)) {
      return {};
    }

    const changes: Partial<Resume> = {};

    // Compare each field and add to changes if different
    for (const key of Object.keys(resume) as (keyof Resume)[]) {
      if (JSON.stringify(resume[key]) !== JSON.stringify(originalResume[key])) {
        (changes as any)[key] = resume[key];
      }
    }

    return changes;
  },

  hasChangesInSection: (section) => {
    const { resume, originalResume } = get();
    if (!(resume && originalResume)) {
      return false;
    }

    return (
      JSON.stringify(resume[section]) !==
      JSON.stringify(originalResume[section])
    );
  },
}));

// Stable selector functions to prevent infinite loops
const selectResume = (state: ResumeEditorState) => state.resume;
const selectHasUnsavedChanges = (state: ResumeEditorState) =>
  state.hasUnsavedChanges;
const selectIsAutoSaving = (state: ResumeEditorState) => state.isAutoSaving;
const selectError = (state: ResumeEditorState) => state.error;
const selectCanSave = (state: ResumeEditorState) =>
  state.hasUnsavedChanges &&
  !state.isAutoSaving &&
  !state.isSaving &&
  !!state.resume;

// Stable default arrays to prevent infinite loops
const EMPTY_ARRAY: never[] = [];
const DEFAULT_SECTION_ORDER = [
  "professional_summary",
  "work_experience",
  "skills",
  "projects",
  "education",
  "certifications",
];

// Stable section selectors
const selectWorkExperience = (state: ResumeEditorState) =>
  state.resume?.workExperience || EMPTY_ARRAY;
const selectEducation = (state: ResumeEditorState) =>
  state.resume?.education || EMPTY_ARRAY;

// Skills selector with caching to prevent reference issues
let cachedSkills: typeof EMPTY_ARRAY | null = null;
let cachedSkillsResumeId: string | null = null;
let cachedSkillsLength = 0;

const selectSkills = (state: ResumeEditorState) => {
  if (!state.resume) {
    cachedSkills = null;
    cachedSkillsResumeId = null;
    cachedSkillsLength = 0;
    return EMPTY_ARRAY;
  }

  const currentSkills = state.resume.skills || EMPTY_ARRAY;
  const currentLength = currentSkills.length;

  // If it's the same resume and skills array hasn't changed in length or content, return cached version
  if (
    state.resume.id === cachedSkillsResumeId &&
    currentLength === cachedSkillsLength &&
    cachedSkills &&
    JSON.stringify(currentSkills) === JSON.stringify(cachedSkills)
  ) {
    return cachedSkills;
  }

  // Update cache
  cachedSkills = currentSkills;
  cachedSkillsResumeId = state.resume.id;
  cachedSkillsLength = currentLength;

  return currentSkills;
};

const selectProjects = (state: ResumeEditorState) =>
  state.resume?.projects || EMPTY_ARRAY;
const selectCertifications = (state: ResumeEditorState) =>
  state.resume?.certifications || EMPTY_ARRAY;
const selectProfessionalSummary = (state: ResumeEditorState) =>
  state.resume?.professionalSummary || "";
const selectSectionOrder = (state: ResumeEditorState) =>
  state.resume?.sectionOrder || DEFAULT_SECTION_ORDER;

// Memoized basic info selector - returns null or the basic info object
// Using JSON.stringify comparison to ensure stable reference when data hasn't changed
let cachedBasicInfo: any = null;
let cachedResumeId: string | null = null;

const selectBasicInfo = (state: ResumeEditorState) => {
  if (!state.resume) {
    cachedBasicInfo = null;
    cachedResumeId = null;
    return null;
  }

  // If it's the same resume and basic info hasn't changed, return cached version
  if (state.resume.id === cachedResumeId && cachedBasicInfo) {
    const currentBasicInfo = {
      firstName: state.resume.firstName,
      lastName: state.resume.lastName,
      email: state.resume.email,
      phoneNumber: state.resume.phoneNumber,
      location: state.resume.location,
      website: state.resume.website,
      linkedinUrl: state.resume.linkedinUrl,
      githubUrl: state.resume.githubUrl,
    };

    if (JSON.stringify(currentBasicInfo) === JSON.stringify(cachedBasicInfo)) {
      return cachedBasicInfo;
    }
  }

  // Create new basic info object and cache it
  cachedBasicInfo = {
    firstName: state.resume.firstName,
    lastName: state.resume.lastName,
    email: state.resume.email,
    phoneNumber: state.resume.phoneNumber,
    location: state.resume.location,
    website: state.resume.website,
    linkedinUrl: state.resume.linkedinUrl,
    githubUrl: state.resume.githubUrl,
  };
  cachedResumeId = state.resume.id;

  return cachedBasicInfo;
};

// Selector hooks for better performance
export const useResumeData = () => useResumeEditorStore(selectResume);
export const useHasUnsavedChanges = () =>
  useResumeEditorStore(selectHasUnsavedChanges);
export const useIsAutoSaving = () => useResumeEditorStore(selectIsAutoSaving);
export const useResumeError = () => useResumeEditorStore(selectError);
export const useCanSave = () => useResumeEditorStore(selectCanSave);

// Section-specific selectors
export const useResumeBasicInfo = () => useResumeEditorStore(selectBasicInfo);
export const useResumeWorkExperience = () =>
  useResumeEditorStore(selectWorkExperience);
export const useResumeEducation = () => useResumeEditorStore(selectEducation);
export const useResumeSkills = () => useResumeEditorStore(selectSkills);
export const useResumeProjects = () => useResumeEditorStore(selectProjects);
export const useResumeCertifications = () =>
  useResumeEditorStore(selectCertifications);
export const useResumeProfessionalSummary = () =>
  useResumeEditorStore(selectProfessionalSummary);
export const useResumeSectionOrder = () =>
  useResumeEditorStore(selectSectionOrder);
