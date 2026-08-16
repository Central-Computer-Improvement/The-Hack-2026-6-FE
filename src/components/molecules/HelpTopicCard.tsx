// file: src/components/molecules/HelpTopicCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/atoms/Typography";
import { LucideIcon } from "lucide-react";

export interface HelpTopicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgClassName: string;
  iconColorClassName: string;
}

export const HelpTopicCard = React.forwardRef<HTMLDivElement, HelpTopicCardProps>(
  (
    { className, icon: Icon, title, description, iconBgClassName, iconColorClassName, onClick, ...props },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex flex-col items-start gap-4 rounded-[24px] p-6 transition-all duration-200",
          onClick && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
          className
        )}
        {...props}
      >
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", iconBgClassName)}>
          <Icon className={cn("h-6 w-6", iconColorClassName)} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col gap-1">
          <Heading level={3} variant="h6">
            {title}
          </Heading>
          <Text variant="small">{description}</Text>
        </div>
      </Card>
    );
  }
);
HelpTopicCard.displayName = "HelpTopicCard";
