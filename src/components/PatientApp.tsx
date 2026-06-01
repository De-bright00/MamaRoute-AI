import React, { useState, useEffect, useRef } from "react";
import { Hospital, Emergency, ChatMessage } from "../types";
import { CORRESPONDING_LANGUAGES } from "../data";
import { 
  Send, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  AlertOctagon, 
  Activity, 
  User, 
  Compass, 
  Clock,
  Volume2,
  Info
} from "lucide-react";

interface PatientAppProps {
  hospitals: Hospital[];
  onTriggerSOS: (newEmergency: Partial<Emergency>) => void;
  activeEmergencies: Emergency[];
}

export default function PatientApp({ hospitals, onTriggerSOS, activeEmergencies }: PatientAppProps) {
  // Configured local state trackers
  const [selectedLang, setSelectedLang] = useState<"English" | "Pidgin" | "Yoruba" | "Hausa">("English");
  
  // Patient profiling state
  const [fullName, setFullName] = useState<string>("Chinyere Adebayo");
  const [phone, setPhone] = useState<string>("+234 802 345 6789");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [dueDate, setDueDate] = useState<string>("2026-07-15");
  const [parity, setParity] = useState<string>("G2 P1");
  const [currentLGA, setCurrentLGA] = useState<string>("Lagos Island");

  // Geopoints State
  const [lat, setLat] = useState<number>(6.4497);
  const [lng, setLng] = useState<number>(3.4004);

  // Real Geolocation validation and permission variables
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('prompt');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [detectorMessage, setDetectorMessage] = useState<string>("");

  const requestLocationPermission = () => {
    setLocationStatus('checking');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLat(latitude);
        setLng(longitude);
        setGpsCoords({ lat: latitude, lng: longitude });
        setLocationStatus('granted');
        setDetectorMessage("Location detected. Connecting you to nearest emergency support…");
      },
      (error) => {
        console.error("Location access denied or unavailable:", error);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // AI chat states
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "ch-initial",
      role: "model",
      text: "Hello! I am your safe MamaRoute Maternal Assistant. How are you feeling today? You can ask me any maternal health concerns, or describe symptoms like cramping or bleeding. \n\n*Safety Notice:* I provide educational guidance, not emergency doctor diagnosis. If you have severe symptoms, please click the red SOS immediately!",
      createdAt: new Date().toISOString()
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Synchronize initial greeting translation when user switches between Pidgin, Yoruba, and Hausa
  useEffect(() => {
    if (chatHistory.length === 1 && chatHistory[0].id === "ch-initial") {
      let localizedText = "";
      if (selectedLang === "Pidgin") {
        localizedText = "Hello! I be your safe MamaRoute Maternal Assistant. How you dey feel today? You fit ask me any maternal health matter, or describe symptoms like pain or bleeding. \n\n*Safety Notice:* I dey give advice but I no be real doctor. If severe symptoms dey, press the red SOS immediately!";
      } else if (selectedLang === "Yoruba") {
        localizedText = "Pẹlẹ o! Emi ni Oluranlọwọ Abiyamo MamaRoute rẹ. Bawo ni ara rẹ loni? O le beere awọn ibeere nipa ilera oyún rẹ, tabi sọ bi ara rẹ ba n dahu bii tita ẹjẹ tabi irora. \n\n*Abo lọwọ rẹ:* Imọran nikan ni mo n sọ, kii ṣe ayẹwo dokita pajawiri. Ti ami ewu ba wa, tẹ SOS pajawiri ni kiakia!";
      } else if (selectedLang === "Hausa") {
        localizedText = "Sannu! Ni ce mataimakiyar ku ta lafiyar mata juna biyu na MamaRoute. Yaya kuke ji yau? Kuna iya tambayara kowace damuwa ta lafiyar ciki, ko bayyana alamomi kamar zubar jini ko ciwon ciki. \n\n*Kariya:* Shawarwari ne kawai, ba maganin likita na gaggawa ba. Idan akwai matsananciyar matsala, danna SOS kusa!";
      } else {
        localizedText = "Hello! I am your safe MamaRoute Maternal Assistant. How are you feeling today? You can ask me any maternal health concerns, or describe symptoms like cramping or bleeding. \n\n*Safety Notice:* I provide educational guidance, not emergency doctor diagnosis. If you have severe symptoms, please click the red SOS immediately!";
      }
      setChatHistory([{
        id: "ch-initial",
        role: "model",
        text: localizedText,
        createdAt: new Date().toISOString()
      }]);
    }
  }, [selectedLang]);

  // Active Emergency toggle state
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [recentTriggeredId, setRecentTriggeredId] = useState<string | null>(null);
  const [dangerWarningDetected, setDangerWarningDetected] = useState<boolean>(false);

  // Emergency Hotline Concept modal toggle
  const [showHotlineWorkflow, setShowHotlineWorkflow] = useState<boolean>(false);

  const langContent = CORRESPONDING_LANGUAGES[selectedLang];

  // Auto-scroll chat tracker
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isAiLoading]);

  // Adjust coordinates dynamically when LGA changes to keep math credible
  useEffect(() => {
    if (currentLGA === "Lagos Island") {
      setLat(6.4497);
      setLng(3.4004);
    } else if (currentLGA === "Abuja Garki") {
      setLat(9.0353);
      setLng(7.4878);
    } else if (currentLGA === "Ibadan Yemetu") {
      setLat(7.3916);
      setLng(3.9054);
    } else if (currentLGA === "Enugu GRA") {
      setLat(6.4421);
      setLng(7.5098);
    } else if (currentLGA === "Kano Kofar Mata") {
      setLat(11.9962);
      setLng(8.5222);
    }
  }, [currentLGA]);

  // Direct AI healthcare assistant dispatch
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      text: chatInput,
      createdAt: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: chatHistory.map(h => ({ role: h.role, text: h.text })),
          language: selectedLang
        })
      });
      const data = await response.json();
      
      const isDanger = !!data.isEmergencyTriggered;
      if (isDanger) {
        setDangerWarningDetected(true);
      }

      const modelMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "model",
        text: data.text || "I was unable to understand your query. Please provide symptoms or nutrition questions.",
        isEmergencyTriggered: isDanger,
        createdAt: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, modelMsg]);

    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `chat-err-${Date.now()}`,
        role: "model",
        text: "I lost connection to the server. If you are experiencing bleeding, severe abdominal pain, or dizziness, please press the Red SOS Button immediately!",
        createdAt: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // SOS broadcast coordinator
  const triggerEmergency = () => {
    // Requirement check: Verify that locationStatus is 'granted' before allowing the emergency broadcast
    if (locationStatus !== 'granted') {
      // Otherwise list as denied to trigger the mandatory location modal overlay
      setLocationStatus('denied');
      return;
    }

    if (!gpsCoords) {
      // If coordinates are not loaded yet
      setLocationStatus('denied');
      requestLocationPermission();
      return;
    }

    // Step 3: If allowed → send latitude, longitude, timestamp, user profile (if available)
    setSosActive(true);
    const incidentId = `em-client-${Date.now()}`;
    setRecentTriggeredId(incidentId);

    const newIncident: Partial<Emergency> = {
      patientName: fullName || "Anonymous Mother",
      phoneNumber: phone || "+234 802 345 6789",
      locationLat: gpsCoords.lat,
      locationLng: gpsCoords.lng,
      emergencyType: "maternal",
      severityLevel: 5,
      address: `Real GPS Coordinates: ${gpsCoords.lat.toFixed(5)}, ${gpsCoords.lng.toFixed(5)}`,
      details: `SOS trigger broadcast. Patient Parity: ${parity}. Due Date: ${dueDate}. Blood Group: ${bloodGroup}. Language Preferred: ${selectedLang}. Requested Timestamp: ${new Date().toISOString()}`
    };

    onTriggerSOS(newIncident);
  };

  // Retrieve current active emergency details if triggered
  const matchedEmergency = activeEmergencies.find(
    e => e.patientName === (fullName || "Anonymous Mother") && e.status !== "completed" && e.status !== "cancelled"
  );

  return (
    <div id="patient-app-dashboard" className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-6 text-slate-800">
      
      {/* Title & Description Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
            Maternal Emergency Action Console 
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            {langContent.tagline}
          </p>
        </div>
        
        {/* Language selector (fully functional English, Pidgin, Yoruba, Hausa) */}
        <div className="flex flex-col items-end gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Language Toggle:</label>
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedLang("English")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLang === "English"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang("Pidgin")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLang === "Pidgin"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pidgin
            </button>
            <button
              onClick={() => setSelectedLang("Yoruba")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLang === "Yoruba"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yoruba
            </button>
            <button
              onClick={() => setSelectedLang("Hausa")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLang === "Hausa"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hausa
            </button>
          </div>
        </div>
      </div>

      {/* GPS Location Status & Anchor Bar */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/15 rounded-xl text-emerald-400 shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Live Real-Time GPS Tracker</h4>
            <p className="text-xs text-slate-400">
              {locationStatus === 'granted' 
                ? "✔ Real GPS data captured and live. Active emergency coordination enabled." 
                : "Checking browser geolocation permission..."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {locationStatus === 'granted' && gpsCoords && (
            <div className="space-y-1 bg-emerald-950/50 border border-emerald-500/30 p-2 py-1.5 px-3 rounded-xl">
              <span className="text-[9px] text-emerald-400 font-bold uppercase block font-mono">Real-time Location Captured</span>
              <div className="text-white font-mono font-bold leading-none mt-0.5">
                Lat: {gpsCoords.lat.toFixed(5)} / Lng: {gpsCoords.lng.toFixed(5)}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Demo Testing Coordinates</span>
            <select
              value={currentLGA}
              onChange={(e) => {
                setCurrentLGA(e.target.value);
                const manualCoords: Record<string, { lat: number, lng: number }> = {
                  "Lagos Island": { lat: 6.4497, lng: 3.4004 },
                  "Abuja Garki": { lat: 9.0353, lng: 7.4878 },
                  "Ibadan Yemetu": { lat: 7.3916, lng: 3.9054 },
                  "Enugu GRA": { lat: 6.4421, lng: 7.5098 },
                  "Kano Kofar Mata": { lat: 11.9962, lng: 8.5222 }
                };
                if (manualCoords[e.target.value]) {
                  setLat(manualCoords[e.target.value].lat);
                  setLng(manualCoords[e.target.value].lng);
                  setGpsCoords(manualCoords[e.target.value]);
                  setLocationStatus('granted');
                }
              }}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2 font-mono text-xs cursor-pointer outline-none focus:border-sky-500"
            >
              <option value="Lagos Island">Lagos Island, Lagos (Demo) (6.4497, 3.4004)</option>
              <option value="Abuja Garki">Garki, Abuja (Demo) (9.0353, 7.4878)</option>
              <option value="Ibadan Yemetu">Yemetu, Ibadan (Demo) (7.3916, 3.9054)</option>
              <option value="Enugu GRA">GRA, Enugu (Demo) (6.4421, 7.5098)</option>
              <option value="Kano Kofar Mata">Kofar Mata, Kano (Demo) (11.9962, 8.5222)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Tri-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Prenatal Profile Card */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-205 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-600" /> Expectant Mother Profile
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Mock credentials sent with SOS alerts during referrals.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold outline-none focus:bg-white focus:border-sky-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Telephone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono outline-none focus:bg-white focus:border-sky-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-lg p-2 font-bold cursor-pointer text-slate-800"
                >
                  <option value="O+">O (+)</option>
                  <option value="O-">O (-)</option>
                  <option value="A+">A (+)</option>
                  <option value="B+">B (+)</option>
                  <option value="AB+">AB (+)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Gestation / Parity</label>
                <input
                  type="text"
                  placeholder="e.g. G2 P1"
                  value={parity}
                  onChange={(e) => setParity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold outline-none focus:bg-white focus:border-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Due Date (EDD)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold outline-none focus:bg-white focus:border-sky-500 text-slate-800"
              />
            </div>
          </div>

          <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-xl space-y-1.5 text-[11px] text-sky-950">
            <h5 className="font-extrabold text-sky-900 flex items-center gap-1 uppercase text-[9px] tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Routine Checklists
            </h5>
            <div className="space-y-1 pt-1 font-medium">
              <label className="flex items-center gap-2 cursor-pointer text-slate-750">
                <input type="checkbox" defaultChecked className="rounded text-sky-600 focus:ring-0 cursor-pointer" />
                <span>Routine iron/folic doses taken</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-750">
                <input type="checkbox" defaultChecked className="rounded text-sky-600 focus:ring-0 cursor-pointer" />
                <span>Abundant clean water hydration</span>
              </label>
            </div>
          </div>
        </div>

        {/* Central Column: Emergency SOS Trigger Area & Confirmation Message */}
        <div id="central-sos-section" className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 text-center">
            <h3 className="font-display font-black text-rose-600 text-base uppercase tracking-wider">
              PRIMARY SOS BROADCAST MODULE
            </h3>
            <p className="text-slate-500 text-[11px] font-medium mt-0.5">
              Rapid obstetric coordinator system connecting mothers to medical responders instantly.
            </p>
          </div>

          {/* Location Access Confirmation Flag */}
          {locationStatus === "granted" && gpsCoords && (
            <div className="bg-emerald-50 border border-emerald-350 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-emerald-900 font-bold animate-in fade-in duration-300">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
              <p>Location detected. Connecting you to nearest emergency support…</p>
            </div>
          )}

          {/* SOS CONFIRMATION STATUS DISPLAY */}
          {sosActive || matchedEmergency ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* PRIMARY REQUIREMENT MESSAGE DISPLAYED */}
              <div className="bg-rose-50 border-2 border-rose-500 p-5 rounded-xl text-rose-950 space-y-3 shadow-sm text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 mx-auto border border-rose-300 animate-pulse">
                  <Activity className="w-6 h-6 text-rose-600" />
                </div>
                
                <h4 className="font-display font-black text-base text-rose-900 uppercase tracking-tight">
                  Emergency is being processed
                </h4>
                
                {/* STRICT REQUIRED CONFIRMATION TEXT */}
                <p className="text-xs bg-rose-100 text-rose-950 font-black py-2.5 px-3 rounded-lg border border-rose-300 tracking-wide">
                  "Your emergency has been sent to 3 nearby hospitals"
                </p>

                <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                  Maternal GPS Location Detected:<br />
                  <span className="font-mono text-xs font-black text-rose-700">{lat?.toFixed(5) ?? "6.4497"}, {lng?.toFixed(5) ?? "3.4004"}</span><br />
                  Timestamp Flagged: <span className="font-mono text-[10px] text-slate-500">{new Date().toLocaleTimeString()}</span>
                </p>

                {fullName && (
                  <div className="border border-rose-200 bg-white/50 rounded-lg p-3 text-left text-[11px] space-y-1">
                    <p className="text-rose-600 uppercase text-[9px] font-mono font-black tracking-wider">Patient Profile Attached</p>
                    <p className="font-bold text-slate-800">Name: <span className="font-semibold text-slate-700">{fullName}</span></p>
                    <p className="font-bold text-slate-800">Phone: <span className="font-semibold text-slate-700">{phone}</span></p>
                    <p className="font-bold text-slate-800">Gestation/Blood: <span className="font-semibold text-slate-700">{parity} | Blood Type {bloodGroup}</span></p>
                  </div>
                )}
              </div>

              {/* Status details block from the simulated database */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase font-mono">
                  <span>Dispatch Network Status</span>
                  <span className="text-sky-700 font-black">#{matchedEmergency ? matchedEmergency.status : "pending"}</span>
                </div>
                
                <div className="text-[11px] leading-relaxed font-semibold text-slate-700">
                  {(!matchedEmergency || matchedEmergency.status === "pending") && (
                    <p className="text-amber-800 font-bold animate-pulse">⏰ Pending Hospital Intake: Desk staffs are reviewing your vitals and labor status...</p>
                  )}
                  {matchedEmergency && matchedEmergency.status === "accepted" && (
                    <p className="text-emerald-800">🏥 <b>{matchedEmergency.hospitalName}</b> accepted your triage! Bed and neonatal stations prepared.</p>
                  )}
                  {matchedEmergency && matchedEmergency.status === "dispatched" && (
                    <p className="text-blue-900 font-bold">🚚 Standby Ambulance en-route from {matchedEmergency.hospitalName}! (Simulated arrival countdown in progress).</p>
                  )}
                </div>
              </div>

              {/* Offline backup disclaimer using the REAL line number */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-600 text-[10.5px]">
                <p className="font-mono font-bold text-slate-900 uppercase text-[9px] mb-1">🚑 TRANSPORT DISPATCH PROCEDURES:</p>
                In an actual critical obstetric emergency, if an ambulance is not readily available or delayed, please immediately recruit a native taxi/Keke, or call our 24/7 emergency hotline: <b className="text-rose-600 font-mono"><a href="tel:+2347045855451" className="hover:underline">+234 704 585 5451</a></b>.
              </div>

              <div className="text-center pt-2">
                <button 
                  onClick={() => {
                    setSosActive(false);
                    setRecentTriggeredId(null);
                  }}
                  className="text-xs text-rose-600 hover:underline font-bold uppercase tracking-wider cursor-pointer"
                >
                  Reset SOS Session View
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center py-6 space-y-5">
              
              {/* Massive Red SOS Button */}
              <button
                id="mobile-sos-btn"
                onClick={triggerEmergency}
                className="w-44 h-44 bg-rose-600 hover:bg-rose-500 duration-150 rounded-full border-[12px] border-slate-100 shadow-xl shadow-rose-600/25 flex flex-col items-center justify-center cursor-pointer relative group scale-100 active:scale-95 shrink-0"
              >
                <span className="absolute inset-0 rounded-full bg-rose-600/15 animate-ping"></span>
                <Activity className="w-10 h-10 text-white mb-1.5 group-hover:scale-110 duration-200 animate-bounce" />
                <span className="text-sm font-black text-white tracking-widest block font-display">
                  TAP SOS
                </span>
              </button>

              <div className="text-center space-y-1.5 px-4 max-w-sm">
                <p className="text-xs font-black text-rose-600 uppercase tracking-widest font-mono">
                  ONE-TAP OBSTETRIC ALERTS
                </p>
                <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                  Enforces real-time location detection to bind with professional emergency medical responders.
                </p>
              </div>

              {/* Call Hotline section (Highly Visible Emergency Action, secondary only to SOS) */}
              <div className="w-full bg-rose-50/70 border-2 border-rose-200 p-4 rounded-xl text-center space-y-2.5 shadow-sm">
                <p className="text-xs font-black text-rose-800 uppercase tracking-wider font-mono">
                  📞 24/7 Emergency Maternal Hotline (Nigeria)
                </p>
                <a
                  href="tel:+2347045855451"
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 duration-150 text-white rounded-xl text-sm font-black shadow transition group"
                >
                  <PhoneCall className="w-4 h-4 text-white animate-pulse" />
                  +234 704 585 5451
                </a>
                <p className="text-[10px] text-rose-800 font-bold block">
                  Call now for offline emergency support
                </p>
              </div>

            </div>
          )}

          {/* DANGER WARNING SYSTEM INJECTED (AI Triggered) */}
          {dangerWarningDetected && (
            <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-xl text-rose-950 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                <h4 className="font-bold text-xs uppercase text-rose-800 tracking-wider font-mono">Danger Sign Detection Warned!</h4>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                Our safety assistant detected obstetric warnings (e.g., bleeding, cramping, loss of fetal movement). <b>We strongly recommend you immediately trigger the red SOS button above or proceed to the nearest verified clinic immediately.</b>
              </p>
              <button
                onClick={() => setDangerWarningDetected(false)}
                className="text-[10px] text-slate-500 hover:underline hover:text-slate-700 block text-right cursor-pointer"
              >
                Acknowledge Warning
              </button>
            </div>
          )}

          {/* Hotline Workflow Explanation modal */}
          {showHotlineWorkflow && (
            <div className="bg-slate-50 border border-slate-205 p-4 rounded-xl space-y-3 animate-in slide-in-from-bottom-2 duration-200 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 uppercase font-mono tracking-wider">Hotline Agent Concept Flow:</h4>
                <button 
                  onClick={() => setShowHotlineWorkflow(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold block"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-650 leading-relaxed font-semibold">
                An offline voice assistant or agent handles emergencies when internet coverage is absent:
              </p>
              <ol className="list-decimal pl-4 text-slate-600 space-y-1 font-medium">
                <li><b>Patient dials:</b> Mother calls the toll-free Hotline.</li>
                <li><b>Agent logs:</b> The call agent records coordinates and parity.</li>
                <li><b>Wards notified:</b> Hospital dashboard receives sirens.</li>
              </ol>
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    setShowHotlineWorkflow(false);
                    // Force navigation to agent workplace role to try it out
                    const elem = document.getElementById("role-callcenter");
                    if (elem) elem.click();
                  }}
                  className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Try Hotline agent work view
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Triage Assistant and Clinic lookup */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: AI Maternal Safety Triage Assistant */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-850 shadow-lg space-y-4">
            <div className="border-b border-slate-850 pb-3 block">
              <h3 className="font-display font-medium text-xs text-white uppercase tracking-wider flex items-center gap-1.5 font-bold font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400" /> {langContent.aiAssistant}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Maternal symptoms checker (Gemini model connection).</p>
            </div>

            {/* Chatbox Area */}
            <div className="bg-slate-950 rounded-xl border border-slate-850 p-3.5 flex flex-col justify-between h-72">
              <div 
                id="chat-scroller" 
                className="overflow-y-auto space-y-2.5 flex-1 pr-1 scrollbar-none"
                ref={scrollRef}
              >
                {chatHistory.map(chat => (
                  <div
                    key={chat.id}
                    className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[90%] rounded-xl p-2.5 text-[11px] leading-relaxed ${
                        chat.role === "user"
                          ? "bg-slate-850 text-white rounded-br-none font-bold border border-slate-700"
                          : "bg-slate-800 text-slate-250 rounded-bl-none font-medium"
                      }`}
                    >
                      {chat.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="text-[10px] text-emerald-400 font-semibold animate-pulse pl-1 font-mono">
                    AI safety triage is reviewing...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-1.5 pt-3 border-t border-slate-850 mt-2 shrink-0">
                <input
                  type="text"
                  placeholder={langContent.aiPrompt}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-grow bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-500 font-semibold"
                />
                <button
                  id="btn-chat-send"
                  onClick={handleSendMessage}
                  className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-555 text-white font-bold rounded-lg cursor-pointer shrink-0 uppercase font-mono tracking-wider"
                >
                  Send
                </button>
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="flex items-start gap-1.5 text-[9.5px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span><b>Verification disclaimer:</b> {langContent.safetyFirst}</span>
            </div>
          </div>

          {/* Section 2: Verified Clinics Directory Finder (MVP Edition) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" /> Near Demo Hospitals List
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                Active Directory
              </span>
            </div>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {hospitals.filter(h => h.state === (currentLGA === "Abuja Garki" ? "Abuja" : currentLGA === "Ibadan Yemetu" ? "Oyo" : currentLGA === "Enugu GRA" ? "Enugu" : currentLGA === "Kano Kofar Mata" ? "Kano" : "Lagos")).map(hospital => (
                <div 
                  key={hospital.id}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 transition text-xs"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-850 text-xs font-display">{hospital.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">📍 {hospital.address}, {hospital.state} State</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <span className="bg-white border border-slate-150 p-1.5 rounded font-mono text-center font-bold">
                      🛌 Beds: {hospital.availableBeds}/{hospital.totalBeds}
                    </span>
                    <span className="bg-white border border-slate-150 p-1.5 rounded font-mono text-center text-[9px] font-semibold text-slate-500">
                      Ambulance: Demo Standby
                    </span>
                  </div>

                  {hospital.ambulancePlateNumber && (
                    <div className="text-[9.5px] text-slate-500 bg-slate-100 p-2 rounded-lg font-semibold space-y-0.5 border border-slate-200/55">
                      <p><b>Vehicle Unit:</b> {hospital.ambulanceModel}</p>
                      <p><b>Plate Register:</b> <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">{hospital.ambulancePlateNumber}</span></p>
                    </div>
                  )}

                  <div className="pt-1.5 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-mono font-bold leading-none">{hospital.phoneContact}</span>
                    <a 
                      href={`tel:${hospital.phoneContact}`}
                      className="text-xs text-sky-600 font-black hover:underline uppercase tracking-wide leading-none"
                    >
                      Dial Call
                    </a>
                  </div>
                </div>
              ))}

              {hospitals.filter(h => h.state === (currentLGA === "Abuja Garki" ? "Abuja" : currentLGA === "Ibadan Yemetu" ? "Oyo" : currentLGA === "Enugu GRA" ? "Enugu" : currentLGA === "Kano Kofar Mata" ? "Kano" : "Lagos")).length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs font-light">
                  No verified clinics active in {currentLGA} currently. Call our emergency hotline at <a href="tel:+2347045855451" className="text-rose-650 font-black hover:underline text-rose-600">+234 704 585 5451</a>.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* LOCATION PERMISSION MANDATORY ENFORCEMENT OVERLAY */}
      {locationStatus === 'denied' && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[99999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 animate-none">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md space-y-6 shadow-2xl relative">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-500 mx-auto animate-bounce">
              <MapPin className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-white text-xl uppercase tracking-tight">Location Access Required</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                “Location access is required to continue. MamaRoute needs your real-time location to connect you to the nearest hospital.”
              </p>
            </div>

            <button
              onClick={requestLocationPermission}
              className="w-full py-3.5 bg-rose-650 hover:bg-rose-550 duration-150 text-white font-extrabold text-sm rounded-xl uppercase tracking-wider shadow-lg shadow-rose-600/20 active:scale-95 transition cursor-pointer bg-rose-600"
            >
              Enable Location
            </button>
          </div>
        </div>
      )}

      {locationStatus === 'checking' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200 animate-none">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm space-y-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-white uppercase tracking-wider font-mono">Verifying GPS Permissions...</p>
            <p className="text-xs text-slate-400">Please click "Allow" on the browser pop-up to detect coordinates safely.</p>
          </div>
        </div>
      )}

    </div>
  );
}
