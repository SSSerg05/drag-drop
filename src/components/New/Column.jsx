import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { MdDeleteOutline, MdControlPoint } from "react-icons/md";
import { Task } from './Task';


const ColumnContainer = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;
  height: 500px;
  max-height: 500px;
  background-color: lightblue;

  display: flex;
  flex-direction: column;
`;

const ColumnContainerIsDragging = styled(ColumnContainer)`
    opacity: 0.4;
    border: 2px solid red;
`;
const Header = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: grab;
`;
const Title = styled.h3`
  font-size: medium;
  margin: 0;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragging ? 'skyblue' : 'lightgreen')};
  flex-grow: 1;
  min-height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
`;
const Button = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  color: #303030;
  &:hover {
    color: orange;
    /* background-color: #303030; */
  }
`;

const Footer = styled.div`
`;
const Input = styled.input`
  width: 100%;
  color: white;
  font-size: medium;
  background-color: black;
  &:focus {
    border-color: orange;
    outline: none;
    padding: 2px;
  }
`;
const ButtonAddTask = styled.button`
  display: flex;
  gap: 2px;
  align-items: center;
  justify-items: center;
  border: none;
  outline: none;
  width: 100%;
  font-size: medium;
  padding: 4px;
  background-color: transparent;
  &:hover {
    background-color: #303030;
    color: orange;
  }
  &:active {
    color: orange;
    background-color: #303030;
  }
`;


export const Column = ({
  column, 
  onDelete, 
  onUpdateTitle, 
  onCreateTask, 
  tasks, 
  deleteTask, 
  updateTask}) => {

  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks]);
  
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
      id: column.id,
      data: {
        type: "Column",
        column,
      },
      disabled: editMode, //if (editMode) -> not dragging
    });

  const styleOriginal = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <ColumnContainerIsDragging 
        ref={setNodeRef}
        style={styleOriginal}
        {...attributes}
        {...listeners}
      >

      <Header>
        <Title>{column.title}</Title>
        <Button>
          <MdDeleteOutline size={24}/>
        </Button>
      </Header>

    </ColumnContainerIsDragging>
    );
  }



  return (
    <ColumnContainer 
      ref={setNodeRef}
      style={styleOriginal}
      {...attributes}
      {...listeners}
    >

      <Header onClick={(() => setEditMode(true))}>

        {!editMode && <Title>{column.title}</Title>}
        
        {editMode && (
          <Input
            value={column.title}
            onChange={(e) => onUpdateTitle(column.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setEditMode(false);
            }} 
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        )}

        <Button onClick={() => onDelete(column.id)}>
          <MdDeleteOutline size={24}/>
        </Button>
      </Header>

      
      <TaskList>
        <SortableContext items={tasksIds}>
          {tasks.map(task => (
            <Task 
              key={task.id} 
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </TaskList>

      <Footer>
        <ButtonAddTask
          onClick={() => {
            onCreateTask(column.id);
          }}
        >
          <MdControlPoint size={24}/>
          Add task
        </ButtonAddTask>
      </Footer>

    </ColumnContainer>
  );

}
