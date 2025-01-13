export default function Home() {
    return (
        <main className="bg-gray-100 sm:bg-red-100 md:bg-blue-100 lg:bg-green-100 xl:bg-yellow-100 2xl:bg-purple-100 h-screen flex items-center justify-center  p-4 dark:bg-gray-900">
            <div className="w-full max-w-screen-sm p-4 rounded-2xl bg-white shadow-md dark:bg-gray-800 flex flex-col gap-2">
                {["Korean", "Japanese", "Chinese", "English", ""].map((person, index) =>
                    <div key={index} className="group flex items-center gap-5 odd:bg-gray-200 p-3 rounded-xl border-b-2 border-gray-300 last:border-b-0 last:pb-0">
                        <div className="size-7 rounded-full bg-blue-400"></div>
                        <span className="text-lg font-bold empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-600 group-hover:text-red-500">{person}</span>
                        <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full relative">
                            <span>{index}</span>
                            <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full animate-ping absolute"></div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}