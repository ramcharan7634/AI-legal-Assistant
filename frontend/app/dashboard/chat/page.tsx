'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MessageSquare, Send, Trash2, User, Bot } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import DashboardLayout from '@/components/DashboardLayout';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatApi.getHistory().then(res => res.data),
  });

  const sendMutation = useMutation({
    mutationFn: (message: string) => chatApi.sendMessage(message),
    onSuccess: (data) => {
      setMessages(prev => [...prev, data.data]);
      setMessage('');
      toast.success('Message sent');
    },
    onError: (error: any) => {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    },
  });

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMutation.isPending) return;
    
    // Add user message immediately
    const userMsg = {
      id: Date.now(),
      message,
      response: '',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    sendMutation.mutate(message);
  };

  const clearHistoryMutation = useMutation({
    mutationFn: () => chatApi.clearHistory(),
    onSuccess: () => {
      setMessages([]);
      toast.success('Chat history cleared');
    },
    onError: (error: any) => {
      toast.error(error instanceof Error ? error.message : 'Failed to clear history');
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              GenAI LLM Legal Chat Assistant
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Powered by an LLM-based generative legal assistant using google/flan-t5-base.
            </p>
          </div>
          <button
            onClick={() => clearHistoryMutation.mutate()}
            className="btn-secondary flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2 card p-0">
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Welcome to GenAI Legal Chat</p>
                <p className="text-sm mt-2">Ask the LLM for legal guidance and contract help.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="space-y-2">
                    {/* User Message */}
                    <div className="flex items-start justify-end">
                      <div className="bg-primary-600 text-white p-3 rounded-lg max-w-md">
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-xs font-medium">You</span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                    
                    {/* Bot Response */}
                    {msg.response && (
                      <div className="flex items-start justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-md">
                          <div className="flex items-center mb-1">
                            <Bot className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="text-xs font-medium">Legal AI</span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white">{msg.response}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {sendMutation.isPending && (
                <div className="flex items-start justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-primary-600" />
                      <span className="text-xs font-medium">Legal AI</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a legal question..."
                  className="input-field flex-1"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sendMutation.isPending}
                  className="btn-primary px-4"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Example Questions
            </h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setMessage("What should be in a rental agreement?")}
                className="w-full text-left p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                What should be in a rental agreement?
              </button>
              <button
                onClick={() => setMessage("What is the difference between an NDA and a confidentiality agreement?")}
                className="w-full text-left p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                What is the difference between NDA and confidentiality agreement?
              </button>
              <button
                onClick={() => setMessage("What are the key clauses in a contract?")}
                className="w-full text-left p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                What are the key clauses in a contract?
              </button>
              <button
                onClick={() => setMessage("How do I terminate a contract legally?")}
                className="w-full text-left p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                How do I terminate a contract legally?
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
