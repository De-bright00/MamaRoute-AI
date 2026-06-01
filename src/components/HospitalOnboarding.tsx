import React, { useState } from "react";
import { Building2, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

// List of Nigerian States
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

interface HospitalOnboardingProps {
  onOnboardHospital: (hospData: any) => Promise<any>;
}

export default function HospitalOnboarding({ onOnboardHospital }: HospitalOnboardingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields State
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [lga, setLga] = useState("");
  const [selectedState, setSelectedState] = useState("Lagos");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facilityType, setFacilityType] = useState("Private");
  const [careLevel, setCareLevel] = useState("Secondary");
  
  // Available Services Form States
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [ambulancesCount, setAmbulancesCount] = useState<number>(0);
  const [operatingHours, setOperatingHours] = useState("24 hours");
  const [acceptsWalkins, setAcceptsWalkins] = useState<"Yes" | "No">("Yes");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const servicesOptionList = [
    { id: "maternity", label: "Maternity Ward" },
    { id: "icu", label: "ICU (Intensive Care Unit)" },
    { id: "bloodbank", label: "Blood Bank" },
    { id: "ambulance", label: "Ambulance" },
    { id: "surgery", label: "Surgery / Theatre" },
    { id: "nicu", label: "NICU (Neonatal Intensive Care Unit)" }
  ];

  const handleServiceChange = (serviceLabel: string) => {
    if (selectedServices.includes(serviceLabel)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceLabel));
    } else {
      setSelectedServices([...selectedServices, serviceLabel]);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName || !hospitalAddress || !lga || !contactName || !phone || !email) {
      alert("Please fill in all required basic information fields.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Package into our backend hospital model structure
      const payload = {
        name: hospitalName,
        address: `${hospitalAddress}, LGA: ${lga}`,
        state: selectedState,
        phoneContact: phone,
        hasAmbulance: ambulancesCount > 0 || selectedServices.includes("Ambulance"),
        totalAmbulances: ambulancesCount,
        availableAmbulances: ambulancesCount,
        totalBeds: 10, // Default MVP setup
        availableBeds: 10,
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(hospitalName + " " + hospitalAddress)}`,
        onboardingStatus: "pending",
        isVerified: false,
        // Extra custom properties mapped for Onboarding database record simulation
        facilityType,
        careLevel,
        contactName,
        email,
        services: selectedServices,
        operatingHours,
        acceptsWalkins,
        additionalNotes
      };

      // Call the app's standard onboarding handler which triggers POST /api/hospitals
      await onOnboardHospital(payload);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to onboard hospital:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 md:px-6">
        <div className="bg-white rounded-3xl border border-blue-100 p-8 md:p-12 text-center shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold uppercase px-3 py-1 rounded-full tracking-widest border border-amber-200/50">
              Pending Review
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-2">
              Registration Under Review
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed mt-1">
              Thank you! Your facility has been submitted for review. Our team will contact you within 48 hours.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mt-6 max-w-md mx-auto text-left text-xs space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest font-mono text-[10px]">Submitted Credentials:</h4>
            <p className="text-slate-650">🏢 <b>Facility:</b> {hospitalName}</p>
            <p className="text-slate-650">📍 <b>LGA & State:</b> {lga}, {selectedState} State</p>
            <p className="text-slate-650">🩺 <b>Care Level:</b> {careLevel} ({facilityType})</p>
            <p className="text-slate-650">👤 <b>Contact:</b> {contactName} ({phone})</p>
            <p className="text-slate-650">🚚 <b>Ambulances Standby:</b> {ambulancesCount} Units</p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                // Clear state to allow another submission or returning
                window.location.href = window.location.origin + "/";
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              Return to Public Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back navigation button */}
        <div>
          <button
            onClick={() => {
              window.location.hash = "";
              window.location.pathname = "/";
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Public Hub
          </button>
        </div>

        {/* Header Block */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-blue-600" /> Clinic Network Onboarding
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-none">
            Partner with MamaRoute AI — Join our emergency response network
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            Join the decentralized referral system dedicated to reducing delays in maternal emergencies. Help mothers secure obstetric check-ins in Lagos, Oyo, Abuja, and across Nigeria.
          </p>
        </div>

        {/* Progress Timeline Tracker */}
        <div className="bg-white rounded-2xl border border-slate-250 p-4 shadow-sm flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 1 ? "bg-blue-600 text-white shadow" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Step 1</p>
              <p className="text-xs font-bold text-slate-800">Basic Info</p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-300" />

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 2 ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-400"
            }`}>
              2
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Step 2</p>
              <p className="text-xs font-bold text-slate-800">Services & Capacity</p>
            </div>
          </div>
        </div>

        {/* Main Form container */}
        <div className="bg-white rounded-3xl border border-slate-250 p-6 md:p-8 shadow-md">
          
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2.5">
                Section 1: Basic Institution Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hospital Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Prime Shore Maternal Centre"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hospital Street Address <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24 Herbert Macaulay Way"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Local Government Area (LGA) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Island"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State <span className="text-rose-500">*</span></label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 cursor-pointer text-slate-850"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h4 className="font-display font-semibold text-sm text-slate-800 mb-3">Principal Representative Authorized Contact</h4>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Person Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ngozi Balogun"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Facility Telephone Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none font-mono focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. licensing@hospital.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none font-mono focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Facility Operating Category</label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none cursor-pointer"
                  >
                    <option value="Private">Private Facility / Clinic</option>
                    <option value="Public">Public / General Government Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Clinical Tier Care Level</label>
                  <select
                    value={careLevel}
                    onChange={(e) => setCareLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none cursor-pointer"
                  >
                    <option value="Primary">Primary Care Level (Rural Health Post)</option>
                    <option value="Secondary">Secondary Care Level (District General)</option>
                    <option value="Tertiary">Tertiary Care Level (Teaching Hospital)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  Continue to Services & Capacity <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2.5">
                Section 2: Medical Services & Response Capacity
              </h3>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Available Obstetric & Neonatal Services <span className="text-slate-400 font-normal">(Multi-select Checkboxes)</span></label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {servicesOptionList.map((srv) => (
                    <label 
                      key={srv.id} 
                      className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition ${
                        selectedServices.includes(srv.label) 
                          ? "bg-blue-50/50 border-blue-300 text-blue-900 font-bold" 
                          : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(srv.label)}
                        onChange={() => handleServiceChange(srv.label)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer mt-0.5"
                      />
                      <span className="text-xs">{srv.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Number of Physical Ambulances Available</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    placeholder="e.g. 1"
                    value={ambulancesCount}
                    onChange={(e) => setAmbulancesCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 transition font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Specify 0 if your facility relies on referral transport networks.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Operating Hours Pattern</label>
                  <select
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none cursor-pointer"
                  >
                    <option value="24 hours">24 Hours / Live Emergency Coverage</option>
                    <option value="Daytime only">Daytime Only (8:00 AM - 6:00 PM)</option>
                    <option value="Other">Other / Limited Operating Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Accepts Obstetric Emergency Walk-ins?</label>
                  <div className="flex gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => setAcceptsWalkins("Yes")}
                      className={`flex-1 py-3 text-center rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        acceptsWalkins === "Yes"
                          ? "bg-slate-900 text-white shadow"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Yes (Walk-ins Welcome)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAcceptsWalkins("No")}
                      className={`flex-1 py-3 text-center rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        acceptsWalkins === "No"
                          ? "bg-slate-900 text-white shadow"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      No (Referrals Only)
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Additional Licensing or Response Capacity Notes <span className="text-slate-450 font-normal">(Optional)</span></label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about obstetricians on-call, blood group reserves, or local LGA proximity factors."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 duration-150 text-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Submitting Registration..." : "Submit Verification Packet"}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Informative Safety/Legal Footnote */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 max-w-2xl mx-auto">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-blue-900 font-medium leading-relaxed">
            Clinical registrations logged via this onboarding portal will be directed immediately to the MamaRoute AI administrative queue as <i>pending approval</i>. They will be marked simulated until credentialing is conducted by the Federal Ministry of Health agencies.
          </div>
        </div>

      </div>
    </div>
  );
}
