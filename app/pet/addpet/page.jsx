"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";

import { db } from "@/app/firebase";
import { useUser } from "@/app/context/UserContext";

function AddPetPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("espera");
  const { user } = useUser();
  const router = useRouter();

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "pets"), {
        name,
        description,
        status,
        ownerId: user.uid,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Agregar Mascota</h1>
      <form onSubmit={handleAddPet} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Agregar Mascota
        </button>
      </form>
    </div>
  );
}

export default AddPetPage;
