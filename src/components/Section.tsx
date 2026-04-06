import type { PropsWithChildren, ReactNode } from "react";

interface SectionProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  aside?: ReactNode;
}

export const Section = ({ title, eyebrow, aside, children }: SectionProps) => (
  <section className="panel section">
    <header className="section__header">
      <div>
        {eyebrow ? <p className="section__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {aside ? <div className="section__aside">{aside}</div> : null}
    </header>
    {children}
  </section>
);
