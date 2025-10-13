"use client"

import * as React from "react"
import { ExternalLink, LogOut, User, Settings, HelpCircle } from "lucide-react"
import { useAuth } from "@repo/auth/provider"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { cn } from "../lib/utils"

interface ExternalLinkItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface UserAvatarDropdownProps {
  /** Array of external links to display in dropdown */
  externalLinks?: ExternalLinkItem[]
  /** Additional className for the avatar trigger */
  className?: string
  /** Size variant for the avatar */
  size?: "sm" | "md" | "lg"
  /** Override user display name (optional, uses auth user by default) */
  nameOverride?: string
  /** Override user email (optional, uses auth user by default) */
  emailOverride?: string
  /** Override avatar URL (optional, uses auth user by default) */
  avatarUrlOverride?: string
  /** Override avatar fallback (optional, auto-generated from name by default) */
  avatarFallbackOverride?: string
}

const sizeClasses = {
  sm: "size-6",
  md: "size-8", 
  lg: "size-10"
}

const defaultExternalLinks: ExternalLinkItem[] = [
  {
    label: "Profile Settings",
    href: "/profile",
    icon: Settings
  },
  {
    label: "Help Center", 
    href: "/help",
    icon: HelpCircle
  },
  {
    label: "Documentation",
    href: "/docs",
    icon: ExternalLink
  }
]

function UserAvatarDropdown({
  externalLinks = defaultExternalLinks,
  className,
  size = "md",
  nameOverride,
  emailOverride,
  avatarUrlOverride,
  avatarFallbackOverride
}: UserAvatarDropdownProps) {
  const { user, signOut, loading } = useAuth()
  
  // Use auth user data or provided overrides
  const name = nameOverride || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
  const email = emailOverride || user?.email
  const avatarUrl = avatarUrlOverride || user?.user_metadata?.avatar_url
  const fallbackText = avatarFallbackOverride || name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  const handleExternalLinkClick = (href: string) => {
    // Open external links in new tab
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }
  
  // Don't render if user is not authenticated
  if (!user && !loading) {
    return null
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className={cn("animate-pulse rounded-full bg-muted", sizeClasses[size])} />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring",
            className
          )}
          aria-label="User menu"
        >
          <Avatar className={sizeClasses[size]}>
            <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
            <AvatarFallback>
              <User className="size-4" />
              {fallbackText && <span className="sr-only">{fallbackText}</span>}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {name && (
              <p className="font-medium text-sm">{name}</p>
            )}
            {email && (
              <p className="text-xs text-muted-foreground">{email}</p>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {externalLinks.map((link, index) => {
          const IconComponent = link.icon || ExternalLink
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleExternalLinkClick(link.href)}
              className="cursor-pointer"
            >
              <IconComponent className="mr-2 size-4" />
              <span>{link.label}</span>
              <ExternalLink className="ml-auto size-3 text-muted-foreground" />
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
          variant="destructive"
        >
          <LogOut className="mr-2 size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserAvatarDropdown, type UserAvatarDropdownProps, type ExternalLinkItem }