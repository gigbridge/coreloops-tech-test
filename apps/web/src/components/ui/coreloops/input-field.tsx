// This input should only be used for inputs that don't require react-hook-form

import { useDebounce } from '@/src/hooks/use-debounce';
import { Body } from '@coreloops-ui/coreloops/body';
import { Input } from '@coreloops-ui/input';
import { ChangeEventHandler, forwardRef, InputHTMLAttributes, JSX, useState } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  rightComponent?: JSX.Element;
  leftComponent?: JSX.Element;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ name, label, value, placeholder, className, rightComponent, leftComponent, onChange }: InputFieldProps, ref) => {
    return (
      <div>
        {!!label && (
          <Body variant="label" htmlFor={name}>
            {label}
          </Body>
        )}
        <div className="relative">
          {leftComponent && (
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm">
              {leftComponent}
            </span>
          )}
          <Input
            name={name}
            onChange={onChange}
            ref={ref}
            placeholder={placeholder}
            className={className}
            value={value || ''}
          />
          {rightComponent && (
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm">
              {rightComponent}
            </span>
          )}
        </div>
      </div>
    );
  },
);

type DebouncedInputFieldProps = Omit<InputFieldProps, 'onChange'> & {
  onChange: (value: string) => void;
  immediateOnChange?: (value: string) => void;
  delay: number;
};

/**
 * A debounced input field component.
 *
 * This component is useful when the parent container performs expensive actions in response to value changes.
 * Instead of updating on every keystroke, it waits for a specified debounce delay before triggering the parent's `onChange`.
 * An immediate onChange method can be passed in if the outer component still requires some reactivity to the value
 *
 * @param props {DebouncedInputFieldProps}
 * @constructor
 */
export const DebouncedInputField = (props: DebouncedInputFieldProps) => {
  // Local state to keep track of the input value, ensuring it stays in sync with the displayed value.
  const [value, setValue] = useState<string>(props.value as string);

  // Debounce the parent's onChange callback to reduce frequent updates and improve performance.
  useDebounce(
    () => {
      props.onChange(value);
    },
    props.delay,
    [value],
  );

  // Render a regular input field.
  // This input is not directly controlled by the parent but instead managed locally
  // and updates to the parent only after the debounced delay. This shouldn't be used in conjunction with a form,
  // which is why we don't render a controlled input.
  return (
    <InputField
      {...props}
      onChange={e => {
        props.immediateOnChange?.(e.target.value);
        setValue(e.target.value);
      }}
      value={value}
    />
  );
};
