import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import { FaUsers, FaCalendarAlt, FaIdCard, FaCheckCircle, FaTimesCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
export default function Dashboard(){
    const [stats,setStats]=useState({
        totalVisitors:0,
        totalAppointments:0,
        totalPasses:0,
        activePasses:0,
        usedPasses:0,
        totalCheckins:0,
        totalCheckouts:0
    });
    useEffect(()=>{
        fetchDashboard();
    },[]);
    const fetchDashboard=async()=>{
        try{
            const token=localStorage.getItem("token");
            const res=await api.get("/dashboard",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            setStats(res.data);
        }
        catch(err){
            console.log(err);
        }
    }
    return(
        <>
            <Sidebar/>
            <div className="dashboard-layout">
                <div className="page-header">
                    <h1>Dashboard Overview</h1>
                </div>
                <div className="cards">
                    <div className="card">
                        <div className="card-header">
                            <h3>Total Visitors</h3>
                            <FaUsers className="card-icon text-blue" />
                        </div>
                        <h2>{stats.totalVisitors}</h2>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3>Total Appointments</h3>
                            <FaCalendarAlt className="card-icon text-purple" />
                        </div>
                        <h2>{stats.totalAppointments}</h2>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3>Total Passes</h3>
                            <FaIdCard className="card-icon text-indigo" />
                        </div>
                        <h2>{stats.totalPasses}</h2>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3>Active Passes</h3>
                            <FaCheckCircle className="card-icon text-green" />
                        </div>
                        <h2>{stats.activePasses}</h2>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3>Used Passes</h3>
                            <FaTimesCircle className="card-icon text-red" />
                        </div>
                        <h2>{stats.usedPasses}</h2>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3>Today's Check-ins</h3>
                            <FaSignInAlt className="card-icon text-teal" />
                        </div>
                        <h2>{stats.totalCheckins}</h2>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3>Today's Check-outs</h3>
                            <FaSignOutAlt className="card-icon text-orange" />
                        </div>
                        <h2>{stats.totalCheckouts}</h2>
                    </div>
                </div>
            </div>
        </>
    )
}