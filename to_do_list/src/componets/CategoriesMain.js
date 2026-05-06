import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAppConfig } from '../config';
import Title from './Title';
function CategoriesMain(props) {
    const [data,setData] = useState([]);
    const link = getAppConfig().REACT_APP_API_URI
    useEffect(()=>{
        getInfo();
    },[])

    const getInfo = async ()=>{
        try{
            setData([])
            const res = await axios.get(link ,{
                'params':{
                    'categories':true
                },
                withCredentials:true
            })
            if(res.status === 200){
                if(res.data &&  Array.isArray(res.data)){
                    setData(res.data);
                }
            }
        }
        catch(error){
            console.error(error)
        }
    }


    const handleDelete = async(id)=>{
        try{
            const res = await axios.delete(link,{
                'data':{
                    'categorie':true,
                    'id':id
                },
                withCredentials:true
            });
            const r1 =res.data
            if(r1['error']){
                alert(r1['error'])
            }
            else{
                setData(data.filter(e=>e.id !== id))
            }
        }catch(error){
            console.error(error)
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try{
            const category = document.getElementById('category_input').value;
            if(category !== '' && category.trim()!==''){
                const res = await axios.post(link,
                    {'addCategory':category},
                    {withCredentials:true});
                const data =  res.data;
                if(data['error']){
                    alert(data['error'])
                }
                else{
                    document.getElementById('category_input').value=''
                    getInfo();
                }
            }
            

        }catch(error){
            console.error(error)
        }
    }
    return (
        <div className='container-fluid  py-4'>
            <Title title="Categories" text='Organize your tasks by category.'/>
            
            <form onSubmit={handleSubmit} className='container add_category d-flex justify-content-start align-items-start gap-4 pb-5'>
                <input type='text' maxLength={20} className='w-100' id='category_input' placeholder='Add a category'/>
                <button type='submit'><i className="fa fa-plus" aria-hidden="true"></i> Add Category</button>
            </form>
            <div className='container d-flex justify-content-start align-items-start gap-3 flex-wrap'>
                
                {data.map((element) => (
                    
                    <div  key={element['id']} className='categorie_box white-box'>
                        <h2>{element['category']}</h2>
                        <div className='w-100 text-end'>
                            <i className="fa fa-trash delete" aria-hidden="true" onClick={()=>handleDelete(element['id'])}></i>
                        </div>
                        
                    </div>
                ))}
            </div>
            
            
        </div>
    );
}

export default CategoriesMain;