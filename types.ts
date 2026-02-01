
export enum NavItem {
  Dashboard = 'dashboard',
  Students = 'students',
  Leads = 'leads',
  Courses = 'courses',
  Records = 'records',
  Coaches = 'coaches',
  Renewals = 'renewals'
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface FollowUpRecord {
  id: string;
  time: string;
  method: '电话' | '微信' | '到店';
  content: string;
  feedback: string;
  status: LeadStatus;
  nextFollowUp: string;
}

export type LeadStatus = '待联系' | '已试听' | '已报价' | '已签约' | '已流失';

export interface Lead {
  id: string;
  name: string;
  age: number;
  phone: string;
  wechat: string;
  courseType: string;
  source: '地推' | '转介绍' | '线上咨询' | '其他';
  intention: '高' | '中' | '低';
  status: LeadStatus;
  nextFollowUp: string;
  budget: string;
  sportsFoundation: '零基础' | '有基础' | '专业级';
  expectedTime: string;
  history: FollowUpRecord[];
}

export interface Coach {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: '男' | '女';
  rating: number;
  phone: string;
  title: string;
  specialty: string;
  experience: number;
  currentCourses: number;
  studentCount: number;
  monthlyClasses: number;
  monthlyHours: number;
  themeColor: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  gender: '男' | '女';
  age: number;
  parent: string;
  phone: string;
  level: '初级' | '中级' | '高级';
  courseName: '精品小班课' | '竞训课' | '成人一对一';
  remainingTimes: number;
  totalTimes: number;
  joinDate: string;
  status: '在训' | '停训';
}

export interface Course {
  id: string;
  name: string;
  level: '初级' | '中级' | '高级' | '不限';
  coach: string;
  schedule: string;
  location: string;
  enrollment: string;
  capacity: number;
  progress: number;
  fee: number;
  status: '进行中' | '未开始' | '已结束';
  themeGradient: string;
  studentNames?: string[];
}

export interface Record {
  id: string;
  studentName: string;
  courseName: string;
  coach: string;
  date: string;
  time: string;
  times: number;
  attendance: '出勤' | '请假' | '缺勤';
  performance: '良好' | '优秀' | '一般' | '-';
  status: '已完成' | '进行中';
}

export interface Renewal {
  id: string;
  studentName: string;
  courseName: string;
  amount: number;
  times: number;
  startDate: string;
  endDate: string;
  payment: string;
  status: '已完成' | '待审核';
}
