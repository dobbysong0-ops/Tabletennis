
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Coaches from './pages/Coaches';
import Students from './pages/Students';
import Leads from './pages/Leads';
import CoursesPage from './pages/Courses';
import Records from './pages/Records';
import Renewals from './pages/Renewals';
import SmartAssistant from './components/SmartAssistant';
import { NavItem, Student, Coach, Lead, Record, Renewal, Course, Todo } from './types';
import { api } from './api-client';

const App: React.FC = () => {
  // 默认状态设为未登录，强制每次进入都需要输入密码
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  const [activeTab, setActiveTab] = useState<NavItem>(NavItem.Dashboard);
  const [collapsed, setCollapsed] = useState(false);
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  // 全局业务状态
  const [students, setStudents] = useState<Student[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          fetchedStudents,
          fetchedCoaches,
          fetchedLeads,
          fetchedRecords,
          fetchedRenewals,
          fetchedCourses,
          fetchedTodos
        ] = await Promise.all([
          api.getStudents(),
          api.getCoaches(),
          api.getLeads(),
          api.getRecords(),
          api.getRenewals(),
          api.getCourses(),
          api.getTodos()
        ]);

        setStudents(fetchedStudents);
        setCoaches(fetchedCoaches);
        setLeads(fetchedLeads);
        setRecords(fetchedRecords);
        setRenewals(fetchedRenewals);
        setCourses(fetchedCourses);
        setTodos(fetchedTodos);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  };

  // --- 数据联动函数 ---

  const addRecord = async (newRecords: Record[]) => {
    try {
      const savedRecords = await api.createRecords(newRecords);
      const recordsArray = Array.isArray(savedRecords) ? savedRecords : [savedRecords];

      setRecords(prev => [...recordsArray, ...prev]);

      const studentNames = recordsArray.map(r => r.studentName);
      const timesToDeduct = recordsArray[0].times;

      // 为每个涉及的学员执行数据库更新
      for (const sName of studentNames) {
        const student = students.find(s => s.name === sName);
        if (student) {
          const updated = { ...student, remainingTimes: Math.max(0, student.remainingTimes - timesToDeduct) };
          await api.updateStudent(student.id, updated);
          setStudents(prev => prev.map(s => s.id === student.id ? updated : s));
        }
      }
    } catch (error) {
      console.error("Failed to add record:", error);
      alert("添加记录失败");
    }
  };

  const addRenewal = async (newRenewal: Renewal) => {
    try {
      const savedRenewal = await api.createRenewal(newRenewal);
      setRenewals(prev => [savedRenewal, ...prev]);

      const student = students.find(s => s.name === savedRenewal.studentName);
      if (student) {
        const updated = {
          ...student,
          remainingTimes: student.remainingTimes + savedRenewal.times,
          totalTimes: student.totalTimes + savedRenewal.times
        };
        await api.updateStudent(student.id, updated);
        setStudents(prev => prev.map(s => s.id === student.id ? updated : s));
      }
    } catch (error) {
      console.error("Failed to add renewal:", error);
      alert("添加续费失败");
    }
  };

  const updateStudent = async (updatedStudent: Student) => {
    try {
      const saved = await api.updateStudent(updatedStudent.id, updatedStudent);
      setStudents(prev => prev.map(s => s.id === saved.id ? saved : s));
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  const updateLead = async (updatedLead: Lead) => {
    try {
      const saved = await api.updateLead(updatedLead.id, updatedLead);
      setLeads(prev => prev.map(l => l.id === saved.id ? saved : l));
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const addTodo = useCallback(async (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    try {
      const saved = await api.createTodo(newTodo);
      setTodos(prev => [saved, ...prev]);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }, []);

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const updated = await api.toggleTodo(id, !todo.completed);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const addStudent = async (s: Student) => {
    try {
      const saved = await api.createStudent(s);
      setStudents(prev => [saved, ...prev]);
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("添加学员失败");
    }
  };

  const addCoach = async (c: Coach) => {
    try {
      const saved = await api.createCoach(c);
      setCoaches(prev => [saved, ...prev]);
    } catch (error) {
      console.error("Failed to add coach:", error);
      alert("添加教练失败");
    }
  };

  const addLead = async (l: Lead) => {
    try {
      const saved = await api.createLead(l);
      setLeads(prev => [saved, ...prev]);
    } catch (error) {
      console.error("Failed to add lead:", error);
      alert("添加意向学员失败");
    }
  };

  const addCourse = async (c: Course) => {
    try {
      const saved = await api.createCourse(c);
      setCourses(prev => [saved, ...prev]);
    } catch (error) {
      console.error("Failed to add course:", error);
      alert("添加课程失败");
    }
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm('确定要删除这位学员吗？删除后无法恢复。')) return;
    try {
      await api.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("删除学员失败");
    }
  };

  const deleteCoach = async (id: string) => {
    if (!window.confirm('确定要删除这位教练吗？删除后无法恢复。')) return;
    try {
      await api.deleteCoach(id);
      setCoaches(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete coach:", error);
      alert("删除教练失败");
    }
  };

  const pageContent = useMemo(() => {
    switch (activeTab) {
      case NavItem.Dashboard:
        return (
          <Dashboard
            students={students}
            records={records}
            leads={leads}
            renewals={renewals}
            todos={todos}
            onTabChange={setActiveTab}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        );
      case NavItem.Students:
        return <Students students={students} onAddStudent={addStudent} onUpdateStudent={updateStudent} onDeleteStudent={deleteStudent} />;
      case NavItem.Leads:
        return <Leads leads={leads} onAddLead={addLead} onUpdateLead={updateLead} />;
      case NavItem.Courses:
        return <CoursesPage courses={courses} students={students} coaches={coaches} onAddCourse={addCourse} />;
      case NavItem.Records:
        return <Records records={records} students={students} coaches={coaches} courses={courses} onAddRecord={addRecord} />;
      case NavItem.Coaches:
        return <Coaches coaches={coaches} records={records} onAddCoach={addCoach} onDeleteCoach={deleteCoach} />;
      case NavItem.Renewals:
        return <Renewals renewals={renewals} students={students} onAddRenewal={addRenewal} />;
      default:
        return <Dashboard students={students} records={records} leads={leads} renewals={renewals} todos={todos} onTabChange={setActiveTab} onAddTodo={addTodo} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />;
    }
  }, [activeTab, students, coaches, leads, records, renewals, courses, todos]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar onLogout={handleLogout} username={currentUser} />
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {pageContent}
          </div>
        </main>
      </div>

      <SmartAssistant isOpen={isAssistantOpen} onClose={() => setAssistantOpen(false)} />

      {!isAssistantOpen && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-white"
          >
            <i className="ri-sparkling-fill text-2xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
