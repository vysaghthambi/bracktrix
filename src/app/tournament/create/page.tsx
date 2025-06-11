"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { Team, Tournament } from "@prisma/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import AutocompleteFormInput from "@/components/FormInputs/AutocompleteFormInput/AutocompleteFormInput";
import DatePickerFormInput from "@/components/FormInputs/DatePickerFormInput/DatePickerFormInput";
import TextFieldFormInput from "@/components/FormInputs/TextFieldFormInput/TextFieldFormInput";

import { tournamentSchema, TournamentSchemaType } from "@/schema/tournament";

import { TournamentCreatePayload } from "@/types/tournament";
import { knockoutFormats, tournamentTypes } from "@/constants/tournament";

export default function CreateTournament() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[] | null>([]);

  const methods = useForm<TournamentSchemaType>({
    resolver: yupResolver(tournamentSchema),
    defaultValues: {
      ...tournamentSchema.getDefault(),
      startDate: null!,
      endDate: null!,
      tournamentType: null!,
      knockoutFormat: null!,
    },
  });

  const { handleSubmit, watch } = methods;

  const selectedTournamentType = watch("tournamentType");

  useEffect(() => {
    (async () => {
      setTeams(null);

      const response = await axios.get<Team[]>(`/api/team`);

      setTeams(response.data);
    })();
  }, []);

  const onSubmit = async (data: TournamentSchemaType) => {
    const { teams, tournamentType, knockoutFormat, ...payload } = data;

    const response = await axios.post<
      Pick<Tournament, "id">,
      AxiosResponse<Pick<Tournament, "id">>,
      TournamentCreatePayload
    >("/api/tournament", {
      ...payload,
      teams: teams.map((team) => team.id),
      tournamentType: tournamentType.value!,
      knockoutFormat: knockoutFormat?.value
    });

    router.push(`/tournament/${response.data.id}`);
  };

  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <div>
      <h1>Create Tournament</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <TextFieldFormInput
            type="text"
            name="name"
            placeholder="Tournament Name"
            required
          />
          <TextFieldFormInput
            type="text"
            name="description"
            placeholder="Description"
          />
          <TextFieldFormInput
            type="text"
            name="location"
            placeholder="Location"
          />
          <TextFieldFormInput
            type="text"
            name="locationUrl"
            placeholder="Location URL"
          />
          <TextFieldFormInput
            type="number"
            name="playersCount"
            placeholder="Players Count"
          />
          <TextFieldFormInput
            type="text"
            name="substitutesCount"
            placeholder="Substitutes Count"
          />
          <TextFieldFormInput
            type="text"
            name="duration"
            placeholder="Match Duration (min)"
          />
          <DatePickerFormInput name="startDate" />
          <DatePickerFormInput name="endDate" />
          <AutocompleteFormInput
            name="tournamentType"
            options={tournamentTypes ?? []}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
          {selectedTournamentType?.value === "KNOCKOUT" || selectedTournamentType?.value === "GROUP_KNOCKOUT" && (
            <AutocompleteFormInput
              name="knockoutFormat"
              options={knockoutFormats ?? []}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
            />
          )}
          <AutocompleteFormInput
            name="teams"
            multiple
            options={teams ?? []}
            loading={!teams}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <button type="submit">Create</button>
        </form>
      </FormProvider>
    </div>
  );
}
