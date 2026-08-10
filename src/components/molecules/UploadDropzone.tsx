"use client";

import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography"; 

interface UploadDropzoneProps {
  onFileSelect?: () => void;
}

export default function UploadDropzone({ onFileSelect }: UploadDropzoneProps) {
  return (
    <div 
      className="flex w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-white/50 p-10 text-center transition-all hover:border-indigo-300 hover:bg-slate-50"
      onClick={onFileSelect}
    >
      {/* Ikon Upload */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
        <FileUp className="h-8 w-8 text-indigo-base" strokeWidth={2.5} />
      </div>
      
      {/* Teks Instruksi */}
      <Heading 
        level={3} 
        variant="h5" 
        className="mb-2 font-extrabold"
      >
        Drag & Drop PDF Here
      </Heading>
      
      <Text 
        variant="small" 
        className="mb-6 font-medium"
      >
        or click to browse your files
      </Text>
      
      {/* CTA */}
      <Button 
        type="button"
        className="rounded-btn bg-indigo-base px-8 font-bold text-white transition-colors hover:bg-indigo-700"
        onClick={(e) => {
          e.stopPropagation(); 
          if (onFileSelect) onFileSelect();
        }}
      >
        Browse Files
      </Button>
    </div>
  );
}