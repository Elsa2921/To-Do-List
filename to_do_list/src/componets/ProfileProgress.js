import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppConfig } from '../config';
import Title from './Title';
import SecondaryText from './SecondaryText';
import GraySmallText from './GraySmallText';

function ProfileProgress(props) {
    const [name,setName] = useState('');
    const navigate = useNavigate();
    const [all,setAll] = useState(0);
    const [today,setToday]= useState(0);
    const [graphic,setGrapic] = useState([]);
    const [count, setCount] = useState(0);
    const [email,setEmail] = useState('youremail@example.com')
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
                    setEmail(data['profile']['email'])
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
            <Title title='Profile'/>
            <div className='container profile-container'>
                <div className='d-flex profile-detail-box justify-content-start align-items-center flex-column gap-3 white-box'>
                    <i className="fa fa-user profile-icon mb-3" aria-hidden="true"></i>
                    <div className='d-flex justify-content-center align-items-center w-100 text-center gap-1'>
                        <h5 onBlur={handleUsernameEdit}>{name}</h5> 
                        <i className='ms-2 fa fa-pencil' onClick={handleAllowEdit}></i>
                    </div>
                    <h4 className='gray-small'>{email}</h4>
                    <hr className='bg-gray w-100'/>
                    <button onClick={hadleLogout} className='smoke-btn w-100' >Logout</button>
                    <button className="red-btn" onClick={handleDelCloseOpen}> <i className="fa fa-trash me-4"></i> Delete account</button>
                
                </div>

                <div className='d-flex justify-content-start gap-4 flex-wrap flex-column w-100'>
                    <div className='white-box'>
                        <SecondaryText text='Statistics'/>
                        <div className='doneTask-box'>
                            <div className='doneTasks'>
                                <h4>{all}</h4>
                                <GraySmallText text="Total Completed"/>
                            </div>
                            <div className='doneTasks'>
                                <h4 className='text-green'>{today}</h4>
                                <GraySmallText text="Today's Completed"/>
                            </div>
                            <div className='doneTasks'>
                                <h4  className='text-orange'>0</h4>
                                <GraySmallText text="In progress"/>
                            </div>
                        </div>
                    </div>

                    

                    <div className='d-flex graphic-area white-box justify-content-start align-items-start gap-3 flex-column'>
                        <SecondaryText text='Completed tasks of last 7 days'/>
                            <div className='graphic_box d-flex justify-content-start align-items-end gap-3 py-5'>
                                {Object.entries(graphic).map(([date,count])=>(
                                    <div key={date} className='d-flex justify-content-center align-items-center gap-3 flex-column graphic_candle_box'>
                                        <p>{count}</p>
                                        <div style={{height:`${count ? count * 20 : 5}px`, maxHeight:'200px'}} className={`graphic_candle ${count ? "bg-orange" : "bg-smoke"} `}></div>
                                        <span>{date}</span>
                                    </div>
                                ))
                                
                                }
                            </div>
                    </div>
                </div>

                
            </div>

            <div className='profile-delete-cont d-flex justify-content-center align-items-center position-fixed flex-wrap gap-5 pb-5 profile-delete-cont-none'>
                <div className='profile-delete-block  white-box d-flex justify-content-center align-items-center flex-column gap-3'>
                    <p>Do You Want to Delete your Account ?</p>
                    <div className='d-flex justify-content-center align-items-center gap-4'>
                        <button className='red-btn' onClick={handleAccDelete}>Delete</button>
                        <button className='smoke-btn' onClick={handleDelCloseOpen}>Cancel</button>
                    </div>
                </div>

                
            </div>
            
            
        </div>
    );
}

export default ProfileProgress;