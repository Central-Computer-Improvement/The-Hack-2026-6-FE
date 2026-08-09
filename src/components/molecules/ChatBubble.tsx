import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/atoms/Typography";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  sender: "user" | "ai";
  avatarSrc?: string;
  avatarFallback?: string;
  time?: string;
}

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, message, sender, avatarSrc, avatarFallback, time, ...props }, ref) => {
    const isAI = sender === "ai";

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-end gap-3",
          isAI ? "justify-start" : "justify-end", 
          className
        )}
        {...props}
      >
        {/* Avatar AI */}
        {isAI && (
          <Avatar className="h-8 w-8 shrink-0 border border-transparent shadow-sm">
            <AvatarImage src={avatarSrc} alt="AI" className="object-cover" />
            <AvatarFallback className="bg-indigo-soft text-indigo-base text-xs font-bold">
              {avatarFallback || "AI"}
            </AvatarFallback>
          </Avatar>
        )}

        {/* bubble chat container */}
        <div 
          className={cn(
            "flex max-w-[75%] flex-col gap-1", 
            isAI ? "items-start" : "items-end"
          )}
        >
          <div
            className={cn(
              "px-4 py-3 shadow-sm",
              isAI
                ? "rounded-2xl rounded-bl-sm bg-indigo-base text-white"
                : "rounded-2xl rounded-br-sm border border-border bg-card text-primary"
            )}
          >
            <Text
              variant="body-medium"
              className={cn(
                "whitespace-pre-wrap leading-relaxed", 
                isAI ? "text-white" : "text-primary"
              )}
            >
              {message}
            </Text>
          </div>

          {/* Timestamp */}
          {time && (
            <Text variant="small" className="px-1 text-[11px] text-muted-foreground">
              {time}
            </Text>
          )}
        </div>

        {/* Avatar User */}
        {!isAI && (
          <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm">
            <AvatarImage src={avatarSrc} alt="User" className="object-cover" />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
              {avatarFallback || "ME"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
);
ChatBubble.displayName = "ChatBubble";