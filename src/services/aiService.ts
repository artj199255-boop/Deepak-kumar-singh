import { AppSettings, ChatMessage } from '../types';

// Speech synthesis audio player cache
let currentAudioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let clientTtsFallbackOnly = false;

// Preload and cache browser voices
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  settings: AppSettings
): Promise<{
  text: string;
  intent: any;
  suggestedPrompts: string[];
}> {
  try {
    const formattedHistory = history.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        language: settings.primaryLang,
        persona: settings.voicePersona,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('API error, using local fallback:', err);
    return {
      text: 'Ji Boss, main aapke sath hoon. Kahiye kya madad karoon?',
      intent: { type: 'general', data: {} },
      suggestedPrompts: [
        'Subah ka weather kaisa hai?',
        'YouTube par workout music chalao',
        'Google Maps par traffic check karo',
      ],
    };
  }
}

export async function synthesizeSpeech(
  text: string,
  settings: AppSettings
): Promise<{ audioUrl?: string; fallback?: boolean }> {
  // If previously transitioned to client synthesis, resolve immediately
  if (clientTtsFallbackOnly) {
    return { fallback: true };
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        persona: settings.voicePersona,
      }),
    });

    if (!res.ok) {
      clientTtsFallbackOnly = true;
      return { fallback: true };
    }

    const data = await res.json();
    if (data.mode === 'client_synthesis') {
      clientTtsFallbackOnly = true;
      return { fallback: true };
    }

    if (data.audioData) {
      return {
        audioUrl: `data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`,
      };
    }
    return { fallback: true };
  } catch (_err) {
    clientTtsFallbackOnly = true;
    return { fallback: true };
  }
}

/**
 * Intelligent voice selection prioritizing natural Hindi female voices
 */
function getNaturalHindiFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Check for premium Indian natural female Hindi voices by name
  const premiumFemaleKeywords = [
    'swara', // Microsoft Swara Natural (Hindi)
    'kalpana', // Apple Kalpana (Hindi)
    'lekha', // Apple Lekha (Hindi)
    'veena', // Apple Veena (Hindi)
    'heera',
    'geeta',
    'priya',
    'neerja', // Microsoft Neerja Natural (English India)
    'sangeeta',
  ];

  // Look for named natural Hindi female voice
  for (const kw of premiumFemaleKeywords) {
    const match = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      return (
        name.includes(kw) &&
        (lang.startsWith('hi') || lang.startsWith('en-in') || lang.startsWith('en_in'))
      );
    });
    if (match) return match;
  }

  // 2. Hindi (hi-IN) female voice
  const hiFemale = voices.find((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return (
      (lang.startsWith('hi') || lang.includes('hindi')) &&
      (name.includes('female') ||
        name.includes('woman') ||
        name.includes('girl') ||
        (!name.includes('male') && !name.includes('man') && !name.includes('david')))
    );
  });
  if (hiFemale) return hiFemale;

  // 3. Any Hindi voice
  const anyHindi = voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
  if (anyHindi) return anyHindi;

  // 4. Indian English female voice (excels at Hinglish bilingual sentences)
  const indianEnglishFemale = voices.find((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return (
      (lang === 'en-in' || lang === 'en_in') &&
      !name.includes('male') &&
      !name.includes('man')
    );
  });
  if (indianEnglishFemale) return indianEnglishFemale;

  // 5. Any Indian English voice
  const anyIndianEnglish = voices.find(
    (v) => v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in'
  );
  if (anyIndianEnglish) return anyIndianEnglish;

  // 6. Generic natural female voice
  const genericFemale = voices.find((v) => {
    const name = v.name.toLowerCase();
    return (
      name.includes('female') ||
      name.includes('zira') ||
      name.includes('samantha') ||
      name.includes('victoria') ||
      name.includes('natural')
    );
  });
  if (genericFemale) return genericFemale;

  return voices[0] || null;
}

/**
 * Clean & format text for human-like Hindi/Hinglish speech delivery
 */
