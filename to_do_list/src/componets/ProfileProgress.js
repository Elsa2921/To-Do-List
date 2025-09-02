import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppConfig } from '../config';

function ProfileProgress(props) {
    const [name,setName] = useState('');
    const navigate = useNavigate();
    const [all,setAll] = useState(0);
    const [today,setToday]= useState(0);
    const [graphic,setGrapic] = useState([]);
    const [count, setCount] = useState(0);
    const [delCount, setDelCount] = useState(0);
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        OnReload();
    },[])



    const OnReload = async ()=>{
        try{
            const res = await axios.get(link,{
                'params':{
                    'profileReload':true
                },
                withCredentials:true
            });
            const data = res.data
            if(data['status'] && data['status']===200){
                if(!data['profile']){
                    navigate('/');
                    
                }
                else{
                    setName(data['profile']['username'])
                    setAll(data['allCompletedTasks'])
                    setToday(data['todayCompletedTasks'])
                    setGrapic(data['graphic']);
                    if(data['primary']){
                        handleSession(data['primary']);
                        handleActive();

                    }
                  

                }
            }

           

        }catch(error){
            console.error(error)
        }
    }

    function handleActive(){
        const ps = document.querySelectorAll('.userLog_h')
        ps.forEach((element)=>{
            element.classList.remove('active_p');
            if(sessionStorage.getItem('printD')){
                element.getAttribute('data-b')
                if(element.getAttribute('data-b')===sessionStorage.getItem('printD')){
                    element.classList.add('active_p')
                }
            }
          
        })
    }

    function handleSession(data){
        if(sessionStorage.getItem('printD')){
           const s = sessionStorage.getItem('printD') 
        }
        else{
            sessionStorage.setItem('printD',false);
        }
        handleActive()
    }

    const hadleLogout = async()=>{
        try{
            await axios.delete(link,{
                'data':{
                    logout:true
                },
                withCredentials:true
            });
            navigate('/');
        }
        catch(error){
            console.error(error)
        }
        
    }

    const handleAllowEdit = (e)=>{
        const username = e.target.previousElementSibling
            username.setAttribute('contentEditable',true)
    }

    const handleUsernameEdit =async (e)=>{
        try{
            const newUsername = e.target.innerHTML
            if(newUsername.length>2 && newUsername.trim()!==''){
                if(newUsername.length<=13){
                    const res = await axios.put(link,{
                        'editUsername':newUsername
                    },{withCredentials:true})
                    const data = res.data
                    if(data.error){
                        alert(data.error)
                    }
                    e.target.removeAttribute('contentEditable');
                }
                else{
                    alert('username is too long')
                }   
                
            }

            else{
                alert('username cannot be empty')
            }
           
        }
        catch(error){
            console.error(error)
        }
        
    }


    const handleDetails =(e)=>{
        setCount(count+1)
        let classes = e.target.classList
        let box = e.target.previousElementSibling.classList;
        
        if(count%2===0){
            classes.add('fa-chevron-left');
            classes.remove('fa-chevron-right')

            box.add('profile-details');
            box.remove('profile-details-close')
        }
        else{
            classes.remove('fa-chevron-left');
            classes.add('fa-chevron-right')

            box.remove('profile-details');
            box.add('profile-details-close')
        }
        
    }

    const handleAccDelete = async ()=>{
        try{
            await axios.delete(link,{
                'data':{
                    'deleteAccount':true
                },
                withCredentials:true
            })
        }
        catch(error){
            console.error(error)
        }

        OnReload();
    }

    const handleDelCloseOpen = ()=>{
        setDelCount(delCount+1)
        let grandParent = document.querySelector('.profile-delete-cont')
        if(delCount%2===0){
            grandParent.classList.remove('profile-delete-cont-none')
        }
        else{
            grandParent.classList.add('profile-delete-cont-none')

        }
    }





    return (
        <div className='container-fluid pb-5'>
            <div className='profile-header container d-flex justify-content-end align-items-center position-relative flex-wrap gap-5 pb-5'>
                <div className='position-absolute d-flex justify-content-start align-items-start flex-column gap-3 profile-details-close'>
                    <div className='d-flex justify-content-start align-items-start gap-1'>
                        <h5 onBlur={handleUsernameEdit}>{name}</h5> 
                        <i className='ms-2 fa fa-pencil' onClick={handleAllowEdit}></i>
                    </div>
                    <button onClick={hadleLogout} className='dark_btn' >Logout</button>
                    <button className="orange_btn mt-4" onClick={handleDelCloseOpen}>Delete account <i className="fa fa-trash"></i></button>
                
                </div>
                <i className="fa fa-chevron-right open_prof_details" aria-hidden="true" onClick={handleDetails}></i>

                
            </div>

            <div className='profile-delete-cont  d-flex justify-content-center align-items-center position-fixed flex-wrap gap-5 pb-5 profile-delete-cont-none'>
                <div className='profile-delete-block d-flex justify-content-center align-items-center flex-column gap-3'>
                    <p>Do You Want to Delete your Account ?</p>
                    <div className='d-flex justify-content-center align-items-center gap-4'>
                        <button className='orange_btn' onClick={handleAccDelete}>OK</button>
                        <button className='dark_btn' onClick={handleDelCloseOpen}>Cancel</button>
                    </div>
                </div>

                
            </div>
            
            <div className='container d-flex justify-content-start align-items-start flex-wrap gap-5'>
                <div className='doneTask-box d-flex justify-content-start align-items-start gap-3 flex-row flex-md-column pe-0 pe-md-5'> 
                    <div className='doneTasks d-flex justify-content-center gap-2 align-items-center flex-column'>
                        <h4>{today}</h4>
                        <p>Today's Completed tasks</p>
                    </div>
                    <div className='doneTasks d-flex justify-content-center gap-2 align-items-center flex-column'>
                        <h4>{all}</h4>
                        <p>All time Completed tasks</p>
                    </div>
                </div>

                

                <div className='d-flex justify-content-start align-items-start gap-3 flex-column graphic-area'>
                    <h4>Completed tasks of last 7 days</h4>
                        <div className='graphic_box d-flex justify-content-start align-items-end gap-3 py-5'>
                            {Object.entries(graphic).map(([date,count])=>(
                                <div key={date} className='d-flex justify-content-center align-items-center gap-3 flex-column graphic_candle_box'>
                                    <p>{count}</p>
                                    <div style={{height:`${count*20}px`, maxHeight:'200px'}} className='graphic_candle'></div>
                                    <span>{date}</span>
                                </div>
                            ))
                            
                            }
                        </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileProgress;