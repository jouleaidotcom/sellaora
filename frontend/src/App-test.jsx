function App() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sellaora Test
        </h1>
        <p className="text-gray-600">
          If you can see this, React and Tailwind are working!
        </p>
        <div className="mt-4 space-y-2">
          <div className="bg-red-100 text-red-800 p-2 rounded">Red test</div>
          <div className="bg-green-100 text-green-800 p-2 rounded">Green test</div>
          <div className="bg-blue-100 text-blue-800 p-2 rounded">Blue test</div>
        </div>
      </div>
    </div>
  )
}

export default App