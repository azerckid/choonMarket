export default function Home() {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-screen-sm p-4 rounded-2xl bg-white shadow-md dark:bg-gray-800 flex flex-col gap-2">
            <input type="text" placeholder="Search" className="w-full p-2 rounded-full pl-4 bg-gray-200 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="w-full bg-blue-500 text-white p-2 rounded-full hover:bg-pink-600 transition-all duration-300 active:scale-95">Search</button>
        </div>
      </main>
    );
  }