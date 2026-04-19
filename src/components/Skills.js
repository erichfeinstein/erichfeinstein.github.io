import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import confetti from 'canvas-confetti';
import SectionHeader from './shell/SectionHeader';

const initialCategories = {
  Languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
  'Markup & Styling': ['HTML', 'CSS', 'Sass'],
  Frameworks: ['React', 'React Native', 'Redux', 'Node', 'Jest', 'Jasmine'],
  APIs: ['REST APIs', 'GraphQL'],
  Tools: ['Git', 'GitHub', 'Jenkins', 'Spinnaker', 'Datadog', 'Sentry'],
  Databases: ['SQL', 'PostgreSQL'],
  'Coding Assistance': ['GitHub Copilot', 'Cursor AI', 'Claude Code'],
};

const isSortedAlphabetically = (arr) => arr.join() === [...arr].sort().join();

const triggerConfetti = () => {
  for (let i = 0; i < 10; i++) {
    confetti({ particleCount: 20, spread: 70, origin: { x: Math.random(), y: Math.random() } });
  }
};

const Chip = React.forwardRef(({ children, dragging, ...rest }, ref) => (
  <span
    ref={ref}
    {...rest}
    style={{
      ...(rest.style || {}),
      padding: '4px 10px',
      border: '1px solid var(--fg-faint)',
      borderRadius: 999,
      color: 'var(--fg)',
      background: dragging ? 'var(--fg-faint)' : 'transparent',
      cursor: 'grab',
      userSelect: 'none',
    }}
  >
    {children}
  </span>
));

export default function Skills() {
  const [categories, setCategories] = useState(initialCategories);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    const category = result.source.droppableId;
    const items = Array.from(categories[category]);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setCategories((prev) => ({ ...prev, [category]: items }));
    if (isSortedAlphabetically(items)) triggerConfetti();
  };

  return (
    <div>
      <SectionHeader label="skills">things i use</SectionHeader>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '2rem' }}>
        sort any category alphabetically for a surprise.
      </p>
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(categories).map(([categoryName, skills]) => (
          <div key={categoryName} style={{ marginBottom: '1.75rem' }}>
            <div className="section-label">{'// '}{categoryName.toLowerCase()}</div>
            <Droppable droppableId={categoryName} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                >
                  {skills.map((skill, index) => (
                    <Draggable key={skill} draggableId={skill} index={index}>
                      {(p, snapshot) => (
                        <Chip
                          ref={p.innerRef}
                          dragging={snapshot.isDragging}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                        >
                          {skill}
                        </Chip>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
