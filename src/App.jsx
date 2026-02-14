
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
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ResourceHub from './pages/ResourceHub';
import ThreadDetail from './pages/ThreadDetail';
import Partners from './pages/Partners';
import Mentors from './pages/Mentors';
import MentorshipPitchHub from './pages/MentorshipPitchHub';
import RequestMentorshipForm from './pages/RequestMentorshipForm';
import MentorshipRequests from './pages/MentorshipRequests';
import PublicProfile from './pages/PublicProfile';
import DashboardRequests from './pages/DashboardRequests';
import Dashboard from './pages/Dashboard';
import SocialMediaEditor from './pages/SocialMediaEditor';
import Chat from './pages/Chat';
import PlanManager from './pages/PlanManager';
import PlanViewer from './pages/PlanViewer';

import TopUp from './pages/TopUp'; // V2.0
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Wrapper to decide which plan view to show
const PlanWrapper = () => {
  const { user } = useContext(AuthContext);
  return user?.role === 'mentor' ? <PlanManager /> : <PlanViewer />;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing-page';

  return (
    <div className="min-h-screen text-gray-900">
      {!isLandingPage && <Header />}
      {isLandingPage ? (
        children
      ) : (
        <div className="container mx-auto px-4 pb-12">
          {children}
        </div>
      )}
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/social-media" element={<SocialMediaEditor />} />
            <Route path="/resources" element={<ResourceHub />} />
            <Route path="/resources/thread/:id" element={<ThreadDetail />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentorship-request" element={<MentorshipPitchHub />} />
            <Route path="/request-mentorship" element={<RequestMentorshipForm />} />
            <Route path="/request-mentorship/:mentorId" element={<RequestMentorshipForm />} />
            <Route path="/mentorship-requests" element={<MentorshipRequests />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route path="/requests" element={<DashboardRequests />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/top-up" element={<TopUp />} /> {/* V2.0: Top Up Page */}
            <Route path="/plan/:id" element={<PlanWrapper />} />

          </Routes>
        </MainLayout>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}


export default App;
