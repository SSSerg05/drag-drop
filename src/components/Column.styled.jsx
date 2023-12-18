import styled from '@emotion/styled';

export const ColumnContainer = styled.div`
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

export const ColumnContainerIsDragging = styled(ColumnContainer)`
    opacity: 0.4;
    border: 2px solid red;
`;
export const Header = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: grab;
`;
export const Title = styled.h3`
  font-size: medium;
  margin: 0;
`;
export const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragging ? 'skyblue' : 'lightgreen')};
  flex-grow: 1;
  min-height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
`;
export const Button = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  color: #303030;
  &:hover {
    color: orange;
    /* background-color: #303030; */
  }
`;

export const Footer = styled.div`
`;
export const Input = styled.input`
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
export const ButtonAddTask = styled.button`
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