"use client";
import { useEffect, useRef, useState } from "react";
import {
  useResumeBasicInfo,
  useResumeSkills,
  useResumeWorkExperience,
  useResumeProfessionalSummary,
} from "../../../../../stores/resume-editor-store";

// Regex for removing protocol from URLs
const PROTOCOL_REGEX = /^https?:\/\//;

// Helper to remove protocol from URL
const stripProtocol = (url: string) => url.replace(PROTOCOL_REGEX, "");

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
      {showSeparator && <span className="text-gray-400">•</span>}
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

  // Calculate scale based on container size
  const calculateScale = () => {
    if (!(containerRef.current && documentRef.current)) {
      return;
    }

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // A4 dimensions in pixels (at 96 DPI: 210mm = ~794px, 297mm = ~1123px)
    const documentWidth = 794; // 210mm in pixels (corrected)
    const documentHeight = 1123; // 297mm in pixels

    // Calculate scale factors for width and height
    const PADDING = 10;
    const scaleX = (containerWidth - PADDING) / documentWidth; // 40px for padding
    const scaleY = (containerHeight - PADDING) / documentHeight; // 40px for padding

    // Use the smaller scale to ensure document fits in both dimensions
    const newScale = Math.min(scaleX, scaleY, 1); // Don't scale above 100%

    setScale(newScale);
  };

  useEffect(() => {
    setIsHydrated(true);

    // Calculate initial scale
    const timer = setTimeout(calculateScale, 100);

    // Recalculate on window resize
    const handleResize = () => {
      calculateScale();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            width: "210mm", // Fixed: Match A4 width instead of 230mm
            minHeight: "297mm",
            padding: "12mm", // Match PDF padding for consistent text wrapping
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <div className="mb-8 border-gray-200 border-b-2 pb-6 text-center">
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
    basicInfo.phoneNumber && { type: "text", value: basicInfo.phoneNumber },
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

  return (
    <div
      className="flex h-full justify-center overflow-auto border border-gray-300 bg-gray-100 p-5"
      ref={containerRef}
    >
      <div
        className="bg-white shadow-2xl"
        ref={documentRef}
          style={{
            width: "210mm", // Fixed: Match A4 width instead of 230mm
            minHeight: "297mm",
            padding: "12mm", // Match PDF padding for consistent text wrapping
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
      >
        {/* Header Section */}
        <div className="mb-6 border-gray-200 border-b-2 pb-4 text-center">
          {/* Name */}
          <h1 className="mb-3 font-bold text-4xl text-gray-900">
            {basicInfo.firstName || "First Name"}{" "}
            {basicInfo.lastName || "Last Name"}
          </h1>

          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-gray-600 text-sm">
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
                      className="text-blue-600 hover:underline"
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

        {/* Professional Summary Section */}
        {professionalSummary && professionalSummary.trim() && (
          <div className="mb-8">
            <h2 className="mb-4 border-gray-200 border-b-2 pb-2 font-bold text-gray-900 text-xl uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {professionalSummary}
            </p>
          </div>
        )}

        {/* Work Experience Section */}
        {workExperience && workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 border-gray-200 border-b-2 pb-2 font-bold text-gray-900 text-xl uppercase tracking-wide">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {workExperience.map((experience, index) => (
                <div className="" key={experience.id || `experience-${index}`}>
                  {/* Job Title and Company */}
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {experience.position}
                      </h3>
                      <div className="font-medium text-gray-700">
                        {experience.company}
                        {experience.location && (
                          <span className="ml-2 text-gray-500">
                            • {experience.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 font-medium text-gray-600 text-sm">
                      {experience.date}
                    </div>
                  </div>

                  {/* Responsibilities/Achievements */}
                  {experience.description &&
                    experience.description.length > 0 && (
                      <ul className="mb-3 space-y-1">
                        {experience.description.map((bullet, bulletIndex) => (
                          <li
                            className="flex items-start text-gray-700 text-sm leading-relaxed"
                            key={bulletIndex}
                          >
                            <span className="mt-2 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
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
                          <span className="mr-2 font-medium text-gray-600 text-sm">
                            Technologies:
                          </span>
                          {experience.technologies.map((tech, techIndex) => (
                            <span
                              className="inline-block rounded bg-gray-100 px-2 py-1 font-medium text-gray-700 text-xs"
                              key={techIndex}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 border-gray-200 border-b-2 pb-2 font-bold text-gray-900 text-xl uppercase tracking-wide">
              Skills
            </h2>
            <div className="space-y-4">
              {skills.map((skillCategory, categoryIndex) => (
                <div
                  className=""
                  key={skillCategory.id || `category-${categoryIndex}`}
                >
                  {/* Category Name */}
                  {skillCategory.category && (
                    <h3 className="mb-2 font-bold text-base text-gray-900">
                      {skillCategory.category}
                    </h3>
                  )}

                  {/* Skills List */}
                  {skillCategory.items && skillCategory.items.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          className="inline-block rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 text-sm"
                          key={skillIndex}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
