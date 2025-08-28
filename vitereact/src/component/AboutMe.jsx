import React from "react";
import { Info, Code } from "lucide-react";

function AboutMe({ mode = "dark" }) {
    // Dynamic color classes based on mode prop
    const bg = mode === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300 shadow-lg";
    const textPrimary = mode === "dark" ? "text-white" : "text-gray-800";
    const textSecondary = mode === "dark" ? "text-gray-400" : "text-gray-500";
    const terminalBg = mode === "dark" ? "bg-black/50 border-cyan-500/30" : "bg-gray-800 border-gray-700";
    const sidebarBg = mode === "dark" ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

    return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
            <div
                className={`relative rounded-2xl border overflow-hidden transition-all duration-500 max-w-4xl w-full ${bg} ${mode === "dark" ? "hover:shadow-cyan-500/20" : "hover:shadow-blue-500/25"}`}
            >
                <div className="relative flex min-h-[20rem]">
                    {/* Left side - Icon & Command Info */}
                    <div className={`w-full lg:w-64 relative flex items-center justify-center overflow-hidden lg:border-r border-b lg:border-b-0 ${sidebarBg} min-h-[16rem]`}>
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
                        <div className="relative z-10 text-center px-3 py-4 w-full">
                            <div className={`w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto relative overflow-hidden`}>
                                <Info className="w-12 h-12 text-white" />
                            </div>
                            <div className={`rounded-lg p-3 border backdrop-blur-sm ${terminalBg}`}>
                                <div className="flex items-center justify-center">
                                    <span className={`font-mono text-sm flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>&gt;{" "}</span>
                                    <span className={`font-mono text-lg font-bold mx-2 ${mode === "dark" ? "text-white" : "text-gray-100"}`}>
                                        Terminal.about()
                                    </span>
                                    <span className={`animate-pulse flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"}`}>_</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content Panel */}
                    <div className={`flex-1 p-6 ${mode === "dark" ? "bg-gray-900 to-black" : "bg-gradient-to-br from-white via-gray-50 to-blue-50/30"}`}>
                        <div className="flex flex-col h-full">
                            <h2 className={`font-mono text-2xl font-bold mb-4 ${textPrimary}`}>
                                about.md
                            </h2>
                            <div className={`flex-1 p-4 rounded-xl border font-mono text-sm overflow-y-auto ${mode === "dark" ? "bg-black border-cyan-500/20 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-800"}`}>
                                <pre className="whitespace-pre-wrap">
                                    <span className={mode === "dark" ? "text-green-400" : "text-green-700"}>
                                        {`// This is a project management tool for tech job applications.`}
                                        {`\n// It helps you track company details, interview dates, and offers.`}
                                    </span>
                                    {`\n\n- `}
                                    <span className={mode === "dark" ? "text-cyan-400" : "text-blue-600"}>`author: Alweena`</span>
                                    {`\n- `}
                                    <span className={mode === "dark" ? "text-cyan-400" : "text-blue-600"}>`version: 1.0`</span>
                                    {`\n- `}
                                    <span className={mode === "dark" ? "text-cyan-400" : "text-blue-600"}>`repo: [link_to_repo]`</span>
                                    {`\n\n`}
                                    <span className={mode === "dark" ? "text-purple-400" : "text-purple-700"}>
                                        {`{`}{`\n  "description": "A tool to organize your job search",\n  "features": [\n    "Authentication (login/signup)",\n    "Track company applications",\n    "Delete company entries",\n    "Dark/Light mode"\n  ]\n}`}
                                    </span>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutMe;
