'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  Copy, 
  Download, 
  Sun, 
  Moon, 
  Loader2, 
  AlertCircle,
  BookOpen,
  Type,
  GraduationCap
} from 'lucide-react';

interface TranslationResponse {
  translation: string;
  morphology?: Array<{
    word: string;
    lemma: string;
    pos: string;
    definition: string;
  }>;
}

const TranslatePage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translation, setTranslation] = useState('');
  const [sourceLang, setSourceLang] = useState<'greek' | 'latin'>('greek');
  const [translationStyle, setTranslationStyle] = useState<'literal' | 'literary' | 'student'>('literal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('logos-theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('logos-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          source_lang: sourceLang,
          style: translationStyle,
        }),
      });
      if (!response.ok) throw new Error(`Translation failed: ${response.statusText}`);
      const data: TranslationResponse = await response.json();
      setTranslation(data.translation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Languages className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LOGOS Translator</h1>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source Language</label>
              <div className="grid grid-cols-2 gap-2">
                {(['greek', 'latin'] as const).map((lang) => (
                  <button key={lang} onClick={() => setSourceLang(lang)}
                    className={`p-3 rounded-lg border ${sourceLang === lang ? 'bg-blue-50 dark:bg-blue-900 border-blue-200' : 'bg-gray-50 dark:bg-gray-700 border-gray-200'}`}>
                    {lang === 'greek' ? 'Greek (Ἑλληνικά)' : 'Latin'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Translation Style</label>
              <div className="grid grid-cols-1 gap-2">
                {([{key:'literal',label:'Literal'},{key:'literary',label:'Literary'},{key:'student',label:'Student'}] as const).map((s) => (
                  <button key={s.key} onClick={() => setTranslationStyle(s.key)}
                    className={`p-2 rounded-lg border text-left ${translationStyle === s.key ? 'bg-blue-50 dark:bg-blue-900 border-blue-200' : 'bg-gray-50 dark:bg-gray-700 border-gray-200'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={`Enter your ${sourceLang} text here...`} disabled={isLoading} />
          <div className="flex justify-end mt-4">
            <button onClick={handleTranslate} disabled={isLoading || !sourceText.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg flex items-center space-x-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              <span>{isLoading ? 'Translating...' : 'Translate'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4 mb-8 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        {translation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original</h2>
              <p className="text-gray-900 dark:text-white">{sourceText}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Translation</h2>
                <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:text-gray-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-900 dark:text-white">{translation}</p>
              {copied && <div className="mt-2 text-sm text-green-600">Copied!</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TranslatePage;