function prepareNaturalHindiSpeechText(rawText: string): string {
  return rawText
    // Remove markdown symbols, asterisks, brackets, hashtags
    .replace(/[*#_~`]/g, '')
    .replace(/\(.*?\)/g, '')
    // Format acronyms for natural human pronunciation
    .replace(/\bAQI\b/gi, 'A Q I')
    .replace(/\bIST\b/gi, 'I S T')
    .replace(/\bAM\b/gi, 'A M')
    .replace(/\bPM\b/gi, 'P M')
    .replace(/\bGPS\b/gi, 'G P S')
    .replace(/\bNPU\b/gi, 'N P U')
    .replace(/\bHUD\b/gi, 'H U D')
    .replace(/\bSMS\b/gi, 'S M S')
    .replace(/\bSOS\b/gi, 'S O S')
    .replace(/\+91/g, 'Plus 91')
    // Smooth commas and ellipses for natural breath pauses
    .replace(/\.{2,}/g, ', ')
    .replace(/\n+/g, '. ')
    .trim();
}

export function playAudioOrFallback(
  text: string,
  audioUrl: string | undefined,
  settings: AppSettings,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  // Stop any currently playing audio immediately
  stopAudioPlayback();

  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      currentAudioElement = audio;
      audio.playbackRate = settings.speechVelocity;

      audio.onplay = () => {
        onStart?.();
      };
      audio.onended = () => {
        currentAudioElement = null;
        onEnd?.();
      };
      audio.onerror = () => {
        currentAudioElement = null;
        speakWithBrowser(text, settings, onStart, onEnd);
      };

      audio.play().catch(() => {
        speakWithBrowser(text, settings, onStart, onEnd);
      });

      return () => {
        audio.pause();
        currentAudioElement = null;
      };
    } catch {
      speakWithBrowser(text, settings, onStart, onEnd);
      return () => stopAudioPlayback();
    }
  } else {
    speakWithBrowser(text, settings, onStart, onEnd);
    return () => stopAudioPlayback();
  }
}

