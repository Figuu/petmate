"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import PetCard from "../components/petCard";
import { useUser } from "../context/UserContext";
import Link from "next/link";

function Dashboard() {
  const [pets, setPets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user, role } = useUser();

  useEffect(() => {
    const fetchPets = async () => {
      const q = query(collection(db, "pets"), where("status", "==", "espera"));
      const querySnapshot = await getDocs(q);
      setPets(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchPets();
  }, []);

  useEffect(() => {
    if (user && role === "owner") {
      const q = query(
        collection(db, "notifications"),
        where("ownerId", "==", user.uid),
        where("read", "==", false)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifs = [];
        querySnapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(notifs);
      });

      return () => unsubscribe();
    }
  }, [user, role]);

  const handleMarkAsRead = async (id) => {
    try {
      const notificationRef = doc(db, "notifications", id);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {role === "adopter" ? (
        <p>Adoptante</p>
      ) : (
        <Link className="bg-green-500 text-white p-2 mt-4" href="/pet/addpet">
          Agregar Mascota
        </Link>
      )}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {role === "owner" && notifications.length > 0 && (
        <div className="w-full max-w-md bg-white p-4 rounded-md shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Notificaciones</h2>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b py-2">
                <p>{notification.message}</p>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="bg-blue-500 text-white p-1 mt-2 rounded"
                >
                  Marcar como leído
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
