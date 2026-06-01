import React from "react";
import { Hospital, Emergency } from "../types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Activity, 
  Building2, 
  AlertTriangle, 
  Timer, 
  Map, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

interface AdminDashboardProps {
  hospitals: Hospital[];
  emergencies: Emergency[];
  onRefresh: () => void;
  onApproveHospital: (id: string, approve: boolean) => Promise<void>;
  onClearAllEmergencies?: () => void;
}

export default function AdminDashboard({ 
  hospitals, 
  emergencies, 
  onRefresh, 
  onApproveHospital 
}: AdminDashboardProps) {

  // Computed state indicators
  const totalCases = emergencies.length;
  const activeCases = emergencies.filter(e => e.status !== "completed" && e.status !== "cancelled").length;
  const completedSafely = emergencies.filter(e => e.status === "completed").length;
  const pendingClinics = hospitals.filter(h => h.onboardingStatus === "pending");
  const verifiedClinicsCount = hospitals.filter(h => h.isVerified).length;

  // Coordinate references
  const stateNodes = [
    { name: "Lagos", lat: 6.4497, lng: 3.4004, x: 80, y: 170 },
    { name: "Abuja", lat: 9.0353, lng: 7.4878, x: 180, y: 110 },
    { name: "Oyo", lat: 7.3916, lng: 3.9054, x: 60, y: 150 },
    { name: "Enugu", lat: 6.4421, lng: 7.5098, x: 180, y: 180 },
    { name: "Kano", lat: 11.9962, lng: 8.5222, x: 220, y: 50 },
  ];

  // 1. Recharts Data: Incidents by state
  const stateData = ["Lagos", "Abuja", "Oyo", "Enugu", "Kano"].map(st => {
    return {
      name: st,
      total: emergencies.filter(e => e.address.includes(st) || (st === "Oyo" && e.address.includes("Ibadan"))).length,
      resolved: emergencies.filter(e => (e.address.includes(st) || (st === "Oyo" && e.address.includes("Ibadan"))) && e.status === "completed").length
    };
  });

  // 2. Recharts Data: Emergency Response Trends over time
  // Grouping active timeline values
  const trendData = [
    { day: "Mon", incidents: 2, responseTime: 12 },
    { day: "Tue", incidents: 4, responseTime: 11 },
    { day: "Wed", incidents: 3, responseTime: 9 },
    { day: "Thu", incidents: 6, responseTime: 10 },
    { day: "Fri", incidents: totalCases, responseTime: 8 },
  ];

  return (
    <div id="admin-hub" className="bg-[#f8fafc] text-slate-800 min-h-screen p-4 md:p-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            Maternity Oversight Hub <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Admin Control</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time control tower monitoring obstetric emergency requests, hospital onboarding flows, and ambulance service latency in Nigeria.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl tracking-wide shadow-sm cursor-pointer"
        >
          Refresh Statistics
        </button>
      </div>

      {/* CORE STATS COUNTER GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Incidents</div>
          <div className="text-3xl font-bold text-slate-900 font-mono flex items-baseline gap-1">
            {totalCases}
            <span className="text-xs font-normal text-slate-400">cases</span>
          </div>
          <Activity className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Operations</div>
          <div className="text-3xl font-bold text-rose-600 font-mono flex items-baseline gap-1">
            {activeCases}
            <span className="text-xs font-normal text-slate-400">pending</span>
          </div>
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Saved Safely (Completed)</div>
          <div className="text-3xl font-bold text-emerald-600 font-mono flex items-baseline gap-1">
            {completedSafely}
            <span className="text-xs font-normal text-slate-400">deliveries</span>
          </div>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Verified Clinics</div>
          <div className="text-3xl font-bold text-slate-900 font-mono">
            {verifiedClinicsCount}<span className="text-slate-400 text-xs"> onboarded</span>
          </div>
          <Building2 className="w-4 h-4 text-sky-500" />
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Avg Response Delay</div>
          <div className="text-3xl font-bold text-slate-900 font-mono flex items-baseline gap-1">
            8.4
            <span className="text-xs font-normal text-slate-400">minutes</span>
          </div>
          <Timer className="w-4 h-4 text-[#0ea5e9]" />
        </div>
      </div>

      {/* CHARTS GRAPHICAL PRESENTATIONS BAR & LINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* State Distributions Bar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-slate-400 tracking-wider">Incidents Distribution by State</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="total" name="Total Alerts" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved Safe" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timelines Line Chart for Average dispatch time */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-slate-400 tracking-wider">Average Ambulance Dispatch Time Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" name="ETA Time (mins)" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="incidents" name="Total Cases" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CLINCAL GEOGRAPHIC SVG MAP OF NIGERIA & ONBOARDING QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Clinic Onboarding Approval Center */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-display font-semibold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Hospital Portal Approval Queue</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {pendingClinics.length} Pending
            </span>
          </h3>

          <div className="space-y-4">
            {pendingClinics.map((h) => (
              <div 
                key={h.id} 
                className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="space-y-2.5 flex-1">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">{h.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">📞 Primary Hotline Contact: <span className="text-emerald-700 font-mono">{h.phoneContact}</span></p>
                  </div>
                  
                  <div className="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-200/60 font-medium">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> 
                      <b className="text-slate-800">Physical Address:</b> {h.address}, {h.state} State
                    </p>
                    <p className="flex items-center gap-1 flex-wrap">
                      <b className="text-slate-800">📍 Google Map Coordinate Anchor:</b> 
                      <a 
                        href={h.googleMapsUrl} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="text-emerald-600 underline font-semibold break-all hover:text-emerald-800"
                        title="Click to verify coordinate authenticity"
                      >
                        {h.googleMapsUrl || "No Link Provided"}
                      </a>
                    </p>
                    <p className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded inline-block font-semibold">
                      ⚠ Admin Instruction: Please click the coordinate URL above to confirm physical registry validity.
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-[11px] text-slate-500">
                      🛏 <b>Obstetric Capacity:</b> {h.totalBeds} Standby Beds
                    </p>
                    {h.hasAmbulance && (
                      <div className="bg-emerald-50/70 p-2.5 rounded border border-emerald-100 text-[11px] text-slate-700 space-y-1">
                        <p className="font-semibold text-emerald-800">🚑 Standby Ambulance Asset Listed</p>
                        <p>Model: <span className="font-bold text-slate-900">{h.ambulanceModel || "Toyota HiAce Ambulance Specs"}</span></p>
                        <p>Plate: <span className="font-mono font-bold text-slate-900">{h.ambulancePlateNumber || "LA-331-MQA"}</span></p>
                        {h.ambulancePhotoName && (
                          <p className="text-slate-500 font-mono text-[10px] flex items-center gap-1 mt-0.5">
                            📎 Uploaded Asset: <span className="underline">{h.ambulancePhotoName}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => onApproveHospital(h.id, true)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer transition uppercase"
                  >
                    <CheckCircle className="w-4 h-4" /> Verify & Approve
                  </button>
                  <button
                    onClick={() => onApproveHospital(h.id, false)}
                    className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer transition uppercase"
                  >
                    <XCircle className="w-4 h-4" /> Reject Registry
                  </button>
                </div>
              </div>
            ))}

            {pendingClinics.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 font-light">
                No pending hospital licensing verification requests currently in queue.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Stylised SVG Map Wrapper - Theme Compliant */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 text-slate-900 shadow-sm overflow-hidden relative space-y-4">
          <div className="absolute inset-0 map-gradient opacity-15 pointer-events-none"></div>
          <h3 className="font-display font-semibold text-sm uppercase text-slate-400 tracking-wider flex items-center gap-1.5 relative z-10">
            <Map className="w-4 h-4 text-emerald-600" /> Interactive Geographic Registry
          </h3>

          <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-4 relative z-10">
            
            {/* Custom SVG geometric Nigeria map outlines */}
            <svg viewBox="0 0 300 240" className="w-full h-full text-slate-200 fill-current opacity-80">
              {/* Outer boundary geometry simulation */}
              <path d="M 40,40 L 260,30 L 280,180 L 140,220 L 30,190 Z" className="fill-slate-100 stroke-slate-350 stroke-2" />
              {/* Nigeria Niger river fork lines */}
              <path d="M 40,110 Q 150,110 150,160 M 150,160 L 150,220 M 150,160 Q 240,110 260,30" className="stroke-slate-200 stroke-2 fill-none" />
            </svg>

            {/* Custom SVG marker points representing current state nodes */}
            {stateNodes.map((node) => {
              // Check if any emergency is located here
              const stateIncidentsCount = emergencies.filter(e => e.address.includes(node.name) && e.status !== "completed").length;
              const hasActiveRescue = stateIncidentsCount > 0;

              return (
                <div 
                  key={node.name}
                  className="absolute group shrink-0" 
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  <div className="relative flex justify-center items-center">
                    {/* Ring ping */}
                    {hasActiveRescue && (
                      <span className="w-4 h-4 absolute bg-rose-500 rounded-full animate-ping opacity-75"></span>
                    )}
                    
                    {/* Circle pin */}
                    <span className={`w-2.5 h-2.5 rounded-full shadow-md cursor-pointer ${
                      hasActiveRescue ? "bg-rose-500" : "bg-emerald-400"
                    }`}></span>

                    {/* Pop out Tooltip label on hover */}
                    <div className="absolute bottom-5 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 p-2 rounded-lg text-[9px] text-white whitespace-nowrap shadow-lg select-none z-50">
                      <b className="font-bold underline text-slate-300">{node.name} Node</b>
                      <span>Lat/Lng: {node.lat}, {node.lng}</span>
                      <span className="text-emerald-400 font-mono">Verified clinics: {hospitals.filter(h => h.state === node.name && h.isVerified).length}</span>
                      <span className="text-rose-400 font-mono">Active Patients: {stateIncidentsCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] space-y-1.5 text-slate-500 relative z-10">
            <p className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span> Active Maternal Rescue Alerts
            </p>
            <p className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span> Verified Clinic Base Points
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
