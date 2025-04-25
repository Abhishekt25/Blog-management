// import { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children }: { children: ReactNode }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>; // Or a spinner
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/signin" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;