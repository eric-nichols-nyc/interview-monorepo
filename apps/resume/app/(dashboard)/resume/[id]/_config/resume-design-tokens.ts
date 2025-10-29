// Shared design tokens for resume components
// This ensures consistency between PDF and HTML preview

export const resumeDesignTokens = {
  // Colors
  colors: {
    primary: {
      900: "#0f172a", // Dark text
      700: "#334155", // Body text
      600: "#475569", // Secondary text
      500: "#64748b", // Muted text
      400: "#94a3b8", // Light muted
      200: "#e2e8f0", // Borders
      100: "#f1f5f9", // Light backgrounds
      50: "#f8fafc", // Very light backgrounds
    },
    accent: {
      600: "#0f172a", // Links, bullets (black)
      500: "#334155", // Hover states (dark gray)
    },
    neutral: {
      white: "#ffffff",
      gray100: "#f8fafc",
      gray200: "#e2e8f0",
      gray300: "#cbd5e1",
      gray400: "#94a3b8",
      gray500: "#64748b",
      gray600: "#475569",
      gray700: "#334155",
      gray800: "#1e293b",
      gray900: "#0f172a",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "Helvetica", // For PDF
      fallback: ["system-ui", "sans-serif"], // For HTML
    },
    fontSize: {
      xs: 9,
      sm: 11,
      base: 12,
      lg: 13,
      xl: 16,
      "2xl": 20,
      "3xl": 24,
      "4xl": 32,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.5,
      loose: 1.6,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },
  },

  // Spacing (in pixels for base values)
  spacing: {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 10,
    5: 12,
    6: 14,
    7: 16,
    8: 18,
    10: 24,
    12: 32,
    14: 40,
    16: 48,
  },

  // Layout dimensions
  layout: {
    page: {
      // A4 dimensions in mm and pixels (96 DPI)
      a4: {
        width: {
          mm: 210,
          px: 794, // 210mm at 96 DPI
        },
        height: {
          mm: 297,
          px: 1123, // 297mm at 96 DPI
        },
      },
      padding: {
        mm: 6, // Reduced padding to prevent text wrapping
        px: 23, // Equivalent in pixels
      },
    },
  },

  // Border styles
  borders: {
    width: {
      thin: 1,
      normal: 1.5,
      thick: 2,
    },
    radius: {
      sm: 4,
      md: 6,
      lg: 8,
    },
  },

  // Component-specific spacing
  components: {
    header: {
      marginBottom: 8,
      paddingBottom: 8,
    },
    section: {
      marginBottom: 24,
      titleMarginBottom: 16,
      titlePaddingBottom: 6,
    },
    workItem: {
      marginBottom: 20,
    },
    skillsCategory: {
      marginBottom: 9,
    },
    bullet: {
      size: 4, // Reduced for more subtle appearance
      marginRight: 12,
      marginTop: 7, // Adjusted to center better with smaller bullet
    },
    contactInfo: {
      gap: 10,
      separatorMargin: 6,
    },
  },
} as const;

// Constants for PDF conversion
const PX_TO_POINTS = 0.75;
const MM_TO_POINTS = 2.834_65;

// Helper functions for React PDF
export const pdfHelpers = {
  // Convert pixels to points for React PDF (1px = 0.75pt)
  px2pt: (px: number) => px * PX_TO_POINTS,

  // Convert mm to points for React PDF (1mm = 2.83465pt)
  mm2pt: (mm: number) => mm * MM_TO_POINTS,

  // Get color value
  getColor: (path: string) => {
    const keys = path.split(".");
    let value: Record<string, unknown> = resumeDesignTokens.colors as Record<
      string,
      unknown
    >;
    for (const key of keys) {
      value = value[key] as Record<string, unknown>;
    }
    return value as unknown as string;
  },

  // Get spacing value in points
  getSpacing: (key: keyof typeof resumeDesignTokens.spacing) =>
    resumeDesignTokens.spacing[key] * PX_TO_POINTS,

  // Get font size in points
  getFontSize: (key: keyof typeof resumeDesignTokens.typography.fontSize) =>
    resumeDesignTokens.typography.fontSize[key] * PX_TO_POINTS,
};

