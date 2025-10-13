# UserAvatarDropdown Component

A customizable user avatar dropdown component that combines a shadcn avatar with a dropdown menu containing external links and a signout button.

## Features

- **Customizable Avatar**: Supports image URL, fallback text, and different sizes
- **External Links**: Up to 3 configurable external links with icons
- **Sign Out**: Dedicated signout button with destructive styling
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive**: Works on all screen sizes
- **Theming**: Follows your design system's theme

## Basic Usage

```tsx
import { UserAvatarDropdown } from "@repo/design-system";

export function Header() {
  return (
    <UserAvatarDropdown />
  );
}
```

**Note**: The component automatically uses the `useAuth` hook to get user data and handle sign out. Make sure your app is wrapped with the `AuthProvider` from `@repo/auth/provider`.

## Advanced Usage with Custom Links

```tsx
import { UserAvatarDropdown, type ExternalLinkItem } from "@repo/design-system";
import { Settings, BookOpen, MessageCircle } from "lucide-react";

export function CustomUserMenu() {
  const customLinks: ExternalLinkItem[] = [
    {
      label: "Account Settings",
      href: "/settings/account",
      icon: Settings
    },
    {
      label: "Documentation",
      href: "https://docs.example.com",
      icon: BookOpen
    },
    {
      label: "Support",
      href: "https://support.example.com",
      icon: MessageCircle
    }
  ];

  const handleSignOut = async () => {
    try {
      // Your async signout logic
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <UserAvatarDropdown
      name="Jane Smith"
      email="jane.smith@company.com"
      avatarUrl="/avatars/jane.jpg"
      avatarFallback="JS"
      externalLinks={customLinks}
      onSignOut={handleSignOut}
      size="lg"
      className="border-2 border-primary"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `externalLinks` | `ExternalLinkItem[]` | Default links | Array of external links to display |
| `className` | `string` | `undefined` | Additional CSS classes for avatar trigger |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant for the avatar |
| `nameOverride` | `string` | Uses auth user data | Override user display name |
| `emailOverride` | `string` | Uses auth user data | Override user email |
| `avatarUrlOverride` | `string` | Uses auth user data | Override avatar URL |
| `avatarFallbackOverride` | `string` | Auto-generated from name | Override avatar fallback text |

## ExternalLinkItem Interface

```tsx
interface ExternalLinkItem {
  label: string;                                    // Display text
  href: string;                                     // URL to open
  icon?: React.ComponentType<{ className?: string }>; // Optional icon component
}
```

## Default External Links

If no `externalLinks` are provided, the component uses these defaults:

- **Profile Settings** (`/profile`) with Settings icon
- **Help Center** (`/help`) with HelpCircle icon  
- **Documentation** (`/docs`) with ExternalLink icon

## Size Variants

- `sm`: 24px (size-6)
- `md`: 32px (size-8) - default
- `lg`: 40px (size-10)

## Accessibility

The component includes:
- ARIA label for the trigger button
- Screen reader support for fallback text
- Keyboard navigation support
- Focus management
- Semantic HTML structure

## Styling

The component uses your design system's theme variables:
- `--background` for dropdown background
- `--border` for borders and separators  
- `--muted-foreground` for secondary text
- `--destructive` for the sign out button
- `--ring` for focus states

## Integration with Authentication

The component automatically integrates with your auth system using the `useAuth` hook from `@repo/auth/provider`. It will:

- **Auto-populate user data** from the authenticated user
- **Handle sign out** using the auth provider's signOut method
- **Show loading state** while authentication is loading
- **Hide when not authenticated** (returns null if no user and not loading)

```tsx
import { UserAvatarDropdown } from "@repo/design-system";

export function AuthenticatedHeader() {
  return (
    <div className="flex justify-end p-4">
      <UserAvatarDropdown />
    </div>
  );
}
```

### User Data Sources

The component gets user data in this priority order:
1. `nameOverride` prop → `user.user_metadata.full_name` → first part of email → "User"
2. `emailOverride` prop → `user.email`
3. `avatarUrlOverride` prop → `user.user_metadata.avatar_url`

## Next.js App Router Example

```tsx
// app/components/header.tsx
"use client";

import { UserAvatarDropdown } from "@repo/design-system";
import { signOut } from "@repo/auth/client";

export function Header() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <h1>My App</h1>
        <UserAvatarDropdown
          name="Current User"
          onSignOut={() => signOut()}
        />
      </div>
    </header>
  );
}
```

## Troubleshooting

### Links not opening
Ensure your `href` values are complete URLs for external links:
```tsx
// ✅ Good
{ label: "Help", href: "https://help.example.com" }

// ❌ Bad - relative paths won't work as external links  
{ label: "Help", href: "/help" }
```

### Sign out not working
Make sure to provide an `onSignOut` callback:
```tsx
<UserAvatarDropdown
  onSignOut={() => {
    // Your signout logic here
    signOut();
  }}
/>
```

### Avatar not showing
Check that `avatarUrl` is accessible and properly formatted:
```tsx
// ✅ Good
avatarUrl="https://example.com/avatar.jpg"

// ❌ Bad - relative paths may not work depending on your setup
avatarUrl="/images/avatar.jpg"
```