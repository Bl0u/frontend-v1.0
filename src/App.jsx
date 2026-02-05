import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
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
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Wrapper to decide which plan view to show
const PlanWrapper = () => {
  const { user } = useContext(AuthContext);
  return user?.role === 'mentor' ? <PlanManager /> : <PlanViewer />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Header />
          <div className="container mx-auto px-4 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/plan/:id" element={<PlanWrapper />} />
            </Routes>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
