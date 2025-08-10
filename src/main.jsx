
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Welcome from './Welcome.jsx'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import Unauth from './Unauth.jsx'
import AdminDashboard from './adminComponents/AdminDashBoard.jsx'
import Features from './Features.jsx'
import About from './About.jsx'
import HrDashboard from './hrComponents/HrDashboard.jsx'
import StaffDashboard from './staffComponents/StaffDashboard.jsx'
import HrProtectedRoute from './HrProtectedRoute.jsx'
import StaffProtectedRoute from './StaffProtectedRoute.jsx'
import IsAuthenticated from './IsAuthenticated.jsx'
import NotAuthenticated from './NotAuthenticated.jsx'
import NotFound from './NotFound.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* no Auth nedded  */}
      <Route path='/' element={<App />}/>
      <Route path='/features' element={<Features/>}/>
      <Route path='/aboutUs' element={<About/>}/>
      <Route path='/unauth' element={<Unauth/>}/>

       <Route element={<NotAuthenticated/>}>
           <Route path='/login' element={<Login/>}/>
           <Route path='/register' element={<Register/>}/>
       </Route>
     

     <Route element={<IsAuthenticated/>}>
      <Route path='/welcome' element={<Welcome/>}/>
    
      <Route path='/adminDashboard/*' element={<ProtectedRoutes><AdminDashboard/></ProtectedRoutes>}/>

      <Route path='/hrDashboard/*' element={<HrProtectedRoute><HrDashboard/></HrProtectedRoute>}/>
      <Route path='/staffDashboard/*' element={<StaffProtectedRoute><StaffDashboard/></StaffProtectedRoute>}/>
     </Route>

     <Route path='*' element={<NotFound/>}/>
      
    </Routes>
  </BrowserRouter>
)

