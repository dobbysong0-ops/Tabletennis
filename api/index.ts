
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Supabase (直接从环境变量读取)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 诊断接口 ---
app.get('/api/debug', (req, res) => {
    res.json({
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_ANON_KEY,
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Vercel Serverless Function is running' });
});

// --- 业务接口 (直接连接数据库) ---

app.get('/api/students', async (req, res) => {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/students', async (req, res) => {
    const { data, error } = await supabase.from('students').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted' });
});

app.get('/api/coaches', async (req, res) => {
    const { data, error } = await supabase.from('coaches').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/coaches', async (req, res) => {
    const { data, error } = await supabase.from('coaches').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.delete('/api/coaches/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('coaches').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted' });
});

app.get('/api/courses', async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/courses', async (req, res) => {
    const { data, error } = await supabase.from('courses').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/leads', async (req, res) => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/leads', async (req, res) => {
    const { data, error } = await supabase.from('leads').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/records', async (req, res) => {
    const { data, error } = await supabase.from('records').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/records', async (req, res) => {
    const { data, error } = await supabase.from('records').insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/renewals', async (req, res) => {
    const { data, error } = await supabase.from('renewals').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/renewals', async (req, res) => {
    const { data, error } = await supabase.from('renewals').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/todos', async (req, res) => {
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/todos', async (req, res) => {
    const { data, error } = await supabase.from('todos').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.patch('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').update(req.body).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted' });
});

export default app;
