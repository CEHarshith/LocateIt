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
        
        <div className="flex items-center space-x-8">
          <nav>
            <ul className="flex space-x-6 text-lg font-bold text-gray-600">
              <li className="hover:text-green-600 cursor-pointer transition-colors">Home</li>
              <li className="hover:text-green-600 cursor-pointer transition-colors">Favorites</li>
              <li className="hover:text-green-600 cursor-pointer transition-colors">About</li>
            </ul>
          </nav>

          <div>
            <button 
              onClick={() => alert("Unavailable for now")}
              className="px-5 py-2 text-base font-bold text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-300 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}