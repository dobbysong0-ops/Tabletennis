
import React, { useState } from 'react';
import { Renewal, Student } from '../types';

interface RenewalsProps {
  renewals: Renewal[];
  students: Student[];
  onAddRenewal: (r: Renewal) => void;
}

const Renewals: React.FC<RenewalsProps> = ({ renewals, students, onAddRenewal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentName: '', amount: '', times: '40', courseName: '精品小班课' });

  const handleSave = () => {
    if (!formData.studentName || !formData.amount) return;
    const newR: Renewal = {
      id: `RN${Date.now().toString().slice(-4)}`,
      studentName: formData.studentName,
      courseName: formData.courseName,
      amount: parseFloat(formData.amount),
      times: parseInt(formData.times) || 40,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2025-01-01',
      payment: '微信支付',
      status: '已完成'
    };
    onAddRenewal(newR);
    setIsModalOpen(false);
    setFormData({ studentName: '', amount: '', times: '40', courseName: '精品小班课' });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">续费管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">查看和录入财务充值流水</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-blue-600 text-white rounded-[1.2rem] text-sm font-black shadow-lg shadow-blue-100 hover:shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 group"
        >
          <i className="ri-money-dollar-circle-line text-lg"></i>
          录入新单
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">学员</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">课程名称</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">金额</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">充值次数</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">支付日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {renewals.map((renewal) => (
                <tr key={renewal.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-5 text-sm font-bold text-gray-800">{renewal.studentName}</td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{renewal.courseName}</td>
                  <td className="px-8 py-5 text-sm font-black text-blue-600">¥{renewal.amount}</td>
                  <td className="px-8 py-5 text-sm text-gray-600 font-bold">+{renewal.times}次</td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{renewal.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/50">
            {/* Modal Header with Close Button */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">财务录入</h3>
                <p className="text-xs text-gray-400 mt-1 font-bold">请准确核对并录入学员充值信息</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">学员选择</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-800 shadow-sm appearance-none" 
                  value={formData.studentName} 
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                >
                  <option value="">请选择学员</option>
                  {students.map(s => <option key={s.id} value={s.name}>{s.name} (余{s.remainingTimes}次)</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">课程类型</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-800 shadow-sm appearance-none" 
                  value={formData.courseName} 
                  onChange={e => setFormData({...formData, courseName: e.target.value})}
                >
                  <option value="精品小班课">精品小班课</option>
                  <option value="竞训课">竞训课</option>
                  <option value="成人一对一">成人一对一</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">实付金额 (元)</label>
                  <input 
                    placeholder="请输入金额" 
                    type="number" 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-800 shadow-sm" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">增加次数</label>
                  <input 
                    placeholder="请输入次数" 
                    type="number" 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-800 shadow-sm" 
                    value={formData.times} 
                    onChange={e => setFormData({...formData, times: e.target.value})} 
                  />
                </div>
              </div>

              <button 
                onClick={handleSave} 
                className="w-full py-5 mt-4 bg-blue-600 text-white rounded-[2rem] font-black text-base shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <i className="ri-check-line text-xl"></i>
                完成支付并增加次数
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Renewals;
