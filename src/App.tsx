import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import Forum from './pages/Forum';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, signOut } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <BrainCircuit className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">MathPrepa</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/exercises" className="text-gray-600 hover:text-blue-600">Exercices</Link>
              <Link to="/forum" className="text-gray-600 hover:text-blue-600">Forum</Link>
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Déconnexion
                </button>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;