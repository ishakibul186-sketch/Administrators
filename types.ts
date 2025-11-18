
export interface UserData {
  name: string;
  email: string;
  time: string | number;
  role?: string;
}

export interface User extends UserData {
  id: string; // The key from the database (userid token)
}

export interface ToolData {
  id: string; // Corresponds to the 'name' key in DB
  status: boolean;
  error: string;
}

export interface AdminProfile {
  id: string; // This corresponds to the 'userid' key in DB
  name: string;
  status: boolean; // Mapped from 'stutus' in DB
  error: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
