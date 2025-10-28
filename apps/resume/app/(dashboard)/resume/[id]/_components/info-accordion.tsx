"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import {
  Award,
  BookOpen,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Layout,
  User,
} from "lucide-react";
import { useResumeSectionOrder } from "../../../../../stores/resume-editor-store";
import { BasicInfoContent } from "./basic-info-content";
import { EducationContent } from "./education-content";
import { LayoutContent } from "./layout-content";
import { ProjectsContent } from "./projects-content";
import { SkillsContent } from "./skills/skills-content";
import { WorkContent } from "./work/work-content";

// Create a placeholder component for certifications
function CertificationsContent() {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>Certifications section coming soon...</p>
    </div>
  );
}

export function InfoAccordion() {
  const sectionOrder = useResumeSectionOrder();

  // Define section configurations
  const sectionConfigs = {
    professional_summary: {
      value: "basic-info",
      icon: User,
      title: "Basic Info",
      component: BasicInfoContent,
    },
    work_experience: {
      value: "work",
      icon: Briefcase,
      title: "Work Experience",
      component: WorkContent,
    },
    skills: {
      value: "skills",
      icon: Award,
      title: "Skills",
      component: SkillsContent,
    },
    projects: {
      value: "projects",
      icon: FolderOpen,
      title: "Projects",
      component: ProjectsContent,
    },
    education: {
      value: "education",
      icon: GraduationCap,
      title: "Education",
      component: EducationContent,
    },
    certifications: {
      value: "certifications",
      icon: BookOpen,
      title: "Certifications",
      component: CertificationsContent,
    },
  };

  // Always include basic info first and layout last, regardless of section order
  const basicInfoConfig = sectionConfigs.professional_summary;
  const layoutConfig = {
    value: "layout",
    icon: Layout,
    title: "Layout & Formatting",
    component: LayoutContent,
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="font-semibold text-2xl">Edit Resume</h2>
        <p className="text-muted-foreground">
          Update your resume sections below. Changes are saved automatically.
        </p>
      </div>

      <Accordion className="w-full" collapsible type="single">
        {/* Basic Info - Always first */}
        <AccordionItem value={basicInfoConfig.value}>
          <AccordionTrigger className="flex items-center gap-3">
            <basicInfoConfig.icon className="h-5 w-5" />
            {basicInfoConfig.title}
          </AccordionTrigger>
          <AccordionContent>
            <basicInfoConfig.component />
          </AccordionContent>
        </AccordionItem>

        {/* Dynamic sections based on section order */}
        {sectionOrder
          .filter((section: string) => section !== "professional_summary") // Exclude basic info since it's always first
          .map((sectionName: string) => {
            const config =
              sectionConfigs[sectionName as keyof typeof sectionConfigs];
            if (!config) {
              return null;
            }

            const IconComponent = config.icon;
            const ContentComponent = config.component;

            return (
              <AccordionItem key={sectionName} value={config.value}>
                <AccordionTrigger className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5" />
                  {config.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ContentComponent />
                </AccordionContent>
              </AccordionItem>
            );
          })}

        {/* Layout & Formatting - Always last */}
        <AccordionItem value={layoutConfig.value}>
          <AccordionTrigger className="flex items-center gap-3">
            <layoutConfig.icon className="h-5 w-5" />
            {layoutConfig.title}
          </AccordionTrigger>
          <AccordionContent>
            <layoutConfig.component />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
