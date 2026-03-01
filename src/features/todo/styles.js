export const todoStyles = {

    main: "min-h-screen bg-[#0e0e10] text-white font-mono flex flex-col items-center px-4 py-16",

    container: "w-full max-w-lg space-y-2",

    addForm: {
        container: "w-full max-w-lg flex gap-2 mb-8",
    },

    item: {
        base: "group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150",
        active: "bg-[#1a1a1e] border-[#2a2a2e] hover:border-[#3a3a3e]",
        done: "bg-[#111] border-[#1e1e1e] opacity-50",
    },

    text: {
        active: "flex-1 text-sm text-[#e0e0e0]",
        done: "flex-1 text-sm line-through text-[#444]",
    },

    button: {
        add: "bg-[#ff4d4d] hover:bg-[#ff2a2a] text-white px-5 py-3 rounded-lg text-sm font-bold transition-colors duration-150 cursor-pointer",
        delete: "opacity-0 group-hover:opacity-100 text-[#333] hover:text-[#ff4d4d] transition-all duration-150 cursor-pointer text-lg leading-none",
        toggle: {
            base: "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors duration-150",
            active: "border-[#333] hover:border-[#ff4d4d]",
            done: "border-[#ff4d4d] bg-[#ff4d4d]",
        },
    },

    input: "flex-1 bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#ff4d4d] transition-colors duration-150",
}