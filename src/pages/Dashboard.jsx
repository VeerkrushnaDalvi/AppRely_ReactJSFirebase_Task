import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import { Button } from "react-bootstrap";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Home from "./home";
function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);
    return (
        <>
        <div className="dashboard">
            <div className="dashboard__container">
                Logged in as  👋
                
                <div style={{backgroundColor:'#fff', padding:20}}> Name: {name}  
                <hr>
                </hr>
                Mail: {user?.email}</div>
                {/* <button className="dashboard__btn" onClick={logout}>
                    Logout
                </button> */}
                <br></br>

                <Button variant="outline-dark" onClick={logout}>Logout</Button>
                <small style={{fontStyle:'italic', fontSize:10}}> White box represents the value which is fetched from firebase firestore</small>
            </div>
        </div>
        <hr></hr>
        <Home/>
        </>
    );
}
export default Dashboard;