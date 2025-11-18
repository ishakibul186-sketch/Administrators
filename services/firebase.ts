
import firebase from "firebase/compat/app";
import { getDatabase, ref, get, child, set, Database } from "firebase/database";
import { User, ToolData, AdminProfile } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDCF9-QchK4cVsQH6IwFN1ZNl3be0-lI50",
  authDomain: "shakibul-islam-ltd-server.firebaseapp.com",
  databaseURL: "https://shakibul-islam-ltd-server-default-rtdb.firebaseio.com",
  projectId: "shakibul-islam-ltd-server",
  storageBucket: "shakibul-islam-ltd-server.appspot.com",
  messagingSenderId: "896191957877",
  appId: "1:896191957877:web:efb623baf4b65547a5e13c",
  measurementId: "G-SY3E95GRQ6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const dbRef = ref(db);
    // Explicitly pointing to "Apps-Hive-users" as requested
    const snapshot = await get(child(dbRef, "Apps-Hive-users"));

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Transform object of objects into array of objects with ID
      const userList: User[] = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        name: value.name || "Unknown Name",
        email: value.email || "No Email",
        time: value.time || Date.now(),
        role: value.role || "User",
      }));
      return userList;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// --- Tool Access Services ---

export const fetchTools = async (): Promise<ToolData[]> => {
  try {
    const dbRef = ref(db);
    // Path: Administrators/Tool
    const snapshot = await get(child(dbRef, "Administrators/Tool"));

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Map keys (name) to ToolData objects
      const toolList: ToolData[] = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key, // The name serves as the ID
        status: value.status === true, // Ensure boolean
        error: value.error || "",
      }));
      return toolList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching tools:", error);
    throw error;
  }
};

export const addOrUpdateTool = async (name: string, status: boolean, errorMsg: string): Promise<void> => {
  try {
    // Path: Administrators/Tool/{name}
    await set(ref(db, `Administrators/Tool/${name}`), {
      status: status,
      error: errorMsg
    });
  } catch (error) {
    console.error("Error updating tool:", error);
    throw error;
  }
};

// --- Admin Profile Services ---

export const fetchAdminProfiles = async (): Promise<AdminProfile[]> => {
  try {
    const dbRef = ref(db);
    // Path: Administrators/Profile
    const snapshot = await get(child(dbRef, "Administrators/Profile"));

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Map entries to AdminProfile objects
      const profileList: AdminProfile[] = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key, // The key is the userid
        name: value.name || "Unknown",
        // Map 'stutus' from DB to 'status' in types
        status: value.stutus === true, 
        error: value.error || ""
      }));
      return profileList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching admin profiles:", error);
    throw error;
  }
};

export const addOrUpdateAdminProfile = async (userid: string, name: string, status: boolean, error: string): Promise<void> => {
  try {
    // Path: Administrators/Profile/{userid}
    // Structure: name, stutus, error
    await set(ref(db, `Administrators/Profile/${userid}`), {
      name: name,
      stutus: status, // Using 'stutus' as requested
      error: error
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
};
