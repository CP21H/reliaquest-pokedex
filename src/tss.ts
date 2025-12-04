import { createTss } from 'tss-react';

function useContext() {
  const theme = {
    color: {
      surface: '#000E1C',
      text: {
        primary: '#FAFAFA',
      },
    },
    li: {
      marginBottom: 5,
      '&:hover': {
        color: '#838383ff',
        cursor: 'pointer',
      },
    },
  };

  return { theme };
}

export const { tss } = createTss({ useContext });

export const useStyles = tss.create({});
