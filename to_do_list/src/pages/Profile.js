import React from 'react';
import LinkPages from './LinkPages';
import ProfileProgress from '../componets/ProfileProgress';
import '../assets/css/profile.css';
function Profile(props) {
    return (
        <div>
            <LinkPages/>
            <ProfileProgress/>
        </div>
    );
}

export default Profile;