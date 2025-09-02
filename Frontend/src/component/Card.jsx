import React, { useState } from "react";

// Yeh component ek single company card ko display karne ke liye hai.
// Isko parent component se props milte hain jaise company data,
// delete aur edit functions, aur theme mode.
function CompanyCard({ company, onDelete, onEdit, mode }) {
  const [showEmailForm, setShowEmailForm] = useState(false); // Modal ki visibility ke liye state
  const [email, setEmail] = useState(""); // Email input ke liye state

  // Yeh function delete button click hone par chalta hai.
  // Yeh parent component ki onDelete function ko call karta hai,
  // aur company ka data usko bhej deta hai.
  const handleDelete = () => {
    if (onDelete) onDelete(company);
  };

  // Yeh function edit button click hone par chalta hai.
  // Yeh parent component ki onEdit function ko call karta hai,
  // aur current company ka data usko de deta hai.
  const handleEdit = () => {
    if (onEdit) onEdit(company);
  };

  // Naya function: Jab notify button click ho, modal ko show kare.
  const handleNotify = () => {
    // Check karein ki deadline hai ya nahi, tabhi notification bhej sakte hain.
    if (!company.deadline) {
      alert("Deadline not set for this company. Cannot send a reminder.");
      return;
    }
    setShowEmailForm(true); // email input modal ko show kare.
  };

  // Yeh function modal ke "Send" button par click hone par chalta hai.
  const handleSendNotification = async () => {
    if (!email) {
      alert("Email is required to send notification.");
      return;
    }

    try {
      // Await fetch and store response in res
      const res = await fetch(`${process.env.REACT_APP_API_URL}/schedule-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email, companyId: company._id })
      });

      const data = await res.json(); // parse JSON response
      alert(data.message); // "Notification scheduled successfully"
      setShowEmailForm(false);
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule notification. Please check server.");
    }
  };



  // Yahan Tailwind CSS classes ko mode ke hisaab se dynamically set kiya gaya hai.
  // Dark mode aur light mode ke liye alag alag colors define kiye gaye hain.
  const cardBg =
    mode === "dark"
      ? "bg-gray-900 border-gray-700 hover:border-cyan-400/60"
      : "bg-blue border-gray-300 hover:border-blue-800/70 shadow-lg";

  const textPrimary = mode === "dark" ? "text-white" : "text-gray-800";
  const textSecondary = mode === "dark" ? "text-gray-400" : "text-gray-500";

  const leftPanelBg =
    mode === "dark"
      ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray border-gray-700"
      : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-gray-300";

  const rightPanelBg =
    mode === "dark"
      ? "bg-gradient-to-br from-gray-700 to-black"
      : "bg-gradient-to-br from-white via-gray-50 to-blue-50/30";

  const logoContainerBg =
    mode === "dark"
      ? "bg-black border-cyan-400"
      : "bg-gradient-to-br from-indigo-600 to-blue-700 border-indigo-500";

  const terminalBg =
    mode === "dark" ? "bg-black/50 border-cyan-500/30" : "bg-gray-800 border-gray-700";

  const ctcContainerBg =
    mode === "dark"
      ? "bg-black border border-cyan-500/40"
      : "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300";

  const modalBg = mode === "dark" ? "bg-gray-800" : "bg-white";
  const buttonPrimaryBg = mode === "dark" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-100 text-green-700 border-green-300";
  const buttonSecondaryBg = mode === "dark" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-red-100 text-red-700 border-red-300";

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden group transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${cardBg} ${mode === "dark" ? "hover:shadow-cyan-500/20" : "hover:shadow-blue-500/25"
        }`}
    >
      {/* Modal jo tab dikhega jab showEmailForm true ho */}
      {showEmailForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm border ${modalBg} ${mode === "dark" ? "border-cyan-500/30" : "border-blue-300"
            }`}>
            <h3 className={`mb-4 font-mono text-lg font-bold ${textPrimary}`}>
              Email Reminder
            </h3>
            <input
              type="email"
              className={`w-full border p-2 mb-4 rounded font-mono ${mode === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEmailForm(false)}
                className={`px-3 py-1 border rounded font-mono ${buttonSecondaryBg}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className={`px-3 py-1 border rounded font-mono ${buttonPrimaryBg}`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main card container jo flexbox use karke left aur right side ko manage karta hai */}
      <div className="relative flex flex-col lg:flex-row min-h-[16rem] lg:min-h-[18rem]">
        {/* Left side: Company ka logo aur naam dikhane ke liye */}
        <div
          className={`w-full lg:w-56 relative flex items-center justify-center overflow-hidden lg:border-r border-b lg:border-b-0 ${leftPanelBg} min-h-[12rem]`}
        >
          {/* Decorative circuit board overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
              <path
                d="M20 20h160v160H20z"
                stroke={mode === "dark" ? "#00ffff" : "#6366f1"}
                strokeWidth="0.5"
                fill="none"
              />
              {[40, 160].map((x) =>
                [40, 160].map((y) => (
                  <circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={mode === "dark" ? "#00ffff" : "#6366f1"}
                  />
                ))
              )}
              <path
                d="M40 40h120M40 40v120M160 40v120M40 160h120"
                stroke={mode === "dark" ? "#00ffff" : "#6366f1"}
                strokeWidth="0.5"
              />
            </svg>
          </div>

          {/* Edit, Delete, aur Notify buttons */}
          <div className="absolute top-3 right-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleEdit}
              className={`backdrop-blur-sm rounded-lg w-8 h-8 flex items-center justify-center text-s font-mono border transition-all duration-200 ${mode === "dark"
                ? "bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border-cyan-500/30 hover:border-cyan-400/60"
                : "bg-blue-100/80 hover:bg-blue-200/80 text-blue-700 border-blue-300 hover:border-blue-500"
                }`}
              aria-label="Edit company"
            >
              &lt;/&gt;
            </button>
            <button
              onClick={handleDelete}
              className={`backdrop-blur-sm rounded-lg w-8 h-8 flex items-center justify-center text-s font-mono border transition-all duration-200 ${mode === "dark"
                ? "bg-red-500/20 hover:bg-red-500/40 text-red-400 border-red-500/30 hover:border-red-400/60"
                : "bg-red-100/80 hover:bg-red-200/80 text-red-700 border-red-300 hover:border-red-500"
                }`}
              aria-label="Delete company"
            >
              rm
            </button>
            <button
              onClick={handleNotify}
              className={`backdrop-blur-sm rounded-lg w-8 h-8 flex items-center justify-center text-s font-mono border transition-all duration-200 ${mode === "dark"
                ? "bg-green-500/20 hover:bg-green-500/40 text-green-400 border-green-500/30 hover:border-green-400/60"
                : "bg-green-100/80 hover:bg-green-200/80 text-green-700 border-green-300 hover:border-green-500"
                }`}
              aria-label="Send notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </button>
          </div>

          {/* Company ka logo ya first letter aur naam */}
          <div className="relative z-10 text-center px-3 py-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${logoContainerBg} border-2 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto relative overflow-hidden`}
            >
              <div
                className={`absolute inset-0 ${mode === "dark"
                  ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                  : "bg-gradient-to-br from-white/20 to-blue-200/20"
                  }`}
              />
              <span
                className={`text-xl sm:text-2xl lg:text-3xl font-mono font-bold relative z-10 ${mode === "dark" ? "text-cyan-400" : "text-white"
                  }`}
              >
                {company.company.charAt(0)}
              </span>
              <div
                className={`absolute bottom-1 right-1 lg:bottom-2 lg:right-2 w-1 h-2 lg:h-3 animate-pulse ${mode === "dark" ? "bg-cyan-400" : "bg-blue-200"
                  }`}
              />
            </div>

            <div
              className={`rounded-lg p-2 border backdrop-blur-sm max-w-full overflow-hidden ${terminalBg}`}
            >
              <div className="truncate">
                <span
                  className={`font-mono text-s sm:text-sm ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"
                    }`}
                >
                  &gt;{" "}
                </span>
                <span
                  className={`font-mono text-sm sm:text-base lg:text-lg font-bold ${mode === "dark" ? "text-white" : "text-gray-100"
                    }`}
                >
                  {company.company}
                </span>
                <span
                  className={`animate-pulse ${mode === "dark" ? "text-cyan-400" : "text-emerald-400"
                    }`}
                >
                  _
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Yahan par company ki details show hoti hain */}
        <div className={`flex-1 p-4 sm:p-6 ${rightPanelBg}`}>
          <div className="relative mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0">
              <div className="flex-1 min-w-0">
                <div
                  className={`font-mono text-s sm:text-sm ${textSecondary} mb-1`}
                >
                  <span
                    className={mode === "dark" ? "text-purple-500" : "text-purple-700"}
                  >
                    class
                  </span>{" "}
                  <span
                    className={mode === "dark" ? "text-cyan-500" : "text-blue-600"}
                  >
                    Role
                  </span>{" "}
                  {"{"}
                </div>
                {/* Role title */}
                <h3
                  className={`text-lg sm:text-xl font-mono font-bold ml-2 sm:ml-4 mb-2 break-words ${textPrimary}`}
                >
                  "{company.role}"
                </h3>
                <div
                  className={`font-mono text-s sm:text-sm mb-2 ${textSecondary}`}
                >
                  {"}"}
                </div>

                {/* Location */}
                <div
                  className={`flex items-center font-mono text-s sm:text-sm break-all font-bold ${textSecondary}`}
                >
                  <span
                    className={`flex-shrink-0 ${mode === "dark" ? "text-green-500" : "text-emerald-600"
                      }`}
                  >
                    location:
                  </span>
                  <span className={`${textPrimary} ml-2 break-all`}>
                    "{company.location}"
                  </span>
                </div>
              </div>

              {/* CTC section */}
              <div
                className={`rounded-lg overflow-hidden w-full lg:w-auto lg:min-w-[100px] flex-shrink-0 ${ctcContainerBg} shadow-sm`}
              >
                <div
                  className={`px-3 py-1 text-xs font-mono flex items-center justify-center ${mode === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-emerald-600 text-white"
                    }`}
                >
                  <span
                    className={mode === "dark" ? "text-cyan-400" : "text-emerald-100"}
                  >
                    CTC
                  </span>
                </div>
                <div className="p-3 text-center">
                  <div
                    className={`text-lg font-mono font-bold ${mode === "dark" ? "text-green-500" : "text-emerald-700"
                      }`}
                  >
                    {company.ctc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details grid: deadline, OA aur interview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadline */}
            <div
              className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                ? "bg-red-900/20 border-red-500/40"
                : "bg-red-50 border-red-300"
                }`}
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-red-500" : "bg-red-500"
                  }`}
              />
              <div
                className={`font-mono text-s mb-1 ${mode === "dark" ? "text-red-500" : "text-red-600"
                  }`}
              >
                DEADLINE
              </div>
              <span className={`font-mono text-m font-bold ${textPrimary}`}>
                {/* new Date() se server-side date string ko readable format mein convert kiya gaya hai */}
                {new Date(company.deadline).toLocaleString()}
              </span>
            </div>

            {/* Online Assessment (OA) */}
            <div
              className={`rounded-lg p-4 relative overflow-hidden border ${mode === "dark"
                ? "bg-blue-900/20 border-blue-500/40"
                : "bg-blue-50 border-blue-300"
                }`}
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-blue-500" : "bg-blue-600"
                  }`}
              />
              <div
                className={`font-mono text-s mb-1 uppercase ${mode === "dark" ? "text-blue-500" : "text-blue-700"
                  }`}
              >
                ONLINE_ASSESSMENT
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`font-mono text-m font-bold ${textPrimary}`}
                >
                  {/* Agar oaDate hai toh dikhao, warna "Not mentioned" */}
                  {company.oaDate ? new Date(company.oaDate).toLocaleString() : "Not mentioned"}
                </span>
                <span
                  className={`font-mono text-s px-2 py-1 rounded ${mode === "dark"
                    ? "text-blue-400 bg-blue-900/40"
                    : "text-blue-800 bg-blue-100 border border-blue-400"
                    }`}
                >
                  {company.mode ? company.mode : "NA"}
                </span>
              </div>
            </div>

            {/* Interview */}
            <div
              className={`rounded-lg p-4 relative overflow-hidden md:col-span-2 border ${mode === "dark"
                ? "bg-green-900/20 border-green-500/40"
                : "bg-emerald-50 border-emerald-300"
                }`}
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${mode === "dark" ? "bg-green-500" : "bg-emerald-600"
                  }`}
              />
              <div className="flex justify-between items-center">
                <div>
                  <div
                    className={`font-mono text-s mb-1 ${mode === "dark" ? "text-green-500" : "text-emerald-700"
                      }`}
                  >
                    INTERVIEW
                  </div>
                  <span
                    className={`font-mono text-m font-bold ${textPrimary}`}
                  >
                    {/* Agar interVDate hai toh dikhao, warna "Not mentioned" */}
                    {company.interVDate ? new Date(company.interVDate).toLocaleString() : "Not mentioned"}
                  </span>
                </div>
                <div
                  className={`font-mono text-s px-3 py-1 rounded border ${mode === "dark"
                    ? "text-green-400 bg-green-900/40 border-green-500/30"
                    : "text-emerald-800 bg-emerald-100 border-emerald-400"
                    }`}
                >
                  {company.interVMode ? company.interVMode : "NA"}
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