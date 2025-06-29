"use client";

import Switch, { SwitchProps } from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

export default function SwitchFormInput(
  props: UseControllerProps<FieldValues, string> & {
    label?: string;
    labelPlacement?: "start" | "end" | "top" | "bottom";
  } & Partial<SwitchProps>
) {
  const { label, labelPlacement = "end", ...rest } = props;

  const {
    field: { ref, value, onChange, ...field },
  } = useController(props);

  const handleChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onChange(checked);
  };

  const switchComponent = (
    <Switch
      {...field}
      checked={value ?? false}
      onChange={handleChange}
      slotProps={{ input: { ref: ref } }}
      {...rest}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchComponent}
        label={label}
        labelPlacement={labelPlacement}
      />
    );
  }

  return switchComponent;
}
