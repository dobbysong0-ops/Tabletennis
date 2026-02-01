
import React, { useState, useMemo } from 'react';
import { Coach, Record } from '../types';

interface CoachesProps {
  coaches: Coach[];
  records: Record[];
  onAddCoach: (c: Coach) => void;
  onDeleteCoach: (id: string) => void;
}

const Coaches: React.FC<CoachesProps> = ({ coaches, records, onAddCoach, onDeleteCoach }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '男' as '男' | '女',
    age: '',
    phone: '',
    title: '', // 水平/头衔
    experience: '', // 教学经验年数
    specialty: '', // 擅长/负责课程描述
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      gender: '男',
      age: '',
      phone: '',
      title: '',
      experience: '',
      specialty: '精品小班课、竞训课'
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newCoach: Coach = {
      id: `coach${Date.now()}`,
      name: formData.name,
      avatar: '',
      age: parseInt(formData.age) || 30,
      gender: formData.gender,
      rating: 5.0,
      phone: formData.phone,
      title: formData.title || '专业教练',
      specialty: formData.specialty,
      experience: parseInt(formData.experience) || 1,
      currentCourses: 0,
      studentCount: 0,
      monthlyClasses: 0,
      monthlyHours: 0,
      themeColor: 'cyan'
    };

    onAddCoach(newCoach);
    setIsAddModalOpen(false);
  };

  // 计算本月 YYYY-MM
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">教练管理</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">管理教练信息和授课统计</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-teal-100 hover:bg-teal-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="ri-add-line text-lg"></i>添加教练
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {coaches.map((coach) => {
          // 动态计算该教练本月的课时统计
          const coachMonthRecords = records.filter(r =>
            r.coach === coach.name &&
            r.date.startsWith(currentMonth)
          );

          // 授课天数：统计当月内唯一的日期数量
          const sessionDays = new Set(coachMonthRecords.map(r => r.date));
          const dynamicMonthlyDays = sessionDays.size;

          // 总课时：统计所有记录的消费次数 (times)
          const dynamicMonthlyHours = coachMonthRecords.reduce((sum, r) => sum + r.times, 0);

          return (
            <div key={coach.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[2rem] bg-cyan-50 flex items-center justify-center border border-cyan-100 group-hover:bg-cyan-100 transition-all">
                      <i className="ri-user-star-line text-4xl text-cyan-400 opacity-80"></i>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-400 text-[10px]"></i>
                      <span className="text-[10px] font-black text-gray-900">{coach.rating}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{coach.name}</h3>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-green-50 text-green-600">在职</span>
                        <button
                          onClick={() => onDeleteCoach(coach.id)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-bold">
                      <span>{coach.gender}</span>
                      <span className="opacity-30">·</span>
                      <span>{coach.age}岁</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-bold flex items-center gap-1.5">
                      <i className="ri-phone-fill text-gray-300"></i> {coach.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 py-6 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-sm">
                    <i className="ri-medal-line text-gray-400 text-lg"></i>
                    <span className="text-gray-600 font-bold">{coach.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <i className="ri-lightbulb-line text-gray-400 text-lg"></i>
                    <span className="text-gray-600 font-bold line-clamp-1">{coach.specialty}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <i className="ri-time-line text-gray-400 text-lg"></i>
                    <span className="text-gray-600 font-bold">{coach.experience}年教学经验</span>
                  </div>
                </div>

                <div className="bg-cyan-50/30 p-6 rounded-[2rem] border border-cyan-100/50 mt-4">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">本月课时统计</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold">授课天数</p>
                      <p className="text-3xl font-black text-cyan-600 tracking-tight mt-0.5">
                        {dynamicMonthlyDays}<span className="text-xs ml-1 opacity-60">天</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-500 font-bold">总课时</p>
                      <p className="text-3xl font-black text-cyan-600 tracking-tight mt-0.5">
                        {dynamicMonthlyHours}<span className="text-xs ml-1 opacity-60">h</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 添加教练模态框 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
          >
            <div className="p-10 bg-teal-600 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black">录入新教练</h3>
                <p className="text-teal-100 text-sm mt-1 font-bold">建立专业教学团队，提升培训质量</p>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">姓名</label>
                  <input required placeholder="请输入教练姓名" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-sm"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">联系电话</label>
                  <input required type="tel" placeholder="请输入手机号" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-sm"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">性别</label>
                  <div className="flex p-1 bg-gray-50 rounded-2xl gap-1 border border-gray-100">
                    {['男', '女'].map(g => (
                      <button key={g} type="button" onClick={() => setFormData({ ...formData, gender: g as any })}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.gender === g ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">年龄</label>
                  <input required type="number" placeholder="岁" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-sm"
                    value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">技术水平/头衔</label>
                  <input placeholder="如：国家一级教练员" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-sm"
                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">教学经验 (年)</label>
                  <input required type="number" placeholder="年" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-sm"
                    value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">负责课程 (可多选/描述)</label>
                <div className="flex flex-wrap gap-2">
                  {['精品小班课', '竞训课', '成人一对一'].map(course => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => {
                        const current = formData.specialty.split('、').filter(Boolean);
                        const next = current.includes(course)
                          ? current.filter(c => c !== course)
                          : [...current, course];
                        setFormData({ ...formData, specialty: next.join('、') });
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formData.specialty.includes(course)
                          ? 'bg-teal-50 border-teal-200 text-teal-600 ring-4 ring-teal-50/50'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
                <input
                  placeholder="其他擅长项目..."
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-sm mt-2"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>
            </div>

            <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-4 shadow-[0_-8px_32px_rgba(0,0,0,0.02)]">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4.5 bg-white text-gray-400 font-black rounded-2xl border border-gray-200 hover:bg-gray-50 hover:text-gray-600 active:scale-95 transition-all text-sm">取消</button>
              <button type="submit" className="flex-[2] py-4.5 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                确认保存资料
                <i className="ri-check-line text-lg"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Coaches;
