import Signup from "./authentication/Signup";
import { BrowserRouter as Router, Route , Routes, Link} from "react-router-dom";
import { Container } from "react-bootstrap";
import AuthProvider from "../context/AuthContext";
import Profile from "./authentication/Profile";
import Login from './authentication/Login'
import PrivateRoute from "./authentication/PrivateRoute";
import ForgotPassword from "./authentication/ForgotPassword";
import UpdateProfile from "./authentication/UpdateProfile";
import Dashboard from "./google-drive/Dashboard";

function App() {
  return(
      // <Router>
        <AuthProvider>
          <Routes>
            {/* Drive  */}
            <Route exact path='/'  element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
            <Route exact path='/folder/:folderId'  element={<PrivateRoute><Dashboard/></PrivateRoute>}/>

            {/* Profile  */}
            <Route exact path='/user'  element={<PrivateRoute><Profile/></PrivateRoute>}/>
            <Route exact path='/update-profile'  element={<PrivateRoute><UpdateProfile/></PrivateRoute>}/>

            {/* Auth  */}
            <Route exact path="/signup" element={<Signup/>} />
            <Route exact path="login" element={<Login/>}/>
            <Route exact path="/forgot-password" element={<ForgotPassword/>}/>
          </Routes>
        </AuthProvider>
      // </Router>
  )
}

export default App;
