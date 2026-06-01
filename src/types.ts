export type UserRole = "patient" | "hospital_admin" | "agent" | "admin";

export interface Profile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  languagePreference: "English" | "Hausa" | "Yoruba" | "Pidgin";
  dueDate?: string; // Standard maternal metric
  parity?: string;  // Pregnancy history
  locationName?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  state: "Lagos" | "Abuja" | "Oyo" | "Enugu" | "Kano";
  phoneContact: string;
  locationLat: number;
  locationLng: number;
  hasAmbulance: boolean;
  availableAmbulances: number;
  totalAmbulances: number;
  availableBeds: number;
  totalBeds: number;
  isVerified: boolean;
  onboardingStatus: "pending" | "verified" | "rejected";
  rating?: number;
  googleMapsUrl?: string; // Google Maps location Link / Coordinates
  isMapsVerified?: boolean; // Verified if true by admin
  ambulanceModel?: string; // Ambulance vehicle model
  ambulancePlateNumber?: string; // Vehicle registration plate
  ambulancePhotoName?: string; // Mock uploaded file info
}

export type EmergencyStatus = 
  | "pending" 
  | "accepted" 
  | "dispatched" 
  | "arrived" 
  | "completed" 
  | "cancelled";

export interface Emergency {
  id: string;
  patientName: string;
  phoneNumber: string;
  patientId?: string;
  hospitalId?: string;
  hospitalName?: string;
  status: EmergencyStatus;
  emergencyType: "maternal" | "general" | "critical_neonatal";
  severityLevel: number; // 1 to 5 (5 is highest)
  locationLat: number;
  locationLng: number;
  address: string;
  details: string;
  agentId?: string; // Filled if triggered via Hotline Call Center
  etaMinutes?: number; // Estimated Time of Arrival
  ambulancePlate?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isEmergencyTriggered?: boolean;
  createdAt: string;
}
