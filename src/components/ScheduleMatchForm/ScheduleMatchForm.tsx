"use client";

import axios from "axios";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Group, Team } from "@prisma/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";

import TextField from "@mui/material/TextField";

import { MatchCreatePayload } from "@/types/match";
import { knockoutLevels, matchSchema, MatchSchemaType } from "@/schema/match";

import TextFieldFormInput from "../FormInputs/TextFieldFormInput/TextFieldFormInput";
import AutocompleteFormInput from "../FormInputs/AutocompleteFormInput/AutocompleteFormInput";
import DateTimePickerFormInput from "../FormInputs/DateTimePickerFormInput/DateTimePickerFormInput";

type GroupType = Group & { groupTeams: { team: Pick<Team, "id" | "name"> }[] };

type ScheduleMatchFormProps = {
  defaultValues: MatchSchemaType;
  groups?: GroupType[];
  teams?: Pick<Team, "id" | "name">[];
  tournamentId: string;
  matchId?: string;
};

export default function ScheduleMatchForm({
  defaultValues,
  groups,
  teams,
  tournamentId,
  matchId,
}: Readonly<ScheduleMatchFormProps>) {
  const router = useRouter();

  const methods = useForm<MatchSchemaType>({
    defaultValues: defaultValues,
    resolver: yupResolver(matchSchema),
  });

  const { watch, resetField } = methods;

  const selectedGroup = watch("group");
  const isGroupMatch = watch("isGroupMatch");

  const teamOptions = useMemo(() => {
    if (teams) return teams;

    resetField("homeTeam");
    resetField("awayTeam");

    if (!selectedGroup) return [];

    return (
      groups
        ?.find((group) => group.id === selectedGroup.id)
        ?.groupTeams.map((groupTeam) => groupTeam.team) ?? []
    );
  }, [selectedGroup]);

  const onSubmit = async (data: MatchSchemaType) => {
    const payload: MatchCreatePayload = {
      matchNumber: data.matchNumber,
      title: data.title,
      homeTeamId: data.homeTeam.id,
      awayTeamId: data.awayTeam.id,
      startTime: data.startTime,
      duration: data.duration,
      groupId: data.group?.id,
      knockoutLevel: data.knockoutLevel?.id,
    };

    if (matchId) {
      await axios
        .put(`/api/tournament/${tournamentId}/match/${matchId}`, payload)
        .catch((error) => {
          console.error(error);
          throw error;
        });
    } else {
      await axios
        .post(`/api/tournament/${tournamentId}/match`, payload)
        .catch((error) => {
          console.error(error);
          throw error;
        });
    }

    if (data.isGroupMatch) {
      router.push(`/tournament/${tournamentId}/groups`);
    } else {
      router.push(`/tournament/${tournamentId}/knockout`);
    }
  };

  const onError = (error: FieldErrors<MatchSchemaType>) => {
    console.error(error);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
        {isGroupMatch && groups && (
          <AutocompleteFormInput
            name="group"
            label="Group"
            options={groups}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Group" />}
          />
        )}
        <TextFieldFormInput name="matchNumber" label="Match Number" />
        <TextFieldFormInput name="title" label="Title" />
        <AutocompleteFormInput
          name="homeTeam"
          label="Home Team"
          options={teamOptions}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          fullWidth
        />
        <AutocompleteFormInput
          name="awayTeam"
          label="Away Team"
          options={teamOptions}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          fullWidth
        />
        <DateTimePickerFormInput name="startTime" label="Start Time" />
        <TextFieldFormInput name="duration" label="Duration (minutes)" />
        {!isGroupMatch && (
          <AutocompleteFormInput
            name="knockoutLevel"
            label="Knockout Level"
            options={knockoutLevels}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            fullWidth
          />
        )}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
