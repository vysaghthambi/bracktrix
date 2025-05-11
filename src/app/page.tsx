import MyTeams from "@/components/MyTeams/MyTeams";
import { getServerAuthSession } from "@/lib/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return <div>{session && <MyTeams userId={session.user.id} />}</div>;
}
