import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAppConfig } from '../config';
import Title from './Title';
import SecondaryText from './SecondaryText'
import IconAndText from './IconAndText';
import Badge from './Badge';

function TeamTasksMain(props) {
    const [projects,setProjects] = useState([]);
    const [minDate, setMinDate] = useState(0);
    const [members, setMembers] = useState([])
    const [name, setName] = useState('');
    const [id,setId] = useState(0);
    const [tasks,setTasks] = useState([]);
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
                if(data){
                    setTasks(data)
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
        if(!option.disabled){
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

    const handleDeleteTask = async(id_)=>{
        try{
            await axios.delete(link,{
                'data':{
                    'deleteProjectTask':id_
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
        <div className='container-fluid  py-4'>
            <Title title='Team Tasks' text='Assign and track tasks across projects'/>
            <div className='container d-flex justify-content-start align-items-start flex-column gap-4'>
                <div className='w-100 d-flex justify-content-between align-items-end gap-4 flex-wrap pt-4'>
                    <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
                        <select defaultValue={'a0'} id='select_team' onInput={handleProjectSelect}>
                            <option disabled value={'a0'}>Select a project</option>
                            {projects.map(item=>(
                                <option key={item.id} value={item.id} data-name={item.name}>{item.name}</option>
                            ))}

                        </select>
                    </div>

                    <form onSubmit={handleAddTask} className='d-flex justify-content-start align-items-end gap-3 flex-wrap'>
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
                            <i className='fa fa-plus me-2'></i>
                            Add Task
                        </button>
                    </form>
                    
                </div>
                <div className='pt-3 w-100 d-flex justify-content-between align-items-start gap-4 flex-wrap'>
                    {name?
                    <div className='w-100 d-flex flex-column gap-2 justify-content-start'>
                        {tasks?.map((element)=>(
                            <div key={element.id} className='white-box pt-3 pb-1 d-flex w-100 justify-content-between aplign-items-center gap-3'>
                                <div className='d-flex  justify-content-start align-items-center gap-4'>
                                    <i className='h-100 mt-2 fa fa-trash text-red' data-id={element.id} onClick={()=>handleDeleteTask(element.id)}></i>
                                    <i className='h-100'>{element.task}</i>
                                </div>

                                <div className='d-flex justify-content-start align-items-center gap-3'>
                                    <Badge text={element?.username} bClass={'red-badge'}/>
                                    <IconAndText icon={<i className="fa fa-calendar-o" aria-hidden="true"></i>} data={element.deadline}/>
                                    <Badge text={element?.status} bClass={'yellow-badge'}/>
                                
                                </div>

                            </div>   
                        ))
                        }
                              
                                   
                    </div>
                    : <SecondaryText text='Select a project please'/>
                    } 
                </div>
            </div>
        </div>
    );
}

export default TeamTasksMain;