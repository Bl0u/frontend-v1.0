import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import './styles/MaskAnimations.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import OldLandingPage from './pages/OldLandingPage';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
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
import LeadConsole from './pages/LeadConsole';
import PlanManager from './pages/PlanManager';
import ProjectPlan from './pages/ProjectPlan';
import Communities from './pages/Communities';
import AIChatBot from './components/AIChatBot';
import TopUp from './pages/TopUp';
import WorkWithUs from './pages/WorkWithUs';
import AdminDashboard from './pages/AdminDashboard';

gsap.registerPlugin(ScrollTrigger);

// Layout with navbar (Header) — for PUBLIC routes only
const MainLayout = () => (
  <div className="min-h-screen text-gray-900 bg-transparent">
    <Header />
    <Outlet />
  </div>
);

// Layout with Sidebar — for AUTHENTICATED routes
const DashboardLayout = () => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-content">
      <div className="dashboard-content-inner">
        <Outlet />
      </div>
    </main>
  </div>
);

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Routes>
        {/* Standalone pages (no chrome) */}
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />

        {/* Public pages (Header navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-lp" element={<LandingPage />} />
          <Route path="/old-lp" element={<OldLandingPage />} />
          <Route path="/work-with-us" element={<WorkWithUs />} />
        </Route>

        {/* Authenticated pages (Sidebar) */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/social-media" element={<SocialMediaEditor />} />
          <Route path="/resources" element={<ResourceHub />} />
          <Route path="/resources/thread/:id" element={<ThreadDetail />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/pitch-hub" element={<PitchHub />} />
          <Route path="/pitch-form" element={<PitchForm />} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/requests" element={<DashboardRequests />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/lead-console" element={<LeadConsole />} />
          <Route path="/top-up" element={<TopUp />} />
          <Route path="/plan/:id" element={<PlanManager />} />
          <Route path="/project-plan/:projectId" element={<ProjectPlan />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
      <AIChatBot userToken={user?.token} />
    </>
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
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
