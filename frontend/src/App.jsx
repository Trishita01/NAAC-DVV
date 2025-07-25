

import React from "react";
import ProtectedRoute from "./protectedroute.jsx";
import { AuthContext, AuthProvider } from './contextprovider/authcontext.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard_admin from "./Dashboard_admin.jsx";
import HelpSupport from "./helpsupport.jsx";
import Notification from "./Notification.jsx";
import LandingPage from "./landing_page.jsx";
import Register from "./register.jsx";
import Login from "./Login.jsx";
import IqacDashboard from "./iqac-dashboard.jsx";
import UserManagement from "./usermanagement.jsx";
import Dashboard_faculty from "./fac-dashboard.jsx";
import Dashboard_HOD from "./hod-dashboard.jsx";
import GPAAnalysis from "./gpa.jsx";
import IIQA from "./iiqa.jsx";
import { SessionProvider } from "./contextprovider/sessioncontext.jsx";
import ExtendedProfile from "./extendedprofile.jsx";
import Criteria1_1_1 from "./criteria1/criteria1.1/criteria1.1.1.jsx";
import Criteria1_1_2 from "./criteria1/criteria1.1/criteria1.1.2.jsx";
import Criteria1_1_3 from "./criteria1/criteria1.1/criteria1.1.3.jsx";
import Criteria1_2_1 from "./criteria1/criteria1.2/criteria1.2.1.jsx";
import Criteria1_2_2 from "./criteria1/criteria1.2/criteria1.2.2.jsx";
import Criteria1_2_3 from "./criteria1/criteria1.2/criteria1.2.3.jsx";
import Criteria1_3_1 from "./criteria1/criteria1.3/criteria1.3.1.jsx";
import Criteria1_3_2 from "./criteria1/criteria1.3/criteria1.3.2.jsx";
import Criteria1_3_3 from "./criteria1/criteria1.3/criteria1.3.3.jsx";
import Criteria1_4_1 from "./criteria1/criteria1.4/criteria1.4.1.jsx";
import Criteria1_4_2 from "./criteria1/criteria1.4/criteria1.4.2.jsx";

import Criteria2_1_1 from "./criteria2/criteria2.1/criteria2.1.1.jsx";
import Criteria2_1_2 from "./criteria2/criteria2.1/criteria2.1.2.jsx";
import Criteria2_2_1 from "./criteria2/criteria2.2/criteria2.2.1.jsx";
import Criteria2_2_2 from "./criteria2/criteria2.2/criteria2.2.2.jsx";
import Criteria2_3_1 from "./criteria2/criteria2.3/criteria2.3.1.jsx";
import Criteria2_3_2 from "./criteria2/criteria2.3/criteria2.3.2.jsx";
import Criteria2_3_3 from "./criteria2/criteria2.3/criteria2.3.3.jsx";
import Criteria2_4_1 from "./criteria2/criteria2.4/criteria2.4.1.jsx";
import Criteria2_4_2 from "./criteria2/criteria2.4/criteria2.4.2.jsx";
import Criteria2_4_3 from "./criteria2/criteria2.4/criteria2.4.3.jsx";
import Criteria2_5_1 from "./criteria2/criteria2.5/criteria2.5.1.jsx";
import Criteria2_5_2 from "./criteria2/criteria2.5/criteria2.5.2.jsx";
import Criteria2_6_1 from "./criteria2/criteria2.6/criteria2.6.1.jsx";
import Criteria2_6_2 from "./criteria2/criteria2.6/criteria2.6.2.jsx";
import Criteria2_6_3 from "./criteria2/criteria2.6/criteria2.6.3.jsx";
import Criteria2_7_1 from "./criteria2/criteria2.1/criteria2.1.1.jsx";

