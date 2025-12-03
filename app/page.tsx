import BrewNotesClient from "@/components/BrewNotesClient";
import Dashboard from "@/components/DashboardClient";
import ExciseCalculator from "@/components/ExciseCalculator";
import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col text-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* <ExciseCalculator/> */}
        <BrewNotesClient/>
      </main>
    </div>
  );
}
