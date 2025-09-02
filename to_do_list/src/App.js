import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Email from './pages/Email';
import Password from './pages/Password';
import TeamTasks from './pages/TeamTasks';
import CreateTeam from './pages/CreateTeam';
import PendingTasks from './pages/PendingTasks';
function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/categories' element={<Categories/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/signUp' element={<SignUp/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/email' element={<Email/>}/>
                <Route path='/password' element={<Password/>}/>
                <Route path='/teamTasks' element={<TeamTasks/>}/>
                <Route path='/createTeam' element={<CreateTeam/>}/>
                <Route path='/pendingTasks' element={<PendingTasks/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;