import { Body } from '@coreloops-ui/coreloops/body';
import { FormControl, FormField, FormItem } from '@coreloops-ui/form';
import { Input } from '@coreloops-ui/input';
import { FocusEvent, forwardRef, InputHTMLAttributes, JSX, Ref, useCallback, useRef, useState } from 'react';
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

type InputValues = string | number | undefined;

type ControlledInputProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  className?: string;
  rightComponent?: JSX.Element;
  leftComponent?: JSX.Element | ((props: { isFocused: boolean }) => JSX.Element);
  leftComponentPosition?: string;
  rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  suppressErrorMessage?: boolean;
  validateOnBlur?: (error?: boolean) => void;
  handleSubmit?: (value?: InputValues, name?: Path<T>, oldValue?: InputValues) => void;
};

type FieldInputProps<T extends FieldValues> = ControlledInputProps<T> & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  inputRef?: Ref<HTMLInputElement>;
};

const FieldInput = <T extends FieldValues>({
  fieldState,
  field,
  label,
  placeholder,
  name,
  inputRef,
  className,
  rightComponent,
  leftComponent,
  leftComponentPosition = 'left-4',
  suppressErrorMessage,
  validateOnBlur,
  handleSubmit,
  ...rest
}: FieldInputProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentValue = useRef<InputValues>(field.value);

  const handleFocus = () => {
    currentValue.current = field.value;
    setIsFocused(true);
  };

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      field.onBlur();
      rest.onBlurCapture?.(e);
      validateOnBlur?.(fieldState.error !== undefined);
      handleSubmit?.(e.target.value, field.name, currentValue.current);
      currentValue.current = field.value;
    },
    [field.onBlur, rest.onBlurCapture, validateOnBlur, fieldState.error],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      rest.onKeyDown?.(event);
      validateOnBlur?.(fieldState.error !== undefined);
    },
    [rest.onKeyDown, validateOnBlur, fieldState.error],
  );

  const renderedLeftComponent = typeof leftComponent === 'function' ? leftComponent({ isFocused }) : leftComponent;

  return (
    <FormItem>
      {!!label && (
        <Body variant="label" htmlFor={name}>
          {label}
        </Body>
      )}

      <div className="relative">
        <span
          className={`text-muted-foreground pointer-events-none absolute inset-y-0 ${leftComponentPosition} flex items-center text-sm`}
        >
          {renderedLeftComponent}
        </span>

        <FormControl>
          <Input
            {...rest}
            {...field}
            onChange={e => {
              if (rest.type === 'file') {
                const file = e.target.files?.[0];
                field.onChange(file);
                rest.onChange?.(e);
              } else {
                field.onChange(e.target.value);
                rest.onChange?.(e);
              }
            }}
            onFocus={handleFocus}
            onBlurCapture={handleBlur}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            placeholder={placeholder}
            className={className}
            value={rest.type === 'file' ? undefined : (field.value ?? '')}
          />
        </FormControl>

        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm">
          {rightComponent}
        </span>
      </div>

      {fieldState.error && !suppressErrorMessage && <Body variant="destructive">{fieldState.error.message}</Body>}
    </FormItem>
  );
};

const ControlledInputInner = <T extends FieldValues>(
  { control, name, rules, ...rest }: ControlledInputProps<T>,
  ref: Ref<HTMLInputElement>,
) => {
  return (
    <FormField
      rules={rules}
      name={name}
      control={control}
      render={({ fieldState, field }) => (
        <FieldInput name={name} control={control} inputRef={ref} {...rest} field={field} fieldState={fieldState} />
      )}
    />
  );
};

export const ControlledInput = forwardRef(ControlledInputInner) as <T extends FieldValues>(
  props: ControlledInputProps<T> & { ref?: Ref<HTMLInputElement> },
) => ReturnType<typeof ControlledInputInner>;
