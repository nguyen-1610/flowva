export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] p-4 text-zinc-200">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] h-[40%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>
      <div className="w-full max-w-md space-y-8">{children}</div>
    </div>
  );
}
