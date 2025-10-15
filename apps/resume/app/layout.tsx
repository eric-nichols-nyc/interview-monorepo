import { AuthProvider } from "@repo/auth/provider";
import { DesignSystemProvider } from "@repo/design-system";
import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../components/providers/query-provider";
import { Header } from "./components/header";

export const metadata: Metadata = {
  title: "Resume Platform",
  description: "Interview platform for resume reviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <DesignSystemProvider>
          <AuthProvider>
            <QueryProvider>
              <Header />
              {children}
            </QueryProvider>
          </AuthProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
