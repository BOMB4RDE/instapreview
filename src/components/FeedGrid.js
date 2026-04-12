import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PostItem from './PostItem';

function SortablePost({ id, post, onZoom }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PostItem post={post} onZoom={onZoom} />
    </div>
  );
}

export default function FeedGrid({ initialData, onZoom }) {
  const [items, setItems] = useState(initialData);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => { setItems(initialData); }, [initialData]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      const activeItem = items[oldIndex];
      const overItem = items[newIndex];

      setItems((prev) => arrayMove(prev, oldIndex, newIndex));

      try {
        await Promise.all([
          fetch('/api/notion', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageId: activeItem.id, newDate: overItem.date })
          }),
          fetch('/api/notion', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageId: overItem.id, newDate: activeItem.date })
          })
        ]);
      } catch (err) {
        console.error("Erreur synchro:", err);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid-container">
          {items.map((post) => (
            <SortablePost key={post.id} id={post.id} post={post} onZoom={onZoom} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

