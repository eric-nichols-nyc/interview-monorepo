"use client";

import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import {
  useResumeBasicInfo,
  useResumeCertifications,
  useResumeEducation,
  useResumeProfessionalSummary,
  useResumeProjects,
  useResumeSectionOrder,
  useResumeSkills,
  useResumeWorkExperience,
} from "../../../../../stores/resume-editor-store";
import type {
  Certification,
  Education,
  Project,
  Skill,
  WorkExperience,
} from "../../../../../types/profile";
import {
  formatPhoneNumber,
  pdfHelpers,
  resumeDesignTokens,
} from "../_config/resume-design-tokens";

// Using Helvetica for reliable PDF generation
// Google Fonts can be added back later if needed

// Constants
const PX_TO_PT = 0.75; // Pixel to points conversion factor

// Define styles for the PDF with enhanced typography
const styles = StyleSheet.create({
  page: {
    padding: pdfHelpers.mm2pt(resumeDesignTokens.layout.page.padding.mm),
    backgroundColor: resumeDesignTokens.colors.neutral.white,
    fontFamily: resumeDesignTokens.typography.fontFamily.primary,
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
    lineHeight: resumeDesignTokens.typography.lineHeight.normal,
  },
  header: {
    marginBottom: resumeDesignTokens.components.header.marginBottom * PX_TO_PT,
    paddingBottom:
      resumeDesignTokens.components.header.paddingBottom * PX_TO_PT,
  },
  name: {
    fontSize: pdfHelpers.getFontSize("4xl"),
    fontWeight: resumeDesignTokens.typography.fontWeight.bold,
    marginBottom: pdfHelpers.getSpacing(3),
    color: pdfHelpers.getColor("primary.900"),
    letterSpacing: resumeDesignTokens.typography.letterSpacing.tight,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: resumeDesignTokens.components.contactInfo.gap * PX_TO_PT,
    fontSize: pdfHelpers.getFontSize("base"),
    color: pdfHelpers.getColor("primary.500"),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactSeparator: {
    marginHorizontal:
      resumeDesignTokens.components.contactInfo.separatorMargin * PX_TO_PT,
    color: pdfHelpers.getColor("primary.300"),
    fontSize: pdfHelpers.getFontSize("xs"),
  },
  link: {
    color: pdfHelpers.getColor("accent.600"),
    textDecoration: "none",
    fontWeight: resumeDesignTokens.typography.fontWeight.bold,
  },
  section: {
    marginBottom: resumeDesignTokens.components.section.marginBottom * PX_TO_PT,
  },
  sectionTitle: {
    fontSize: pdfHelpers.getFontSize("lg"),
    fontWeight: resumeDesignTokens.typography.fontWeight.bold,
    color: pdfHelpers.getColor("primary.900"),
    marginBottom:
      resumeDesignTokens.components.section.titleMarginBottom * PX_TO_PT,
    borderBottomWidth: resumeDesignTokens.borders.width.thin,
    borderBottomColor: pdfHelpers.getColor("primary.200"),
    paddingBottom:
      resumeDesignTokens.components.section.titlePaddingBottom * PX_TO_PT,
    textTransform: "uppercase",
    letterSpacing: resumeDesignTokens.typography.letterSpacing.wide,
  },
  workItem: {
    marginBottom:
      resumeDesignTokens.components.workItem.marginBottom * PX_TO_PT,
  },
  jobHeader: {
    marginBottom: pdfHelpers.getSpacing(2),
  },
  jobLeft: {
    flex: 1,
  },
  jobTitle: {
    fontSize: pdfHelpers.getFontSize("sm"),
    fontWeight: resumeDesignTokens.typography.fontWeight.bold,
    color: pdfHelpers.getColor("primary.900"),
    marginBottom: pdfHelpers.getSpacing(1),
    lineHeight: resumeDesignTokens.typography.lineHeight.tight,
  },
  company: {
    fontSize: pdfHelpers.getFontSize("sm"),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
    color: pdfHelpers.getColor("primary.600"),
  },
  location: {
    fontSize: pdfHelpers.getFontSize("sm"),
    color: pdfHelpers.getColor("primary.500"),
    marginLeft: pdfHelpers.getSpacing(3),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
  },
  dates: {
    fontSize: pdfHelpers.getFontSize("sm"),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
    color: pdfHelpers.getColor("primary.600"),
    marginLeft: pdfHelpers.getSpacing(7),
  },
  description: {
    marginBottom: pdfHelpers.getSpacing(6),
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: pdfHelpers.getSpacing(2),
    paddingLeft: 0,
  },
  bullet: {
    width: resumeDesignTokens.components.bullet.size,
    height: resumeDesignTokens.components.bullet.size,
    borderRadius: resumeDesignTokens.components.bullet.size / 2,
    backgroundColor: pdfHelpers.getColor("accent.600"),
    marginRight: resumeDesignTokens.components.bullet.marginRight * PX_TO_PT,
    marginTop: resumeDesignTokens.components.bullet.marginTop * PX_TO_PT,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: pdfHelpers.getFontSize("sm"),
    color: pdfHelpers.getColor("primary.700"),
    lineHeight: resumeDesignTokens.typography.lineHeight.loose,
    flex: 1,
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
  },
  technologies: {
    marginTop: pdfHelpers.getSpacing(6),
  },
  techHeader: {
    fontSize: pdfHelpers.getFontSize("sm"),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
    color: pdfHelpers.getColor("primary.600"),
    marginBottom: pdfHelpers.getSpacing(3),
  },
  techTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pdfHelpers.getSpacing(2),
  },
  techTag: {
    fontSize: pdfHelpers.getFontSize("xs"),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
    color: pdfHelpers.getColor("primary.700"),
    backgroundColor: pdfHelpers.getColor("primary.100"),
    paddingHorizontal: pdfHelpers.getSpacing(4),
    paddingVertical: pdfHelpers.getSpacing(1),
    borderRadius: resumeDesignTokens.borders.radius.sm,
    borderWidth: resumeDesignTokens.borders.width.thin,
    borderColor: pdfHelpers.getColor("primary.200"),
  },
  skillsCategory: {
    marginBottom:
      resumeDesignTokens.components.skillsCategory.marginBottom * PX_TO_PT,
  },
  categoryTitle: {
    fontSize: pdfHelpers.getFontSize("sm"),
    fontWeight: resumeDesignTokens.typography.fontWeight.bold,
    color: pdfHelpers.getColor("primary.900"),
    marginBottom: pdfHelpers.getSpacing(4),
  },
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pdfHelpers.getSpacing(3),
  },
  skillTag: {
    fontSize: pdfHelpers.getFontSize("sm"),
    fontWeight: resumeDesignTokens.typography.fontWeight.normal,
    color: pdfHelpers.getColor("primary.700"),
    backgroundColor: pdfHelpers.getColor("primary.50"),
    paddingHorizontal: pdfHelpers.getSpacing(5),
    paddingVertical: pdfHelpers.getSpacing(2),
    borderRadius: resumeDesignTokens.borders.radius.md,
    borderWidth: resumeDesignTokens.borders.width.thin,
    borderColor: pdfHelpers.getColor("primary.200"),
  },
  summaryText: {
    fontSize: pdfHelpers.getFontSize("sm"),
    color: pdfHelpers.getColor("primary.700"),
    lineHeight: resumeDesignTokens.typography.lineHeight.relaxed,
    textAlign: "left",
  },
});

