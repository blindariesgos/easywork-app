"use client";

import React from "react";
import TaskEntity from "../../../components/TaskEntity";

const TaskObservers = (props) => {
    const getFilteredUsers = (lists, task) => lists?.users?.filter(user => !task?.observers?.find(observer => observer.id === user.id));
    const updateTaskBody = (entityIds) => ({ observersIds: entityIds });

    return (
        <TaskEntity
            {...props}
            entityKey="observers"
            label="tools:tasks:edit:observers"
            getFilteredUsers={getFilteredUsers}
            updateTaskBody={updateTaskBody}
        />
    );
};

export default TaskObservers;
