export default function Input({ value, onChange, onClick }) {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center gap-2 w-full">
        <input
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your prompt here..."
          value={value}
          onChange={onChange}
        />
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          onClick={onClick}
        >
          Go
        </button>
      </div>
    </div>
  );
}