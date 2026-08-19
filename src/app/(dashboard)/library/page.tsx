"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BookOpen, Database, MessageSquare, RefreshCw, Layers, Trash2, Loader2 } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MaterialUploader from "@/components/organisms/MaterialUploader";
import { knowledgeApi, KnowledgeBaseItem } from "@/lib/api";

export default function LibraryPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingKb, setDeletingKb] = useState<string | null>(null);

  const fetchKnowledgeBases = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await knowledgeApi.getKnowledgeBases();
      if (Array.isArray(data)) {
        setKnowledgeBases(data);
      }
    } catch (err) {
      console.warn("Could not fetch knowledge bases:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKnowledgeBases();
  }, [fetchKnowledgeBases]);

  // Handle Remove Knowledge Base (DELETE /api/knowledge/:kb_name)
  const handleDeleteKnowledgeBase = async (kbName: string) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus Knowledge Base "${kbName}"? Seluruh dokumen vector store terkait akan dihapus secara permanen.`
    );
    if (!confirmDelete) return;

    setDeletingKb(kbName);
    try {
      await knowledgeApi.deleteKnowledgeBase(kbName);
      await fetchKnowledgeBases();
    } catch (err: any) {
      console.error("Failed to delete knowledge base:", err);
      alert(err.message || `Gagal menghapus Knowledge Base "${kbName}".`);
    } finally {
      setDeletingKb(null);
    }
  };

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <div className="mb-8">
        <Heading level={1} variant="headline-large" className="mb-2 text-slate-900">
          Knowledge Library & Materials
        </Heading>
        <Text variant="muted" className="text-sm">
          Upload documents into DeepTutor LlamaIndex vector stores and manage your AI Knowledge Bases.
        </Text>
      </div>

      {/* Main 2-Column Balanced Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
        
        {/* Left Column: Material Uploader */}
        <div>
          <MaterialUploader onUploadSuccess={fetchKnowledgeBases} />
        </div>

        {/* Right Column: Active Knowledge Bases List */}
        <div className="flex flex-col gap-4 p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm sticky top-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Database className="h-4.5 w-4.5" />
              </div>
              <div>
                <Heading level={2} variant="h5" className="text-base font-extrabold text-slate-800">
                  Active Knowledge Bases ({knowledgeBases.length})
                </Heading>
                <Text variant="muted" className="text-xs">
                  Vectorized study material ready for Professor Paw
                </Text>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={fetchKnowledgeBases}
              disabled={isLoading}
              className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {knowledgeBases.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-50 border border-slate-100 text-center gap-2.5 my-2">
              <Layers className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                No custom Knowledge Bases created yet.
              </p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Upload a PDF or study document on the left to create your first LlamaIndex vector store.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {knowledgeBases.map((kb, idx) => {
                const kbKey = kb.name || kb.kb_name || `kb-${idx}`;
                const engine =
                  kb.statistics?.rag_provider ||
                  kb.metadata?.rag_provider ||
                  kb.rag_provider ||
                  "llamaindex";
                const docCount =
                  kb.statistics?.raw_documents ??
                  kb.metadata?.last_indexed_count ??
                  kb.doc_count ??
                  0;
                const embeddingModel =
                  kb.metadata?.embedding_model ||
                  kb.statistics?.index_versions?.[0]?.model;
                const isDeleting = deletingKb === kbKey;

                return (
                  <div
                    key={kbKey}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-xs">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-bold text-slate-800 font-mono truncate">
                          {kbKey}
                        </span>
                        {kb.description && (
                          <span className="text-xs text-slate-500 line-clamp-1">
                            {kb.description}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none text-[10px] font-bold uppercase tracking-wider py-0 px-2">
                            {engine}
                          </Badge>
                          <Badge className="bg-slate-200/70 text-slate-700 hover:bg-slate-200/70 border-none text-[10px] font-semibold py-0 px-2 font-mono">
                            📄 {docCount} document(s)
                          </Badge>
                          {embeddingModel && (
                            <span className="text-[10px] text-slate-400 font-medium font-mono">
                              ({embeddingModel})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Button
                        onClick={() => handleDeleteKnowledgeBase(kbKey)}
                        disabled={isDeleting}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                        title="Hapus Knowledge Base"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>

                      <Link
                        href={`/learning/study-budy?kb=${encodeURIComponent(kbKey)}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat with KB
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}