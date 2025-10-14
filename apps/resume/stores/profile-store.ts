import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { validateProfile } from "../schemas/profile-schema";
import type {
  BasicInfo,
  Certification,
  Education,
  ProfileFormData,
  ProfileTab,
  Project,
  Skill,
  WorkExperience,
} from "../types/profile";

type ProfileStore = {
  // State
  profile: ProfileFormData;
  originalProfile: ProfileFormData;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string[]>;
  currentTab: ProfileTab;

  // Actions
  loadProfile: (data: ProfileFormData) => void;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;

  // Work Experience Actions
  updateWorkExperience: (data: WorkExperience[]) => void;
  addWorkExperience: (item: WorkExperience) => void;
  updateWorkExperienceItem: (
    index: number,
    item: Partial<WorkExperience>
  ) => void;
  removeWorkExperience: (index: number) => void;

  // Education Actions
  updateEducation: (data: Education[]) => void;
  addEducation: (item: Education) => void;
  updateEducationItem: (index: number, item: Partial<Education>) => void;
  removeEducation: (index: number) => void;

  // Projects Actions
  updateProjects: (data: Project[]) => void;
  addProject: (item: Project) => void;
  updateProjectItem: (index: number, item: Partial<Project>) => void;
  removeProject: (index: number) => void;

  // Skills Actions
  updateSkills: (data: Skill[]) => void;
  addSkill: (item: Skill) => void;
  updateSkillItem: (index: number, item: Partial<Skill>) => void;
  removeSkill: (index: number) => void;

  // Certifications Actions
  updateCertifications: (data: Certification[]) => void;
  addCertification: (item: Certification) => void;
  updateCertificationItem: (
    index: number,
    item: Partial<Certification>
  ) => void;
  removeCertification: (index: number) => void;

  // Form Actions
  setCurrentTab: (tab: ProfileTab) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  setErrors: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
};

const initialProfile: ProfileFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  location: "",
  website: "",
  linkedinUrl: "",
  githubUrl: "",
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export const useProfileStore = create<ProfileStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      profile: initialProfile,
      originalProfile: initialProfile,
      isDirty: false,
      isLoading: false,
      isSaving: false,
      errors: {},
      currentTab: "basic",

      // Load profile data
      loadProfile: (data) => {
        set({
          profile: data,
          originalProfile: data,
          isDirty: false,
          errors: {},
        });
      },

      // Basic info actions
      updateBasicInfo: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
          isDirty: true,
        })),

      // Work Experience actions
      updateWorkExperience: (data) =>
        set((state) => ({
          profile: { ...state.profile, workExperience: data },
          isDirty: true,
        })),

      addWorkExperience: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            workExperience: [
              ...state.profile.workExperience,
              { ...item, id: crypto.randomUUID() },
            ],
          },
          isDirty: true,
        })),

      updateWorkExperienceItem: (index, item) =>
        set((state) => {
          const updated = [...state.profile.workExperience];
          updated[index] = { ...updated[index], ...item };
          return {
            profile: { ...state.profile, workExperience: updated },
            isDirty: true,
          };
        }),

      removeWorkExperience: (index) =>
        set((state) => ({
          profile: {
            ...state.profile,
            workExperience: state.profile.workExperience.filter(
              (_, i) => i !== index
            ),
          },
          isDirty: true,
        })),

      // Education actions
      updateEducation: (data) =>
        set((state) => ({
          profile: { ...state.profile, education: data },
          isDirty: true,
        })),

      addEducation: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: [
              ...state.profile.education,
              { ...item, id: crypto.randomUUID() },
            ],
          },
          isDirty: true,
        })),

      updateEducationItem: (index, item) =>
        set((state) => {
          const updated = [...state.profile.education];
          updated[index] = { ...updated[index], ...item };
          return {
            profile: { ...state.profile, education: updated },
            isDirty: true,
          };
        }),

      removeEducation: (index) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: state.profile.education.filter((_, i) => i !== index),
          },
          isDirty: true,
        })),

      // Projects actions
      updateProjects: (data) =>
        set((state) => ({
          profile: { ...state.profile, projects: data },
          isDirty: true,
        })),

      addProject: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            projects: [
              ...state.profile.projects,
              { ...item, id: crypto.randomUUID() },
            ],
          },
          isDirty: true,
        })),

      updateProjectItem: (index, item) =>
        set((state) => {
          const updated = [...state.profile.projects];
          updated[index] = { ...updated[index], ...item };
          return {
            profile: { ...state.profile, projects: updated },
            isDirty: true,
          };
        }),

      removeProject: (index) =>
        set((state) => ({
          profile: {
            ...state.profile,
            projects: state.profile.projects.filter((_, i) => i !== index),
          },
          isDirty: true,
        })),

      // Skills actions
      updateSkills: (data) =>
        set((state) => ({
          profile: { ...state.profile, skills: data },
          isDirty: true,
        })),

      addSkill: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: [
              ...state.profile.skills,
              { ...item, id: crypto.randomUUID() },
            ],
          },
          isDirty: true,
        })),

      updateSkillItem: (index, item) =>
        set((state) => {
          const updated = [...state.profile.skills];
          updated[index] = { ...updated[index], ...item };
          return {
            profile: { ...state.profile, skills: updated },
            isDirty: true,
          };
        }),

      removeSkill: (index) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: state.profile.skills.filter((_, i) => i !== index),
          },
          isDirty: true,
        })),

      // Certifications actions
      updateCertifications: (data) =>
        set((state) => ({
          profile: { ...state.profile, certifications: data },
          isDirty: true,
        })),

      addCertification: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            certifications: [
              ...state.profile.certifications,
              { ...item, id: crypto.randomUUID() },
            ],
          },
          isDirty: true,
        })),

      updateCertificationItem: (index, item) =>
        set((state) => {
          const updated = [...state.profile.certifications];
          updated[index] = { ...updated[index], ...item };
          return {
            profile: { ...state.profile, certifications: updated },
            isDirty: true,
          };
        }),

      removeCertification: (index) =>
        set((state) => ({
          profile: {
            ...state.profile,
            certifications: state.profile.certifications.filter(
              (_, i) => i !== index
            ),
          },
          isDirty: true,
        })),

      // Form management actions
      setCurrentTab: (tab) => set({ currentTab: tab }),

      resetForm: () =>
        set((state) => ({
          profile: state.originalProfile,
          isDirty: false,
          errors: {},
        })),

      validateForm: () => {
        const { profile } = get();
        const result = validateProfile(profile);

        if (!result.success) {
          const errors: Record<string, string[]> = {};
          for (const error of result.error.issues) {
            const path = error.path.join(".");
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(error.message);
          }
          set({ errors });
          return false;
        }

        set({ errors: {} });
        return true;
      },

      setErrors: (errors) => set({ errors }),
      clearErrors: () => set({ errors: {} }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSaving: (saving) => set({ isSaving: saving }),
    }),
    { name: "profile-store" }
  )
);
