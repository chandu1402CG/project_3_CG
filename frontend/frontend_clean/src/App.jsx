import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CareCentersPage from './pages/CareCentersPage'
import ServicesPage from './pages/ServicesPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/care-centers" element={<CareCentersPage />} />
            <Route path="/services" element={<ServicesPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
