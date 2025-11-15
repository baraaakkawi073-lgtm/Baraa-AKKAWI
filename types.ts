
export interface PrayerTime {
  name: string;
  time: string;
}

export interface PrayerTimesData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      weekday: { ar: string };
      month: { ar: string };
      year: string;
    };
  };
}

export interface Zikr {
  category: string;
  count: string;
  description: string;
  reference: string;
  content: string;
}

export interface Hadith {
  id: number;
  text: string;
  source: string;
}

// FIX: Added the missing Surah interface required by data/quran_meta.ts.
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  sources?: { uri: string; title: string }[];
}

export enum Muezzin {
  AlShatri = 'Abu Bakr al-Shatri',
  AlDossari = 'Yasser Al-Dossari',
  Mishary = 'Mishary Rashid Alafasy',
  AlGhamdi = 'Saad Al Ghamdi',
}

export const MUEZZIN_URLS: Record<Muezzin, string> = {
  [Muezzin.AlShatri]: 'https://archive.org/download/Adhan-Fajr-abubakral-shatri/Adhan-Fajr-abubakral-shatri.mp3',
  [Muezzin.AlDossari]: 'https://archive.org/download/athaan-yasser-al-dosari/Athaan-Yasser-Al-Dosari.mp3',
  [Muezzin.Mishary]: 'https://archive.org/download/Azan-mishary-rashid-alafasy/Azan-mishary-rashid-alafasy.mp3',
  [Muezzin.AlGhamdi]: 'https://archive.org/download/saad-al-ghamdi-adhan-mp3/saad-al-ghamdi-adhan.mp3',
};
