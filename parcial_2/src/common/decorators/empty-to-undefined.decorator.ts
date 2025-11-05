import { Transform } from 'class-transformer';

export function EmptyToUndefined() {
  return Transform(({ value }) => {
    if (value === '') return undefined;
    return value;
  });
}
