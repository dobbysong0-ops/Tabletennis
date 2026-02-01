
import React, { useState } from 'react';
import { Record, Student, Coach, Course } from '../types';

interface RecordsProps {
  records: Record[];
  students: Student[];
  coaches: Coach[];
  courses: Course[];
  onAddRecord: (recs: Record[]) => void;
}

const Records: React.FC<RecordsProps> = ({ records, students, coaches, courses, onAddRecord }) => {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [times, setTimes] = useState('1');
  
  // Batch Sign-in Form States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCoach, setSelectedCoach] = useState(coaches[0]?.name || '');
  const [selectedCourse, setSelectedCourse] = useState('精品小班课');

  const courseNames = ['精品小班课', '竞训课', '成人一对一'];

  const toggleStudent = (name: string) => {
    setSelectedStudents(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleBatchSave = () => {
    if (selectedStudents.length === 0) return;
    const t = parseInt(times);
    const newRecs: Record[] = selectedStudents.map(name => ({
      id: `R${Date.now()}-${name}`,
      studentName: name,
      courseName: selectedCourse,
      coach: selectedCoach,
      date: selectedDate,
      time: '16:00-17:30', // Assuming default time for batch
      times: t,
      attendance: '出勤',
      performance: '良好',
      status: '已完成'
    }));
    onAddRecord(newRecs);
    setShowBatchModal(false);
    setSelectedStudents([]);
    setTimes('1');
  };

  const handleExportExcel = () => {
    const headers = ["学生姓名", "课程名称", "课时总数", "剩余课时"];
    
    // 使用传入的 students 列表导出汇总数据
    const rows = students.map(s => [
      s.name,
      s.courseName,
      s.totalTimes,
      s.remainingTimes
    ]);
    
    // Add BOM for Excel Chinese support
    let csvContent = "\uFEFF";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `学员课时统计表_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">课时记录</h2>
          <p className="text-sm text-gray-500 mt-1">记录将同步扣减学员剩余课时（次数）</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="ri-file-excel-2-line text-green-600"></i>导出课时汇总
          </button>
          <button 
            onClick={() => setShowBatchModal(true)}
            className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 active:scale-95 transition-all"
          >
            <i className="ri-group-line mr-1"></i>批量签到
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">日期</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">学员</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">课程名称/教练</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">消耗次数</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">考勤</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-teal-50/30 transition-all">
                  <td className="px-6 py-5 text-xs font-bold text-gray-800">{record.date}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-800">{record.studentName}</td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-gray-700">{record.courseName}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{record.coach}</p>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-black text-gray-900">{record.times}次</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-600">{record.attendance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBatchModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
              <div className="p-8 bg-teal-600 text-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-xl font-black">批量课时录入</h3>
                    <p className="text-teal-100 text-xs mt-1">一键完成整班学员的签到扣费</p>
                 </div>
                 <button onClick={() => setShowBatchModal(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
                    <i className="ri-close-line text-2xl"></i>
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 {/* Date and Times Settings */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">签到日期</label>
                       <input 
                          type="date" 
                          className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-500 transition-all font-bold text-gray-800 shadow-sm" 
                          value={selectedDate} 
                          onChange={e => setSelectedDate(e.target.value)} 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">扣减次数 (次)</label>
                       <input 
                          type="number" 
                          step="1" 
                          className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-500 transition-all font-bold text-gray-800 shadow-sm" 
                          value={times} 
                          onChange={e => setTimes(e.target.value)} 
                       />
                    </div>
                 </div>

                 {/* Coach and Course Selection */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">授课教练</label>
                       <div className="relative">
                          <select 
                             className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-500 transition-all font-bold text-gray-800 shadow-sm appearance-none"
                             value={selectedCoach}
                             onChange={e => setSelectedCoach(e.target.value)}
                          >
                             {coaches.map(coach => (
                                <option key={coach.id} value={coach.name}>{coach.name}</option>
                             ))}
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">关联课程</label>
                       <div className="relative">
                          <select 
                             className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-500 transition-all font-bold text-gray-800 shadow-sm appearance-none"
                             value={selectedCourse}
                             onChange={e => setSelectedCourse(e.target.value)}
                          >
                             {courseNames.map(name => (
                               <option key={name} value={name}>{name}</option>
                             ))}
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                       </div>
                    </div>
                 </div>

                 {/* Student Selection Grid */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">选择签到学员</label>
                       <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full ring-1 ring-teal-200/50">
                          已选 {selectedStudents.length} 人
                       </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {students.map(student => (
                         <button 
                           key={student.id} 
                           type="button"
                           onClick={() => toggleStudent(student.name)}
                           className={`p-4 rounded-2xl border-2 transition-all text-left relative group ${
                              selectedStudents.includes(student.name) 
                              ? 'border-teal-500 bg-teal-50 shadow-md ring-4 ring-teal-100/20' 
                              : 'border-gray-50 bg-gray-50 hover:border-teal-100 hover:bg-white hover:shadow-sm'
                           }`}
                         >
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                                  selectedStudents.includes(student.name) ? 'bg-teal-600 text-white rotate-6' : 'bg-white text-gray-400'
                               }`}>
                                  {selectedStudents.includes(student.name) ? <i className="ri-check-line"></i> : student.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-gray-800 truncate leading-none">{student.name}</p>
                                  <p className="text-[10px] text-gray-400 mt-1.5 font-bold truncate">{student.level}</p>
                               </div>
                            </div>
                            {selectedStudents.includes(student.name) && (
                               <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                            )}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="p-8 border-t bg-gray-50/50 flex gap-4 shrink-0">
                 <button 
                    onClick={() => setShowBatchModal(false)}
                    className="flex-1 py-4 bg-white text-gray-400 font-black rounded-2xl border border-gray-200 hover:bg-gray-50 hover:text-gray-600 transition-all text-sm"
                 >
                    取消
                 </button>
                 <button 
                    onClick={handleBatchSave} 
                    disabled={selectedStudents.length === 0}
                    className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                 >
                    确认并扣减次数 ({selectedStudents.length} 人)
                    <i className="ri-arrow-right-line"></i>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Records;
