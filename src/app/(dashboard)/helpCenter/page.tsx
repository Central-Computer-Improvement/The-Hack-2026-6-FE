// file: src/app/(dashboard)/helpCenter/page.tsx
"use client";

import HelpCenterTemplate from "@/components/templates/HelpCenterTemplate";
import { HELP_TOPICS, FAQ_ITEMS } from "@/constants/helpCenterMock";

export default function HelpCenterPage() {
  return (
    <HelpCenterTemplate
      topics={HELP_TOPICS}
      faqItems={FAQ_ITEMS}
      onContactSupport={() => {
        // TODO: sambungkan ke channel support asli (email/live chat/dll) begitu tersedia
        console.log("Hubungi Kami diklik");
      }}
    />
  );
}