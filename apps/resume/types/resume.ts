export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type Resume = {
  id: string;
  userId: string;
  jobId: string | null;
  isBaseResume: boolean | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  resumeTitle: string | null;
  targetRole: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  professionalSummary?: string | null;
  workExperience?: any;
  education?: any;
  skills?: any;
  projects?: any;
  certifications?: any;
  sectionOrder?: any;
  sectionConfigs?: any;
  documentSettings?: any;
  hasCoverLetter?: boolean;
  coverLetter?: any;
};

export type CreateResumeInput = {
  name: string;
  jobId?: string;
  isBaseResume?: boolean;
  resumeTitle?: string;
  targetRole?: string;
};

export type UpdateResumeInput = Partial<CreateResumeInput>;
