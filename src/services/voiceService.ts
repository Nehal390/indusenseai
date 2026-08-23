// Enhanced Voice Assistant Service with Web Speech API & Resilient Sandbox Handling
export class VoiceAssistantService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private onResultCallback?: (text: string) => void;
  private onStateChangeCallback?: (state: 'idle' | 'listening' | 'thinking' | 'speaking') => void;
  private onErrorCallback?: (errMessage: string) => void;

  constructor() {
    this.initRecognition();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript;
            if (this.onResultCallback && transcript) {
              this.onResultCallback(transcript);
            }
          }
          this.isListening = false;
          this.onStateChangeCallback?.('thinking');
        };

        this.recognition.onerror = (err: any) => {
          console.debug('Speech recognition event:', err?.error || err);
          this.isListening = false;
          this.onStateChangeCallback?.('idle');

          const errCode = err?.error || '';
          if (errCode === 'aborted') {
            return; // Ignore user cancelling or stopping
          }

          let message = 'Microphone input stopped.';
          if (errCode === 'not-allowed' || errCode === 'service-not-allowed' || errCode === 'permission-denied') {
            message = 'Microphone access is unavailable or restricted by browser iframe sandbox. You can click to retry, use voice prompt buttons, or type in chat.';
          } else if (errCode === 'no-speech') {
            message = 'No voice detected. Please speak into your microphone or try again.';
          } else if (errCode === 'audio-capture') {
            message = 'No microphone hardware found. Please check audio input settings.';
          } else if (errCode === 'network') {
            message = 'Speech recognition network error. Please check your connection.';
          }
          this.onErrorCallback?.(message);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onStateChangeCallback) {
            this.onStateChangeCallback('idle');
          }
        };
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  public isSpeechRecognitionAvailable(): boolean {
    return !!this.recognition;
  }

  public isSpeechSynthesisAvailable(): boolean {
    return !!this.synthesis;
  }

  public async startListening(
    onResult: (text: string) => void,
    onStateChange: (state: 'idle' | 'listening' | 'thinking' | 'speaking') => void,
    onError?: (errMessage: string) => void
  ): Promise<boolean> {
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;
    this.onErrorCallback = onError;

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser window. You can click any prompt shortcut or type below.');
      return false;
    }

    try {
      this.isListening = true;
      this.onStateChangeCallback?.('listening');
      this.recognition.start();
      return true;
    } catch (e: any) {
      console.debug('Could not start recognition directly:', e);
      this.isListening = false;
      this.onStateChangeCallback?.('idle');
      
      // If recognition was already started or busy, restart cleanly
      try {
        this.recognition.abort();
        this.recognition.start();
        this.isListening = true;
        this.onStateChangeCallback?.('listening');
        return true;
      } catch (retryErr) {
        this.onErrorCallback?.('Could not activate microphone. Click to retry or use prompt shortcuts.');
        return false;
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
      this.onStateChangeCallback?.('idle');
    }
  }

  public speak(text: string, onEnd?: () => void): void {
    if (!this.synthesis) {
      onEnd?.();
      return;
    }

    try {
      if (this.synthesis.paused) {
        this.synthesis.resume();
      }
      this.synthesis.cancel(); // Cancel any existing speech

      // Clean markdown tags, asterisks, hashes
      const cleaned = text
        .replace(/[*#_`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .slice(0, 350);

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick high quality English voice if available
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.onStateChangeCallback?.('speaking');

      utterance.onend = () => {
        this.onStateChangeCallback?.('idle');
        onEnd?.();
      };
      utterance.onerror = (e) => {
        console.debug('TTS playback ended/interrupted:', e);
        this.onStateChangeCallback?.('idle');
        onEnd?.();
      };

      this.synthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.onStateChangeCallback?.('idle');
      onEnd?.();
    }
  }

  public cancelSpeech(): void {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch (e) {}
      this.onStateChangeCallback?.('idle');
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
