import React, { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك يا زوار Shopping! 🛍️ كيف يمكنني مساعدتك اليوم؟ اختر أحد الأسئلة الشائعة بالأسفل:' }
  ]);

  const faqs = [
    { question: '📦 ما هي طرق الدفع المتاحة؟', answer: 'نحن نتيح عدة طرق للدفع: الدفع عند الاستلام (Cash)، الدفع الإلكتروني عبر فوري (Fawry Pay)، أو باستخدام بطاقة الائتمان (Credit Card).' },
    { question: '🚚 كم تستغرق مدة التوصيل؟', answer: 'عادةً ما تستغرق مدة التوصيل من 2 إلى 4 أيام عمل داخل المحافظات المصرية.' },
    { question: '🔄 هل يمكنني إرجاع المنتجات؟', answer: 'نعم، يمكنك إرجاع أو استبدال المنتج خلال 14 روزاً من استلامه بشرط أن يكون في حالته الأصلية.' },
    { question: '📞 كيف يمكنني التواصل مع الدعم؟', answer: 'يمكنك التواصل معنا عبر رقم التليفون المسجل أو متابعة حالة طلبك مباشرة من واجهة حسابك الشخصي في المتجر.' }
  ];

  const handleUserSelect = (faq) => {
    // إضافة رسالة المستخدم
    setMessages(prev => [...prev, { sender: 'user', text: faq.question }]);
    
    // إضافة رد البوت بعد ثانية لإعطاء انطباع طبيعي
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: faq.answer }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" dir="rtl">
      {/* زر فتح/غلق الشات */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-4 rounded-full shadow-2xl flex items-center justify-center transition hover:scale-110 cursor-pointer border-2 border-amber-300"
        >
          💬
        </button>
      )}

      {/* نافذة المحادثة */}
      {isOpen && (
        <div className="gold-border-card w-80 sm:w-96 rounded-3xl shadow-2xl flex flex-col overflow-hidden bg-white">
          
          {/* رأس الشات */}
          <div className="bg-amber-500 text-slate-950 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="font-black text-xs">مساعد Shopping الذكي</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-950 hover:text-white font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* محتوى الرسائل */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`p-3 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none' : 'bg-white border border-amber-200 text-slate-800 rounded-tl-none shadow-xs'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* الأسئلة الشائعة الجاهزة للاختيار */}
          <div className="p-3 bg-white border-t border-amber-100 space-y-1.5 max-h-40 overflow-y-auto">
            <span className="text-[10px] text-slate-400 block font-bold pr-1">الاستفسارات الشائعة:</span>
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => handleUserSelect(faq)}
                className="w-full text-right text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 p-2 rounded-xl transition cursor-pointer font-bold"
              >
                {faq.question}
              </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}