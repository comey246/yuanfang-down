import { LockKeyhole } from "lucide-react";

export const metadata = {
  title: "后台登录",
  robots: { index: false, follow: false }
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    error === "database"
      ? "数据库尚未配置，请先完成环境变量与迁移。"
      : error === "rate"
        ? "登录尝试过于频繁，请稍后再试。"
        : error
          ? "邮箱或密码错误。"
          : "";
  return (
    <div className="grid min-h-screen place-items-center bg-forest-900 px-4">
      <div className="w-full max-w-md rounded-[1.5rem] bg-white p-8 shadow-2xl">
        <span className="grid size-12 place-items-center rounded-xl bg-forest-50 text-forest-700">
          <LockKeyhole className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-bold">管理后台登录</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          仅限已授权的企业管理人员访问。
        </p>
        {message ? (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {message}
          </p>
        ) : null}
        <form
          action="/api/admin/login"
          method="post"
          className="mt-7 space-y-5"
        >
          <label className="block text-sm font-semibold">
            登录邮箱
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="admin-field mt-2"
            />
          </label>
          <label className="block text-sm font-semibold">
            密码
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              minLength={8}
              required
              className="admin-field mt-2"
            />
          </label>
          <button className="min-h-12 w-full rounded-lg bg-amber-500 font-bold text-white hover:bg-amber-600">
            安全登录
          </button>
        </form>
        <p className="mt-6 text-xs leading-5 text-slate-400">
          初始账号由 seed 环境变量创建。生产环境请使用不少于 12
          位的独立密码并妥善保管 AUTH_SECRET。
        </p>
      </div>
    </div>
  );
}
