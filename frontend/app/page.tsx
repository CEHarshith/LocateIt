"use client";
import { useState } from "react";
import Header from "../components/Header";
import UploadButton from "../components/UploadButton";
import LocationResults from "../components/LocationResults";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null); 

  const handleUploadComplete = (data: any) => {
    setPrediction(data);
    setIsLoading(false);
  };

  const handleStartUpload = () => {
    setIsLoading(true);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-2xl mx-auto w-full flex flex-col p-6 space-y-8">
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold">
              Find your next trip.
            </h1>
            <p className="text-muted-foreground mb-10 text-xl">
              From famous landmarks to hidden corners of the world. Drop a photo. Discover the place.
            </p>
          </div>
        </section>
        
        <div className="w-full flex flex-col space-y-6">
          <UploadButton 
            onUpload={handleUploadComplete} 
            onStart={handleStartUpload}
            isLoading={isLoading} 
          />
        </div>

        <div className="w-full bg-white p-4 rounded-xl shadow min-h-[180px]">
          <LocationResults isLoading={isLoading} prediction={prediction} />
        </div>
      </main>
    </div>
  );
}