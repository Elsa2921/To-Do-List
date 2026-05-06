import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { getAppConfig } from '../config';
import Title from './Title';
import Badge from './Badge';

import Button from './Button';
function HomeMain(props) {
    const [category,setCategory] = useState(null); 
    const [data,setData] = useState([]);
    const [tasks,setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        handleReload();
    },[])


    const handleReload = async()=>{
       
        try{
            const res =  await axios.get(link,{
                'params':{
                    'homeReload':true
                },
                withCredentials:true
                
            })
            if(res.data['tasks']){
                setTasks(res.data['tasks'])
                console.log(res.data['tasks'])
            }
            if(res.data['categories'] && res.data['categories'].length !== 0){
                let c= res.data['categories']
                
                if(category===0){
                    setCategory(c[0]['category'])
                    sessionStorage.setItem('category',c[0]['category_id'])
                }
                setData(c)
            }
            
        }catch(error){
            console.error(error)
        }
    }



    const handleAdd = async (e)=>{
        e.preventDefault()
        try{
            const fData = new FormData(e.target)
            const category = fData.get('category')
            const task = fData.get('task')

            if(task!== '' && task.trim()!=='' && category){
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
                    setActiveFilter('all')
                    setCategoryFilter('all')
                }
            }
            
        }catch(error){
            console.error(error)
        }
    }

    const handleFilterTasks = (done, category)=>{
        if(done==='all'){
            if(category === 'all'){
                setTasks(tasks.map(e=> e?{...e,show:true} : e ))
            }
            else{
                setTasks(tasks.map(e=> e.category===category?{...e,show:true} : {...e,show:false} ))
            }
        }
        else{
            if(category=== 'all'){
                setTasks(tasks.map(e=>e.done === done? {...e,show:true} : {...e,show:false}))
            }
            else{
                setTasks(tasks.map(e=> e.done === done & e.category===category?{...e,show:true} : {...e,show:false} ))
            }
        }
            
    }

    const handleDelete = async(id)=>{
        try{    
            const res = await axios.delete(link,{
                "data":{
                    'task':true,
                    'id':id        
                }, 
                withCredentials:true     
            })
            if(res.data['message']){
                res.data['message']==='ok' ? setTasks(tasks.filter(e=>e.id !== id)):
                console.error(res.data['message'])
            }
        }catch(error){
            console.error(error)
        }
    }

    const handleCheck = async(val,id)=>{
        try{    
            const res = await axios.put(link,{
                'checkTask':val,
                id               
            },{withCredentials:true})
            if(res.data?.message === 'ok'){
                setTasks(tasks.map(e=>e.id === id ? {...e,done:val, show:activeFilter!=='all' ? false : true}: e))
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className='container-fluid py-4'>
            <Title title={'Good Morning'} text={"Here's what's on your plate today."}/>
            <div className='container white-box d-flex flex-column gap-3'>
                <div  className='d-flex justify-content-between gap-4 algin-items-cetner flex-wrap'>
                    <div className='d-flex justify-content-start gap-2 algin-items-cetner flex-wrap'>
                        <Button click_func={()=>{handleFilterTasks(activeFilter, 'all') ; setCategoryFilter('all')}}
                            btn_style={`${categoryFilter === 'all' ? 'orange-btn': 'smoke-btn'} small_padding_btn`} text='All'/>
                        {data.map((c)=>(
                            <div key={c.category_id}>
                                <Button 
                                click_func={()=>{handleFilterTasks(activeFilter, c.category) ; setCategoryFilter(c.category)}}
                                btn_style={`${categoryFilter === c.category ? 'orange-btn': 'smoke-btn'} small_padding_btn`} text={c.category}/>

                            </div>
                        ))}
                    </div>
                    <div className='d-flex justify-content-start gap-2 algin-items-cetner flex-wrap'>
                        <Button text="All" btn_style={`${activeFilter==='all' ? 'orange-btn' : 'white-btn' }  small_padding_btn`}
                        click_func={()=>{handleFilterTasks('all', categoryFilter); setActiveFilter('all')}}/>
                        <Button text="Pending" btn_style={`${activeFilter===0 ? 'orange-btn' : 'white-btn' }  small_padding_btn`} 
                        click_func={()=>{handleFilterTasks(0, categoryFilter); setActiveFilter(0)}}/>
                        <Button text="Completed" btn_style={`${activeFilter===1 ? 'orange-btn' : 'white-btn' }  small_padding_btn`} 
                        click_func={()=>{handleFilterTasks(1, categoryFilter); setActiveFilter(1)}}/>

                    </div>
                </div>
                <form className='addForm pb-4' onSubmit={handleAdd}>
                    <input type='text' name='task' minLength={2} maxLength={20} placeholder='Add a task'/>

                    <select defaultValue={0}  name='category'>
                        <option value={0} disabled>Select Category</option>
                        {data?.map((element)=>(
                            <option  key={element['category_id']} value={element['category_id']}>
                                {element['category']}
                            </option>
                        ))}  
                    </select>
                    <button type='submit'>
                        <i className='fa fa-plus me-2'></i>
                        Add
                    </button>
                </form>
                
                <ul className='d-flex justify-content-start align-items-start flex-wrap gap-3 tasks'>
                    {tasks.filter(task=>task.show !== false)
                    .map((task)=>(
                        <li key={task['id']}>
                            <div className='task_div'>
                                <div className='d-flex justify-content-start align-items-center'>
                                    <input type='checkbox' data-key={task['id']} checked={task['done']} 
                                    onChange={(e)=>handleCheck(e.target.checked,task.id)}/>
                                    <h3 data-key={task['id']} className='text_task'>{task['task']}</h3>
                                </div>

                                <div className='d-flex justify-content-start gap-3'>
                                    <Badge bClass={'red-badge1'} text={task.category}/>
                                    <i className='fa fa-trash'  onClick={()=>handleDelete(task['id'])}></i>
                                </div>
                            </div>
                        </li>
                    ))}
                    
                </ul>
            </div>
        </div>
    );
}

export default HomeMain;