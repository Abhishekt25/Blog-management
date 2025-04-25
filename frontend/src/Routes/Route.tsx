import { Routes, Route} from "react-router-dom";
import SignUp from "../Authentication/SignUpPage";
import SignIn from "../Authentication/SignInPage";
import Dashboard from "../Authentication/Dashboard"
// import {ProtectedRoute} from "./ProtectedRoute";

const RouterList:React.FC =()=>{
    return(
        <Routes>
             {/* Public Routes (No Auth Required) */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            <Route path="/" element={<Dashboard />} />

            <Route path="*" element={<h1>404 Not Found</h1>} />
            
        </Routes>
    )
}

export default RouterList; 