export function stopAudioPlayback() {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

function speakWithBrowser(
  text: string,
  settings: AppSettings,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const cleanText = prepareNaturalHindiSpeechText(text);
  if (!cleanText) {
    onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Natural warm conversational cadence:
  // Speed ~0.95 (not rushed, clear Hindi words), Pitch ~1.08 (warm feminine register)
  utterance.rate = Math.max(0.75, Math.min(1.25, settings.speechVelocity * 0.96));
  utterance.pitch = Math.max(0.8, Math.min(1.4, 1.08 + settings.vocalPitch * 0.05));

  const femaleVoice = getNaturalHindiFemaleVoice();
  if (femaleVoice) {
    utterance.voice = femaleVoice;
    utterance.lang = femaleVoice.lang;
  } else {
    utterance.lang = 'hi-IN';
  }

  let hasStarted = false;
  utterance.onstart = () => {
    hasStarted = true;
    onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e) => {
    // If canceled by user interrupt, do not trigger error
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('SpeechSynthesis event:', e.error);
    }
    currentUtterance = null;
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  // iOS/Chrome safeguard: if onstart doesn't fire within 350ms, ensure start callback
  setTimeout(() => {
    if (!hasStarted && window.speechSynthesis.speaking) {
      onStart?.();
    }
  }, 350);
}

/**
 * Continuous Conversation Controller with silence detection (VAD),
 * automatic turn-taking, self-voice echo prevention, and interruption support.
 */
export interface ContinuousConversationConfig {
  silenceDelayMs?: number; // Silence duration before assuming user finished speaking (default 1400ms)
  onUserSpeaking: (interimText: string) => void;
  onUserSentenceComplete: (finalText: string) => void;
  onError: (errorMsg: string) => void;
  onListeningStateChange: (listening: boolean) => void;
  lang?: string;
}

export class ContinuousConversationEngine {
  private recognition: any = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private isAssistantSpeaking: boolean = false;
  private silenceTimer: any = null;
  private accumulatedText: string = '';
  private config: ContinuousConversationConfig;

  constructor(config: ContinuousConversationConfig) {
    this.config = {
      silenceDelayMs: 1400,
      ...config,
    };
  }

  public start() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.config.onError('Browser does not support SpeechRecognition.');
      return false;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.isAssistantSpeaking = false;
    this.accumulatedText = '';

    try {
      this.initRecognitionInstance();
      this.recognition.start();
      this.config.onListeningStateChange(true);
      return true;
    } catch (e: any) {
      console.warn('SpeechRecognition start notice:', e);
      return false;
    }
  }

  private initRecognitionInstance() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = this.config.lang || 'hi-IN';

    recognition.onresult = (event: any) => {
      // ECHOPROOF GUARD: If assistant is currently speaking, disregard mic input to prevent self-triggering
      if (this.isAssistantSpeaking || this.isPaused) {
        return;
      }

      let interim = '';
      let hasFinal = false;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.accumulatedText += (this.accumulatedText ? ' ' : '') + transcript.trim();
          hasFinal = true;
        } else {
          interim += transcript;
        }
      }

      const currentDisplay = (
        this.accumulatedText + (interim ? ' ' + interim : '')
      ).trim();

      if (currentDisplay) {
        this.config.onUserSpeaking(currentDisplay);

        // Reset silence timer whenever user speaks
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
        }

        // Detect pause in speech (silence detection / VAD)
        const delay = hasFinal ? 900 : this.config.silenceDelayMs || 1400;
        this.silenceTimer = setTimeout(() => {
          this.commitSpeechTurn();
        }, delay);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Normal silence, keep listening in continuous mode
        return;
      }
      if (event.error === 'not-allowed') {
        this.config.onError('Microphone permission was denied.');
        this.stop();
        return;
      }
      if (event.error === 'aborted') {
        return;
      }
      console.warn('Speech recognition warning:', event.error);
    };

    recognition.onend = () => {
      // If continuous mode is active and not stopped or muted, auto-restart
      if (this.isRunning && !this.isPaused && !this.isAssistantSpeaking) {
        try {
          this.recognition.start();
          this.config.onListeningStateChange(true);
        } catch (_e) {
          // Restart with slight backoff
          setTimeout(() => {
            if (this.isRunning && !this.isPaused && !this.isAssistantSpeaking) {
              try {
                this.recognition.start();
                this.config.onListeningStateChange(true);
              } catch (_) {}
            }
          }, 300);
        }
      } else {
        this.config.onListeningStateChange(false);
      }
    };

    this.recognition = recognition;
  }

  private commitSpeechTurn() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const textToSubmit = this.accumulatedText.trim();
    this.accumulatedText = '';

    if (textToSubmit) {
      // Notify client that sentence is complete
      this.config.onUserSentenceComplete(textToSubmit);
    }
  }

  /**
   * Called when the assistant starts speaking response:
   * Temporarily pauses mic listening so Shree does not echo or recognize itself.
   */
  public notifyAssistantSpeakingStart() {
    this.isAssistantSpeaking = true;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    this.accumulatedText = '';

    try {
      if (this.recognition) {
        this.recognition.stop();
      }
    } catch (_) {}
    this.config.onListeningStateChange(false);
  }

  /**
   * Called when assistant finishes speaking response:
   * Automatically re-arms listening mode seamlessly.
   */
  public notifyAssistantSpeakingEnd() {
    this.isAssistantSpeaking = false;
    this.accumulatedText = '';

    // Safety buffer (350ms) to allow acoustic reverb to clear
    setTimeout(() => {
      if (this.isRunning && !this.isPaused) {
        try {
          this.recognition.start();
          this.config.onListeningStateChange(true);
        } catch (_) {}
      }
    }, 350);
  }

  /**
   * User interrupts the assistant while it is speaking
   */
  public interrupt() {
    stopAudioPlayback();
    this.notifyAssistantSpeakingEnd();
  }

  public pause() {
    this.isPaused = true;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    try {
      this.recognition?.stop();
    } catch (_) {}
    this.config.onListeningStateChange(false);
  }

  public resume() {
    this.isPaused = false;
    if (this.isRunning && !this.isAssistantSpeaking) {
      try {
        this.recognition?.start();
        this.config.onListeningStateChange(true);
      } catch (_) {}
    }
  }

  public stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.isAssistantSpeaking = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.accumulatedText = '';

    try {
      this.recognition?.stop();
    } catch (_) {}
    this.config.onListeningStateChange(false);
  }
}

/**
 * Single-shot speech recognition helper for quick prompt queries
 */
export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  lang: string = 'hi-IN'
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const text = (final || interim).trim();
      if (text) {
        onResult(text, Boolean(final));
      }
    };

    recognition.onerror = (event: any) => {
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  } catch (e: any) {
    onError(e.message || 'Initialization failed');
    return null;
  }
}
