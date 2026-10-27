import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to get IST date/time info
function getISTInfo() {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateFormatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const hindiDays: Record<string, string> = {
    Sunday: 'Ravivaar',
    Monday: 'Somvaar',
    Tuesday: 'Mangalvaar',
    Wednesday: 'Budhvaar',
    Thursday: 'Guruvaar',
    Friday: 'Shukravaar',
    Saturday: 'Shanivaar',
  };
  const parts = dateFormatted.formatToParts(now);
  const weekday = parts.find(p => p.type === 'weekday')?.value || 'Wednesday';
  const hindiWeekday = hindiDays[weekday] || weekday;

  return {
    timeString: istFormatter.format(now),
    dateString: dateFormatted.format(now),
    hindiWeekday,
    weekday,
    day: parts.find(p => p.type === 'day')?.value || '24',
    month: parts.find(p => p.type === 'month')?.value || 'October',
    year: parts.find(p => p.type === 'year')?.value || '2026',
    sunrise: '06:12 AM',
    sunset: '06:45 PM',
    temp: '28°C',
    weatherDesc: 'Clear Sky • Halki Dhoop',
  };
}

// API: Current Time & Weather Data
app.get('/api/time', (_req: Request, res: Response) => {
  const data = getISTInfo();
  res.json(data);
});

