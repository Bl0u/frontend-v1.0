
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
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
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen text-gray-900">
      {!isLandingPage && <Header />}
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          {/* Container is removed for Landing Page to allow full width */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>

          {/* Apply container only for other routes if needed, or manage per page */}
          <div className="container mx-auto px-4 pb-12">
            <Routes>
              {/* Note: LandingPage is maintained at / for structure, but Home is moved to /home or kept as fallback */}
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
          </div>
        </MainLayout>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
