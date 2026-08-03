import React, { useState, useEffect } from 'react';

export default function ProfilePage({ user, onBackToStore, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب طلبات المستخدم من الباك إند (لو حبين نربطها لاحقاً)
  useEffect(() => {
    // محاكاة أو جلب الطلبات الخاصة بالعميل
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-amber-400">مرحباً، {user?.name || 'صديقنا العميل'} 👋</h1>
            <p className="text-slate-400 text-sm mt-1">{user?.email || 'email@example.com'}</p>
          </div>
          <button 
            onClick={onBackToStore}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-sm cursor-pointer"
          >
            العودة للمتجر 🛒
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-bold">الطلبات النشطة</h3>
            <p className="text-3xl font-black text-white mt-2">0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-bold">إجمالي الطلبات</h3>
            <p className="text-3xl font-black text-emerald-400 mt-2">مكتملة</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg flex flex-col justify-between">
            <h3 className="text-slate-400 text-sm font-bold">إدارة الحساب</h3>
            <button 
              onClick={onLogout}
              className="mt-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold py-2 px-4 rounded-xl transition text-sm cursor-pointer"
            >
              تسجيل الخروج 🚪
            </button>
          </div>
        </div>

        {/* Orders History Section */}
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg">
          <h2 className="text-lg font-black text-white mb-4 border-r-4 border-amber-400 pr-3">سجل طلباتك السابقة</h2>
          {loading ? (
            <p className="text-slate-400 text-sm">جاري تحميل الطلبات...</p>
          ) : (
            <div className="text-center py-10 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              لا توجد طلبات سابقة حتى الآن. ابدأ التسوق الآن! 🛍️
            </div>
          )}
        </div>

      </div>
    </div>
  );
}