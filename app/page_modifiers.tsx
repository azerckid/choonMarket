export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-screen-sm p-4 rounded-2xl bg-white shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-between">
            <span className="text-gray-400 dark:text-gray-600">In transit</span>
            <span className="text-4xl font-semibold dark:text-white">Coolblue</span>
          </div>
          <div className="size-12 rounded-full bg-orange-300"></div>
        </div>
        <div className="my-4 flex items-center gap-2">
          <span className="bg-green-400 p-2 px-3 rounded-3xl text-white uppercase text-sm font-bold hover:bg-green-500 transition-all duration-300">
            Today
          </span>
          <span className="text-gray-400 dark:text-gray-200">09:30~10:30</span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-gray-200 rounded-full absolute"></div>
          <div className="w-2/3 h-2 bg-green-400 rounded-full absolute"></div>
        </div>
        <div className="flex justify-between items-center mt-6 text-gray-600">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-400">Delivered</span>
        </div>
      </div>
    </main>
  );
}
