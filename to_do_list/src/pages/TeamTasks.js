import React from 'react';
import LinkPages from './LinkPages';
import '../assets/css/team.css';
import TeamTasksMain from '../componets/TeamTasksMain';
function TeamTasks(props) {
    return (
        <div className='main-bg'>
            <LinkPages/>
            <TeamTasksMain/>
        </div>
    );
}

export default TeamTasks;