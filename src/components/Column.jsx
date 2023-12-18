import React, { useMemo, useState } from 'react';

import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { MdDeleteOutline, MdControlPoint } from "react-icons/md";
import { Task } from './Task';
import { 
  Button, 
  ButtonAddTask, 
  ColumnContainer, 
  ColumnContainerIsDragging, 
  Footer, 
  Header, 
  Input, 
  TaskList, 
  Title } from './Column.styled';


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

  // render for portal
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

export default Column;