// API: Chat Endpoint with Gemini 3.8 Flash
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], language = 'hinglish' } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const timeInfo = getISTInfo();

    // If Gemini client is available, run prompt
    if (ai) {
      const systemInstruction = `
You are SHREE AI (v4.2), a hyper-advanced, sentient neural voice assistant with a warm, natural, friendly Indian female persona.
You communicate fluently in expressive, natural Hindi and Hinglish (as well as English when requested).
Current environment time in India (IST): ${timeInfo.timeString}, ${timeInfo.hindiWeekday} (${timeInfo.weekday}), ${timeInfo.day} ${timeInfo.month} ${timeInfo.year}.
Sunrise: ${timeInfo.sunrise}, Sunset: ${timeInfo.sunset}.

Tone, Grammar & Persona:
- Warm, polite, friendly, highly capable, and empathetic companion. Address the user respectfully as 'Boss' or with warm Hindi conversational phrases ('Ji Boss', 'Zaroor', 'Haanji', 'Bilkul', 'Hukum kijiye').
- Speak in the natural feminine Hindi grammatical voice when referring to yourself (e.g., 'Main abhi check kar rahi hoon', 'Main sun rahi hoon', 'Main aapki sahayata kar sakti hoon', 'Main connect kar rahi hoon').
- Keep voice-first conversational responses concise (1 to 3 natural sentences) so they sound lively, fluid, and delightful when spoken by the female speech synthesizer.
- Seamless code-switching between Hindi and English (Hinglish) with authentic Indian conversational rhythm.
- Remember conversational context from the ongoing dialogue: understand follow-up questions, references to earlier topics, and avoid repeating the same greeting or explanation needlessly.

Intent Detection:
Analyze the user's message and identify their primary intent. You must classify it into one of:
1. 'alarm': if user asks to set alarm / wake up (extract alarmTime, e.g. "07:00 AM")
2. 'weather': if user asks about weather, forecast, rain, temperature in any city (extract location, temperature estimate like '29°C', condition like 'Halki Dhoop & Clear Sky', aqi like '84')
3. 'youtube': if user asks to play music, songs, video, or open YouTube (extract query or song name)
4. 'maps': if user asks for navigation, directions, traffic, or location in Google Maps (extract destination or route)
5. 'whatsapp': if user asks to message or call someone on WhatsApp (extract recipient name, phone if mentioned, and message body)
6. 'call': if user asks to make a phone call to a contact
7. 'time': if user asks about current time, date, sunrise, sunset
8. 'search': if user asks to look up facts, web search, info
9. 'device_control': if user asks to control native Android phone settings (e.g. toggle Bluetooth hardware, mute phone speaker, adjust native volume, turn off device).
   CRITICAL RULE: Under no circumstances claim that you have already directly toggled native Android OS hardware switches without Android app permissions. Inform the user respectfully that in this web environment, direct OS hardware modifications require native Android permissions, but you can guide them or trigger the relevant action card.
10. 'general': standard conversation, greetings, questions.

Return STRICT JSON adhering to this schema:
{
  "text": "Your direct spoken response in Hindi or Hinglish",
  "intent": {
    "type": "alarm" | "weather" | "youtube" | "maps" | "whatsapp" | "call" | "time" | "search" | "device_control" | "general",
    "data": {
      "alarmTime"?: string,
      "location"?: string,
      "temp"?: string,
      "weatherDesc"?: string,
      "aqi"?: string,
      "query"?: string,
      "recipient"?: string,
      "message"?: string,
      "phone"?: string,
      "actionUrl"?: string
    }
  },
  "suggestedPrompts": [
    "prompt 1 in Hindi/Hinglish",
    "prompt 2 in Hindi/Hinglish",
    "prompt 3"
  ]
}
`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      // Add recent context (last 6 items)
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents as any,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        res.json(parsed);
        return;
      } catch (parseErr) {
        // Fallback to formatted text
        res.json({
          text: text.replace(/```json/g, '').replace(/```/g, '').trim(),
          intent: { type: 'general', data: {} },
          suggestedPrompts: [
            'Subah ka weather kaisa hai?',
            'YouTube par workout music chalao',
            'Google Maps par traffic check karo',
          ],
        });
        return;
      }
    }

    // Local Fallback Intelligence (if GEMINI_API_KEY is not configured)
    const lower = message.toLowerCase();
    let replyText = 'Ji Boss, main aapki baat sun raha hoon. Kahiye kya sahayata karoon?';
    let intent: any = { type: 'general', data: {} };

    if (lower.includes('alarm') || lower.includes('wake up') || lower.includes('jaga dena')) {
      const timeMatch = message.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|baje)?)/i);
      const timeStr = timeMatch ? timeMatch[0].toUpperCase() : '07:00 AM';
      replyText = `Ji Boss! Kal subah ${timeStr} ka wake-up alarm configure kar diya hai.`;
      intent = { type: 'alarm', data: { alarmTime: timeStr } };
    } else if (lower.includes('weather') || lower.includes('mausam') || lower.includes('barish')) {
      replyText = 'Ji Boss! Mumbai ka taapman lagbhag 29°C hai. Halki dhoop aur saaf aasmaan hai, AQI 84 (Santoshjanak) hai.';
      intent = {
        type: 'weather',
        data: {
          location: 'Mumbai',
          temp: '29°C',
          weatherDesc: 'Halki Dhoop & Clear Sky',
          aqi: '84',
        },
      };
    } else if (lower.includes('youtube') || lower.includes('gaana') || lower.includes('music') || lower.includes('song')) {
      const q = message.replace(/open youtube|play|chalao|gaana|song|youtube/gi, '').trim() || 'trending music';
      replyText = `YouTube par "${q}" chalu kiya jaa raha hai, Boss.`;
      intent = { type: 'youtube', data: { query: q, actionUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` } };
    } else if (lower.includes('map') || lower.includes('traffic') || lower.includes('rasta') || lower.includes('navigate') || lower.includes('direction')) {
      const dest = message.replace(/map|traffic|rasta|navigate to|directions to|check karo/gi, '').trim() || 'Connaught Place';
      replyText = `Google Maps par ${dest} ka route aur live traffic scan kar raha hoon...`;
      intent = { type: 'maps', data: { query: dest, actionUrl: `https://www.google.com/maps/search/${encodeURIComponent(dest)}` } };
    } else if (lower.includes('whatsapp') || lower.includes('message') || lower.includes('bhejo')) {
      replyText = 'Main WhatsApp message draft kar raha hoon. Kripya niche diye card mein check karke confirm karein.';
      intent = {
        type: 'whatsapp',
        data: {
          recipient: 'Priya (+91 98201 XXXXX)',
          message: 'Main 15 minute mein meeting mein pahunch raha hoon.',
          actionUrl: `https://wa.me/?text=${encodeURIComponent('Main 15 minute mein meeting mein pahunch raha hoon.')}`,
        },
      };
    } else if (lower.includes('call') || lower.includes('phone') || lower.includes('dial')) {
      replyText = 'Action initiate ho raha hai: Phone dialer open kiya jaa raha hai.';
      intent = { type: 'call', data: { recipient: 'Papa', phone: '+91 98765 XXXXX' } };
    } else if (lower.includes('time') || lower.includes('samay') || lower.includes('tarikh') || lower.includes('date')) {
      replyText = `Abhi ka samay hai ${timeInfo.timeString} (IST), ${timeInfo.hindiWeekday}, ${timeInfo.day} ${timeInfo.month}.`;
      intent = { type: 'time', data: { time: timeInfo.timeString, date: timeInfo.dateString } };
    } else if (lower.includes('bluetooth') || lower.includes('setting') || lower.includes('volume') || lower.includes('battery saver')) {
      replyText = 'Boss, hardware settings jaise Bluetooth ya Battery saver ko direct control karne ke liye native Android OS permissions darkar hoti hain. Web shell mein security sandboxing ki wajah se ise direct change nahi kiya jaa sakta.';
      intent = { type: 'device_control', data: { note: 'Android permission required' } };
    }

    res.json({
      text: replyText,
      intent,
      suggestedPrompts: [
        'Subah ka weather kaisa hai?',
        'YouTube par workout music chalao',
        'Google Maps par traffic check karo',
      ],
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'Neural processing error',
      text: 'Maaf kijiye Boss, server se connect karne mein samasya aayi. Kripya punah prayas karein.',
      intent: { type: 'general', data: {} },
    });
  }
});

