"use client";

import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Position, User } from "@prisma/client";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function ProfileComplete() {
  const { data: session } = useSession();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState<User | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionInputValue, setPositionInputValue] = useState<string>("");
  const [jerseyNumber, setJerseyNumber] = useState<string>("");
  const [position, setPosition] = useState<Position | null>(null);

  if (!session) {
    router.push("/");
  }

  useEffect(() => {
    Promise.all([
      axios.get<Position[]>("/api/position"),
      axios.get<User>("/api/profile"),
    ])
      .then(([positionsRes, userRes]) => {
        setPositions(positionsRes.data);
        setUser(userRes.data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  useEffect(() => {
    if (!user || !positions.length) return;

    setJerseyNumber(user.jerseyNumber?.toString() ?? "");
    setPosition(positions.find((p) => p.code === user.positionCode) ?? null);
  }, [user, positions]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!jerseyNumber || !position) {
      enqueueSnackbar("Please fill in all fields", {
        variant: "error",
      });
      return;
    }

    if (isNaN(parseInt(jerseyNumber))) {
      enqueueSnackbar("Jersey number must be a number", {
        variant: "error",
      });
      return;
    }

    axios
      .patch("/api/profile", {
        jerseyNumber,
        positionCode: position?.code,
      })
      .then(() => {
        enqueueSnackbar("Profile updated", {
          variant: "success",
        });

        router.push("/");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        enqueueSnackbar("Error updating profile", {
          variant: "error",
        });
      });
  };

  return (
    <div>
      <h1>Complete Profile</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          name="jerseyNumber"
          label="Jersey Number"
          value={jerseyNumber}
          onChange={(event) => setJerseyNumber(event.target.value)}
        />
        <Autocomplete
          options={positions}
          getOptionLabel={(option) => option.title}
          value={position}
          onChange={(_event, value) => setPosition(value)}
          inputValue={positionInputValue}
          onInputChange={(_event, value) => setPositionInputValue(value)}
          renderInput={(params) => (
            <TextField {...params} name="position" label="Position" />
          )}
        />
        <button type="submit">Complete</button>
      </form>
    </div>
  );
}
