import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
interface FarmerProfileData {
  id: string;
  name: string;
  location: string;
}
const FarmerProfile: React.FC = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FarmerProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (authLoading) {
      setProfileLoading(true);
      return;
    }
    if (!token) {
      setError('You must be logged in to view this profile.');
      setProfileLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        setProfileLoading(true); 
        console.log("Attempting to fetch profile with token:", token);
        // ------------------------

        const response = await fetch('http://localhost:5000/api/profile/current', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile data.');
        }

        const data: { farmer: FarmerProfileData } = await response.json();
        setProfile(data.farmer);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();

  }, [token, authLoading]);
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-lg shadow-xl rounded-3xl border-2 border-red-300 bg-white">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="text-2xl font-bold text-red-600 tracking-wide text-center">
              Profile Error
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-8 text-center">
            <p className="text-lg text-red-500 font-medium mb-4">
              Error: {error}
            </p>
            <Button onClick={() => navigate("/sign-in")} className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-xl shadow-lg">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Card className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-700 mb-4">Farmer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-green-200 text-green-800 text-4xl font-semibold">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className="text-xl font-semibold text-gray-800">Name: {profile.name}</p>
              <p className="text-lg text-gray-600 mt-2">Location: {profile.location}</p>
            </div>
          ) : (
            <p className="text-gray-500">No profile data found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerProfile;
