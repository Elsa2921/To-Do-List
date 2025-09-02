import React from 'react';
import LinkPages from './LinkPages';
import CreateTeamMain from '../componets/CreateTeamMain';
import '../assets/css/team.css';
function CreateTeam(props) {
    return (
        <div>
            <LinkPages/>
            <CreateTeamMain/>
        </div>
    );
}

export default CreateTeam;