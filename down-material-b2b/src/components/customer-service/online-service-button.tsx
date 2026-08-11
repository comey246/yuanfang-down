"use client";

import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const CUSTOMER_SERVICE_OPEN_EVENT = "customer-service:open";

export type CustomerServiceContext = {
  product?: string;
  sample?: boolean;
  source?: string;
};

function openCustomerService(detail: CustomerServiceContext) {
  window.dispatchEvent(
    new CustomEvent<CustomerServiceContext>(CUSTOMER_SERVICE_OPEN_EVENT, {
      detail
    })
  );
}

type ContextProps = CustomerServiceContext & { children: ReactNode };

export function OnlineServiceButton({
  product,
  sample,
  source,
  children,
  ...props
}: ContextProps & Omit<ComponentProps<typeof Button>, "onClick">) {
  return (
    <Button
      type="button"
      {...props}
      onClick={() => openCustomerService({ product, sample, source })}
    >
      {children}
    </Button>
  );
}

export function OnlineServiceTrigger({
  product,
  sample,
  source,
  children,
  className,
  ariaLabel,
  onClick
}: ContextProps & {
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented)
          openCustomerService({ product, sample, source });
      }}
    >
      {children}
    </button>
  );
}
