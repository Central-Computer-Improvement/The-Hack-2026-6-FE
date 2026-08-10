"use client";

// file : src/components/molecules/ChatInput.tsx
import * as React from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/atoms/IconButton";

export interface ChatInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  onSendMessage: (message: string) => void;  
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  ({ className, onSendMessage, placeholder = "Type your message...", disabled = false, ...props }, ref) => {
    const [message, setMessage] = React.useState("");

    const handleSend = () => {
      if (message.trim() && !disabled) {
        onSendMessage(message.trim());
        setMessage(""); 
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-3 shadow-sm transition-all focus-within:border-indigo-base focus-within:ring-1 focus-within:ring-indigo-base",
          className
        )}
        {...props}
      >
        {/* Lampiran (Paperclip) */}
        <IconButton
          icon={Paperclip}
          variant="ghost"
          aria-label="Attach a file"
          disabled={disabled}
          className="h-10 w-10 text-muted-foreground hover:text-primary shrink-0"
          iconSize={20}
        />

        {/* Input Teks */}
        <Input
          type="text"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 border-0 bg-transparent px-2 py-0 h-10 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Tombol Send */}
        <IconButton
          icon={Send}
          variant="secondary"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          aria-label="Send message"
          iconSize={18}
          className={cn(
            "h-10 w-10 shrink-0 transition-transform duration-200",
            // feedback visual jika teks masih kosong
            !message.trim() ? "opacity-50 scale-95" : "opacity-100 scale-100 hover:scale-105"
          )}
        />
      </div>
    );
  }
);
ChatInput.displayName = "ChatInput";