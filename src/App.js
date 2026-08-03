import React, { useState, useEffect } from 'react';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import AmazonClothingStore from './components/Store/AmazonClothingStore';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('zoz_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem('zoz_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.role === 'admin' ? 'admin' : 'store';
    }
    return 'store';
  });

  const handleLogout = () => {
    localStorage.removeItem('zoz_user');
    setCurrentUser(null);
    setCurrentPage('store');
  };

  return (
    <div className="App">
      {currentPage === 'store' && (
        <AmazonClothingStore 
          currentUser={currentUser}
          onOpenLogin={() => setCurrentPage('login')} 
          onLogout={handleLogout}
          onNavigateToAdmin={() => setCurrentPage('admin')}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onNavigateToRegister={() => setCurrentPage('register')}
          onNavigateToForgot={() => setCurrentPage('forgot')}
          onBackToStore={() => setCurrentPage('store')}
          onNavigateToAdmin={() => setCurrentPage('admin')}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentPage(user.role === 'admin' ? 'admin' : 'store');
          }}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage 
          onNavigateToLogin={() => setCurrentPage('login')} 
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard 
          onBackToStore={() => setCurrentPage('store')}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'forgot' && (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6" dir="rtl">
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md w-full text-center space-y-4 shadow-xl">
            <h2 className="text-2xl font-black text-amber-400">استعادة كلمة المرور</h2>
            <p className="text-slate-400 text-sm">أدخل بريدك الإلكتروني لإرسال كود الاستعادة</p>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
            />
            <button className="w-full bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition cursor-pointer">
              إرسال الكود
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              className="text-xs text-amber-400 hover:underline block mx-auto pt-2"
            >
              الرجوع لتسجيل الدخول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;