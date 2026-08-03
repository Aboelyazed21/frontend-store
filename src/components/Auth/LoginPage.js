import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess, onNavigateToRegister, onNavigateToForgot, onBackToStore }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('zoz_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'بيانات تسجيل الدخول غير صحيحة');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم، تأكد من اتصال الإنترنت!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="gold-border-card p-8 rounded-3xl max-w-md w-full space-y-6 relative shadow-2xl">
        <button 
          onClick={onBackToStore}
          className="absolute top-4 left-4 text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-bold"
        >
          ✕ خروج
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Shopping
          </h1>
          <p className="text-xs text-slate-500">سجل دخولك لمتابعة طلباتك وتسوقك 🛍️</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-center text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
            <input 
              type="password" required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <button 
              type="button"
              onClick={onNavigateToForgot}
              className="text-slate-500 hover:text-amber-700 transition font-bold"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl transition text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول 🚀'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={onNavigateToRegister}
            className="text-xs text-amber-700 hover:underline font-bold cursor-pointer block w-full"
          >
            ليس لديك حساب؟ انشئ حساباً جديداً
          </button>
        </div>
      </div>
    </div>
  );
}