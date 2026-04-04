import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({children}) =>{
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading){
        return <div>Загрузка...</div>;
    }
    if (!user){
        return <Navigate to='/login' state={{from: location}} replace />;
    }

    return children;
};

export default ProtectedRoute;