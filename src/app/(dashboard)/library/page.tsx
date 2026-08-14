"use client";

import { Heading, Text } from "@/components/atoms/Typography";
import MaterialUploader from "@/components/organisms/MaterialUploader";
import ActiveMiniQuiz from "@/components/organisms/ActiveMiniQuiz";

export default function LibraryPage() {
  return (
    <div className="w-full">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        
        {/* AREA KIRI */}
        <div className="mb-10">
          <Heading level={1} variant="headline-large" className="mb-2">
            Library
          </Heading>
          <Text variant="muted">
            Upload your documents and let AI generate study guides for you.
          </Text>

          {/* Memanggil komponen Uploader */}
          <MaterialUploader />
        </div>

        {/* AREA KANAN: Memanggil komponen ActiveMiniQuiz */}
        <ActiveMiniQuiz />
        
      </div>
    </div>
  );
}