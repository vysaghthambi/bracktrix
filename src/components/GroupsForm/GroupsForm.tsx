"use client";

import { Group } from "@prisma/client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, FormProvider, FieldErrors } from "react-hook-form";

import TextFieldFormInput from "../FormInputs/TextFieldFormInput/TextFieldFormInput";
import AutocompleteFormInput from "../FormInputs/AutocompleteFormInput/AutocompleteFormInput";

import { groupSchema, GroupSchemaType } from "@/schema/group";

type Team = {
  id: string;
  name: string;
}

type GroupsFormProps = {
  tournamentId: string;
  tournamentTeams: Team[];
  defaultValues: GroupSchemaType;
};

export default function GroupsForm({
  tournamentId,
  tournamentTeams,
  defaultValues,
}: Readonly<GroupsFormProps>) {
  const [deleteGroups, setDeleteGroups] = useState<string[]>([]);

  const methods = useForm<GroupSchemaType>({
    defaultValues,
    resolver: yupResolver(groupSchema)
  });

  const { control, formState: { isSubmitting }, handleSubmit } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "groups",
  });

  const router = useRouter();

  const createGroup = async (group: { name: string; teams: Team[] }, orderNumber: number) => {
    return axios.post<Pick<Group, "id">>(`/api/tournament/${tournamentId}/group`, {
      orderNumber,
      name: group.name,
      teams: group.teams.map((team) => team.id),
    });
  };

  const updateGroup = async (groupId: string, group: { name: string; teams: Team[] }, orderNumber: number) => {
    return axios.put<Pick<Group, "id">>(`/api/tournament/${tournamentId}/group/${groupId}`, {
      orderNumber,
      name: group.name,
      teams: group.teams.map((team) => team.id),
    });
  };

  const deleteGroup = async (groupId: string) => {
    return axios.delete(`/api/tournament/${tournamentId}/group/${groupId}`);
  };

  const handleRemove = (index: number) => {
    const group = fields[index];
    if (group.groupId) {
      setDeleteGroups((prev) => [...prev, group.groupId!]);
    }
    remove(index);
  };

  const handleAdd = () => {
    append({ name: "", teams: [], orderNumber: fields.length + 1 });
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);
  };

  const onSubmit = async (data: GroupSchemaType) => {
    if (isSubmitting) return;

    try {
      const promises: Promise<AxiosResponse<Pick<Group, "id">>>[] = [];

      data.groups.forEach((group, index) => {
        if (group.groupId) {
          const originalGroup = defaultValues.groups.find(g => g.groupId === group.groupId);

          if (originalGroup && (
            originalGroup.name !== group.name ||
            JSON.stringify(originalGroup.teams.map(t => t.id).sort((a, b) => a.localeCompare(b))) !==
            JSON.stringify(group.teams.map(t => t.id).sort((a, b) => a.localeCompare(b))) ||
            index + 1 !== originalGroup.orderNumber
          )) {
            promises.push(updateGroup(group.groupId, group, index + 1));
          }
        } else {
          promises.push(createGroup(group, index + 1));
        }
      });

      if (deleteGroups.length) {
        deleteGroups.forEach((groupId) => {
          promises.push(deleteGroup(groupId));
        });
      }

      await Promise.all(promises);
      router.push(`/tournament/${tournamentId}/groups`);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const onError = (errors: FieldErrors<GroupSchemaType>) => {
    console.log(errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <TextFieldFormInput
              name={`groups.${index}.name`}
              label="Group Name"
              required
            />
            <AutocompleteFormInput
              name={`groups.${index}.teams`}
              label="Teams"
              required
              options={tournamentTeams}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              multiple
            />
            <button type="button" onClick={() => handleRemove(index)}>Remove</button>
            {index > 0 && (
              <button type="button" onClick={() => handleMove(index, index - 1)}>Move Up</button>
            )}
            {index < fields.length - 1 && (
              <button type="button" onClick={() => handleMove(index, index + 1)}>Move Down</button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
        >
          Add Group
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </FormProvider>
  );
}
