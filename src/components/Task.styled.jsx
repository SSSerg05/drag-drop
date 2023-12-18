import styled from '@emotion/styled';

export const TaskContainer = styled.div`
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

export const TaskContainerIsDragging = styled(TaskContainer)`
  opacity: 0.4;
  border: 2px solid red;
`;

export const TaskContent = styled.p`
  width: 100%;
  height: 100%;
  margin-right: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
`

export const TextArea = styled.textarea`
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

export const Button = styled.button`
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
