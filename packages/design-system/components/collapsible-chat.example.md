# CollapsibleChat Component

A fully-featured collapsible chat interface component with support for messages, avatars, and real-time updates.

## Features

- **Collapsible**: Can be minimized to a floating button
- **Maximizable**: Expand to full screen or use compact mode
- **Message Display**: Shows messages with avatars, names, and timestamps
- **Auto-scroll**: Automatically scrolls to newest messages
- **Responsive**: Works on all screen sizes
- **Customizable Position**: Place in any corner of the screen
- **Keyboard Support**: Press Enter to send messages
- **Accessible**: Proper ARIA labels and semantic HTML

## Basic Usage

```tsx
import { CollapsibleChat, type ChatMessage } from "@repo/design-system";

export function ChatWidget() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: {
        id: "current-user",
        name: "You",
      },
      timestamp: new Date(),
      isCurrentUser: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <CollapsibleChat
      messages={messages}
      onSendMessage={handleSendMessage}
      title="Support Chat"
    />
  );
}
```

## Advanced Usage with Real-time Updates

```tsx
"use client";

import React from "react";
import { CollapsibleChat, type ChatMessage } from "@repo/design-system";

export function RealtimeChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: {
        id: "support",
        name: "Support Agent",
        avatarUrl: "/avatars/support.jpg",
      },
      timestamp: new Date(Date.now() - 60000),
      isCurrentUser: false,
    },
  ]);

  const currentUser = {
    id: "user-123",
    name: "Jane Doe",
    avatarUrl: "/avatars/jane.jpg",
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate receiving a response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! Let me help you with that.",
        sender: {
          id: "support",
          name: "Support Agent",
          avatarUrl: "/avatars/support.jpg",
        },
        timestamp: new Date(),
        isCurrentUser: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  return (
    <CollapsibleChat
      messages={messages}
      onSendMessage={handleSendMessage}
      currentUser={currentUser}
      title="Customer Support"
      defaultOpen={true}
      position="bottom-right"
      placeholder="Ask us anything..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `ChatMessage[]` | `[]` | Array of chat messages to display |
| `onSendMessage` | `(message: string) => void` | `undefined` | Callback when user sends a message |
| `currentUser` | `{ id: string; name: string; avatarUrl?: string }` | `undefined` | Current user information |
| `title` | `string` | `"Chat"` | Title displayed in chat header |
| `defaultOpen` | `boolean` | `false` | Whether chat starts open |
| `defaultMaximized` | `boolean` | `false` | Whether chat starts maximized |
| `className` | `string` | `undefined` | Additional CSS classes |
| `placeholder` | `string` | `"Type a message..."` | Input placeholder text |
| `position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Position on screen |

## ChatMessage Interface

```tsx
interface ChatMessage {
  id: string;                           // Unique message ID
  content: string;                      // Message text
  sender: {
    id: string;                         // Sender user ID
    name: string;                       // Sender display name
    avatarUrl?: string;                 // Optional avatar URL
  };
  timestamp: Date;                      // Message timestamp
  isCurrentUser: boolean;               // Whether message is from current user
}
```

## Position Options

- `bottom-right`: Bottom right corner (default)
- `bottom-left`: Bottom left corner
- `top-right`: Top right corner
- `top-left`: Top left corner

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: Add line break (not currently supported, single-line input)

## Examples

### Minimal Setup

```tsx
<CollapsibleChat
  onSendMessage={(msg) => console.log(msg)}
/>
```

### Customer Support Chat

```tsx
<CollapsibleChat
  messages={supportMessages}
  onSendMessage={handleCustomerMessage}
  title="Need Help?"
  position="bottom-right"
  defaultOpen={false}
  placeholder="Describe your issue..."
/>
```

### Team Collaboration

```tsx
<CollapsibleChat
  messages={teamMessages}
  onSendMessage={handleTeamMessage}
  currentUser={currentTeamMember}
  title="Team Chat"
  defaultOpen={true}
  defaultMaximized={true}
  position="top-right"
/>
```

### With Avatar Fallbacks

```tsx
const messages: ChatMessage[] = [
  {
    id: "1",
    content: "Message without avatar URL",
    sender: {
      id: "user1",
      name: "John Smith", // Will show "JS" as fallback
    },
    timestamp: new Date(),
    isCurrentUser: false,
  },
];
```

## Styling

The component uses your design system's theme variables:

- `--primary` for current user messages
- `--muted` for other user messages
- `--border` for separators
- `--background` for cards
- `--muted-foreground` for timestamps

## Integration with Backend

### Socket.io Example

```tsx
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { CollapsibleChat, type ChatMessage } from "@repo/design-system";

export function SocketChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    const message = {
      id: Date.now().toString(),
      content,
      sender: { id: "me", name: "Current User" },
      timestamp: new Date(),
      isCurrentUser: true,
    };

    socket.emit("message", message);
    setMessages((prev) => [...prev, message]);
  };

  return <CollapsibleChat messages={messages} onSendMessage={handleSendMessage} />;
}
```

### REST API Example

```tsx
const handleSendMessage = async (content: string) => {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  const message = await response.json();
  setMessages((prev) => [...prev, message]);
};
```

## Accessibility

The component includes:

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for new messages
- Focus management
- Semantic HTML structure

## Browser Support

Works in all modern browsers that support:
- CSS Grid and Flexbox
- ES6+ JavaScript
- React 18+

## Troubleshooting

### Messages not scrolling to bottom

The component auto-scrolls on new messages. If this isn't working, ensure:
- The `messages` array is properly updating
- React is re-rendering the component

### Send button disabled

The send button is disabled when:
- Input is empty or only whitespace
- No `onSendMessage` callback is provided

### Chat not appearing

Check:
- Component is rendered in the DOM
- Position doesn't conflict with other fixed elements
- Z-index is appropriate for your layout

