"use client";

import React, { useRef, useState } from "react";
import { FileUp, FileText, CheckCircle2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFilesSelect?: (files: File[]) => void;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  disabled?: boolean;
}

export default function UploadDropzone({
  onFilesSelect,
  selectedFiles = [],
  onRemoveFile,
  disabled = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      if (onFilesSelect) onFilesSelect(filesArray);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (onFilesSelect) onFilesSelect(filesArray);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerBrowse = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const hasFiles = selectedFiles.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-7 text-center transition-all",
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
            : "border-slate-300 bg-white/60 hover:border-indigo-400 hover:bg-slate-50",
          disabled && "opacity-50 cursor-not-allowed",
          hasFiles && "border-indigo-400 bg-indigo-50/20"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerBrowse}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Icon */}
        <div
          className={cn(
            "mb-3 flex h-13 w-13 items-center justify-center rounded-2xl transition-all shadow-xs",
            hasFiles
              ? "bg-indigo-100 text-indigo-600"
              : "bg-indigo-50 text-indigo-600"
          )}
        >
          {hasFiles ? (
            <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
          ) : (
            <FileUp className="h-6 w-6" strokeWidth={2.5} />
          )}
        </div>

        {/* Text Info */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <Heading level={3} variant="h5" className="font-extrabold text-slate-800 text-sm md:text-base">
            {hasFiles
              ? `${selectedFiles.length} file dipilih (Klik atau drop untuk tambah)`
              : "Upload Dokumen PDF / DOCX / TXT"}
          </Heading>
          <Text variant="muted" className="text-xs max-w-sm">
            Tarik dan lepas 1 atau <strong>banyak file PDF sekaligus</strong> (Maks. 10MB per file)
          </Text>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            triggerBrowse();
          }}
          className="rounded-full bg-white hover:bg-slate-100 text-indigo-600 border-indigo-200 text-xs font-bold px-4 h-8 cursor-pointer mt-1"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Pilih File Dokumen
        </Button>
      </div>

      {/* Selected Files Chips List */}
      {hasFiles && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Daftar File yang akan diunggah ({selectedFiles.length})
          </span>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-slate-800 truncate text-xs">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>

                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(idx);
                    }}
                    disabled={disabled}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}