import { AdminRole } from "@prisma/client";
import { createAdminUser, toggleAdminUser } from "@/app/(admin)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

export default async function AdminUsersPage() {
  const current = await requireAdmin();
  if (current.role !== AdminRole.ADMIN) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        仅管理员角色可以查看和维护后台账号。
      </div>
    );
  }
  const users = await prisma.adminUser.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" }
  });
  return (
    <>
      <div>
        <p className="text-sm font-bold text-amber-600">USERS</p>
        <h1 className="mt-1 text-3xl font-bold">后台账号管理</h1>
      </div>
      <form
        action={createAdminUser}
        className="mt-7 rounded-xl border border-slate-200 bg-white p-6"
      >
        <h2 className="font-bold">新增后台账号</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold">
            姓名 *<input name="name" required className="admin-field mt-2" />
          </label>
          <label className="text-xs font-semibold">
            邮箱 *
            <input
              name="email"
              type="email"
              required
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            角色
            <select
              name="role"
              defaultValue={AdminRole.EDITOR}
              className="admin-field mt-2"
            >
              <option value="ADMIN">管理员</option>
              <option value="EDITOR">内容编辑</option>
              <option value="SALES">业务人员</option>
            </select>
          </label>
          <label className="text-xs font-semibold">
            初始密码（至少12位） *
            <input
              name="password"
              type="password"
              minLength={12}
              required
              autoComplete="new-password"
              className="admin-field mt-2"
            />
          </label>
        </div>
        <button className="mt-5 min-h-11 rounded-lg bg-forest-700 px-6 text-sm font-bold text-white">
          创建账号
        </button>
      </form>
      <div className="mt-7 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">账号</th>
              <th>角色</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="p-4 font-bold">
                  {user.name}
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    {user.email}
                  </p>
                </td>
                <td>{user.role}</td>
                <td>{user.active ? "启用" : "停用"}</td>
                <td>{formatDate(user.lastLoginAt)}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <form action={toggleAdminUser}>
                    <input type="hidden" name="id" value={user.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={user.active ? "false" : "true"}
                    />
                    <ConfirmSubmit
                      message={`确认${user.active ? "停用" : "启用"}账号 ${user.email}？`}
                      className={
                        user.active ? "" : "border-green-200 text-green-700"
                      }
                    >
                      {user.active ? "停用" : "启用"}
                    </ConfirmSubmit>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
