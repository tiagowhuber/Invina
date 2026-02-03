import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type DescriptionBlock = 
  | { type: 'paragraph'; content: string }
  | { type: 'list'; content: string[] };

export function parseDescription(text: string): DescriptionBlock[] {
  if (!text) return [];

  // Split by newline to respect explicit formatting
  const lines = text.split(/\r?\n/);
  const blocks: DescriptionBlock[] = [];
  let currentList: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for list items starting with "- " or "* "
    const listMatch = trimmed.match(/^[-*]\s+(.*)/);

    if (listMatch) {
      currentList.push(listMatch[1]);
    } else {
      // Flush any pending list
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: [...currentList] });
        currentList = [];
      }
      blocks.push({ type: 'paragraph', content: trimmed });
    }
  }

  // Flush remaining list
  if (currentList.length > 0) {
    blocks.push({ type: 'list', content: [...currentList] });
  }

  return blocks;
}
