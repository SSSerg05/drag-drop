import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styled from '@emotion/styled';
import { MdDeleteOutline, } from "react-icons/md";


const TaskContainer = styled.div`
  position: relative;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 2px 0px 2px 8px;
  margin-bottom: 8px;
  background-color: ${props => props.color};
  display: flex;
  justify-items: center;
  align-items: center;
  min-height: 50px;
  height: 50px;
  text-align: left;
  cursor: grab;

  &:hover {
    background-color: #303030;
    color: orange;
  }
  &:hover > Button {
    background-color: #303030;
    color: orange;
  }
`;

const TaskContainerIsDragging = styled(TaskContainer)`
  opacity: 0.4;
  border: 2px solid red;
`;

const TaskContent = styled.p`
  width: 100%;
  height: 100%;
  margin-right: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 90%;
  resize: none;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: white;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  padding: 2px;  
  background-color: transparent;
  border: none;
  outline: none;
  opacity: 0.4;

  &:hover {
    opacity: 1.0;
    color: orange;
  }
`

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