import React from 'react';
import LinkPages from './LinkPages';
import HomeMain from '../componets/HomeMain';
import '../assets/css/home.css';
function Home(props) {
    return (
        <div>
            <LinkPages/>
            <HomeMain/>
        </div>
    );
}

export default Home;