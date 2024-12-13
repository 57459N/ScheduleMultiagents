import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherWorktimeForm from './TeacherWorktimeEditor/TeacherWorktimeEditor';
import MainPage from './MainPage/MainPage';
import AppContextProvider from '../src/AppContextProvider';

function App() {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/teachers/:id" element={<TeacherWorktimeForm />} />
                </Routes>
            </Router>
        </AppContextProvider>
    );
}

export default App;
