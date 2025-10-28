"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  cssHelpers,
  formatPhoneNumber,
  resumeDesignTokens,
} from "../_config/resume-design-tokens";

// Regex for removing protocol from URLs
const PROTOCOL_REGEX = /^https?:\/\//;

// Helper to remove protocol from URL
const stripProtocol = (url: string) => url.replace(PROTOCOL_REGEX, "");

// Constants
const INITIAL_SCALE_DELAY = 100;

// Contact info item component
function ContactItem({
  children,
  showSeparator,
}: {
  children: React.ReactNode;
  showSeparator: boolean;
}) {
  return (
    <>
      {children}
      {showSeparator && (
        <span className={cssHelpers.getColorClass("primary.400", "text")}>
          |
        </span>
      )}
    </>
  );
}

export function HtmlPreviewPanel() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const basicInfo = useResumeBasicInfo();
  const workExperience = useResumeWorkExperience();
  const skills = useResumeSkills();
  const professionalSummary = useResumeProfessionalSummary();
  const education = useResumeEducation();
  const projects = useResumeProjects();
  const certifications = useResumeCertifications();
  const sectionOrder = useResumeSectionOrder();

  // Calculate scale based on container size
  const calculateScale = useCallback(() => {
    if (!(containerRef.current && documentRef.current)) {
      return;
    }

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // A4 dimensions from design tokens
    const documentWidth = resumeDesignTokens.layout.page.a4.width.px;
    const documentHeight = resumeDesignTokens.layout.page.a4.height.px;

    // Calculate scale factors for width and height
    const PADDING = 10;
    const scaleX = (containerWidth - PADDING) / documentWidth; // 40px for padding
    const scaleY = (containerHeight - PADDING) / documentHeight; // 40px for padding

    // Use the smaller scale to ensure document fits in both dimensions
    const newScale = Math.min(scaleX, scaleY, 1); // Don't scale above 100%

    setScale(newScale);
  }, []);

  useEffect(() => {
    setIsHydrated(true);

    // Calculate initial scale
    const timer = setTimeout(calculateScale, INITIAL_SCALE_DELAY);

    // Recalculate on window resize
    const handleResize = () => {
      calculateScale();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateScale]);

  if (!isHydrated) {
    return (
      <div
        className="flex h-full justify-center overflow-auto bg-gray-100 p-5"
        ref={containerRef}
      >
        <div
          className="bg-white shadow-2xl"
          ref={documentRef}
          style={{
            width: `${resumeDesignTokens.layout.page.a4.width.mm}mm`,
            minHeight: `${resumeDesignTokens.layout.page.a4.height.mm}mm`,
            padding: `${resumeDesignTokens.layout.page.padding.mm}mm`,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <div className="mb-8 border-gray-200 border-b-2 pb-6">
            <h1 className="mb-3 font-bold text-4xl text-gray-900">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // Build contact info items array
  const contactItems = [
    basicInfo.email && { type: "text", value: basicInfo.email },
    basicInfo.phoneNumber && {
      type: "text",
      value: formatPhoneNumber(basicInfo.phoneNumber),
    },
    basicInfo.location && { type: "text", value: basicInfo.location },
    basicInfo.website && {
      type: "link",
      href: basicInfo.website,
      text: stripProtocol(basicInfo.website),
    },
    basicInfo.linkedinUrl && {
      type: "link",
      href: basicInfo.linkedinUrl,
      text: "LinkedIn",
    },
    basicInfo.githubUrl && {
      type: "link",
      href: basicInfo.githubUrl,
      text: "GitHub",
    },
  ].filter(Boolean);

  // Section renderers map
  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    professional_summary: () =>
      professionalSummary?.trim() ? (
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
          }}
        >
          <p
            className={`${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.700", "text")} leading-relaxed`}
          >
            {professionalSummary}
          </p>
        </div>
      ) : null,

    work_experience: () =>
      workExperience && workExperience.length > 0 ? (
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
          }}
        >
          <h2
            className={`border-b-2 font-bold uppercase tracking-wide ${cssHelpers.getFontSizeClass("xl")} ${cssHelpers.getColorClass("primary.900", "text")} ${cssHelpers.getColorClass("primary.200", "border")}`}
            style={{
              marginBottom: `${resumeDesignTokens.components.section.titleMarginBottom}px`,
              paddingBottom: `${resumeDesignTokens.components.section.titlePaddingBottom}px`,
            }}
          >
            Experience
          </h2>
          <div className="space-y-6">
            {workExperience.map(
              (
                experience: {
                  id?: string;
                  position: string;
                  company: string;
                  location?: string;
                  date: string;
                  description?: string[];
                  technologies?: string[];
                },
                index: number
              ) => (
                <div
                  className=""
                  key={experience.id || `experience-${index}`}
                  style={{
                    marginBottom: `${resumeDesignTokens.components.workItem.marginBottom}px`,
                  }}
                >
                  {/* Job Title | Company | Location | Date */}
                  <div className="mb-2">
                    <h3
                      className={`font-bold ${cssHelpers.getFontSizeClass("lg")} ${cssHelpers.getColorClass("primary.900", "text")}`}
                    >
                      {experience.position}
                      <span
                        className={`font-medium ${cssHelpers.getColorClass("primary.700", "text")}`}
                      >
                        {" | "}
                        {experience.company}
                      </span>
                      {experience.location && (
                        <span
                          className={`font-medium ${cssHelpers.getColorClass("primary.500", "text")}`}
                        >
                          {" | "}
                          {experience.location}
                        </span>
                      )}
                      <span
                        className={`font-medium ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.600", "text")}`}
                      >
                        {" | "}
                        {experience.date}
                      </span>
                    </h3>
                  </div>

                  {/* Responsibilities/Achievements */}
                  {experience.description &&
                    experience.description.length > 0 && (
                      <ul className="mb-3 space-y-1">
                        {experience.description.map((bullet: string) => (
                          <li
                            className={`flex items-start ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.700", "text")} leading-relaxed`}
                            key={bullet}
                          >
                            <span
                              className="flex-shrink-0 rounded-full bg-blue-600"
                              style={{
                                width: `${resumeDesignTokens.components.bullet.size}px`,
                                height: `${resumeDesignTokens.components.bullet.size}px`,
                                marginRight: `${resumeDesignTokens.components.bullet.marginRight}px`,
                                marginTop: `${resumeDesignTokens.components.bullet.marginTop}px`,
                                minWidth: `${resumeDesignTokens.components.bullet.size}px`,
                                minHeight: `${resumeDesignTokens.components.bullet.size}px`,
                                backgroundColor: "#2563eb", // Fallback to ensure bullet is always visible
                              }}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                  {/* Technologies */}
                  {experience.technologies &&
                    experience.technologies.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`mr-2 font-medium ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.600", "text")}`}
                          >
                            Technologies:
                          </span>
                          {experience.technologies.map((tech: string) => (
                            <span
                              className={`inline-block rounded font-medium ${cssHelpers.getFontSizeClass("xs")} ${cssHelpers.getColorClass("primary.700", "text")} ${cssHelpers.getColorClass("primary.100", "bg")} px-2 py-1`}
                              key={tech}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )
            )}
          </div>
        </div>
      ) : null,

    skills: () =>
      skills && skills.length > 0 ? (
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
          }}
        >
          <h2
            className={`border-b-2 font-bold uppercase tracking-wide ${cssHelpers.getFontSizeClass("xl")} ${cssHelpers.getColorClass("primary.900", "text")} ${cssHelpers.getColorClass("primary.200", "border")}`}
            style={{
              marginBottom: `${resumeDesignTokens.components.section.titleMarginBottom}px`,
              paddingBottom: `${resumeDesignTokens.components.section.titlePaddingBottom}px`,
            }}
          >
            Technical Skills
          </h2>
          <div className="space-y-4">
            {skills.map(
              (
                skillCategory: {
                  id?: string;
                  category?: string;
                  items?: string[];
                },
                categoryIndex: number
              ) => (
                <div
                  className=""
                  key={skillCategory.id || `category-${categoryIndex}`}
                  style={{
                    marginBottom: `${resumeDesignTokens.components.skillsCategory.marginBottom}px`,
                  }}
                >
                  {/* Category: skill1, skill2, skill3 format */}
                  {skillCategory.category &&
                    skillCategory.items &&
                    skillCategory.items.length > 0 && (
                      <p
                        className={`${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.700", "text")} leading-relaxed`}
                      >
                        <span
                          className={`font-bold ${cssHelpers.getColorClass("primary.900", "text")}`}
                        >
                          {skillCategory.category}:
                        </span>{" "}
                        {skillCategory.items.join(", ")}
                      </p>
                    )}
                </div>
              )
            )}
          </div>
        </div>
      ) : null,

    projects: () =>
      projects && projects.length > 0 ? (
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
          }}
        >
          <h2
            className={`border-b-2 font-bold uppercase tracking-wide ${cssHelpers.getFontSizeClass("xl")} ${cssHelpers.getColorClass("primary.900", "text")} ${cssHelpers.getColorClass("primary.200", "border")}`}
            style={{
              marginBottom: `${resumeDesignTokens.components.section.titleMarginBottom}px`,
              paddingBottom: `${resumeDesignTokens.components.section.titlePaddingBottom}px`,
            }}
          >
            Projects
          </h2>
          <div className="space-y-6">
            {projects.map(
              (
                project: {
                  id?: string;
                  name: string;
                  url?: string;
                  date?: string;
                  description?: string;
                  technologies?: string[];
                },
                index: number
              ) => (
                <div
                  className=""
                  key={project.id || `project-${index}`}
                  style={{
                    marginBottom: `${resumeDesignTokens.components.workItem.marginBottom}px`,
                  }}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${cssHelpers.getFontSizeClass("lg")} ${cssHelpers.getColorClass("primary.900", "text")}`}
                      >
                        {project.name}
                      </h3>
                      {project.url && (
                        <a
                          className={`${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("accent.600", "text")} hover:underline`}
                          href={project.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {stripProtocol(project.url)}
                        </a>
                      )}
                    </div>
                    {project.date && (
                      <div
                        className={`ml-4 font-medium ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.600", "text")}`}
                      >
                        {project.date}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p
                      className={`mb-3 ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.700", "text")} leading-relaxed`}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`mr-2 font-medium ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.600", "text")}`}
                        >
                          Technologies:
                        </span>
                        {project.technologies.map((tech: string) => (
                          <span
                            className={`inline-block rounded px-2 py-1 font-medium ${cssHelpers.getFontSizeClass("xs")} ${cssHelpers.getColorClass("primary.700", "text")} ${cssHelpers.getColorClass("primary.100", "bg")}`}
                            key={tech}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      ) : null,

    education: () =>
      education && education.length > 0 ? (
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
          }}
        >
          <h2
            className={`border-b-2 font-bold uppercase tracking-wide ${cssHelpers.getFontSizeClass("xl")} ${cssHelpers.getColorClass("primary.900", "text")} ${cssHelpers.getColorClass("primary.200", "border")}`}
            style={{
              marginBottom: `${resumeDesignTokens.components.section.titleMarginBottom}px`,
              paddingBottom: `${resumeDesignTokens.components.section.titlePaddingBottom}px`,
            }}
          >
            Education
          </h2>
          <div className="space-y-6">
            {education.map(
              (
                edu: {
                  id?: string;
                  degree: string;
                  institution: string;
                  location?: string;
                  date: string;
                  details?: string;
                },
                index: number
              ) => (
                <div
                  className=""
                  key={edu.id || `education-${index}`}
                  style={{
                    marginBottom: `${resumeDesignTokens.components.workItem.marginBottom}px`,
                  }}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${cssHelpers.getFontSizeClass("lg")} ${cssHelpers.getColorClass("primary.900", "text")}`}
                      >
                        {edu.degree}
                      </h3>
                      <div
                        className={`font-medium ${cssHelpers.getColorClass("primary.700", "text")}`}
                      >
                        {edu.institution}
                        {edu.location && (
                          <span
                            className={`ml-2 ${cssHelpers.getColorClass("primary.500", "text")}`}
                          >
                            | {edu.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`ml-4 font-medium ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.600", "text")}`}
                    >
                      {edu.date}
                    </div>
                  </div>
                  {edu.details && (
                    <p
                      className={`${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.700", "text")} leading-relaxed`}
                    >
                      {edu.details}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      ) : null,

    certifications: () =>
      certifications && certifications.length > 0 ? (
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
          }}
        >
          <h2
            className={`border-b-2 font-bold uppercase tracking-wide ${cssHelpers.getFontSizeClass("xl")} ${cssHelpers.getColorClass("primary.900", "text")} ${cssHelpers.getColorClass("primary.200", "border")}`}
            style={{
              marginBottom: `${resumeDesignTokens.components.section.titleMarginBottom}px`,
              paddingBottom: `${resumeDesignTokens.components.section.titlePaddingBottom}px`,
            }}
          >
            Certifications
          </h2>
          <div className="space-y-4">
            {certifications.map(
              (
                cert: {
                  id?: string;
                  name: string;
                  issuer: string;
                  date: string;
                  details?: string;
                },
                index: number
              ) => (
                <div
                  className=""
                  key={cert.id || `certification-${index}`}
                  style={{
                    marginBottom: `${resumeDesignTokens.components.workItem.marginBottom}px`,
                  }}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${cssHelpers.getFontSizeClass("lg")} ${cssHelpers.getColorClass("primary.900", "text")}`}
                      >
                        {cert.name}
                      </h3>
                      <div
                        className={`font-medium ${cssHelpers.getColorClass("primary.700", "text")}`}
                      >
                        {cert.issuer}
                      </div>
                    </div>
                    <div
                      className={`ml-4 font-medium ${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.600", "text")}`}
                    >
                      {cert.date}
                    </div>
                  </div>
                  {cert.details && (
                    <p
                      className={`${cssHelpers.getFontSizeClass("sm")} ${cssHelpers.getColorClass("primary.700", "text")} leading-relaxed`}
                    >
                      {cert.details}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      ) : null,
  };

  return (
    <div
      className="flex h-full justify-center overflow-auto border border-gray-300 bg-gray-100 p-5"
      ref={containerRef}
    >
      <div
        className="bg-white shadow-2xl"
        ref={documentRef}
        style={{
          width: `${resumeDesignTokens.layout.page.a4.width.mm}mm`,
          minHeight: `${resumeDesignTokens.layout.page.a4.height.mm}mm`,
          padding: `${resumeDesignTokens.layout.page.padding.mm}mm`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            marginBottom: `${resumeDesignTokens.components.header.marginBottom}px`,
            paddingBottom: `${resumeDesignTokens.components.header.paddingBottom}px`,
          }}
        >
          {/* Name */}
          <h1
            className={`mb-2 font-bold ${cssHelpers.getFontSizeClass("4xl")} ${cssHelpers.getColorClass("primary.900", "text")}`}
          >
            {basicInfo.firstName || "First Name"}{" "}
            {basicInfo.lastName || "Last Name"}
          </h1>

          {/* Contact Info */}
          <div
            className={`flex flex-wrap items-center ${cssHelpers.getFontSizeClass("base")} ${cssHelpers.getColorClass("primary.500", "text")}`}
            style={{
              gap: `${resumeDesignTokens.components.contactInfo.gap}px`,
            }}
          >
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
                    <a
                      className={`${cssHelpers.getColorClass("accent.600", "text")} hover:underline`}
                      href={item.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.text}
                    </a>
                  </ContactItem>
                );
              }

              return (
                <ContactItem
                  key={`text-${item.value}`}
                  showSeparator={showSeparator}
                >
                  <span>{item.value}</span>
                </ContactItem>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sections based on section order */}
        {sectionOrder.map((sectionName: string) => {
          const renderSection = sectionRenderers[sectionName];
          return renderSection ? (
            <div key={sectionName}>{renderSection()}</div>
          ) : null;
        })}
      </div>
    </div>
  );
}
