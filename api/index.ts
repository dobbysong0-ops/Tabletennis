
import { Student, Coach, Course, Lead, Record, Renewal, Todo } from '../types';

const API_URL = 'http://localhost:3000/api';

export const api = {
    getStudents: async (): Promise<Student[]> => {
        const res = await fetch(`${API_URL}/students`);
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
    },

    getCoaches: async (): Promise<Coach[]> => {
        const res = await fetch(`${API_URL}/coaches`);
        if (!res.ok) throw new Error('Failed to fetch coaches');
        return res.json();
    },

    getCourses: async (): Promise<Course[]> => {
        const res = await fetch(`${API_URL}/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
    },

    getLeads: async (): Promise<Lead[]> => {
        const res = await fetch(`${API_URL}/leads`);
        if (!res.ok) throw new Error('Failed to fetch leads');
        return res.json();
    },

    getRecords: async (): Promise<Record[]> => {
        const res = await fetch(`${API_URL}/records`);
        if (!res.ok) throw new Error('Failed to fetch records');
        return res.json();
    },

    getRenewals: async (): Promise<Renewal[]> => {
        const res = await fetch(`${API_URL}/renewals`);
        if (!res.ok) throw new Error('Failed to fetch renewals');
        return res.json();
    },

    getTodos: async (): Promise<Todo[]> => {
        const res = await fetch(`${API_URL}/todos`);
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
    },

    // --- Create Methods ---

    createStudent: async (student: Student): Promise<Student> => {
        const res = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        });
        if (!res.ok) throw new Error('Failed to create student');
        return res.json();
    },

    createCoach: async (coach: Coach): Promise<Coach> => {
        const res = await fetch(`${API_URL}/coaches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(coach),
        });
        if (!res.ok) throw new Error('Failed to create coach');
        return res.json();
    },

    createCourse: async (course: Course): Promise<Course> => {
        const res = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
        });
        if (!res.ok) throw new Error('Failed to create course');
        return res.json();
    },

    createLead: async (lead: Lead): Promise<Lead> => {
        const res = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
        });
        if (!res.ok) throw new Error('Failed to create lead');
        return res.json();
    },

    createRecords: async (records: Record[]): Promise<Record[]> => {
        const res = await fetch(`${API_URL}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(records),
        });
        if (!res.ok) throw new Error('Failed to create records');
        return res.json();
    },

    createRenewal: async (renewal: Renewal): Promise<Renewal> => {
        const res = await fetch(`${API_URL}/renewals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(renewal),
        });
        if (!res.ok) throw new Error('Failed to create renewal');
        return res.json();
    },

    createTodo: async (todo: Todo): Promise<Todo> => {
        const res = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error('Failed to create todo');
        return res.json();
    },

    toggleTodo: async (id: string, completed: boolean): Promise<Todo> => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed }),
        });
        if (!res.ok) throw new Error('Failed to update todo');
        return res.json();
    },

    deleteTodo: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete todo');
    },

    deleteStudent: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete student');
    },

    deleteCoach: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/coaches/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete coach');
    }
};
