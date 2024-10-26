export default function Input({ value, onChange, onClick, onAddMoreDrinks }) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center gap-3 w-full">
        <input
          className="flex-1 px-4 py-3 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your prompt here..."
          value={value}
          onChange={onChange}
        />
        <button 
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
          onClick={onClick}
        >
          Go
        </button>
        <button 
          className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow hover:bg-indigo-600 transition duration-200"
          onClick={onAddMoreDrinks}
        >
          Add More Drinks
        </button>
      </div>
    </div>
  );
}
