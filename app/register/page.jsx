"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import CryptoJS from "crypto-js";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("adopter");
  const [ci, setCi] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const secretKey = "mySecretKey"; // Define una clave secreta para la encriptación

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Encriptar CI y número de celular
      const encryptedCi = encryptData(ci);
      const encryptedPhone = encryptData(phone);
      
      // Guardar los datos del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), { 
        role,
        ci: encryptedCi,
        phone: encryptedPhone 
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Registrarse</h1>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="CI"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Número de celular"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2"
        >
          <option value="adopter">Busco mascotas para adoptar</option>
          <option value="owner">Quiero dar en adopcion a mi mascota</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
