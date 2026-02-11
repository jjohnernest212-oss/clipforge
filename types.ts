
export enum Platform {
  TikTok = 'TikTok',
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  YouTube = 'YouTube',
  Twitter = 'Twitter',
}

export interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  platform: Platform;
  author: string;
  originalUrl: string;
}

export interface GeminiAnalysis {
  viralCaption: string;
  hashtags: string[];
  summary: string;
}

export interface DownloadOption {
  label: string;
  format: string;
  quality: string;
  size: string;
  isAudio?: boolean;
  recommended?: boolean;
}

export interface ServerLog {
  id: number;
  message: string;
  status: 'pending' | 'success' | 'processing' | 'error';
}
