import { Fredoka } from 'next/font/google';

const headerFont = Fredoka({ 
  subsets: ['latin'],
  weight: '700', 
});

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center space-x-3">
          <img 
            src="/images/globe.png" 
            alt="LocateIt Logo" 
            className="w-25 h-25 object-contain" 
          />
          <h1 className={`text-5xl text-green-600 tracking-tight ${headerFont.className}`}>
            LocateIt
          </h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6 text-lg font-bold text-gray-600">
            <li className="hover:text-green-600 cursor-pointer transition-colors">Home</li>
            <li className="hover:text-green-600 cursor-pointer transition-colors">About</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}