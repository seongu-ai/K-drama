import { Beat } from '../types';

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  // Clean punctuation attached to words, preserving internal apostrophes in contractions like they're, you'll
  const words = text
    .trim()
    .replace(/[—–]/g, ' ') // treat em-dash or en-dash as space
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return words.length;
}

export function formatPlainScript(beats: Beat[]): string {
  let output = `15-Second Social Video Script: Learn Korean with K-Dramas\n`;
  output += `Audience: French friend learning Korean | Tone: Friendly spoken English\n\n`;

  beats.forEach((b, idx) => {
    output += `[${b.timeRange}] Narration (${countWords(b.narration)} words):\n`;
    output += `"${b.narration}"\n\n`;
    output += `Subtitle Card ${idx + 1} (2 lines):\n`;
    output += `${b.subtitleLines[0]}\n`;
    output += `${b.subtitleLines[1]}\n\n`;
  });

  return output.trim();
}

function padZero(num: number, digits: number = 2): string {
  return num.toString().padStart(digits, '0');
}

export function generateSrt(beats: Beat[]): string {
  return beats
    .map((beat, index) => {
      const startMs = beat.startSecond * 1000;
      const endMs = beat.endSecond * 1000;

      const sHour = Math.floor(startMs / 3600000);
      const sMin = Math.floor((startMs % 3600000) / 60000);
      const sSec = Math.floor((startMs % 60000) / 1000);
      const sMilli = startMs % 1000;

      const eHour = Math.floor(endMs / 3600000);
      const eMin = Math.floor((endMs % 3600000) / 60000);
      const eSec = Math.floor((endMs % 60000) / 1000);
      const eMilli = endMs % 1000;

      const startTimeStr = `${padZero(sHour)}:${padZero(sMin)}:${padZero(sSec)},${padZero(sMilli, 3)}`;
      const endTimeStr = `${padZero(eHour)}:${padZero(eMin)}:${padZero(eSec)},${padZero(eMilli, 3)}`;

      const subtitleText = beat.subtitleLines.filter(Boolean).join('\n');

      return `${index + 1}\n${startTimeStr} --> ${endTimeStr}\n${subtitleText}\n`;
    })
    .join('\n');
}

export function downloadFile(filename: string, content: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
