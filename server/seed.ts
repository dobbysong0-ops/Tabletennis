
import { supabase } from './db';

// Mock data to seed
const STUDENTS = [
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

const COACHES = [
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

const COURSES = [
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
        studentNames: ['张小明', '王大锤', '李雷', '韩梅梅'] // Note: arrays in PG are fine, or use jsonb
    }
];

const TODOS = [
    { id: '1', text: '回访周一试听课王同学家长', completed: false, createdAt: '2024-03-20' },
    { id: '2', text: '检查A区训练器材损耗情况', completed: true, createdAt: '2024-03-19' }
];

async function seed() {
    console.log('Seeding Database...');

    // Seed Students
    const { error: studentError } = await supabase.from('students').upsert(STUDENTS);
    if (studentError) console.error('Error seeding students:', studentError);
    else console.log('Seeded Students');

    // Seed Coaches
    const { error: coachError } = await supabase.from('coaches').upsert(COACHES);
    if (coachError) console.error('Error seeding coaches:', coachError);
    else console.log('Seeded Coaches');

    // Seed Courses
    const { error: courseError } = await supabase.from('courses').upsert(COURSES);
    if (courseError) console.error('Error seeding courses:', courseError);
    else console.log('Seeded Courses');

    // Seed Todos
    const { error: todoError } = await supabase.from('todos').upsert(TODOS);
    if (todoError) console.error('Error seeding todos:', todoError);
    else console.log('Seeded Todos');

    // Add more seeding logic for Leads, Records, Renewals as needed...

    console.log('Seeding completed (partial).');
}

seed();
