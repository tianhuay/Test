# AI Architecture Reference: Clara's Speaking Coach

This document outlines the specific AI models and technologies used to power each feature within the application.

## 1. Story Generation
- **Model:** `gemini-3-flash-preview`
- **Purpose:** Rapidly generates age-appropriate (Year 5 level), rhythmic Australian children's stories.
- **Why Flash?** It provides the best balance of speed and strict JSON schema following, which is essential for the seamless transition between topic selection and reading.

## 2. Visual Illustrations
- **Model:** `gemini-2.5-flash-image`
- **Purpose:** Creates custom, book-style illustrations for every story.
- **Config:** Uses `aspectRatio: "1:1"` to maintain a consistent "storybook" square format. It captures specific story elements (e.g., "koalas in the outback") to provide visual context for the student.

## 3. Speaking & Fluency Analysis
- **Model:** `gemini-3-pro-preview`
- **Purpose:** Analyzes recorded student audio against the target text to provide precise feedback.
- **Config:** Uses a high `thinkingBudget` (16,384 tokens) to perform deep reasoning on pronunciation, pacing, and tone relative to native Australian English standards.

## 4. High-Definition Voice ("Listen" Feature)
- **Model:** `en-US-Chirp-HD-F` (Google Cloud TTS)
- **Endpoint:** `v1beta1/text:synthesize`
- **Purpose:** Provides a human-like, expressive "guide" voice for Clara to listen to before practicing.
- **Technology:** Unlike standard TTS, the Chirp-HD model uses advanced AI to interpret punctuation for natural prosody without requiring manual SSML tagging.

## 5. Progress Tracking & Sibling Challenge
- **Technology:** Firebase Firestore
- **Purpose:** Real-time data synchronization between devices.
- **Features:** Handles XP calculation, daily goal tracking, and the competitive "Sibling Challenge" progress bar between Clara and Edison.

## 6. Interaction & Aesthetics
- **Core UI:** Tailwind CSS
- **Animations:** Framer Motion
- **Purpose:** Drives the "bouncy," kid-friendly feel of the app, including the word-by-word pacer, the celebratory confetti, and the smooth transitions between app states.
