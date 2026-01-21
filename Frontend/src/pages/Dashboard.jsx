import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { PageLayout } from "../components/layout/PageLayout";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { QuickActions } from "../components/dashboard/QuickActions";
import { UpcomingMeetings } from "../components/dashboard/UpcomingMeetings";
import { RecentRecordings } from "../components/dashboard/RecentRecordings";
import { CreateMeetingModal } from "../components/CreateMeetingModal";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [openModal, setOpenModal] = useState(false);
  
  const [meetings, setMeetings] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const BE_URL = import.meta.env.VITE_BE_API_BASE || "http://localhost:4000/api";

  const refreshDashboard = () => {
    if (!user) return;
    axios.get(`${BE_URL}/meetings/upcoming?clerkId=${user.id}`)
      .then(res => setMeetings(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

    axios.get(`${BE_URL}/recordings?clerkId=${user.id}`)
      .then(res => setRecordings(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  };

  useEffect(() => {
    refreshDashboard();
  }, [user]);

  return (
    <PageLayout>
      <DashboardHeader />

      <QuickActions
        onInstant={() => setOpenModal(true)}
        onSchedule={() => setOpenModal(true)} 
        onJoin={() => {
            const roomId = prompt("Enter Room ID:");
            if(roomId) navigate(`/call/${roomId}`);
        }}
        onViewRecordings={() => navigate("/recordings")}
      />

      <UpcomingMeetings 
        meetings={meetings} 
        onSchedule={() => setOpenModal(true)} 
      />
      
      <RecentRecordings 
        recordings={recordings} 
      />

      <CreateMeetingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={() => {
            refreshDashboard();
        }}
      />
    </PageLayout>
  );
}