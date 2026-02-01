
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟登录验证
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        onLogin(username);
      } else {
        setError('账号或密码错误 (试用: admin / 123456)');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
      
      <div className="w-full max-w-[440px] p-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 mb-6">
              <i className="ri-ping-pong-line text-white text-3xl"></i>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">永晟乒乓培训管理系统</h1>
            <p className="text-gray-400 text-sm mt-2 font-medium">请登录您的管理账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">管理账号</label>
              <div className="relative group">
                <i className="ri-user-6-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"></i>
                <input
                  required
                  type="text"
                  placeholder="账号"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-800"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">安全密码</label>
              <div className="relative group">
                <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"></i>
                <input
                  required
                  type="password"
                  placeholder="密码"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-xl animate-in shake duration-300">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <i className="ri-loader-4-line animate-spin text-lg"></i>
              ) : (
                <>登录系统 <i className="ri-arrow-right-line"></i></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              © 2024 永晟乒乓 · 专业体育管理
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
