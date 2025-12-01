import { App } from "@/components";
import { createClientServer, verifyUser } from "@/utils";

export default async function Home() {
  const supabase = await createClientServer();

  // verify user
  const user = await verifyUser(supabase);
  // if (!user) throw new Error("no-user");

  // TODO
  // verify profile

  return <App user={user} />;
}
