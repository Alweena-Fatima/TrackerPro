import React, { useState } from "react";
import { Home, User, Plus, Info, Menu, X, Code, Moon, Sun } from "lucide-react";

function Sidebar({ mode, toggleMode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsMobileMenuOpen(false);
  };

  // Enhanced colors for light/dark mode
  const bg = mode === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-blue-50";
  const text = mode === "dark" ? "text-gray-300" : "text-gray-700";
  const border = mode === "dark" ? "border-gray-700" : "border-gray-200";
  const headerBg = mode === "dark" ? "bg-gray-800/50" : "bg-white";
  const footerBg = mode === "dark" ? "bg-black/50" : "bg-gray-100";

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "user", label: "User", icon: User },
    { id: "add", label: "Add Company", icon: Plus },
    { id: "about", label: "README.md", icon: Info },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-72 ${bg} border-r ${border} shadow-lg overflow-hidden`}>
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 border-b ${border} ${headerBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className={`font-mono font-bold text-lg ${text}`}>TechPortal</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? mode === "dark"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                        : "bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-md"
                      : mode === "dark"
                      ? "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:text-gray-300"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <div className="font-mono text-sm font-medium font-bold">{item.label}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-5 border-t ${border}`}>
            <div className={`rounded-lg p-4 border ${border} ${footerBg} shadow-inner`}>
              <div className="flex justify-between items-center font-mono text-sm">
                {/* Mode toggle */}
                <div className="flex items-center space-x-2">
                  <span className={mode === "dark" ? "text-cyan-400" : "text-cyan-600"}>MODE:</span>
                  {/* Mode Toggle */}
                  <button 
                    onClick={toggleMode}
                    className={`p-1 rounded-md transition-all duration-300 ${
                      mode === "dark" 
                        ? "hover:bg-yellow-400/20 text-yellow-400" 
                        : "hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>

                {/* Clock */}
                <div className={mode === "dark" ? "text-gray-400" : "text-gray-500"}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${headerBg} border-b ${border} shadow-md backdrop-blur-sm`}>
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className={`font-mono font-bold text-lg ${text}`}>TechPortal</h1>
          </div>

          {/* Mode & Menu Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMode}
              className={`p-2 rounded-lg transition-all duration-300 ${
                mode === "dark" 
                  ? "hover:bg-yellow-400/20 text-yellow-400" 
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                mode === "dark"
                  ? "bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40"
                  : "bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`border-t ${border} ${bg} backdrop-blur-sm shadow-lg`}>
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? mode === "dark"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm"
                        : mode === "dark"
                        ? "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <div className="font-mono text-sm font-medium">{item.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="lg:hidden h-20" />
    </>
  );
}

export default Sidebar;