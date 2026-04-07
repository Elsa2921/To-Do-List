import React from 'react';
import LinkPages from './LinkPages';
import '../assets/css/home.css';
import HomeMain from '../componets/HomeMain';

import Header from '../componets/Header';
function Home(props) {
    return (
        <div className='main-bg'>
            <LinkPages/>
            <HomeMain/>
            {/* <Header/> */}
        </div>
    );
}

export default Home;