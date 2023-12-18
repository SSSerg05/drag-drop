import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { MdDeleteOutline, } from "react-icons/md";
import { Button, TaskContainer, TaskContainerIsDragging, TaskContent, TextArea } from './Task.styled';

export const Task = ({task, deleteTask, updateTask}) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // hook for sotrtable
  const {
    setNodeRef, 
    attributes, 
    listeners, 
    transform, 
    transition, 
    isDragging,
  } = 
    useSortable({
      id: task.id,
      data: {
        type: "Task",
        task,
      },
      disabled: editMode, //if (editMode) -> not dragging
    });

  const styleOriginal = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  }

  // render for portal
  if (isDragging) {
    return (
      <TaskContainerIsDragging 
        color={task.color}
        ref={setNodeRef}
        style={styleOriginal}
        {...attributes}
        {...listeners}
      >
        <TaskContent>{task.name}</TaskContent>
      </TaskContainerIsDragging>
    )
  }


  if(editMode) {
    return (
      <TaskContainer 
        color={task.color}
        ref={setNodeRef}
        style={styleOriginal}
        {...attributes}
        {...listeners}
      >
          <TextArea
            value={task.name}
            autoFocus
            placeholder='Task content here'
            onBlur={toggleEditMode}
            onKeyDown={e => {
              if(e.key === "Enter" && e.shiftKey) toggleEditMode() 
            }}
            onChange={(e) => updateTask(task.id, e.target.value)}
          />
    </TaskContainer>
    );
  }

  return (
      <TaskContainer
        className='task' 
        color={task.color}
        ref={setNodeRef}
        style={styleOriginal}
        {...attributes}
        {...listeners}
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
        onClick={toggleEditMode}
      >
          <TaskContent>{task.name}</TaskContent>
          { mouseIsOver && (
            <Button onClick={() => deleteTask(task.id)}>
              <MdDeleteOutline size={18}/>
            </Button>
          )}
      </TaskContainer>
  );
}

export default Task;