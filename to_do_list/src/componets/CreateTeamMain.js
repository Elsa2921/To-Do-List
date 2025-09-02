import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppConfig } from '../config';

function CreateTeamMain(props) {
    const navigate = useNavigate();
    const [project,setProject]  = useState([]);
    const [id,setId] = useState(0);
    const [name,setName] = useState('')
    const [deadline,setDeadline] = useState('')
    const [searchU,setSearchU] = useState([]);
    const [members,setMembers] = useState([]);
    const [min,setMin] = useState([]);
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        handleReload();
        
        if(id!==0){
            handleGetMembers()
        }

        const today = new Date().toISOString().split("T")[0]
        setMin(today)
    },[])


    const handleGetMembers = async()=>{
        try{
            let res = await axios.get(link,{
                'params':{
                    'getTeamMembers':sessionStorage.getItem('id')
                },
                withCredentials: true
    
            })
    
            let data = res.data
           
            if(data.members){
                setMembers(data.members)
            }
        }catch(error){
            console.error(error)
        }


    }

    const resetAll = ()=>{
        setId(0)
        setName('')
        setDeadline('')
        setSearchU([])
        setMembers([])
        setProject([])  
        
    }

    const handleReload = async () =>{
       try{
            let res = await axios.get(link,
                {
                    'params':{
                        'createTeamReload':true
                    },
                    withCredentials:true
                });
            
            const data = res.data
            setProject([])
            
            if(data.projects){
                setProject(data.projects);

            }
       }
       catch(error){
        console.error(error)
       }

    }

    const AddProject = async (e) =>{
        e.preventDefault();
        let project_name = document.getElementById('team_name').value
        let project_deadline = document.getElementById('project_deadline').value
        if(project_name.trim()!=='' && project_deadline!==''){
            try{
                let data = {
                    project_deadline,
                    project_name,
                    'add_project':true
                }
                let res =await axios.post(link,data, {withCredentials:true});
                let c = res.data
                if(c.error){
                    alert(c.error)
                }
                else if(c.status){
                    if(c.status===403){
                        navigate('/');
                    }
                    else{
                        document.getElementById('team_name').value  = '';
                        document.getElementById('project_deadline').value = ''
                        handleReload()
                    }
                }
            }catch(error){
                console.error(error)
            }

        }
        
        
    }


    


    const handleSelect = (e)=>{
        const r = (project.filter(item=>(
            item.id==e.target.value          
        )))
        setDeadline(r[0]?.deadline)
        setName(r[0]?.name)
        setId(r[0]?.id);
        setSearchU([])
        sessionStorage.setItem('id',r[0]?.id)

        handleReload()
        handleGetMembers()
        
    }

    const handleDeadlineChange = async(e)=>{
        e.preventDefault()
        if(id!==0){
            let changeProjectDeadline = document.getElementById('changeDeadline').value
        
            if(changeProjectDeadline.length!==0){
                try{
                    let data = {
                        changeProjectDeadline,
                        id
                    }
                    let res  = await axios.put(link,data,{withCredentials:true})
                    if(res.data){
                        setDeadline(changeProjectDeadline)
                        document.getElementById('changeDeadline').value = ''
                        handleReload()
                    }   
                }
                catch(error){
                    console.error(error)
                }
                
            }
            else{
                alert('empty field')
            } 
        }
        else{
            alert('select a project')
        }
    }

    const handleSearch =async(e)=>{
        e.preventDefault();
        
        let searchUser = document.getElementById('search_user').value
        setSearchU([])
        if(searchUser.trim()!==''){
           try{
                let res = await axios.get(link,{
                    'params':{
                        searchUser,
                        id
                    },
                    withCredentials: true
                    
                });
                let data = res.data
                if(data.searchRes){
                    document.getElementById('search_user').value = ''
                    setSearchU(data.searchRes)
                }
           }
           catch(error){
            console.error(error)
           }
        }
       
    }


    const handleAddMember = async(e)=>{
        
        if(id!==0){
            
            const user_id = e.target.getAttribute('data-id');
            try{
                let res = await axios.post(link,{
                    'addTeamMember':user_id,
                    id
                },{withCredentials:true})
                if(res.data){
                    setSearchU([])
                    handleReload();
                    handleGetMembers();
                }
            }catch(error){
                console.error(error)
            }
            
        }
        else{
            alert('select a project please')
        }
        
    }


    const handleMemberDelete  =async(e)=>{
        const memberDelete = e.target.getAttribute('data-id')

        try{
        let res =  await axios.delete(link,{
                "data":{
                    memberDelete
                },
                withCredentials: true
            });
            if(res.data){
                handleReload()
                handleGetMembers();
            }   
        }catch(error){
            console.error(error)
        }
       
    }

    const handleDeleteProject = async()=>{
        if(id!==0){
            try{
                await axios.delete(link,{
                    'data':{
                        'deleteProjectId':id
                    },
                    withCredentials:true
                })
                const select = document.getElementById('select_team')
                select.value= 'a0' 
                resetAll();
            }
            catch(error){
                console.error(error)
            }


        }
        else{
            alert('Please select the project you want to delete.')
        }
    }
    return (
        <div className='container-fluid pb-5 team_cont'>
            <div className='container d-flex justify-content-start align-items-start flex-column gap-4 pt-5'>
                <form onSubmit={AddProject} className='w-100 d-flex justify-content-start align-items-end gap-3 flex-wrap'>
                    <input type='text' id='team_name' placeholder='Project Name' required maxLength={15}/>
                    <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                        <label htmlFor='project_deadline'>
                            Project deadline
                        </label>
                    <input type='date' id='project_deadline' required min={min} onKeyDown={(e)=>e.preventDefault()}/>
                    </div>
                    <button>
                        <i className='fa fa-plus'></i>
                    </button>
                </form>
                <div className='w-100 pt-4 text-center'>
                    
                    <h2>
                        {name}
                    </h2>
                    <span>
                        {deadline}
                    </span>
                </div>
                <div className='w-100 d-flex justify-content-start align-items-end gap-5 flex-wrap'>
                    <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                        <select defaultValue={'a0'} id='select_team' onInput={handleSelect}>
                            <option value={'a0'} disabled>Select a project</option>
                            {project.length!==-1 ? project.map((element)=>(
                                    <option key={element['id']} value={element['id']}>{element['name']}</option>
                                ))
                                    : ''
                            }
                            
                            
                        </select>
                    </div>

                    <form onSubmit={handleSearch} className='d-flex justify-content-start align-items-start gap-3 flex-wrap'>
                        <input type='text' id='search_user' placeholder='Search user' required/>
                        <button type='submit'>
                            <i className='fa fa-search'></i>
                        </button>
                    </form>

                </div>
                <div className='pt-5 w-100 d-flex justify-content-between align-items-start gap-4 flex-wrap'>
                    <div className='team_box p-4'>
                        <h3>Search res</h3>   
                        {searchU.map((element)=>(
                            <div key={element.id} className='other_user_box'>
                                <div className='d-flex justify-content-start align-items-center flew-wrap gap-4'>
                                    <i className='fa fa-user'></i>
                                    <h4>{element.username}</h4>
                                </div>
                                <button data-id={element.id} onClick={handleAddMember}>
                                    <i className='fa fa-plus'></i>
                                </button>
                            </div>
                        ))}                      
                    </div>

                    <div className='team_box p-4'>
                        <h3>Members</h3>
                        {members.map((element)=>(
                             <div key={element.id} className='other_user_box'>
                                <div className='d-flex justify-content-start align-items-center flew-wrap gap-4'>
                                    <i className='fa fa-user'></i>
                                    <h4>{element.username}</h4>
                                </div>
                                <button className='red_btn' data-id={element.id} onClick={handleMemberDelete}>
                                    <i className='fa fa-close'></i>
                                </button>
                            </div>
                        ))}
                         
                    </div>
                    <div className='w-100 pt-4 d-flex justify-content-between align-items-center  flex-wrap gap-4'>
                       
                        <form onSubmit={handleDeadlineChange} className='d-flex justify-content-center align-items-end gap-3 flex-wrap'>
                            <h4>Change deadline</h4>
                            <input type='date' required id='changeDeadline' min={min} onKeyDown={(e)=>e.preventDefault()}/>
                            <button type='submit'>
                                Change
                            </button>
                        </form>
                        <button onClick={handleDeleteProject}>DELETE <i className='fa fa-trash'></i></button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default CreateTeamMain;