'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Search, Tag, FileText, Copy, Check } from 'lucide-react';
import { entityApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

export default function EntitiesPage() {
  const [text, setText] = useState('');
  const [entities, setEntities] = useState<any>(null);
  const [keyTerms, setKeyTerms] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const extractMutation = useMutation({
    mutationFn: (text: string) => entityApi.extract(text),
    onSuccess: (data) => {
      setEntities(data.data);
      toast.success('Entities extracted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.userMessage || 'Extraction failed');
    },
  });

  const termsMutation = useMutation({
    mutationFn: (text: string) => entityApi.getKeyTerms(text),
    onSuccess: (data) => {
      setKeyTerms(data.data.terms || []);
    },
    onError: (error: any) => {
      toast.error(error.userMessage || 'Failed to extract key terms');
    },
  });

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    extractMutation.mutate(text);
    termsMutation.mutate(text);
  };

  const handleCopy = () => {
    const content = JSON.stringify(entities, null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Entity Extraction
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enter Legal Text
            </h2>
            <form onSubmit={handleExtract} className="space-y-4">
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input-field h-64 resize-none"
                  placeholder="Paste your legal document here to extract entities and key terms..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={extractMutation.isPending || !text.trim()}
                className="btn-primary w-full flex justify-center items-center"
              >
                {extractMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Extracting...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Extract Entities
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Key Terms */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Key Terms
                </h2>
              </div>
              {keyTerms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {keyTerms.map((term, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Tag className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Extract entities to see key terms</p>
                </div>
              )}
            </div>

            {/* Entities */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Extracted Entities
                </h2>
                {entities && (
                  <button
                    onClick={handleCopy}
                    className="btn-secondary flex items-center text-sm"
                  >
                    {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              {entities ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {Object.entries(entities).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white dark:bg-gray-600 text-gray-900 dark:text-white rounded text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">
                          {JSON.stringify(value)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Extract entities to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

