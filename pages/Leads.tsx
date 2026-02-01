
import React, { useState, useMemo } from 'react';
import { Lead, FollowUpRecord, LeadStatus } from '../types';

interface LeadsProps {
  leads: Lead[];
  onAddLead: (l: Lead) => void;
  onUpdateLead: (l: Lead) => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onAddLead, onUpdateLead }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 动态计算顶部统计数据
  const stats = useMemo(() => {
    const total = leads.length;
    const pending = leads.filter(l => l.status === '待联系').length;
    const trialed = leads.filter(l => l.status === '已试听').length;
    const quoted = leads.filter(l => l.status === '已报价').length;
    const signed = leads.filter(l => l.status === '已签约').length;
    const conversionRate = total > 0 ? Math.round((signed / total) * 100) : 0;

    return [
      { label: '待联系', count: pending, color: 'blue' },
      { label: '已试听', count: trialed, color: 'indigo' },
      { label: '已报价', count: quoted, color: 'orange' },
      { label: '已签约', count: signed, color: 'teal' },
      { label: '转化率', count: `${conversionRate}%`, color: 'rose' },
    ];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm)
    );
  }, [leads, searchTerm]);

  const getIntentionBadge = (level: string) => {
    switch(level) {
      case '高': return 'text-orange-600 bg-orange-50 border-orange-100';
      case '中': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-400 bg-gray-50 border-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case '已签约': return 'bg-teal-50 text-teal-600 border-teal-100';
      case '已试听': return 'bg-blue-50 text-blue-600 border-blue-100';
      case '已报价': return 'bg-orange-50 text-orange-600 border-orange-100';
      case '已流失': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLead: Lead = {
      id: `L${Date.now().toString().slice(-4)}`,
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string) || 0,
      phone: formData.get('phone') as string,
      wechat: formData.get('wechat') as string,
      courseType: formData.get('courseType') as string,
      source: formData.get('source') as any,
      intention: formData.get('intention') as any,
      status: '待联系',
      nextFollowUp: new Date().toISOString().split('T')[0],
      budget: formData.get('budget') as string,
      sportsFoundation: formData.get('sportsFoundation') as any,
      expectedTime: formData.get('expectedTime') as string,
      history: []
    };
    onAddLead(newLead);
    setSelectedLead(newLead);
    setIsAddModalOpen(false);
  };

  const handleUpdateLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLead) return;
    const formData = new FormData(e.currentTarget);
    const updated: Lead = {
      ...selectedLead,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      wechat: formData.get('wechat') as string,
      age: parseInt(formData.get('age') as string) || selectedLead.age,
      source: formData.get('source') as any,
      courseType: formData.get('courseType') as string,
      expectedTime: formData.get('expectedTime') as string,
      sportsFoundation: formData.get('sportsFoundation') as any,
      intention: formData.get('intention') as any,
      budget: formData.get('budget') as string,
    };
    onUpdateLead(updated);
    setSelectedLead(updated);
    setIsEditModalOpen(false);
  };

  const handleAddFollowUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLead) return;
    const formData = new FormData(e.currentTarget);
    const newRecord: FollowUpRecord = {
      id: `H${Date.now()}`,
      time: formData.get('time') as string,
      method: formData.get('method') as any,
      content: formData.get('content') as string,
      feedback: formData.get('feedback') as string,
      nextFollowUp: formData.get('nextFollowUp') as string,
      status: formData.get('status') as LeadStatus,
    };
    
    const updated: Lead = {
      ...selectedLead,
      status: newRecord.status,
      nextFollowUp: newRecord.nextFollowUp,
      history: [newRecord, ...selectedLead.history],
    };
    
    onUpdateLead(updated);
    setSelectedLead(updated);
    setIsFollowUpModalOpen(false);
  };

  return (
    <div className="p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full overflow-hidden">
      {/* 顶部标题与录入按钮 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">客户跟进系统</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">深度潜在客户资产管理与转化漏斗</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-3 bg-blue-600 text-white rounded-[1.2rem] text-sm font-black shadow-lg shadow-blue-100 hover:shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 group"
        >
          <i className="ri-user-add-line text-lg"></i>
          录入新线索
        </button>
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-5 gap-4 flex-shrink-0">
        {stats.map((item, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-md p-4 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:bg-white">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
            <p className={`text-2xl font-black text-${item.color}-600 tracking-tighter`}>{item.count}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* 左侧：列表区 */}
        <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 bg-gray-50/20">
             <div className="relative group">
                <i className="ri-search-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"></i>
                <input 
                  type="text" 
                  placeholder="快速检索潜在客户姓名、微信或手机号..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-transparent rounded-[1.5rem] text-sm outline-none focus:border-blue-500 transition-all font-bold shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-50">
                <tr>
                  <th className="w-[45%] px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">客户基本信息</th>
                  <th className="w-[30%] px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">当前状态</th>
                  <th className="w-[25%] px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">意向度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className={`hover:bg-blue-50/30 transition-all cursor-pointer group ${selectedLead?.id === lead.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${selectedLead?.id === lead.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-600 text-white shadow-md shadow-blue-50'}`}>
                          <i className="ri-user-smile-fill text-xl"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-black text-gray-800 tracking-tight truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-bold truncate">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center">
                       <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase inline-block ${getStatusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`px-2 py-1 rounded-lg text-xs font-black border transition-colors ${getIntentionBadge(lead.intention)}`}>
                        {lead.intention}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右侧：详情面板 */}
        <div className="w-[560px] bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col relative">
          {selectedLead ? (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
               {/* 顶部极紧凑区域 */}
               <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/10">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 ring-2 ring-blue-50/50">
                          <i className="ri-user-star-line text-xl opacity-30"></i>
                        </div>
                        <div className="min-w-0">
                           <h3 className="text-base font-black text-gray-900 tracking-tight truncate">{selectedLead.name}</h3>
                           <p className="text-[9px] text-gray-400 font-bold tracking-tight uppercase opacity-80 truncate">
                             微信: {selectedLead.wechat} · {selectedLead.age}岁
                           </p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setIsEditModalOpen(true)}
                       className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-all border border-gray-100 active:scale-90"
                       title="编辑资料"
                     >
                        <i className="ri-edit-2-line text-xs"></i>
                     </button>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                     <div className="flex-1 bg-white/60 py-1.5 px-3 rounded-xl border border-gray-50 shadow-sm">
                        <p className="text-[7px] text-gray-400 font-black uppercase tracking-widest">基础</p>
                        <p className="text-[10px] font-black text-gray-700">{selectedLead.sportsFoundation}</p>
                     </div>
                     <div className="flex-1 bg-white/60 py-1.5 px-3 rounded-xl border border-gray-50 shadow-sm">
                        <p className="text-[7px] text-gray-400 font-black uppercase tracking-widest">预算</p>
                        <p className="text-[10px] font-black text-gray-700">{selectedLead.budget}</p>
                     </div>
                     <div className="flex-1 bg-white/60 py-1.5 px-3 rounded-xl border border-gray-50 shadow-sm">
                        <p className="text-[7px] text-gray-400 font-black uppercase tracking-widest">课程</p>
                        <p className="text-[10px] font-black text-gray-700 truncate">{selectedLead.courseType}</p>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white">
                  <div>
                     <div className="flex items-center justify-between mb-6">
                       <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <i className="ri-chat-history-line text-blue-600"></i> 深度沟通记录
                       </h4>
                       <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                         全历程共 {selectedLead.history.length} 个触点
                       </span>
                     </div>
                     
                     <div className="space-y-10 border-l-2 border-indigo-50/50 ml-2.5 pl-10 relative">
                        {selectedLead.history.length > 0 ? (
                          selectedLead.history.map((h, i) => (
                             <div key={i} className="relative group/timeline animate-in slide-in-from-left-4 fade-in duration-500">
                                <div className="absolute -left-[49px] top-1 w-8 h-8 rounded-xl bg-white border border-indigo-100 shadow-sm z-10 flex items-center justify-center transition-transform group-hover/timeline:scale-110 group-hover/timeline:border-indigo-500">
                                   <i className={`${
                                      h.method === '电话' ? 'ri-phone-line' : 
                                      h.method === '微信' ? 'ri-wechat-line' : 'ri-walk-line'
                                   } text-xs font-bold text-indigo-500`}></i>
                                </div>
                                
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 transition-all hover:bg-white hover:shadow-xl group/card">
                                   <div className="flex justify-between items-center mb-4">
                                      <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase ${getStatusBadge(h.status)}`}>
                                          {h.status}
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-gray-400 font-black flex items-center gap-1">
                                        <i className="ri-time-line"></i> {h.time}
                                      </span>
                                   </div>
                                   
                                   <div className="space-y-4">
                                      <p className="text-base font-bold text-gray-800 leading-relaxed">
                                        {h.content}
                                      </p>
                                      
                                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
                                        <i className="ri-double-quotes-l absolute -top-2 -left-1 text-2xl text-indigo-100"></i>
                                        <p className="text-[13px] text-gray-500 font-bold italic pl-2">
                                          {h.feedback}
                                        </p>
                                      </div>
                                   </div>
                                   
                                   <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-black uppercase tracking-wider">
                                      <div className="flex items-center gap-1">
                                        <i className="ri-refresh-line"></i> 下次预约：{h.nextFollowUp}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          ))
                        ) : (
                          <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <i className="ri-chat-voice-line text-4xl text-gray-200"></i>
                            </div>
                            <p className="text-sm font-black text-gray-300 uppercase tracking-widest">暂无深度沟通痕迹</p>
                            <p className="text-xs text-gray-400 mt-2">点击下方按钮开启第一次连接</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="px-8 py-4 border-t border-gray-50 bg-white/80 backdrop-blur-md">
                  <button 
                    onClick={() => setIsFollowUpModalOpen(true)}
                    className="w-full py-3.5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm shadow-[0_12px_24px_-8px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                  >
                    <i className="ri-add-circle-fill text-xl group-hover:rotate-180 transition-transform duration-500"></i> 
                    更新最新跟进动态
                  </button>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center space-y-4 bg-gray-50/20">
               <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-center mb-2 animate-pulse">
                  <i className="ri-focus-3-line text-5xl opacity-10"></i>
               </div>
               <p className="text-xl font-black text-gray-800 tracking-tight">聚焦潜客画像</p>
               <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed font-bold uppercase tracking-wider">
                 请从左侧列表精准定位一名意向客户
               </p>
            </div>
          )}
        </div>
      </div>

      {/* 录入新线索模态框 */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          onClick={() => setIsAddModalOpen(false)}
        >
          <form 
            onSubmit={handleAddLead} 
            className="bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
               <i className="ri-user-heart-fill absolute -right-4 -bottom-4 text-[10rem] opacity-10 rotate-12"></i>
               <div className="relative z-10">
                 <h3 className="text-2xl font-black">录入新线索</h3>
                 <p className="text-indigo-100 text-xs mt-1 font-bold">发现潜在客户，开启乒乓成长之旅</p>
               </div>
               <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)} 
                className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                title="关闭"
               >
                <i className="ri-close-line text-2xl text-white"></i>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">姓名</label>
                  <input name="name" placeholder="请输入客户姓名" required className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">联系电话</label>
                  <input name="phone" placeholder="手机号/电话" required className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">微信</label>
                  <input name="wechat" placeholder="WeChat ID" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">年龄</label>
                  <input name="age" type="number" placeholder="岁" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">来源渠道</label>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
                  {['地推', '转介绍', '线上咨询', '其他'].map(src => (
                    <label key={src} className="flex-1 cursor-pointer">
                      <input type="radio" name="source" value={src} defaultChecked={src === '其他'} className="hidden peer" />
                      <div className="py-2.5 text-center text-xs font-black rounded-xl text-gray-400 peer-checked:bg-white peer-checked:text-indigo-600 peer-checked:shadow-sm transition-all">{src}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">意向课程类型</label>
                  <input name="courseType" placeholder="例如：少儿精品班" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">期望上课时间</label>
                  <input name="expectedTime" placeholder="周末/工作日晚" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">当前运动基础</label>
                  <select name="sportsFoundation" defaultValue="零基础" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold appearance-none transition-all">
                    <option value="零基础">零基础</option>
                    <option value="有基础">有基础</option>
                    <option value="专业级">专业级</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">意向等级</label>
                  <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
                    {['高', '中', '低'].map(lv => (
                      <label key={lv} className="flex-1 cursor-pointer">
                        <input type="radio" name="intention" value={lv} defaultChecked={lv === '中'} className="hidden peer" />
                        <div className="py-2.5 text-center text-xs font-black rounded-xl text-gray-400 peer-checked:bg-white peer-checked:text-orange-600 peer-checked:shadow-sm transition-all">{lv}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">预算范围</label>
                <input name="budget" placeholder="例如：3000-5000元" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" />
              </div>
            </div>

            <div className="p-10 border-t border-gray-50 flex gap-4 bg-gray-50/20">
               <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-white text-gray-400 font-black rounded-[1.5rem] border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">取消</button>
               <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all">确认并保存线索</button>
            </div>
          </form>
        </div>
      )}

      {/* 编辑潜客资料模态框 */}
      {isEditModalOpen && selectedLead && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          onClick={() => setIsEditModalOpen(false)}
        >
          <form 
            onSubmit={handleUpdateLead} 
            className="bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black">修改潜客资料</h3>
                 <p className="text-indigo-100 text-xs mt-1 font-bold">完善线索深度画像，定制化服务体验</p>
               </div>
               <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)} 
                className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90"
                title="关闭"
               >
                <i className="ri-close-line text-2xl text-white"></i>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">姓名</label>
                  <input name="name" defaultValue={selectedLead.name} required className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">联系电话</label>
                  <input name="phone" defaultValue={selectedLead.phone} required className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">微信</label>
                  <input name="wechat" defaultValue={selectedLead.wechat} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">年龄</label>
                  <input name="age" type="number" defaultValue={selectedLead.age} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">来源渠道</label>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
                  {['地推', '转介绍', '线上咨询', '其他'].map(src => (
                    <label key={src} className="flex-1 cursor-pointer">
                      <input type="radio" name="source" value={src} defaultChecked={selectedLead.source === src} className="hidden peer" />
                      <div className="py-2.5 text-center text-xs font-black rounded-xl text-gray-400 peer-checked:bg-white peer-checked:text-indigo-600 peer-checked:shadow-sm transition-all">{src}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">意向课程类型</label>
                  <input name="courseType" defaultValue={selectedLead.courseType} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">期望上课时间</label>
                  <input name="expectedTime" defaultValue={selectedLead.expectedTime} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">当前运动基础</label>
                  <select name="sportsFoundation" defaultValue={selectedLead.sportsFoundation} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold appearance-none">
                    <option value="零基础">零基础</option>
                    <option value="有基础">有基础</option>
                    <option value="专业级">专业级</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">意向等级</label>
                  <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
                    {['高', '中', '低'].map(lv => (
                      <label key={lv} className="flex-1 cursor-pointer">
                        <input type="radio" name="intention" value={lv} defaultChecked={selectedLead.intention === lv} className="hidden peer" />
                        <div className="py-2.5 text-center text-xs font-black rounded-xl text-gray-400 peer-checked:bg-white peer-checked:text-orange-600 peer-checked:shadow-sm transition-all">{lv}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">预算范围</label>
                <input name="budget" defaultValue={selectedLead.budget} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold" />
              </div>
            </div>

            <div className="p-10 border-t border-gray-50 flex gap-4">
               <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-400 font-black rounded-[1.5rem] hover:bg-gray-100 active:scale-95 transition-all">取消编辑</button>
               <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">更新档案资料</button>
            </div>
          </form>
        </div>
      )}

      {/* 新增跟进记录模态框 */}
      {isFollowUpModalOpen && selectedLead && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          onClick={() => setIsFollowUpModalOpen(false)}
        >
          <form 
            onSubmit={handleAddFollowUp} 
            className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black">新增跟进记录</h3>
                 <p className="text-blue-100 text-xs mt-1 font-bold">记录每一次沟通细节，建立情感纽带</p>
               </div>
               <button 
                type="button" 
                onClick={() => setIsFollowUpModalOpen(false)} 
                className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90"
                title="关闭"
               >
                <i className="ri-close-line text-2xl text-white"></i>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">沟通时间</label>
                    <input name="time" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">沟通方式</label>
                    <select name="method" required className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-bold appearance-none">
                      <option value="电话">电话联系</option>
                      <option value="微信">微信沟通</option>
                      <option value="到店">到店面谈</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">当前状态</label>
                 <div className="grid grid-cols-5 gap-2 p-1.5 bg-gray-50 rounded-2xl">
                    {['待联系', '已试听', '已报价', '已签约', '已流失'].map(st => (
                      <label key={st} className="flex-1 cursor-pointer">
                        <input type="radio" name="status" value={st} defaultChecked={selectedLead.status === st} className="hidden peer" />
                        <div className="py-2.5 text-center text-[10px] font-black rounded-xl text-gray-400 peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">{st}</div>
                      </label>
                    ))}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">沟通内容</label>
                 <textarea name="content" required rows={3} placeholder="详述沟通重点及客户关注的课程要点..." className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-bold resize-none shadow-inner" />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">客户反馈</label>
                 <input name="feedback" placeholder="直接引用或总结客户的真实评价..." className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-bold" />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">下次跟进时间</label>
                  <input name="nextFollowUp" type="date" className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-bold" />
               </div>
            </div>

            <div className="p-10 border-t border-gray-50 bg-gray-50/20 flex gap-4">
               <button type="button" onClick={() => setIsFollowUpModalOpen(false)} className="flex-1 py-4 bg-white text-gray-400 font-black rounded-[2rem] border border-gray-200 hover:bg-gray-100 transition-all active:scale-95">取消</button>
               <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-[0.98] transition-all">保存并更新状态</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Leads;
