import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quote a Job</h1>
          <p className="mt-2 text-sm text-slate-500">Fill out the form below to get an instant quote for your job.</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="partType" className="block text-sm font-medium text-slate-700">
              Part Type
            </label>
            <input
              type="text"
              id="partType"
              name="partType"
              placeholder="Enter part type"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-slate-700">
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              placeholder="Enter material"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="1"
              min="1"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-slate-700">
              Complexity
            </label>
            <select
              id="complexity"
              name="complexity"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            >
              <option value="">Select complexity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out"
            >
              Get Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PART 2 OF 2 — Style the quote form
// - Use Tailwind to make the form look like a modern SaaS (Linear/Cal-style)
// - Style inputs: padding, border, rounded, focus state
// - Style the button: blue or indigo background, hover transition, bold text
// - Add spacing between fields and a section divider below
// - Stop after styling the form. We'll add logic later.

