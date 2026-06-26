"use client";
import { useState } from "react";
import UploadButton from "../components/UploadButton";
import ResultCard from "../components/LocationResults";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{landmark: string, confidence: number}[]>([]);
=======
  const [prediction, setPrediction] = useState<any>(null); 
>>>>>>> 4ea9057 (full working ML pipeline)

  const handleUploadComplete = (data: any) => {
    setPrediction(data);
    setIsLoading(false);
  };

  const handleStartUpload = () => {
    setIsLoading(true);
<<<<<<< HEAD
    setPrediction([]);

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8000/search", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to get prediction");
        }

        const data = await response.json();
        setPrediction(data.results); // update this once ML returns real results
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
=======
    setPrediction(null);
>>>>>>> 4ea9057 (full working ML pipeline)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <ResultCard isLoading={isLoading} prediction={prediction} />
        </div>
      </main>
    </div>
  );
}