// App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import './App.css';
import Signin from "./pages/Signin";
import Details from "./pages/details";
import Memo from "./pages/memo";
import OfficerHome from "./pages/Home";
import PrivateRouteOfficer from "./PrivateRouteOfficer";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import PrivateRouteMainAdmin from "./PrivateRouteMainAdmin";
import PrivateRouteUser from "./PrivateRouteUser";
import Memo_login from "./pages/memo_login";
import Memo_home from "./pages/memo_home";
import Receipt from "./pages/receipt";
import History from "./pages/history";
import Personhistory from "./pages/personhistory";
import AdminPage from "./pages/AdminPage";
import MainAdminPage from "./pages/mainAdmin";
import ForgotPassword from "./pages/forgotPassword";
import NewPassword from "./pages/newPassword";
import Footer from "./pages/footer";
import ViewPendingMemo from "./pages/viewPendingMemo";

function App() {


  return (
   
    <Router>
            <Routes>
             
            <Route path="/login" element={<Signin />} />
            <Route path="/officerhome" element={<PrivateRouteOfficer element={<OfficerHome />} />} />
            <Route path="/details" element={<Details />} />
            <Route path="/memo" element={<Memo />} />
            <Route path="/memo_login" element={<Memo_login />} />
             <Route path="/memo_home" element={<PrivateRouteUser element={<Memo_home />} />} />
             <Route path="/receipt" element={<Receipt />} />
             <Route path="/history" element={<History />} />
             <Route path="/personhistory" element={<Personhistory />} />
             <Route path="/memo" element={<Memo />} />
             <Route path="/adminhome" element={<PrivateRouteAdmin element={<AdminPage />} />} />
             <Route path="/mainadminhome" element={<PrivateRouteMainAdmin element={<MainAdminPage />} />}/>
             <Route path="/forgotpassword" element={<ForgotPassword />} />
             <Route path="/newpassword" element={<NewPassword />} />
             <Route path="/viewpendingmemo" element={<ViewPendingMemo />} />

             <Route path="*" element={<Signin />} />
        
            </Routes>
     
     
    </Router>


  );
}

export default App;
