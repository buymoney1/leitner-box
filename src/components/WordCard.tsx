'use client';

import { useState } from "react";

interface WordCardProps {
  id: string;
  term: string;
  definition: string;
  onAnswer: (id: string, isCorrect: boolean) => Promise<void>;
}

export default function WordCard({ id, term, definition, onAnswer }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFlip = () => {
    if (isProcessing) return;
    setIsFlipped(!isFlipped);
  };

  const handleAnswerClick = async (isCorrect: boolean) => {
    setIsProcessing(true);
    await onAnswer(id, isCorrect);
    setTimeout(() => {
      setIsFlipped(false);
      setIsProcessing(false);
    }, 600); // هماهنگ با انیمیشن
  };

  return (
    <div className="relative h-64 w-80 cursor-pointer group" style={{ perspective: '1000px' }} onClick={handleFlip}>
      <div className={`absolute inset-0 w-full h-full transition-all duration-600 ease-in-out preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* روی کارت (لغت) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center p-6 backface-hidden border border-white/20">
          <h2 className="text-4xl font-bold text-white text-center drop-shadow-lg">{term}</h2>
        </div>
        {/* پشت کارت (معنی و دکمه‌ها) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 rotate-y-180 backface-hidden border border-white/20">
          <p className="text-2xl text-white text-center mb-8 drop-shadow-lg">{definition}</p>
          <div className="flex gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); handleAnswerClick(false); }}
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-200"
              disabled={isProcessing}
            >
              اشتباه
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleAnswerClick(true); }}
              className="px-8 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-200"
              disabled={isProcessing}
            >
              درست
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}