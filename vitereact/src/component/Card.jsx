import React from "react";
import "./Card.css";

function CompanyCard({ company, onDelete, onEdit }) {
    const handleDelete = () => {
        if (onDelete) onDelete(company);
    };

    const handleEdit = () => {
        if (onEdit) onEdit(company);
    };

    return (
        <div className="relative bg-gray-900 rounded-2xl border border-cyan-500/30 overflow-hidden group transition-all duration-500 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-[1.02]">
            {/* Matrix-style background pattern 
                <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>
                
                
                
                */}
            

            {/* Animated border glow */}
            

            <div className="relative flex flex-col lg:flex-row min-h-[16rem] lg:min-h-[18rem]">
                {/* Left side - Company Logo & Info */}
                <div className="w-full lg:w-56 bg-gradient-to-br from-gray-800 via-gray-900 to-black relative flex items-center justify-center overflow-hidden lg:border-r border-b lg:border-b-0 border-cyan-500/30 min-h-[12rem] lg:min-h-auto">
                    {/* Circuit board pattern overlay */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                            <path d="M20 20h160v160H20z" stroke="#00ffff" strokeWidth="0.5" fill="none" />
                            <circle cx="40" cy="40" r="3" fill="#00ffff" />
                            <circle cx="160" cy="40" r="3" fill="#00ffff" />
                            <circle cx="40" cy="160" r="3" fill="#00ffff" />
                            <circle cx="160" cy="160" r="3" fill="#00ffff" />
                            <path d="M40 40h120M40 40v120M160 40v120M40 160h120" stroke="#00ffff" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={handleEdit}
                            className="bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-sm text-cyan-300 rounded-lg w-8 h-8 flex items-center justify-center text-xs font-mono border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200"
                            aria-label="Edit company"
                        >
                            &lt;/&gt;
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm text-red-300 rounded-lg w-8 h-8 flex items-center justify-center text-xs font-mono border border-red-500/30 hover:border-red-400/60 transition-all duration-200"
                            aria-label="Delete company"
                        >
                            rm
                        </button>
                    </div>

                    {/* Company Display */}
                    <div className="relative z-10 text-center px-3 py-4">
                        {/* Terminal-style company initial */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black border-2 border-cyan-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
                            <span className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-cyan-400 relative z-10">
                                {company.company.charAt(0)}
                            </span>
                            {/* Blinking cursor effect */}
                            <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 w-1 h-2 lg:h-3 bg-cyan-400 animate-pulse" />
                        </div>
                        
                        {/* Company name with typewriter effect styling */}
                        <div className="bg-black/50 rounded-lg p-2 border border-cyan-500/30 backdrop-blur-sm max-w-full overflow-hidden">
                            <div className="truncate">
                                <span className="text-cyan-300 font-mono text-xs sm:text-sm">&gt; </span>
                                <span className="text-white font-mono text-sm sm:text-base lg:text-lg font-bold">
                                    {company.company}
                                </span>
                                <span className="text-cyan-400 animate-pulse">_</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Tech Info Panel */}
                <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-black relative">
                    

                    {/* Header Section */}
                    <div className="relative mb-4 sm:mb-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0">
                            <div className="flex-1 min-w-0">
                                {/* Role with syntax highlighting */}
                                <div className="font-mono text-xs sm:text-sm text-gray-400 mb-1 overflow-x-auto">
                                    <span className="text-purple-400">class</span> <span className="text-cyan-400">Role</span> {"{"}
                                </div>
                                <h3 className="text-lg sm:text-xl font-mono font-bold text-white ml-2 sm:ml-4 mb-2 break-words">
                                    "{company.role}"
                                </h3>
                                <div className="font-mono text-xs sm:text-sm text-gray-400 mb-2">{"}"}</div>
                                
                                {/* Location with terminal style */}
                                <div className="flex items-center text-gray-300 font-mono text-xs sm:text-sm break-all">
                                    <span className="text-cyan-400 mr-2 flex-shrink-0"></span>
                                    <span className="text-green-400 flex-shrink-0">location:</span>
                                    <span className="text-white ml-2 break-all">"{company.location}"</span>
                                </div>
                            </div>
                            
                            {/* CTC Display - Terminal Window Style */}
                            <div className="bg-black border border-cyan-500/40 rounded-lg overflow-hidden w-full lg:w-auto lg:min-w-[100px] flex-shrink-0">
                                <div className="bg-gray-800 px-2 sm:px-3 py-1 text-xs font-mono text-gray-300 flex items-center text-center">
                                    <div className="text-xs font-mono text-cyan-400 mb-1">
                                       CTC
                                    </div>
 
                                </div>
                                <div className="p-2 sm:p-3 text-center">
                                    <div className="text-xs font-mono text-cyan-400 mb-1">OUTPUT:</div>
                                    <div className="text-lg font-mono font-bold text-green-400">{company.ctc}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Deadline - Error/Warning Style */}
                        <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            <div className="font-mono text-xs text-red-400 mb-1">
                                DEADLINE
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-red-300 font-mono text-sm"> {company.deadline}</span>
                                
                            </div>
                        </div>

                        {/* OA - Success Style */}
                        <div className="bg-blue-900/20 border border-blue-500/40 rounded-lg p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            <div className="font-mono text-xs text-blue-400 mb-1 uppercase">
                                ONLINE_ASSESSMENT
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-300 font-mono text-sm">{company.oaDate}</span>
                                <span className="text-blue-300 font-mono text-xs bg-blue-900/40 px-2 py-1 rounded">
                                    {company.mode}
                                </span>
                            </div>
                        </div>

                        {/* Interview - Process Style */}
                        <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-4 relative overflow-hidden md:col-span-2">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-mono text-xs text-green-400 mb-1">
                                        INTERVIEW
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-green-300 font-mono text-sm"> {company.interVDate}</span>
                                        <div className="flex items-center space-x-2">
                                           
                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="text-green-300 font-mono text-xs bg-green-900/40 px-3 py-1 rounded border border-green-500/30">
                                    {company.interVMode}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}

export default CompanyCard;