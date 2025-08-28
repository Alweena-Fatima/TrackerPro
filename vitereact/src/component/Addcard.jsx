import React, { useState, useEffect } from "react";
const getTodayEODLocal = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 0); // local time EOD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
function AddCard({ onAdd, onCancel, mode }) {
    const [emailText, setEmailText] = useState(''); // <-- Add this line
    const [formData, setFormData] = useState({
        company: "",
        role: "",
        location: "",
        ctc: "",
        deadline: getTodayEODLocal(),
        oaDate: "",
        mode: "",
        interVDate: "",
        interVMode: ""
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.company || !formData.role) {
            alert("Company and Role are required.");
            return;
        }
        
        // Create a copy of formData to modify before sending
        const dataToSend = { ...formData };
        if (!dataToSend.oaDate) dataToSend.oaDate = null;
        if (!dataToSend.interVDate) dataToSend.interVDate = null;
        
        // Call the parent's onAdd function with the cleaned data
        if (onAdd) {
            await onAdd(dataToSend); // Await the onAdd call
        }

        // Reset form after successful submission
        setFormData({
            company: "",
            role: "",
            location: "",
            ctc: "",
            deadline: getTodayEODLocal(),
            oaDate: "",
            mode: "",
            interVDate: "",
            interVMode: ""
        });
    };
    const parseAndPopulate = () => {
        // 1. Initialize an object to hold the extracted data.
        let extractedData = {};

        // Clean up the text for easier parsing
        const normalizedText = emailText.toLowerCase();

        const companyList = [
            "slb",
            "dp world",
            "google",
            "KKR",
            "Kohlberg Kravis Roberts & Co.",
            "KKR & Co. Inc."
            // add more companies
        ];
        let companyName = '';
        for (const company of companyList) {
            if (normalizedText.includes(company)) {
                companyName = company;
                break;
            }
        }
        extractedData.company = companyName;

        // 3. Try to extract Role
        // Pattern A: "Job Profile: [role] - [ctc]" (from first example)
        let roleMatch = normalizedText.match(/profile\s*:\s*([a-z\s-]+)\s*-/);
        // Pattern B: "Role: [role]" (from second example)
        if (!roleMatch) {
            roleMatch = normalizedText.match(/role:\s*([a-z\s-]+)\s*(\(fte\))?/);
        }
        extractedData.role = roleMatch ? roleMatch[1].trim() : '';

        // 4. Try to extract Location
        // Pattern A: "Location: [location]" (from first example)
        let locationMatch = normalizedText.match(/location\s*:\s*([a-z]+)/);
        // Pattern B: "Job Locations: [location] / [location]..." (from second example)
        if (!locationMatch) {
            locationMatch = normalizedText.match(/job locations:\s*([a-z\s/]+)/);
        }
        extractedData.location = locationMatch ? locationMatch[1].trim() : '';

        // 5. Try to extract CTC
        // Pattern A: " - [ctc]" (after a role) (from first example)
        let ctcMatch = normalizedText.match(/-\s*([\d.]+lpa)/);
        // Pattern B: "CTC: ₹[ctc]" (from second example)
        if (!ctcMatch) {
            ctcMatch = normalizedText.match(/ctc:\s*₹?([\d,]+)/);
        }
        extractedData.ctc = ctcMatch ? ctcMatch[1].replace(',', '') : '';

        // 6. Try to extract Deadline
        // Pattern A: "Tomorrow (DD/MM/YYYY)" (from first example)
        let deadlineMatch = normalizedText.match(/\((\d{2}\/\d{2}\/\d{4})\)/);
        // Pattern B: "DEADLINE : DD Month PM" (from second example)
        if (!deadlineMatch) {
            const monthMap = { 'january': '01', 'february': '02', 'march': '03', 'april': '04', 'may': '05', 'june': '06', 'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12' };
            const deadlineTextMatch = normalizedText.match(/deadline\s*:\s*(\d{1,2})\s*([a-z]+)\s*(\d{1,2}:\d{2})\s*pm/);
            if (deadlineTextMatch) {
                const [, day, month, time] = deadlineTextMatch;
                const monthNumber = monthMap[month];
                const [hour, minute] = time.split(':');
                // Construct a parsable date string
                extractedData.deadline = `2025-${monthNumber}-${day}T${(parseInt(hour) + 12).toString().padStart(2, '0')}:${minute}`;
            }
        } else {
            // If first pattern matched, convert date
            extractedData.deadline = new Date(deadlineMatch[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).toISOString().slice(0, 16);
        }

        // 7. Update the formData state with the new values
        setFormData(prevData => ({ ...prevData, ...extractedData }));
    };



    const handleCancel = () => {
        if (onCancel) onCancel();
    };
    // Inject CSS for calendar icon color
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                filter: invert(55%) sepia(100%) saturate(500%) hue-rotate(160deg);
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    // Enhanced dynamic colors based on mode
    const cardBg =
        mode === "dark"
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

    const selectBg = mode === "dark"
        ? "bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400"
        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500";


    return (
        <div
            className={`relative rounded-2xl border overflow-hidden group transition-all duration-500 hover:shadow-2xl  ${cardBg} ${mode === "dark"
                ? "hover:shadow-cyan-500/20"
                : "hover:shadow-blue-500/25"
                }`}

        >

            {/* Form container */}

            <form onSubmit={handleSubmit} className="relative flex flex-col lg:flex-row min-h-[16rem] lg:min-h-[18rem] ">
                {/* Left side - Company Logo & Info */}
                <div className={`p-4 rounded-xl border mb-6 ${inputBg}`}>
                    <textarea
                        className={`w-full h-32 p-2 ${inputBg} rounded-md outline-none transition-all duration-200 resize-none`}
                        placeholder="Paste company email text here to auto-fill"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                    ></textarea>
                    <button
                        type="button"
                        onClick={parseAndPopulate}
                        className={`mt-3 w-full rounded-md px-4 py-2 font-mono text-sm font-bold transition-all duration-200 ${mode === "dark" ? "bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30" : "bg-blue-100/80 hover:bg-blue-200/80 text-blue-700 border border-blue-300"}`}
                    >
                        Auto-Fill
                    </button>
                </div>
                <div
                    className={`w-full lg:w-56 relative flex items-center justify-center overflow-hidden lg:border-r border-b lg:border-b-0 ${leftPanelBg} min-h-[12rem]`}
                >
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

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            type="submit"
                            className={`backdrop-blur-sm rounded-lg w-8 h-8 flex items-center justify-center text-xs font-mono border transition-all duration-200 ${mode === "dark"
                                ? "bg-green-500/20 hover:bg-green-500/40 text-green-400 border-green-500/30 hover:border-green-400/60"
                                : "bg-green-100/80 hover:bg-green-200/80 text-green-700 border-green-300 hover:border-green-500"
                                }`}
                            aria-label="Save company"
                        >
                            ✓
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`backdrop-blur-sm rounded-lg w-8 h-8 flex items-center justify-center text-xs font-mono border transition-all duration-200 ${mode === "dark"
                                ? "bg-red-500/20 hover:bg-red-500/40 text-red-400 border-red-500/30 hover:border-red-400/60"
                                : "bg-red-100/80 hover:bg-red-200/80 text-red-700 border-red-300 hover:border-red-500"
                                }`}
                            aria-label="Cancel"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Company Display */}
                    <div className="relative z-10 text-center px-3 py-4 w-full">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${logoContainerBg} border-2 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto relative overflow-hidden`}>
                            <div className={`absolute inset-0 ${mode === "dark"
                                ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                                : "bg-gradient-to-br from-white/20 to-blue-200/20"
                                }`} />
                            <span className={`text-xl sm:text-2xl lg:text-3xl font-mono font-bold relative z-10 ${mode === "dark" ? "text-cyan-400" : "text-white"
                                }`}>
                                {formData.company ? formData.company.charAt(0).toUpperCase() : "+"}
                            </span>
                            <div className={`absolute bottom-1 right-1 lg:bottom-2 lg:right-2 w-1 h-2 lg:h-3 animate-pulse ${mode === "dark" ? "bg-cyan-400" : "bg-blue-200"
                                }`} />
                        </div>

                        <div
                            className={`rounded-lg p-2 border backdrop-blur-sm ${terminalBg}`}
                        >
                            <div className="flex items-center">
                                <span className={`font-mono text-xs sm:text-sm flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"
                                    }`}>
                                    &gt;{" "}
                                </span>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => handleChange("company", e.target.value)}
                                    placeholder="company_name"
                                    className={`font-mono text-sm sm:text-base lg:text-lg font-bold bg-transparent border-none outline-none flex-1 min-w-0 ${mode === "dark" ? "text-white placeholder-gray-500" : "text-gray-100 placeholder-gray-400"
                                        }`}
                                    required
                                />
                                <span className={`animate-pulse flex-shrink-0 ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"
                                    }`}>_</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Form Panel */}
                <div className={`flex-1 p-4 sm:p-6 ${rightPanelBg}`}>
                    {/* Header Section */}
                    <div className="relative mb-4 sm:mb-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0 ">
                            <div className="flex-1 min-w-0">
                                {/* Role */}
                                <div className={`font-mono text-xs sm:text-sm ${textSecondary} mb-1`}>
                                    <span className={mode === "dark" ? "text-purple-500" : "text-purple-700"}>class</span>{" "}
                                    <span className={mode === "dark" ? "text-cyan-500" : "text-blue-600"}>Role</span> {"{"}
                                </div>
                                <div className="ml-2 sm:ml-4 mb-2 mr-3">
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => handleChange("role", e.target.value)}
                                        placeholder="Enter role title"
                                        className={`w-full text-lg sm:text-xl font-mono font-bold rounded-md px-3 py-2 border transition-all duration-200 ${inputBg}`}
                                        required
                                    />
                                </div>
                                <div className={`font-mono text-xs sm:text-sm mb-2 ${textSecondary}`}>
                                    {"}"}
                                </div>

                                {/* Location */}
                                <div className={`flex flex-col sm:flex-row sm:items-center font-mono text-xs sm:text-sm font-bold mr-3 ${textSecondary} space-y-2 sm:space-y-0`}>
                                    <span className={`flex-shrink-0 ${mode === "dark" ? "text-green-500" : "text-emerald-600"}`}>location:</span>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        placeholder="Enter location"
                                        className={`sm:ml-2 flex-1 min-w-0 rounded-md px-3 py-2 border transition-all duration-200 ${inputBg}`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* CTC */}
                            <div className={`rounded-lg overflow-hidden w-full lg:w-[25px] lg:min-w-[120px] flex-shrink-0 ${mode === "dark" ? "bg-black border border-cyan-500/40" : "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300"} shadow-sm`}>
                                <div className={`px-3 py-1 text-xs font-mono flex items-center justify-center ${mode === "dark" ? "bg-gray-800 text-gray-300" : "bg-emerald-600 text-white"}`}>
                                    <span className={mode === "dark" ? "text-cyan-400" : "text-emerald-100"}>CTC</span>
                                </div>
                                <div className="p-3">
                                    <input
                                        type="text"
                                        value={formData.ctc}
                                        onChange={(e) => handleChange("ctc", e.target.value)}
                                        placeholder="0 LPA"
                                        className={`w-full text-center text-lg font-mono font-bold bg-transparent border-none outline-none ${mode === "dark" ? "text-green-500 placeholder-green-600/50" : "text-emerald-700 placeholder-emerald-600/50"}`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Deadline */}
                        <div className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                            ? "bg-red-900/20 border-red-500/40"
                            : "bg-red-50 border-red-300"
                            }`}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-red-500" : "bg-red-500"}`} />
                            <div className={`font-mono text-xs mb-2 ${mode === "dark" ? "text-red-500" : "text-red-600"}`}>
                                DEADLINE
                            </div>
                            <input
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => handleChange("deadline", e.target.value)}
                                className={`w-full font-mono text-sm font-bold rounded-md px-3 py-2 border transition-all duration-200 ${inputBg}`}
                                
                            />
                        </div>

                        {/* OA */}
                        <div className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                            ? "bg-blue-900/20 border-blue-500/40"
                            : "bg-blue-50 border-blue-300"
                            }`}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-blue-500" : "bg-blue-600"}`} />
                            <div className={`font-mono text-xs mb-2 uppercase ${mode === "dark" ? "text-blue-500" : "text-blue-700"}`}>
                                ONLINE_ASSESSMENT
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="datetime-local"
                                    value={formData.oaDate}
                                    onChange={(e) => handleChange("oaDate", e.target.value)}
                                    className={`w-full font-mono text-sm font-bold rounded-md px-3 py-1 border transition-all duration-200 ${inputBg}`}
                                />
                                <select
                                    value={formData.mode}
                                    onChange={(e) => handleChange("mode", e.target.value)}
                                    className={`w-full font-mono text-xs px-2 py-1 rounded border transition-all duration-200 ${selectBg}`}
                                >
                                    <option value="" disabled hidden>Choose Mode</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        {/* Interview */}
                        <div className={`rounded-lg p-4 relative overflow-hidden md:col-span-2 border ${mode === "dark"
                            ? "bg-green-900/20 border-green-500/40"
                            : "bg-emerald-50 border-emerald-300"
                            }`}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-green-500" : "bg-emerald-600"}`} />
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex-1">
                                    <div className={`font-mono text-xs mb-2 ${mode === "dark" ? "text-green-500" : "text-emerald-700"}`}>
                                        INTERVIEW
                                    </div>
                                    <input
                                        type="datetime-local"
                                        value={formData.interVDate}
                                        onChange={(e) => handleChange("interVDate", e.target.value)}
                                        className={`w-full font-mono text-sm font-bold rounded-md px-3 py-2 border transition-all duration-200 ${inputBg}`}
                                    />
                                </div>
                                <div className="flex-shrink-0 sm:w-32">
                                    <select
                                        value={formData.interVMode}
                                        onChange={(e) => handleChange("interVMode", e.target.value)}
                                        className={`w-full font-mono text-xs px-3 py-2 rounded border transition-all duration-200 ${selectBg}`}
                                    >
                                        {/* Placeholder option */}
                                        <option value="" disabled>
                                            Choose Mode
                                        </option>
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default AddCard;