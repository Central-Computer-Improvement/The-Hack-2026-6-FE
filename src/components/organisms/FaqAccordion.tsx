// file: src/components/organisms/FaqAccordion.tsx
"use client";

import * as React from "react";
import { FaqAccordionItem } from "@/components/molecules/FaqAccordionItem";
import { FaqItem } from "@/types/help-center";

export interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenId?: string;
}

export function FaqAccordion({ items, defaultOpenId }: FaqAccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
