/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import ContentPlan from './pages/ContentPlan';
import Queue from './pages/Queue';
import Research from './pages/Research';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Pinterest from './pages/channels/Pinterest';
import VK from './pages/channels/VK';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ideas" element={<Ideas />} />
          <Route path="plan" element={<ContentPlan />} />
          <Route path="queue" element={<Queue />} />
          <Route path="research" element={<Research />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="channels">
            <Route path="pinterest" element={<Pinterest />} />
            <Route path="vk" element={<VK />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
