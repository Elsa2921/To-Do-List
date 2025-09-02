import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';
import { getAppConfig } from '../config';
function Login(props) {
    const navigate = useNavigate();
    const link = getAppConfig().REACT_APP_API_URI
    const handleSuccess = async(c)=>{
        const token = c.credential
        try{
            const data_ ={};
            data_.googleToken = token
            const res = await axios.post(link,data_,{withCredentials:true});
            let data = res.data
            if(data['error']){
                alert(data['error'])
            }
            else if(data['status'] && data['status']===200){
                navigate('/profile')
            }

        }catch(error){
            console.error(error)
        }
        
    }

    const handleError =()=>{
        alert('Login failed')
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value;
        if(
            (email.length!==0 && email.trim()!=='')
            && (password.length!==0 && password.trim()!=='')
        ){
            try{
                const data ={};
                data.login= true
                data.email = email
                data.password = password

                const res = await axios.post(link, data,{withCredentials:true});
                const content = res.data
                if(content['error']){
                    alert(content['error'])
                }
                else if(content['status'] && content['status']===200){
                    navigate('/profile')
                }
            }catch(error){
                console.error(error)
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
                    <h3>Login</h3>
                    <GoogleLogin

                        onSuccess={handleSuccess}
                        onError={handleError} 
                    />
                    <span>or</span>
                    <form onSubmit={handleSubmit} className='d-flex justify-content-center align-items-center flex-column gap-4'>
                        <input id='email' type='email' placeholder='email' required/>
                        <div className='pass_input_div w-100'>
                            <input id='password' type='password' placeholder='password' required />
                            <i className='fa fa-eye' data-count={0} onClick={handleClick}></i>
                        </div>
                        <button type='submit'>Login</button>
                    </form>
                    <Link to={'/email'} style={{color: 'white'}}>Forgot password?</Link>
                    <Link to={'/signUp'} style={{color: 'white',display:'flex'}}>Don't have an account ?</Link>
                </div>
                
            </div>
        </div>
    );
}

export default Login;