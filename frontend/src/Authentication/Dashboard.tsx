import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:2507";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${backendURL}/api/`, {
            credentials: 'include'
        })
        .then((response) => {
            if (response.status === 401) {
                navigate('/signin');
            }
            return;
        })
        .catch((error) => {
            console.log('error : ', error);
            navigate('/signin');
        });
    }, [navigate]);

    return (
        <>
            <Header />
            <p>This is Header</p>
            <Footer />
        </>
    );
};

export default Dashboard;