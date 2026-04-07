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
            let body = document.getElementsByTagName('body')[0];
            let check = document.getElementById('themeCheck')
            if(data['status'] && data['status']===200){
                if(!data['profile']){
                    
                    document.querySelector('#auth-block').style.display = 'flex'
                    if(sessionStorage.getItem('theme')){
                        const theme = parseInt(sessionStorage.getItem('theme'));
                        if(theme){
                            
                            body.classList.add('dark')
                            check.checked = true
                        }
                        else{
                            body.classList.remove('dark')
                            check.checked = false;
                            
                        }

                    }
                }
                else{   
                    document.querySelector('a[href="/profile"]').style.display = 'block'
                    setName(data['profile']['other']);
                     if(!data['profile']['theme']){
                        body.classList.remove('dark')
                        check.checked = false;
                    }
                    else{
                        body.classList.add('dark')
                        check.checked = true
                    }
                }
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
            sessionStorage.setItem('theme',1)
            body.classList.add('dark')
        }   
        else{
            sessionStorage.setItem('theme',0)
            body.classList.remove('dark')
        }
    }


    return (
        <div className='container-fluid py-3 py-md-4  navbar-cont-fl'>
            
            <div className='container d-flex justify-content-between align-items-center flex-wrap gap-3 navbar-cont'>
                <i className='fa fa-bars' onClick={handleSideBar}></i>
                <NavLink to={'/profile'} style={{textDecoration: 'none',display:'none'}}>
                    <i className='fa fa-user'></i>
                </NavLink>
                <div className='gap-3' id='auth-block'>
                    <NavLink to={'/login'}>
                        <button className='border bg-smoke text-black'>Sign In</button>
                    </NavLink>
                    <NavLink to={'/signUp'}>
                        <button>Get Started</button>
                    </NavLink>
                    
                </div>
                
            </div>
            <div className='sideBar px-3 py-3 px-md-4 py-md-4'>
                <i className='fa fa-close w-100 text-end pb-3' onClick={handleSideBar}></i>
                <h2>To-Do-List <i className="fa fa-list-ul" aria-hidden="true"></i></h2>
                <ul className='pt-3 pt-md-4 d-flex justify-content-start align-items-start gap-1 flex-column'>
                    <li>
                        <NavLink to={'/'}>
                            <i className='fa fa-home'></i>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/categories'}>
                            <i className='fa fa-th'></i>
                            Categories
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink to={'/pendingTasks'}>
                            <i className="fa fa-tasks" aria-hidden="true"></i>
                            Pending Tasks 
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={'/createTeam'}>
                            <i className='fa fa-plus'></i>
                            Create Team 
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/teamTasks'}>
                            <i className='fa fa-users'></i>
                            Team Tasks
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