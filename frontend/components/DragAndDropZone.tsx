"use client";

import { useState, useRef } from "react";

interface DragDropZoneProps {
  onFileSelected: (file: File) => void;
}

export default function DragDropZone({ onFileSelected }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      onFileSelected(file);
    } else {
      alert("Please upload an image file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center space-y-3
        ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"}
      `}
    >
      <p className="text-gray-600 font-medium text-lg">
        {isDragging ? "Drop the image here" : "Click or drag & drop an image"}
      </p>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
}