"use client";
import { useState } from "react";
import DragAndDropZone from "./DragAndDropZone";

interface UploadButtonProps {
  onUpload: (results: any) => void;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelected = (file: File) => {
    setError(null);
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setError("Please select a valid image file.");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onUpload(data);
      } else {
        setError(data.message || "Error processing image on server.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the backend. Is FastAPI running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl min-h-[220px] p-6 bg-white shadow-sm flex flex-col items-center justify-center space-y-6">
      <DragAndDropZone onFileSelected={handleFileSelected} />

      {error && <p className="text-red-500 font-bold">{error}</p>}

      {previewUrl && !error && (
        <div className="w-full flex flex-col items-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded-lg mb-2 border"
          />
          <p className="text-xl font-medium text-gray-700">{selectedFile?.name}</p>
        </div>
      )}

      <button
        onClick={handleUploadClick}
        disabled={!selectedFile || isLoading || !!error}
        className="w-full py-4 text-xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
      >
        {isLoading ? "Analysing..." : "Upload & Search"}
      </button>
    </div>
  );
}