'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FilePlus, Copy, Check, FileText } from 'lucide-react';
import { generatorApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

type DocumentType = 'rental' | 'nda';

export default function GeneratorPage() {
  const [documentType, setDocumentType] = useState<DocumentType>('rental');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [copied, setCopied] = useState(false);

  // Rental Agreement Fields
  const [rentalData, setRentalData] = useState({
    landlord_name: '',
    tenant_name: '',
    property_address: '',
    rent_amount: '',
    security_deposit: '',
    duration_months: '12',
    start_date: '',
  });

  // NDA Fields
  const [ndaData, setNdaData] = useState({
    disclosing_party: '',
    receiving_party: '',
    purpose: '',
    duration_years: '2',
    effective_date: '',
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (documentType === 'rental') {
        return generatorApi.generateRentalAgreement({
          ...rentalData,
          rent_amount: parseFloat(rentalData.rent_amount),
          security_deposit: parseFloat(rentalData.security_deposit),
          duration_months: parseInt(rentalData.duration_months),
        });
      } else {
        return generatorApi.generateNDA({
          ...ndaData,
          duration_years: parseInt(ndaData.duration_years),
        });
      }
    },
    onSuccess: (data) => {
      setGeneratedDocument(data.data.document);
      toast.success('Document generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.userMessage || 'Generation failed');
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Legal Document Generator
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Generate Document
            </h2>

            {/* Document Type Selector */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setDocumentType('rental')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  documentType === 'rental'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Rental Agreement
              </button>
              <button
                onClick={() => setDocumentType('nda')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  documentType === 'nda'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                NDA
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {documentType === 'rental' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Landlord Name
                      </label>
                      <input
                        type="text"
                        value={rentalData.landlord_name}
                        onChange={(e) => setRentalData({...rentalData, landlord_name: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tenant Name
                      </label>
                      <input
                        type="text"
                        value={rentalData.tenant_name}
                        onChange={(e) => setRentalData({...rentalData, tenant_name: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Property Address
                    </label>
                    <input
                      type="text"
                      value={rentalData.property_address}
                      onChange={(e) => setRentalData({...rentalData, property_address: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Monthly Rent ($)
                      </label>
                      <input
                        type="number"
                        value={rentalData.rent_amount}
                        onChange={(e) => setRentalData({...rentalData, rent_amount: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Security Deposit ($)
                      </label>
                      <input
                        type="number"
                        value={rentalData.security_deposit}
                        onChange={(e) => setRentalData({...rentalData, security_deposit: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration (months)
                      </label>
                      <input
                        type="number"
                        value={rentalData.duration_months}
                        onChange={(e) => setRentalData({...rentalData, duration_months: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={rentalData.start_date}
                        onChange={(e) => setRentalData({...rentalData, start_date: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Disclosing Party
                      </label>
                      <input
                        type="text"
                        value={ndaData.disclosing_party}
                        onChange={(e) => setNdaData({...ndaData, disclosing_party: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Receiving Party
                      </label>
                      <input
                        type="text"
                        value={ndaData.receiving_party}
                        onChange={(e) => setNdaData({...ndaData, receiving_party: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Purpose
                    </label>
                    <textarea
                      value={ndaData.purpose}
                      onChange={(e) => setNdaData({...ndaData, purpose: e.target.value})}
                      className="input-field h-24"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration (years)
                      </label>
                      <input
                        type="number"
                        value={ndaData.duration_years}
                        onChange={(e) => setNdaData({...ndaData, duration_years: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Effective Date
                      </label>
                      <input
                        type="date"
                        value={ndaData.effective_date}
                        onChange={(e) => setNdaData({...ndaData, effective_date: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={generateMutation.isPending}
                className="btn-primary w-full flex justify-center items-center"
              >
                {generateMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <FilePlus className="mr-2 h-5 w-5" />
                    Generate Document
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Output */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Document
              </h2>
              {generatedDocument && (
                <button
                  onClick={handleCopy}
                  className="btn-secondary flex items-center text-sm"
                >
                  {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            {generatedDocument ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-[500px] overflow-y-auto">
                <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">
                  {generatedDocument}
                </pre>
              </div>
            ) : (
              <div className="text-center py-32 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the details and click generate to see your document</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
