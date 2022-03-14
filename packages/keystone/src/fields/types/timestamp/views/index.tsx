/** @jsxRuntime classic */
/** @jsx jsx */
import { useState } from 'react';
import * as chrono from 'chrono-node';
import { format, isValid, parseISO } from 'date-fns';

import { jsx, Stack, Text } from '@keystone-ui/core';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import {
  CardValueComponent,
  CellComponent,
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '../../../../types';
import { CellContainer, CellLink } from '../../../../admin-ui/components';
import {
  deconstructTimestamp,
  formatOutput,
  Value,
} from './utils';

export const Field = ({
  field,
  value,
  onChange,
  forceValidation,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const [touchedInput, setTouchedInput] = useState(false);
  const showValidation = touchedInput || forceValidation;

  const validationMessages = showValidation
    ? validate(value, field.fieldMeta, field.label)
    : undefined;

  const propValue = !isValid(parseISO(value.value)) ? '' : format(parseISO(value.value), 'Pp');
  const [dateValue, setDateValue] = useState<string>(propValue);

  const parseDate = (dateText: string) => {
    setDateValue(dateText);
    let [parsedDate] = chrono.parse(dateText);
    onChange && onChange({ ...value, value: parsedDate?.date().toISOString() });
  };

  return (
    <FieldContainer as="fieldset">
      <Stack>
        <FieldLabel as="legend">{field.label}</FieldLabel>
        {onChange ? (
          <Stack>
            <TextInput
              onChange={event => {
                parseDate(event.target.value);
              }}
              onBlur={() => {
                let [parsedDate] = chrono.parse(value.value ?? '');
                if (parsedDate === undefined) {
                  onChange({ ...value, value: '' });
                  setDateValue('');
                }
                parsedDate && setDateValue(format(parsedDate?.date(), 'Pp'));
                setTouchedInput(true);
              }}
              value={dateValue ?? ''}
              autoFocus={autoFocus}
            />
            {validationMessages?.date && (
              <Text color="red600" size="small">
                {validationMessages.date}
              </Text>
            )}
          </Stack>

        ) : (
          value.value !== null && (
            <Text>
              {formatOutput(format(parseISO(value.value), 'Pp'))}
            </Text>
          )
        )}
        {((value.kind === 'create' &&
          typeof field.fieldMeta.defaultValue !== 'string' &&
          field.fieldMeta.defaultValue?.kind === 'now') ||
          field.fieldMeta.updatedAt) && (
            <Text>When this item is saved, this field will be set to the current date and time</Text>
          )}
      </Stack>
    </FieldContainer>
  );
};

function validate(
  value: Value,
  fieldMeta: TimestampFieldMeta,
  label: string
):
  | {
    time?: string;
    date?: string;
  }
  | undefined {
  const val = value.value;
  // const hasDateValue = val.dateValue !== null;
  // const hasTimeValue = typeof val.timeValue === 'string' || typeof val.timeValue.value === 'string';

  const isValueEmpty = !val;
  // if we recieve null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (value.kind === 'update' && value.initial === null && isValueEmpty) {
    return undefined;
  }

  if (
    value.kind === 'create' &&
    isValueEmpty &&
    ((typeof fieldMeta.defaultValue === 'object' && fieldMeta.defaultValue?.kind === 'now') ||
      fieldMeta.updatedAt)
  ) {
    return undefined;
  }

  if (fieldMeta.isRequired && isValueEmpty) {
    return { date: `${label} is required` };
  }

  // if (hasDateValue && !hasTimeValue) {
  //   return { time: `${label} requires a time to be provided` };
  // }
  // const timeError =
  //   typeof val.timeValue === 'string'
  //     ? `${label} requires a valid time in the format hh:mm`
  //     : undefined;
  // if (hasTimeValue && !hasDateValue) {
  //   return { date: `${label} requires a date to be selected`, time: timeError };
  // }

  // if (timeError) {
  //   return { time: timeError };
  // }
  return undefined;
}

export const Cell: CellComponent = ({ item, field, linkTo }) => {
  let value = item[field.path];
  return linkTo ? (
    <CellLink {...linkTo}>{formatOutput(value)}</CellLink>
  ) : (
    <CellContainer>{formatOutput(value)}</CellContainer>
  );
};
Cell.supportsLinkTo = true;

export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {formatOutput(item[field.path])}
    </FieldContainer>
  );
};

