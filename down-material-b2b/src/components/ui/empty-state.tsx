import { Inbox } from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";

export function EmptyState({
  title,
  description,
  actionLabel = "联系在线客服",
  actionHref = "/contact"
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-xl2 border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <Inbox className="mx-auto size-9 text-slate-400" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        {description}
      </p>
      <OnlineServiceButton source={actionHref} className="mt-6" size="sm">
        {actionLabel}
      </OnlineServiceButton>
    </div>
  );
}
