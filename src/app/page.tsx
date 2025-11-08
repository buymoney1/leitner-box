// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBookOpen, FiPlus, FiCheckCircle, FiXCircle, FiGrid, FiRefreshCw, FiCalendar } from 'react-icons/fi';

interface Card {
  id: string;
  term: string;
  definition: string;
  boxNumber: number;
  lastReview: string;
  nextReview: string;
}

export default function LeitnerBox() {
  // States
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('در حال بارگذاری...');
  const [boxCounts, setBoxCounts] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  
  const [isManaging, setIsManaging] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; cardIds: string[]; }>({ isOpen: false, cardIds: [] });

  const router = useRouter();

  // --- API Functions ---
  const fetchBoxCounts = async () => {
    try {
      const response = await fetch('/api/get-box-counts');
      if (!response.ok) throw new Error('Failed to fetch box counts');
      const counts = await response.json();
      setBoxCounts(counts);
    } catch (error) {
      console.error('Failed to fetch box counts:', error);
    }
  };

  const fetchCardsForReview = async () => {
    setIsLoading(true);
    try {
      setMessage('در حال دریافت کارت‌های امروز...');
      const response = await fetch('/api/get-cards-for-review');
      if (!response.ok) throw new Error('Failed to fetch cards for review');
      const data = await response.json();
      setCards(data);
      setMessage(`${data.length} کارت برای امروز جهت مرور وجود دارد.`);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      setMessage('خطا در بارگذاری کارت‌ها.');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- Effects ---
  useEffect(() => {
    fetchBoxCounts();
    fetchCardsForReview();
  }, []);

  // --- Handler Functions ---
  const handleAnswer = async (isCorrect: boolean) => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    try {
      const response = await fetch('/api/move-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: currentCard.id, isCorrect }),
      });

      if (!response.ok) throw new Error('Failed to move card');

      const updatedCard = await response.json();
      setMessage(`موفقیت! "${currentCard.term}" به جعبه ${updatedCard.boxNumber} منتقل شد.`);

      const remainingCards = cards.filter(card => card.id !== currentCard.id);
      setCards(remainingCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      
      // به‌روزرسانی شمارش جعبه‌ها
      const newCounts = { ...boxCounts };
      newCounts[currentCard.boxNumber]--;
      newCounts[updatedCard.boxNumber]++;
      setBoxCounts(newCounts);

    } catch (error) {
      console.error('!!! Error in handleAnswer !!!', error);
      setMessage(`خطا: ${error.message}`);
    }
  };
  
  // (توابع handleManualMove, initiateDelete, confirmDelete و کامپوننت مدیریت مثل قبل باقی می‌مانند)
  // ... (کدهای مربوط به مدیریت را از پاسخ قبلی کپی کنید)
  
  const currentCard = cards[currentCardIndex];

  // --- Management Mode UI ---
  // --- کامپوننت حالت مدیریت ---
  if (isManaging) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FiGrid className="text-3xl text-violet-400" />
                <h1 className="text-4xl font-bold text-white">مدیریت جعبه‌ها</h1>
              </div>
              <button
                onClick={() => setIsManaging(false)}
                className="px-4 py-2 bg-gray-700 text-violet-300 font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                بازگشت به مرور
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl border border-violet-500/20">
              <h3 className="text-violet-300 text-center mb-4">وضعیت جعبه‌ها</h3>
              <div className="flex justify-around text-center text-sm">
                {Object.entries(boxCounts).map(([box, count]) => (
                  <div key={box} className="text-violet-200">جعبه {box}: <span className="font-bold text-white">{count}</span></div>
                ))}
              </div>
            </div>
            
            {/* نمایش کارت‌ها در هر جعبه */}
            {[1, 2, 3, 4].map(boxNumber => {
              const cardsInBox = cards.filter(card => card.boxNumber === boxNumber);
              return (
                <div key={boxNumber} className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-4 shadow-2xl border border-violet-500/20">
                  <h2 className="text-xl font-semibold mb-3 text-violet-300">جعبه {boxNumber}</h2>
                  <div className="space-y-3">
                    {cardsInBox.map(card => (
                      <div key={card.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                        <span className="text-white font-medium">{card.term} - {card.definition}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(targetBox => (
                            <button
                              key={targetBox}
                              onClick={() => handleManualMove(card.id, targetBox)}
                              disabled={isLoadingAction === card.id || targetBox === card.boxNumber}
                              className={`px-3 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                targetBox === card.boxNumber
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                  : 'bg-violet-600 text-white hover:bg-violet-700'
                              } ${isLoadingAction === card.id ? 'opacity-50' : ''}`}
                            >
                              {targetBox}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {cardsInBox.length === 0 && (
                      <p className="text-gray-500 text-sm">این جعبه خالی است.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }
  // --- Main Review Mode UI ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
        <div className="w-full max-w-3xl">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
              <FiBookOpen className="text-3xl text-violet-400" />
              <h1 className="text-4xl font-bold text-white">جعبه لایتنر</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsManaging(true)} /* ... */ className="p-3 bg-gray-800 text-violet-400 rounded-lg hover:bg-gray-700"><FiGrid size={20} /></button>
              <button onClick={() => router.push('/add-words')} className="p-3 bg-gray-800 text-violet-400 rounded-lg hover:bg-gray-700"><FiPlus size={20} /></button>
            </div>
          </header>

          {/* --- وضعیت جعبه‌ها --- */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map(box => (
              <div key={box} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 text-center border border-violet-500/20">
                <h3 className="text-lg font-bold text-violet-300">جعبه {box}</h3>
                <p className="text-2xl font-bold text-white my-2">{boxCounts[box] || 0}</p>
                <p className="text-xs text-gray-400">
                  {box === 1 && 'هر روز'}
                  {box === 2 && 'هر ۲ روز'}
                  {box === 3 && 'هر ۴ روز'}
                  {box === 4 && 'هر ۸ روز'}
                  {box === 5 && 'هر ۱۶ روز'}
                </p>
              </div>
            ))}
          </div>

          {/* --- پیام وضعیت --- */}
          <div className="bg-violet-800/30 backdrop-blur-md border-l-4 border-violet-500 p-4 mb-6 rounded-lg text-violet-200 text-sm">
            {message}
          </div>

          {/* --- کارت اصلی --- */}
          {isLoading ? (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-12 text-center text-gray-400 shadow-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-violet-500 mx-auto mb-4"></div>
              در حال بارگذاری...
            </div>
          ) : currentCard ? (
            <div className="relative w-full h-80">
              <div className={`flip-card w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                <div className="flip-card-inner">
                  <div className="flip-card-front bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-violet-500/20 flex flex-col justify-center items-center p-10">
                    <div className="text-5xl font-bold mb-8 text-white leading-relaxed">{currentCard.term}</div>
                    <div className="text-sm text-gray-500">مرور بعدی: {new Date(currentCard.nextReview).toLocaleDateString('fa-IR')}</div>
                  </div>
                  <div className="flip-card-back bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl flex flex-col justify-center items-center p-10">
                    <div className="text-3xl text-white leading-relaxed">{currentCard.definition}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsFlipped(!isFlipped)} className="absolute top-4 left-4 p-2 bg-gray-700/80 text-violet-300 rounded-full hover:bg-gray-600 transition-all"><FiRefreshCw size={18} /></button>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-12 text-center text-gray-400 shadow-2xl">
              <FiCalendar className="text-5xl mx-auto mb-4 text-violet-400" />
              <p className="text-xl">امروز کاری برای مرور نداری!</p>
              <p className="text-sm mt-2">فردا سر بزن یا از بخش مدیریت کارت‌ها را بررسی کن.</p>
            </div>
          )}

          {currentCard && (
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => handleAnswer(false)} className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"><FiXCircle size={20} /> نمی‌دونم</button>
              <button onClick={() => handleAnswer(true)} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/50"><FiCheckCircle size={20} /> بلدم</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}