export type TimestampFieldMeta = {
  defaultValue: string | { kind: 'now'; } | null;
  updatedAt: boolean;
  isRequired: boolean;
};
export const controller = (
  config: FieldControllerConfig<TimestampFieldMeta>
): FieldController<Value, string> & { fieldMeta: TimestampFieldMeta; } => {
  return {
    path: config.path,
    label: config.label,
    graphqlSelection: config.path,
    fieldMeta: config.fieldMeta,
    defaultValue: {
      kind: 'create',
      value:
        typeof config.fieldMeta.defaultValue === 'string'
          ? deconstructTimestamp(config.fieldMeta.defaultValue) : ''
      // : { dateValue: null, timeValue: { kind: 'parsed', value: null } },
    },
    deserialize: data => {
      const value = data[config.path];
      return {
        kind: 'update',
        initial: data[config.path],
        value: value
        // ? deconstructTimestamp(value)
        // : { dateValue: null, timeValue: { kind: 'parsed', value: null } },
      };
    },
    serialize: ({ value }) => {
      // if (dateValue && typeof timeValue === 'object' && timeValue.value !== null) {
      //   let formattedDate = constructTimestamp({ dateValue, timeValue: timeValue.value });
      //   return { [config.path]: formattedDate };
      // }
      if (value) {
        return { [config.path]: new Date(value) };
      }
      return { [config.path]: null };
    },
    validate: value => validate(value, config.fieldMeta, config.label) === undefined,
    filter: {
      Filter(props) {
        const propValue = !isValid(parseISO(props.value)) ? '' : format(parseISO(props.value), 'Pp');
        let [value, setValue] = useState(propValue);

        const parseDate = (value: string) => {
          setValue(value);
          let [parsedDate] = chrono.parse(value);
          if (parsedDate === undefined) {
            return;
          }
          props.onChange(parsedDate.date().toISOString());
        };
        return (
          <TextInput
            onChange={event => {
              parseDate(event.target.value);
            }}
            onBlur={() => {
              let [parsedDate] = chrono.parse(value);
              if (parsedDate === undefined) {
                props.onChange(new Date().toISOString());
              }
            }}
            value={value}
            autoFocus={props.autoFocus}
          />
        );
      },

      graphql: ({ type, value }) => {
        const valueWithoutWhitespace = value.replace(/\s/g, '');
        const parsed =
          type === 'in' || type === 'not_in'
            ? valueWithoutWhitespace.split(',')
            : valueWithoutWhitespace;
        if (type === 'not') {
          return { [config.path]: { not: { equals: parsed } } };
        }
        const key = type === 'is' ? 'equals' : type === 'not_in' ? 'notIn' : type;
        return { [config.path]: { [key]: parsed } };
      },
      Label({ label, value, type }) {
        let renderedValue = value;
        if (['in', 'not_in'].includes(type)) {
          renderedValue = value
            .split(',')
            .map(value => value.trim())
            .join(', ');
        }
        return `${label.toLowerCase()}: ${renderedValue}`;
      },
      types: {
        is: {
          label: 'Is exactly',
          initialValue: '',
        },
        not: {
          label: 'Is not exactly',
          initialValue: '',
        },
        gt: {
          label: 'Is greater than',
          initialValue: '',
        },
        lt: {
          label: 'Is less than',
          initialValue: '',
        },
        gte: {
          label: 'Is greater than or equal to',
          initialValue: '',
        },
        lte: {
          label: 'Is less than or equal to',
          initialValue: '',
        },
        in: {
          label: 'Is one of',
          initialValue: '',
        },
        not_in: {
          label: 'Is not one of',
          initialValue: '',
        },
      },
    },
  };
};
