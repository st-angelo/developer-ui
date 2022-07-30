import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface ContextShape {
  socket: Socket | null;
  subscribe: () => string;
  unsubscribe: (id: string) => void;
}

const SocketContext = createContext<ContextShape>({
  socket: null,
  subscribe: () => '',
  unsubscribe: () => {},
});

export default SocketContext;
