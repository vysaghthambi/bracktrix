"use client";

import Autocomplete, {
  AutocompleteProps,
  AutocompleteValue,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

export default function AutocompleteFormInput<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: UseControllerProps<FieldValues, string> & {
    label?: string;
    required?: boolean;
    options: T[];
    textFieldProps?: Partial<TextFieldProps>;
  } & Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>>
) {
  const { label, required, loading, fullWidth, textFieldProps, ...rest } =
    props;

  const {
    field: { ref, value, onChange, ...field },
    fieldState: { error },
  } = useController(props);

  const handleChange = <
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
  >(
    _event: React.SyntheticEvent,
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
  ) => {
    onChange(value);
  };

  return (
    <Autocomplete
      {...field}
      fullWidth={fullWidth}
      value={value ?? null}
      loading={loading}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth={fullWidth}
          slotProps={{
            inputLabel: { ...params.InputLabelProps, required },
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }
          }}
          inputRef={ref}
          error={!!error}
          helperText={error?.message}
          label={label}
          {...textFieldProps}
        />
      )}
      {...rest}
    />
  );
}
