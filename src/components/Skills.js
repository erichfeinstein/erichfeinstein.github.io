import React, { useState } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialSkills = [
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Sass",
  "REST APIs",
  "GraphQL",
  "Datadog",
  "Sentry",
  "React",
  "Redux",
  "Git",
  "GitHub",
  "Python",
  "Java",
  "Node",
  "NPM",
  "Yarn",
  "Jest",
  "Jasmine",
  "TDD",
  "Jenkins",
  "Spinnaker",
  "SQL",
  "PostgreSQL"
];

const Skills = () => {
  const [skills, setSkills] = useState(initialSkills);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSkills(items);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Skills
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skills" direction="horizontal">
          {(provided) => (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {skills.map((skill, index) => (
                <Draggable key={skill} draggableId={skill} index={index}>
                  {(provided) => (
                    <Chip
                      label={skill}
                      sx={{ mb: 1, cursor: 'grab' }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default Skills;