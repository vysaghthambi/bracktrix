"use client";

import React from "react";
import { useDrag, useDrop } from "react-aria";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useForm,
  useFieldArray,
  FormProvider,
  UseFieldArraySwap,
  FieldErrors,
} from "react-hook-form";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextFieldFormInput from "../FormInputs/TextFieldFormInput/TextFieldFormInput";
import AutocompleteFormInput from "../FormInputs/AutocompleteFormInput/AutocompleteFormInput";

import {
  MatchLineupPlayer,
  matchLineupSchema,
  MatchLineupSchema,
} from "@/schema/matchLineup";

type SquadFormProps = {
  defaultValues: MatchLineupSchema;
  playerCount: number;
  substituteCount: number;
  onSubmit: (data: MatchLineupSchema) => void;
  playerPositions: string[];
};

function DraggablePlayerCard({
  player,
  index,
  playerPositions,
}: Readonly<{
  player: MatchLineupPlayer;
  index: number;
  playerPositions: string[];
}>) {
  const { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          "application/json": JSON.stringify({ player, index }),
        },
      ];
    },
  });

  return (
    <Card {...dragProps} sx={{ opacity: isDragging ? 0.8 : 1, mb: 2 }}>
      <CardContent>
        <TextFieldFormInput name={`players.${index}.name`} label="Name" />
        <TextFieldFormInput
          name={`players.${index}.jerseyNumber`}
          label="Jersey Number"
        />
        <AutocompleteFormInput
          name={`players.${index}.positionCode`}
          label="Position"
          options={playerPositions}
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, value) => option === value}
        />
      </CardContent>
    </Card>
  );
}

function PlayerDropZone({
  targetIndex,
  children,
  swapPlayer,
}: Readonly<{
  targetIndex: number;
  children: React.ReactNode;
  swapPlayer: UseFieldArraySwap;
}>) {
  const ref = React.useRef(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    onDrop(e) {
      Promise.all(
        e.items
          .filter((item) => item.kind === "text")
          .map((item) => item.getText("application/json").then(JSON.parse))
      ).then((items) => {
        const { index: sourceIndex } = items[0];
        if (sourceIndex === targetIndex) return;
        swapPlayer(sourceIndex, targetIndex);
      });
    },
  });

  return (
    <div
      ref={ref}
      {...dropProps}
      style={{ background: isDropTarget ? "#e0e0e0" : undefined }}
    >
      {children}
    </div>
  );
}

export default function SquadForm({
  defaultValues,
  playerCount,
  substituteCount,
  onSubmit,
  playerPositions,
}: Readonly<SquadFormProps>) {
  const methods = useForm<MatchLineupSchema>({
    defaultValues,
    resolver: yupResolver(matchLineupSchema),
  });

  const { control, handleSubmit } = methods;

  const { fields, swap: swapPlayer } = useFieldArray({
    control: control,
    name: "players",
  });

  const totalPlayers = fields.length;
  const playingCount = playerCount;
  const substituteCountLocal = substituteCount;
  const playingEnd = playingCount;
  const substituteEnd = playingCount + substituteCountLocal;

  const onError = (errors: FieldErrors<MatchLineupSchema>) => {
    console.log(errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          <h6>
            Players ({Math.min(playingEnd, totalPlayers)}/{playerCount})
          </h6>
          <div>
            {fields.slice(0, playingEnd).map((field, index) => (
              <PlayerDropZone
                key={field.id}
                targetIndex={index}
                swapPlayer={swapPlayer}
              >
                <DraggablePlayerCard
                  player={field}
                  index={index}
                  playerPositions={playerPositions}
                />
              </PlayerDropZone>
            ))}
          </div>
        </div>
        <div>
          <h6>
            Substitutes (
            {Math.max(0, Math.min(substituteEnd, totalPlayers) - playingEnd)}/
            {substituteCount})
          </h6>
          <div>
            {fields.slice(playingEnd, substituteEnd).map((field, idx) => {
              const index = playingEnd + idx;
              return (
                <PlayerDropZone
                  key={field.id}
                  targetIndex={index}
                  swapPlayer={swapPlayer}
                >
                  <DraggablePlayerCard
                    player={field}
                    index={index}
                    playerPositions={playerPositions}
                  />
                </PlayerDropZone>
              );
            })}
          </div>
        </div>
        <div>
          <h6>Extra Players</h6>
          <div>
            {fields.slice(substituteEnd).map((field, idx) => {
              const index = substituteEnd + idx;
              return (
                <PlayerDropZone
                  key={field.id}
                  targetIndex={index}
                  swapPlayer={swapPlayer}
                >
                  <DraggablePlayerCard
                    player={field}
                    index={index}
                    playerPositions={playerPositions}
                  />
                </PlayerDropZone>
              );
            })}
          </div>
        </div>
        <div>
          <button type="submit">Save Squad</button>
        </div>
      </form>
    </FormProvider>
  );
}
