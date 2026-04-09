import React, { useState } from 'react';
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PostItem from './PostItem';

function SortablePost({ id, post }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PostItem post={post} />
    </div>
  );
}

export default function FeedGrid({ initialData }) {
  const [items, setItems] = useState(initialData);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid-container">
          {items.map((post) => (
            <SortablePost key={post.id} id={post.id} post={post} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
