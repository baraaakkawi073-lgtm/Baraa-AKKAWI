
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getReligiousAnswer } from '../services/geminiService';
import { SendIcon, MessageCircleIcon } from './icons';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'السلام عليكم، كيف يمكنني مساعدتك في أمور دينك اليوم؟',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelResponse = await getReligiousAnswer(input);
    setMessages((prev) => [...prev, modelResponse]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <header className="bg-white p-4 text-center shadow-sm">
        <MessageCircleIcon className="mx-auto h-8 w-8 text-teal-600"/>
        <h1 className="text-2xl font-bold text-teal-800">المساعد الفقهي</h1>
        <p className="text-sm text-gray-500">مدعوم بـ Gemini | يستخدم مصادر موثوقة من الويب</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl p-4 ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : msg.role === 'system' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 border-t pt-2">
                  <h4 className="text-xs font-bold mb-1">المصادر:</h4>
                  <ul className="space-y-1">
                    {msg.sources.map((source, i) => (
                      <li key={i}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl p-4 rounded-bl-none animate-pulse">
                    يكتب...
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عن أمور دينك..."
            className="flex-1 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-6 h-6"/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiAssistant;