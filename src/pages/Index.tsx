
import ECardCreator from "@/components/ECardCreator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-bold text-purple-800">E-Card Creator</h1>
        <p className="text-purple-600 mt-2">
          Generate, customize, and send beautiful e-cards to your loved ones
        </p>
      </header>
      
      <main>
        <ECardCreator />
      </main>
      
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>© 2025 E-Card Creator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
