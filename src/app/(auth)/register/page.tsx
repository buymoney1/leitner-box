// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Card {
  id: string;
  term: string;
  definition: string;
  boxNumber: number;
}

export default function LeitnerBox() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('در حال بارگذاری...');
  const [boxCounts, setBoxCounts] = useState<{ [key: number]: number }>({});
  
  // --- State جدید برای انتخاب جعبه ---
  const [selectedBox, setSelectedBox] = useState<number | null>(null); // null یعنی "همه"
  
  const [isManaging, setIsManaging] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState<string | null>(null);
  
  const router = useRouter();

  const calculateBoxCounts = (cardList: Card[]) => {
    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
    cardList.forEach(card => {
      if (counts[card.boxNumber] !== undefined) {
        counts[card.boxNumber]++;
      }
    });
    return counts;
  };

  // --- به‌روزرسانی تابع fetchCards برای پذیرش پارامتر جعبه ---
  const fetchCards = async (boxToFetch: number | null = null) => {
    setIsLoading(true);
    try {
      let url = '/api/get-cards';
      if (boxToFetch) {
        url += `?box=${boxToFetch}`;
      }
      setMessage(`دریافت کارت‌های ${boxToFetch ? `جعبه ${boxToFetch}` : 'همه جعبه‌ها'}...`);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      setCards(data);
      
      const counts = calculateBoxCounts(data);
      setBoxCounts(counts);
      
      setMessage(`تعداد ${data.length} کارت پیدا شد.`);
      setCurrentCardIndex(0);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      setMessage('خطا در بارگذاری کارت‌ها.');
      setBoxCounts({ 1: 0, 2: 0, 3: 0, 4: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // در اولین بارگذاری، تمام کارت‌ها را بگیر تا شمارش جعبه‌ها درست باشد
    fetchCards();
  }, []);

  // --- وقتی جعبه تغییر می‌کند، کارت‌های آن جعبه را بگیر ---
  useEffect(() => {
    if (selectedBox !== null) {
      fetchCards(selectedBox);
    } else {
      // اگر null بود، کارت‌های جعبه 1 را برای مرور بگیر (منطق پیش‌فرض)
      fetchCards(1);
    }
  }, [selectedBox]);
  

  const handleAnswer = async (isCorrect: boolean) => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    const action = isCorrect ? 'بلدم' : 'نمی‌دونم';
    setMessage(`در حال ارسال پاسخ "${action}" برای کارت "${currentCard.term}"...`);

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
      
      const newCounts = { ...boxCounts };
      newCounts[currentCard.boxNumber]--;
      newCounts[updatedCard.boxNumber]++;
      setBoxCounts(newCounts);

    } catch (error) {
      console.error('!!! Error in handleAnswer !!!', error);
      setMessage(`خطا: ${error.message}`);
    }
  };

  const handleManualMove = async (cardId: string, targetBox: number) => {
    setIsLoadingAction(cardId);
    try {
      const response = await fetch('/api/set-card-box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, targetBox }),
      });
      if (!response.ok) throw new Error('Failed to set card box');
      
      await fetchCards(); 
      setMessage(`کارت با موفقیت به جعبه ${targetBox} منتقل شد.`);
    } catch (error) {
      setMessage(`خطا: ${error.message}`);
    } finally {
      setIsLoadingAction(null);
    }
  };

  const currentCard = cards[currentCardIndex];

  // --- کامپوننت حالت مدیریت (بدون تغییر) ---
  if (isManaging) {
    // (کامپوننت مدیریت را همانطور که هست نگه دارید)
    // ... (کد مربوط به حالت مدیریت را اینجا کپی کنید)
    // برای صرفه‌جویی در فضا، من آن را حذف می‌کنم اما شما باید آن را نگه دارید
    return <div>Management UI Here...</div>; 
  }

  // --- کامپوننت اصلی (حالت مرور) ---
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">جعبه لایتنر</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsManaging(true)}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              مدیریت جعبه‌ها
            </button>
            <button
              onClick={() => router.push('/add-words')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              افزودن کلمه
            </button>
          </div>
        </div>
        
        {/* --- انتخاب‌گر جعبه --- */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-semibold mb-2 text-center">جعبه مورد نظر را برای مرور انتخاب کنید:</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {[1, 2, 3, 4].map(box => (
              <button
                key={box}
                onClick={() => setSelectedBox(box)}
                disabled={boxCounts[box] === 0}
                className={`px-4 py-2 rounded font-semibold transition-colors ${
                  selectedBox === box
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${boxCounts[box] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                جعبه {box} ({boxCounts[box]})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4 text-sm rounded">
          {message}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">در حال بارگذاری...</div>
        ) : currentCard ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl font-semibold mb-6 text-gray-700">{currentCard.term}</div>
            <div className="text-xl text-gray-500 mb-8">معنی: {currentCard.definition}</div>
            <div className="text-sm text-gray-400 mb-6">جعبه فعلی: {currentCard.boxNumber}</div>
            
            <div className="flex justify-around">
              <button onClick={() => handleAnswer(false)} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">نمی‌دونم</button>
              <button onClick={() => handleAnswer(true)} className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">بلدم</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600">جعبه {selectedBox || 1} خالی است!</p>
            <p className="text-sm text-gray-500 mt-2">می‌توانید از بخش "مدیریت جعبه‌ها" کارت‌ها را جابجا کنید.</p>
          </div>
        )}
      </div>
    </main>
  );
}