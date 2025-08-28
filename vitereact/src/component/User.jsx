// UserAuth.jsx
// Pass onLoginSuccess as a prop
import React,{useState} from "react"
function UserAuth({ mode = "dark", onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userid: "",
    password: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userid || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "signup";
      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      
      if (res.ok) {
        // --- THIS IS THE CRITICAL ADDITION ---
        if (result.token) {
          localStorage.setItem('token', result.token);
          // Call the parent's success handler
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
        }
        alert(`${isLogin ? 'Login' : 'Signup'} successful!`);
        // Reset form
        setFormData({ userid: "", password: "" });
      } else {
        alert(result.message || `${isLogin ? 'Login' : 'Signup'} failed`);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ userid: "", password: "" });
    };

    // Enhanced dynamic colors based on mode
    const cardBg = mode === "dark"
        ? "bg-gray-900 border-gray-700 hover:border-cyan-400/60"
        : "bg-white border-gray-300 hover:border-blue-400/70 shadow-lg";

    const textPrimary = mode === "dark" ? "text-white" : "text-gray-800";
    const textSecondary = mode === "dark" ? "text-gray-400" : "text-gray-500";

    const leftPanelBg = mode === "dark"
        ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700"
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-gray-300";

    const rightPanelBg = mode === "dark"
        ? "bg-gradient-to-br from-gray-900 to-black"
        : "bg-gradient-to-br from-white via-gray-50 to-blue-50/30";

    const logoContainerBg = mode === "dark"
        ? "bg-black border-cyan-400"
        : "bg-gradient-to-br from-indigo-600 to-blue-700 border-indigo-500";

    const terminalBg = mode === "dark"
        ? "bg-black/50 border-cyan-500/30"
        : "bg-gray-800 border-gray-700";

    const inputBg = mode === "dark"
        ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:bg-gray-800"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-blue-50/30";

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div
                className={`relative rounded-2xl border overflow-hidden group transition-all duration-500 hover:shadow-2xl max-w-4xl w-full ${cardBg} ${mode === "dark"
                    ? "hover:shadow-cyan-500/20"
                    : "hover:shadow-blue-500/25"
                }`}
            >
                <div className="relative flex flex-col lg:flex-row min-h-[20rem]">
                    {/* Left side - User Icon & Mode Toggle */}
                    <div className={`w-full lg:w-64 relative flex items-center justify-center overflow-hidden lg:border-r border-b lg:border-b-0 ${leftPanelBg} min-h-[16rem]`}>
                        {/* Circuit board pattern overlay */}
                        <div className="absolute inset-0 opacity-20">
                            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                                <path d="M20 20h160v160H20z" stroke={mode === "dark" ? "#00ffff" : "#6366f1"} strokeWidth="0.5" fill="none" />
                                <circle cx="40" cy="40" r="3" fill={mode === "dark" ? "#00ffff" : "#6366f1"} />
                                <circle cx="160" cy="40" r="3" fill={mode === "dark" ? "#00ffff" : "#6366f1"} />
                                <circle cx="40" cy="160" r="3" fill={mode === "dark" ? "#00ffff" : "#6366f1"} />
                                <circle cx="160" cy="160" r="3" fill={mode === "dark" ? "#00ffff" : "#6366f1"} />
                                <path d="M40 40h120M40 40v120M160 40v120M40 160h120" stroke={mode === "dark" ? "#00ffff" : "#6366f1"} strokeWidth="0.5" />
                            </svg>
                        </div>

                        {/* Mode Toggle Button */}
                        <div className="absolute top-3 right-3">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className={`backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-mono border transition-all duration-200 ${mode === "dark"
                                    ? "bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 border-purple-500/30 hover:border-purple-400/60"
                                    : "bg-purple-100/80 hover:bg-purple-200/80 text-purple-700 border-purple-300 hover:border-purple-500"
                                }`}
                            >
                                {isLogin ? "SIGNUP" : "LOGIN"}
                            </button>
                        </div>

                        {/* User Display */}
                        <div className="relative z-10 text-center px-3 py-4 w-full">
                            <div className={`w-20 h-20 lg:w-28 lg:h-28 ${logoContainerBg} border-2 rounded-xl flex items-center justify-center mb-4 mx-auto relative overflow-hidden`}>
                                <div className={`absolute inset-0 ${mode === "dark"
                                    ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                                    : "bg-gradient-to-br from-white/20 to-blue-200/20"
                                }`} />
                                <span className={`text-3xl lg:text-4xl font-mono font-bold relative z-10 ${mode === "dark" ? "text-cyan-400" : "text-white"}`}>
                                    👤
                                </span>
                                <div className={`absolute bottom-2 right-2 w-2 h-3 animate-pulse ${mode === "dark" ? "bg-cyan-400" : "bg-blue-200"}`} />
                            </div>

                            <div className={`rounded-lg p-3 border backdrop-blur-sm ${terminalBg}`}>
                                <div className="flex items-center justify-center">
                                    <span className={`font-mono text-sm flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>
                                        &gt;{" "}
                                    </span>
                                    <span className={`font-mono text-lg font-bold mx-2 ${mode === "dark" ? "text-white" : "text-gray-100"}`}>
                                        {isLogin ? "AUTH_LOGIN" : "AUTH_SIGNUP"}
                                    </span>
                                    <span className={`animate-pulse flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>_</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form Panel */}
                    <div className={`flex-1 p-6 ${rightPanelBg}`}>
                        {/* Header Section */}
                        <div className="relative mb-8">
                            <div className={`font-mono text-sm ${textSecondary} mb-2`}>
                                <span className={mode === "dark" ? "text-purple-500" : "text-purple-700"}>class</span>{" "}
                                <span className={mode === "dark" ? "text-cyan-500" : "text-blue-600"}>User</span> {"{"}
                            </div>
                            <div className="ml-6 mb-2">
                                <h1 className={`text-2xl lg:text-3xl font-mono font-bold ${textPrimary}`}>
                                    {isLogin ? "System.login()" : "User.create()"}
                                </h1>
                            </div>
                            <div className={`font-mono text-sm mb-4 ${textSecondary}`}>
                                {"}"}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* User ID Field */}
                            <div className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                                ? "bg-blue-900/20 border-blue-500/40"
                                : "bg-blue-50 border-blue-300"
                            }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-blue-500" : "bg-blue-600"}`} />
                                <div className={`font-mono text-xs mb-3 uppercase ${mode === "dark" ? "text-blue-500" : "text-blue-700"}`}>
                                    USER_ID
                                </div>
                                <div className={`rounded-lg p-3 border backdrop-blur-sm ${terminalBg} mb-3`}>
                                    <div className="flex items-center">
                                        <span className={`font-mono text-sm flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>
                                            $:{" "}
                                        </span>
                                        <input
                                            type="text"
                                            value={formData.userid}
                                            onChange={(e) => handleChange("userid", e.target.value)}
                                            placeholder="enter_username"
                                            className={`font-mono text-lg font-bold bg-transparent border-none outline-none flex-1 min-w-0 ${mode === "dark" ? "text-white placeholder-gray-500" : "text-gray-100 placeholder-gray-400"}`}
                                            required
                                        />
                                        <span className={`animate-pulse flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>|</span>
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                                ? "bg-red-900/20 border-red-500/40"
                                : "bg-red-50 border-red-300"
                            }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-red-500" : "bg-red-500"}`} />
                                <div className={`font-mono text-xs mb-3 uppercase ${mode === "dark" ? "text-red-500" : "text-red-600"}`}>
                                    PASSWORD
                                </div>
                                <div className={`rounded-lg p-3 border backdrop-blur-sm ${terminalBg} mb-3`}>
                                    <div className="flex items-center">
                                        <span className={`font-mono text-sm flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>
                                            #:{" "}
                                        </span>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            placeholder="enter_password"
                                            className={`font-mono text-lg font-bold bg-transparent border-none outline-none flex-1 min-w-0 ${mode === "dark" ? "text-white placeholder-gray-500" : "text-gray-100 placeholder-gray-400"}`}
                                            required
                                        />
                                        <span className={`animate-pulse flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>|</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                                ? "bg-green-900/20 border-green-500/40"
                                : "bg-emerald-50 border-emerald-300"
                            }`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-green-500" : "bg-emerald-600"}`} />
                                <button
                                    onClick={handleSubmit}
                                    className={`w-full font-mono text-lg font-bold rounded-lg px-6 py-4 border transition-all duration-300 transform hover:scale-[1.02] ${mode === "dark"
                                        ? "bg-green-500/20 hover:bg-green-500/40 text-green-400 border-green-500/30 hover:border-green-400/60 hover:shadow-green-500/20"
                                        : "bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-500/25"
                                    } hover:shadow-lg`}
                                >
                                    <span className="flex items-center justify-center">
                                        <span className={mode === "dark" ? "text-cyan-400" : "text-emerald-600"}>&gt;</span>
                                        <span className="mx-2">
                                            {isLogin ? "EXECUTE_LOGIN()" : "CREATE_USER()"}
                                        </span>
                                        <span className={mode === "dark" ? "text-cyan-400" : "text-emerald-600"}>&lt;</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className={`mt-6 text-center font-mono text-xs ${textSecondary}`}>
                            <span className={mode === "dark" ? "text-purple-500" : "text-purple-700"}>
                                // {isLogin ? "Need an account? Click SIGNUP above" : "Already have an account? Click LOGIN above"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserAuth;