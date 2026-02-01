
import React from 'react';
import { NavItem } from '../types';

interface SidebarProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: NavItem.Dashboard, icon: 'ri-dashboard-line', label: '数据看板' },
    { id: NavItem.Students, icon: 'ri-user-line', label: '学员管理' },
    { id: NavItem.Leads, icon: 'ri-user-add-line', label: '客户跟进' },
    { id: NavItem.Courses, icon: 'ri-calendar-line', label: '课程安排' },
    { id: NavItem.Records, icon: 'ri-file-list-3-line', label: '课时记录' },
    { id: NavItem.Coaches, icon: 'ri-user-star-line', label: '教练管理' },
    { id: NavItem.Renewals, icon: 'ri-money-dollar-circle-line', label: '续费管理' },
  ];

  return (
    <div className={`h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <i className="ri-ping-pong-line text-white text-xl"></i>
        </div>
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent truncate">
            永晟乒乓
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className={`${item.icon} text-xl flex-shrink-0`}></i>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-xl`}></i>
          {!collapsed && <span className="text-sm font-medium">收起菜单</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
