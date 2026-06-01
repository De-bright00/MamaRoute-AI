import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Standard Nigerian seed data to prevent empty states
const SEED_HOSPITALS = [
  {
    id: "hosp-lagos-1",
    name: "Lagos Island Maternity Hospital",
    address: "Campbell Street, Lagos Island",
    state: "Lagos",
    phoneContact: "+234 1 234 5678",
    locationLat: 6.4497,
    locationLng: 3.4004,
    hasAmbulance: true,
    availableAmbulances: 2,
    totalAmbulances: 3,
    availableBeds: 14,
    totalBeds: 30,
    isVerified: true,
    onboardingStatus: "verified",
    rating: 4.8,
    googleMapsUrl: "https://maps.google.com/?q=6.4497,3.4004",
    isMapsVerified: true,
    ambulanceModel: "Toyota HiAce Ambulance",
    ambulancePlateNumber: "LA-22A-M01",
    ambulancePhotoName: "ambulance_white_toyota.png"
  },
  {
    id: "hosp-lagos-2",
    name: "Gbagada General Hospital",
    address: "Hospital Road, Gbagada, Lagos",
    state: "Lagos",
    phoneContact: "+234 803 111 2222",
    locationLat: 6.5492,
    locationLng: 3.3857,
    hasAmbulance: true,
    availableAmbulances: 1,
    totalAmbulances: 2,
    availableBeds: 8,
    totalBeds: 25,
    isVerified: true,
    onboardingStatus: "verified",
    rating: 4.2,
    googleMapsUrl: "https://maps.google.com/?q=6.5492,3.3857",
    isMapsVerified: true,
    ambulanceModel: "Nissan NV350 Emergency",
    ambulancePlateNumber: "LA-89B-G55",
    ambulancePhotoName: "gbagada_standby_ems.png"
  },
  {
    id: "hosp-abuja-1",
    name: "Garki General Hospital",
    address: "Area 8, Garki, Abuja",
    state: "Abuja",
    phoneContact: "+234 9 876 5432",
    locationLat: 9.0353,
    locationLng: 7.4878,
    hasAmbulance: true,
    availableAmbulances: 3,
    totalAmbulances: 4,
    availableBeds: 19,
    totalBeds: 40,
    isVerified: true,
    onboardingStatus: "verified",
    rating: 4.6,
    googleMapsUrl: "https://maps.google.com/?q=9.0353,7.4878",
    isMapsVerified: true,
    ambulanceModel: "Mercedes Sprinter ICU",
    ambulancePlateNumber: "ABJ-319-GK",
    ambulancePhotoName: "garki_sprinter_01.png"
  },
  {
    id: "hosp-oyo-1",
    name: "Adeoyo Maternity Teaching Hospital",
    address: "Adeoyo Road, Yemetu, Ibadan",
    state: "Oyo",
    phoneContact: "+234 812 345 6789",
    locationLat: 7.3916,
    locationLng: 3.9054,
    hasAmbulance: true,
    availableAmbulances: 0, // No ambulance currently standby
    totalAmbulances: 2,
    availableBeds: 12,
    totalBeds: 35,
    isVerified: true,
    onboardingStatus: "verified",
    rating: 4.5,
    googleMapsUrl: "https://maps.google.com/?q=7.3916,3.9054",
    isMapsVerified: true,
    ambulanceModel: "Hyundai H1 Responder",
    ambulancePlateNumber: "OY-902-IBD",
    ambulancePhotoName: "adeoyo_hyundai.png"
  },
  {
    id: "hosp-enugu-1",
    name: "ESUT Teaching Hospital (Parklane)",
    address: "Justice Wilkins Street, G.R.A, Enugu",
    state: "Enugu",
    phoneContact: "+234 804 999 0000",
    locationLat: 6.4421,
    locationLng: 7.5098,
    hasAmbulance: true,
    availableAmbulances: 1,
    totalAmbulances: 2,
    availableBeds: 9,
    totalBeds: 22,
    isVerified: true,
    onboardingStatus: "verified",
    rating: 4.4,
    googleMapsUrl: "https://maps.google.com/?q=6.4421,7.5098",
    isMapsVerified: true,
    ambulanceModel: "Ford Transit Ambulance",
    ambulancePlateNumber: "EN-440-PK",
    ambulancePhotoName: "enugu_ford_transit.png"
  }
];

