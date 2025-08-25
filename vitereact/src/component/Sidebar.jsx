import React, { useState } from "react";
import { Home, User, Plus, Info, Menu, X, Code, Moon, Sun } from "lucide-react";

function TechySidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [mode, setMode] = useState("dark"); // 'dark' or 'light'

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsMobileMenuOpen(false);
  };
  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  // Colors for light/dark mode
  const bg = mode === "dark" ? "bg-gray-900" : "bg-white";
  const text = mode === "dark" ? "text-gray-300" : "text-gray-800";
  const border = mode === "dark" ? "border-cyan-500/30" : "border-gray-300/50";
  const overlayOpacity = mode === "dark" ? 0.1 : 0.05;

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "user", label: "User", icon: User},
    { id: "add", label: "Add Company", icon: Plus},
    { id: "about", label: "README.md", icon: Info },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-72 ${bg} ${border} overflow-hidden`}>
        

        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 border-b ${border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className={`font-mono font-bold text-lg ${text}`}>TechPortal</h1>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: mode === "dark" ? "#34d399" : "#22c55e" }} />
                    <span className={`font-mono text-xs ${mode === "dark" ? "text-green-400" : "text-green-700"}`}>ONLINE</span>
                  </div>
                </div>
              </div>
              {/* Mode Toggle */}
              <button onClick={toggleMode}>
                {mode === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-600'
                      : `${bg} ${text} border`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: isActive ? "rgba(6,182,212,0.2)" : mode === "dark" ? "#37415180" : "#d1d5db80" }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-sm font-bold">{item.label}</div>
                    
                    </div>
                    {isActive && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-5 border-t ${border}`}>
            <div className={`bg-black/50 rounded-lg p-3 border ${border}`}>
              <div className="flex justify-between items-center font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`text-cyan-400`}>MODE:</span>
                  <span className="cursor-pointer" onClick={toggleMode}>
                    {mode === "dark" ? "🌚" : "🌞"}
                  </span>
                </div>
                <div className={mode === "dark" ? "text-gray-400" : "text-gray-600"}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: mode === "dark" ? "#111827" : "#f9fafb", borderBottom: mode === "dark" ? "1px solid rgba(6,182,212,0.2)" : "1px solid #d1d5db" }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between p-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className={`w-4 h-4 text-white`} />
              </div>
              <div>
                <h1 className={`font-mono font-bold text-lg ${text}`}>TechPortal</h1>
              </div>
            </div>

            {/* Mode & Menu Buttons */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMode}>
                {mode === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={toggleMobileMenu}
                className="w-10 h-10 bg-cyan-900/20 border border-cyan-500/30 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-900/40 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`border-t ${border} ${bg} backdrop-blur-sm`}>
              <div className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-600'
                          : `${bg} ${text} ${border}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: isActive ? "rgba(6,182,212,0.2)" : mode === "dark" ? "#37415180" : "#d1d5db80" }}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium">{item.label}</div>
                          <div className="font-mono text-xs opacity-60">{item.command}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for mobile layout */}
      <div className="lg:hidden h-20" />
    </>
  );
}

export default TechySidebar;
