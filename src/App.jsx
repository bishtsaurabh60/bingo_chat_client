import './App.css';
import {Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { Box } from '@chakra-ui/react';
import Error from './components/Error';

const ChatPage = React.lazy(()=>import('./pages/ChatPage.jsx'));
const HomePage = React.lazy(() => import("./pages/HomePage"));

function App() {
  return (
    <Box className="app">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<h1 className="h1_loading">Loading....</h1>}>
              <HomePage />
            </Suspense>
          }
          exact
        />
        <Route
          path="/chats"
          element={
            <Suspense fallback={<h1 className="h1_loading">Loading....</h1>}>
              <ChatPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </Box>
  );
}

export default App;
