import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter as Router} from 'react-router-dom'

async function deferRender() {
    const { worker } = await import("./mocks/browser");
    return worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

deferRender().then(() => {
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <Router>
                    <App />
                </Router>
            </AuthProvider>
        </React.StrictMode>
    );
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