import Criteria3_1_1 from "./criteria3/criteria3.1/criteria3.1.1.jsx";
import Criteria3_1_2 from "./criteria3/criteria3.1/criteria3.1.2.jsx";
import Criteria3_1_3 from "./criteria3/criteria3.1/criteria3.1.3.jsx";
import Criteria3_2_1 from "./criteria3/criteria3.2/criteria3.2.1.jsx";
import Criteria3_2_2 from "./criteria3/criteria3.2/criteria3.2.2.jsx";
import Criteria3_3_1 from "./criteria3/criteria3.3/criteria3.3.1.jsx";
import Criteria3_3_2 from "./criteria3/criteria3.3/criteria3.3.2.jsx";
import Criteria3_3_3 from "./criteria3/criteria3.3/criteria3.3.3.jsx";
import Criteria3_3_4 from "./criteria3/criteria3.3/criteria3.3.4.jsx";
import Criteria3_4_1 from "./criteria3/criteria3.4/criteria3.4.1.jsx";
import Criteria3_4_2 from "./criteria3/criteria3.4/criteria3.4.2.jsx";

import Criteria4_1_1 from "./criteria4/criteria4.1/criteria4.1.1.jsx";
import Criteria4_1_2 from "./criteria4/criteria4.1/criteria4.1.2.jsx";
import Criteria4_1_3 from "./criteria4/criteria4.1/criteria4.1.3.jsx";
import Criteria4_1_4 from "./criteria4/criteria4.1/criteria4.1.4.jsx";
import Criteria4_2_1 from "./criteria4/criteria4.2/criteria4.2.1.jsx";
import Criteria4_2_2 from "./criteria4/criteria4.2/criteria4.2.2.jsx";
import Criteria4_2_3 from "./criteria4/criteria4.2/criteria4.2.3.jsx";
import Criteria4_2_4 from "./criteria4/criteria4.2/criteria4.2.4.jsx";
import Criteria4_3_1 from "./criteria4/criteria4.3/criteria4.3.1.jsx";
import Criteria4_3_2 from "./criteria4/criteria4.3/criteria4.3.2.jsx";
import Criteria4_3_3 from "./criteria4/criteria4.3/criteria4.3.3.jsx";
import Criteria4_4_1 from "./criteria4/criteria4.4/criteria4.4.1.jsx";
import Criteria4_4_2 from "./criteria4/criteria4.4/criteria4.4.2.jsx";

import Criteria5_1_1 from "./criteria5/criteria5.1/criteria5.1.1.jsx";
import Criteria5_1_2 from "./criteria5/criteria5.1/criteria5.1.2.jsx";
import Criteria5_1_3 from "./criteria5/criteria5.1/criteria5.1.3.jsx";
import Criteria5_1_4 from "./criteria5/criteria5.1/criteria5.1.4.jsx";
import Criteria5_1_5 from "./criteria5/criteria5.1/criteria5.1.5.jsx";
import Criteria5_2_1 from "./criteria5/criteria5.2/criteria5.2.1.jsx";
import Criteria5_2_2 from "./criteria5/criteria5.2/criteria5.2.2.jsx";
import Criteria5_2_3 from "./criteria5/criteria5.2/criteria5.2.3.jsx";
import Criteria5_3_1 from "./criteria5/criteria5.3/criteria5.3.1.jsx";
import Criteria5_3_2 from "./criteria5/criteria5.3/criteria5.3.2.jsx";
import Criteria5_3_3 from "./criteria5/criteria5.3/criteria5.3.3.jsx";
import Criteria5_4_1 from "./criteria5/criteria5.4/criteria5.4.1.jsx";
import Criteria5_4_2 from "./criteria5/criteria5.4/criteria5.4.2.jsx";

