import React, { useState } from 'react';

export default function RegisterPage({ onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address })
      });

      const data = await res.json();

      if (res.ok) {
        alert('تم إنشاء الحساب بنجاح! 🎉 برجاء تسجيل الدخول الآن.');
        if (onNavigateToLogin) onNavigateToLogin();
      } else {
        setError(data.error || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم، تأكد من اتصال الإنترنت!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="gold-border-card p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Shopping
          </h1>
          <p className="text-xs text-slate-500">أنشئ حساباً جديداً وابدأ التسوق فوراً 🛍️</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-center text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل</label>
            <input 
              type="text" required 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الكريم..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رقم التليفون</label>
            <input 
              type="tel" required 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الشحن</label>
            <input 
              type="text" required 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="القاهرة، المعادي..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
            <input 
              type="password" required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl transition text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب الآن 🚀'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={() => {
              if (onNavigateToLogin) onNavigateToLogin();
            }}
            className="text-xs text-amber-700 hover:underline font-bold cursor-pointer"
          >
            لديك حساب بالفعل؟ تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}