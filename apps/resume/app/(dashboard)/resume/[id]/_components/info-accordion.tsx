"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import {
  Award,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Layout,
  User,
} from "lucide-react";
import { BasicInfoContent } from "./basic-info-content";
import { EducationContent } from "./education-content";
import { LayoutContent } from "./layout-content";
import { ProjectsContent } from "./projects-content";
import { SkillsContent } from "./skills/skills-content";
import { WorkContent } from "./work/work-content";

export function InfoAccordion() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="font-semibold text-2xl">Edit Resume</h2>
        <p className="text-muted-foreground">
          Update your resume sections below. Changes are saved automatically.
        </p>
      </div>

      <Accordion className="w-full" collapsible type="single">
        <AccordionItem value="basic-info">
          <AccordionTrigger className="flex items-center gap-3">
            <User className="h-5 w-5" />
            Basic Info
          </AccordionTrigger>
          <AccordionContent>
            <BasicInfoContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="work">
          <AccordionTrigger className="flex items-center gap-3">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </AccordionTrigger>
          <AccordionContent>
            <WorkContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects">
          <AccordionTrigger className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5" />
            Projects
          </AccordionTrigger>
          <AccordionContent>
            <ProjectsContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger className="flex items-center gap-3">
            <Award className="h-5 w-5" />
            Skills
          </AccordionTrigger>
          <AccordionContent>
            <SkillsContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5" />
            Education
          </AccordionTrigger>
          <AccordionContent>
            <EducationContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="layout">
          <AccordionTrigger className="flex items-center gap-3">
            <Layout className="h-5 w-5" />
            Layout & Formatting
          </AccordionTrigger>
          <AccordionContent>
            <LayoutContent />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
