export function Partners() {
  return (
    <div className="mt-8 pb-12 px-4 flex flex-col items-center gap-8">
      <h3 className="text-xs font-bold tracking-widest uppercase text-center w-full font-sans">
        FIFA Arab Cup 2025™<br />Partners
      </h3>
      
      <div className="flex flex-col items-center gap-12 opacity-90">
        {/* Adidas Mockup - CSS Shapes */}
        <div className="flex items-end gap-[6px]">
          <div className="h-4 w-3 bg-black transform -skew-x-[20deg]"></div>
          <div className="h-7 w-3 bg-black transform -skew-x-[20deg]"></div>
          <div className="h-10 w-3 bg-black transform -skew-x-[20deg]"></div>
        </div>

        {/* Coca-Cola Mockup - Font */}
        <div className="font-[Dancing_Script] text-5xl text-black tracking-tighter transform -rotate-6">
          Coca-Cola
        </div>
      </div>
    </div>
  );
}
