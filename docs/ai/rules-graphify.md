# AI rules — Graphify

Graph is cave map. Use map before wandering.

## Location

```txt
graphify-out/
```

## Before architecture/codebase questions

Read:

```txt
graphify-out/GRAPH_REPORT.md
```

If exists, prefer wiki:

```txt
graphify-out/wiki/index.md
```

Use graph before raw file crawling when possible.

## Use graph for

- dependency understanding
- architecture review
- circular dependency investigation
- package boundary questions
- large refactor planning
- finding ownership of modules
- understanding app/package relationships

## After editing code

Refresh graph:

```bash
python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```

## Rule

If graph and code conflict, trust code.

Then refresh graph.

Do not pretend stale graph is truth.

No fake map.
