
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

interface SmartAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: '您好！我是您的永晟乒乓运营助手。我可以帮您分析学员进度、生成营销话术或提供训练建议。有什么我可以帮您的吗？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `你是一个专业的乒乓球培训机构管理助手。你的名字是"永晟乒乓智能助手"。
          你的职责包括：
          1. 根据学员基础（初级、中级、高级）提供针对性的教学建议。
          2. 帮助生成吸引家长的营销文案或跟进话术。
          3. 分析经营数据并提供优化建议。
          4. 回答关于乒乓球技术和战术的问题。
          始终保持专业、友好、且充满活力的语气。回复请使用中文。`,
        }
      });

      const aiText = response.text || '抱歉，我暂时无法处理您的请求。';
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: '连接 AI 助手时出错，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 bg-gradient-to-tr from-gray-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <i className="ri-sparkling-fill text-xl"></i>
            </div>
            <div>
              <p className="font-bold text-lg leading-none">智能助手</p>
              <p className="text-[10px] text-white/60 mt-1 uppercase tracking-widest font-bold">AI Business Partner</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 flex gap-2">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="询问建议、生成话术或分析数据..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none transition-all"
              rows={2}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">由 Google Gemini 提供动力支撑</p>
        </div>
      </div>
    </div>
  );
};

export default SmartAssistant;
