import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
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
        <Route index element={<DashboardPage />} />
        <Route path="mood-detection" element={<MoodDetectionPage />} />
        <Route path="history" element={<HistoryAnalyticsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
