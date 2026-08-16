// file: src/components/organisms/HelpTopicGrid.tsx
import * as React from "react";
import { HelpTopicCard } from "@/components/molecules/HelpTopicCard";
import { HelpTopic } from "@/types/help-center";

export interface HelpTopicGridProps {
  topics: HelpTopic[];
  onTopicClick?: (topic: HelpTopic) => void;
}

export function HelpTopicGrid({ topics, onTopicClick }: HelpTopicGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <HelpTopicCard
          key={topic.id}
          icon={topic.icon}
          title={topic.title}
          description={topic.description}
          iconBgClassName={topic.iconBg}
          iconColorClassName={topic.iconColor}
          onClick={onTopicClick ? () => onTopicClick(topic) : undefined}
        />
      ))}
    </div>
  );
}
