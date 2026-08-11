import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="overflow-hidden bg-forest-900 py-16 text-white sm:py-20">
      <Container>
        <p className="text-sm font-bold tracking-[.2em] text-amber-400">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty leading-7 text-white/70">
          {description}
        </p>
      </Container>
    </section>
  );
}
