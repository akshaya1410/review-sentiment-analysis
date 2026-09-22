import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUploader({ onFileUpload, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please select a valid .csv file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 10MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-bold text-white mb-2">Upload CSV Dataset for Batch Prediction</h3>
      <p className="text-xs text-gray-400 mb-4">
        The uploaded CSV must contain a column header named <span className="text-indigo-400 font-mono font-bold">review</span>.
      </p>

      <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
        <div
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : selectedFile
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-cinema-700/80 hover:border-cinema-600 bg-cinema-900/60'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
            id="csv-file-input"
          />

          <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
            {selectedFile ? (
              <>
                <FileText className="w-12 h-12 text-emerald-400 mb-3" />
                <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <span className="mt-3 text-xs px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> CSV File Ready
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-indigo-400 mb-3 animate-bounce" />
                <p className="text-sm font-semibold text-gray-200">
                  Drag & drop your review CSV file here, or <span className="text-indigo-400 underline">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">Supports CSV files up to 10MB</p>
              </>
            )}
          </label>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-400 flex items-center gap-1.5 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className="glass-button bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 px-6 py-2.5 text-sm"
          >
            {isLoading ? 'Processing CSV Batch...' : 'Process Batch Predictions'}
          </button>
        </div>
      </form>
    </div>
  );
}
