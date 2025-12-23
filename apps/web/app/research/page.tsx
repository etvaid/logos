'use client';
import React, { useState } from 'react';

export default function Research() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      content: "What are the major themes in Homer's Odyssey?"
    },
    {
      id: 2,
      type: 'assistant',
      content: "Homer's Odyssey explores several profound themes that continue to resonate today:\n\n**1. The Hero's Journey and Nostos (Homecoming)**\nThe epic follows Odysseus's ten-year struggle to return home after the Trojan War, representing the universal human desire for belonging and identity.\n\n**2. Hospitality (Xenia)**\nThe ancient Greek concept of hospitality is central to the narrative, showing both its sacred importance and the consequences of violating it.\n\n**3. Divine Intervention vs. Human Agency**\nThe tension between fate controlled by gods and human free will drives much of the plot's complexity.\n\n**4. Loyalty and Fidelity**\nExemplified through Penelope's faithfulness and the loyalty of servants like Eumaeus during Odysseus's absence.",
      citations: [
        "Homer. The Odyssey. Translated by Robert Fagles. Penguin Classics, 1996.",
        "Clarke, Howard W. The Art of the Odyssey. Bristol Classical Press, 1989.",
        "Schein, Seth L. Reading the Odyssey: Selected Interpretive Essays. Princeton University Press, 1996."
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');

  const suggestedPrompts = [
    "Analyze the symbolism in Dante's Divine Comedy",
    "Compare Shakespearean and Petrarchan sonnets",
    "Explain the philosophical implications of quantum mechanics"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: inputValue
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleNewResearch = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0D0D0F]/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F5F4F2] mb-1">Research Assistant</h1>
              <p className="text-gray-400 text-sm">AI-powered academic research and analysis</p>
            </div>
            <button
              onClick={handleNewResearch}
              className="px-4 py-2 bg-[#C9A227] text-[#0D0D0F] rounded-lg font-medium hover:bg-[#D4B332] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              New Research
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Suggested Prompts */}
        {messages.length === 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#F5F4F2] mb-4">Suggested Research Topics</h3>
            <div className="grid gap-3">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#C9A227]/50 hover:bg-gray-800/50 transition-all duration-300 group"
                >
                  <span className="text-[#F5F4F2] group-hover:text-[#C9A227] transition-colors duration-200">
                    {prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-6 mb-8">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.type === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-3xl bg-[#C9A227] text-[#0D0D0F] p-4 rounded-2xl rounded-br-md">
                    <p className="font-medium">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-w-3xl bg-gray-900/60 p-6 rounded-2xl rounded-bl-md border border-gray-800">
                    <div className="prose prose-invert max-w-none">
                      {message.content.split('\n\n').map((paragraph, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          {paragraph.startsWith('**') ? (
                            <div className="space-y-2">
                              {paragraph.split('\n').map((line, lineIndex) => (
                                <p key={lineIndex} className="text-[#F5F4F2] leading-relaxed">
                                  {line.includes('**') ? (
                                    line.split('**').map((part, partIndex) => (
                                      partIndex % 2 === 1 ? (
                                        <span key={partIndex} className="font-semibold text-[#C9A227]">
                                          {part}
                                        </span>
                                      ) : (
                                        <span key={partIndex}>{part}</span>
                                      )
                                    ))
                                  ) : (
                                    line
                                  )}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[#F5F4F2] leading-relaxed">{paragraph}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Citations */}
                  {message.citations && (
                    <div className="max-w-3xl ml-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800">
                      <h4 className="font-semibold text-[#C9A227] mb-3 text-sm uppercase tracking-wider">Citations</h4>
                      <div className="space-y-2">
                        {message.citations.map((citation, index) => (
                          <p key={index} className="text-sm text-gray-300 leading-relaxed">
                            [{index + 1}] {citation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-6">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl">
            <div className="flex items-end gap-4 p-4">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a research question..."
                  className="w-full bg-transparent text-[#F5F4F2] placeholder-gray-500 resize-none focus:outline-none text-base leading-relaxed max-h-32"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-6 py-2 bg-[#C9A227] text-[#0D0D0F] rounded-xl font-medium hover:bg-[#D4B332] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}