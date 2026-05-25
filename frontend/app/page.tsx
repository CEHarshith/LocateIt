"use client";

import { useState } from "react";
import Header from "../components/Header";
import UploadButton from "../components/UploadButton";
import LocationResults from "../components/LocationResults";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setPrediction(null);

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-2xl mx-auto w-full flex flex-col p-6 space-y-8">
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="test-black mb-6 text-6xl font-bold">
              Find your next trip.
            </h1>
            <p className="text-muted-foreground mb-10 text-xl">
              From famous landmarks to hidden corners of the world. Drop a photo. Discover the place.</p>
          </div>
        </section>
        <div className="w-full flex flex-col space-y-6 min-h-[320px]">
          <UploadButton 
            onUpload={handleUpload} 
            isLoading={isLoading} 
          />

          {imageUrl && (
            <div className="w-full bg-white p-4 rounded-xl shadow">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div className="w-full bg-white p-4 rounded-xl shadow min-h-[180px]">
          <LocationResults isLoading={isLoading} prediction={prediction} />
        </div>

      </main>
    </div>
  );
}