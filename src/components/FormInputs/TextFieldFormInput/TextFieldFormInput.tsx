"use client";

import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

export default function TextFieldFormInput(props: UseControllerProps<FieldValues, string> & Partial<TextFieldProps>) {
  const { required, ...rest } = props;

  const {
    field: { ref, ...field },
    fieldState: { error },
  } = useController(props);

  return (
    <TextField
      {...field}
      slotProps={{ inputLabel: { required } }}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
      {...rest}
    />
  );
}
