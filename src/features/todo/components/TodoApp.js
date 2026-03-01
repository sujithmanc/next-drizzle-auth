import { addTodo, clearDone, getTodos } from "../actions"
import { todoStyles } from "../styles"
import TodoItem from "./TodoItem"

export default async function TodoApp() {
    const todos = await getTodos()
    const pending = todos.filter((t) => !t.done)
    const done = todos.filter((t) => t.done)

    return (
        <main className={todoStyles.main}>
            {/* Header */}
            <div className="w-full max-w-lg mb-10">
                <div className="flex items-end gap-3 mb-1">
                    <h1 className="text-5xl font-black tracking-tight leading-none" style={{ fontFamily: "'Georgia', serif", letterSpacing: '-2px' }}>
                        todos
                    </h1>
                    <span className="text-[#ff4d4d] text-5xl font-black leading-none">.</span>
                </div>
                <p className="text-[#555] text-sm tracking-widest uppercase">
                    {pending.length} remaining · stored in cookies
                </p>
            </div>

            {/* Add Form */}
            <form action={addTodo} className={todoStyles.addForm.container}>
                <input
                    name="text"
                    type="text"
                    placeholder="what needs to be done?"
                    autoComplete="off"
                    required
                    className={todoStyles.input}
                />
                <button
                    type="submit"
                    className={todoStyles.button.add}
                >
                    Add
                </button>
            </form>

            {/* Todo List */}
            <div className="w-full max-w-lg space-y-2">
                {todos.length === 0 && (
                    <div className="text-center text-[#333] py-16 text-sm tracking-widest">— empty —</div>
                )}

                {pending.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}

                {done.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 pt-4 pb-1">
                            <span className="text-xs text-[#444] tracking-widest uppercase">completed</span>
                            <div className="flex-1 h-px bg-[#222]" />
                            <form action={clearDone}>
                                <button type="submit" className="text-xs text-[#555] hover:text-[#ff4d4d] transition-colors cursor-pointer">
                                    clear all
                                </button>
                            </form>
                        </div>
                        {done.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </>
                )}
            </div>

            <p className="mt-16 text-[#2a2a2e] text-xs tracking-widest">
                server actions · next.js · cookies
            </p>
        </main>
    )
}