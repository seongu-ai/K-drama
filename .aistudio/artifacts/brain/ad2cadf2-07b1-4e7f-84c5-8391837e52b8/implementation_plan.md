# Direct Implementation of User's Script into 15-Second Video Production

This update directly configures the 15-second video simulator, subtitles, and narration engine to use your exact script with 5-second automatic scene transitions and natural male voice synthesis.

## User Review & Critical Decisions

> [!IMPORTANT]
> The video will be set up with your exact script structure:

1. **0–5s Beat (Hook & Fascination)**:
   - **Narration**: *"K-dramas have captivated the whole world—they are incredibly fun and fascinating!"* (completed `whole-` into `whole world`)
   - **Subtitle Card 1 (2 lines)**:
     - Line 1: `K-dramas have captivated the whole world—`
     - Line 2: `they are incredibly fun and fascinating!`
   - **Visual Scene**: Scene 1 (Seoul Rain Romance)
2. **5–10s Beat (Everyday Life & Trendy Culture)**:
   - **Narration**: *"You can easily and naturally learn about everyday Korean life and its trendy culture."*
   - **Subtitle Card 2 (2 lines)**:
     - Line 1: `You can easily and naturally learn about`
     - Line 2: `everyday Korean life and its trendy culture.`
   - **Visual Scene**: Scene 2 (Yeonnam Cafe & Hangul Study)
3. **10–15s Beat (Real Expressions & Rapid Improvement)**:
   - **Narration**: *"By following the real expressions used in the shows, your Korean skills will improve rapidly."*
   - **Subtitle Card 3 (2 lines)**:
     - Line 1: `By following the real expressions used in the shows,`
     - Line 2: `your Korean skills will improve rapidly.`
   - **Visual Scene**: Scene 3 (Han River Sunset Skyline)

---

## 1. Overview & Core Concept

- **What It Delivers**: A complete, synchronized 15-second social video production driven by your exact script lines.
- **Audio Delivery**: Warm conversational male voice reading each beat at natural speed, synchronized to the 5.0-second intervals.
- **Visuals**: Seamless 5-second crossfades between the 3 cinematic K-drama scenes matching each phase of your story.
- **Subtitles**: Clear, high-contrast overlay formatted strictly into 2 lines per card for mobile social feeds (TikTok / Reels / Shorts).

---

## 2. User Experience & Visual Design

- **Primary Preset**: Your script will be set as the default, featured script preset in the app (`"Your Original Script"`).
- **Subtitles Display**: Optimized line breaks ensuring neither card exceeds 2 lines, styled with bold text stroke for clear legibility over video frames.
- **Synchronized Video Playback**:
  - `0.0s – 5.0s`: Scene 1 displays + Male voice reads Beat 1 + Subtitle Card 1 shows.
  - `5.0s – 10.0s`: Automatically dissolves to Scene 2 + Male voice reads Beat 2 + Subtitle Card 2 shows.
  - `10.0s – 15.0s`: Automatically dissolves to Scene 3 + Male voice reads Beat 3 + Subtitle Card 3 shows.
- **Export Ready**: Updated 1-click `.SRT` subtitle export and plain text copy reflecting your exact lines.

---

## 3. Technical Implementation Details

```
┌─────────────────────────────────────────────────────────────┐
│                 User Script Master Configuration            │
│                                                             │
│  [0-5s]   K-dramas have captivated the whole world...       │
│  [5-10s]  You can easily and naturally learn about...       │
│  [10-15s] By following the real expressions used in...      │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  Audio Narration Engine      │    │  Visual & Subtitle Sync      │
│  • Warm Male Voice           │    │  • 0-5s: Scene 1 + Card 1    │
│  • Automatic pacing per beat │    │  • 5-10s: Scene 2 + Card 2   │
│  • Speech cadence smoothing  │    │  • 10-15s: Scene 3 + Card 3  │
└──────────────────────────────┘    └──────────────────────────────┘
```

1. **`src/data/defaultScripts.ts`**:
   - Add `"your-original"` as the primary default preset containing your exact 3 lines and balanced 2-line subtitle cards.
2. **`src/App.tsx`**:
   - Set `"your-original"` as the active initial state.
3. **`src/components/ScriptCardsView.tsx`**:
   - Update cards to display your exact text with word counts and 2-line subtitle preview.
4. **`src/components/PhoneSimulator.tsx`**:
   - Verify speech synthesis timing so all 3 sentences complete cleanly within their 5-second slots.
