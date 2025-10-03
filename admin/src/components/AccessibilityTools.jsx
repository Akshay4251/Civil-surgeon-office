import React, { useState, useEffect } from "react";
import '../index.css'; // Ensure global styles are imported

const AccessibilityTools = ({ language = "en" }) => {
  const [fontSize, setFontSize] = useState(100);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
speechSynthesis.getVoices().forEach(v => console.log(v.name, v.lang));

  }, []);

  // === FONT SIZE ===
  const increaseFont = () => {
    const newSize = fontSize + 10;
    setFontSize(newSize);
    document.documentElement.style.setProperty('--global-font-size', newSize + '%');
  };

  const decreaseFont = () => {
    const newSize = fontSize - 10;
    setFontSize(newSize);
    document.documentElement.style.setProperty('--global-font-size', newSize + '%');
  };

  const resetFont = () => {
    setFontSize(100);
    document.documentElement.style.setProperty('--global-font-size', '100%');
  };

  // === COLOR MODES ===
  const toggleHighContrast = () => document.body.classList.toggle("high-contrast");
  const toggleInvert = () => document.body.classList.toggle("invert");
  const toggleHighlightLinks = () => document.body.classList.toggle("highlight-links");

  // === SPACING ===
  const toggleTextSpacing = () => document.body.classList.toggle("large-spacing");
  const toggleLineHeight = () => document.body.classList.toggle("large-lineheight");

  // === IMAGES ===
  const toggleImages = () => {
    document.querySelectorAll("img").forEach((img) => {
      img.style.display = img.style.display === "none" ? "inline" : "none";
    });
  };

  // === LANGUAGE CODE ===
  const getLangCode = () => {
    switch (language) {
      case "mr": return "mr-IN"; // Marathi
      case "hi": return "hi-IN"; // Hindi
      default: return "en-IN"; // English
    }
  };

  // === TEXT TO SPEECH ===
  const handleTextToSpeech = () => {
    if (!isSpeaking) {
      const text = document.body.innerText;
      if (!text.trim()) return; // Nothing to speak

      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = getLangCode();

      // Pick matching voice
      const voice = voices.find(v => v.lang === langCode) || voices[0];
      utterance.voice = voice;
      utterance.lang = langCode;

      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => speechSynthesis.cancel();
  }, []);

  return (
    <div className="absolute top-full right-0 w-56 bg-white shadow-lg rounded-xl border border-gray-200 p-3 z-[9999] text-sm">
      <h4 className="text-base font-semibold mb-3 text-gray-700">
        Accessibility Tools
      </h4>

      {/* COLOR MODES */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={toggleHighContrast} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">High Contrast</button>
        <button onClick={toggleHighlightLinks} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Highlight Links</button>
        <button onClick={toggleInvert} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Invert</button>
      </div>

      {/* FONT SIZE */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={increaseFont} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">A+</button>
        <button onClick={decreaseFont} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">A-</button>
        <button onClick={resetFont} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">A</button>
      </div>

      {/* SPACING */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={toggleTextSpacing} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Text Spacing</button>
        <button onClick={toggleLineHeight} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Line Height</button>
      </div>

      {/* IMAGES + TTS */}
      <div className="flex flex-wrap gap-2">
        <button onClick={toggleImages} className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Hide/Show Images</button>
        <button
          onClick={handleTextToSpeech}
          className={`flex-1 px-2 py-1 rounded ${isSpeaking ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {isSpeaking ? "Stop Speech" : "Text to Speech"}
        </button>
      </div>
    </div>
  );
};

export default AccessibilityTools;
