export function FullPartnersList() {
  return (
    <div className="mt-8 pb-12 px-8 flex flex-col items-center gap-12">
      {/* Main Partner */}
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-[10px] font-bold tracking-widest uppercase text-center font-sans">
          FIFA Arab Cup 2025™<br />Partners
        </h3>
        
        <div className="flex flex-col items-center gap-10 opacity-90 grayscale">
          {/* Adidas Mockup */}
          <div className="flex items-end gap-[6px] transform scale-110">
            <div className="h-5 w-3.5 bg-black transform -skew-x-[20deg]"></div>
            <div className="h-8 w-3.5 bg-black transform -skew-x-[20deg]"></div>
            <div className="h-11 w-3.5 bg-black transform -skew-x-[20deg]"></div>
          </div>

          {/* Coca-Cola Mockup */}
          <div className="font-[Dancing_Script] text-5xl text-black tracking-tighter transform -rotate-6">
            Coca-Cola
          </div>
          
          {/* Visit Qatar (Text based) */}
          <div className="flex flex-col items-center leading-none">
             <span className="font-sans text-2xl tracking-wider font-light">visit</span>
             <span className="font-sans text-3xl font-bold tracking-widest uppercase">QATAR</span>
          </div>
          
           {/* Qatar Airways (Text based) */}
          <div className="flex flex-col items-center leading-none font-serif gap-1">
             <span className="text-2xl tracking-[0.15em] uppercase">QATAR</span>
             <span className="text-lg tracking-[0.15em] uppercase text-gray-600">AIRWAYS</span>
          </div>
        </div>
      </div>

      {/* Supporters */}
      <div className="flex flex-col items-center gap-6 w-full pt-4">
         <h3 className="text-[10px] font-bold tracking-widest uppercase text-center font-sans">
          FIFA Arab Cup 2025™<br />Supporters
        </h3>
        
        <div className="flex flex-col items-center gap-10 opacity-80 grayscale">
             {/* JETOUR Mockup */}
            <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-1">
                   <div className="w-6 h-2 bg-black skew-x-12"></div>
                   <div className="w-6 h-2 bg-black skew-x-12"></div>
                </div>
                <div className="font-sans font-black text-xl tracking-widest">JETOUR</div>
            </div>

             {/* Media City Mockup */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-black rotate-45 grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-black rounded-full"></div>
                    <div className="bg-black rounded-full"></div>
                    <div className="bg-black rounded-full"></div>
                    <div className="bg-black rounded-full"></div>
                </div>
                <div className="text-xs font-bold uppercase leading-tight">
                    Media<br/>City
                </div>
            </div>
            
            {/* Vodafone */}
            <div className="flex items-center gap-2 font-sans font-bold text-xl">
               <div className="w-8 h-8 rounded-full border-4 border-black p-1 relative">
                  <div className="absolute top-1 left-2 w-3 h-3 bg-black rounded-full"></div>
               </div>
               vodafone
            </div>
        </div>
      </div>
      
      {/* Bottom Sponsors */}
      <div className="flex flex-col items-center gap-8 opacity-70 pt-4 w-full">
          <div className="font-serif font-bold text-lg tracking-widest">QIIB</div>
          <div className="font-sans tracking-[0.3em] text-sm uppercase border-b border-black pb-1">ASPETAR</div>
          <div className="font-black text-xl italic uppercase">ALKASS</div>
      </div>
    </div>
  );
}
