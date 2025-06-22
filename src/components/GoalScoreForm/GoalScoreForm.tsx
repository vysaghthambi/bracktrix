"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { GoalType, MatchLineup } from "@prisma/client";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";

import { goalScoreSchema, GoalScoreSchemaType } from "@/schema/matchEvent";
import TextFieldFormInput from "../FormInputs/TextFieldFormInput/TextFieldFormInput";
import AutocompleteFormInput from "../FormInputs/AutocompleteFormInput/AutocompleteFormInput";
import SwitchFormInput from "../FormInputs/SwitchFormInput/SwitchFormInput";

type GoalScoreFormProps = {
  defaultValues: GoalScoreSchemaType;
  scoredTeamLineup: MatchLineup[];
  concededTeamLineup: MatchLineup[];
  goalTypes: GoalType[];
  matchId: string;
  tournamentId: string;
  isHomeTeam: boolean;
  onSubmit: (
    data: GoalScoreSchemaType,
    matchId: string,
    tournamentId: string,
    isHomeTeam: boolean
  ) => void;
};

export default function GoalScoreForm({
  defaultValues,
  scoredTeamLineup,
  concededTeamLineup,
  goalTypes,
  matchId,
  tournamentId,
  isHomeTeam,
  onSubmit,
}: Readonly<GoalScoreFormProps>) {
  const methods = useForm<GoalScoreSchemaType>({
    defaultValues,
    resolver: yupResolver(goalScoreSchema),
  });

  const { watch, handleSubmit } = methods;

  const isOwnGoal = watch("isOwnGoal");

  const playerOptions = isOwnGoal ? concededTeamLineup : scoredTeamLineup;

  const handleFormSubmit = (data: GoalScoreSchemaType) => {
    onSubmit(data, matchId, tournamentId, isHomeTeam);
  };

  const onError = (errors: FieldErrors<GoalScoreSchemaType>) => {
    console.error(errors);
  };

  return (
    <div>
      <h6>GoalScoreForm</h6>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit, onError)}>
          <SwitchFormInput name="isOwnGoal" label="Is Own Goal" />
          <TextFieldFormInput name="minute" label="Minute" />
          <AutocompleteFormInput
            name="player"
            label="Player"
            required
            options={playerOptions}
            getOptionLabel={(option) =>
              `${option.jerseyNumber} - ${option.name} (${option.positionCode})`
            }
            isOptionEqualToValue={(option, value) =>
              option.playerId === value.playerId
            }
          />
          {!isOwnGoal && (
            <>
              <AutocompleteFormInput
                name="assistPlayer"
                label="Assist Player"
                options={playerOptions}
                getOptionLabel={(option) =>
                  `${option.jerseyNumber} - ${option.name} (${option.positionCode})`
                }
                isOptionEqualToValue={(option, value) =>
                  option.playerId === value.playerId
                }
              />
              <AutocompleteFormInput
                name="goalType"
                label="Goal Type"
                options={goalTypes}
                getOptionLabel={(option) => option.title}
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
              />
            </>
          )}

          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    </div>
  );
}
