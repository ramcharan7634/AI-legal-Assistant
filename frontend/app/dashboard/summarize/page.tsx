'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText, Copy, Check } from 'lucide-react';
import { summarizeApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);

  const summarizeMutation = useMutation({
    mutationFn: (text: string) => summarizeApi.summarize(text, 200, 50),
    onSuccess: (data) => {
      setSummary(data.data.summary);
      toast.success('Summary generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.userMessage || 'Summarization failed');
    },
  });

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    summarizeMutation.mutate(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Document Summarizer
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Enter Legal Text
          </h2>
          <form onSubmit={handleSummarize} className="space-y-4">
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input-field h-96 resize-none"
                placeholder="Paste your legal document here to summarize..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={summarizeMutation.isPending || !text.trim()}
              className="btn-primary w-full flex justify-center items-center"
            >
              {summarizeMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Generating Summary...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Summary
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Summary
            </h2>
            {summary && (
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center text-sm"
              >
                {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {summary ? (
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg h-96 overflow-y-auto">
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          ) : (
            <div className="text-center py-32 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter text and click generate to see summary</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
