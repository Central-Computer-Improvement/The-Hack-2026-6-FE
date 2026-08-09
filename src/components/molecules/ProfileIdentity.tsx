import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading, Text } from "@/components/atoms/Typography";

export interface ProfileIdentityProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export const ProfileIdentity = React.forwardRef<HTMLDivElement, ProfileIdentityProps>(
  (
    {
      className,
      name,
      role,
      avatarSrc,
      avatarFallback,
      orientation = "vertical",
      size = "md",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<"sm" | "md" | "lg", string> = {
      sm: "h-10 w-10",
      md: "h-14 w-14",
      lg: "h-20 w-20 text-xl",
    };
    const fallbackText = avatarFallback || name.substring(0, 2).toUpperCase();

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical"
            ? "flex-col items-center text-center gap-3"
            : "flex-row items-center text-left gap-4",
          className
        )}
        {...props}
      >
        {/* Avatar */}
        <Avatar className={cn(sizeClasses[size], "border-2 border-transparent bg-indigo-soft shadow-sm")}>
          <AvatarImage src={avatarSrc} alt={name} className="object-cover" />
          <AvatarFallback className="bg-indigo-soft text-indigo-base font-bold">
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        {/* Typography */}
        <div className={cn("flex flex-col gap-0.5", orientation === "vertical" ? "items-center" : "items-start")}>
          <Heading 
            level={3} 
            variant={orientation === "vertical" ? "h5" : "h6"} 
            className="text-primary tracking-tight"
          >
            {name}
          </Heading>
          
          {role && (
            <Text variant="muted" className="text-sm">
              {role}
            </Text>
          )}
        </div>
      </div>
    );
  }
);
ProfileIdentity.displayName = "ProfileIdentity";