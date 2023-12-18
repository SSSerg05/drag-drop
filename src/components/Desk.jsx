import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { nanoid } from 'nanoid';

import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

import initialDataColumn from '../data/boards.json';
import initialDataTasks from '../data/cards.json';
import { Column } from './Column';
import { Task } from './Task';
import { Board, Button, Container } from './Desk.styled';


export const Desk = () => {
  // StructureFieldColumn {id: string, title:string, items: [objects]}
  const [columns, setColumns] = useState(initialDataColumn); 
  // save id-Columns
  const columnsIds = useMemo(() => columns.map(column => column.id), [columns]);

  // StructureFieldTask {id: string, columnId:string, name: string, color: string}
  const [tasks, setTasks] = useState(initialDataTasks);

  // state for drag-column
  const [activeColumn, setActiveColumn] = useState(null);
  // state for drag-task
  const [activeTask, setActiveTask] = useState(null);


  // for can delete column
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, //5px
      },
    })
  );

  const createNewColumn = () => {
    const columnToAdd = {
      id: nanoid(),
      title: `Column-${columns.length + 1}`,
    }

    setColumns([...columns, columnToAdd]);
  }
  
  const onDeleteColumn = (id) => {
    setColumns((prev) => prev.filter(column => column.id !== id));

    const newTasks = tasks.filter(task => task.columnId !== id);
    setTasks(newTasks);
  }

  const onUpdateColumn = (id, title) => {
    const newColumns = columns.map(column => {
      if(column.id !== id) return column;
      return { ...column, title };
    })

    setColumns(newColumns);
  }

  const onCreateTask = (columnId) => {
    
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    const newTask = {
      id: nanoid(),
      columnId,
      name: `Task ${tasks.length + 1}`,
      color: `rgb(${getRandomInt(50,255)},${getRandomInt(50,255)},${getRandomInt(50,255)})`,
    }

    setTasks([...tasks, newTask]);
  }

  const onDeleteTask = (id) => {
    setTasks((prev) => prev.filter(task => task.id !== id));
  }

  const onUpdateTask = (id, name) => {
    const newTask = tasks.map(task => {
      if(task.id !== id) return task;

      return { ...task, name };
    });
    
    setTasks(newTask);
  }

  const onDragStart = (event) => { 
    if(event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if(event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    // console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // for drop Task this Task in one Column
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    // for drop Task this Task in different Columns
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        // console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <Container>

      <DndContext 
        sensors={sensors}
        onDragStart={onDragStart} // begin draging-object move
        onDragEnd={onDragEnd}     // drop /or end draging-object(only for Columns) move 
        onDragOver={onDragOver}   // drop Task in over another column/Task
      >
        <Board>
          <SortableContext items={columnsIds}>
            {
              columns.map(column => 
              <Column 
                key={column.id} 
                column={column} 
                onDelete={onDeleteColumn} 
                onUpdateTitle={onUpdateColumn}
                onCreateTask={onCreateTask}
                deleteTask={onDeleteTask}
                updateTask={onUpdateTask}
                tasks={tasks.filter(task => task.columnId === column.id)}
              />
            )}
          </SortableContext>
          <Button onClick={() => createNewColumn()}>Add Column</Button>
        </Board>

        {/* Create portal for Drag-component */}
        { createPortal(
          <DragOverlay>
            { 
              activeColumn && (
                <Column 
                  key={activeColumn.id} 
                  column={activeColumn} 
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )
            }

            {
              activeTask && (
                <Task
                  key={activeTask.id} 
                  task={activeTask} 
                /> 
              )
            }

          </DragOverlay>,
          document.body
        )}
        </DndContext>
    </Container>
  );
}

export default Desk;