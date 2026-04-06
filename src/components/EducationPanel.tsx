import { educationCards } from "../interpretation/education";
import { Section } from "./Section";

export const EducationPanel = () => (
  <Section title="Образовательный блок" eyebrow="Коротко и по делу">
    <div className="education-grid">
      {educationCards.map((card) => (
        <article key={card.title} className="education-card">
          <strong>{card.title}</strong>
          <p>{card.body}</p>
        </article>
      ))}
    </div>
  </Section>
);
