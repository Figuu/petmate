"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { db } from "@/app/firebase";

function PetPage() {
  const { user, role } = useUser();
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPet = async () => {
      if (id) {
        const docRef = doc(db, "pets", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPet({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
        }
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleAdopt = async () => {
    try {
      // Obtener el último estado de la mascota desde Firestore para asegurarse de que no haya sido adoptada
      const docRef = doc(db, "pets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().status === "espera") {
        await updateDoc(docRef, { status: "solicitado", adoptante: user.email });

        // Crear una notificación para el dueño de la mascota
        await addDoc(collection(db, "notifications"), {
          ownerId: docSnap.data().ownerId,
          petId: id,
          message: `Alguien ha solicitado adoptar a tu mascota ${docSnap.data().name}.`,
          timestamp: new Date(),
          read: false,
        });

        setShowPopup(true); // Mostrar el pop-up después de actualizar el estado y crear la notificación
      } else {
        // Manejar el caso donde la mascota ya no está disponible para adopción
        console.log("La mascota ya no está disponible para adopción.");
      }
    } catch (error) {
      console.error("Error al solicitar adopción:", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push("/dashboard"); // Redirigir al dashboard u otra página después de cerrar el pop-up
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>No se encontró la mascota.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">{pet.name}</h1>
      <p>{pet.description}</p>
      {pet.status !== "espera" ? (
        <p>Adoptado por: {pet.adoptante}</p>
      ) : null}
      {role === "adopter" ? (
        <button onClick={handleAdopt} className="bg-green-500 text-white p-2 mt-4">
          Solicitar Adopción
        </button>
      ) : (
        <p>hola</p>
      )}

      {/* Pop-up para mostrar cuando se adopta la mascota */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-2">¡Solicitud realizada!</p>
            <p>La solicitud de adopción se ha realizado con éxito.</p>
            <button onClick={handleClosePopup} className="bg-blue-500 text-white p-2 mt-4">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetPage;
