"use client";

interface Result {
<<<<<<< HEAD
  landmark: string;
=======
  landmark_id: number;
  landmark_name: string;
>>>>>>> 4ea9057 (full working ML pipeline)
  confidence: number;
}

interface ResultCardProps {
  isLoading: boolean;
<<<<<<< HEAD
  prediction: Result[];
=======
  prediction: { results: Result[] } | null;
>>>>>>> 4ea9057 (full working ML pipeline)
}

export default function ResultCard({ isLoading, prediction }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

<<<<<<< HEAD
  if (prediction.length === 0) {
=======
  if (!prediction || !prediction.results) {
>>>>>>> 4ea9057 (full working ML pipeline)
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">No match found</span>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="flex flex-col gap-3">
      {prediction.results.map((result, index) => (
        <div
          key={result.landmark_id}
          className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-medium w-4">#{index + 1}</span>
            <h3 className="text-lg font-semibold text-green-700">
              {result.landmark_name}
            </h3>
          </div>
          <p className="text-gray-500 text-sm">
            {(result.confidence * 100).toFixed(1)}%
          </p>
>>>>>>> 4ea9057 (full working ML pipeline)
        </div>
      ))}
    </div>
  );
}