import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { getAppConfig } from '../config';
function HomeMain(props) {
    const [category,setCategory] = useState(''); 
    const [data,setData] = useState([]);
    const [tasks,setTasks] = useState([]);
    const [done, setDone] = useState([]);
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        handleReload();
    },[])

    const handleReload = async()=>{
       
        try{
            const res =  await axios.get(link,{
                'params':{
                    'homeReload':true,
                    'category':sessionStorage.getItem('category')||''
                },
                withCredentials:true
                
            })
            if(res.data[0]){
                if(res.data[0]['tasks']){
                    setTasks(res.data[0]['tasks'])
                }
                if(res.data[0]['done']){
                    setDone(res.data[0]['done']);
                }
            }
            if(res.data['categories']){
                let c= res.data['categories']
                
                if(category.length===0){
                    setCategory(c[0]['categorie'])
                    sessionStorage.setItem('category',c[0]['categorie'])
                }
                setData(c)
            }
            
            
        }catch(error){
            console.error(error)
        }
    }

    const handleMoreOpt = (e)=>{
        let count = parseInt(e.target.getAttribute('data-count'))
        const key = e.target.getAttribute('data-key')
        const open = document.querySelector(`div[data-opt="${key}"]`)
        if(count%2===1){
            open.classList.add('task_opt_open')
        }
        else{
            open.classList.remove('task_opt_open')
        }
        count +=1;
        e.target.setAttribute('data-count',count)        
    }



    const handleEdit = (e)=>{
        let edit= e.target.getAttribute('data-edit')
        let key = e.target.getAttribute('data-key')
        let text = document.querySelector(`.text_task[data-key='${key}']`)
        if(edit==='1'){
            text.removeAttribute('contentEditable')
            
            e.target.setAttribute('data-edit','0')
            e.target.style.color = 'white'
        }
        else{
            text.setAttribute('contentEditable',true)
            e.target.setAttribute('data-edit','1')
            e.target.style.color = 'rgb(34, 56, 67)'
        }
    }


    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
           
            const task = e.target.querySelector('input').value
            const res = await axios.post(link,
                {
                    task,
                    category
                },
            {withCredentials: true})
            const data = res.data
            if(data['error']){
                alert(data['error'])
            }
            else{
                e.target.querySelector('input').value = ''
                handleReload();
            }
        }catch(error){
            console.error(error)
        }
    }


    const handleSelect = (e)=>{
        setCategory(e.target.value)
        sessionStorage.setItem('category',e.target.value)
        setTasks([])
        setDone([])
        handleReload();
    }

    const handleBlur =async(e)=>{
        try{    
            const res = await axios.put(link,{
                'editTask':e.target.innerHTML,
                'id':e.target.getAttribute('data-key')                
            },{withCredentials:true})
        }catch(error){
            console.error(error)
        }
    }


    const handleDelete = async(e)=>{
        try{    
            const res = await axios.delete(link,{
                "data":{
                    'task':true,
                    'id':e.target.getAttribute('data-key')         
                }, 
                withCredentials:true     
            })
            setData([])
            setTasks([])
            handleReload()
        }catch(error){
            console.error(error)
        }
    }

    const handleCheck = async(e)=>{
        try{    
            const res = await axios.put(link,{
                'checkTask':e.target.checked,
                'id':e.target.getAttribute('data-key')                
            },{withCredentials:true})
            handleReload()
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className='container-fluid pt-4 pt-md-5'>
            <div className='container d-flex justify-content-start align-items-start gap-5 flex-wrap'>
                
                <select onChange={handleSelect}>
                    {data.map((element)=>(
                        <option  key={element['categorie']} value={element['categorie']}>{element['categorie']}</option>
                    ))}  
                </select>



                <form className='addForm pb-4' onSubmit={handleSubmit}>
                    <input type='text' minLength={2} maxLength={20} placeholder='Add a task'/>
                    <button type='submit'>
                        <i className='fa fa-plus'></i>
                    </button>
                </form>

                
                
            </div>
            <h3 className='w-100 text-center py-3 category_h3'>Category : {category}</h3>
            <div className='container d-flex justify-content-between align-items-start flex-wrap gap-2 pt-3'>
                <ul className='d-flex justify-content-start align-items-start flex-wrap gap-3 tasks'>
                    <li>
                        <h3 className='w-100 text-center task_header'>Tasks</h3>
                    </li>
                    {tasks.map((task)=>(
                        <li key={task['id']}>
                            <div className='task_div'>
                                <input type='checkbox' data-key={task['id']} onChange={handleCheck}/>
                                <h3 data-key={task['id']} className='text_task'  onBlur={handleBlur}>{task['task']}</h3>
                                
                                <div data-opt={task['id']} className='task_opt'>
                                    <i className='fa fa-ellipsis-h task-moreOpt' data-count='1' data-key={task['id']} onClick={handleMoreOpt}></i>
                                    <i className="fa fa-trash" aria-hidden="true" data-key={task['id']} onClick={handleDelete}></i>
                                    <i className="fa fa-pencil-square-o" onClick={handleEdit} data-key={task['id']} data-edit='0' aria-hidden="true"></i>
                                </div>
                            </div>
                        </li>
                    ))}
                    
                </ul>

                <div className='d-flex justify-content-start align-items-center flex-column gap-4 ended-tasks'>
                    <h3 className='task_header text-center'>Done 
                        <i className='fa fa-check'></i>
                    </h3>
                    {
                        done.map((element)=>(
                            <div key={element['id']} className='task_div'>
                                <input type='checkbox' checked data-key={element['id']} onChange={handleCheck}/>
                                <h3 data-key={element['id']} className='text_task'>{element['task']}</h3>
                            </div>
                        ))
                    }
                    
                </div>
               
            </div>
        </div>
    );
}

export default HomeMain;