
import React, { useState } from 'react';

interface TopbarProps {
  onLogout?: () => void;
  username?: string;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout, username = '管理员' }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索学员、课程、教练..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-all"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 leading-none">{username}</p>
              <p className="text-xs text-gray-400 mt-1 leading-none">超级管理员</p>
            </div>
            {/* 更新头像为包含乒乓球元素的品牌 Logo */}
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100 ring-2 ring-white">
              <i className="ri-ping-pong-fill text-white text-xl"></i>
            </div>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl border border-gray-100 shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                    <i className="ri-user-settings-line"></i> 个人中心
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                    <i className="ri-shield-keyhole-line"></i> 安全设置
                  </button>
                  <div className="h-px bg-gray-50 my-1 mx-2"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold"
                  >
                    <i className="ri-logout-box-r-line"></i> 退出登录
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
