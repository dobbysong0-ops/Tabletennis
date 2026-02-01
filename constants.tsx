
import { Coach, Student, Course, Lead, Record, Renewal } from './types';

export const COACHES: Coach[] = [
  {
    id: 'coach001',
    name: '李教练',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20male%20table%20tennis%20coach%20in%20sports%20attire&width=100&height=100&seq=c1',
    age: 35,
    gender: '男',
    rating: 4.8,
    phone: '13700137001',
    title: '国家一级教练员',
    specialty: '初级教学、基础技术',
    experience: 10,
    currentCourses: 2,
    studentCount: 25,
    monthlyClasses: 18,
    monthlyHours: 27,
    themeColor: 'teal'
  }
];

export const STUDENTS: Student[] = [
  {
    id: 'S001',
    name: '张小明',
    avatar: 'https://readdy.ai/api/search-image?query=young%20asian%20boy%20student%20portrait&width=40&height=40&seq=s1',
    gender: '男',
    age: 12,
    parent: '张建国',
    phone: '13900139001',
    level: '初级',
    courseName: '精品小班课',
    remainingTimes: 20,
    totalTimes: 40,
    joinDate: '2024-01-15',
    status: '在训'
  },
  {
    id: 'S002',
    name: '王大锤',
    avatar: 'https://readdy.ai/api/search-image?query=asian%20man%20sports%20portrait&width=40&height=40&seq=s2',
    gender: '男',
    age: 28,
    parent: '-',
    phone: '13900139999',
    level: '中级',
    courseName: '成人一对一',
    remainingTimes: 3,
    totalTimes: 24,
    joinDate: '2024-02-10',
    status: '在训'
  }
];

export const COURSES: Course[] = [
  {
    id: 'C001',
    name: '精品小班课',
    level: '初级',
    coach: '李教练',
    schedule: '周一、周三 16:00-17:30',
    location: '训练馆A区',
    enrollment: '10/12',
    capacity: 12,
    progress: 83,
    fee: 2400,
    status: '进行中',
    themeGradient: 'from-teal-500 to-cyan-500',
    studentNames: ['张小明', '王大锤', '李雷', '韩梅梅']
  }
];

export const LEADS: Lead[] = [
  {
    id: 'L001',
    name: '王小明',
    age: 10,
    phone: '13812345678',
    wechat: 'wxm_2024',
    courseType: '少儿精品班',
    source: '转介绍',
    intention: '高',
    status: '已试听',
    nextFollowUp: '2024-04-20',
    budget: '5000-8000元',
    sportsFoundation: '零基础',
    expectedTime: '周末下午',
    history: [
      {
        id: 'H001',
        time: '2024-04-10',
        method: '电话',
        content: '沟通试听意向',
        feedback: '家长非常感兴趣',
        status: '待联系',
        nextFollowUp: '2024-04-12'
      },
      {
        id: 'H002',
        time: '2024-04-12',
        method: '到店',
        content: '完成试听课',
        feedback: '孩子反馈很好，控球有潜力',
        status: '已试听',
        nextFollowUp: '2024-04-20'
      }
    ]
  }
];

export const RECORDS: Record[] = [
  {
    id: 'R001',
    studentName: '张小明',
    courseName: '精品小班课',
    coach: '李教练',
    date: '2024-03-18',
    time: '16:00-17:30',
    times: 1,
    attendance: '出勤',
    performance: '良好',
    status: '已完成'
  }
];

export const RENEWALS: Renewal[] = [
  {
    id: 'RN001',
    studentName: '张小明',
    courseName: '精品小班课',
    amount: 1200,
    times: 20,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    payment: '微信支付',
    status: '已完成'
  }
];
