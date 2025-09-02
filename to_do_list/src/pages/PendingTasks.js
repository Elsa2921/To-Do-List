import React from 'react';
import LinkPages from './LinkPages';
import PendingTasksMain from '../componets/PendingTasksMain';

function PendingTasks(props) {
    return (
        <div>
            <LinkPages/>
            <PendingTasksMain/>
        </div>
    );
}

export default PendingTasks;