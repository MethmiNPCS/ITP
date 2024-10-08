import React from 'react';
import '../../App.css';
import { useState } from 'react';
import { FaBoxOpen, FaShoppingCart, FaTasks, FaSeedling, FaUserTie, FaMoneyBill, FaTree, FaBars, FaHorse } from 'react-icons/fa';



function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-green-500 to-green-800 text-white flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-56' : 'w-0'} overflow-hidden`}>
       
        <nav className={`flex-1 p-4 mt-12 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-12"> 
  {[
    { name: "Stocks", icon: FaBoxOpen, path: '/stockhome' },
    { name: "Orders", icon: FaShoppingCart, path: '/orderhome' },
    { name: "Tasks", icon: FaTasks, path: '/taskhome' },  // Add path if needed
    { name: "Products", icon: FaSeedling, path: '/producthome' },  // Add path if needed
    { name: "Livestock", icon: FaHorse, path: '/animalhome' },  // Changed path to AnimalHome
    { name: "Employees", icon: FaUserTie, path: '/employeehome' },  // Add path if needed
    { name: "Finance", icon: FaMoneyBill, path: '/financehome' },
    { name: "Login", icon: FaTree, path: '/login' }  // Add path if needed
  ].map(item => (
    <li key={item.name}>
      <a
        href={item.path}  // Updated to use the defined path
        className="flex items-center justify-center p-2 bg-green-100 text-green-900 border-2 border-[#7d4c3e] rounded-lg text-sm font-semibold tracking-wide shadow-lg hover:bg-green-200 hover:scale-105 transition-transform duration-300 text-center font-montserrat"
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
        {/* Hero Image with conditional zoom */}
        <div
          className={`w-full h-full bg-cover bg-center transition-transform duration-300 ${isSidebarOpen ? '' : 'animate-zoom'}`}
          style={{
            backgroundImage: `url('/assets/bg.webp')`,
          }}
        >
          {/* Center align both texts with increased top padding */}
          <div className="w-full h-full flex flex-col items-center justify-start pt-32 text-center">
            {/* The National Seminary Farm - center aligned, custom color with fade-in effect */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[9rem] font-bebas bg-gradient-to-r from-[#003366] to-[#006400] bg-clip-text text-transparent mb-8 text-center fade-in-text">
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
      <footer className={`absolute bottom-0 w-full transition-all duration-300 ${isSidebarOpen ? 'ml-56' : 'ml-0'} py-4 bg-[#f6f6e8] text-green-800 text-center`}>
        <p>&copy; 2024 The National Seminary Farm. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
