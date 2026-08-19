"use client";

import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  PlusCircle,
  FolderPlus,
  Layers,
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import UploadDropzone from "@/components/molecules/UploadDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { knowledgeApi, KnowledgeBaseItem } from "@/lib/api";

interface MaterialUploaderProps {
  onUploadSuccess?: () => void;
}

function sanitizeKbName(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  return (
    withoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50) || "study-material"
  );
}

export default function MaterialUploader({ onUploadSuccess }: MaterialUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<"new" | "existing">("new");
  const [kbName, setKbName] = useState("");
  const [existingKbs, setExistingKbs] = useState<KnowledgeBaseItem[]>([]);
  const [selectedExistingKb, setSelectedExistingKb] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Load existing Knowledge Bases
  const loadExistingKbs = async () => {
    try {
      const data = await knowledgeApi.getKnowledgeBases();
      if (Array.isArray(data)) {
        setExistingKbs(data);
        if (data.length > 0 && !selectedExistingKb) {
          const firstKey = data[0].name || data[0].kb_name || "";
          setSelectedExistingKb(firstKey);
        }
      }
    } catch (err) {
      console.warn("Could not load KBs:", err);
    }
  };

  useEffect(() => {
    loadExistingKbs();
  }, []);

  const handleFilesSelect = (newFiles: File[]) => {
    setErrorMsg("");
    setSuccessMsg("");

    // Validate size (10MB limit per file)
    const validFiles: File[] = [];
    for (const f of newFiles) {
      if (f.size > 10 * 1024 * 1024) {
        setErrorMsg(`File "${f.name}" melebihi batas 10MB.`);
        return;
      }
      validFiles.push(f);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    if (!kbName && validFiles.length > 0) {
      setKbName(sanitizeKbName(validFiles[0].name));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (uploadMode === "new") {
        // Mode 1: Create New Knowledge Base with Multi-Files (POST /api/knowledge)
        const targetKbName = kbName.trim()
          ? sanitizeKbName(kbName.trim())
          : sanitizeKbName(selectedFiles[0].name);

        const res = await knowledgeApi.createKnowledgeBase(
          targetKbName,
          selectedFiles,
          "llamaindex"
        );

        setSuccessMsg(
          `Knowledge Base "${targetKbName}" berhasil dibuat dengan ${selectedFiles.length} file dokumen! 🎉`
        );
      } else {
        // Mode 2: Add New Document(s) to Existing KB (POST /api/knowledge/:kb_name/documents/upload)
        if (!selectedExistingKb) {
          throw new Error("Silakan pilih Knowledge Base tujuan.");
        }

        const res = await knowledgeApi.uploadMaterial(selectedExistingKb, selectedFiles);

        setSuccessMsg(
          `Berhasil menambahkan ${selectedFiles.length} file ke Knowledge Base "${selectedExistingKb}"! 🎉`
        );
      }

      setSelectedFiles([]);
      setKbName("");
      loadExistingKbs();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(
        err.message || "Gagal mengunggah dokumen. Pastikan server backend aktif."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={2} variant="h4" className="mb-1 text-slate-900">
          Knowledge Base & Document Ingestion
        </Heading>
        <Text variant="muted" className="text-xs md:text-sm">
          Buat Knowledge Base baru atau tambahkan dokumen PDF/DOCX/TXT ke vector store yang sudah ada.
        </Text>
      </div>

      {/* Mode Switcher Pills: Create New vs Add to Existing */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setUploadMode("new")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            uploadMode === "new"
              ? "bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-500/10"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FolderPlus className="w-4 h-4 text-indigo-600" />
          <span>Buat KB Baru</span>
        </button>

        <button
          type="button"
          onClick={() => setUploadMode("existing")}
          disabled={existingKbs.length === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            uploadMode === "existing"
              ? "bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-500/10"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-indigo-600" />
          <span>Tambah ke KB yang Ada ({existingKbs.length})</span>
        </button>
      </div>

      {/* Multi-File Upload Dropzone */}
      <UploadDropzone
        onFilesSelect={handleFilesSelect}
        selectedFiles={selectedFiles}
        onRemoveFile={handleRemoveFile}
        disabled={isUploading}
      />

      {/* Configuration Form */}
      {selectedFiles.length > 0 && (
        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {uploadMode === "new"
                  ? "Konfigurasi Knowledge Base Baru"
                  : "Pilih Knowledge Base Tujuan"}
              </span>
            </div>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
              Engine: LlamaIndex
            </Badge>
          </div>

          {uploadMode === "new" ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Nama / Key Knowledge Base Baru
              </label>
              <Input
                type="text"
                value={kbName}
                onChange={(e) => setKbName(e.target.value)}
                placeholder="contoh: algoritma-dan-struktur-data"
                disabled={isUploading}
                required
                className="bg-slate-50 border-slate-200 text-xs font-mono font-bold"
              />
              <span className="text-[11px] text-slate-400">
                Identifier unik untuk vector store yang akan diakses oleh Professor Paw.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Pilih Knowledge Base
              </label>
              <select
                value={selectedExistingKb}
                onChange={(e) => setSelectedExistingKb(e.target.value)}
                disabled={isUploading}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {existingKbs.map((kb, idx) => {
                  const key = kb.name || kb.kb_name || `kb-${idx}`;
                  return (
                    <option key={key} value={key}>
                      📚 {key} {kb.doc_count !== undefined ? `(${kb.doc_count} docs)` : ""}
                    </option>
                  );
                })}
              </select>
              <span className="text-[11px] text-slate-400">
                Dokumen baru akan ditambahkan langsung ke Knowledge Base yang dipilih.
              </span>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses & Melakukan Vektorisasi LlamaIndex...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {uploadMode === "new"
                    ? `Buat KB & Upload ${selectedFiles.length} File`
                    : `Tambahkan ${selectedFiles.length} Dokumen ke ${selectedExistingKb}`}
                </span>
              </>
            )}
          </Button>
        </form>
      )}

      {/* Success Feedback Outside Form */}
      {successMsg && !selectedFiles.length && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}