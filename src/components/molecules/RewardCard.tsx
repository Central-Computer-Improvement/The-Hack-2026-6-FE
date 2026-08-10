// file : src/components/molecules/RewardCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/atoms/Typography";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, Trophy } from "lucide-react";

export interface RewardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  isUnlocked?: boolean;
  progressValue?: number;
  icon?: LucideIcon;
  imageSrc?: string;
  iconWrapperClassName?: string;
}

export const RewardCard = React.forwardRef<HTMLDivElement, RewardCardProps>(
  (
    {
      className,
      title,
      description,
      isUnlocked = true,
      progressValue = 0,
      icon: Icon = Trophy,
      imageSrc,
      iconWrapperClassName,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "relative flex min-h-[220px] flex-col items-center p-6 text-center transition-all duration-300",
          isUnlocked
            ? "border-border bg-card shadow-sm hover:border-indigo-mid hover:shadow-md"
            : "border-dashed border-border bg-muted/10 opacity-80 grayscale-[40%]",
          className
        )}
        {...props}
      >
        {/* visual badge*/}
        <div
          className={cn(
            "mb-4 flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-inner",
            isUnlocked ? (iconWrapperClassName || "bg-indigo-50 text-indigo-base") : "bg-muted text-muted-foreground"
          )}
        >
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={title} 
              className="h-full w-full rounded-full object-cover p-2" 
            />
          ) : (
            <Icon className="h-10 w-10" />
          )}
        </div>

        {/* Area Tipografi */}
        <Heading 
          level={4} 
          variant="h6" 
          className={cn("mb-1 line-clamp-1", !isUnlocked && "text-muted-foreground")}
        >
          {title}
        </Heading>
        
        <Text 
          variant="small" 
          className={cn("line-clamp-2", !isUnlocked && "text-muted-foreground/70")}
        >
          {description}
        </Text>

        {/* Area Progress Bar  */}
        {!isUnlocked && (
          <div className="mt-auto w-full pt-6">
            <Progress 
              value={progressValue} 
              className="h-2 w-full" 
            />
          </div>
        )}
      </Card>
    );
  }
);
RewardCard.displayName = "RewardCard";