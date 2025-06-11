"use client";

import TextField, { TextFieldProps } from "@mui/material/TextField";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import dayjs from "dayjs";

export default function DatePickerFormInput(props: UseControllerProps<FieldValues, string> & {
  required?: boolean;
  fullWidth?: boolean;
  textFieldProps?: Partial<TextFieldProps>;
} & Partial<DatePickerProps>) {
  const { required, loading, fullWidth, textFieldProps, ...rest } = props;

  const { field: { ref, onChange, value, ...field }, fieldState: { error } } = useController(props);

  return (
    <DatePicker
      {...field}
      value={value ? dayjs(value) : null}
      onChange={(value) => onChange(value?.toISOString())}
      loading={loading}
      inputRef={ref}
      format="DD-MM-YYYY"
      slotProps={{
        textField: {
          ...textFieldProps,
          error: !!error,
          helperText: error?.message,
          InputLabelProps: { required },
          fullWidth,
        }
      }}
      {...rest}
    />
  )
}