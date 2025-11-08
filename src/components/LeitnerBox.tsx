import WordCard from "./WordCard";
import { isWordDueForReview } from "@/lib/utils";

interface LeitnerBoxProps {
  boxNumber: number;
  words: Array<{ id: string; term: string; definition: string; lastReviewed: Date | null; boxNumber: number }>;
  onAnswer: (id: string, isCorrect: boolean) => Promise<void>;
}

export default function LeitnerBox({ boxNumber, words, onAnswer }: LeitnerBoxProps) {
  const boxWords = words.filter(word => word.boxNumber === boxNumber);
  const dueWords = boxWords.filter(word => isWordDueForReview(word));

  const boxColors = [
    'from-rose-400 to-red-600',
    'from-amber-400 to-orange-600',
    'from-lime-400 to-green-600',
    'from-sky-400 to-blue-600',
    'from-violet-400 to-purple-600',
  ];

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className={`bg-gradient-to-r ${boxColors[boxNumber - 1]} p-4 rounded-t-2xl`}>
        <h3 className="text-2xl font-bold text-white text-center">جعبه {boxNumber}</h3>
      </div>
      <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {dueWords.length} لغت برای مرور امروز
        </p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {dueWords.length > 0 ? (
          <div className="space-y-4">
            {dueWords.map(word => (
              <WordCard
                key={word.id}
                id={word.id}
                term={word.term}
                definition={word.definition}
                onAnswer={onAnswer}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-center">
              امروز لغتی برای مرور نداری! <br /> استراحت کن 😊
            </p>
          </div>
        )}
      </div>
    </div>
  );
}