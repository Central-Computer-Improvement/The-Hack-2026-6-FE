"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography";
import UploadDropzone from "@/components/molecules/UploadDropzone";
import { QuizOption } from "@/components/molecules/QuizOption";
import { MOCK_MINI_QUIZ } from "@/constants/mockData";

export default function LibraryPage() {
    // State buat nyimpen jawaban 
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

    // func button click
    const handleSelectOption = (questionId: string, optionIndex: number) => {
        setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: optionIndex,
        }));
    };

  return (
    <div className="w-full max-w-[1200px] pb-24 font-sans">
      
      {/* Header Halaman */}
      <div className="mb-10">
        <Heading level={1} variant="headline-large" className="mb-2">
          Library
        </Heading>
        <Text variant="muted">
          Upload your documents and let AI generate study guides for you.
        </Text>
      </div>

      {/* main grid  */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        
        {/* AREA KIRI: Material Uploader  */}
        <div className="flex flex-col">
          <Heading level={2} variant="h4" className="mb-6">
            Add New Material
          </Heading>
          
          {/* Dropzone */}
          <UploadDropzone 
            onFileSelect={() => alert("BROWER TERBUKA")} 
          />

          {/* Info Alert */}
          <div className="mt-6 flex items-start gap-4 rounded-[20px] border border-teal-100 bg-teal-50/60 p-5">
            <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
            <Text variant="body-medium" className="font-medium text-teal-900">
              Uploading a PDF will automatically generate a custom study guide and mini-quiz!
            </Text>
          </div>
        </div>

        {/* AREA KANAN: Active Mini Quiz */}
        <div className="flex h-fit flex-col rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

            {/* Header Kuis */}
            <div className="mb-8 flex items-center justify-between">
            <Heading level={2} variant="h4">
              Active Mini Quiz
            </Heading>
            {/* Indikator Skor */}
            <div className="rounded-full bg-indigo-soft px-4 py-1.5 shadow-sm">
              <Text as="span" className="text-[13px] font-bold text-indigo-base">
                Score: 1/2
              </Text>
            </div>
          </div>

          {/* Daftar Pertanyaan */}
          <div className="flex-1 space-y-8">
            {MOCK_MINI_QUIZ.questions.map((q, qIndex) => (
              <div key={q.id}>
                {/* Teks Pertanyaan */}
                <Text variant="body-medium" className="mb-4 font-extrabold text-slate-800">
                  {qIndex + 1}. {q.question}
                </Text>
                
                {/* Opsi Jawaban */}
                <div className="space-y-3">
                  {q.options.map((optionText, optIndex) => {
                    const isSelected = selectedAnswers[q.id] === optIndex;
                    
                    return (
                      <QuizOption
                        key={optIndex}
                        text={optionText}
                        variant={isSelected ? "correct" : "default"}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Submit Answers (Amber) */}
          <Button 
            className="mt-10 h-14 w-full rounded-btn bg-amber-base text-[15px] font-bold text-white shadow-md shadow-amber-base/20 transition-all hover:bg-amber-dark active:scale-[0.98]"
            onClick={() => alert("JAWABAN TERSIMPAN")}
          >
            Submit Answers
          </Button>

        </div>

      </div>
    </div>
  );
}