const SEED_EMERGENCIES = [
  {
    id: "em-1",
    patientName: "Chinyere Adebayo",
    phoneNumber: "+234 802 345 6789",
    status: "dispatched",
    emergencyType: "maternal",
    severityLevel: 5,
    locationLat: 6.4520,
    locationLng: 3.3980,
    address: "14 Broad Street, Lagos Island, Lagos",
    details: "Staged at 38 weeks. Patient reporting severe premature labor contractions and heavy bleeding.",
    hospitalId: "hosp-lagos-1",
    hospitalName: "Lagos Island Maternity Hospital",
    etaMinutes: 8,
    ambulancePlate: "LA-22A-M01",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "em-2",
    patientName: "Aminat Yusuf",
    phoneNumber: "+234 815 678 1234",
    status: "pending",
    emergencyType: "maternal",
    severityLevel: 4,
    locationLat: 9.0380,
    locationLng: 7.4850,
    address: "Area 11, Gasa District, Garki, Abuja",
    details: "Eclampsia symptoms: high fever, intense headaches, and blurred vision at 34 weeks.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

// In-Memory state for the session
let hospitals = [...SEED_HOSPITALS];
let emergencies = [...SEED_EMERGENCIES];

// Lazy initialisation of Gemini to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI queries will fall back to simulated responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. HEALTHCHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 2. GET ALL HOSPITALS
  app.get("/api/hospitals", (req, res) => {
    res.json(hospitals);
  });

  // 3. ONBOARD OR UPDATE HOSPITAL
  app.post("/api/hospitals", (req, res) => {
    const data = req.body;
    if (!data.name || !data.address || !data.state) {
       res.status(400).json({ error: "Missing required fields: name, address, state" });
       return;
    }

    const newHosp = {
      id: `hosp-${Date.now()}`,
      name: data.name,
      address: data.address,
      state: data.state,
      phoneContact: data.phoneContact || "+234 800-000-0000",
      locationLat: data.locationLat || 6.45,
      locationLng: data.locationLng || 3.4,
      hasAmbulance: !!data.hasAmbulance,
      availableAmbulances: data.hasAmbulance ? 1 : 0,
      totalAmbulances: data.hasAmbulance ? 1 : 0,
      availableBeds: data.availableBeds || 10,
      totalBeds: data.totalBeds || 10,
      isVerified: false,
      onboardingStatus: "pending" as const,
      rating: 5.0,
      googleMapsUrl: data.googleMapsUrl || "",
      isMapsVerified: false,
      ambulanceModel: data.ambulanceModel || "",
      ambulancePlateNumber: data.ambulancePlateNumber || "",
      ambulancePhotoName: data.ambulancePhotoName || ""
    };

    hospitals.push(newHosp);
    res.json({ success: true, hospital: newHosp });
  });

  // 4. VERIFY HOSPITAL STATUS (Admin role)
  app.post("/api/hospitals/:id/verify", (req, res) => {
    const { id } = req.params;
    const { status, verifyMaps } = req.body; // "verified" | "rejected", optional maps verification
    const index = hospitals.findIndex(h => h.id === id);
    if (index === -1) {
       res.status(404).json({ error: "Hospital not found" });
       return;
    }
    hospitals[index].onboardingStatus = status;
    if (status === "verified") {
      hospitals[index].isVerified = true;
      hospitals[index].isMapsVerified = (verifyMaps !== undefined) ? !!verifyMaps : true;
    } else {
      hospitals[index].isVerified = false;
      hospitals[index].isMapsVerified = false;
    }
    res.json({ success: true, hospital: hospitals[index] });
  });

  // 5. UPDATE HOSPITAL AMBULANCE/BED AVAILABILITY (Hospital Role)
  app.put("/api/hospitals/:id/resources", (req, res) => {
    const { id } = req.params;
    const { availableAmbulances, availableBeds } = req.body;
    const index = hospitals.findIndex(h => h.id === id);
    if (index === -1) {
       res.status(404).json({ error: "Hospital not found" });
       return;
    }
    if (availableAmbulances !== undefined) hospitals[index].availableAmbulances = Number(availableAmbulances);
    if (availableBeds !== undefined) hospitals[index].availableBeds = Number(availableBeds);
    res.json({ success: true, hospital: hospitals[index] });
  });

  // 6. GET ALL EMERGENCIES
  app.get("/api/emergencies", (req, res) => {
    res.json(emergencies);
  });

  // 7. POST A NEW EMERGENCY (SOS or Hotline Triggered)
  app.post("/api/emergencies", (req, res) => {
    const info = req.body;
    if (!info.patientName || !info.phoneNumber) {
       res.status(400).json({ error: "Patient name and phone number are required." });
       return;
    }

    // Auto find nearest hospital if coordinates are given
    let matchedHospId = info.hospitalId || "";
    let matchedHospName = info.hospitalName || "";
    if (!matchedHospId && info.locationLat && info.locationLng) {
      // Basic distance finder
      let bestHosp = null;
      let minDistance = Infinity;
      for (const h of hospitals) {
        if (!h.isVerified) continue;
        const dist = Math.pow(h.locationLat - info.locationLat, 2) + Math.pow(h.locationLng - info.locationLng, 2);
        if (dist < minDistance) {
          minDistance = dist;
          bestHosp = h;
        }
      }
      if (bestHosp) {
        matchedHospId = bestHosp.id;
        matchedHospName = bestHosp.name;
      }
    }

    const newEmergency = {
      id: `em-${Date.now()}`,
      patientName: info.patientName,
      phoneNumber: info.phoneNumber,
      patientId: info.patientId || "",
      hospitalId: matchedHospId,
      hospitalName: matchedHospName,
      status: (info.status || "pending") as any,
      emergencyType: info.emergencyType || "maternal",
      severityLevel: info.severityLevel || 4,
      locationLat: info.locationLat || 6.45,
      locationLng: info.locationLng || 3.4,
      address: info.address || "Lagos, Nigeria",
      details: info.details || "Dispatched via maternal SOS trigger",
      agentId: info.agentId || "",
      etaMinutes: Number(info.etaMinutes) || 12,
      ambulancePlate: info.ambulancePlate || "",
      createdAt: new Date().toISOString()
    };

    emergencies.unshift(newEmergency);
    res.json({ success: true, emergency: newEmergency });
  });

  // 8. PUT (UPDATE) AN EMERGENCY STATUS
  app.put("/api/emergencies/:id", (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const index = emergencies.findIndex(e => e.id === id);
    if (index === -1) {
       res.status(404).json({ error: "Emergency incident not found" });
       return;
    }

    if (update.status) emergencies[index].status = update.status;
    if (update.hospitalId) {
      emergencies[index].hospitalId = update.hospitalId;
      const h = hospitals.find(hosp => hosp.id === update.hospitalId);
      if (h) emergencies[index].hospitalName = h.name;
    }
    if (update.etaMinutes !== undefined) emergencies[index].etaMinutes = Number(update.etaMinutes);
    if (update.ambulancePlate !== undefined) emergencies[index].ambulancePlate = update.ambulancePlate;
    if (update.details !== undefined) emergencies[index].details = update.details;

    res.json({ success: true, emergency: emergencies[index] });
  });

  // 9. AI SAFETY TRIAGE BOT (Maternal Healthcare Assistant)
  app.post("/api/chat", async (req, res) => {
    const { message, history = [], language = "English" } = req.body;
    if (!message) {
       res.status(400).json({ error: "Message is required" });
       return;
    }

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasApiKey) {
      // Fallback local robust regex rules if no key is provided to keep the MVP highly functional 24/7
      const dangerKeywords = [
        "bleed", "blood", "stomach pain", "severe pain", "headache", "vision", "blur", "convulsion",
        "fit", "seizure", "water break", "leaking", "fever", "ill", "swollen", "puff", "bari", "jini",
        "ciwon", "mura", "zazzabi", "eje", "fifun", "riro", "ipa", "gbona", "emi", "ebe", "pikin", "belle"
      ];
      const lower = message.toLowerCase();
      const isEmergency = dangerKeywords.some(keyword => lower.includes(keyword));

      let mockText = "";
      if (isEmergency) {
        if (language === "Pidgin") {
          mockText = "**WARNING DETECTED! (DANGER SIGN!)**\n\nMama, wetin you describe fit be big trouble for you and the baby! Bleeding, severe head pain, heavy swelling, and leaking water are NOT normal. Please press the **EMERGENCY SOS BUTTON** immediately or run to Gbagada General Hospital or Garki Hospital. Call our 24/7 Emergency Maternal Hotline: +234 704 585 5451.";
        } else if (language === "Yoruba") {
          mockText = "**IKILỌ PATAKI! (AMI EWU!)**\n\nMama, ohun ti o sọ yii jẹ ami ewu nla fun iwọ ati ọmọ rẹ! Ẹjẹ tita, orififo gbigbona, wiwu oju, ati omi sisun kọ ṣe n tọju loni. Tẹ bọtini **PAJAWIRI SOS** immediately tabi lọ si Lagos Island Maternity Hospital ni Campbell Street.";
        } else if (language === "Hausa") {
          mockText = "**GARGAƊI AKAN TSARO! (ALAMAR HAƊARI!)**\n\nMama, abin da kika kwatanta yana nuna babban haɗari a gare ku da jaririn ku! Zubar da jini, ciwon kai mai tsanani, kumburin fuska ko hannaye, da zubar ruwa ba daidai ba ne. Don Allah danna bọtirin **SOS NA GAGGAWA** ko maza-maza ku je asibiti.";
        } else {
          mockText = "**CRITICAL WARNING! (DANGER SIGN DETECTED!)**\n\nMama, what you have described indicates a high-risk gestational danger sign. Severe bleeding, acute headache, convulsions, facial swelling, or leaking fluid require immediate clinical evaluation. Please press the **EMERGENCY SOS** button immediately or proceed to the nearest verified maternal clinic.";
        }
      } else {
        if (language === "Pidgin") {
          mockText = "For pregnant mamas, make you dey chop good food like green leaf, beans, eggs, and fruit. Always drink clean water, sleep well, and attend your weekly prenatal checkups for clinic. Wetin you want make we discuss again, my friend?";
        } else if (language === "Yoruba") {
          mockText = "Fun aboyun, jẹun daradara gẹgẹbi awọn ẹfọ, ewa, ẹyin, ati awọn eso. Mu omi mimọ pupọ, gba isinmi to pọ, ki o si lọ si ile-iwosan fun abojuto aboyun rẹ deede. Kini ohun miiran ti mo le sọ fun ọ?";
        } else if (language === "Hausa") {
          mockText = "Ga mata masu juna biyu, tabbatar kuna cin abinci mai gina jiki kamar ganyayyaki, wake, ƙwai, da ’ya’yan itace. Koyaushe ku sha ruwa mai tsafta, ku sami isasshen hutu, kuma ku halarci awo a asibiti akai-akai.";
        } else {
          mockText = "Maternal nutrition is critical. A balanced pregnant diet consists of iron-rich foods (lean beef, beans, spinach), folate, vitamin C, calcium (milk, fish), and abundant hydration. Remember to track your prenatal appointments and take your routine folate/iron supplements.";
        }
      }

      res.json({
        text: mockText,
        isEmergencyTriggered: isEmergency
      });
      return;
    }

    try {
      const ai = getGeminiClient();
      const systemInstruction = `
        You are 'MamaRoute AI' - a hyper-focused maternal healthcare emergency coordinator and triage bot for Nigeria (operating in Lagos, Abuja, Ibadan, Enugu, Kano, and beyond).
        
        CRITICAL SAFETY MANDATES:
        1. If the user mentions OR describes ANY alarming danger signs: bleeding, severe abdominal pain, vision loss, high fever, water breaking, baby not moving, severe hand/face swelling, heavy head pain, or convulsions, you MUST immediately flag isEmergencyTriggered as true.
        2. In any case of an active danger sign, your text MUST tell the patient to immediately trigger the SOS button, speak to our 24/7 Emergency Maternal Hotline (+234 704 585 5451), or go to the nearest maternity hospital. Safety is absolute!
        3. You speak warm, supportive, friendly maternal-care advisor advice.
        4. You must adapt to the requested language preference: English, Nigerian Pidgin, Yoruba, or Hausa. Use local Nigerian slangs or phrases where appropriate (e.g., 'Mama', 'Abeg', 'Sharp-sharp', 'Adupe', 'Sannu').
        5. NEVER replace a real doctor. Add custom warnings to meet clinical safety protocols.
      `;

      const gptContents = [...history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.text }]
      })), {
        role: "user",
        parts: [{ text: `Language Preference: ${language}. Message: ${message}` }]
      }];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: gptContents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "The supportive maternal guidance, symptoms advice, or emergency alert text."
              },
              isEmergencyTriggered: {
                type: Type.BOOLEAN,
                description: "Whether the patient is experiencing a critical danger sign that requires immediate hospital/emergency action."
              }
            },
            required: ["text", "isEmergencyTriggered"]
          }
        }
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);

    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: "Failed to generate AI query response", details: err.message });
    }
  });

  // API 404 handler to prevent API requests fallback to html
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MamaRoute AI] Full-stack server compiled and running on http://localhost:${PORT}`);
  });
}

startServer();
