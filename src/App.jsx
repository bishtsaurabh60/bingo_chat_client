import './App.css';
import {Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

const ChatPage = React.lazy(()=>import('./pages/ChatPage.jsx'));
const HomePage = React.lazy(() => import("./pages/HomePage"));

function App() {
  return (
    <div className="app">
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
      </Routes>
    </div>
  );
}

export default App;
