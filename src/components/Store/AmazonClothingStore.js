import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

export default function AmazonClothingStore({ currentUser, onOpenLogin, onLogout, onNavigateToAdmin }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('الدفع عند الاستلام');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetch(`https://backend-production-0c686.up.railway.app/api/orders/user/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setUserOrders(data))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  };

  const handleOpenCheckout = () => {
    if (!currentUser) {
      alert('عذراً، يجب تسجيل الدخول أولاً لكي تتمكن من إتمام الطلب! 🔒');
      onOpenLogin();
      return;
    }
    if (cart.length === 0) {
      alert('السلة فارغة، يرجى إضافة منتجات أولاً!');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً!');
      onOpenLogin();
      return;
    }

    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          totalAmount: calculateTotal(),
          shippingAddress: shippingAddress || 'القاهرة، مصر',
          phone: phone || 'غير متوفر',
          paymentMethod: paymentMethod
        })
      });

      if (res.ok) {
        setOrderSuccess(`تم إرسال طلبك بنجاح عبر (${paymentMethod})! سيتم التواصل معك قريباً ✅`);
        setCart([]);
        setPhone('');
        setShippingAddress('');
        fetch(`https://backend-production-0c686.up.railway.app/api/orders/user/${currentUser.id}`)
          .then(res => res.json())
          .then(data => setUserOrders(data));

        setTimeout(() => {
          setOrderSuccess('');
          setShowCheckout(false);
        }, 3500);
      }
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  const filteredProducts = selectedCategory === 'الكل' 
    ? products 
    : products.filter(p => (p.category || 'ملابس').includes(selectedCategory));

  return (
    <div className="min-h-screen text-slate-800 font-sans flex flex-col justify-between" dir="rtl">
      <div>
        <header className="bg-white/80 backdrop-blur-md border-b border-amber-200/50 p-4 sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-8 gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img 
              src="https://srwat.com/wp-content/uploads/2021/11/product-package-boxes-shopping-bag-cart-with-laptop-online-shopping-delivery-concept1.jpg" 
              alt="Logo" 
              className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Shopping
            </span>
          </div>
          
          <div className="hidden lg:flex items-center bg-white border border-amber-200 rounded-xl px-4 py-2 w-80 shadow-inner">
            <input 
              type="text" 
              placeholder="بحث عن الملابس، إكسسوارات الموبايل، الألعاب..." 
              className="bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder-slate-400 text-right"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleOpenCheckout}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm border border-amber-300/50"
            >
              🛒 السلة ({cart.length})
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3 bg-white border border-amber-200 px-4 py-2 rounded-xl shadow-sm">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">مرحباً بك 👋</span>
                  <span className="text-xs font-black text-amber-700">{currentUser.name}</span>
                </div>

                {currentUser.role === 'admin' && onNavigateToAdmin && (
                  <button 
                    onClick={onNavigateToAdmin}
                    className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition hover:bg-amber-600 cursor-pointer shadow-sm"
                  >
                    لوحة التحكم 🛠️
                  </button>
                )}

                <button 
                  onClick={onLogout}
                  className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition hover:bg-rose-100 cursor-pointer"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                👤 تسجيل الدخول
              </button>
            )}
          </div>
        </header>

        <div className="bg-white/60 border-b border-amber-100 py-3 px-8 sticky top-[73px] z-40 backdrop-blur-md shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {['الكل', 'ملابس', 'إكسسوارات موبايل', 'ألعاب أطفال', 'إلكترونيات'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${selectedCategory === category ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'}`}
              >
                {category === 'الكل' ? '🔥 جميع المنتجات' : category}
              </button>
            ))}
          </div>
        </div>

        {currentUser && currentUser.role !== 'admin' && userOrders.length > 0 && (
          <div className="max-w-7xl mx-auto px-8 mt-6">
            <div className="gold-border-card p-6 rounded-3xl space-y-3">
              <h3 className="text-sm font-black text-amber-700">📦 متابعة حالة طلباتك الأخيرة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-4 rounded-2xl border border-amber-200 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-xs text-slate-600 block">طلب رقم #{ord.id} - الإجمالي: {ord.total_amount} EGP</span>
                      <span className="text-[11px] text-slate-400">طريقة الدفع: {ord.payment_method || 'الدفع عند الاستلام'}</span>
                    </div>
                    <div>
                      {ord.status === 'تم التسليم' ? (
                        <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                          🎉 تم تسليم طلبك بنجاح!
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                          ⏳ قيد المعالجة
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center border-r-4 border-amber-500 pr-3">
            <h2 className="text-2xl font-black text-slate-800">منتجات قسم: <span className="text-amber-600">{selectedCategory}</span></h2>
            <span className="text-xs text-slate-500">({filteredProducts.length} منتج متوفر)</span>
          </div>

          {orderSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-center font-bold shadow-sm">
              {orderSuccess}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm bg-white rounded-3xl border border-amber-200 shadow-sm">
              لا توجد منتجات متاحة في هذا القسم حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="gold-border-card rounded-2xl overflow-hidden flex flex-col justify-between transition hover:scale-[1.01]">
                  <img src={p.images || p.image} alt={p.title} className="w-full h-56 object-cover border-b border-amber-100" />
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 mb-1">{p.title || p.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-amber-100">
                      <span className="text-amber-700 font-black">{p.price} EGP</span>
                      <button 
                        onClick={() => addToCart(p)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer active:scale-95 shadow-sm"
                      >
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-white/80 border-t border-amber-200/50 py-6 px-8 text-center text-xs text-slate-600 mt-12 shadow-sm">
        <p>جميع حقوق الملكية محفوظة © 2026 <span className="text-amber-700 font-bold">Aboelyazed Hatem</span></p>
      </footer>

      {showCheckout && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="gold-border-card p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl my-8">
            <h2 className="text-xl font-black text-amber-700">إتمام الطلب وطريقة الدفع</h2>
            
            <div className="space-y-2 max-h-32 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-amber-200">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs border-b border-amber-200/60 pb-2">
                  <span className="text-slate-700">{item.title || item.name}</span>
                  <span className="text-amber-700 font-bold">{item.price} EGP</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-black text-sm pt-1 border-t border-amber-200 text-slate-800">
              <span>الإجمالي الكلي:</span>
              <span className="text-amber-700 text-base">{calculateTotal()} EGP</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الشحن</label>
                <input 
                  type="text" required 
                  value={shippingAddress} 
                  onChange={(e) => setShippingAddress(e.target.value)} 
                  placeholder="القاهرة، المعادي..." 
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 text-xs shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم التليفون للتواصل</label>
                <input 
                  type="tel" required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="01012345678" 
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 text-xs shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اختر طريقة الدفع</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
                >
                  <option value="الدفع عند الاستلام (Cash)">الدفع عند الاستلام (Cash)</option>
                  <option value="فوري (Fawry Pay)">دفع إلكتروني عبر فوري (Fawry Pay)</option>
                  <option value="بطاقة ائتمان (Credit Card)">بطاقة ائتمان (Credit Card)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={cart.length === 0}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-md"
                >
                  تأكيد الطلب 🚀
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
}