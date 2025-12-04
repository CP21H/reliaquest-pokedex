import { createTss } from 'tss-react';

function useContext() {
  const theme = {
    color: {
      surface: '#000E1C',
      text: {
        primary: '#fafafaff',
      },
    },
    li: {
      marginBottom: 5,
      '&:hover': {
        color: '#838383ff',
        cursor: 'pointer',
      },
    },
    input: {
      height: '25px',
      border: 'none',
      '&:focus': {
        outline: 'none',
      },
    },
  };

  return { theme };
}

export const { tss } = createTss({ useContext });

export const useStyles = tss.create({});
