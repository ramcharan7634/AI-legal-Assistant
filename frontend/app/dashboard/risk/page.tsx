'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, TrendingUp, Clock, Save } from 'lucide-react';
import { riskApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RiskAnalyzerPage() {
  const [clause, setClause] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyzeMutation = useMutation({
    mutationFn: (clause: string) => riskApi.analyze(clause),
    onSuccess: (data) => {
      setResult(data.data);
      toast.success('Risk analysis complete!');
    },
    onError: (error: any) => {
      toast.error(error.userMessage || 'Analysis failed');
    },
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ['riskHistory'],
    queryFn: () => riskApi.getHistory().then(res => res.data),
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clause.trim()) return;
    analyzeMutation.mutate(clause);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Legal Risk Analyzer
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analyze Legal Clause
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Legal Clause
              </label>
              <textarea
                value={clause}
                onChange={(e) => setClause(e.target.value)}
                className="input-field h-40 resize-none"
                placeholder="Paste your legal clause here to analyze risk level..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={analyzeMutation.isPending || !clause.trim()}
              className="btn-primary w-full flex justify-center items-center"
            >
              {analyzeMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Analyze Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analysis Result
          </h2>
          {result ? (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${getRiskColor(result.risk_level)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">Risk Level</span>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{result.risk_level}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Confidence Score</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {(result.confidence_score * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Analyzed At</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDateTime(result.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter a legal clause and click analyze to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analysis History
        </h2>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        ) : history?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3">Clause</th>
                  <th className="pb-3">Risk Level</th>
                  <th className="pb-3">Confidence</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {item.clause}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(item.risk_level)}`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {(item.confidence_score * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDateTime(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No analysis history yet</p>
        )}
      </div>
    </div>
  );
}
