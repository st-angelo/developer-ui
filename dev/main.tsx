import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SocketProvider } from '../src';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider apiUrl={import.meta.env.VITE_DEVELOPER_API_URL}>
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
