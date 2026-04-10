import React, { useState } from 'react';
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PostItem from './PostItem';

// Étape 1 : On passe onZoom au composant SortablePost
function SortablePost({ id, post, onZoom }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* IMPORTANT : On sépare les listeners (le drag) du contenu (PostItem).
          Cela permet à la loupe de fonctionner sans déplacer l'image.
      */}
      <div {...attributes} {...listeners} style={{ width: '100%', height: '100%' }}>
         {/* Le drag-and-drop se fait sur ce conteneur */}
      </div>
      
      {/* On place le PostItem en dehors des listeners si on veut cliquer sur la loupe 
          ou on transmet simplement la fonction onZoom */}
      <div style={{ marginTop: '-100%' }}> {/* Superposition sur le drag-zone */}
        <PostItem post={post} onZoom={onZoom} />
      </div>
    </div>
  );
}

// Version simplifiée et plus robuste pour ne pas casser ton drag-and-drop :
function SortablePostSimple({ id, post, onZoom }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 100 : 1,
      opacity: isDragging ? 0.8 : 1,
    };
  
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {/* On passe onZoom à PostItem */}
        <PostItem post={post} onZoom={onZoom} />
      </div>
    );
  }

export default function FeedGrid({ initialData, onZoom }) {
  const [items, setItems] = useState(initialData);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), // Évite les clics accidentels
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
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
            <SortablePostSimple 
                key={post.id} 
                id={post.id} 
                post={post} 
                onZoom={onZoom} // On fait passer la fonction ici
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
