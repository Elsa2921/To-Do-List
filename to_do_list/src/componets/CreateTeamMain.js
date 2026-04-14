import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppConfig } from '../config';
import Title from './Title';
import SecondaryText from './SecondaryText';
import GraySmallText from './GraySmallText';
import IconAndText from './IconAndText';
import Badge from './Badge';

function CreateTeamMain(props) {
    const navigate = useNavigate();
    const [projects,setProjects]  = useState([]);
    const [id,setId] = useState(0);
    const [searchU,setSearchU] = useState([]);
    const [min,setMin] = useState([]);
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        handleReload();

        const today = new Date().toISOString().split("T")[0]
        setMin(today)
    },[])


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
            
            if(data.projects && data.projects.lenght !== 0){
                setProjects(data.projects);

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


    const handleSearch =async(e)=>{
        e.preventDefault();
        const fData = new FormData(e.target)
        let searchUser = fData.get("search_user")
        let project= fData.get("s_project")
        setSearchU([])
        if(searchUser.trim()!=='' && project){
           try{
                setId(project)
                let res = await axios.get(link,{
                    'params':{
                        searchUser,
                        "id":project
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


    const handleAddMember = async(user_id)=>{   
        if(id!==0){
            
            try{
                let res = await axios.post(link,{
                    'addTeamMember':user_id,
                    id
                },{withCredentials:true})
                if(res.data){
                    setSearchU([])
                    handleReload();
                }
            }catch(error){
                console.error(error)
            }
            
        }
        else{
            alert('select a project please')
        }
        
    }


    const handleMemberDelete  =async(id)=>{

        try{
        let res =  await axios.delete(link,{
                "data":{
                    "memberDelete" : id
                },
                withCredentials: true
            });
            if(res.data){
                handleReload()
            }   
        }catch(error){
            console.error(error)
        }
       
    }

    const handleDeleteProject = async(p_id)=>{
        if(p_id!==0){
            try{
                await axios.delete(link,{
                    'data':{
                        'deleteProjectId':p_id
                    },
                    withCredentials:true
                })
                setProjects(projects.filter(p=>p.id!==p_id))
            }
            catch(error){
                console.error(error)
            }


        }
    }
    return (
        <div className='container-fluid pb-5'>
            <Title title='Teams & Projects' text='Create and manage team projects.'/>
            <div className='container d-flex justify-content-start align-items-start flex-column gap-4'>
                <form onSubmit={AddProject} className='white-box w-100 d-flex justify-content-start align-items-end gap-3'>
                    <input type='text' id='team_name' className='w-100 bg-smoke' placeholder='Project Name' required maxLength={15}/>
                    <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                    <input type='date' id='project_deadline' className='bg-smoke'  required min={min} onKeyDown={(e)=>e.preventDefault()}/>
                    </div>
                    <button>
                        <i className='fa fa-plus me-3'></i>
                        Create Project
                    </button>
                </form>
                
                <div className='d-flex justify-content-start align-items-start gap-3'>
                    {projects.length>0? projects.map(el => (
                        <div className='white-box' key={el.id}>
                            <div className='d-flex justify-content-between gap-5'>
                                <SecondaryText text={el.name}/>
                                <i className='fa fa-trash text-red' onClick={()=>handleDeleteProject(el.id)}></i>
                            </div>
                            <div className='d-flex justify-content-start gap-5'>
                                <IconAndText icon={<i className="fa fa-calendar-o" aria-hidden="true"></i>} data={el.deadline}/>

                                <IconAndText icon={<i className="fa fa-tasks" aria-hidden="true"></i>} data={`${el.tasks} tasks`}/>
                                
                            </div>
                            <div className='d-flex justify-content-start gap-2 flex-wrap'>
                                {JSON.parse(el.members || "[]").map(member=>(
                                    <Badge key={member.id} bClass='yellow-badge' text={`${member.username}`} func={()=>handleMemberDelete(member.id)}/>
                                ))}
                            </div>
                            
                        </div>
                    )): ''}
                </div>
                {projects.length>0?
                <div className='pt-5 w-100 d-flex justify-content-between align-items-start gap-5 flex-wrap flex-lg-nowrap'>
                    <div>
                        <SecondaryText text="Add Member"/>

                        <form onSubmit={handleSearch} className='w-100 d-flex justify-content-start align-items-end flex-wrap flex-lg-nowrap gap-3'>
                            <select defaultValue={'a0'} id='select_team' name='s_project'>
                                <option disabled value={'a0'}>Select a project</option>
                                {projects.map(item=>(
                                    <option key={item.id} value={item.id} data-name={item.name}>{item.name}</option>
                                ))}

                            </select>
                            <input type='text' id='search_user' name='search_user' placeholder='Search user' required/>
                            <button type='submit'>
                                <i className='fa fa-search'></i>
                            </button>
                        </form>
                    </div>

                    {searchU.length>0?
                    <div className='white-box user_search_res p-3'>
                        {searchU.map((element)=>(
                            <div key={element.id} className='w-100 d-flex justify-content-between align-items-center gap-5 border-bottom p-3 '>
                                <div className='d-flex justify-content-start align-items-center flew-wrap gap-4'>
                                    <i className='fa fa-user'></i>
                                    <SecondaryText text={element.username}/>
                                </div>
                                <button onClick={()=>handleAddMember(element.id)}>
                                    <i className='fa fa-plus me-2'></i>
                                    Add
                                </button>
                            </div>
                        ))}                      
                    </div>
                    :''}
                </div>
                : <SecondaryText text={'No projects yet'}/>}
                
            </div>
        </div>
    );
}

export default CreateTeamMain;