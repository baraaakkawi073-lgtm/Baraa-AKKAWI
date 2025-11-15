
import React, { useState } from 'react';
import type { Zikr } from '../types';
import { morningAzkar, eveningAzkar } from '../data/azkar';

const ZikrCard: React.FC<{ zikr: Zikr }> = ({ zikr }) => {
  const [currentCount, setCurrentCount] = useState(parseInt(zikr.count, 10));

  const handleClick = () => {
    if (currentCount > 0) {
      setCurrentCount(currentCount - 1);
    }
  };

  return (
    <div className={`relative bg-white p-6 rounded-2xl shadow-md transition-all duration-300 mb-4 border-r-4 ${currentCount === 0 ? 'border-teal-500 opacity-50' : 'border-amber-500'}`}>
        {currentCount === 0 && (
            <div className="absolute inset-0 bg-white/50 rounded-2xl flex items-center justify-center">
                <span className="text-teal-600 font-bold text-lg">أُنجز</span>
            </div>
        )}
      <p className="text-2xl leading-relaxed text-gray-800 font-serif mb-4 text-center">{zikr.content}</p>
      <p className="text-gray-500 text-sm mb-4">{zikr.description}</p>
      <p className="text-gray-400 text-xs mb-4 italic">"{zikr.reference}"</p>
      <div className="flex justify-center items-center">
        <button
          onClick={handleClick}
          disabled={currentCount === 0}
          className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex flex-col items-center justify-center text-2xl font-bold shadow-lg transition-transform transform active:scale-95 disabled:bg-gray-300"
        >
          <span>{currentCount}</span>
          <span className="text-xs font-normal">تكرار</span>
        </button>
      </div>
    </div>
  );
};

const AzkarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="flex justify-center mb-6 bg-gray-200 rounded-full p-1">
        <button
          onClick={() => setActiveTab('morning')}
          className={`w-full py-2 px-4 rounded-full text-lg font-semibold transition-colors duration-300 ${activeTab === 'morning' ? 'bg-teal-600 text-white shadow' : 'text-gray-600'}`}
        >
          أذكار الصباح
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`w-full py-2 px-4 rounded-full text-lg font-semibold transition-colors duration-300 ${activeTab === 'evening' ? 'bg-teal-600 text-white shadow' : 'text-gray-600'}`}
        >
          أذكار المساء
        </button>
      </div>
      <div>
        {(activeTab === 'morning' ? morningAzkar : eveningAzkar).map((zikr, index) => (
          <ZikrCard key={index} zikr={zikr} />
        ))}
      </div>
    </div>
  );
};

export default AzkarView;
