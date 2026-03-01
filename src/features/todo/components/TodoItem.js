import { deleteTodo, toggleTodo } from "../actions";

// --- Sub-component ---
export default async function TodoItem({ todo }) {
  return (
    <div
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-lg border
        transition-all duration-150
        ${todo.done
          ? 'bg-[#111] border-[#1e1e1e] opacity-50'
          : 'bg-[#1a1a1e] border-[#2a2a2e] hover:border-[#3a3a3e]'
        }
      `}
    >
      {/* Toggle */}
      <form action={toggleTodo}>
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
            cursor-pointer transition-colors duration-150
            ${todo.done
              ? 'border-[#ff4d4d] bg-[#ff4d4d]'
              : 'border-[#333] hover:border-[#ff4d4d]'
            }
          `}
          aria-label="toggle"
        >
          {todo.done && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </form>

      {/* Text */}
      <span className={`flex-1 text-sm ${todo.done ? 'line-through text-[#444]' : 'text-[#e0e0e0]'}`}>
        {todo.text}
      </span>

      {/* Delete */}
      <form action={deleteTodo}>
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-[#ff4d4d] transition-all duration-150 cursor-pointer text-lg leading-none"
          aria-label="delete"
        >
          ×
        </button>
      </form>
    </div>
  )
}