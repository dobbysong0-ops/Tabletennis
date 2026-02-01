
import React, { useState, useMemo } from 'react';
import { Student, Record, Lead, NavItem, Todo, Renewal } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
  students: Student[];
  records: Record[];
  leads: Lead[];
  renewals: Renewal[];
  todos: Todo[];
  onTabChange: (tab: NavItem) => void;
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  students, records, leads, renewals, todos, onTabChange,
  onAddTodo, onToggleTodo, onDeleteTodo
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [revenuePeriod, setRevenuePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // 累计消耗：所有销课记录的总和
  const totalConsumedTimes = records.reduce((acc, curr) => acc + curr.times, 0);

  // 本月消耗（用于对比或展示）
  const monthlyConsumedTimes = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return records
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, curr) => acc + curr.times, 0);
  }, [records]);

  const alertStudents = students.filter(s => s.remainingTimes < 5);
  const activeStudentsCount = students.filter(s => s.status === '在训').length;
  const intentionalLeadsCount = leads.filter(l => l.status !== '已签约').length;

  // 营收数据计算
  const revenueChartData = useMemo(() => {
    const now = new Date();

    if (revenuePeriod === 'weekly') {
      // 获取过去7天
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const amount = renewals
          .filter(r => r.startDate === dateStr)
          .reduce((sum, r) => sum + r.amount, 0);
        data.push({ name: `${d.getMonth() + 1}/${d.getDate()}`, amount });
      }
      return data;
    } else if (revenuePeriod === 'monthly') {
      // 获取今年所有月份
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return months.map((m, idx) => {
        const amount = renewals
          .filter(r => {
            const rd = new Date(r.startDate);
            return rd.getFullYear() === now.getFullYear() && rd.getMonth() === idx;
          })
          .reduce((sum, r) => sum + r.amount, 0);
        return { name: m, amount };
      });
    } else {
      // 按年统计过去5年
      const data = [];
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const amount = renewals
          .filter(r => new Date(r.startDate).getFullYear() === year)
          .reduce((sum, r) => sum + r.amount, 0);
        data.push({ name: `${year}年`, amount });
      }
      return data;
    }
  }, [renewals, revenuePeriod]);

  const totalRevenue = useMemo(() => revenueChartData.reduce((sum, d) => sum + d.amount, 0), [revenueChartData]);

  const stats = [
    {
      label: '在训学员',
      value: activeStudentsCount.toString(),
      sub: `总人数 ${students.length}`,
      icon: 'ri-user-smile-line',
      color: 'blue',
      target: NavItem.Students
    },
    {
      label: '累计消课',
      value: `${totalConsumedTimes}次`,
      sub: `本月消课 ${monthlyConsumedTimes}次`,
      icon: 'ri-flashlight-line',
      color: 'teal',
      target: NavItem.Records
    },
    {
      label: '意向潜客',
      value: intentionalLeadsCount.toString(),
      sub: '待转化线索',
      icon: 'ri-chat-3-line',
      color: 'orange',
      target: NavItem.Leads
    },
    {
      label: '异常预警',
      value: alertStudents.length.toString(),
      sub: '课时不足5次',
      icon: 'ri-error-warning-fill',
      color: 'rose',
      target: 'WARNING_MODAL' as any
    },
  ];

  const handleStatClick = (target: NavItem | 'WARNING_MODAL') => {
    if (target === 'WARNING_MODAL') {
      setShowWarningModal(true);
    } else if (target) {
      onTabChange(target);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">运营中心</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">实时系统数据已刷新</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <div
              onClick={() => stat.target && handleStatClick(stat.target)}
              className={`bg-white p-6 rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm transition-all relative group cursor-pointer h-full hover:border-${stat.color}-400 hover:shadow-xl hover:bg-${stat.color}-50/10 active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-500 transition-transform group-hover:scale-110`}>
                  <i className={`${stat.icon} text-2xl`}></i>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 营收概览图表 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <i className="ri-line-chart-line text-blue-600"></i> 营收概览
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">所选口径总计: <span className="text-blue-600 font-black">¥{totalRevenue.toLocaleString()}</span></p>
            </div>
            <div className="flex p-1 bg-gray-50 rounded-xl gap-1">
              {[
                { label: '周', value: 'weekly' },
                { label: '月', value: 'monthly' },
                { label: '年', value: 'yearly' }
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => setRevenuePeriod(p.value as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${revenuePeriod === p.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(val) => `¥${val}`}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 900, fontSize: '12px', color: '#2563eb' }}
                  labelStyle={{ fontWeight: 700, fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={24}>
                  {revenueChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === revenueChartData.length - 1 ? '#2563eb' : '#dbeafe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 待办事项 */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <i className="ri-checkbox-line text-teal-600"></i> 系统待办
            </h3>
            <span className="bg-teal-50 text-teal-600 text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm border border-teal-100">
              {todos.filter(t => !t.completed).length} 件处理中
            </span>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleAddTodo} className="relative group">
              <input
                type="text"
                placeholder="快速添加任务..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-500 transition-all font-bold text-xs shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 w-8 h-8 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 hover:scale-105 active:scale-90 transition-all shadow-md shadow-teal-100"
                title="添加任务"
              >
                <i className="ri-add-line text-lg"></i>
              </button>
            </form>

            <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
              {todos.length > 0 ? (
                todos.map(todo => (
                  <div
                    key={todo.id}
                    className={`group flex items-center gap-3 p-3.5 rounded-2xl border border-transparent transition-all hover:bg-gray-50 ${todo.completed ? 'opacity-50' : 'bg-gray-50/30'}`}
                  >
                    <button
                      onClick={() => onToggleTodo(todo.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${todo.completed ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-200 text-transparent hover:border-teal-400'}`}
                    >
                      <i className="ri-check-line text-xs font-black"></i>
                    </button>
                    <span className={`flex-1 text-[11px] font-bold transition-all line-clamp-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <i className="ri-checkbox-blank-circle-line text-3xl opacity-10"></i>
                  <p className="text-[10px] font-bold uppercase tracking-widest">暂无事项</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/80 backdrop-blur-2xl w-full max-w-xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 border border-white/40">
            <div className="p-10 bg-[#f43f5e] text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight">课时预警名单</h3>
                <p className="text-rose-100 mt-1 font-medium text-sm">以下学员剩余课时不足 5 次，请及时联系续费</p>
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-11 h-11 rounded-full bg-[#fb7185] flex items-center justify-center hover:bg-[#e11d48] transition-all shadow-lg active:scale-95"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gray-50/40">
              {alertStudents.length > 0 ? (
                alertStudents.map(student => (
                  <div key={student.id} className="group flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 relative">
                        <i className="ri-user-smile-line text-3xl"></i>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center text-white text-xs font-black border-4 border-white">!</div>
                      </div>
                      <div>
                        <p className="text-xl font-black text-gray-800 tracking-tight">{student.name}</p>
                        <p className="text-sm text-gray-400 mt-1 font-medium flex items-center gap-2">
                          <i className="ri-phone-fill text-gray-300"></i> {student.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">剩余课时</p>
                      <p className="text-3xl font-black text-rose-500 mt-1 leading-none">
                        {student.remainingTimes}<span className="text-xs ml-1">次</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <i className="ri-checkbox-circle-line text-5xl opacity-20 block mb-4"></i>
                  <p className="font-medium">当前无学员课时预警</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-white/50 border-t border-gray-100 flex gap-4">
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  onTabChange(NavItem.Students);
                }}
                className="flex-1 py-5 bg-[#1e293b] text-white rounded-2xl font-black text-base hover:bg-black transition-all shadow-xl shadow-gray-200/50 flex items-center justify-center gap-2"
              >
                前往学员管理
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
