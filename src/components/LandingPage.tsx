import React, { useState } from "react";
import { Hospital } from "../types";
// @ts-ignore
import heroBg from "../assets/images/hero_background_1780318793327.png";
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Users, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface LandingPageProps {
  hospitals: Hospital[];
  onNavigateToRole: (role: string) => void;
}

export default function LandingPage({ hospitals, onNavigateToRole }: LandingPageProps) {
  const [selectedState, setSelectedState] = useState<string>("All");
  const verifiedHospitals = hospitals.filter(h => h.isVerified && h.onboardingStatus === "verified");

  const states = ["All", "Lagos", "Abuja", "Oyo", "Enugu", "Kano"];

  const filteredHospitals = selectedState === "All"
    ? verifiedHospitals
    : verifiedHospitals.filter(h => h.state === selectedState);

  return (
    <div id="landing-container" className="bg-[#f8fafc] min-h-screen text-slate-800 font-sans">
      
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#028cce] to-[#0369a1] text-white py-20 px-4 md:px-8">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Maternal Emergency AI Backdrop" 
            className="w-full h-full object-cover opacity-85 object-center pointer-events-none select-none transition-opacity duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/50 to-transparent"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Emergency maternal care when every minute matters
            </h1>
            
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              MamaRoute AI connects mothers in distress to nearby verified facilities and hotline dispatchers, resolving critical transportation and referral delays.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                id="btn-trigger-sos-demo"
                onClick={() => onNavigateToRole("patient")}
                className="px-6 py-4 bg-rose-600 hover:bg-rose-500 active:scale-95 duration-200 transition-all text-white font-bold rounded-xl shadow-lg ring-4 ring-rose-500/20 text-center flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
              >
                <Activity className="w-5 h-5 animate-pulse" />
                Launch SOS App Demo
              </button>
              <button
                id="btn-enter-coordination"
                onClick={() => onNavigateToRole("agent")}
                className="px-6 py-4 bg-white hover:bg-slate-100 active:scale-95 duration-200 text-slate-900 font-bold rounded-xl text-center cursor-pointer transition-all border border-slate-200 shadow-md text-sm uppercase tracking-wider"
              >
                Hotline Agent Dashboard
              </button>
            </div>

            <div className="pt-4 flex items-center gap-2.5 text-xs text-blue-200 font-mono">
              <span>Coordinates, alerts, and SMS actions are fully simulated in this environment.</span>
            </div>
          </div>

          {/* Core Demo Indicators (Real Stats with Simulator labels) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-slate-905/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl bg-slate-900 text-white">
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-600 px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest text-white">
                <Sparkles className="w-3 h-3 text-amber-300" /> SIMULATED METRICS
              </div>
              <h2 className="text-lg font-bold mb-4 font-display text-white">Maternal Rescue Network</h2>
              <div className="space-y-4 text-slate-100 text-sm">
                
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Demo Onboarded Hospitals</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-bold">{hospitals.length} Clinics</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Demo Standby Fleet</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-bold">
                    {hospitals.reduce((acc, h) => acc + h.totalAmbulances, 0)} Ambulance Units
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Hospital Coordination</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-bold">24-Hour Queue</span>
                </div>

              </div>

              <a 
                href="tel:+2347045855451" 
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 duration-250 text-white font-medium text-xs flex justify-between items-center shadow-md cursor-pointer block border border-white/10 group"
              >
                <div>
                  <p className="text-[10px] opacity-90 uppercase font-black tracking-wider text-rose-100">24/7 Emergency Maternal Hotline (Nigeria)</p>
                  <p className="text-lg font-black font-mono tracking-tight text-white">+234 704 585 5451</p>
                  <p className="text-[10px] text-white/90 font-medium italic mt-0.5">Call now for offline emergency support</p>
                </div>
                <PhoneCall className="w-6 h-6 text-white shrink-0 animate-bounce group-hover:scale-115 duration-200" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section id="problem-section" className="py-16 px-4 md:px-8 bg-sky-50/50 border-b border-sky-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold uppercase px-3 py-1 rounded-full tracking-widest border border-sky-200">
              The Critical Challenge in Nigeria
            </span>
            <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight leading-none">
              The "Three Delays" that endanger pregnant mothers
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Maternal mortality remains extremely high in Nigeria, caused largely by systemic delays in coordination and referral routing.
            </p>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 text-xs shadow-sm">
              <p className="text-rose-600 font-bold flex items-center gap-1.2 font-mono">
                ⚠️ NIGERIAN MATERNAL MORTALITY STATS
              </p>
              <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-semibold">
                <li>Nigeria accounts for nearly 20% of global maternal deaths, with a ratio of 512 deaths per 100,000 live births.</li>
                <li>Obstetric transport delays to a tertiary referral clinic can take over 3 to 4 hours in crowded metropolitan centers.</li>
                <li>Over 65% of rural mothers lack cellular data to coordinate or access clinic directories online in emergencies.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-250 p-6 rounded-2xl shadow-sm text-center space-y-2">
              <span className="text-rose-600 text-3xl font-black font-display text-center block">Delay 1</span>
              <h4 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wider">Deciding to Seek Care</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Mothers may not recognize danger signals like pre-eclampsia headaches or early contractions, resulting in critical delays at home.
              </p>
            </div>

            <div className="bg-white border border-slate-250 p-6 rounded-2xl shadow-sm text-center space-y-2">
              <span className="text-rose-600 text-3xl font-black font-display text-center block">Delay 2</span>
              <h4 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wider">Reaching the Facility</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Lacking automated ambulances or dispatcher support results in pregnant mothers traveling for hours by local commercial tricycles (Keke).
              </p>
            </div>

            <div className="bg-white border border-slate-250 p-6 rounded-2xl shadow-sm text-center space-y-2">
              <span className="text-rose-600 text-3xl font-black font-display text-center block">Delay 3</span>
              <h4 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wider">Receiving Adequate Care</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Hospitals receive walk-ins without prior notification, lacking sterilized tables, blood transfusion supplies, or O-negative reserves.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section id="solution-section" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs text-sky-600 uppercase font-black font-mono tracking-widest block">HOW WE DELIVER REVENUE SAFETY</span>
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-none">
            Our Core Coordination Components
          </h2>
          <p className="text-slate-600 text-sm">
            MamaRoute AI connects expectant mothers and medical teams seamlessly using lightweight, internet-safe and offline fallback workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 font-bold mb-4 border border-rose-100">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-display text-lg font-bold">1. One-Tap Emergency SOS</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              An immediate patient console to broadcast location and pregnancy metrics directly to three nearest participating clinics. The system shows immediate confirmations and safe dispatch statuses.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold mb-4 border border-emerald-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold">2. AI Maternal Health Assistant</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Provides safe, supportive clinical and nutritional guidance. Automatically flags danger flags like bleeding, high fever, swollen face, and recommends triggering SOS or hospital visits.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 font-bold mb-4 border border-sky-100">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold">3. Emergency Agent Hotlines</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Offline verbal support. Voice agents log incoming reports and program regional coordinates manually, automatically triggering sirens at near hospital dashboards for obstetric preparedness.
            </p>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 px-4 md:px-8 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs text-emerald-400 font-extrabold uppercase font-mono tracking-widest block">OPERATIONAL DESIGN</span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white leading-none">
              The 4-Step Response Workflow
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              How the platform links patients, call center dispatchers, and clinical wards in real maternal emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-800/50 border border-slate-750 p-6 rounded-2xl space-y-3 relative">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Emergency Occurs</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                An expectant mother in Lagos or Abuja experiences vaginal bleeding, pre-eclampsia convulsions, or water breakages.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-750 p-6 rounded-2xl space-y-3 relative">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-sm text-white">SOS / Hotline Activated</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Patient triggers the client SOS or dials the hotline dispatcher. GPS location points get logged immediately.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-750 p-6 rounded-2xl space-y-3 relative">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Hospital Receives Alert</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Dashboard sirens alert nearest clinical desks. Ward nurses can authorize standby oxygen, beds, and transfusion reserves.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-750 p-6 rounded-2xl space-y-3 relative">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="font-bold text-sm text-white">Care is Coordinated Safe</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ambulance is deployed or patient is transported, receiving immediate, prepared obstetrical care upon arrival.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. HOSPITAL PARTNER SECTION */}
      <section id="hospital-partner-section" className="py-16 px-4 md:px-8 bg-blue-50/50 border-t border-b border-blue-100">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-blue-200/60 p-8 md:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              Onboard Your Emergency Hospital
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Hospitals can register to join the response queue. Provide operating hours, obstetric beds capacity, and emergency contacts to participate in the decentralized network.
            </p>
          </div>
          <div>
            {/* LINK TO THE HOSPITAL ONBOARDING PAGE */}
            <button
              onClick={() => {
                window.location.hash = "#hospital-onboarding";
                window.location.pathname = "/hospital-onboarding";
              }}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 duration-150 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              Onboard your hospital →
            </button>
          </div>
        </div>
      </section>

      {/* Hospital Finder (MVP VERSION - labeled "Simulated" / "Demo Hospitals") */}
      <section id="hospital-finder-section" className="bg-[#f1f5f9] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] bg-slate-200 text-slate-700 border border-slate-300 font-extrabold uppercase px-2.5 py-1 rounded-full tracking-widest font-mono">
                SIMULATED DATA
              </span>
              <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">
                Participating Demo Hospitals
              </h2>
              <p className="text-slate-500 text-xs font-semibold max-w-xl">
                Capacity finder showing demo hospitals. Availability is simulated for testing the hackathon response console.
              </p>
            </div>
            
            {/* Filter */}
            <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-200 self-start shadow-sm">
              {states.map(state => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                    selectedState === state
                      ? "bg-[#0284c7] text-white shadow"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list of hospitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(hospital => (
              <div 
                key={hospital.id} 
                className="bg-white rounded-2xl border border-slate-250 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-extrabold text-[#0c4a6e] text-base leading-tight">{hospital.name}</h3>
                    <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-amber-200">
                      Demo Hospital
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate font-semibold">{hospital.address}, {hospital.state} State</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Simulated Beds</div>
                      <div className="text-base font-bold text-slate-800 font-mono">
                        {hospital.availableBeds}<span className="text-slate-400 text-xs font-normal">/{hospital.totalBeds}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Simulated Fleet</div>
                      <div className="text-base font-bold text-slate-800 font-mono">
                        {hospital.availableAmbulances ?? 0} <span className="text-slate-400 text-xs font-normal">avail</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono font-bold">{hospital.phoneContact}</span>
                  <a
                    href={`tel:${hospital.phoneContact}`}
                    className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 duration-150 uppercase text-[10px] tracking-wider"
                  >
                    Dial Demo Clinic <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}

            {filteredHospitals.length === 0 && (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No certified demo hospitals currently registered for {selectedState}.</p>
                <button 
                  onClick={() => {
                    window.location.hash = "#hospital-onboarding";
                    window.location.pathname = "/hospital-onboarding";
                  }} 
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Onboard Your Hospital Now
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section id="cta-section" className="py-20 px-4 md:px-8 bg-sky-900 text-white text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-none">
            Get help faster
          </h2>
          <p className="text-sky-100 text-sm max-w-lg mx-auto leading-relaxed">
            Reducing delays in obstetric care saves lives. Access our zero-delay simulator to test direct maternal emergency coordination today.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigateToRole("patient")}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 duration-150 active:scale-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider font-mono shadow-lg ring-4 ring-rose-500/25 cursor-pointer"
            >
              Trigger Patient SOS Emulator
            </button>
          </div>
        </div>
      </section>

      {/* Footer Contact Section */}
      <footer id="landing-footer" className="bg-slate-950 text-slate-550 border-t border-slate-900 py-12 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="w-6 h-6 text-emerald-500" />
              <span className="font-display font-bold text-lg tracking-tight">MamaRoute AI</span>
            </div>
            <p className="text-slate-400">
              Maternal emergency coordination. Dedicated to eliminating delays in seeking, reaching, and receiving critical obstetric medical care in Nigeria.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              © 2026 MamaRoute. Pre-deployment hackathon concept environment. All rights reserved.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide uppercase font-mono text-[10px]">Partners & Licensing</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    window.location.hash = "#hospital-onboarding";
                    window.location.pathname = "/hospital-onboarding";
                  }} 
                  className="hover:text-blue-400 transition cursor-pointer font-bold text-slate-400"
                >
                  Onboard Your Hospital
                </button>
              </li>
              <li>
                <span className="text-slate-500">FMOH Nigeria Standards (Concept)</span>
              </li>
              <li>
                <span className="text-slate-500">LGA Referral Integrations</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide uppercase font-mono text-[10px]">Maternal Support</h4>
            <p className="leading-relaxed text-slate-400">
              If an obstetric safety alert arises, always proceed immediately to the nearest primary or secondary care unit.
            </p>
            <div className="text-rose-400 font-mono font-bold leading-normal">
              <span className="text-[9px] uppercase tracking-wider block text-slate-400">24/7 Emergency Maternal Hotline (Nigeria)</span>
              <a href="tel:+2347045855451" className="text-white hover:underline text-sm font-black">+234 704 585 5451</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
