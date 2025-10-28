import { describe, expect, it } from "vitest";

// Regex at top level for performance
const PROTOCOL_REGEX = /^https?:\/\//;

// Simple utility function to test
function stripProtocol(url: string): string {
	return url.replace(PROTOCOL_REGEX, "");
}

describe("String Helpers", () => {
  describe("stripProtocol", () => {
    it("should remove https:// from URL", () => {
      const result = stripProtocol("https://example.com");
      expect(result).toBe("example.com");
    });

    it("should remove http:// from URL", () => {
      const result = stripProtocol("http://example.com");
      expect(result).toBe("example.com");
    });

    it("should leave URL unchanged if no protocol", () => {
      const result = stripProtocol("example.com");
      expect(result).toBe("example.com");
    });
  });
});
