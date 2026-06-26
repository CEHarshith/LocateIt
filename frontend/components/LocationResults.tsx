"use client";

interface Result {
  landmark_id: number;
  landmark_name: string;

  confidence: number;
}

interface ResultCardProps {
  isLoading: boolean;
  prediction: { results: Result[] } | null;

}

export default function ResultCard({ isLoading, prediction }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!prediction || !prediction.results) {

    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">No match found</span>
      </div>
    );
  }

  return (
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

        </div>
      ))}
    </div>
  );
}