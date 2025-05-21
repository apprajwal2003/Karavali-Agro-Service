export default function CommonLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-green-500 opacity-30 animate-[ping_1s_ease-out_infinite]"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-green-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-green-500 opacity-80"></div>
      </div>
    </div>
  );
}
