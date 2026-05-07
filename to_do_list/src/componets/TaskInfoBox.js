import React from 'react';
import GraySmallText from './GraySmallText';

function TaskInfoBox({text,icons,num}) {
    return (
        <div className='white-box task-info-box'>
            <div className='d-flex justify-content-between gap-4'>
                <GraySmallText text={text}/>
                <i className={icons}></i>
            </div>
            <h4>{num}</h4>
        </div>
    );
}

export default TaskInfoBox;