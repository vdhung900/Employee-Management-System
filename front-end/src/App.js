import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import LoginScreeen from './components/LoginScreen';


function App() {
  return (
    <UserProvider>
<Router>
        <Routes>
          <Route path="/login" element={<LoginScreeen />} />
        </Routes>
      </Router>
    </UserProvider>
    
  );
}

export default App;
