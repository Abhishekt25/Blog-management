import axios from 'axios';
import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:2507";

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profileImage?:string;
}

const ProfilePanel: React.FC = () => {

  const [userData,setUserData] = useState<UserData | null>(null);
  const [loading,setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedImage,setSelectedImage] = useState<File | null> ();
  const navigate = useNavigate();

    useEffect(()=>{
      const fetchUserData= async() =>{
        try{
          const response = await axios.get(`${backendURL}/api/`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
        if (response.status === 200) {
          const user = response.data.user;
          setUserData(user);
          setPhoneNumber(user.phoneNumber || "");
          setDateOfBirth(user.dateOfBirth?.split("T")[0] || "");
        }
        }catch(error){
          console.error('Error fetching user data:', error);
        }finally{
          setLoading(false);
        }
      };
      fetchUserData();
    },[navigate]);

  

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendURL}/api/logout`, 
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true // ← THIS IS CRUCIAL
        }
      );
  
      if (response.status === 200) {
        navigate("/signin");
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber);
    formData.append("dateOfBirth", dateOfBirth);
    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }
  
    try {
      const response = await axios.put(`${backendURL}/api/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
  
      if (response.status === 200) {
        const updatedUser = response.data.user;
        setUserData(updatedUser);
        setPhoneNumber(updatedUser.phoneNumber || "");
        setDateOfBirth(updatedUser.dateOfBirth?.split("T")[0] || "");
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!userData) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="absolute top-20 right-6 w-[500px] bg-white p-6 rounded-xl shadow-xl z-50">
      <h2 className="text-xl font-semibold mb-4">Profile Detail</h2>

      <div className="flex flex-col gap-4">
        <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto overflow-hidden">
              {userData.profileImage && (
                <img src={`${backendURL}${userData.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload your new profile image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-sm"
            />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
          <input
            type="text"
            placeholder="Name"
            defaultValue={userData.name}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="email"
            placeholder="Email Address"
            defaultValue={userData.email}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="tel"
            placeholder="Phone Number (include country code)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />

          <div className="flex justify-between items-center">
            <button type="button" onClick={handleLogout} className=' cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 '>Logout</button>
            <button type="submit" className=" cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save changes
            </button>
          </div>
         
        </form>
      </div>
    </div>
  );
};

export default ProfilePanel;
