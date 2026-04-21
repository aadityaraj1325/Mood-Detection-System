import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import AchievementsPage from './pages/AchievementsPage';
import DashboardPage from './pages/DashboardPage';
import MoodDetectionPage from './pages/MoodDetectionPage';
import HistoryAnalyticsPage from './pages/HistoryAnalyticsPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="mood" element={<MoodDetectionPage />} />
        <Route path="analytics" element={<HistoryAnalyticsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
