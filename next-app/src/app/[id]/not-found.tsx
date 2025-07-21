export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
      <p className="text-gray-600 mb-4">
        The user ID you're looking for doesn't exist or is invalid.
      </p>
      <a 
        href="/" 
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Go back home
      </a>
    </div>
  );
} 