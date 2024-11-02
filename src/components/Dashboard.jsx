import React from 'react';
import { useRole } from './RoleContext';
import AdminDashboard from './AdminDashboard';
import EditorDashboard from './EditorDashboard';
import ViewerDashboard from './ViewerDashboard';
import OrganizerDashboard from './OrganizerDashboard';

const Dashboard = () => {
  const { role } = useRole();

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'editor') return <EditorDashboard />;
  if (role === 'organizer') return <OrganizerDashboard />;
  return <ViewerDashboard />;
};

export default Dashboard;
