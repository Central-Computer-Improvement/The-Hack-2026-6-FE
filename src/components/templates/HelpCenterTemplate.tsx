// file: src/components/templates/HelpCenterTemplate.tsx
"use client";

import * as React from "react";
import { SearchInput } from "@/components/molecules/SearchInput";
import { HelpTopicGrid } from "@/components/organisms/HelpTopicGrid";
import { FaqAccordion } from "@/components/organisms/FaqAccordion";
import { ContactSupportBanner } from "@/components/organisms/ContactSupportBanner";
import { Heading, Text } from "@/components/atoms/Typography";
import { HelpTopic, FaqItem } from "@/types/help-center";

export interface HelpCenterTemplateProps {
  topics: HelpTopic[];
  faqItems: FaqItem[];
  onTopicClick?: (topic: HelpTopic) => void;
  onContactSupport?: () => void;
}

export default function HelpCenterTemplate({
  topics,
  faqItems,
  onTopicClick,
  onContactSupport,
}: HelpCenterTemplateProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <main className="w-full px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[900px] flex-col gap-10">
        {/* Header + Search */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Text as="span" variant="small" className="font-bold text-indigo-base">
            Pusat Bantuan
          </Text>
          <Heading level={1} variant="headline-medium">
            Ada yang bisa kami bantu?
          </Heading>

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari bantuan..."
            containerClassName="mt-4 w-full max-w-[480px]"
          />
        </div>

        {/* Topik Bantuan */}
        <div className="flex flex-col gap-4">
          <Text variant="muted" className="font-semibold">
            Topik Bantuan
          </Text>
          <HelpTopicGrid topics={topics} onTopicClick={onTopicClick} />
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-4">
          <Text variant="muted" className="text-center font-semibold">
            Pertanyaan yang Sering Ditanyakan
          </Text>
          <FaqAccordion items={faqItems} />
        </div>

        {/* Contact Support */}
        <ContactSupportBanner onContact={onContactSupport} />
      </div>
    </main>
  );
}
