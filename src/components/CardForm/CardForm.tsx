"use client";

import { MatchLineup } from "@prisma/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";

import { cardSchema, CardSchemaType, cardTypes } from "@/schema/matchEvent";
import TextFieldFormInput from "../FormInputs/TextFieldFormInput/TextFieldFormInput";
import AutocompleteFormInput from "../FormInputs/AutocompleteFormInput/AutocompleteFormInput";

export default function CardForm({
  defaultValues,
  players,
  matchId,
  teamId,
  tournamentId,
  onSubmit,
}: Readonly<{
  defaultValues: CardSchemaType;
  players: MatchLineup[];
  matchId: string;
  teamId: string;
  tournamentId: string;
  onSubmit: (
    data: CardSchemaType,
    matchId: string,
    teamId: string,
    tournamentId: string
  ) => void;
}>) {
  const methods = useForm<CardSchemaType>({
    defaultValues,
    resolver: yupResolver(cardSchema),
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = (data: CardSchemaType) => {
    onSubmit(data, matchId, teamId, tournamentId);
  };

  const onError = (errors: FieldErrors<CardSchemaType>) => {
    console.log(errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit, onError)}>
        <TextFieldFormInput name="minute" label="Minute" />
        <AutocompleteFormInput
          name="cardType"
          label="Card"
          options={cardTypes}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option.code === value.code}
        />
        <AutocompleteFormInput
          name="player"
          label="Player"
          options={players}
          getOptionLabel={(option) =>
            `${option.jerseyNumber} - ${option.name} (${option.positionCode})`
          }
          isOptionEqualToValue={(option, value) =>
            option.playerId === value.playerId
          }
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
