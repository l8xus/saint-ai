export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="mb-6">If you can see this, routing is working correctly!</p>
      <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Go Home
      </a>
    </div>
  )
}

