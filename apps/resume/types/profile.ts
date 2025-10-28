export type WorkExperience = {
  id?: string;
  company: string;
  position: string;
  location: string;
  date: string; // Combined date field (e.g., "Jan 2023 - Present")
  description: string[]; // Array of bullet points
  technologies: string[]; // Array of technologies/skills
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
  category: string; // e.g., "Programming Languages", "Frameworks", "Tools"
  items: string[]; // Array of skills in this category
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
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
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
