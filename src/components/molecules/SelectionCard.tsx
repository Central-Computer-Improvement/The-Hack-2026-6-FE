// file : src/components/molecules/SelectionCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/atoms/Typography";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SelectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  
  description: string;
  
  selected?: boolean;
  
  icon?: LucideIcon;
  
  imageSrc?: string;
  
  badgeText?: string;
  
  iconWrapperClassName?: string;
}

export const SelectionCard = React.forwardRef<HTMLDivElement, SelectionCardProps>(
  (
    {
      className,
      title,
      description,
      selected = false,
      icon: Icon,
      imageSrc,
      badgeText,
      iconWrapperClassName,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        onClick={onClick}
        className={cn(
          "relative flex cursor-pointer flex-col items-center p-6 text-center transition-all duration-200",
          // Status (Selected or not)
          selected
            ? "border-indigo-base bg-indigo-50/50 shadow-sm ring-1 ring-indigo-base"
            : "border-border bg-card hover:border-indigo-mid hover:shadow-md",
          className
        )}
        {...props}
      >
        {/* badge */}
        {badgeText && (
          <div className="absolute right-4 top-4">
            <Badge 
              variant="secondary" 
              className="bg-indigo-soft text-indigo-base hover:bg-indigo-soft"
            >
              {badgeText}
            </Badge>
          </div>
        )}

        {/* Icon/Image */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
          {imageSrc ? (
            <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
          ) : Icon ? (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-indigo-50",
                iconWrapperClassName
              )}
            >
              <Icon className="h-10 w-10 text-primary" />
            </div>
          ) : null}
        </div>

        {/* Typography */}
        <Heading level={3} variant="h6" className="mb-2 text-primary">
          {title}
        </Heading>
        <Text variant="muted" className="text-sm">
          {description}
        </Text>
      </Card>
    );
  }
);
SelectionCard.displayName = "SelectionCard";