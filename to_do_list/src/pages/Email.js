import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAppConfig } from '../config';

function Email(props) {
    const navigate = useNavigate();
    const link = getAppConfig().REACT_APP_API_URI
    const handleSubmit = async(e)=>{
        e.preventDefault()

        const email = document.getElementById('email').value
        if(
            (email.length!==0 && email.trim()!=='')
        ){
            try{
                const data ={};
                data.email = email
                data.forgotpassword = true

                const res = await axios.put(link, data,{withCredentials:true});
                const content = res.data
                if(content['error']){
                    alert(content['error'])
                }
                else if(content['status'] && content['status']===200){
                    navigate('/password')
                }
            }catch(error){
                console.error(error)
            }
        }
        else{
            alert('empty field')
        }
        
    }


    return (
        
        <div className='container-fluid pt-5 auth-cont'>
            <div className='pt-5 container d-flex justify-content-center align-items-center'>
                <div className='d-flex justify-content-center align-items-center flex-column gap-4 auth-div'>
                    <h3>Forgot Password</h3>
                    <form onSubmit={handleSubmit} className='d-flex justify-content-center align-items-center flex-column gap-4'>
                        <input id='email' type='email' placeholder='email' required/>
                        <button type='submit'>Next</button>
                    </form>
                    <Link to={'/signUp'} style={{color: 'white',display:'flex'}}>Don't have an account ?</Link>
                </div>
                
            </div>
        </div>
            
    );
}

export default Email;