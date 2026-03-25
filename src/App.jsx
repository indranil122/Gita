import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, X, ChevronLeft, ChevronRight, 
  Loader2, Search, Bookmark, BookmarkCheck, Home, 
  Sparkles, Hash, BookOpen, Languages
} from 'lucide-react';
import { getChapters, getVerse } from './api/gitaApi';

/* ─── UTILS ─── */
const cn = (...c) => c.filter(Boolean).join(' ');

/* ─── CONSTANTS ─── */
const TRANSLATORS = {
  en: [
    { key: 'siva', author: 'Swami Sivananda' },
    { key: 'purohit', author: 'Shri Purohit Swami' },
    { key: 'prabhu', author: 'A.C. Bhaktivedanta Swami Prabhupada' },
  ],
  hi: [
    { key: 'tej', author: 'Swami Tejomayananda' },
    { key: 'rams', author: 'Swami Ramsukhdas' },
  ],
};

/* ─── COMPONENTS ─── */

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' },
  { code: 'sa', name: 'Sanskrit' },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('gita_lang_name') || 'English');

  const changeLanguage = (code, name) => {
    localStorage.setItem('gita_lang_name', name);
    // Google Translate uses a cookie to store the target language
    // Format: /en/hi for Hindi
    const value = `/en/${code}`;
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
    
    // Refresh to apply
    window.location.reload();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs-bold text-muted hover:text-text transition-colors flex items-center gap-2 group"
      >
        <Languages size={14} className="text-accent" />
        <span>{currentLang}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-border shadow-2xl z-20 py-2 max-h-[60vh] overflow-y-auto"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code, lang.name)}
                  className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-muted hover:text-text hover:bg-bg transition-all"
                >
                  {lang.name}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ setView, onSearchClick }) => (
  <header className="fixed top-0 left-0 right-0 z-[100] h-14 bg-bg/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between">
    <div className="flex items-center gap-6">
      <button 
        onClick={() => setView({ type: 'home' })}
        className="text-xs-bold text-accent hover:text-accent2 transition-colors"
      >
        Bhagavad Gita
      </button>
      <div className="hidden md:flex items-center gap-4 border-l border-border pl-6">
        <button onClick={() => setView({ type: 'home' })} className="text-[10px] font-bold text-muted hover:text-text uppercase tracking-widest transition-colors flex items-center gap-2">
          <Home size={12} /> Home
        </button>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <LanguageSwitcher />
      <button onClick={onSearchClick} className="p-2 text-muted hover:text-text transition-colors border-l border-border pl-4">
        <Search size={16} />
      </button>
    </div>
  </header>
);

const VerseOfTheDay = ({ onVerseClick, chapters }) => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
    // Deterministic random verse for the day
    const chapterNum = (seed % 18) + 1;
    const verseNum = (seed % 20) + 1;

    getVerse(chapterNum, verseNum).then(data => {
      setVerse(data);
      setLoading(false);
    });
  }, []);

  if (loading || !verse) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 mb-20 border border-accent/20 bg-accent/5 rounded-sm relative overflow-hidden group cursor-pointer"
      onClick={() => onVerseClick(verse)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Sparkles size={24} className="text-accent" />
      </div>
      <p className="text-xs-bold text-accent mb-6">
        Daily Inspiration · Verse {verse.chapter}.{verse.verse}
      </p>
      <h3 className="text-2xl md:text-3xl font-serif text-text mb-8 leading-relaxed italic pr-12">
        "{verse.siva?.et || verse.tej?.ht}"
      </h3>
      <div className="flex items-center gap-2 text-text text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
        Explore Deeper <ArrowRight size={12} />
      </div>
    </motion.section>
  );
};

const ChapterCard = ({ chapter, onClick }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={() => onClick(chapter)}
    className="p-8 border border-border hover:border-accent/40 bg-surface cursor-pointer transition-all flex flex-col gap-6"
  >
    <div className="flex justify-between items-start">
      <span className="text-xs-bold text-accent">
        Chapter {String(chapter.chapter_number).padStart(2, '0')}
      </span>
      <span className="text-xs-bold text-muted/50">{chapter.verses_count}v</span>
    </div>
    <div>
      <h3 className="text-xs-bold text-text mb-2">{chapter.name}</h3>
      <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em]">{chapter.translation}</p>
    </div>
    <p className="text-[12px] text-muted leading-relaxed line-clamp-3 font-normal">
      {chapter.summary.en}
    </p>
    <div className="mt-auto pt-6 border-t border-border/50 flex items-center text-text text-[9px] font-bold uppercase tracking-[0.2em] gap-2">
      Read <ArrowRight size={10} className="text-accent" />
    </div>
  </motion.div>
);

