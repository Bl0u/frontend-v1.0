
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import './styles/MaskAnimations.css';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import OldLandingPage from './pages/OldLandingPage';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ResourceHub from './pages/ResourceHub';
import ThreadDetail from './pages/ThreadDetail';
import Partners from './pages/Partners';
import PitchHub from './pages/PitchHub';
import PitchForm from './pages/PitchForm';
import PublicProfile from './pages/PublicProfile';
import DashboardRequests from './pages/DashboardRequests';
import Dashboard from './pages/Dashboard';
import SocialMediaEditor from './pages/SocialMediaEditor';
import Chat from './pages/Chat';
import PlanManager from './pages/PlanManager';

import TopUp from './pages/TopUp'; // V2.0
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Layout for pages that need the container and top padding
const ProjectLayout = ({ children }) => (
  <div className="container mx-auto px-4 pb-12 pt-28">
    {children}
  </div>
);

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-900 bg-transparent">
      <Header />
      {children}
    </div>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            {/* Static Homepage */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />

            {/* Landing Pages (Full Width, No Padding) */}
            <Route path="/new-lp" element={<LandingPage />} />
            <Route path="/old-lp" element={<OldLandingPage />} />

            {/* Project Pages (Contained with Padding) */}
            <Route path="/login" element={<ProjectLayout><Login /></ProjectLayout>} />
            <Route path="/register" element={<ProjectLayout><Register /></ProjectLayout>} />
            <Route path="/profile" element={<ProjectLayout><Profile /></ProjectLayout>} />
            <Route path="/dashboard" element={<ProjectLayout><Dashboard /></ProjectLayout>} />
            <Route path="/social-media" element={<ProjectLayout><SocialMediaEditor /></ProjectLayout>} />
            <Route path="/resources" element={<ProjectLayout><ResourceHub /></ProjectLayout>} />
            <Route path="/resources/thread/:id" element={<ProjectLayout><ThreadDetail /></ProjectLayout>} />
            <Route path="/partners" element={<ProjectLayout><Partners /></ProjectLayout>} />
            <Route path="/pitch-hub" element={<ProjectLayout><PitchHub /></ProjectLayout>} />
            <Route path="/pitch-form" element={<ProjectLayout><PitchForm /></ProjectLayout>} />
            <Route path="/u/:username" element={<ProjectLayout><PublicProfile /></ProjectLayout>} />
            <Route path="/requests" element={<ProjectLayout><DashboardRequests /></ProjectLayout>} />
            <Route path="/chat" element={<ProjectLayout><Chat /></ProjectLayout>} />
            <Route path="/top-up" element={<ProjectLayout><TopUp /></ProjectLayout>} />
            <Route path="/plan/:id" element={<ProjectLayout><PlanManager /></ProjectLayout>} />

          </Routes>
        </MainLayout>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}


export default App;
