"use client";

import { TextFieldProps } from "@mui/material/TextField";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import dayjs from "dayjs";

export default function DateTimePickerFormInput(
  props: UseControllerProps<FieldValues, string> & {
    required?: boolean;
    fullWidth?: boolean;
    textFieldProps?: Partial<TextFieldProps>;
  } & Partial<DateTimePickerProps>
) {
  const { required, loading, fullWidth, textFieldProps, ...rest } = props;

  const {
    field: { ref, onChange, value, ...field },
    fieldState: { error },
  } = useController(props);

  return (
    <DateTimePicker
      {...field}
      value={value ? dayjs(value) : null}
      onChange={(value) => onChange(value?.toISOString())}
      loading={loading}
      inputRef={ref}
      format="DD-MM-YYYY HH:mm a"
      slotProps={{
        textField: {
          ...textFieldProps,
          error: !!error,
          helperText: error?.message,
          InputLabelProps: { required },
          fullWidth,
        },
      }}
      {...rest}
    />
  );
}
