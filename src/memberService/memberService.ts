import { getDatabase, ref, get, child } from "firebase/database";
// Make sure to import the initialized app, just like we did for alumni!
import { app } from "@/firebase/firebase";

export const getMembers = async () => {
  const dbRef = ref(getDatabase(app));
  
  try {
    // Look specifically at the "members" node in your Realtime DB
    const snapshot = await get(child(dbRef, `team`));
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      console.log("No members data available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching members: ", error);
    return [];
  }
};