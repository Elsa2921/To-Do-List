import React from 'react';

function Button({btn_style,click_func,text}) {
    return (
        <button className={btn_style ? btn_style : ''} onClick={click_func}>{text}</button>
    );
}

export default Button;