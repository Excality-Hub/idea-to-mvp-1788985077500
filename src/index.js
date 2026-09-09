let todos = [];
let nextId = 1;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    const method = request.method;

    if (pathname === "/todos" && method === "GET") {
      return json(todos);
    }

    if (pathname === "/todos" && method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "invalid JSON body" }, 400);
      }

      const title = typeof body?.title === "string" ? body.title.trim() : "";
      if (!title) {
        return json({ error: "title is required" }, 400);
      }

      const todo = { id: nextId++, title, done: false };
      todos.push(todo);
      return json(todo, 201);
    }

    const doneMatch = pathname.match(/^\/todos\/(\d+)\/done$/);
    if (doneMatch && method === "POST") {
      const id = parseInt(doneMatch[1], 10);
      const todo = todos.find((t) => t.id === id);
      if (!todo) {
        return json({ error: "todo not found" }, 404);
      }
      todo.done = true;
      return json(todo);
    }

    return json({ error: "not found" }, 404);
  },
};
