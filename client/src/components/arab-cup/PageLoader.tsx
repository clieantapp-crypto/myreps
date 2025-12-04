interface PageLoaderProps {
  isLoading: boolean;
}

export function PageLoader({ isLoading }: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#8A1538] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="FIFA Arab Cup"
            className="h-8 w-auto"
          />
        </div>
        <p className="text-gray-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
