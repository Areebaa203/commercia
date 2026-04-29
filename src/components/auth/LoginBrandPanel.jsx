import { Icon } from "@iconify/react";

export default function LoginBrandPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-blue-600 p-12 text-white lg:flex">
      <div className="z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon icon="mingcute:shopping-bag-2-fill" width="24" />
        </div>
        <span className="text-2xl font-bold tracking-tight">Commercia</span>
      </div>

      <div className="z-10 max-w-md space-y-6">
        <h2 className="text-4xl font-extrabold leading-tight">Manage your store efficiently.</h2>
        <p className="text-lg text-blue-100">
          Monitor sales, manage inventory, and grow your business with our powerful tools.
        </p>
      </div>

      <div className="z-10 flex items-center justify-between text-sm text-blue-200">
        <p>© 2024 Commercia Inc.</p>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-white">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
        </div>
      </div>

      <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-3xl" />
    </div>
  );
}
