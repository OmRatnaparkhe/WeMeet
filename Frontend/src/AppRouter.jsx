import {BrowserRouter,Routes, Route} from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { WeMeet } from "./pages/VideoCall"
import { Signup } from "./pages/auth/SignUp"
import { Signin } from "./pages/auth/SignIn"
import { ProtectedRoute } from "./pages/auth/ProtectedRoute"
export function AppRouter(){
    
    return <BrowserRouter>
    <Routes>
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

        
    </Routes>
    </BrowserRouter>
}