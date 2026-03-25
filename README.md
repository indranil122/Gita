# Bhagavad Gita Explorer

A premium, minimalist web application to explore the 700 verses of the Bhagavad Gita, bringing sacred wisdom to the modern reader in an editorial-style experience.

![Bhagavad Gita App Logo](./public/logo.png)

## Overview

The Bhagavad Gita Explorer is built with a simple premise: spiritual texts deserve an immersive, distraction-free reading experience. Our web application provides a deep dive into the Gita, combining modern web technologies with elegant, bold typography and intuitive micro-interactions.

## ✨ Key Features

- **Editorial Reading Experience:** A "whitish", clean aesthetic designed like a high-end digital magazine.
- **Universal Language Switcher:** Read verses in English and all major Indian languages seamlessly.
- **Verse of the Day:** Discover random, daily inspiration curated dynamically.
- **Deep-Dive Navigation:** Browse all 18 chapters and 700 verses with extensive translations and commentaries by renowned authors.
- **Global Search:** Find exactly what you are looking for by keyword, chapter, or verse number.
- **Bookmarks:** Save verses to your personal local library for immediate access later.

## 🛠 Tech Stack

- **Frontend:** React.js + Vite
- **Styling:** Tailwind CSS + Framer Motion (for fluid micro-interactions)
- **Icons:** Lucide React
- **API integration:** Vedic Scriptures API and Google Translate API (for wide language support)

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/indranil122/Gita.git
   cd Gita
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Visit the app:**
   Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```text
├── public/                 # Static assets (Favicon, Logo, etc.)
├── src/                    
│   ├── api/                # API integration logic (Vedic Scriptures API)
│   ├── assets/             # Internal visual assets
│   ├── components/         # Reusable React components
│   ├── App.jsx             # Main application and routing logic
│   ├── index.css           # Global Tailwind and custom styles
│   └── main.jsx            # Application entry point
├── prd.md                  # Product Requirements Document
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies and scripts
```

## 🌐 API References

- **Vedic Scriptures API:** Delivering Sanskrit shlokas, transliterations, translations, and purports. 

## 📝 License

This project is intended for educational and spiritual purposes.
