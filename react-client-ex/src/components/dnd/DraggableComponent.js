// src/components/DraggableComponent.js
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { setPosition } from '../../redux/store';

function DraggableComponent() {
  const position = useSelector(state => state.position);
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'box',
    item: { id: 'draggable-box' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = Math.round(position.x + delta.x);
        const newY = Math.round(position.y + delta.y);
        dispatch(setPosition({ x: newX, y: newY }));
      }
    }
  }));

  return (
    <div
      ref={dragRef}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: 'skyblue',
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      Drag me
    </div>
  );
}

export default DraggableComponent;
