import React, { useState, useEffect, useCallback } from 'react';
import type { PrayerTime, PrayerTimesData } from '../types';
import { Muezzin, MUEZZIN_URLS } from '../types';

const PRAYER_NAMES_AR: { [key: string]: string } = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

const usePrayerTimes = (muezzin: Muezzin, city: string, country: string) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [countdown, setCountdown] = useState('');
  const [locationError, setLocationError] = useState('');
  const [dateInfo, setDateInfo] = useState<{ gregorian: string; hijri: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const processPrayerData = (data: any) => {
    const timings: PrayerTimesData['timings'] = data.data.timings;
    
    const formattedTimes: PrayerTime[] = Object.entries(PRAYER_NAMES_AR)
      .map(([key, name]) => ({
        name,
        time: timings[key as keyof typeof timings],
      }));
    setPrayerTimes(formattedTimes);
    
    const hijriDate = data.data.date.hijri;
    setDateInfo({
      gregorian: data.data.date.readable,
      hijri: `${hijriDate.weekday.ar}, ${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}`,
    });
  };

  const fetchPrayerTimesByCity = useCallback(async (cityParam: string, countryParam: string) => {
    setIsLoading(true);
    setLocationError('');
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${cityParam}&country=${countryParam}&method=8`);
      if (!response.ok) throw new Error('Failed to fetch prayer times by city');
      const data = await response.json();
      if (data.code !== 200) throw new Error(data.data || 'Could not find prayer times for the specified city');
      processPrayerData(data);
    } catch (error) {
      console.error(error);
      setLocationError('لا يمكن جلب مواقيت الصلاة للمدينة المحددة. يرجى التأكد من صحة الإدخال.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchPrayerTimesByCoords = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setLocationError('');
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=8`);
       if (!response.ok) throw new Error('Failed to fetch prayer times by coordinates');
      const data = await response.json();
      if (data.code !== 200) throw new Error(data.status || 'Could not find prayer times for your location');
      processPrayerData(data);
    } catch (error) {
       console.error(error);
      setLocationError('لا يمكن جلب مواقيت الصلاة. يرجى التحقق من اتصالك بالإنترنت.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (city && country) {
      fetchPrayerTimesByCity(city, country);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimesByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError('يرجى تمكين الوصول إلى الموقع، أو تحديد المدينة والدولة يدوياً من الإعدادات.');
          setIsLoading(false);
        }
      );
    }
  }, [city, country, fetchPrayerTimesByCity, fetchPrayerTimesByCoords]);
  
  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const adhanAudio = new Audio(MUEZZIN_URLS[muezzin]);
    
    const interval = setInterval(() => {
      const now = new Date();
      let nextPrayerTime: { name: string; time: Date } | null = null;

      for (const prayer of prayerTimes) {
        if (prayer.name === 'الشروق') continue; // Skip sunrise
        
        const [hour, minute] = prayer.time.split(':');
        const prayerDate = new Date();
        prayerDate.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

        // Check if it's time for Adhan
        if (now.getHours() === prayerDate.getHours() && now.getMinutes() === prayerDate.getMinutes() && now.getSeconds() === 0) {
           adhanAudio.play().catch(e => console.error("Error playing audio:", e));
        }

        if (prayerDate > now && (!nextPrayerTime || prayerDate < nextPrayerTime.time)) {
          nextPrayerTime = { name: prayer.name, time: prayerDate };
        }
      }

      // If all prayers for today are done, next prayer is Fajr of tomorrow
      if (!nextPrayerTime) {
        const fajr = prayerTimes.find(p => p.name === 'الفجر');
        if (fajr) {
          const [hour, minute] = fajr.time.split(':');
          const tomorrowFajr = new Date();
          tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
          tomorrowFajr.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
          nextPrayerTime = { name: 'الفجر', time: tomorrowFajr };
        }
      }

      setNextPrayer(nextPrayerTime);

      if (nextPrayerTime) {
        const diff = nextPrayerTime.time.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes, muezzin]);

  return { prayerTimes, nextPrayer, countdown, locationError, dateInfo, isLoading };
};


const PrayerTimes: React.FC<{ muezzin: Muezzin; city: string; country: string }> = ({ muezzin, city, country }) => {
  const { prayerTimes, nextPrayer, countdown, locationError, dateInfo, isLoading } = usePrayerTimes(muezzin, city, country);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="text-xl text-teal-700">جاري تحميل مواقيت الصلاة...</div></div>;
  }
  
  if (locationError) {
    return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{locationError}</div>;
  }

  return (
    <div className="p-4 bg-teal-50/50 text-teal-900 min-h-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-teal-800">{dateInfo?.hijri}</h2>
        <p className="text-lg text-teal-600">{dateInfo?.gregorian}</p>
      </div>

      {nextPrayer && (
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg text-center">
          <h3 className="text-xl font-medium">الصلاة القادمة</h3>
          <p className="text-4xl font-bold my-2">{nextPrayer.name}</p>
          <p className="text-2xl font-mono tracking-widest">{countdown}</p>
        </div>
      )}

      <div className="space-y-3">
        {prayerTimes.map((prayer) => (
          <div key={prayer.name} className={`flex justify-between items-center p-4 rounded-lg shadow-sm transition-all duration-300 ${nextPrayer?.name === prayer.name ? 'bg-teal-200 ring-2 ring-teal-500' : 'bg-white'}`}>
            <span className="text-lg font-semibold">{prayer.name}</span>
            <span className="text-xl font-bold font-mono">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
