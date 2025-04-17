
import ECardCreator from "@/components/ECardCreator";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-3xl font-bold text-purple-800">E-Card Creator</h1>
          <Sparkles className="text-yellow-500 h-6 w-6" />
        </div>
        <p className="text-purple-600 mt-2 max-w-md mx-auto">
          Create beautiful AI-generated e-cards and send them to your loved ones in minutes
        </p>
      </header>
      
      <main className="pb-12">
        <ECardCreator />
      </main>
      
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} E-Card Creator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
