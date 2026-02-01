
import React, { useState } from 'react';
import { Student } from '../types';

interface StudentsProps {
  students: Student[];
  onAddStudent: (s: Student) => void;
  onUpdateStudent: (s: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const Students: React.FC<StudentsProps> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) => {
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('全部');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    gender: '男' as '男' | '女',
    age: '',
    level: '初级' as '初级' | '中级' | '高级',
    courseName: '精品小班课' as '精品小班课' | '竞训课' | '成人一对一',
    parent: '',
    phone: '',
    remainingTimes: '',
    totalTimes: '',
    status: '在训' as '在训' | '停训'
  });

  const courseOptions = ['全部', '精品小班课', '竞训课', '成人一对一'];
  const formCourseOptions = courseOptions.filter(t => t !== '全部');

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '', gender: '男', age: '', level: '初级', courseName: '精品小班课', parent: '', phone: '', remainingTimes: '0', totalTimes: '0', status: '在训'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      gender: student.gender,
      age: student.age.toString(),
      level: student.level,
      courseName: student.courseName,
      parent: student.parent,
      phone: student.phone,
      remainingTimes: student.remainingTimes.toString(),
      totalTimes: student.totalTimes.toString(),
      status: student.status
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age) || 10,
        parent: formData.parent,
        phone: formData.phone,
        level: formData.level,
        courseName: formData.courseName,
        remainingTimes: parseInt(formData.remainingTimes) || 0,
        totalTimes: parseInt(formData.totalTimes) || 0,
        status: formData.status
      };
      onUpdateStudent(updated);
    } else {
      const newStudent: Student = {
        id: `S${Date.now().toString().slice(-4)}`,
        name: formData.name,
        avatar: `https://readdy.ai/api/search-image?query=asian%20${formData.gender === '男' ? 'boy' : 'girl'}%20student%20face&width=40&height=40&seq=${Date.now()}`,
        gender: formData.gender,
        age: parseInt(formData.age) || 10,
        parent: formData.parent,
        phone: formData.phone,
        level: formData.level,
        courseName: formData.courseName,
        remainingTimes: 0, // 初始课程次数设置为0
        totalTimes: 0,     // 初始总课程次数设置为0
        joinDate: new Date().toISOString().split('T')[0],
        status: formData.status
      };
      onAddStudent(newStudent);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">学员管理</h2>
          <p className="text-sm text-gray-500 mt-1">当前在校学员: {students.length} 人</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="ri-user-add-line"></i>录入新学员
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-sm">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="搜索学员姓名..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wider">课程筛选:</span>
            {courseOptions.map(course => (
              <button
                key={course}
                onClick={() => setFilterCourse(course)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterCourse === course ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-200'}`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">学员基本信息</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">性别/年龄</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">级别/课程名称</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">联系方式</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">课时进度</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">管理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.filter(s => (filterCourse === '全部' || s.courseName === filterCourse) && s.name.includes(search)).map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{student.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{student.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black ${student.gender === '男' ? 'text-blue-500' : 'text-rose-500'}`}>{student.gender}</span>
                      <span className="text-xs font-bold text-gray-600">{student.age}岁</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-50 text-blue-600">{student.level}</span>
                      <span className="text-[10px] font-bold text-gray-400">{student.courseName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-700">{student.phone}</p>
                    <p className="text-[10px] text-gray-400">家长: {student.parent}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold">
                        <span className={student.remainingTimes < 5 ? "text-red-500" : "text-gray-400"}>
                          {student.remainingTimes} / {student.totalTimes} 次
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${student.remainingTimes < 5 ? 'bg-red-500' : 'bg-blue-600'}`}
                          style={{ width: student.totalTimes > 0 ? `${(student.remainingTimes / student.totalTimes) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${student.status === '在训' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(student)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors group-hover:bg-white group-hover:shadow-sm"
                      title="编辑"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors group-hover:bg-white group-hover:shadow-sm ml-1"
                      title="删除"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95"
          >
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">{editingStudent ? '修改学员信息' : '录入新学员'}</h3>
                <p className="text-xs text-white/70 mt-1">完善学员档案，记录训练成长</p>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all"><i className="ri-close-line text-2xl"></i></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">学员基本资料</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">姓名</label>
                    <input required placeholder="请输入学员姓名" className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">年龄</label>
                    <input required type="number" placeholder="岁" className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">性别</label>
                    <div className="flex p-1 bg-gray-50 rounded-2xl gap-1">
                      {['男', '女'].map(g => (
                        <button key={g} type="button" onClick={() => setFormData({ ...formData, gender: g as any })}
                          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${formData.gender === g ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                          {g === '男' ? <i className="ri-men-line mr-1"></i> : <i className="ri-women-line mr-1"></i>}{g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">技术级别</label>
                    <select className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value as any })}>
                      <option>初级</option>
                      <option>中级</option>
                      <option>高级</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">联系人信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">家长姓名</label>
                    <input placeholder="请输入家长姓名" className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      value={formData.parent} onChange={e => setFormData({ ...formData, parent: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">联系电话</label>
                    <input required type="tel" placeholder="请输入手机号" className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">状态与课程设置</h4>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 ml-1">学员状态</label>
                    <div className="flex p-1 bg-gray-50 rounded-2xl gap-1">
                      {['在训', '停训'].map(st => (
                        <button key={st} type="button" onClick={() => setFormData({ ...formData, status: st as any })}
                          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${formData.status === st ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {editingStudent ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 ml-1 text-rose-500">剩余课时 (次)</label>
                      <input required type="number" className="w-full px-4 py-3 bg-rose-50/50 border border-rose-100 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all font-black text-rose-600"
                        value={formData.remainingTimes} onChange={e => setFormData({ ...formData, remainingTimes: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 ml-1">总课时 (次)</label>
                      <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-gray-800"
                        value={formData.totalTimes} onChange={e => setFormData({ ...formData, totalTimes: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formCourseOptions.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, courseName: type as any })}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${formData.courseName === type
                            ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50'
                            : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white'
                          }`}
                      >
                        <p className={`text-[9px] font-black uppercase ${formData.courseName === type ? 'text-blue-600' : 'text-gray-400'}`}>选择课程</p>
                        <p className="text-xs font-black text-gray-800 mt-1">{type}</p>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-3xl font-black text-sm hover:bg-gray-100 transition-all">取消</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">确认保存档案</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Students;
