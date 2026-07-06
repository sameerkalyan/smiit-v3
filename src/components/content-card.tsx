"use client";

import { type ReactNode, type HTMLAttributes } from "react";

type CardVariant = "default" | "accent" | "outline" | "ghost";

interface ContentCardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantMap: Record<CardVariant, string> = {
  default: "brutalist-card",
  accent: "brutalist-card brutalist-card-inverted",
  outline:
    "border-2 border-[var(--line)] bg-transparent",
  ghost: "bg-transparent",
};

function ContentCardRoot({
  variant = "default",
  children,
  className,
  ...rest
}: ContentCardProps) {
  return (
    <div className={`${variantMap[variant]} flex flex-col ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

interface CardSlotProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardHeader({ children, className, ...rest }: CardSlotProps) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-3 border-b-2 brutalist-divider ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardBody({ children, className, ...rest }: CardSlotProps) {
  return (
    <div className={`px-5 pt-6 pb-4 ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

function CardAside({ children, className, ...rest }: CardSlotProps) {
  return (
    <aside
      className={`xl:w-64 shrink-0 space-y-4 border-t-2 xl:border-t-0 xl:border-l-2 border-[var(--line)] pt-6 xl:pt-0 xl:pl-8 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </aside>
  );
}

function CardFooter({ children, className, ...rest }: CardSlotProps) {
  return (
    <div className={`px-5 pb-5 pt-3 ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

export const ContentCard = Object.assign(ContentCardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Aside: CardAside,
  Footer: CardFooter,
});
