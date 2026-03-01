export const loginStyles = {
  wrapper: "min-h-screen bg-[#0e0e10] flex items-center justify-center px-4",

  card: "w-full max-w-md bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8",

  heading: "text-3xl font-black text-white mb-1 tracking-tight",
  subheading: "text-sm text-[#555] mb-8 tracking-widest uppercase",

  form: "flex flex-col gap-5",

  field: {
    wrapper: "flex flex-col gap-1.5",
    label: "text-xs text-[#888] tracking-widest uppercase",
    input: "bg-[#111] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#6366f1] transition-colors duration-150",
  },

  forgotPassword: "text-right text-xs text-[#6366f1] hover:underline cursor-pointer",

  button: "mt-2 w-full bg-[#6366f1] hover:bg-[#4f46e5] active:scale-95 text-white py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-150 cursor-pointer",

  footer: "mt-6 text-center text-xs text-[#444]",
  footerLink: "text-[#6366f1] hover:underline",
}
