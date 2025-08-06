import { DarkThemeToggle } from "flowbite-react";
import Image from "next/image";
import Login from "@/components/Login";
export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900">
      <h1 className="text-4xl font-bold">Welcome to Our App</h1>
      <p className="mt-4 text-lg">Please log in to continue</p>
      <Login />
    </main>
  );
}
