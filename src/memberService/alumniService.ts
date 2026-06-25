import { getDatabase, ref, get, child } from "firebase/database";
import { app } from "@/firebase/firebase";

export const getAlumni = async () => {
  const dbRef = ref(getDatabase(app));
  try {
    // Look specifically at the "alumni" node you just created
    const snapshot = await get(child(dbRef, `alumni`));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
     console.log(data)
      return Object.values(data); 
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching alumni: ", error);
    return [];
  }
};
