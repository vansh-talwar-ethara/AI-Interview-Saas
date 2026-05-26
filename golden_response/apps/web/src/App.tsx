import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { StudioPage } from "@/pages/StudioPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { RecruiterPage } from "@/pages/RecruiterPage";
import { AuthPage } from "@/pages/AuthPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
