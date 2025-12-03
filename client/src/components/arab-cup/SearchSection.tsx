import { Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchSection() {
  return (
    <div className="bg-[#F5F5F5] px-4 py-6 flex flex-col gap-4 border-b border-gray-200">
      <Button 
        variant="outline" 
        className="w-full h-12 bg-[#F0F0F0] border-[#D0D0D0] text-gray-700 hover:bg-gray-200 hover:text-gray-900 justify-center text-base font-medium shadow-sm"
      >
        <Calendar className="mr-2 h-5 w-5 text-gray-600" />
        Search by date
      </Button>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input 
          type="text" 
          placeholder="Search for" 
          className="pl-10 h-12 bg-white border-[#D0D0D0] text-base shadow-sm"
        />
      </div>
    </div>
  );
}
