import { getDatabase, ref, get, child } from "firebase/database";
import { app } from "@/firebase/firebase";

export const getProjects = async () => {
  const dbRef = ref(getDatabase(app));

  try {
    const snapshot = await get(child(dbRef, "projects"));

    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.entries(data).map(([id, value]: any) => ({
        id,
        ...value,
      }));
    } else {
      console.log("No project data available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return [];
  }
};