import { cn } from '@/src/lib/utils';
import { Body } from '@coreloops-ui/coreloops/body';
import { FormField } from '@coreloops-ui/form';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as ShadSelect } from '@coreloops-ui/select';
import { Spinner } from '@coreloops-ui/spinner';
import { FocusEvent, HTMLAttributes, JSX, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Control, FieldError, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export type SelectOption = { label: string; value: string };

type LocalProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
  inputClassName?: string;
  loading?: boolean;
  style?: HTMLAttributes<HTMLDivElement>['style'];
  onBlur?: (e?: FocusEvent<HTMLInputElement>) => void;
  defaultOpen?: boolean;
  disabled?: boolean;
  error?: FieldError;
  name?: string;
  leftComponent?: JSX.Element;
  onChange?: (value: string, name?: string) => void;
  renderItem?: (option: SelectOption) => ReactNode;
};

type ControlledSelectProps<T extends FieldValues> = LocalProps & {
  name: Path<T>;
  control: Control<T>;
  rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
};

type SelectProps = LocalProps & {
  onChange: (value: string, name?: string) => void;
  value: string;
};

export const ControlledSelect = <T extends FieldValues>({
  name,
  control,
  className,
  onChange,
  rules,
  ...rest
}: ControlledSelectProps<T>) => {
  return (
    <div className={className}>
      <FormField
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const handleChange = (value: string) => {
            field.onChange(value);
            onChange?.(value, name);
          };
          return <Select {...rest} name={name} onChange={handleChange} value={field.value} error={fieldState.error} />;
        }}
      />
    </div>
  );
};

export const Select = ({
  placeholder,
  label,
  options,
  onBlur,
  onLoadMore,
  loading,
  hasMore,
  className,
  name,
  style,
  disabled,
  defaultOpen,
  value,
  onChange,
  error,
  inputClassName,
  leftComponent,
  renderItem: _renderItem,
}: SelectProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(defaultOpen || false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleValueChange = (value: string) => {
    onChange(value, name);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!hasMore || !onLoadMore) return;
      const threshold = 100;
      if (!loading && el.scrollHeight - el.scrollTop - el.clientHeight < threshold) {
        onLoadMore();
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, onLoadMore, loading, open]);

  useEffect(() => {
    if (!open && onBlur) {
      onBlur({} as FocusEvent<HTMLInputElement>);
    }
  }, [open]);

  const renderItem = useCallback(
    (option: SelectOption) => {
      return (
        <SelectItem className="cursor-pointer" key={option.value} value={option.value}>
          {_renderItem ? _renderItem(option) : option.label}
        </SelectItem>
      );
    },
    [_renderItem],
  );

  return (
    <div className={className}>
      {!!label && (
        <Body variant="label" htmlFor={name}>
          {label}
        </Body>
      )}
      <ShadSelect onOpenChange={handleOpenChange} open={open} value={value} onValueChange={handleValueChange}>
        <div className="relative flex items-center">
          <SelectTrigger
            className={cn(
              'cursor-pointer',
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
              'dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none',
              'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              'md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              leftComponent ? 'pl-10' : '',
              inputClassName,
            )}
            disabled={disabled}
            style={style}
          >
            {leftComponent && <div className="absolute left-4 z-10 shrink-0">{leftComponent}</div>}
            <SelectValue placeholder={placeholder || 'Select value'} defaultValue={value} />
          </SelectTrigger>
        </div>

        <SelectContent>
          <div ref={scrollRef} className="max-h-60 overflow-y-auto">
            {options.map(renderItem)}
            {open && hasMore && (
              <div className="px-2 py-1">
                <Spinner size={20} className="border-4" />
              </div>
            )}
          </div>
        </SelectContent>
      </ShadSelect>
      {error && <Body variant="destructive">{error.message}</Body>}
    </div>
  );
};
