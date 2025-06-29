import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.position.createMany({
      data: [
        { code: "GK", title: "Goalkeeper" },
        { code: "RB", title: "Right Back" },
        { code: "CB", title: "Center Back" },
        { code: "LB", title: "Left Back" },
        { code: "DMF", title: "Defensive Midfielder" },
        { code: "CMF", title: "Central Midfielder" },
        { code: "AMF", title: "Attacking Midfielder" },
        { code: "RMF", title: "Right Midfielder" },
        { code: "LMF", title: "Left Midfielder" },
        { code: "RWF", title: "Right Winger" },
        { code: "LWF", title: "Left Winger" },
        { code: "FW", title: "Forward" },
        { code: "SS", title: "Second Striker" },
      ],
    }),
    prisma.goalType.createMany({
      data: [
        { code: "OUT_OF_BOX", title: "Out of Box" },
        { code: "INSIDE_BOX", title: "Inside Box" },
        { code: "PENALTY", title: "Penalty" },
        { code: "FREE_KICK", title: "Free Kick" },
        { code: "CORNER", title: "Corner" },
        { code: "HEADER", title: "Header" },
        { code: "VOLLEY", title: "Volley" },
      ],
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
