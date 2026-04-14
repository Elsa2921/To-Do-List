import React from 'react';

function Badge({bClass,text,func=false}) {
    return (
        <div className={` badge ${bClass}`}>
            <span>{text}</span>
            {func? <i onClick={func} className='fa fa-remove'></i>:''}
        </div>
    );
}

export default Badge;