import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAppConfig } from '../config';

function Password(props) {
    const navigate = useNavigate();
    const link = getAppConfig().REACT_APP_API_URI
    const handleSubmit = async(e)=>{
        e.preventDefault()
        const confirmPass = document.getElementById('confirm_password').value;
        const password = document.getElementById('password').value;
        if(
            (confirmPass.length!==0 && confirmPass.trim()!=='')
            && (password.length!==0 && password.trim()!=='')
        ){
            if(confirmPass===password){
                try{
                    const data ={};
                    data.password = password
                    data.change = true
    
                    const res = await axios.put(link, data,{withCredentials:true});
                    const content = res.data
                    if(content['error']){
                        alert(content['error'])
                    }
                    else if(content['status'] && content['status']===200){
                        navigate('/login')
                    }
                }catch(error){
                    console.error(error)
                }
            }
            else{
                alert('confirm password and password are not the same')
            }
           
        }
        else{
            alert('empty field')
        }
        
    }


    const handleClick = (e)=>{
        let el = e.target
        let count = parseInt(el.getAttribute('data-count'))
        let parent = el.parentElement
        let input = parent.querySelector('input')
        if(count%2===0){
            el.classList.remove('fa-eye');
            el.classList.add('fa-eye-slash');
            input.type= 'text';
        }
        else{
            
            el.classList.remove('fa-eye-slash');
            el.classList.add('fa-eye');
            input.type = 'password'
        }
        el.setAttribute('data-count',count+=1)
       
        
    }

    return (
        
        <div className='container-fluid pt-5 auth-cont'>
            <div className='pt-5 container d-flex justify-content-center align-items-center'>
                <div className='d-flex justify-content-center align-items-center flex-column gap-4 auth-div'>
                    <h3>Change Password</h3>
                    <form onSubmit={handleSubmit} className='d-flex justify-content-center align-items-center flex-column gap-4'>
                        <div className='pass_input_div w-100'>
                            <input id='password' type='password' placeholder='password' required />
                            <i className='fa fa-eye' data-count={0} onClick={handleClick}></i>
                        </div>
                        <div className='pass_input_div w-100'>
                            <input id='confirm_password' type='password' placeholder='Confirm password' required/>
                            <i className='fa fa-eye' data-count={0} onClick={handleClick}></i>
                        </div>
                        <button type='submit'>Change</button>
                    </form>
                    <Link to={'/signUp'} style={{color: 'white',display:'flex'}}>Don't have an account ?</Link>
                </div>
                
            </div>
        </div>
    );
}

export default Password;