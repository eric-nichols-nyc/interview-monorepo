"use client";
import { useEffect, useRef, useState } from "react";
import { useResumeBasicInfo } from "../../../../../stores/resume-editor-store";

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

  // Calculate scale based on container size
  const calculateScale = () => {
    if (!(containerRef.current && documentRef.current)) {
      return;
    }

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // A4 dimensions in pixels (at 96 DPI: 230mm = ~794px, 297mm = ~1123px)
    const documentWidth = 870; // 210mm in pixels
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
            width: "230mm",
            minHeight: "297mm",
            padding: "20mm",
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
          width: "230mm",
          minHeight: "297mm",
          padding: "20mm",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Header Section */}
        <div className="mb-8 border-gray-200 border-b-2 pb-6 text-center">
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
      </div>
    </div>
  );
}
