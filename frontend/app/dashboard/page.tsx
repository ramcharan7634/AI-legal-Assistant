'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Scale,
  Clock
} from 'lucide-react';
import { riskApi, documentApi, chatApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ['riskHistory'],
    queryFn: () => riskApi.getHistory().then(res => res.data),
  });

  const { data: documentData, isLoading: docLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.getHistory().then(res => res.data),
  });

  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatApi.getHistory().then(res => res.data),
  });

  const stats = [
    {
      name: 'Total Risk Analyses',
      value: riskData?.length || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      name: 'Documents Processed',
      value: documentData?.length || 0,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Chat Messages',
      value: chatData?.length || 0,
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      name: 'High Risk Cases',
      value: riskData?.filter((r: any) => r.risk_level === 'High').length || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to AI Legal Document Assistant
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Risk Analyses */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Risk Analyses
            </h2>
            {riskLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            ) : riskData?.length > 0 ? (
              <div className="space-y-3">
                {riskData.slice(0, 5).map((analysis: any) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Scale className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {analysis.clause.substring(0, 50)}...
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(analysis.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        analysis.risk_level === 'High'
                          ? 'bg-red-100 text-red-800'
                          : analysis.risk_level === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {analysis.risk_level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No risk analyses yet</p>
            )}
          </div>

          {/* Recent Documents */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Documents
            </h2>
            {docLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            ) : documentData?.length > 0 ? (
              <div className="space-y-3">
                {documentData.slice(0, 5).map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDateTime(doc.uploaded_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/risk"
              className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">Analyze Risk</p>
                <p className="text-sm text-gray-500">Check legal clause risk</p>
              </div>
            </a>
            <a
              href="/dashboard/upload"
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">Upload PDF</p>
                <p className="text-sm text-gray-500">Analyze legal documents</p>
              </div>
            </a>
            <a
              href="/dashboard/chat"
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">GenAI Chat</p>
                <p className="text-sm text-gray-500">Use the LLM for legal conversation.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
  );
}

