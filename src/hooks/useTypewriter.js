import { useEffect, useState } from "react";

// Эффект печатающегося текста: печатает слово, держит паузу, стирает, переходит к следующему.
// При prefers-reduced-motion — без анимации, слова просто сменяются раз в holdTime.
export default function useTypewriter(
  words,
  { typeSpeed = 75, deleteSpeed = 40, holdTime = 1800 } = {}
) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Ключ для сброса при смене языка (массив слов приходит новый)
  const wordsKey = Array.isArray(words) ? words.join("|") : "";

  useEffect(() => {
    setText("");
    setWordIndex(0);
    setDeleting(false);
  }, [wordsKey]);

  useEffect(() => {
    if (!Array.isArray(words) || words.length === 0) return;

    const word = words[wordIndex % words.length];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setText(word);
      const timer = setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
      }, holdTime + 1200);
      return () => clearTimeout(timer);
    }

    let timer;

    if (!deleting) {
      if (text.length < word.length) {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed);
      } else {
        timer = setTimeout(() => setDeleting(true), holdTime);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(word.slice(0, text.length - 1)), deleteSpeed);
      } else {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, wordsKey, typeSpeed, deleteSpeed, holdTime]); // eslint-disable-line react-hooks/exhaustive-deps

  return text;
}
