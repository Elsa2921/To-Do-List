import React from 'react';
import GraySmallText from './GraySmallText';

function IconAndText({icon,data}) {
    return (
        <div className='d-flex justify-content-center gap-2 align-items-center'>
            <GraySmallText text={icon}/>
            <GraySmallText text={data}/>
        </div>
);
}

export default IconAndText;