// Helper to remove protocol from URLs
const PROTOCOL_REGEX = /^https?:\/\//;
const stripProtocol = (url: string) => url.replace(PROTOCOL_REGEX, "");

type ContactItemProps = {
  children: React.ReactNode;
  showSeparator: boolean;
};

function ContactItem({ children, showSeparator }: ContactItemProps) {
  return (
    <View style={styles.contactItem}>
      {children}
      {showSeparator && <Text style={styles.contactSeparator}>|</Text>}
    </View>
  );
}

export default function ResumePDF() {
  const basicInfo = useResumeBasicInfo();
  const workExperience = useResumeWorkExperience();
  const skills = useResumeSkills();
  const professionalSummary = useResumeProfessionalSummary();
  const education = useResumeEducation();
  const projects = useResumeProjects();
  const certifications = useResumeCertifications();
  const sectionOrder = useResumeSectionOrder();

  // Build contact info items array
  const contactItems = [
    basicInfo?.email && { type: "text", value: basicInfo.email },
    basicInfo?.phoneNumber && {
      type: "text",
      value: formatPhoneNumber(basicInfo.phoneNumber),
    },
    basicInfo?.location && { type: "text", value: basicInfo.location },
    basicInfo?.website && {
      type: "link",
      href: basicInfo.website,
      text: stripProtocol(basicInfo.website),
    },
    basicInfo?.linkedinUrl && {
      type: "link",
      href: basicInfo.linkedinUrl,
      text: "LinkedIn",
    },
    basicInfo?.githubUrl && {
      type: "link",
      href: basicInfo.githubUrl,
      text: "GitHub",
    },
  ].filter(Boolean);

  // Section renderers map
  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    professional_summary: () =>
      professionalSummary?.trim() ? (
        <View style={styles.section}>
          <Text style={styles.summaryText}>{professionalSummary}</Text>
        </View>
      ) : null,

    work_experience: () =>
      workExperience && workExperience.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {workExperience.map((experience: WorkExperience, index: number) => (
            <View
              key={experience.id || `experience-${index}`}
              style={styles.workItem}
            >
              {/* Job Title | Company | Location | Date */}
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>
                  {experience.position}
                  {" | "}
                  <Text style={styles.company}>{experience.company}</Text>
                  {experience.location && (
                    <>
                      {" | "}
                      <Text style={styles.location}>{experience.location}</Text>
                    </>
                  )}
                  {" | "}
                  <Text style={styles.dates}>{experience.date}</Text>
                </Text>
              </View>

              {/* Responsibilities/Achievements */}
              {experience.description && experience.description.length > 0 && (
                <View style={styles.description}>
                  {experience.description.map((bullet: string) => (
                    <View key={bullet} style={styles.bulletPoint}>
                      <View style={styles.bullet} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Technologies */}
              {experience.technologies &&
                experience.technologies.length > 0 && (
                  <View style={styles.technologies}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: pdfHelpers.getSpacing(3),
                      }}
                    >
                      <Text style={styles.techHeader}>Technologies:</Text>
                    </View>
                    <View style={styles.techTags}>
                      {experience.technologies.map((tech: string) => (
                        <Text key={tech} style={styles.techTag}>
                          {tech}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
            </View>
          ))}
        </View>
      ) : null,

    skills: () =>
      skills && skills.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {skills.map((skillCategory: Skill, categoryIndex: number) => (
            <View
              key={skillCategory.id || `category-${categoryIndex}`}
              style={styles.skillsCategory}
            >
              {/* Category: skill1, skill2, skill3 format */}
              {skillCategory.category &&
                skillCategory.items &&
                skillCategory.items.length > 0 && (
                  <Text style={styles.summaryText}>
                    <Text style={styles.categoryTitle}>
                      {skillCategory.category}:{" "}
                    </Text>
                    {skillCategory.items.join(", ")}
                  </Text>
                )}
            </View>
          ))}
        </View>
      ) : null,

    projects: () =>
      projects && projects.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {projects.map((project: Project, index: number) => (
            <View
              key={project.id || `project-${index}`}
              style={styles.workItem}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobLeft}>
                  <Text style={styles.jobTitle}>{project.name}</Text>
                  {project.url && (
                    <Link src={project.url} style={styles.link}>
                      <Text
                        style={{
                          fontSize: pdfHelpers.getFontSize("sm"),
                          color: pdfHelpers.getColor("accent.600"),
                        }}
                      >
                        {stripProtocol(project.url)}
                      </Text>
                    </Link>
                  )}
                </View>
                {project.date && (
                  <Text style={styles.dates}>{project.date}</Text>
                )}
              </View>
              {project.description && (
                <Text style={styles.summaryText}>{project.description}</Text>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <View style={styles.technologies}>
                  <Text style={styles.techHeader}>Technologies:</Text>
                  <View style={styles.techTags}>
                    {project.technologies.map((tech: string) => (
                      <Text key={tech} style={styles.techTag}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : null,

    education: () =>
      education && education.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu: Education, index: number) => (
            <View key={edu.id || `education-${index}`} style={styles.workItem}>
              <View style={styles.jobHeader}>
                <View style={styles.jobLeft}>
                  <Text style={styles.jobTitle}>{edu.degree}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.company}>{edu.institution}</Text>
                    {edu.location && (
                      <Text style={styles.location}>| {edu.location}</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.dates}>{edu.date}</Text>
              </View>
              {edu.details && (
                <Text style={styles.summaryText}>{edu.details}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,

    certifications: () =>
      certifications && certifications.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {certifications.map((cert: Certification, index: number) => (
            <View
              key={cert.id || `certification-${index}`}
              style={styles.workItem}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobLeft}>
                  <Text style={styles.jobTitle}>{cert.name}</Text>
                  <Text style={styles.company}>{cert.issuer}</Text>
                </View>
                <Text style={styles.dates}>{cert.date}</Text>
              </View>
              {cert.details && (
                <Text style={styles.summaryText}>{cert.details}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Name */}
          <Text style={styles.name}>
            {basicInfo?.firstName || "First Name"}{" "}
            {basicInfo?.lastName || "Last Name"}
          </Text>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            {contactItems.map((item, index) => {
              const showSeparator = index < contactItems.length - 1;

              if (!item) {
                return null;
              }

              if (item.type === "link") {
                return (
                  <ContactItem
                    key={`link-${item.href}`}
                    showSeparator={showSeparator}
                  >
                    <Link src={item.href} style={styles.link}>
                      {item.text}
                    </Link>
                  </ContactItem>
                );
              }

              return (
                <ContactItem
                  key={`text-${item.value}`}
                  showSeparator={showSeparator}
                >
                  <Text>{item.value}</Text>
                </ContactItem>
              );
            })}
          </View>
        </View>

        {/* Dynamic Sections based on section order */}
        {sectionOrder.map((sectionName: string) => {
          const renderSection = sectionRenderers[sectionName];
          return renderSection ? (
            <React.Fragment key={sectionName}>{renderSection()}</React.Fragment>
          ) : null;
        })}
      </Page>
    </Document>
  );
}
