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
graphify update .
```

## Graphify Python Environment

Graphify installed via `uv` runs in its own Python environment.

Do NOT use:

```bash
python3 -c "import graphify"
```

Use:

```bash
/Users/mac/.local/share/uv/tools/graphifyy/bin/python
```

Or Graphify CLI commands:

```bash
graphify update .
graphify watch .
graphify extract .
```

## Watch Mode

If watch mode reports:

```text
error: watchdog not installed
```

Install `watchdog` into the Graphify uv environment, not the system Python:

```bash
uv pip install --python /Users/mac/.local/share/uv/tools/graphifyy/bin/python watchdog
```

## Rebuild Operations

Never run `_rebuild_code(Path('.'))` from the home directory.
Always execute Graphify commands inside the target repository root.

## Rule

If graph and code conflict, trust code.

Then refresh graph.

Do not pretend stale graph is truth.

No fake map.