// Helper functions for HTML/CSS
export const cssHelpers = {
  // Get Tailwind class for spacing - using arbitrary values to match design tokens exactly
  getSpacingClass: (
    key: keyof typeof resumeDesignTokens.spacing,
    prefix: "p" | "m" | "gap" | "space"
  ) => {
    const spacingMap: Record<keyof typeof resumeDesignTokens.spacing, string> =
      {
        0: "0",
        1: "[4px]", // 4px from design tokens
        2: "[6px]", // 6px from design tokens
        3: "[8px]", // 8px from design tokens
        4: "[10px]", // 10px from design tokens
        5: "[12px]", // 12px from design tokens
        6: "[14px]", // 14px from design tokens
        7: "[16px]", // 16px from design tokens
        8: "[18px]", // 18px from design tokens
        10: "[24px]", // 24px from design tokens
        12: "[32px]", // 32px from design tokens
        14: "[40px]", // 40px from design tokens
        16: "[48px]", // 48px from design tokens
      };
    return `${prefix}-${spacingMap[key]}`;
  },

  // Get Tailwind class for colors - mapping design tokens to exact color values
  getColorClass: (colorPath: string, type: "text" | "bg" | "border") => {
    // Map design tokens to exact hex values using arbitrary classes
    const colorMap: Record<string, string> = {
      "primary.900": "[#0f172a]", // Exact hex from tokens
      "primary.800": "[#1e293b]", // gray800
      "primary.700": "[#334155]", // Exact hex from tokens
      "primary.600": "[#475569]", // Exact hex from tokens
      "primary.500": "[#64748b]", // Exact hex from tokens
      "primary.400": "[#94a3b8]", // gray400
      "primary.300": "[#cbd5e1]", // gray300
      "primary.200": "[#e2e8f0]", // Exact hex from tokens
      "primary.100": "[#f1f5f9]", // Exact hex from tokens
      "primary.50": "[#f8fafc]", // Exact hex from tokens
      "accent.600": "[#2563eb]", // Exact hex from tokens
      "neutral.white": "white", // Standard Tailwind white
    };

    const colorValue = colorMap[colorPath] || "[#64748b]"; // Default to primary.500
    return `${type}-${colorValue}`;
  },

  // Get Tailwind class for font size - using arbitrary values to match design tokens exactly
  getFontSizeClass: (
    key: keyof typeof resumeDesignTokens.typography.fontSize
  ) => {
    const sizeMap: Record<
      keyof typeof resumeDesignTokens.typography.fontSize,
      string
    > = {
      xs: "text-[9px]", // 9px from design tokens
      sm: "text-[11px]", // 11px from design tokens
      base: "text-[12px]", // 12px from design tokens
      lg: "text-[13px]", // 13px from design tokens
      xl: "text-[16px]", // 16px from design tokens
      "2xl": "text-[20px]", // 20px from design tokens
      "3xl": "text-[24px]", // 24px from design tokens
      "4xl": "text-[32px]", // 32px from design tokens
    };
    return sizeMap[key];
  },
};

// Type exports for better TypeScript support
export type ColorPath =
  | keyof typeof resumeDesignTokens.colors.primary
  | keyof typeof resumeDesignTokens.colors.accent;
export type SpacingKey = keyof typeof resumeDesignTokens.spacing;
export type FontSizeKey = keyof typeof resumeDesignTokens.typography.fontSize;

// Helper function to format phone number as (XXX) XXX-XXXX
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If it's a 10-digit US number, format it
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // If it's an 11-digit number starting with 1, format it
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Otherwise, return the original phone number
  return phone;
};
