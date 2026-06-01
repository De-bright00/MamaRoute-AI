import React, { useState, useEffect } from "react";
import { Hospital, Emergency } from "./types";
import LandingPage from "./components/LandingPage";
import PatientApp from "./components/PatientApp";
import HospitalDashboard from "./components/HospitalDashboard";
import HotlineAgent from "./components/HotlineAgent";
import AdminDashboard from "./components/AdminDashboard";
import HospitalOnboarding from "./components/HospitalOnboarding";
import { 
  Building2, 
  Activity, 
  RefreshCw 
} from "lucide-react";

export default function App() {
  const [activeRole, setActiveRole] = useState<string>("visitor");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string>("Synced");

  // Fetch all stats from Express Node API on mount and on refresh
  const fetchData = async () => {
    setSyncStatus("Syncing...");
    try {
      const hRes = await fetch("/api/hospitals");
      if (!hRes.ok) throw new Error(`HTTP error ${hRes.status}`);
      const hContentType = hRes.headers.get("content-type");
      if (!hContentType || !hContentType.includes("application/json")) {
        throw new Error("Expected JSON response from hospitals endpoint");
      }
      const hData = await hRes.json();
      setHospitals(hData);

      const eRes = await fetch("/api/emergencies");
      if (!eRes.ok) throw new Error(`HTTP error ${eRes.status}`);
      const eContentType = eRes.headers.get("content-type");
      if (!eContentType || !eContentType.includes("application/json")) {
        throw new Error("Expected JSON response from emergencies endpoint");
      }
      const eData = await eRes.json();
      setEmergencies(eData);

      setSyncStatus("Synced");
    } catch (err) {
      console.error("Failed to sync platform parameters with backend:", err);
      setSyncStatus("Offline");
    } finally {
      setIsLoading(false);
    }
  };

  // Route listener to capture /onboard or #hospital-onboarding
  useEffect(() => {
    fetchData();
    // Auto-poll emergencies every 8 seconds to make the real-time simulation feel alive
    const interval = setInterval(fetchData, 8000);

    const handleRouteChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === "/onboard" || path === "/hospital-onboarding" || hash === "#onboard" || hash === "#hospital-onboarding") {
        setActiveRole("onboarding");
      } else if (path === "/patient" || hash === "#patient") {
        setActiveRole("patient");
      } else if (path === "/hospital" || hash === "#hospital") {
        setActiveRole("hospital");
      } else if (path === "/agent" || hash === "#agent") {
        setActiveRole("agent");
      } else if (path === "/admin" || hash === "#admin") {
        setActiveRole("admin");
      } else {
        setActiveRole("visitor");
      }
    };

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    if (role === "visitor") {
      window.history.pushState({}, "", "/");
      window.location.hash = "";
    } else if (role === "onboarding") {
      window.history.pushState({}, "", "/hospital-onboarding");
      window.location.hash = "#hospital-onboarding";
    } else {
      window.history.pushState({}, "", `/${role}`);
      window.location.hash = `#${role}`;
    }
  };

  // Handler: SOS trigger or Hotline dispatch
  const handleCreateEmergency = async (incident: Partial<Emergency>) => {
    try {
      setSyncStatus("Syncing...");
      const res = await fetch("/api/emergencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incident)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Failed to post active emergency to server:", err);
    }
  };

  // Handler: Hospital accepts/dispatches/arrives/completes emergency
  const handleUpdateEmergencyStatus = async (id: string, updates: Partial<Emergency>) => {
    try {
      setSyncStatus("Syncing...");
      const res = await fetch(`/api/emergencies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Failed to update active incident status:", err);
    }
  };

  // Handler: Onboard clinic registration
  const handleOnboardHospital = async (hosp: Partial<Hospital>) => {
    try {
      setSyncStatus("Syncing...");
      const res = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hosp)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Failed to onboard hospital registry:", err);
    }
  };

  // Handler: Hospital manual resource adjustment
  const handleUpdateResources = async (id: string, beds: number, ambulances: number) => {
    try {
      setSyncStatus("Syncing...");
      const res = await fetch(`/api/hospitals/${id}/resources`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableBeds: beds, availableAmbulances: ambulances })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Failed to update hospital resources:", err);
    }
  };

  // Handler: Admin verifies/rejects pending onboarding status
  const handleApproveHospital = async (id: string, approve: boolean) => {
    try {
      setSyncStatus("Syncing...");
      const res = await fetch(`/api/hospitals/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: approve ? "verified" : "rejected" })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Failed to update hospital verification status:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* GLOBAL HEADER BANNER */}
      <header className="bg-white border-b border-slate-205 sticky top-0 z-50 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20">
              <span className="font-extrabold text-white text-base">M</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">MamaRoute<span className="text-blue-600">AI</span></span>
          </div>

          {/* Persona Role Navigation selectors */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none bg-slate-50 p-1 rounded-xl border border-slate-100 max-w-full">
            <button
              onClick={() => handleRoleChange("visitor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeRole === "visitor" 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Public Hub
            </button>
            <button
              id="role-patient-app"
              onClick={() => handleRoleChange("patient")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeRole === "patient" 
                  ? "bg-white text-rose-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-rose-600"
              }`}
            >
              Patient SOS Console
            </button>
            
            {/* LINK TO THE NEW DEDICATED ONBOARDING PAGE */}
            <button
              onClick={() => handleRoleChange("onboarding")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeRole === "onboarding" 
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-blue-600"
              }`}
            >
              For Hospitals (Join Network)
            </button>

            <button
              id="role-hospital-portal"
              onClick={() => handleRoleChange("hospital")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeRole === "hospital" 
                  ? "bg-white text-[#0ea5e9] shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-[#0ea5e9]"
              }`}
            >
              Partner Portal
            </button>
            <button
              id="role-callcenter"
              onClick={() => handleRoleChange("agent")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeRole === "agent" 
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              Hotline Workplace
            </button>
            <button
              id="role-admin-hub"
              onClick={() => handleRoleChange("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeRole === "admin" 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Oversight Admin
            </button>
          </nav>

          {/* Sync status */}
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-705 transition duration-150 cursor-pointer border border-transparent hover:border-slate-200"
              title="Manual Sync"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Sync: {syncStatus}</span>
            </div>
          </div>

        </div>
      </header>

      {/* RENDER ACTIVE APP VIEW */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-widest">
              Securing clinical databases...
            </h3>
            <p className="text-xs text-slate-400">MamaRoute registers parameters and connects regional base stations.</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {activeRole === "visitor" && (
              <LandingPage 
                hospitals={hospitals} 
                onNavigateToRole={handleRoleChange} 
              />
            )}
            
            {activeRole === "onboarding" && (
              <HospitalOnboarding 
                onOnboardHospital={handleOnboardHospital}
              />
            )}
            
            {activeRole === "patient" && (
              <PatientApp 
                hospitals={hospitals} 
                onTriggerSOS={handleCreateEmergency} 
                activeEmergencies={emergencies} 
              />
            )}

            {activeRole === "hospital" && (
              <HospitalDashboard 
                hospitals={hospitals} 
                emergencies={emergencies} 
                onRefresh={fetchData} 
                onUpdateEmergencyStatus={handleUpdateEmergencyStatus}
                onOnboardHospital={handleOnboardHospital}
                onUpdateResources={handleUpdateResources}
              />
            )}

            {activeRole === "agent" && (
              <HotlineAgent 
                hospitals={hospitals} 
                onDispatchEmergency={handleCreateEmergency}
                activeEmergencies={emergencies}
              />
            )}

            {activeRole === "admin" && (
              <AdminDashboard 
                hospitals={hospitals} 
                emergencies={emergencies} 
                onRefresh={fetchData} 
                onApproveHospital={handleApproveHospital}
              />
            )}
          </div>
        )}
      </main>

    </div>
  );
}