import Criteria6_1_1 from "./criteria6/criteria6.1/criteria6.1.1.jsx";
import Criteria6_1_2 from "./criteria6/criteria6.1/criteria6.1.2.jsx";
import Criteria6_2_1 from "./criteria6/criteria6.2/criteria6.2.1.jsx";
import Criteria6_2_2 from "./criteria6/criteria6.2/criteria6.2.2.jsx";
import Criteria6_2_3 from "./criteria6/criteria6.2/criteria6.2.3.jsx";
import Criteria6_3_1 from "./criteria6/criteria6.3/criteria6.3.1.jsx";
import Criteria6_3_2 from "./criteria6/criteria6.3/criteria6.3.2.jsx";
import Criteria6_3_3 from "./criteria6/criteria6.3/criteria6.3.3.jsx";
import Criteria6_3_4 from "./criteria6/criteria6.3/criteria6.3.4.jsx";
import Criteria6_3_5 from "./criteria6/criteria6.3/criteria6.3.5.jsx";
import Criteria6_4_1 from "./criteria6/criteria6.4/criteria6.4.1.jsx";
import Criteria6_4_2 from "./criteria6/criteria6.4/criteria6.4.2.jsx";
import Criteria6_4_3 from "./criteria6/criteria6.4/criteria6.4.3.jsx";
import Criteria6_5_1 from "./criteria6/criteria6.5/criteria6.5.1.jsx";
import Criteria6_5_2 from "./criteria6/criteria6.5/criteria6.5.2.jsx";
import Criteria7_1_1 from "./criteria7/criteria7.1/criteria7.1.1.jsx";
import Criteria7_1_2 from "./criteria7/criteria7.1/criteria7.1.2.jsx";
import Criteria7_1_3 from "./criteria7/criteria7.1/criteria7.1.3.jsx";
import Criteria7_1_4 from "./criteria7/criteria7.1/criteria7.1.4.jsx";
import Criteria7_1_5 from "./criteria7/criteria7.1/criteria7.1.5.jsx";
import Criteria7_1_6 from "./criteria7/criteria7.1/criteria7.1.6.jsx";
import Criteria7_1_7 from "./criteria7/criteria7.1/criteria7.1.7.jsx";
import Criteria7_1_8 from "./criteria7/criteria7.1/criteria7.1.8.jsx";
import Criteria7_1_9 from "./criteria7/criteria7.1/criteria7.1.9.jsx";
import Criteria7_1_10 from "./criteria7/criteria7.1/criteria7.1.10.jsx";
import Criteria7_1_11 from "./criteria7/criteria7.1/criteria7.1.11.jsx";
import Criteria7_2_1 from "./criteria7/criteria7.2/criteria7.2.1.jsx";
import Criteria7_3_1 from "./criteria7/criteria7.3/criteria7.3.1.jsx";




