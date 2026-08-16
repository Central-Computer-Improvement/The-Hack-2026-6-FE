// file: src/components/organisms/ContactSupportBanner.tsx
import * as React from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography";

export interface ContactSupportBannerProps {
  onContact?: () => void;
}

export function ContactSupportBanner({ onContact }: ContactSupportBannerProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[28px] bg-indigo-soft px-8 py-10 text-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-card text-indigo-base shadow-sm">
        <Headphones className="h-7 w-7" strokeWidth={2.5} />
      </div>

      <Heading level={3} variant="h5">
        Masih butuh bantuan?
      </Heading>

      <Text variant="muted" className="max-w-[420px] leading-relaxed">
        Tidak menemukan jawaban yang kamu cari? Hubungi kami untuk mendapatkan bantuan langsung dari tim support
        kami.
      </Text>

      <Button size="lg" onClick={onContact} className="mt-2 px-8 font-bold">
        Hubungi Kami
      </Button>
    </div>
  );
}
