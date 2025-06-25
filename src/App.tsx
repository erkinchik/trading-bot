import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";

import {LoginPage} from "./pages/LoginPage";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {BotListPage} from "./pages/BotListPage";
import StatsPage from "./pages/StatsPage";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>

            <Route path="/" element={
                <ProtectedRoute>
                    <BotListPage/>
                </ProtectedRoute>
            }/>

            <Route path="/stats" element={
                <ProtectedRoute>
                    <StatsPage/>
                </ProtectedRoute>
            }/>

            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}

export default App;
