import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAppConfig } from '../config';

function PendingTasksMain(props) {
    const [name,setName] = useState('');
    const [projects,setProjects] = useState([])
    const [tasks,setTasks] = useState([]);
    const [doneTasks,setDoneTasks] = useState([])
    const [id,setId] = useState(0);
    const [deadline,setDeadline] = useState('');
    const [username, setUsername] = useState('');
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        handleReload();

    },[])

    const handleReload = async()=>{
        try{
            const res = await axios.get(link,{
                'params':{
                    'pendingTaskReload':true
                },
                withCredentials:true
            })
            const data = res.data
            if(data.projects){
                setProjects(data.projects)
            }
        }
        catch(error){
            console.error(error)
        }
    }


    const handleSelectProject = (e)=>{
        const  option= e.target.selectedOptions[0]
        const id = option.getAttribute('data-id');
        const name = option.getAttribute('data-name');
        const username = option.getAttribute('data-c-username');
        const deadline = option.getAttribute('data-deadline');
        setName(name);
        setId(id);
        setDeadline(deadline)
        setUsername(username);
        getTasks(id);

    }

    const getTasks= async(id)=>{
        try{
            const res = await axios.get(link,{
                'params':{
                    'getMyTasksId':id
                },
                withCredentials:true
            })
            const data=  res.data
            if(data.tasks){
                setTasks(data.tasks)
            }
            if(data.done_tasks){
                setDoneTasks(data.done_tasks);
            }
        }
        catch(error){
            console.error(error)
        }
    }


    const handleCheck = async(e)=>{
        const input = e.target
        const id1 = input.getAttribute('data-id')
        const checkPrTask = input.getAttribute('data-check');
        try{
            await axios.put(link,{
              'id':id1,
              checkPrTask  
            },{withCredentials:true});
            getTasks(id);
        }
        catch(error){
            console.error(error)
        }

    }

    return (
        <div className='container-fluid pb-5 team_cont'>
            <div className='container d-flex justify-content-start align-items-start flex-column gap-4'>
                <div className='d-flex justify-content-between align-items-start gap-3 flex-column'>
           
                    <select defaultValue={'d'} id='select_team' onInput={handleSelectProject}>
                        <option value={'d'} disabled>Select a project</option>
                        {projects.map(item=>(
                            <option key={item.id} data-deadline={item.project_deadline} 
                                data-c-username={item.creator_username}
                                data-id={item.id} data-name={item.p_name}>
                                {item.p_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='w-100 d-flex justify-content-center align-items-start flex-column gap-3'>
                    <h2 className='pt-4'>{name}</h2>
                    <span>{deadline}</span>
                    <span>Creator: {username}</span>
                </div>
            </div>
            <div className='pt-5 container d-flex justify-content-between align-items-start flex-wrap gap-4'>
                <div className='team_box p-4'>
                    <h3>Tasks</h3>
                    {tasks.map((task)=>(
                        <div key={task['id']} className='w-100 task_div justify-content-between'>
                            <div className='d-flex justify-content-start align-items-center'> 
                                <input type='checkbox' data-id={task['id']} data-check={1} onClick={handleCheck}/>
                                <h4 data-key={task['id']} className='text_task'>{task['task']}</h4>
                            </div>
                            <span>{task['deadline']}</span>
                        </div>
                    ))}
                </div>
                <div className='ended-tasks team_box p-4 '>
                    <h3>Done Tasks  <i className='fa fa-check'></i></h3>
                    {doneTasks.map((task)=>(
                        <div key={task['id']} className='w-100 task_div justify-content-between'>
                            <div className='d-flex justify-content-start align-items-center'> 
                                <input type='checkbox' data-id={task['id']} defaultChecked data-check={0} onClick={handleCheck}/>
                                <h4 data-key={task['id']} className='text_task'>{task['task']}</h4>
                            </div>
                            <span>{task['done_date']}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PendingTasksMain;