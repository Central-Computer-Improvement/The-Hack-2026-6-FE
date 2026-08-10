"use client";

import { Lightbulb } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import UploadDropzone from "@/components/molecules/UploadDropzone";

export default function MaterialUploader() {
  return (
    <div className="flex flex-col">
          <Heading level={2} variant="h4" className="mb-6">
            Add New Material
          </Heading>
          
          {/* Molekul 1: Dropzone */}
          <UploadDropzone 
            onFileSelect={() => alert("Simulasi: Jendela Browse File Terbuka!")} 
          />

          {/* Info Alert (Kotak Hijau Muda) */}
          <div className="mt-6 flex items-start gap-4 rounded-[20px] border border-teal-100 bg-teal-50/60 p-5">
            <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
            <Text variant="body-medium" className="font-medium text-teal-900">
              Uploading a PDF will automatically generate a custom study guide and mini-quiz!
            </Text>
          </div>
        </div>
  );
}