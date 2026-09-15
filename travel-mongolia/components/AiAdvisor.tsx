'use client';

import { useState } from 'react';

export default function AiAdvisor({ destinationTitle }: { destinationTitle: string }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedQuestions = [
    `${destinationTitle} очиход хамгийн тохиромжтой улирал аль нь вэ?`,
    'Анх удаа ирж байгаа хүмүүс юу үзэх хэрэгтэй вэ?',
    'Ойр орчимд ямар амралтын газрууд байдаг вэ?',
  ];

  async function handleAsk(questionText: string) {
    if (!questionText.trim() || loading) return;

    const userMsg = questionText.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, destination: destinationTitle }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: 'Хариулт авахад алдаа гарлаа.' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Сүлжээний алдаа гарлаа.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#fdf4f5] rounded-2xl p-6 border border-red-100 flex flex-col shadow-sm">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-12 h-12 bg-[#15803d] rounded-full flex items-center justify-center mb-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-[#900014]">Аяллын зөвлөхөөс асуух</h4>
        <p className="text-[#900014] text-xs font-light mt-1">AI туслах танд туслахад бэлэн</p>
      </div>

      {/* Чат түүх */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1 text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl leading-relaxed ${
                m.role === 'user'
                  ? 'bg-red-200 text-red-950 ml-6 font-medium rounded-br-none'
                  : 'bg-white text-gray-800 mr-6 shadow-sm rounded-bl-none border border-red-100'
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="bg-white text-gray-400 p-3 rounded-xl mr-6 text-xs animate-pulse border border-red-50">
              Хариулт бэлтгэж байна...
            </div>
          )}
        </div>
      )}

      {/* Бэлэн санал болгох асуултууд */}
      {messages.length === 0 && (
        <div className="space-y-2.5 mb-4">
          {predefinedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className="w-full bg-[#fce6e8] hover:bg-[#fbd0d4] text-[#900014] text-xs font-medium p-3.5 rounded-xl text-left transition-colors leading-snug cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Асуулт бичих талбар */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(input);
        }}
        className="flex gap-2 mt-auto"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Өөр асуулт асуух..."
          disabled={loading}
          className="flex-1 bg-white border border-red-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#15803d] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#b80015] disabled:opacity-50 transition-colors cursor-pointer"
        >
          Илгээх
        </button>
      </form>
    </div>
  );
}