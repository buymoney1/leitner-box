import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isWordDueForReview(word: { lastReviewed: Date | null; boxNumber: number }): boolean {
  if (!word.lastReviewed) return true;
  const now = new Date();
  const lastReviewed = new Date(word.lastReviewed);
  const daysToWait = Math.pow(2, word.boxNumber - 1);
  const dueDate = new Date(lastReviewed);
  dueDate.setDate(dueDate.getDate() + daysToWait);
  return now >= dueDate;
}
