// file: src/components/molecules/RoleCard.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  title: string;
  description: string;
  imageBgColor: string;
  imageSrc: string; 
  onClick?: () => void;
  className?: string;
}

export default function RoleCard({ title, description, imageBgColor, imageSrc, onClick, className }: RoleCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "cursor-pointer overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-indigo-base hover:shadow-md active:scale-[0.98] w-full max-w-[340px] group rounded-[24px]",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        {/* Lingkaran Background Ilustrasi */}
        <div 
          className="w-48 h-48 rounded-full flex items-center justify-center mb-8 overflow-hidden transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: imageBgColor }}
        >
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Teks Konten */}
        <Heading level={3} variant="h4" className="mb-3 text-slate-800">
          {title}
        </Heading>
        <Text variant="body-medium" className="text-slate-500 leading-relaxed">
          {description}
        </Text>
      </CardContent>
    </Card>
  );
}