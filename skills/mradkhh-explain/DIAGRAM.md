# Diagram rung

One diagram that shows the real mechanism, plus a short STE legend under it.

## Pick the type

| Subject                                         | Diagram          |
| ----------------------------------------------- | ---------------- |
| A request moving across services, actors, calls | Sequence         |
| A status field and its allowed transitions      | State machine    |
| Conditional logic, guards, early returns        | Flowchart        |
| Tables, relations, ownership                    | Entity-relation  |
| Modules and who depends on whom                 | Component / box  |

When the subject needs two types, draw the most important one and offer the second.

## Render

- **In chat**: a Mermaid code block. Keep it under ~25 nodes; split into two diagrams when it grows past that.
- **When a visual tool is available** (inline widget, Artifact, diagram skill): draw SVG through it and follow that tool's own guidance.

## Content

- Label every node and arrow with the real name: function, endpoint, table, event, status value.
- Put the `file:line` for each node in the legend (or as a tooltip/link in SVG).
- Show the failure and edge branches the code actually handles, labelled with their condition.
- Under the diagram: an STE legend of 3–6 lines that walks the main path in order.
