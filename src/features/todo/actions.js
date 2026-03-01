import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// --- Helpers ---
export async function getTodos() {
    const cookieStore = await cookies()
    const raw = cookieStore.get('todos')?.value
    if (!raw) return []
    try {
        return JSON.parse(decodeURIComponent(raw))
    } catch {
        return []
    }
}

export async function saveTodos(todos) {
    const cookieStore = await cookies()
    cookieStore.set('todos', encodeURIComponent(JSON.stringify(todos)), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })
}

// --- Server Actions ---
export async function addTodo(formData) {
    'use server'
    const text = formData.get('text')?.toString().trim()
    if (!text) return

    const todos = await getTodos()
    const newTodo = {
        id: Date.now().toString(),
        text,
        done: false,
        createdAt: Date.now(),
    }
    await saveTodos([newTodo, ...todos])
    revalidatePath('/')
}

export async function toggleTodo(formData) {
    'use server'
    const id = formData.get('id')?.toString()
    if (!id) return

    const todos = await getTodos()
    const updated = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    await saveTodos(updated)
    revalidatePath('/')
}

export async function deleteTodo(formData) {
    'use server'
    const id = formData.get('id')?.toString()
    if (!id) return

    const todos = await getTodos()
    await saveTodos(todos.filter((t) => t.id !== id))
    revalidatePath('/')
}

export async function clearDone() {
    'use server'
    const todos = await getTodos()
    await saveTodos(todos.filter((t) => !t.done))
    revalidatePath('/')
}