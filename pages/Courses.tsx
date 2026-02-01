
import React, { useState, useMemo } from 'react';
import { Course, Student, Coach } from '../types';

interface CoursesProps {
  courses: Course[];
  students: Student[];
  coaches: Coach[];
  onAddCourse: (c: Course) => void;
}

const WEEKDAYS = ['周二', '周三', '周四', '周五', '周六', '周日'];

const TIME_SLOTS = [
  { label: '9:00-10:30', key: 'morning_1' },
  { label: '10:30-12:00', key: 'morning_2' },
  { label: '中午休息', key: 'lunch', isBreak: true },
  { label: '3:00-4:30', key: 'afternoon_1' },
  {
    label: '4:30-6:00',
    key: 'evening_1',
    dynamicLabel: (day: string) => ['周六', '周日'].includes(day) ? '4:30-6:00' : '5:30-7:00'
  },
  {
    label: '晚课',
    key: 'evening_2',
    dynamicLabel: (day: string) => ['周六', '周日'].includes(day) ? '6:30-8:00' : '7:00-8:30'
  },
];

const CoursesPage: React.FC<CoursesProps> = ({ courses, students, coaches, onAddCourse }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string, key: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [filterCoach, setFilterCoach] = useState('全部人员');

  // 表单状态
  const [courseName, setCourseName] = useState('');
  const [coachName, setCoachName] = useState(coaches[0]?.name || '李教练');
  const [capacity, setCapacity] = useState(12);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  const filteredCourses = useMemo(() => {
    if (filterCoach === '全部人员') return courses;
    return courses.filter(c => c.coach === filterCoach);
  }, [courses, filterCoach]);

  const getCourseAt = (day: string, timeKey: string) => {
    return filteredCourses.find(c => c.schedule.includes(day) && c.id.includes(timeKey));
  };

  const handleCellClick = (day: string, time: string, key: string) => {
    setSelectedSlot({ day, time, key });
    setSelectedStudentIds([]);
    setStudentSearch('');
    setCourseName('');
    setIsAddModalOpen(true);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSaveCourse = () => {
    if (!courseName || !selectedSlot) return;

    // 获取选中学生的姓名
    const selectedNames = students
      .filter(s => selectedStudentIds.includes(s.id))
      .map(s => s.name);

    const newCourse: Course = {
      id: `C${Date.now()}-${selectedSlot.key}`,
      name: courseName,
      level: '不限',
      coach: coachName,
      schedule: selectedSlot.day,
      location: '训练馆A区',
      enrollment: `${selectedStudentIds.length}/${capacity}`,
      capacity: capacity,
      progress: 0,
      fee: 0,
      status: '进行中',
      themeGradient: 'from-orange-500 to-red-500',
      studentNames: selectedNames
    };

    onAddCourse(newCourse);
    setIsAddModalOpen(false);
  };

  const handleExportPdf = () => {
    const element = document.getElementById('schedule-table-export');
    if (!element) return;

    setIsExporting(true);

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `永晟乒乓课表_${dateStr}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // @ts-ignore
    window.html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsExporting(false);
      })
      .catch((err: any) => {
        console.error('PDF Export Error:', err);
        setIsExporting(false);
      });
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch)
    );
  }, [students, studentSearch]);

  return (
    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">永晟乒乓秋季班课表</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">专业排期管理 · 场地资源优化</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <select
              value={filterCoach}
              onChange={(e) => setFilterCoach(e.target.value)}
              className="pl-10 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold shadow-sm outline-none focus:border-orange-500 transition-all appearance-none min-w-[140px]"
            >
              <option value="全部人员">全部人员</option>
              {coaches.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <i className="ri-user-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"></i>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isExporting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm active:scale-95'
              }`}
          >
            {isExporting ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                正在导出...
              </>
            ) : (
              <>
                <i className="ri-file-pdf-2-line text-lg text-rose-500"></i>
                导出课表
              </>
            )}
          </button>
        </div>
      </div>

      {/* 课表主体 - 添加 ID 用于导出 */}
      <div id="schedule-table-export" className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="w-32 p-6 border-b border-r border-gray-100"></th>
                {WEEKDAYS.map(day => (
                  <th key={day} className="p-6 text-sm font-black text-gray-800 border-b border-r border-gray-100 text-center tracking-widest">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot.key} className={slot.isBreak ? "bg-gray-50/30" : ""}>
                  <td className="p-6 border-b border-r border-gray-100 text-center">
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${slot.isBreak ? 'text-gray-400' : 'text-gray-500'}`}>
                      {slot.label}
                    </span>
                  </td>

                  {slot.isBreak ? (
                    <td colSpan={6} className="p-6 border-b border-gray-100 text-center">
                      <div className="flex items-center justify-center gap-3 text-gray-400 font-bold text-xs italic tracking-[0.5em] group">
                        <i className="ri-rest-time-line text-xl group-hover:rotate-12 transition-transform"></i>
                        <span className="mt-0.5">中午休息</span>
                      </div>
                    </td>
                  ) : (
                    WEEKDAYS.map(day => {
                      const course = getCourseAt(day, slot.key);
                      const displayTime = slot.dynamicLabel ? slot.dynamicLabel(day) : slot.label;

                      return (
                        <td
                          key={`${day}-${slot.key}`}
                          onClick={() => handleCellClick(day, displayTime, slot.key)}
                          className="p-3 border-b border-r border-gray-100 min-h-[120px] align-top hover:bg-orange-50/30 transition-all cursor-pointer group"
                        >
                          <div className="text-[9px] text-gray-300 font-black mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {displayTime}
                          </div>

                          {course ? (
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${course.themeGradient} text-white shadow-md shadow-orange-100 animate-in zoom-in-95 h-full flex flex-col justify-between min-h-[90px]`}>
                              <div className="text-xs font-black line-clamp-3 leading-relaxed">
                                {course.studentNames?.join('、') || '未分配学员'}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-md font-black">
                                  {course.enrollment}
                                </span>
                                <i className="ri-user-follow-line text-xs opacity-60"></i>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-transparent group-hover:border-orange-100 rounded-2xl transition-all min-h-[80px]">
                              <i className="ri-add-line text-gray-200 text-2xl opacity-0 group-hover:opacity-100"></i>
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <i className="ri-information-line text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-black text-blue-900">排期优化说明</p>
            <p className="text-xs text-blue-700 mt-1">根据学员反馈调整了晚间时段划分，更贴合放学时间。</p>
          </div>
        </div>
        <div className="p-6 bg-orange-50/50 rounded-3xl border border-orange-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
            <i className="ri-group-line text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-black text-orange-900">满班提醒</p>
            <p className="text-xs text-orange-700 mt-1">已有 2 个时段接近满员，建议增加临时班次。</p>
          </div>
        </div>
        <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
            <i className="ri-map-pin-2-line text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-black text-teal-900">场地预约</p>
            <p className="text-xs text-teal-700 mt-1">A区、B区本周正常开放，C区周五上午维护。</p>
          </div>
        </div>
      </div>

      {/* 新增课程模态框 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[92vh]">

            <div className="p-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white flex justify-between items-center relative overflow-hidden flex-shrink-0">
              <i className="ri-ping-pong-fill absolute -right-6 -bottom-6 text-[12rem] text-white/10 rotate-12"></i>
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight">在此段排课</h3>
                <p className="text-orange-100 text-sm mt-1 font-bold">
                  {selectedSlot ? `${selectedSlot.day} ${selectedSlot.time}` : '请选择时段'}
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center hover:bg-white/30 shadow-lg group transition-all"
                title="关闭"
              >
                <i className="ri-close-line text-2xl group-hover:rotate-90 transition-transform"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white custom-scrollbar">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">课程名称/类型</label>
                <input
                  type="text"
                  placeholder="例如：少儿双周特训营"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-800 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">授课教练</label>
                  <div className="relative">
                    <select
                      value={coachName}
                      onChange={(e) => setCoachName(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-800 shadow-sm appearance-none"
                    >
                      {coaches.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">容纳人数</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-800 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">筛选上课学员</label>
                  <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full ring-1 ring-orange-200/50 transition-all">
                    已选 {selectedStudentIds.length} 人
                  </span>
                </div>

                <div className="relative group">
                  <i className="ri-search-2-line absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"></i>
                  <input
                    type="text"
                    placeholder="快速检索学员姓名..."
                    className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-200 transition-all font-bold text-sm shadow-sm"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar p-1">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => toggleStudent(student.id)}
                        className={`flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all text-left relative group/card ${selectedStudentIds.includes(student.id)
                          ? 'border-orange-500 bg-orange-50/30 shadow-md ring-4 ring-orange-100/20'
                          : 'border-gray-50 bg-gray-50/30 hover:border-orange-100 hover:bg-white hover:shadow-sm'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${selectedStudentIds.includes(student.id)
                          ? 'bg-orange-600 text-white rotate-6 scale-110 shadow-lg shadow-orange-100'
                          : 'bg-white text-gray-400 shadow-sm border border-gray-100'
                          }`}>
                          {selectedStudentIds.includes(student.id) ? <i className="ri-check-line text-lg"></i> : student.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-800 truncate leading-none">{student.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1.5 flex items-center gap-1">
                            <span className={student.remainingTimes < 5 ? 'text-rose-500' : 'text-gray-400'}>余{student.remainingTimes}次</span>
                            <span className="opacity-20">|</span>
                            <span>{student.level}</span>
                          </p>
                        </div>

                        {selectedStudentIds.includes(student.id) && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 text-gray-400">
                      <i className="ri-user-search-line text-4xl opacity-10 mb-2 block"></i>
                      <p className="text-[11px] font-black uppercase tracking-widest">未检索到符合条件的学员</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-gray-100 bg-gray-50/20 flex gap-5 flex-shrink-0 shadow-[0_-8px_32px_rgba(0,0,0,0.02)]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-4.5 bg-white text-gray-400 font-black rounded-2xl border border-gray-200 hover:bg-gray-50 hover:text-gray-600 active:scale-95 transition-all text-sm shadow-sm"
              >
                取消
              </button>
              <button
                onClick={handleSaveCourse}
                disabled={!courseName}
                className={`flex-1 py-4.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all text-sm ring-1 ring-orange-400/20 flex items-center justify-center gap-2 group ${!courseName ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                确认发布课表
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