function App() {
  return (
    <div className="flex">
      <div className="flex-1">
      
      <SessionProvider>
          <Routes>
         
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>

            <Route element={<ProtectedRoute allowedRoles={['IQAC supervisor']} />}>
              <Route path="/iqac-dashboard" element={<IqacDashboard />} />
              <Route path="/gpa-analysis" element={<GPAAnalysis />} />
            </Route>
{/* 
            <Route element={<ProtectedRoute allowedRoles={['college admin']} />}>
              <Route path='/admin-dashboard' element={<Dashboard_admin/>} />
              <Route path='/user-management' element={<UserManagement/>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
              <Route path='/fac-dashboard' element={<Dashboard_faculty/>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
              <Route path='/hod-dashboard' element={<Dashboard_HOD/>} />
            </Route> */}
             <Route path='/extendedprofile' element={<ExtendedProfile/>}/>
            <Route path='/criteria1.1.1' element={<Criteria1_1_1/>}/>
            <Route path='/criteria1.1.2' element={<Criteria1_1_2/>}/>
            <Route path='/criteria1.1.3' element={<Criteria1_1_3/>}/>
            <Route path='/criteria1.2.1' element={<Criteria1_2_1/>}/>
            <Route path='/criteria1.2.2' element={<Criteria1_2_2/>}/>
            <Route path='/criteria1.2.3' element={<Criteria1_2_3/>}/>
            <Route path='/criteria1.3.1' element={<Criteria1_3_1/>}/>
            <Route path='/criteria1.3.2' element={<Criteria1_3_2/>}/>
            <Route path='/criteria1.3.3' element={<Criteria1_3_3/>}/>
            <Route path='/criteria1.4.1' element={<Criteria1_4_1/>}/>
            <Route path='/criteria1.4.2' element={<Criteria1_4_2/>}/>

             <Route path='/criteria2.1.1' element={<Criteria2_1_1/>}/>
             <Route path='/criteria2.1.2' element={<Criteria2_1_2/>}/>
             <Route path='/criteria2.2.1' element={<Criteria2_2_1/>}/>
             <Route path='/criteria2.2.2' element={<Criteria2_2_2/>}/>
             <Route path='/criteria2.3.1' element={<Criteria2_3_1/>}/>
             <Route path='/criteria2.3.2' element={<Criteria2_3_2/>}/>
             <Route path='/criteria2.3.3' element={<Criteria2_3_3/>}/>
             <Route path='/criteria2.4.1' element={<Criteria2_4_1/>}/>
             <Route path='/criteria2.4.2' element={<Criteria2_4_2/>}/>
             <Route path='/criteria2.4.3' element={<Criteria2_4_3/>}/>
             <Route path='/criteria2.5.1' element={<Criteria2_5_1/>}/>
             <Route path='/criteria2.5.2' element={<Criteria2_5_2/>}/>
             <Route path='/criteria2.6.1' element={<Criteria2_6_1/>}/>
             <Route path='/criteria2.6.2' element={<Criteria2_6_2/>}/>
             <Route path='/criteria2.6.3' element={<Criteria2_6_3/>}/>
             <Route path='/criteria2.7.1' element={<Criteria2_7_1/>}/>

              <Route path='/criteria3.1.1' element={<Criteria3_1_1/>}/>
               <Route path='/criteria3.1.2' element={<Criteria3_1_2/>}/>
                <Route path='/criteria3.1.3' element={<Criteria3_1_3/>}/>
                 <Route path='/criteria3.2.1' element={<Criteria3_2_1/>}/>
                  <Route path='/criteria3.2.2' element={<Criteria3_2_2/>}/>
                   <Route path='/criteria3.3.1' element={<Criteria3_3_1/>}/>
                    <Route path='/criteria3.3.2' element={<Criteria3_3_2/>}/>
                     <Route path='/criteria3.3.3' element={<Criteria3_3_3/>}/>
                      <Route path='/criteria3.3.4' element={<Criteria3_3_4/>}/>
                       <Route path='/criteria3.4.1' element={<Criteria3_4_1/>}/>
                        <Route path='/criteria3.4.2' element={<Criteria3_4_2/>}/>

                        <Route path='/criteria4.1.1' element={<Criteria4_1_1/>}/>
                        <Route path='/criteria4.1.2' element={<Criteria4_1_2/>}/>
                        <Route path='/criteria4.1.3' element={<Criteria4_1_3/>}/>
                        <Route path='/criteria4.1.4' element={<Criteria4_1_4/>}/>
                        <Route path='/criteria4.2.1' element={<Criteria4_2_1/>}/>
                        <Route path='/criteria4.2.2' element={<Criteria4_2_2/>}/>
                        <Route path='/criteria4.2.3' element={<Criteria4_2_3/>}/>
                        <Route path='/criteria4.2.4' element={<Criteria4_2_4/>}/>
                        <Route path='/criteria4.3.1' element={<Criteria4_3_1/>}/>
                        <Route path='/criteria4.3.2' element={<Criteria4_3_2/>}/>
                        <Route path='/criteria4.3.3' element={<Criteria4_3_3/>}/>
                        <Route path='/criteria4.4.1' element={<Criteria4_4_1/>}/>
                        <Route path='/criteria4.4.2' element={<Criteria4_4_2/>}/>

                         <Route path='/criteria5.1.1' element={<Criteria5_1_1/>}/>
                         <Route path='/criteria5.1.2' element={<Criteria5_1_2/>}/>
                         <Route path='/criteria5.1.3' element={<Criteria5_1_3/>}/>
                         <Route path='/criteria5.1.4' element={<Criteria5_1_4/>}/>
                         <Route path='/criteria5.1.5' element={<Criteria5_1_5/>}/>
                         <Route path='/criteria5.2.1' element={<Criteria5_2_1/>}/>
                         <Route path='/criteria5.2.2' element={<Criteria5_2_2/>}/>
                         <Route path='/criteria5.2.3' element={<Criteria5_2_3/>}/>
                         <Route path='/criteria5.3.1' element={<Criteria5_3_1/>}/>
                         <Route path='/criteria5.3.2' element={<Criteria5_3_2/>}/>
                         <Route path='/criteria5.3.3' element={<Criteria5_3_3/>}/>
                         <Route path='/criteria5.4.1' element={<Criteria5_4_1/>}/>
                         <Route path='/criteria5.4.2' element={<Criteria5_4_2/>}/>


                         <Route path='/criteria6.1.1' element={<Criteria6_1_1/>}/>
                         <Route path='/criteria6.1.2' element={<Criteria6_1_2/>}/>
                         <Route path='/criteria6.2.1' element={<Criteria6_2_1/>}/>
                         <Route path='/criteria6.2.2' element={<Criteria6_2_2/>}/>
                         <Route path='/criteria6.2.3' element={<Criteria6_2_2/>}/>
                         <Route path='/criteria6.3.1' element={<Criteria6_3_1/>}/>
                         <Route path='/criteria6.3.2' element={<Criteria6_3_2/>}/>
                         <Route path='/criteria6.3.3' element={<Criteria6_3_3/>}/>
                         <Route path='/criteria6.3.4' element={<Criteria6_3_4/>}/>
                         <Route path='/criteria6.3.5' element={<Criteria6_3_5/>}/>
                         <Route path='/criteria6.4.1' element={<Criteria6_4_1/>}/>
                         <Route path='/criteria6.4.2' element={<Criteria6_4_2/>}/>
                         <Route path='/criteria6.4.3' element={<Criteria6_4_3/>}/>
                         <Route path='/criteria6.5.1' element={<Criteria6_5_1/>}/>
                         <Route path='/criteria6.5.2' element={<Criteria6_5_2/>}/>

                         <Route path='/criteria7.1.1' element={<Criteria7_1_1/>}/>
                         <Route path='/criteria7.1.2' element={<Criteria7_1_2/>}/>
                         <Route path='/criteria7.1.3' element={<Criteria7_1_3/>}/>
                         <Route path='/criteria7.1.4' element={<Criteria7_1_4/>}/>
                         <Route path='/criteria7.1.5' element={<Criteria7_1_5/>}/>
                         <Route path='/criteria7.1.6' element={<Criteria7_1_6/>}/>
                         <Route path='/criteria7.1.7' element={<Criteria7_1_7/>}/>
                         <Route path='/criteria7.1.8' element={<Criteria7_1_8/>}/>
                         <Route path='/criteria7.1.9' element={<Criteria7_1_9/>}/>
                         <Route path='/criteria7.1.10' element={<Criteria7_1_10/>}/>
                         <Route path='/criteria7.1.11' element={<Criteria7_1_11/>}/>
                         <Route path='/criteria7.2.1' element={<Criteria7_2_1/>}/>
                         <Route path='/criteria7.3.1' element={<Criteria7_3_1/>}/>














            <Route path='/iiqa' element={<IIQA/>}/>
             <Route path='/dataentry' element={<Criteria1_1_1/>}/>
             <Route path='/iiqa' element={<IIQA/>}/>
             <Route path='/notification' element={<Notification/>}/>
             <Route path='/helpsupport' element={<HelpSupport />} />
            
            
          </Routes>
          </SessionProvider>
         
      </div>
    </div>
  );
}

export default App;









