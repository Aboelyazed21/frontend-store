import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onBackToStore, onLogout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState('');
  const [category, setCategory] = useState('ملابس');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://backend-production-0c686.up.railway.app/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, price, stock_quantity: stock, images, category })
      });
      if (res.ok) {
        alert('تم إضافة المنتج بنجاح مع الصورة! 🎉');
        setTitle('');
        setDescription('');
        setPrice('');
        setStock('');
        setImages('');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`https://backend-production-0c686.up.railway.app/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`https://backend-production-0c686.up.railway.app/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`https://backend-production-0c686.up.railway.app/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans flex flex-col justify-between" dir="rtl">
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-200/50 p-4 sticky top-0 z-50 flex justify-between items-center px-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Shopping Admin 🛠️
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToStore}
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-amber-300/50"
          >
            العودة للمتجر 🛍️
          </button>
          <button 
            onClick={onLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-rose-200"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${activeTab === 'products' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'}`}
          >
            📦 إدارة المنتجات ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'}`}
          >
            🛒 إدارة الطلبات ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${activeTab === 'users' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'}`}
          >
            👥 العملاء المسجلين ({users.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="gold-border-card p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-amber-700">➕ إضافة منتج جديد مع رفع الصورة من الجهاز</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input 
                  type="text" required placeholder="عنوان المنتج..." 
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 shadow-inner"
                />
                <input 
                  type="number" required placeholder="السعر (EGP)..." 
                  value={price} onChange={(e) => setPrice(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 shadow-inner"
                />
                <input 
                  type="number" required placeholder="الكمية المتاحة..." 
                  value={stock} onChange={(e) => setStock(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 shadow-inner"
                />
                
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 shadow-inner md:col-span-2 lg:col-span-3"
                >
                  <option value="ملابس">ملابس</option>
                  <option value="إكسسوارات موبايل">إكسسوارات موبايل</option>
                  <option value="ألعاب أطفال">ألعاب أطفال</option>
                  <option value="إلكترونيات">إلكترونيات</option>
                </select>

                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">اختر صورة المنتج من الجهاز 🖼️</label>
                  <input 
                    type="file" accept="image/*" onChange={handleImageUpload} required
                    className="w-full px-4 py-2 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 file:ml-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer shadow-inner"
                  />
                  {images && <p className="text-[11px] text-emerald-600 font-bold pt-1">✅ تم رفع الصورة بنجاح وجاهزة للحفظ</p>}
                </div>

                <textarea 
                  placeholder="وصف المنتج..." value={description} onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 md:col-span-2 lg:col-span-3 shadow-inner"
                  rows="2"
                ></textarea>

                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition cursor-pointer md:col-span-2 lg:col-span-3 shadow-md">
                  نشر المنتج في المتجر 🚀
                </button>
              </form>
            </div>

            <div className="gold-border-card p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-amber-700">📋 المنتجات الحالية ({products.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-white border border-amber-200 p-4 rounded-2xl flex flex-col justify-between shadow-xs">
                    <img src={p.images || p.image} alt={p.title} className="w-full h-36 object-cover rounded-xl mb-2" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 truncate">{p.title}</h4>
                      <span className="text-amber-700 font-bold text-xs">{p.price} EGP</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="mt-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 rounded-lg text-xs transition cursor-pointer border border-rose-200"
                    >
                      حذف المنتج 🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="gold-border-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-black text-amber-700">🛒 طلبات العملاء الواردة ({orders.length})</h3>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-700 block">طلب رقم #{ord.id}</span>
                    <p className="text-xs text-slate-600">العنوان: {ord.shipping_address}</p>
                    <p className="text-xs text-slate-600">الهاتف: {ord.phone}</p>
                    <p className="text-xs text-slate-600">طريقة الدفع: {ord.payment_method}</p>
                    <p className="text-xs font-black text-slate-800">الإجمالي: {ord.total_amount} EGP</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-amber-200 text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="قيد المعالجة">⏳ قيد المعالجة</option>
                      <option value="تم التسليم">🎉 تم التسليم</option>
                    </select>
                    <button 
                      onClick={() => handleDeleteOrder(ord.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-rose-200"
                    >
                      حذف 🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="gold-border-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-black text-amber-700">👥 العملاء المسجلين في المتجر ({users.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u) => (
                <div key={u.id} className="bg-white border border-amber-200 p-4 rounded-2xl space-y-1 shadow-xs">
                  <h4 className="font-bold text-xs text-slate-800">{u.name}</h4>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                  <p className="text-[11px] text-slate-600">📞 {u.phone}</p>
                  <p className="text-[11px] text-slate-600">📍 {u.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white/80 border-t border-amber-200/50 py-6 px-8 text-center text-xs text-slate-600 mt-12 shadow-sm">
        <p>جميع حقوق الملكية محفوظة © 2026 <span className="text-amber-700 font-bold">Aboelyazed Hatem</span></p>
      </footer>
    </div>
  );
}