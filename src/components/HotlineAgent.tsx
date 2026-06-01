import React, { useState } from "react";
import { Hospital, Emergency } from "../types";
import { 
  PhoneCall, 
  User, 
  MapPin, 
  PlusCircle, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Truck, 
  Building2 
} from "lucide-react";

interface HotlineAgentProps {
  hospitals: Hospital[];
  onDispatchEmergency: (emergencyData: Partial<Emergency>) => Promise<void>;
  activeEmergencies: Emergency[];
}

export default function HotlineAgent({ hospitals, onDispatchEmergency, activeEmergencies }: HotlineAgentProps) {
  
  // Simulator input values
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedState, setSelectedState] = useState<"Lagos" | "Abuja" | "Oyo" | "Enugu" | "Kano">("Lagos");
  const [streetAddress, setStreetAddress] = useState("");
  const [severity, setSeverity] = useState<number>(4);
  const [complications, setComplications] = useState("Maternal bleeding reported at home, 37 weeks pregnant.");

  // Geo coords computed based on selected state base point
  const stateCoordinates: Record<string, { lat: number, lng: number }> = {
    Lagos: { lat: 6.4497, lng: 3.4004 },
    Abuja: { lat: 9.0353, lng: 7.4878 },
    Oyo: { lat: 7.3916, lng: 3.9054 },
    Enugu: { lat: 6.4421, lng: 7.5098 },
    Kano: { lat: 11.9962, lng: 8.5222 }
  };

  const currentCoords = stateCoordinates[selectedState];

  // Auto recommend closest hospital
  const recommendedHospital = hospitals
    .filter(h => h.state === selectedState && h.isVerified)
    .map(h => {
      // Basic distance delta
      const dist = Math.sqrt(Math.pow(h.locationLat - currentCoords.lat, 2) + Math.pow(h.locationLng - currentCoords.lng, 2)) * 111; // Approx km
      return { ...h, distanceKm: Number(dist.toFixed(1)) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  const [callRinging, setCallRinging] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Trigger simulated incoming phone call for demo purposes
  const simulateIncomingCall = () => {
    setCallRinging(true);
    setTimeout(() => {
      setCallRinging(false);
      setCallActive(true);
      // Populate mock pre-filled data to speed up demo
      setPatientName("Fatima Bello");
      setPhoneNumber("+234 901 222 3333");
      setSelectedState("Kano");
      setStreetAddress("Sabon Gari Local Govt, Kano");
      setComplications("Severe continuous labor since midnight. 38 weeks gestation. Report of head pain.");
    }, 1500);
  };

  const handleHangup = () => {
    setCallActive(false);
    setPatientName("");
    setPhoneNumber("");
    setStreetAddress("");
    setComplications("");
  };

  // Submit hotline coordinate dispatch trigger
  const handleHotlineDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phoneNumber) return;

    await onDispatchEmergency({
      patientName,
      phoneNumber,
      locationLat: currentCoords.lat,
      locationLng: currentCoords.lng,
      address: `${streetAddress}, ${selectedState} State (Hotline Intake)`,
      emergencyType: "maternal",
      severityLevel: severity,
      hospitalId: recommendedHospital?.id || "",
      hospitalName: recommendedHospital?.name || "",
      details: `Hotline Case Intake. Symptoms: ${complications}`,
      agentId: "offline-agent-01",
      status: "pending"
    });

    setDispatchSuccess(true);
    handleHangup();
    setTimeout(() => setDispatchSuccess(false), 3000);
  };

  return (
    <div id="hotline-coordination" className="bg-[#f8fafc] text-slate-800 min-h-screen p-4 md:p-8">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
            Hotline Triage Call Center
          </h1>
          <p className="text-xs text-rose-650 font-black uppercase tracking-wider font-mono mt-1 text-rose-600">
            📞 24/7 Emergency Maternal Hotline (Nigeria) — Active Gateway: +234 704 585 5451
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Standard operator coordination workflow for phone emergency intakes. Search nearest clinics for offline mamas.
          </p>
        </div>

        {/* Call simulator buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {!callActive && !callRinging ? (
            <button
              onClick={simulateIncomingCall}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 duration-200 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-rose-600/10 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              Simulate Incoming Mama Call
            </button>
          ) : callRinging ? (
            <div className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 uppercase animate-pulse">
              🔔 Incoming line ringing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-emerald-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> Active Call Connected
              </span>
              <button
                onClick={handleHangup}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Hang up
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* OPERATOR DISPATCH INTAKE FORM */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 font-display mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-600" /> Caller Dispatch Ticket
          </h2>

          <form onSubmit={handleHotlineDispatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Patient Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name of patient"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg py-2.5 pl-10 pr-3 outline-none focus:bg-white focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +234 802 000 0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">State / Capital Region</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja Federal Capital</option>
                  <option value="Oyo">Oyo State (Ibadan)</option>
                  <option value="Enugu">Enugu State</option>
                  <option value="Kano">Kano State</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Maternal Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Campbell St, Lagos Island"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Observed Danger Symptoms & Complications</label>
                <textarea
                  rows={3}
                  value={complications}
                  onChange={(e) => setComplications(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:bg-white focus:border-emerald-500"
                  placeholder="Note active alarm signals (e.g. heavy bleeding, water broke, pre-eclampsia headaches)."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Urgency Rank Severity</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`flex-1 py-1.5 uppercase font-bold text-xs rounded-lg transition border ${
                        severity === lvl
                          ? "bg-rose-600 border-rose-600 text-white font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {lvl === 5 ? "5 (SOS)" : lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!patientName || !phoneNumber}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition outline-none cursor-pointer uppercase tracking-wider disabled:opacity-50"
                >
                  🚀 Dispatch Ambulance
                </button>
              </div>
            </div>

            {dispatchSuccess && (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center text-xs text-emerald-800 font-medium">
                ✔ Hotline emergency dispatched successfully. Ambulance and Hospital alert notifications broadcasted!
              </div>
            )}
          </form>
        </div>

        {/* ALGORITHMIC DISPATCH SUGGESTIONS SIDEBAR */}
        <div id="hotline-sidebar" className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-emerald-600" /> Smart Distance Routing
            </h3>
            <p className="text-xs text-slate-500">
              MamaRoute AI calculates proximity, available obstetric bed counts, and ambulance standings to locate optimal support.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 mb-1">State GPS Node</h4>
            <p className="font-mono text-slate-700">Region: {selectedState} ({stateCoordinates[selectedState].lat}, {stateCoordinates[selectedState].lng})</p>
          </div>

          {recommendedHospital ? (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Closest Verified Hospital
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    ~{recommendedHospital.distanceKm} km away
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm font-display">{recommendedHospital.name}</h4>
                  <p className="text-[11px] text-slate-400 font-light">{recommendedHospital.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-0.5 font-semibold">Available Beds</span>
                    <span className="font-mono font-bold text-slate-800">{recommendedHospital.availableBeds}/{recommendedHospital.totalBeds}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-0.5 font-semibold">Ambulances Standby</span>
                    <span className="font-mono font-bold text-slate-800">
                      {recommendedHospital.availableAmbulances ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Badge info */}
              <div className="p-3 bg-sky-50 rounded-lg text-sky-950 text-xs font-light space-y-1">
                <p className="font-bold text-sky-800 uppercase text-[9px] tracking-widest">Clinical Protocol</p>
                <p className="leading-relaxed text-[11px]">
                  Upon clicking submit dispatch, our SMS Gateway (Termii) broadcasts patient coordinates directly to Duty Nurse and Driver on stand-by: <b>{recommendedHospital.phoneContact}</b>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span>No verified clinical facilities detected for {selectedState}. Recommend referring caller to general capital hospitals.</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
