
import React from 'react';
import { sahihBukhariHadiths } from '../data/hadith';
import { BookOpenIcon } from './icons';
import type { Hadith } from '../types';

// Memoized HadithCard component to prevent unnecessary re-renders in the list.
const HadithCard: React.FC<{ hadith: Hadith }> = React.memo(({ hadith }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-r-4 border-amber-500">
      <p className="text-lg leading-relaxed text-gray-800 mb-3">"{hadith.text}"</p>
      <p className="text-sm text-teal-700 font-semibold">{hadith.source}</p>
    </div>
  );
});

const HadithList: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="text-center mb-8">
          <BookOpenIcon className="mx-auto h-12 w-12 text-teal-600" />
          <h1 className="text-3xl font-bold text-teal-800 mt-2">أحاديث من صحيح البخاري</h1>
          <p className="text-gray-500">مجموعة من الأحاديث النبوية الشريفة</p>
      </div>
      <div className="space-y-4">
        {sahihBukhariHadiths.map((hadith) => (
          <HadithCard key={hadith.id} hadith={hadith} />
        ))}
      </div>
    </div>
  );
};

export default HadithList;