import { DesignSystemProvider, Navigation } from "@repo/design-system";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Search Platform",
  description: "Search platform for finding content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DesignSystemProvider>
          <Navigation />
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
