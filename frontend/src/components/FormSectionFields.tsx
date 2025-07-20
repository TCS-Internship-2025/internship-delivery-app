import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { ZodEnum } from 'zod';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

/**
 * This component acts as a "form builder", which renders desired fields based on the provided configuration.
 * Example usage: FieldConfig<your form schema>[][] --> each array represents a column of fields
 * With two columns, you will have two vertical columns of fields, perfectly arranged on the UI.
 *
 * Each field can be configured with properties like:
 * - name - the key in the provided form data
 * - label - the label displayed for the field
 * - disabled - whether the field is disabled
 * - required - whether the field is required
 * - type - the type of field (text, textarea, select, date, radio, checkbox, increment, etc.)
 * - options - for select and radio, a enum containing the options
 * - orientation - for radio or checkbox fields, 'horizontal' (default) for row layout or 'vertical' for column layout
 * - min / max - for increment fields
 * - maxRows - for textarea fields; limits height before scrolling
 */

export interface FieldConfig<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'radio' | 'checkbox' | 'increment';
  disabled?: boolean;
  required?: boolean;
  sx?: object;
  options?: ZodEnum;
  orientation?: 'horizontal' | 'vertical';
  min?: number;
  max?: number;
  rowGroup?: string;
  maxRows?: number;
}

interface FormFieldProps<T extends FieldValues = FieldValues> {
  field: FieldConfig<T>;
  control: Control<T>;
}

const FormField = <T extends FieldValues = FieldValues>({ field, control }: FormFieldProps<T>) => (
  <Controller
    name={field.name as Path<T>}
    control={control}
    render={({ field: fieldProps, fieldState: { error } }) => {
      const fieldType = field.type ?? 'text';
      switch (fieldType) {
        case 'date':
          return (
            <DatePicker
              value={fieldProps.value as Date | null}
              onChange={(date) => fieldProps.onChange(date)}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small',
                  label: field.label,
                  required: field.required,
                  disabled: field.disabled,
                  error: !!error,
                },
              }}
            />
          );

        case 'select':
          if (!field.options) {
            // Fallback to plain text field when no options supplied
            return (
              <TextField
                {...fieldProps}
                variant="outlined"
                size="small"
                label={field.label}
                required={field.required}
                disabled={field.disabled}
                error={!!error}
                sx={field.sx}
              />
            );
          }
          return (
            <TextField
              {...fieldProps}
              variant="outlined"
              size="small"
              label={field.label}
              required={field.required}
              disabled={field.disabled}
              select
              error={!!error}
              sx={field.sx}
            >
              {field.options.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          );

        case 'radio': {
          const isRow = field.orientation ? field.orientation === 'horizontal' : true;
          return (
            <RadioGroup
              row={isRow}
              value={fieldProps.value ?? ''}
              onChange={(_, val) => fieldProps.onChange(val)}
              sx={field.sx}
            >
              {field.options
                ? field.options.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio size="small" />}
                      label={option}
                      disabled={field.disabled}
                    />
                  ))
                : null}
            </RadioGroup>
          );
        }

        case 'checkbox': {
          const isRow = field.orientation ? field.orientation === 'horizontal' : true;
          const selectedValues = (fieldProps.value as string[] | undefined) ?? [];
          const toggleValue = (value: string) => {
            if (selectedValues.includes(value)) {
              fieldProps.onChange(selectedValues.filter((v) => v !== value));
            } else {
              fieldProps.onChange([...selectedValues, value]);
            }
          };
          return (
            <FormGroup row={isRow} sx={field.sx}>
              {field.options
                ? field.options.options.map((option) => {
                    const optionStr = String(option);
                    return (
                      <FormControlLabel
                        key={optionStr}
                        control={
                          <Checkbox
                            checked={selectedValues.includes(optionStr)}
                            onChange={() => toggleValue(optionStr)}
                            size="small"
                            disabled={field.disabled}
                          />
                        }
                        label={optionStr}
                      />
                    );
                  })
                : null}
            </FormGroup>
          );
        }

        case 'textarea': {
          const maxRows = field.maxRows ?? 10; // default max
          return (
            <TextField
              {...fieldProps}
              variant="outlined"
              size="small"
              label={field.label}
              required={field.required}
              disabled={field.disabled}
              error={!!error}
              sx={field.sx}
              multiline
              minRows={3}
              maxRows={maxRows}
            />
          );
        }

        case 'increment': {
          const min = field.min ?? 0;
          const max = field.max;
          const step = 1;
          const currentRaw = typeof fieldProps.value === 'number' ? fieldProps.value : min;
          const current = Math.max(min, currentRaw);

          const clamp = (val: number) => {
            const upper = max !== undefined ? Math.min(val, max) : val;
            return Math.max(upper, min);
          };

          const handleChange = (next: number) => {
            fieldProps.onChange(clamp(next));
          };

          const decrementDisabled = field.disabled ?? current - step < min;
          const incrementDisabled = field.disabled ?? (max !== undefined && current + step > max);

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...field.sx }}>
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: 1,
                  color: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                onClick={() => handleChange(current - step)}
                disabled={decrementDisabled}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="subtitle1" sx={{ minWidth: 24, textAlign: 'center' }}>
                {current}
              </Typography>
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: 1,
                  color: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                onClick={() => handleChange(current + step)}
                disabled={incrementDisabled}
              >
                <AddIcon />
              </IconButton>
            </Box>
          );
        }

        default:
          return (
            <TextField
              {...fieldProps}
              variant="outlined"
              size="small"
              label={field.label}
              required={field.required}
              disabled={field.disabled}
              error={!!error}
              sx={field.sx}
            />
          );
      }
    }}
  />
);

interface SectionFieldsProps<T extends FieldValues = FieldValues> {
  fields: FieldConfig<T>[][];
  control: Control<T>;
}

export const SectionFields = <T extends FieldValues = FieldValues>({ fields, control }: SectionFieldsProps<T>) => (
  <Box display="flex" gap={2}>
    {fields.map((columnFields) => (
      <Box key={columnFields[0]?.name || 'column'} display="flex" flexDirection="column" gap={2} flex={1}>
        {columnFields.map((field, fieldIndex) => {
          // If the current and next field share the same rowGroup, render them in one row.
          if (
            field.rowGroup &&
            columnFields[fieldIndex + 1] &&
            columnFields[fieldIndex + 1].rowGroup === field.rowGroup
          ) {
            return (
              <Box key={field.rowGroup + field.name} sx={{ display: 'flex', gap: 2 }}>
                <FormField field={field} control={control} />
                <FormField field={columnFields[fieldIndex + 1]} control={control} />
              </Box>
            );
          }

          // Skip rendering if this field belongs to the same rowGroup as the previous one (already rendered).
          if (fieldIndex > 0 && field.rowGroup && columnFields[fieldIndex - 1].rowGroup === field.rowGroup) {
            return null;
          }

          return <FormField key={field.name} field={field} control={control} />;
        })}
      </Box>
    ))}
  </Box>
);
