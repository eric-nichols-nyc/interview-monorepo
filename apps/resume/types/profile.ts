export type WorkExperience = {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
};

export type Education = {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
};

export type Project = {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
};

export type Skill = {
  id?: string;
  name: string;
  category: string;
  proficiency?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
};

export type Certification = {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
};

export type BasicInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
};

export type ProfileFormData = BasicInfo & {
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
};

// Profile from database
export type Profile = ProfileFormData & {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Form validation errors
export type FormErrors = {
  [key: string]: string | FormErrors | FormErrors[];
};

// Tab names for the form
export type ProfileTab =
  | "basic"
  | "experience"
  | "projects"
  | "education"
  | "skills";

export type TabConfig = {
  id: ProfileTab;
  label: string;
  icon?: string;
  description?: string;
};
