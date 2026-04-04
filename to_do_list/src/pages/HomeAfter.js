import React from 'react';
import LinkPages from './LinkPages';
import '../assets/css/home.css';
import HomeMain from '../componets/HomeMain';

function HomeAfter(props) {
    return (
        <div>
            <LinkPages/>
            <HomeMain/>

        </div>
    );
}

export default HomeAfter;