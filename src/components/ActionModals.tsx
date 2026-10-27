import React, { useState, useEffect, useRef } from 'react';

// 1. Camera & Vision Scanner Modal
interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (text: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onScanResult }) => {
  const [streamActive, setStreamActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStreamActive(false);
      setOcrText(null);
      return;
    }

    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setStreamActive(true);
        }
      })
      .catch((err) => {
        console.warn('Camera stream unavailable, switching to simulated HUD vision:', err);
        setStreamActive(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const sampleTexts = [
        'नमस्ते • Hindi Signboard Detected: "कनॉट प्लेस (Connaught Place) - 1.2 KM"',
        'Document OCR: "AIIMS New Delhi • Appointment Reference #9021"',
        'QR Code Decoded: "UPI Payment / Merchant Verified"',
      ];
      const randomResult = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setOcrText(randomResult);
      onScanResult?.(randomResult);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 pt-safe pb-safe animate-fadeIn">
      {/* HUD Header */}
      <div className="w-full max-w-md flex items-center justify-between text-primary pt-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-[20px]">
            photo_camera
          </span>
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary">
            NEURAL VISION SCANNER
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-error"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Viewfinder Window */}
      <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-lowest border border-primary-container/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.25)] my-auto">
        {streamActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6 flex flex-col items-center">
            <span className="material-symbols-outlined text-[48px] text-primary/40 mb-2">
              document_scanner
            </span>
            <p className="font-headline-sm text-headline-sm text-primary mb-1">
              Neural OCR Feed Ready
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[220px]">
              Point at Hindi or English text, signboards, or invoices to analyze.
            </p>
          </div>
        )}

        {/* Reticle Overlays */}
        <div className="absolute inset-4 border border-dashed border-primary-container/40 rounded-xl pointer-events-none" />
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary-container pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary-container pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary-container pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary-container pointer-events-none" />

        {/* Scanning Laser */}
        {scanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent animate-[bounce_1.5s_infinite] shadow-[0_0_12px_#00f0ff]" />
        )}

        {/* OCR Result Overlay */}
        {ocrText && (
          <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-surface-container-high/95 backdrop-blur-md border border-primary/30 shadow-xl">
            <div className="flex items-center gap-1.5 text-primary-container font-label-sm text-label-sm uppercase mb-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Detected Text</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface">{ocrText}</p>
          </div>
        )}
      </div>

      {/* Control Trays */}
      <div className="w-full max-w-sm flex items-center justify-around pb-4">
        <button
          onClick={triggerScan}
          disabled={scanning}
          className="w-18 h-18 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container text-on-primary flex flex-col items-center justify-center shadow-[0_0_24px_rgba(0,240,255,0.6)] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px]">
            {scanning ? 'sync' : 'center_focus_strong'}
          </span>
          <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold">
            {scanning ? 'SCANNING' : 'CAPTURE'}
          </span>
        </button>
      </div>
    </div>
  );
};

// 2. WhatsApp Action Card Modal
interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  defaultMessage?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient = 'Priya (+91 98201 XXXXX)',
  defaultMessage = 'Main 15 minute mein meeting mein pahunch raha hoon.',
}) => {
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [message, setMessage] = useState(defaultMessage);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRecipient(defaultRecipient);
      setMessage(defaultMessage);
      setSent(false);
    }
  }, [isOpen, defaultRecipient, defaultMessage]);

  if (!isOpen) return null;

  const handleSend = () => {
    setSent(true);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface-container-low p-space-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-primary-container/30 flex flex-col gap-space-sm relative overflow-hidden animate-scaleUp">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[20px] text-primary-container">
              chat
            </span>
            <span className="font-label-md text-label-md font-bold uppercase tracking-wider">
              WhatsApp Relay Dispatch
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-error"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Recipient Contact
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high text-on-surface text-body-md outline-none focus:ring-1 focus:ring-primary-container"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Message Transcript
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high text-on-surface text-body-md outline-none focus:ring-1 focus:ring-primary-container resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSend}
            disabled={sent}
            className="flex-1 py-2.5 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {sent ? 'check_circle' : 'send'}
            </span>
            <span>{sent ? 'Dispatched' : 'Send via WhatsApp'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-highest active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Zen / Focus Protocol Modal
interface ZenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZenModal: React.FC<ZenModalProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isActive, secondsLeft]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#06080F]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-surface-container-low p-6 flex flex-col items-center gap-4 border border-secondary/30 shadow-[0_0_40px_rgba(0,162,253,0.3)]">
        <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[32px] animate-pulse">
            self_improvement
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            Zen Focus Protocol • Active
          </span>
          <h3 className="font-headline-lg text-headline-lg font-bold text-primary mt-1">
            {timeFormatted}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            DND engaged • Ambient Shree neural soundscape online
          </p>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex-1 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-highest"
          >
            {isActive ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
};
