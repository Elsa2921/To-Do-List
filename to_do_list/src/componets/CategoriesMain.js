import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAppConfig } from '../config';
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


    const handleDelete = async(e)=>{
        try{
            const res = await axios.delete(link,{
                'data':{
                    'categorie':true,
                    'id':e.target.getAttribute('data-id')
                },
                withCredentials:true
            });
            const data =res.data
            if(data['error']){
                alert(data['error'])
            }
            else{
                getInfo();
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
        <div className='container-fluid  py-5'>
            <form onSubmit={handleSubmit} className='container add_category d-flex justify-content-start align-items-start flex-wrap gap-4 pb-5'>
                <input type='text' maxLength={20} id='category_input' placeholder='Add a category'/>
                <button type='submit'>Add</button>
            </form>
            <div className='container d-flex justify-content-start align-items-start gap-3 flex-wrap'>
                
                {data.map((element) => (
                    
                    <div  key={element['id']} className='categorie_box d-flex justify-content-start align-items-center flex-column'>
                        <div className='w-100 text-end'>
                            <i className="fa fa-trash delete" aria-hidden="true" data-id={element['id']} onClick={handleDelete}></i>
                        </div>
                        <h2>{element['category']}</h2>
                    </div>
                ))}
            </div>
            
            
        </div>
    );
}

export default CategoriesMain;