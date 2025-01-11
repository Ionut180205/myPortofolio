import React from 'react';
import Login from './components/Login'; 

function LoginApp() {
  return (
    <Router>
        <Routes>
            <Route path="/Login" element={<Login />} />
          </Routes>
    </Router>
  );
}

export default LoginApp;
