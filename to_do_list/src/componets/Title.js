import React from 'react';

function Title({title,text}) {
    return (
        <div className='pt-4 pb-4 container'>
            <h3>{title}</h3>
            <p className='text-gray'>{text}</p>
        </div>
    );
}

export default Title;