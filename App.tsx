import React, { useState, useEffect } from 'react';
import PrayerTimes from './components/PrayerTimes';
import AzkarView from './components/AzkarView';
import HadithList from './components/HadithList';
import AiAssistant from './components/AiAssistant';
import BottomNav from './components/BottomNav';
import { Muezzin } from './types';
import { CogIcon } from './components/icons';

export type ActiveView = 'prayer' | 'azkar' | 'hadith' | 'ai';

const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentMuezzin: Muezzin;
    onMuezzinChange: (muezzin: Muezzin) => void;
    city: string;
    onCityChange: (city: string) => void;
    country: string;
    onCountryChange: (country: string) => void;
}> = ({ isOpen, onClose, currentMuezzin, onMuezzinChange, city, onCityChange, country, onCountryChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-teal-800">الإعدادات</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        اختر المؤذن
                    </label>
                    <select
                        value={currentMuezzin}
                        onChange={(e) => onMuezzinChange(e.target.value as Muezzin)}
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                    >
                        {Object.values(Muezzin).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        المدينة (لتحديد أوقات الصلاة)
                    </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => onCityChange(e.target.value)}
                        placeholder="مثال: مكة"
                        className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                    />
                </div>
                
                 <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        الدولة (رمز الدولة)
                    </label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => onCountryChange(e.target.value)}
                        placeholder="مثال: SA"
                        className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                    />
                     <p className="text-xs text-gray-500 mt-1">استخدم رمز الدولة المكون من حرفين (مثل SA, EG, AE).</p>
                </div>

                <button onClick={onClose} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700">
                    حفظ وإغلاق
                </button>
            </div>
        </div>
    );
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('prayer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [muezzin, setMuezzin] = useState<Muezzin>(() => {
    return (localStorage.getItem('muezzin') as Muezzin) || Muezzin.Mishary;
  });
  const [city, setCity] = useState<string>(() => localStorage.getItem('city') || '');
  const [country, setCountry] = useState<string>(() => localStorage.getItem('country') || '');

  useEffect(() => {
    localStorage.setItem('muezzin', muezzin);
  }, [muezzin]);

  useEffect(() => {
    localStorage.setItem('city', city);
  }, [city]);

  useEffect(() => {
    localStorage.setItem('country', country);
  }, [country]);

  const renderView = () => {
    switch (activeView) {
      case 'prayer':
        return <PrayerTimes muezzin={muezzin} city={city} country={country} />;
      case 'azkar':
        return <AzkarView />;
      case 'hadith':
        return <HadithList />;
      case 'ai':
        return <AiAssistant />;
      default:
        return <PrayerTimes muezzin={muezzin} city={city} country={country} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-teal-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">أذكاري</h1>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-teal-600">
          <CogIcon className="h-6 w-6"/>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-16">
        {renderView()}
      </main>
      
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentMuezzin={muezzin}
        onMuezzinChange={setMuezzin}
        city={city}
        onCityChange={setCity}
        country={country}
        onCountryChange={setCountry}
      />
    </div>
  );
};

export default App;