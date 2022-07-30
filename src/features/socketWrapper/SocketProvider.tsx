import React, { useCallback, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import SocketContext from './SocketContext';

interface SocketProviderProps {
  apiUrl: string;
  children: React.ReactNode;
}

const SocketProvider = ({ apiUrl, children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [subscribers, setSubscribers] = useState<string[]>([]);

  useEffect(() => {
    if (!subscribers.some(() => true)) {
      socket?.close();
      setSocket(null);
      return;
    }

    setSocket(io(apiUrl, { reconnectionAttempts: 10 }));

    return () => {
      socket?.close();
    };
  }, [subscribers]);

  const subscribe = useCallback(() => {
    const _uuid = uuid();
    setSubscribers(prev => [...prev, _uuid]);
    return _uuid;
  }, []);

  const unsubscribe = useCallback((id: string) => {
    setSubscribers(prev => prev.filter(_id => _id !== id));
  }, []);

  const contextProps = useMemo(
    () => ({ socket, subscribe, unsubscribe }),
    [socket, subscribe, unsubscribe]
  );

  return (
    <SocketContext.Provider value={contextProps}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
