// file: src/components/organisms/lessonSideBar.tsx

"use client";

import React, { useState } from "react";
import { Bookmark, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import KeyTakeawayItem from "@/components/molecules/keyTakeAwayPoin";
import { QuizOption } from "@/components/molecules/QuizOption";
import { cn } from "@/lib/utils";

interface TakeawayData {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  isCompleted?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonSidebarProps {
  takeaways: TakeawayData[];
  quiz: QuizQuestion;
  onJumpToTimestamp?: (timestamp: string) => void;
  className?: string;
}

export default function LessonSidebar({
  takeaways,
  quiz,
  onJumpToTimestamp,
  className,
}: LessonSidebarProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
    }
  };

  const getOptionStatus = (index: number) => {
    if (!isSubmitted) {
      return selectedOption === index ? "selected" : "default";
    }
    if (index === quiz.correctAnswer) return "correct";
    if (selectedOption === index && index !== quiz.correctAnswer) return "incorrect";
    return "default";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* SECTION 1: KEY TAKEAWAYS */}
      <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <Heading level={3} variant="h6" className="text-slate-900">
              Key Takeaways
            </Heading>
            <Text variant="small" className="text-slate-400">
              Poin-poin penting video pembelajaran
            </Text>
          </div>
        </div>

        <div className="space-y-2.5">
          {takeaways.map((item) => (
            <KeyTakeawayItem
              key={item.id}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              isCompleted={item.isCompleted}
              onClickTimestamp={() => onJumpToTimestamp?.(item.timestamp)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: POP QUIZ */}
      <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5D44D8]/10 text-[#5D44D8]">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Heading level={3} variant="h6" className="text-slate-900">
                Pop Quiz
              </Heading>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                +10 Koin
              </span>
            </div>
            <Text variant="small" className="text-slate-400">
              Uji pemahamanmu dari video ini
            </Text>
          </div>
        </div>

        <div className="space-y-4">
          <Text variant="body-medium" className="font-extrabold text-slate-800 leading-snug">
            {quiz.question}
          </Text>

          <div className="space-y-2">
            {quiz.options.map((option, index) => (
              <QuizOption
                key={index}
                optionText={option}
                status={getOptionStatus(index)}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(index)}
              />
            ))}
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5D44D8] py-3 text-sm font-bold text-white shadow-md shadow-[#5D44D8]/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim Jawaban
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-200">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {selectedOption === quiz.correctAnswer
                  ? "Jawabanmu Benar! (+10 Koin)"
                  : "Hampir tepat! Coba pelajari ringkasan AI lagi."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}