
import React, { useState, useCallback } from 'react';
import { Button } from './ui/Button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept: string;
  buttonText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, accept, buttonText = "Upload File" }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = useCallback(() => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileUpload(file);
          return 100;
        }
        const newProgress = Math.min(oldProgress + Math.random() * 20, 100);
        return newProgress;
      });
    }, 200);
  }, [file, onFileUpload]);

  return (
    <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {!file && (
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a4 4 0 01-4 4H7z"></path></svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{accept}</p>
          </div>
        </label>
      )}

      {file && !isUploading && (
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Selected file:</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{file.name}</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button onClick={handleUpload}>{buttonText}</Button>
            <Button variant="secondary" onClick={() => setFile(null)}>Change file</Button>
          </div>
        </div>
      )}

      {isUploading && (
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-200">Uploading {file?.name}...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
};
