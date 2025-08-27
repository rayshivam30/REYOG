'use client';

import { FileText, ImageIcon, Download } from "lucide-react";
import { useState } from "react";

interface AttachmentItemProps {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
}

export function AttachmentItem({ id, url, filename, type, size }: AttachmentItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fileType = type.split('/')[0];
  const isImage = fileType === 'image' || type.includes('image/');
  const isPdf = type === 'application/pdf';
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/api/download?id=${id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="group flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex-shrink-0 p-2 bg-gray-100 rounded-md cursor-pointer"
        onClick={handleView}
      >
        {isImage ? (
          <ImageIcon className="h-6 w-6 text-gray-500" />
        ) : isPdf ? (
          <FileText className="h-6 w-6 text-red-500" />
        ) : (
          <FileText className="h-6 w-6 text-gray-500" />
        )}
      </div>
      <div 
        className="ml-3 flex-1 min-w-0 cursor-pointer"
        onClick={handleView}
      >
        <p className="text-sm font-medium text-gray-900 truncate">
          {filename}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(size)} • {type}
        </p>
      </div>
      <div className={`flex space-x-2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        <button
          onClick={handleView}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
          title="View file in new tab"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <button
          onClick={handleDownload}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
          title="Download file"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
