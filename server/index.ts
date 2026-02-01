
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Debug route for environment variables (safe version)
app.get('/api/debug', (req, res) => {
    res.json({
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_ANON_KEY,
        env: process.env.NODE_ENV,
        urlPrefix: req.url
    });
});

// --- Routes (Initial placeholders based on requirements) ---

// Get all students
app.get('/api/students', async (req, res) => {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create student
app.post('/api/students', async (req, res) => {
    const { data, error } = await supabase.from('students').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted' });
});

// Get all coaches
app.get('/api/coaches', async (req, res) => {
    const { data, error } = await supabase.from('coaches').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create coach
app.post('/api/coaches', async (req, res) => {
    const { data, error } = await supabase.from('coaches').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete coach
app.delete('/api/coaches/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('coaches').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted' });
});

// Get all courses
app.get('/api/courses', async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create course
app.post('/api/courses', async (req, res) => {
    const { data, error } = await supabase.from('courses').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get all leads
app.get('/api/leads', async (req, res) => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create lead
app.post('/api/leads', async (req, res) => {
    const { data, error } = await supabase.from('leads').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get all records
app.get('/api/records', async (req, res) => {
    const { data, error } = await supabase.from('records').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create record
app.post('/api/records', async (req, res) => {
    // Note: This endpoint handles singular record creation in the frontend usually, but if array is passed, need to handle.
    // Frontend sends array for batch, or single? Let's assume single or check logic.
    // Frontend `addRecord` receives Record[].
    const { data, error } = await supabase.from('records').insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get all renewals
app.get('/api/renewals', async (req, res) => {
    const { data, error } = await supabase.from('renewals').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create renewal
app.post('/api/renewals', async (req, res) => {
    const { data, error } = await supabase.from('renewals').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get all todos
app.get('/api/todos', async (req, res) => {
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create todo
app.post('/api/todos', async (req, res) => {
    const { data, error } = await supabase.from('todos').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update todo (toggle)
app.patch('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').update(req.body).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
