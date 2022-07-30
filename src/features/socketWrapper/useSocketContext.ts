import { useContext, useEffect } from 'react';
import SocketContext from './SocketContext';

const useSocketContext = () => {
  const { socket, subscribe, unsubscribe } = useContext(SocketContext);

  useEffect(() => {
    const _id = subscribe();
    return () => {
      unsubscribe(_id);
    };
  }, [subscribe, unsubscribe]);

  return socket;
};

export default useSocketContext;
