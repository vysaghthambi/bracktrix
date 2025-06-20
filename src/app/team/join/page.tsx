"use client";

import { useEffect, useState } from "react";
import { Team } from "@prisma/client";
import axios from "axios";

import TextField from "@mui/material/TextField";

export default function JoinTeam() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
  };

  useEffect(() => {
    if (!searchInput) {
      setSearchTerm("");
      return;
    }

    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!searchTerm) {
      setTeams([]);
      return;
    }

    const fetchTeams = async () => {
      const response = await axios.get<Team[]>(
        `/api/team?searchTerm=${searchTerm}&isUserExcluded=true`
      );

      setTeams(response.data);
    };

    fetchTeams();
  }, [searchTerm]);

  const handleJoinTeam = async (teamId: string) => {
    await axios.post(`/api/team/${teamId}/join`);

    setSearchInput("");
  };

  return (
    <div>
      <h1>Join a team</h1>
      <TextField
        value={searchInput}
        onChange={handleInputChange}
        placeholder="Search Team"
      />
      {teams.map((team) => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>{team.description}</p>
          <button onClick={() => handleJoinTeam(team.id)}>Join</button>
        </div>
      ))}
    </div>
  );
}
