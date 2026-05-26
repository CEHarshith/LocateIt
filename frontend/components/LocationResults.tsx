"use client";

interface Result {
  landmark: string;
  confidence: number;
}

interface ResultCardProps {
  isLoading: boolean;
  prediction: Result[];
}

export default function ResultCard({ isLoading, prediction }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

  if (prediction.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">No result yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">Top Results</h3>
      {prediction.map((result, index) => (
        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-lg font-medium text-gray-800 capitalize">
            {result.landmark.replace(/_/g, " ")}
          </span>
          <span className="text-sm font-semibold text-green-600">
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}