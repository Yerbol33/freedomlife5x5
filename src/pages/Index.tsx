// This file is kept for compatibility but the app uses App.tsx directly
import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/cabinet" replace />;
};

export default Index;
