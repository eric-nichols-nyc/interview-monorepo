import { AuthProvider } from "@repo/auth/provider";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./providers/theme";

export {
  type ChatMessage,
  CollapsibleChat,
  type CollapsibleChatProps,
} from "./components/collapsible-chat";
// Export components
export { Navigation } from "./components/navigation";
export {
  type ExternalLinkItem,
  UserAvatarDropdown,
  type UserAvatarDropdownProps,
} from "./components/user-avatar-dropdown";

type DesignSystemProviderProperties = ThemeProviderProps & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const DesignSystemProvider = ({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AuthProvider helpUrl={helpUrl} privacyUrl={privacyUrl} termsUrl={termsUrl}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </AuthProvider>
  </ThemeProvider>
);
