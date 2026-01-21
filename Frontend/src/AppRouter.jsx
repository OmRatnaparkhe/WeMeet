import {BrowserRouter,Routes, Route} from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { WeMeet } from "./pages/VideoCall"
import { Signup } from "./pages/auth/SignUp"
import { Signin } from "./pages/auth/SignIn"
import { ProtectedRoute } from "./pages/auth/ProtectedRoute"
import { Meetings } from "./pages/Meetings"
import { Recordings } from "./pages/Recordings"
import { Settings } from "./pages/Settings"
import { LandingPage } from "./pages/landingPage"
export function AppRouter(){
    
    return <BrowserRouter>
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>

        <Route path="/dashboard" element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
            } />
        <Route path="/call/:roomId" element={
            <ProtectedRoute>
                <WeMeet />
            </ProtectedRoute>
            } />
            <Route path="/meetings" element={
            <ProtectedRoute>
                <Meetings />
            </ProtectedRoute>
            } />
            <Route path="/recordings" element={
            <ProtectedRoute>
                <Recordings />
            </ProtectedRoute>
            } />
            <Route path="/settings" element={
            <ProtectedRoute>
                <Settings />
            </ProtectedRoute>
            } />

        
    </Routes>
    </BrowserRouter>
}