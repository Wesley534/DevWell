import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Dashboard';
import DashboardStats from './DashboardStats';
// import MoodTracker from '@/MoodTracker.jsx';
// import HydrationTracker from '@/HydrationTracker.jsx';
// import CodingSessionTracker from '@/CodingSessionTracker.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardStats />} />
        {/* <Route path="/mood" element={<MoodTracker />} />
        <Route path="/hydration" element={<HydrationTracker />} />
        <Route path="/coding" element={<CodingSessionTracker />} /> */}
      </Routes>
    </Router>
  );
}

export default App;