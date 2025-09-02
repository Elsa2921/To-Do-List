import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAppConfig } from '../config';

function LinkPages(props) {
    const [count ,setCount] = useState(1);
    const [name,setName] = useState('');
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        OnReload();
    },[])

    const OnReload = async ()=>{
        try{
            
            const res = await axios.get(link,{
                'params':{
                    'reload':true
                },
                withCredentials:true
            });
            const data = res.data
            if(data['status'] && data['status']===200){
                if(!data['profile']){
                    
                    document.querySelector('a[href="/signUp"]').style.display = 'block'
                    
                }
                else{   
                    document.querySelector('a[href="/profile"]').style.display = 'block'
                    setName(data['profile']['other']);
                }
            }

            const body = document.getElementsByTagName('body')[0];
                const check = document.getElementById('themeCheck')
                if(!data['profile']['theme']){
                    body.classList.remove('dark')
                    check.checked = false;
                }
                else{
                    body.classList.add('dark')
                    check.checked = true
                }
           

        }catch(error){
            console.error('Error:', error.message);
        }
    }

    const handleSideBar =()=>{
        const sideBar = document.querySelector('.sideBar')
        setCount(count+1)
        if(count%2===1){
            sideBar.classList.add('sideBarOpen')
        }
        else{
            sideBar.classList.remove('sideBarOpen')
        }
    }

    const handleCheck =async (e) =>{
        const body = document.getElementsByTagName('body')[0];
        const check=  e.target.checked
            try{
                await axios.put(link,{
                    'theme':check
                },{withCredentials:true});
            }catch(error){
                console.error(error)
            }
        
        if(check){
            body.classList.add('dark')
        }   
        else{
            body.classList.remove('dark')
        }
    }


    return (
        <div className='container-fluid py-4 py-md-5  navbar-cont-fl'>
            
            <div className='container d-flex justify-content-between align-items-center flex-wrap gap-3 navbar-cont'>
                <NavLink to={'/'}>
                    <h2>To-Do-List <i className="fa fa-list-ul" aria-hidden="true"></i></h2>

                </NavLink>
                <i className='fa fa-bars' onClick={handleSideBar}></i>
                <NavLink to={'/profile'} style={{textDecoration: 'none',display:'none'}}>
                    <i className='fa fa-user'></i>
                </NavLink>
                <NavLink to={'/signUp'}>
                    <button>SignUp</button>
                </NavLink>
            </div>
            <div className='sideBar px-4 py-4 px-md-5 py-md-5'>
                <i className='fa fa-close w-100 text-end pb-3' onClick={handleSideBar}></i>
                <h2>To-Do-List <i className="fa fa-list-ul" aria-hidden="true"></i></h2>
                <ul className='pt-4 pt-md-5 d-flex justify-content-start align-items-start gap-3 flex-column'>
                    <li>
                        <NavLink to={'/'}>
                            Home
                            <i className='fa fa-home'></i>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/categories'}>
                            Categories
                            <i className='fa fa-th'></i>
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink to={'/pendingTasks'}>
                            Pending Tasks 
                            <i className="fa fa-tasks" aria-hidden="true"></i>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={'/createTeam'}>
                            Create Team 
                            <i className='fa fa-plus'></i>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/teamTasks'}>
                            Team Tasks
                            <i className='fa fa-users'></i>
                        </NavLink>
                    </li>

                    
                    <li>
                        Theme
                        <input type='checkbox' id='themeCheck' onClick={handleCheck}/>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default LinkPages;