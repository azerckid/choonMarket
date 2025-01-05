export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-96 p-4 rounded-md bg-white shadow-md">
        <div>
          <div className="flex flex-col justify-between">
            <span className="text-gray-400">In transit</span>
            <span className="text-4xl font-semibold">Coolblue</span>
          </div>
        </div>
        <div>
          <span>07:00</span>
          <span>post</span>
        </div>
        <div></div>
        <div>
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span>Delivered</span>
        </div>
      </div>
    </main>
  );
}
