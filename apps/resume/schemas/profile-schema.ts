import { z } from 'zod';

// Helper schema for optional URLs
const optionalUrl = z.string().url().optional().or(z.literal(''));

// Helper schema for dates
const dateString = z.string().min(1, 'Date is required');

// Work Experience Schema
export const workExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

// Education Schema
export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: dateString,
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  gpa: z.string().optional(),
  honors: z.array(z.string()).default([]),
  coursework: z.array(z.string()).default([]),
});

// Project Schema
export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  url: optionalUrl,
  githubUrl: optionalUrl,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

// Skill Schema
export const skillSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'Category name is required'),
  items: z.array(z.string()).default([]),
});

// Certification Schema
export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: dateString,
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: optionalUrl,
});

// Basic Info Schema
export const basicInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  website: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
});

// Complete Profile Schema
export const profileSchema = basicInfoSchema.extend({
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
});

// Export types inferred from schemas
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;

// Individual section validators (useful for tab-specific validation)
export const validateBasicInfo = (data: unknown) => basicInfoSchema.safeParse(data);
export const validateWorkExperience = (data: unknown) => z.array(workExperienceSchema).safeParse(data);
export const validateEducation = (data: unknown) => z.array(educationSchema).safeParse(data);
export const validateSkills = (data: unknown) => z.array(skillSchema).safeParse(data);
export const validateProjects = (data: unknown) => z.array(projectSchema).safeParse(data);
export const validateCertifications = (data: unknown) => z.array(certificationSchema).safeParse(data);

// Complete profile validator
export const validateProfile = (data: unknown) => profileSchema.safeParse(data);