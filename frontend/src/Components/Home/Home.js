import React from 'react';
import { FaBoxOpen, FaShoppingCart, FaTasks, FaSeedling, FaUserTie, FaMoneyBill, FaTree } from 'react-icons/fa';

function Home() {
  return (
    <div className="flex h-screen relative">
    {/* Sidebar */}
    <aside className="w-56 bg-gradient-to-b from-green-500 to-green-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-green-700 text-center font-montserrat">
        Dashboard
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-14">
          {[
            { name: "Stocks", icon: FaBoxOpen },
            { name: "Orders", icon: FaShoppingCart },
            { name: "Tasks", icon: FaTasks },
            { name: "Products", icon: FaSeedling },
            { name: "Employees", icon: FaUserTie },
            { name: "Finance", icon: FaMoneyBill },
            { name: "Plantation", icon: FaTree }
          ].map(item => (
            <li key={item.name}>
              <a
                href="#"
                className="flex items-center justify-center p-3 bg-green-100 text-green-900 border-2 border-[#7d4c3e] rounded-lg text-base font-semibold tracking-wide shadow-lg hover:bg-green-200 hover:scale-105 transition-transform duration-300 text-center font-montserrat"
              >
                <item.icon className="mr-2" /> {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 relative">
      {/* Hero Image with subtle zoom */}
      <div
        className="w-full h-full bg-cover bg-center animate-zoom"
        style={{
          backgroundImage: `url('/assets/bg.webp')`,
        }}
      >
        {/* Center align both texts with increased top padding */}
        <div className="w-full h-full flex flex-col items-center justify-start pt-20 text-center">
          {/* The National Seminary Farm - center aligned, custom color with fade-in effect */}
          <h1 className="text-[9rem] font-bebas bg-gradient-to-r from-[#003366] to-[#006400] bg-clip-text text-transparent mb-8 text-center fade-in-text">
            The National Seminary Farm
          </h1>

          {/* Call to action button */}
          <button className="mt-8 px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 hover:scale-105 transition-transform duration-300 font-bold">
            Explore
          </button>
        </div>
      </div>
    </main>

    {/* Footer */}
    <footer className="absolute bottom-0 w-[calc(100%-14rem)] ml-56 py-4 bg-[#f6f6e8] text-green-800 text-center">
      <p>&copy; 2024 The National Seminary Farm. All rights reserved.</p>
    </footer>
  </div>
  );
}

export default Home;
