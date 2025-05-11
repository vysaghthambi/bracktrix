import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";

import { createTeam } from "@/actions/team";

export default async function CreateTeam() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const team = await createTeam({
      name,
      description,
      createdBy: session.user.id,
    });

    redirect(`/team/${team.id}`);
  };

  return (
    <div>
      <h1>Create Team</h1>
      <form action={handleSubmit}>
        <input type="text" name="name" placeholder="Team Name" required />
        <input type="text" name="description" placeholder="Description" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
