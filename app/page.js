import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Bienvenido a la aplicación de adopción de mascotas</h1>
      <div className="mt-4">
        <Link href="/login">
          Iniciar sesión
        </Link>
      </div>
      <div className="mt-2">
        <Link href="/register">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
