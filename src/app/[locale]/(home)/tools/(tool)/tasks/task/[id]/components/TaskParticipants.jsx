"use client";

import React from "react";
import TaskEntity from "../../../components/TaskEntity";

const TaskParticipants = (props) => {
    const getFilteredUsers = (lists, task) => lists?.users?.filter(user => !task?.participants?.find(part => part.id === user.id));
    const updateTaskBody = (entityIds) => ({ participantsIds: entityIds });

    return (
        <TaskEntity
            {...props}
            entityKey="participants"
            label="tools:tasks:edit:participants"
            getFilteredUsers={getFilteredUsers}
            updateTaskBody={updateTaskBody}
        />
    );
};

export default TaskParticipants;




