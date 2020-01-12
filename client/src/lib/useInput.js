import { useState } from 'react';

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(null),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      }
    }
  };
};