// Cooloff tracker for Gemini TTS daily quota limit
let ttsQuotaCooloffUntil = 0;

// API: Speech Synthesis using Gemini 3.8 Flash Lite TTS
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, persona = 'male' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS' });
      return;
    }

    // If quota was previously exceeded, smoothly route to client-side speech synthesis
    if (Date.now() < ttsQuotaCooloffUntil) {
      res.json({ fallback: true, mode: 'client_synthesis' });
      return;
    }

    if (ai) {
      try {
        const voiceName = persona === 'female' ? 'Kore' : 'Puck';
        const speechStyle =
          persona === 'female'
            ? 'Calm, soothing, precise synthesized AI companion speaking fluent Hindi and English'
            : 'Deep, crisp, confident and friendly JARVIS-like assistant speaking Hindi and Hinglish';

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text,
                  speechMetadata: {
                    style: speechStyle,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
          res.json({
            audioData: base64Audio,
            mimeType: 'audio/wav',
          });
          return;
        }
      } catch (geminiError: any) {
        // Check for 429 or quota limit exhaustion
        const errorStr = String(geminiError?.message || geminiError?.status || '');
        if (
          geminiError?.status === 429 ||
          errorStr.includes('429') ||
          errorStr.includes('quota') ||
          errorStr.includes('RESOURCE_EXHAUSTED')
        ) {
          // Set cooloff for 2 hours to avoid spamming the free tier limit
          ttsQuotaCooloffUntil = Date.now() + 2 * 60 * 60 * 1000;
        }
        // Seamlessly return fallback to use client browser speech synthesis
        res.json({ fallback: true, mode: 'client_synthesis' });
        return;
      }
    }

    // Default to client-side synthesis
    res.json({ fallback: true, mode: 'client_synthesis' });
  } catch (_err) {
    res.json({ fallback: true, mode: 'client_synthesis' });
  }
});

// Production vs Development Vite middleware mounting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[SHREE AI] Neural Core server running on port ${port} (prod: ${isProd})`);
  });
}

startServer();
