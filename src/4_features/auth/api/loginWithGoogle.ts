import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/6_shared/config/firebaseConfig";

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account'
  });
  const result = await signInWithPopup(auth, provider);

  return result;
};