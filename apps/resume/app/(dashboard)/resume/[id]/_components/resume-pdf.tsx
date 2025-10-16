"use client";

import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  useResumeBasicInfo,
  useResumeProfessionalSummary,
  useResumeSkills,
  useResumeWorkExperience,
} from "../../../../../stores/resume-editor-store";
import type {
  BasicInfo,
  Skill,
  WorkExperience,
} from "../../../../../types/profile";

// Using Helvetica for reliable PDF generation
// Google Fonts can be added back later if needed

// Define styles for the PDF with enhanced typography
const styles = StyleSheet.create({
  page: {
    padding: "6mm", // Optimal balance: good margins without text wrapping issues
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontWeight: 400,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 24, // Reduced from 32 to 24
    textAlign: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 16, // Reduced from 24 to 16
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    fontSize: 11,
    color: "#64748b",
    fontWeight: 400,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactSeparator: {
    marginHorizontal: 10,
    color: "#cbd5e1",
    fontSize: 8,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  workItem: {
    marginBottom: 28,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  jobLeft: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
    lineHeight: 1.2,
  },
  company: {
    fontSize: 13,
    fontWeight: "normal",
    color: "#475569",
  },
  location: {
    fontSize: 11,
    color: "#64748b",
    marginLeft: 8,
    fontWeight: 400,
  },
  dates: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#64748b",
    marginLeft: 16,
  },
  description: {
    marginBottom: 14,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 0,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563eb",
    marginRight: 12,
    marginTop: 7,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 11,
    color: "#334155",
    lineHeight: 1.6,
    flex: 1,
    fontWeight: 400,
  },
  technologies: {
    marginTop: 14,
  },
  techHeader: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#64748b",
    marginBottom: 8,
  },
  techTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  techTag: {
    fontSize: 9,
    fontWeight: "normal",
    color: "#1e293b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  skillsCategory: {
    marginBottom: 18,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
  },
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 1.5,
    textAlign: 'left',
  },
});

// Helper to remove protocol from URLs
const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

interface ContactItemProps {
  children: React.ReactNode;
  showSeparator: boolean;
}

function ContactItem({ children, showSeparator }: ContactItemProps) {
  return (
    <View style={styles.contactItem}>
      {children}
      {showSeparator && <Text style={styles.contactSeparator}>•</Text>}
    </View>
  );
}

export function ResumePDF() {
  const basicInfo = useResumeBasicInfo();
  const workExperience = useResumeWorkExperience();
  const skills = useResumeSkills();
  const professionalSummary = useResumeProfessionalSummary();

  // Build contact info items array
  const contactItems = [
    basicInfo?.email && { type: "text", value: basicInfo.email },
    basicInfo?.phoneNumber && { type: "text", value: basicInfo.phoneNumber },
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

        {/* Professional Summary Section */}
        {professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>
              {professionalSummary}
            </Text>
          </View>
        )}

        {/* Work Experience Section */}
        {workExperience && workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {workExperience.map((experience: WorkExperience, index: number) => (
              <View
                key={experience.id || `experience-${index}`}
                style={styles.workItem}
              >
                {/* Job Title and Company */}
                <View style={styles.jobHeader}>
                  <View style={styles.jobLeft}>
                    <Text style={styles.jobTitle}>{experience.position}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.company}>{experience.company}</Text>
                      {experience.location && (
                        <Text style={styles.location}>
                          • {experience.location}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.dates}>{experience.date}</Text>
                </View>

                {/* Responsibilities/Achievements */}
                {experience.description &&
                  experience.description.length > 0 && (
                    <View style={styles.description}>
                      {experience.description.map(
                        (bullet: string, bulletIndex: number) => (
                          <View key={bulletIndex} style={styles.bulletPoint}>
                            <View style={styles.bullet} />
                            <Text style={styles.bulletText}>{bullet}</Text>
                          </View>
                        )
                      )}
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
                          marginBottom: 8,
                        }}
                      >
                        <Text style={styles.techHeader}>Technologies:</Text>
                      </View>
                      <View style={styles.techTags}>
                        {experience.technologies.map(
                          (tech: string, techIndex: number) => (
                            <Text key={techIndex} style={styles.techTag}>
                              {tech}
                            </Text>
                          )
                        )}
                      </View>
                    </View>
                  )}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skillCategory: Skill, categoryIndex: number) => (
              <View
                key={skillCategory.id || `category-${categoryIndex}`}
                style={styles.skillsCategory}
              >
                {/* Category Name */}
                {skillCategory.category && (
                  <Text style={styles.categoryTitle}>
                    {skillCategory.category}
                  </Text>
                )}

                {/* Skills List */}
                {skillCategory.items && skillCategory.items.length > 0 && (
                  <View style={styles.skillTags}>
                    {skillCategory.items.map(
                      (skill: string, skillIndex: number) => (
                        <Text key={skillIndex} style={styles.skillTag}>
                          {skill}
                        </Text>
                      )
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
