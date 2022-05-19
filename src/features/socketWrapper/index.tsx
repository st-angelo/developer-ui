import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketWrapperProps {
  socket?: Socket;
}

function withSocketWrapper<T>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const _socket = io(process.env.DEVELOPER_API_URL);
    setSocket(_socket);

    return () => {
      /* cleanup */
      _socket.close();
    };
  }, []);

  return (props: Omit<T, keyof SocketWrapperProps>) => (
    <Component {...(props as T)} socket={socket} />
  );
}

export default withSocketWrapper;
