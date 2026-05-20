"use client";

interface ResultCardProps {
  isLoading: boolean;
  prediction: string | null;
}

export default function ResultCard({ isLoading, prediction }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">No result yet</span>
      </div>
    );
  }

  return (
    <div className="min-h-[80px] flex items-center justify-center">
      <h3 className="text-2xl font-semibold text-green-700">{prediction}</h3>
    </div>
  );
}