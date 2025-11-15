import React, { useState, useEffect, useMemo } from 'react';
import { quranSurahs } from '../data/quran_meta';
import { surahStartPages, pageMetadata } from '../data/quran_page_meta';

// Component for a single Surah in the index list.
const SurahListItem: React.FC<{
    surah: typeof quranSurahs[0];
    onSurahClick: (surahNumber: number) => void;
}> = React.memo(({ surah, onSurahClick }) => {
    return (
        <div
            onClick={() => onSurahClick(surah.number)}
            className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-teal-50 cursor-pointer transition-all flex items-center"
        >
            <span className="bg-teal-600 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ml-4">{surah.number}</span>
            <div className="flex-grow">
                <span className="text-xl font-semibold text-gray-800">{surah.name}</span>
            </div>
            <span className="text-gray-500 text-sm">{surah.numberOfAyahs} آيات</span>
        </div>
    );
});

const QuranReader: React.FC = () => {
    const [view, setView] = useState<'index' | 'reader'>('index');
    const [currentPage, setCurrentPage] = useState(1);
    const [isContentLoading, setIsContentLoading] = useState(true);

    const handleSurahClick = (surahNumber: number) => {
        const startPage = surahStartPages[surahNumber] || 1;
        setCurrentPage(startPage);
        setView('reader');
    };

    const handleBackToIndex = () => {
        setView('index');
    };
    
    const goToNextPage = () => {
        if (currentPage < 604) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    // Reset loading state when page changes
    useEffect(() => {
        setIsContentLoading(true);
    }, [currentPage]);

    const pageInfo = useMemo(() => {
        return pageMetadata.find(p => p.page === currentPage);
    }, [currentPage]);
    
    const pdfUrl = `https://www.pdfquran.com/p${currentPage}.pdf`;

    if (view === 'reader') {
        return (
            <div className="p-2 md:p-4 bg-gray-100 min-h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-100 py-2 z-10 px-2">
                    <button
                        onClick={handleBackToIndex}
                        className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                         الفهرس
                    </button>
                    <div className="text-center">
                       <h2 className="text-xl font-bold text-teal-800">
                           {pageInfo?.surahs.map(s => s.name).join(' - ')}
                       </h2>
                       <p className="text-sm text-gray-600">الجزء {pageInfo?.juz}</p>
                    </div>
                     <div className="w-24 text-left">
                        <span className="text-lg font-bold text-teal-700">{currentPage}</span>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-grow flex items-center justify-center mb-16">
                    <div className="w-full max-w-2xl h-[75vh] relative">
                        {isContentLoading && (
                           <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                               <div className="text-xl text-teal-700">جاري تحميل الصفحة...</div>
                           </div>
                        )}
                        <iframe
                            key={currentPage} // Force re-render on page change
                            src={pdfUrl}
                            title={`صفحة ${currentPage} من القرآن الكريم`}
                            className={`w-full h-full rounded-lg shadow-lg border transition-opacity duration-300 ${isContentLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setIsContentLoading(false)}
                        />
                    </div>
                </div>
                
                 {/* Navigation */}
                <div className="fixed bottom-16 left-0 right-0 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-10">
                     <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        السابق
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === 604}
                        className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        التالي
                    </button>
                </div>
            </div>
        );
    }
    
    // Index View
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-teal-800 text-center mb-6">فهرس القرآن الكريم</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quranSurahs.map((surah) => (
                    <SurahListItem 
                        key={surah.number} 
                        surah={surah}
                        onSurahClick={handleSurahClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuranReader;