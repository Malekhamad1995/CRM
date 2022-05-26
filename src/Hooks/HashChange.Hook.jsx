import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const useHashChange = (hashChangeHandler) => {
  const history = useHistory();
  useEffect(() => {
    history.listen(() => {
      hashChangeHandler();
    });
  }, [hashChangeHandler, history]);
};
