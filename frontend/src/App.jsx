
import React from 'react';
import MainRoutes from './MainRoutes';

function App() {
  let mode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div className={`App ${mode ? 'light-mode' : 'dark-mode'}`}>
      <MainRoutes mode={mode} />
    </div>
  );
}

export default App;