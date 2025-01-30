import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Notes App</h1>
      <p className="mb-6 text-gray-600">
        Sign up or log in to create, manage, and share your notes.
      </p>
      <div className="space-x-4">
        <Link href="/signup">
          <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign Up
          </span>
        </Link>
        <Link href="/login">
          <span className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Log In
          </span>
        </Link>
      </div>
    </div>
  );
}