const ChapterDetail = ({ chapter, onVerseClick, onBack }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-32 px-6">
      <button onClick={onBack} className="mb-16 flex items-center gap-2 text-muted hover:text-text transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs-bold">The Chapters</span>
      </button>

      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs-bold text-accent">Chapter {chapter.chapter_number}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-heading text-text mb-6">{chapter.name}</h1>
        <p className="text-2xl text-accent font-serif italic mb-12">{chapter.translation}</p>
        
        <div className="grid md:grid-cols-2 gap-16 pt-16 border-t border-border">
          <div>
            <h4 className="text-xs-bold text-muted mb-8 italic text-[9px]">Introduction</h4>
            <div className="text-[14px] leading-relaxed text-muted space-y-6">
              {chapter.summary.en.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div>
            <h4 className="text-xs-bold text-muted mb-8 italic text-[9px]">Philosophical Core</h4>
            <div className="text-[14px] leading-relaxed text-muted space-y-6">
              {chapter.summary.hi.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-24 border-t border-border overflow-hidden">
        <h3 className="text-xs-bold text-text mb-16 flex items-center gap-3">
          <BookOpen size={14} className="text-accent" /> Select a Shlok
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-px bg-border border border-border">
          {Array.from({ length: chapter.verses_count }).map((_, i) => (
            <button 
              key={i} 
              onClick={() => onVerseClick(chapter.chapter_number, i + 1)}
              className="aspect-square flex items-center justify-center bg-white hover:bg-bg text-[11px] font-mono font-bold text-muted hover:text-accent transition-all"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const VerseDetail = ({ verse, onBack, chapter }) => {
  const [lang, setLang] = useState('en');
  const [transIdx, setTransIdx] = useState(0);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('gita_bookmarks') || '[]'));

  const isBookmarked = bookmarks.includes(`${verse.chapter}.${verse.verse}`);

  const toggleBookmark = () => {
    const id = `${verse.chapter}.${verse.verse}`;
    const newBookmarks = isBookmarked ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('gita_bookmarks', JSON.stringify(newBookmarks));
  };

  const tList = TRANSLATORS[lang];
  const tKey = tList[transIdx].key;
  const translation = lang === 'en' ? verse[tKey]?.et : verse[tKey]?.ht;
  
  let rawCommentary = lang === 'en' ? verse[tKey]?.ec : verse[tKey]?.hc;
  let wordMeanings = null;
  let formattedCommentary = rawCommentary;

  if (typeof rawCommentary === 'string') {
    const match = rawCommentary.match(/^(.*?)\bCommentary\b(.*)$/is);
    if (match && match[1].includes('?')) {
      wordMeanings = match[1].trim();
      formattedCommentary = match[2].trim();
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto py-32 px-6">
        <header className="flex items-center justify-between mb-24">
          <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-text transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs-bold">Chapter {verse.chapter}</span>
          </button>
          <button 
            onClick={toggleBookmark}
            className={cn("p-2 transition-colors", isBookmarked ? "text-accent" : "text-muted hover:text-text")}
          >
            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </header>

        <section className="mb-24 text-center">
          <p className="text-xs-bold text-accent mb-16 tracking-[0.4em]">
            Verse {verse.chapter}.{verse.verse}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-16 leading-relaxed tracking-tight px-4 font-serif">
            {verse.slok}
          </h2>
          <p className="text-[11px] text-muted max-w-2xl mx-auto leading-relaxed italic font-mono uppercase tracking-widest pl-4 border-l border-accent/20">
            {verse.transliteration}
          </p>
        </section>

        <section className="border-t border-border pt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16">
            <div className="flex gap-4">
              {['en', 'hi'].map(l => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setTransIdx(0); }}
                  className={cn(
                    "text-xs-bold px-0 pb-1 border-b-2 transition-all",
                    lang === l ? "border-accent text-accent" : "border-transparent text-muted hover:text-text"
                  )}
                >
                  {l === 'en' ? 'English' : 'Hindi'}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {tList.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setTransIdx(i)}
                  className={cn(
                    "px-3 py-1 border text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm",
                    transIdx === i ? "bg-text text-white border-text" : "border-border text-muted hover:border-muted"
                  )}
                >
                  {t.author}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-7">
              <h4 className="text-xs-bold text-accent mb-6 italic text-[10px] bg-accent/10 px-3 py-1.5 inline-block border border-accent/20">
                The Meaning
              </h4>
              <div className="p-8 bg-surface border border-accent/10 shadow-sm leading-relaxed text-2xl md:text-3xl font-serif text-text">
                {translation || "Translation not available for this author."}
              </div>
            </div>
            
            <div className="md:col-span-5 block p-8 bg-surface border border-accent/30 shadow-md">
              <h4 className="text-xs-bold text-accent mb-8 italic text-[10px] bg-accent/10 px-3 py-1.5 inline-block border border-accent/20">
                Author Insight
              </h4>
              
              {wordMeanings && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[12px] text-muted leading-relaxed font-mono opacity-90">
                    {wordMeanings}
                  </p>
                </div>
              )}
              
              <div className="text-[15px] text-text font-medium leading-relaxed space-y-4">
                {formattedCommentary ? (
                  formattedCommentary.split('\n').map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p className="text-muted">No commentary available for this verse from the selected author.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const SearchView = ({ chapters, onChapterSelect, onClose }) => {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    
    return chapters
      .map(ch => {
        let score = 0;
        const name = ch.name.toLowerCase();
        const trans = ch.translation.toLowerCase();
        const summary = ch.summary.en.toLowerCase();

        if (name === q) score += 1000;
        else if (name.startsWith(q)) score += 500;
        else if (name.includes(q)) score += 100;

        if (trans === q) score += 800;
        else if (trans.startsWith(q)) score += 400;
        else if (trans.includes(q)) score += 50;

        if (summary.includes(q)) score += 10;

        return { ...ch, score };
      })
      .filter(ch => ch.score > 0)
      .sort((a, b) => b.score - a.score || a.chapter_number - b.chapter_number);
  }, [query, chapters]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-bg pt-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-6 mb-20 pb-4 border-b-2 border-text">
          <Search size={32} className="text-muted" />
          <input 
            autoFocus
            type="text" 
            placeholder="TYPE TO EXPLORE..." 
            className="flex-1 bg-transparent border-none outline-none text-2xl font-bold placeholder:text-gray-200 uppercase tracking-tighter"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2"><X size={32} /></button>
        </div>

        <div className="space-y-12">
          {results.map(ch => (
            <div 
              key={ch.chapter_number} 
              onClick={() => { onChapterSelect(ch); onClose(); }}
              className="group cursor-pointer block border-l-2 border-transparent hover:border-accent pl-6 transition-all"
            >
              <span className="text-xs-bold text-accent">Chapter {String(ch.chapter_number).padStart(2, '0')}</span>
              <h3 className="text-3xl font-bold text-text group-hover:tracking-wider transition-all uppercase">{ch.name}</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">{ch.translation}</p>
            </div>
          ))}
          {query && results.length === 0 && (
            <p className="text-xs-bold text-muted italic">No matching chapters found.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MAIN APP ─── */

export default function App() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({ type: 'home' });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    getChapters().then(data => {
      setChapters(data);
      setLoading(false);
    });
  }, []);

  const handleVerseClick = async (chapterNum, verseNum) => {
    setLoading(true);
    try {
      const data = await getVerse(chapterNum, verseNum);
      const chapterData = chapters.find(c => c.chapter_number === chapterNum);
      setView({ type: 'verse', data, chapter: chapterData });
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && chapters.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-text selection:bg-accent selection:text-white">
      <Header setView={setView} onSearchClick={() => setSearchOpen(true)} />

      <AnimatePresence mode="wait">
        {searchOpen && (
          <SearchView 
            chapters={chapters} 
            onChapterSelect={(ch) => setView({ type: 'chapter', data: ch })} 
            onClose={() => setSearchOpen(false)} 
          />
        )}

        {view.type === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-40"
          >
            <section className="mb-32">
              <p className="text-xs-bold text-accent mb-8">Sacred Wisdom for the Modern Soul</p>
              <h1 className="text-heading text-text mb-16">
                Bhagavad<br />
                Gita.
              </h1>
              <div className="h-2 w-24 bg-text" />
            </section>

            <VerseOfTheDay chapters={chapters} onVerseClick={(v) => {
              const ch = chapters.find(c => c.chapter_number === v.chapter);
              setView({ type: 'verse', data: v, chapter: ch });
              window.scrollTo(0, 0);
            }} />

            <div className="mb-16 border-b border-border pb-6 flex items-baseline justify-between">
              <h2 className="text-xs-bold text-text tracking-[0.3em]">The 18 Chapters</h2>
              <span className="text-xs-bold text-muted/30">700 Verses Total</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {chapters.map(ch => (
                <ChapterCard key={ch.chapter_number} chapter={ch} onClick={(data) => { 
                  setView({ type: 'chapter', data });
                  window.scrollTo(0, 0);
                }} />
              ))}
            </div>
          </motion.main>
        )}

        {view.type === 'chapter' && (
          <ChapterDetail 
            key="chapter"
            chapter={view.data} 
            onBack={() => setView({ type: 'home' })} 
            onVerseClick={handleVerseClick}
          />
        )}

        {view.type === 'verse' && (
          <VerseDetail 
            key="verse"
            verse={view.data} 
            chapter={view.chapter}
            onBack={() => {
              setView({ type: 'chapter', data: view.chapter });
              window.scrollTo(0, 0);
            }}
          />
        )}
      </AnimatePresence>

      <footer className="py-32 border-t border-border px-6 text-center bg-surface">
        <p className="text-xs-bold text-muted opacity-40 italic">© 2026 Bhagavad Gita Explorer · A Minimal Reading Experience</p>
      </footer>
    </div>
  );
}
