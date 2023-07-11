import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Recorder from "../components/Recorder";
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    //onUnauthenticated: () => router.push("./authenticated"),
    onUnauthenticated: () => {},
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:"></div>
      {session && <Recorder />}
    </main>
  );
}
