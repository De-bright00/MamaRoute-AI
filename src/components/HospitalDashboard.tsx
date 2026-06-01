import React, { useState } from "react";
import { Hospital, Emergency } from "../types";
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

interface HospitalDashboardProps {
  hospitals: Hospital[];
  emergencies: Emergency[];
  onRefresh: () => void;
  onUpdateEmergencyStatus: (id: string, updates: Partial<Emergency>) => void;
  onOnboardHospital: (hospData: Partial<Hospital>) => Promise<void>;
  onUpdateResources: (id: string, beds: number, ambulances: number) => Promise<void>;
}

export default function HospitalDashboard({ 
  hospitals, 
  emergencies, 
  onRefresh, 
  onUpdateEmergencyStatus,
  onOnboardHospital,
  onUpdateResources
}: HospitalDashboardProps) {
  
  // States
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || "");
  
  // Resource modification state variables
  const [bedsInput, setBedsInput] = useState<number>(0);
  const [ ambulancesInput, setAmbulancesInput ] = useState<number>(0);

  // New Hospital onboarding state variables
  const [newHospName, setNewHospName] = useState("");
  const [newHospAddress, setNewHospAddress] = useState("");
  const [newHospPhone, setNewHospPhone] = useState("");
  const [newHospState, setNewHospState] = useState<"Lagos" | "Abuja" | "Oyo" | "Enugu" | "Kano">("Lagos");
  const [newHospAmbulance, setNewHospAmbulance] = useState(true);
  const [newHospBeds, setNewHospBeds] = useState(15);
  const [newGoogleMapsUrl, setNewGoogleMapsUrl] = useState("");
  const [newAmbulanceModel, setNewAmbulanceModel] = useState("");
  const [newAmbulancePlate, setNewAmbulancePlate] = useState("");
  const [ambulanceFileName, setAmbulanceFileName] = useState("");
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  
  const [onboardSuccess, setOnboardSuccess] = useState(false);
  const [resourceSuccess, setResourceSuccess] = useState(false);

  // Find active clinic object
  const currentHospital = hospitals.find(h => h.id === selectedHospitalId);

  // Filter emergencies linked specifically to this hospital
  const hospitalEmergencies = emergencies.filter(e => e.hospitalId === selectedHospitalId);

  // Synchronise form values when hospital shifts
  React.useEffect(() => {
    if (currentHospital) {
      setBedsInput(currentHospital.availableBeds);
      setAmbulancesInput(currentHospital.availableAmbulances);
    }
  }, [selectedHospitalId, currentHospital]);

  // Handle resource modification update
  const handleSaveResources = async () => {
    if (!selectedHospitalId) return;
    await onUpdateResources(selectedHospitalId, bedsInput, ambulancesInput);
    setResourceSuccess(true);
    setTimeout(() => setResourceSuccess(false), 3000);
  };

  // Handle hospital onboarding submit
  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName.trim() || !newHospAddress.trim()) return;

    await onOnboardHospital({
      name: newHospName,
      address: newHospAddress,
      phoneContact: newHospPhone || "+234 81 000 000",
      state: newHospState,
      hasAmbulance: newHospAmbulance,
      totalBeds: newHospBeds,
      availableBeds: newHospBeds,
      googleMapsUrl: newGoogleMapsUrl || `https://maps.google.com/?q=${newHospName}`,
      ambulanceModel: newHospAmbulance ? newAmbulanceModel : "",
      ambulancePlateNumber: newHospAmbulance ? newAmbulancePlate : "",
      ambulancePhotoName: newHospAmbulance ? ambulanceFileName : "",
    });

    setNewHospName("");
    setNewHospAddress("");
    setNewHospPhone("");
    setNewGoogleMapsUrl("");
    setNewAmbulanceModel("");
    setNewAmbulancePlate("");
    setAmbulanceFileName("");
    setOnboardSuccess(true);
    setTimeout(() => setOnboardSuccess(false), 4000);
  };

  return (
    <div id="hospital-portal" className="bg-[#f8fafc] text-slate-800 min-h-screen p-4 md:p-8">
      
      {/* Selector Heading block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
            Matern-Care Clinic Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage hospital obstetric beds, standby EMT crews, and respond to live maternal SOS triggers.
          </p>
        </div>
        
        {/* Selector dropdown for demo simulation */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Working as:</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 font-semibold text-xs outline-none shadow-sm focus:border-emerald-600 max-w-sm"
          >
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.state}) - {h.onboardingStatus === "verified" ? "Verified" : "Pending Verification"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active clinical status widgets */}
          {currentHospital && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                    {currentHospital.name}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {currentHospital.address}, {currentHospital.state}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 border ${
                    currentHospital.onboardingStatus === "verified"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-500/20"
                      : "bg-amber-50 text-amber-700 border-amber-500/20"
                  }`}>
                    {currentHospital.onboardingStatus === "verified" && <ShieldCheck className="w-4 h-4" />}
                    Status: {currentHospital.onboardingStatus}
                  </span>
                </div>
              </div>

              {/* Resource Management Form */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Standby Ob-Gyn Beds Available</label>
                  <input
                    type="number"
                    min={0}
                    max={currentHospital.totalBeds}
                    value={bedsInput}
                    onChange={(e) => setBedsInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 font-semibold text-sm outline-none focus:bg-white focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Maximum physical beds: {currentHospital.totalBeds}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Available Standby Ambulances</label>
                  <input
                    type="number"
                    min={0}
                    max={currentHospital.totalAmbulances}
                    value={ambulancesInput}
                    disabled={!currentHospital.hasAmbulance}
                    onChange={(e) => setAmbulancesInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 font-semibold text-sm outline-none focus:bg-white focus:border-emerald-500 disabled:opacity-50"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {!currentHospital.hasAmbulance ? "No ambulancs listed" : `Standby Ambulance fleet size: ${currentHospital.totalAmbulances}`}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSaveResources}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition outline-none cursor-pointer"
                  >
                    Save Resource Dials
                  </button>
                  {resourceSuccess && (
                    <span className="text-emerald-600 text-xs font-semibold text-center block">
                      ✔ Resource logs updated!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE DISPATCH CASES ATTACHED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                Active Patient Emergency Referrals ({hospitalEmergencies.length})
              </h3>
              <button 
                onClick={onRefresh}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 shrink-0 cursor-pointer"
              >
                Refresh Cases
              </button>
            </div>

            <div className="space-y-4">
              {hospitalEmergencies.map((err) => (
                <div 
                  key={err.id} 
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm transition-all relative ${
                    err.status === "pending" ? "border-l-rose-500 border-l-4" : "border-slate-200"
                  }`}
                >
                  {/* Status header badge */}
                  <div className="flex justify-between items-start gap-2 mb-4 flex-wrap">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base">{err.patientName}</h4>
                      <p className="text-xs font-mono font-medium text-slate-500">{err.phoneNumber}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        err.severityLevel >= 4 ? "bg-rose-50 text-rose-700 border border-rose-500/20" : "bg-sky-50 text-sky-700 border border-sky-500/20"
                      }`}>
                        Severity: {err.severityLevel}/5
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        err.status === "pending" ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-teal-50 text-teal-800"
                      }`}>
                        {err.status}
                      </span>
                    </div>
                  </div>

                  {/* Case parameters */}
                  <div className="space-y-2.5 text-sm">
                    <p className="text-slate-600 leading-relaxed text-xs">
                      <b className="text-slate-800 uppercase text-[10px] tracking-wide block mb-0.5">Symptoms / Dispatch Logs</b> {err.details}
                    </p>
                    <p className="text-xs text-slate-500">
                      📍 <b className="text-slate-800">Address:</b> {err.address}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      Timestamp: {new Date(err.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Action buttons mapping statuses */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2 flex-wrap justify-end">
                    {err.status === "pending" && (
                      <button
                        onClick={() => onUpdateEmergencyStatus(err.id, { 
                          status: "accepted" 
                        })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        Accept Case Triage
                      </button>
                    )}
                    
                    {err.status === "accepted" && (
                      <button
                        onClick={() => onUpdateEmergencyStatus(err.id, { 
                          status: "dispatched",
                          ambulancePlate: "MAMA-ROUT-LA1",
                          etaMinutes: 10
                        })}
                        className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        🚚 Dispatch Standby Ambulance
                      </button>
                    )}

                    {err.status === "dispatched" && (
                      <button
                        onClick={() => onUpdateEmergencyStatus(err.id, { 
                          status: "arrived" 
                        })}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        Mark as Arrived at Scene
                      </button>
                    )}

                    {err.status === "arrived" && (
                      <button
                        onClick={() => onUpdateEmergencyStatus(err.id, { 
                          status: "completed" 
                        })}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        Mark Case Safe & Completed
                      </button>
                    )}

                    {err.status !== "completed" && err.status !== "cancelled" && (
                      <button
                        onClick={() => onUpdateEmergencyStatus(err.id, { 
                          status: "cancelled" 
                        })}
                        className="px-3 py-2 border border-slate-200 hover:bg-slate-55 text-slate-500 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel Incident
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {hospitalEmergencies.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-slate-800 text-sm">Perfect - No Active Emergencies!</p>
                  <p className="text-slate-400 text-xs mt-1">If a patient triggers SOS within your region, their case will show here instantly.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ONBOARDING REGISTRY FORM SIDEBAR */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-1.5">
              <PlusCircle className="w-5 h-5 text-emerald-600" /> Onboard A New Clinic
            </h3>
            <p className="text-xs text-slate-500">
              Submit registration requests for healthcare licensing approval.
            </p>
          </div>

          <form onSubmit={handleOnboardSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Clinic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ibadan Central Clinic"
                  value={newHospName}
                  onChange={(e) => setNewHospName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">State Region Location</label>
                <select
                  value={newHospState}
                  onChange={(e) => setNewHospState(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja Federal Capital</option>
                  <option value="Oyo">Oyo State (Ibadan)</option>
                  <option value="Enugu">Enugu State</option>
                  <option value="Kano">Kano State</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Maternity Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street and Local Govt Region"
                  value={newHospAddress}
                  onChange={(e) => setNewHospAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Google Maps Coords or URL Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6.4497, 3.4004 or maps.google.com/?q=..."
                  value={newGoogleMapsUrl}
                  onChange={(e) => setNewGoogleMapsUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-mono"
                />
                <span className="text-[9px] text-slate-400 mt-0.5 block">Used to calculate nearest emergency distance.</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Primary Hotline Contact</label>
                <input
                  type="text"
                  required
                  placeholder="+234 800-000-0000"
                  value={newHospPhone}
                  onChange={(e) => setNewHospPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Obstetric Bed Cap</label>
                  <input
                    type="number"
                    min={1}
                    value={newHospBeds}
                    onChange={(e) => setNewHospBeds(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Ambulance Standby</label>
                  <select
                    value={String(newHospAmbulance)}
                    onChange={(e) => setNewHospAmbulance(e.target.value === "true")}
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold cursor-pointer"
                  >
                    <option value="true">Standby Fleet</option>
                    <option value="false">No Standby</option>
                  </select>
                </div>
              </div>

              {newHospAmbulance && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 mt-2 animate-in fade-in duration-200">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Standby Ambulance Registry</h4>
                  <div>
                    <label className="block text-[8px] font-bold uppercase text-slate-400 mb-1">Ambulance Model / Tech Specs</label>
                    <input
                      type="text"
                      required={newHospAmbulance}
                      placeholder="e.g. Toyota HiAce High-Roof ICU"
                      value={newAmbulanceModel}
                      onChange={(e) => setNewAmbulanceModel(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs text-slate-800 rounded-lg p-2 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase text-slate-400 mb-1">Plate / Registration Number</label>
                    <input
                      type="text"
                      required={newHospAmbulance}
                      placeholder="e.g. LA-339-EMG"
                      value={newAmbulancePlate}
                      onChange={(e) => setNewAmbulancePlate(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs text-slate-800 rounded-lg p-2 outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase text-slate-400 mb-1">Upload Standby Asset Photo</label>
                    <div className="border border-dashed border-slate-200 rounded p-2 text-center bg-white">
                      {ambulanceFileName ? (
                        <div>
                          <p className="text-[10px] text-emerald-600 font-semibold">✓ {ambulanceFileName}</p>
                          <button onClick={() => setAmbulanceFileName("")} type="button" className="text-[8px] text-rose-500 hover:underline">Remove</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <input 
                            type="file" 
                            id="ambulance-file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIsPhotoUploading(true);
                                setTimeout(() => {
                                  setAmbulanceFileName(file.name);
                                  setIsPhotoUploading(false);
                                }, 1000);
                              }
                            }}
                          />
                          <label htmlFor="ambulance-file" className="cursor-pointer text-[10.5px] text-slate-500 hover:text-emerald-600">
                            📁 Select Image File
                          </label>
                        </div>
                      )}
                      {isPhotoUploading && <div className="text-[8px] text-slate-400 animate-pulse mt-1">Uploading...</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="hosp-onboard-submit"
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition outline-none cursor-pointer uppercase tracking-wider"
            >
              Request Portal Approval
            </button>

            {onboardSuccess && (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center text-xs text-emerald-800 font-medium">
                ✔ Registry submitted to MamaRoute authorities. Approval pending verifying checks.
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
