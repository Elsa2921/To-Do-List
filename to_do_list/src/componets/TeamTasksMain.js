import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAppConfig } from '../config';

function TeamTasksMain(props) {
    const [projects,setProjects] = useState([]);
    const [minDate, setMinDate] = useState(0);
    const [members, setMembers] = useState([])
    const [name, setName] = useState('');
    const [id,setId] = useState(0);
    const [tasks,setTasks] = useState([]);
    const [doneT,setDoneT] = useState([]);
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        handleReload()
        const today = new Date().toISOString().split("T")[0]
        setMinDate(today)
    },[])


    const handleReload = async()=>{
        try{
            let res = await axios.get(link,{
                'params':{
                    'teamTasksReload':true
                },
                withCredentials:true
            });
            const data = res.data
            if(data.projects){
                setProjects(data.projects)
            }
        }
        catch(error){
            console.error(error)
        }
    }

    const getMemberTask = async(id1)=>{
        // setTasks([])
        // setDoneT([])
        if(id1!==0){
           
           try{
                const res =  await axios.get(link,{
                    'params':{"getMemberTasks":id1},
                    withCredentials:true
                }); 
                const data = res.data
                if(data.tasks){
                    setTasks(data.tasks)
                }
                if(data.done_tasks){
                    setDoneT(data.done_tasks)
                }
           }
           catch(error){
                console.error(error)
            }
        }
       
    }

    const handleProjectSelect = async(e)=>{
       
        try{
            const el = e.target.selectedOptions[0]
            const name1 = el.getAttribute('data-name')
            setName(name1)
            setId(el.value);
            const res =  await axios.get(link,{
                'params':{"selectTeamMembers":el.value},
                withCredentials:true
            });
    
            const data = res.data
            
            if(data.members){
                setMembers(data.members)
                getMemberTask(el.value)
            }

           
        }
        catch(error){
            console.error(error)
        }
    }


    const projectSelectorChecker = ()=>{
        const s=  document.getElementById('select_team')
        const option = s.selectedOptions[0]
        if(option.disabled){
            alert('select a project');
        }
        else{
            return option.value
        }
    }


    const handleAddTask = async(e)=>{
        e.preventDefault()
        const task = e.target.elements.task.value
        const deadline = e.target.elements.task_deadline.value
        const select = e.target.elements.select_member
        const option = select.selectedOptions[0]

        const projectId = projectSelectorChecker();
        
        if(projectId){
            if(task.trim()===''){
                alert('task is empty')
            }
            if(option.disabled){
                alert('Choose a member!')
            }
            if(deadline.length!==0 && task.trim!=='' && !option.disabled){
           
               try{
                    const data = {
                        task,
                        deadline,
                        'member':option.value,
                        projectId
                        
                    }
                    await axios.post(link,
                    data,{withCredentials:true})
                    getMemberTask(projectId)
               }
               catch(error){
                    console.error(error)
               }
                
            }  
        }
        
         
        
    }

    const handleDeleteTask = async(e)=>{
        try{
            const id1 = e.target.getAttribute('data-id')
            await axios.delete(link,{
                'data':{
                    'deleteProjectTask':id1
                },
                withCredentials:true
            })
            getMemberTask(id)
        }
        catch(error){
            console.error(error)
        }
    }

    return (
        <div className='container-fluid pb-5 team_cont'>
            <div className='container d-flex justify-content-start align-items-start flex-column gap-4 pt-5'>
                <h2 className='w-100 text-center'>{name}</h2>
                <div className='w-100 d-flex justify-content-between align-items-end gap-4 flex-wrap pt-4'>
                    <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                        <select defaultValue={'a0'} id='select_team' onInput={handleProjectSelect}>
                            <option disabled value={'a0'}>Select a project</option>
                            {projects.map(item=>(
                                <option key={item.id} value={item.id} data-name={item.name}>{item.name}</option>
                            ))}

                        </select>
                    </div>

                    <form onSubmit={handleAddTask} className='d-flex justify-content-start align-items-end gap-4 flex-wrap'>
                        <input required type='text' name='task' placeholder='Write a task'/>
                        <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                            <label htmlFor='task_deadline'>
                                Task deadline
                            </label>
                            <input type='date' name='task_deadline' required min={minDate} onKeyDown={(e)=>e.preventDefault()}/>
                        </div>

                        <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                            <select defaultValue={'a0'} name='select_member'>
                                <option disabled value={'a0'}>Select a member</option>
                                {members.map(item=>(
                                    <option key={item.id} value={item.id}>{item.username}</option>
                                ))}
                            </select>
                        </div>

                        <button type='submit'>
                            <i className='fa fa-plus'></i>
                        </button>
                    </form>
                </div>
                <div className='pt-3 w-100 d-flex justify-content-between align-items-start gap-4 flex-wrap'>
                    <div className='team_box p-4'>
                        <h3>Tasks </h3>     
                        {tasks.map((element)=>(
                            <div key={element.id} className='team-tasks d-flex w-100 justify-content-between aplign-items-center gap-3 flex-wrap'>
                                <div className='w-100 d-flex justify-content-between align-items-center  flex-wrap gap-3'>
                                    <div className='d-flex justify-content-start align-items-center gap-4'>
                                        <i className='fa fa-user'></i>
                                        <h4>{element.members.username}</h4>
                                    </div>
                                           
                                    
                                    
                                    <i className='fa fa-trash' data-id={element.id} onClick={handleDeleteTask}></i>
                                </div>
                                <p className='text_task'>{element.task}</p>
                                <span>Deadline: {element.deadline}</span>
                            </div>   
                        ))}       
                                   
                    </div>

                    <div className='team_box p-4'>
                        <h3>Done <i className='fa fa-check'></i></h3>
                        {doneT.map((element)=>(
                            <div key={element.id} className='team-tasks d-flex w-100 justify-content-between aplign-items-center gap-3 flex-wrap'>
                                <div className='w-100 d-flex justify-content-between align-items-center  flex-wrap gap-3'>
                                    <div className='d-flex justify-content-start align-items-center gap-4'>
                                        <i className='fa fa-user'></i>
                                        <h4>{element.members.username}</h4>
                                    </div>
                                    <h6>Completed: {element.done_date}</h6>
                                </div>
                                
                                <p className='text_task'>{element.task}</p>
                                <span>Deadline: {element.deadline}</span>
                            </div>   
                        ))}  
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamTasksMain;