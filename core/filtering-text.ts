export function filteringText(text: string): string {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]+/gu;
  const numberRegex = /\d+/g;
  const linkRegex = /\b(?:https?:\/\/|www\.)\S+\b/gi;
  const symbolRegex = /[^\p{L}\s]/gu; 

  let result = text.replace(emojiRegex, "")
              .replace(numberRegex, "")
              .replace(linkRegex, "")
              .replace(symbolRegex, " ");
  result = result.replace(/\s+/g, " ").trim();
  return result;
}