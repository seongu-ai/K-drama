# Integration of 3 Iconic K-Drama Posters into 15-Second Video Backgrounds

Update the video simulator to feature the 3 iconic K-drama series provided by the user (*Reply 1988*, *Hospital Playlist*, and *Extraordinary Attorney Woo*), automatically crossfading every 5 seconds to match each narrative beat.

## User Review & Critical Decisions

> [!IMPORTANT]
> The 3 uploaded drama visuals will be mapped to the 3 video beats as follows:

1. **Beat 1 (0–5s) — 《응답하라 1988》 (*Reply 1988*)**:
   - **Narration**: *"K-dramas have captivated the whole world—they are incredibly fun and fascinating!"*
   - **Background Visual**: The beloved Ssangmun-dong neighborhood alley portrait featuring the warm retro community and youth friendships.
   - **Scene Title Badge**: `01. 응답하라 1988 (Reply 1988)`
2. **Beat 2 (5–10s) — 《슬기로운 의사생활》 (*Hospital Playlist*)**:
   - **Narration**: *"You can easily and naturally learn about everyday Korean life and its trendy culture."*
   - **Background Visual**: The 5 doctor friends (Mido & Parasol) laughing together with coffee in front of the medical center.
   - **Scene Title Badge**: `02. 슬기로운 의사생활 (Hospital Playlist)`
3. **Beat 3 (10–15s) — 《이상한 변호사 우영우》 (*Extraordinary Attorney Woo*)**:
   - **Narration**: *"By following the real expressions used in the shows, your Korean skills will improve rapidly."*
   - **Background Visual**: Attorney Woo Young-woo at her legal desk surrounded by swimming blue whales.
   - **Scene Title Badge**: `03. 이상한 변호사 우영우 (Attorney Woo)`

---

## 1. Overview & Core Concept

- **What It Delivers**: Transforms the generic background scenes into real, iconic K-drama posters matching the exact 3 dramas provided by the user.
- **Cinematic Pacing**: Every 5.0 seconds ($0\text{s} \to 5\text{s} \to 10\text{s}$), the 9:16 phone simulator smoothly dissolves to the next drama poster in sync with the narration and subtitles.
- **Visual Presentation**: High-clarity 9:16 vertical poster layout with subtle ambient gradient lighting to ensure subtitle readability while highlighting the iconic actors and poster artwork.

---

## 2. User Experience & Visual Design

- **Posters in Video Simulator**:
  - `0.0s – 5.0s`: Reply 1988 poster + Beat 1 subtitles + Male voice
  - `5.0s – 10.0s`: Hospital Playlist poster + Beat 2 subtitles + Male voice
  - `10.0s – 15.0s`: Extraordinary Attorney Woo poster + Beat 3 subtitles + Male voice
- **Top Badge Display**: Shows the active Korean drama title alongside English romanization (e.g. `🎬 1/3: 응답하라 1988`).
- **Manual Poster Selector**: Users can click directly on the 3 drama tabs below the player (`Reply 1988`, `Hospital Playlist`, `Attorney Woo`) to view any poster instantly or leave it on 5-second auto transition.

---

## 3. Technical Architecture & File Updates

```
┌─────────────────────────────────────────────────────────────┐
│                 3 Iconic K-Drama Poster Pipeline            │
│                                                             │
│  [0-5s]   Reply 1988 (응답하라 1988) - Retro Family & Youth  │
│  [5-10s]  Hospital Playlist (슬기로운 의사생활) - Daily Banter│
│  [10-15s] Attorney Woo (이상한 변호사 우영우) - Iconic Lines │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  Asset Preparation           │    │  PhoneSimulator Rendering    │
│  • High-res 9:16 drama frames│    │  • 5-second smooth crossfade │
│  • Blurred ambient backing   │    │  • High-contrast subtitles   │
│  • Fallback SVG container    │    │  • Synced warm male voice    │
└──────────────────────────────┘    └──────────────────────────────┘
```

1. **Asset Generation & Integration**:
   - Generate/prepare high-fidelity 9:16 vertical assets matching the exact 3 drama posters (*Reply 1988*, *Hospital Playlist*, *Attorney Woo*).
2. **`src/data/defaultScripts.ts`**:
   - Update `BACKGROUND_SCENES` and `SCRIPT_PRESETS` with the 3 drama titles, poster paths, and descriptions.
3. **`src/components/PhoneSimulator.tsx`**:
   - Render the drama posters with full-bleed cover framing and smooth crossfade transitions at the 5-second marks.
4. **`src/components/StudyNotesGuide.tsx`**:
   - Add specific cultural and linguistic trivia for each of these 3 dramas (e.g. 1980s retro slang in Reply 1988, daily medical and friendly honorifics in Hospital Playlist, and iconic palindrome catchphrases in Attorney Woo).
