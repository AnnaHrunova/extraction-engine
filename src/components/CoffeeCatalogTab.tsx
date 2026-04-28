import { useEffect, useMemo, useState } from "react";
import {
  catalogStats,
  coffeeCatalog,
  coffeeCategories,
  getDrinksByCategory,
  getGroupsByCategory,
} from "../catalog/coffeeCatalog";
import type { CoffeeCategoryId, CoffeeDrink, CoffeeMetricId } from "../types/catalog";
import { formatMl } from "../utils/format";
import { Section } from "./Section";

type CatalogFilterId = CoffeeCategoryId | "all";

const metricLabels: Record<CoffeeMetricId, string> = {
  strength: "Крепость",
  bitterness: "Горечь",
  acidity: "Кислотность",
  sweetness: "Сладость",
  body: "Плотность",
};

const REFERENCE_CUP_VOLUME_ML = 300;
const ESPRESSO_CUP_MAX_VOLUME_ML = 70;

type CupEmojiTheme = "bronze" | "cream" | "cocoa" | "citrus" | "graphite";

type CupEmojiSet = {
  badge: string;
  accent: string;
  theme: CupEmojiTheme;
};

const getLayerVolumeMl = (drink: CoffeeDrink, amountPercent: number): number =>
  (drink.volumeMl * amountPercent) / 100;

const formatLayerBreakdown = (drink: CoffeeDrink, amountPercent: number): string =>
  `${amountPercent}% · ~${formatMl(getLayerVolumeMl(drink, amountPercent))}`;

const cupEmojiByDrinkId: Record<string, CupEmojiSet> = {
  espresso: { badge: "☕", accent: "✦", theme: "bronze" },
  ristretto: { badge: "⚡", accent: "☕", theme: "bronze" },
  lungo: { badge: "🫘", accent: "☕", theme: "bronze" },
  americano: { badge: "💧", accent: "☕", theme: "graphite" },
  "filter-coffee": { badge: "🫗", accent: "✦", theme: "graphite" },
  v60: { badge: "💠", accent: "🫗", theme: "graphite" },
  aeropress: { badge: "🧪", accent: "☕", theme: "graphite" },
  turkish: { badge: "🌙", accent: "☕", theme: "bronze" },
  cappuccino: { badge: "🥛", accent: "☁️", theme: "cream" },
  "flat-white": { badge: "🥛", accent: "✦", theme: "cream" },
  latte: { badge: "🥛", accent: "🤍", theme: "cream" },
  cortado: { badge: "⚖️", accent: "🥛", theme: "cream" },
  macchiato: { badge: "🥛", accent: "☕", theme: "cream" },
  "latte-macchiato": { badge: "🥛", accent: "✨", theme: "cream" },
  piccolo: { badge: "🥛", accent: "⚡", theme: "cream" },
  mocha: { badge: "🍫", accent: "🥛", theme: "cocoa" },
  viennese: { badge: "☁️", accent: "🍫", theme: "cream" },
  marocchino: { badge: "🍫", accent: "☁️", theme: "cocoa" },
  "cafe-bombon": { badge: "🍮", accent: "🥛", theme: "cream" },
  bicerin: { badge: "🍫", accent: "☁️", theme: "cocoa" },
  bumble: { badge: "🍊", accent: "✨", theme: "citrus" },
};

const getCupEmojis = (drink: CoffeeDrink): CupEmojiSet =>
  cupEmojiByDrinkId[drink.id] ??
  (drink.categoryId === "milk"
    ? { badge: "🥛", accent: "☕", theme: "cream" }
    : drink.categoryId === "extras"
      ? { badge: "✨", accent: "☕", theme: "cocoa" }
      : { badge: "☕", accent: "✦", theme: "bronze" });

const CategoryTabs = ({
  activeFilter,
  onChange,
}: {
  activeFilter: CatalogFilterId;
  onChange: (next: CatalogFilterId) => void;
}) => (
  <div className="segmented segmented--catalog">
    <button
      type="button"
      className={activeFilter === "all" ? "is-active" : undefined}
      onClick={() => onChange("all")}
    >
      Все категории
    </button>
    {coffeeCategories.map((category) => (
      <button
        key={category.id}
        type="button"
        className={activeFilter === category.id ? "is-active" : undefined}
        onClick={() => onChange(category.id)}
      >
        {`${category.order}. ${category.shortLabel}`}
      </button>
    ))}
  </div>
);

const CupDiagram = ({
  drink,
  labelled = false,
  showLayerAmounts = false,
}: {
  drink: CoffeeDrink;
  labelled?: boolean;
  showLayerAmounts?: boolean;
}) => (
  (() => {
    const fillPercent = Math.min((drink.volumeMl / REFERENCE_CUP_VOLUME_ML) * 100, 100);
    const isEspressoCup = drink.volumeMl <= ESPRESSO_CUP_MAX_VOLUME_ML;
    const cupEmojis = getCupEmojis(drink);
    const renderedLayers = drink.layers.map((drinkLayer) => {
      const layerFillPercent = (fillPercent * drinkLayer.amountPercent) / 100;

      return {
        ...drinkLayer,
        layerFillPercent,
        layerVolumeMl: getLayerVolumeMl(drink, drinkLayer.amountPercent),
      };
    });
    const fillMarkerPercent = Math.min(92, Math.max(fillPercent, 8));

    return (
      <div
        className={[
          "cup-diagram",
          labelled ? "cup-diagram--labelled" : "",
          isEspressoCup ? "cup-diagram--espresso" : "",
          `cup-diagram--theme-${cupEmojis.theme}`,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="cup-diagram__meta">
          <span className="cup-diagram__capacity-tag">{`Эталон чашки: ${REFERENCE_CUP_VOLUME_ML} мл`}</span>
        </div>
        <div className="cup-diagram__visual">
          <div className="cup-diagram__glass">
            <div className="cup-diagram__layers">
              <div className="cup-diagram__empty" style={{ height: `${100 - fillPercent}%` }} />
              {renderedLayers.map((drinkLayer) => (
                <div
                  key={`${drink.id}-${drinkLayer.id}`}
                  className="cup-diagram__layer"
                  style={{
                    height: `${drinkLayer.layerFillPercent}%`,
                    background: drinkLayer.color,
                  }}
                >
                  {labelled && drinkLayer.layerFillPercent >= 14 ? (
                    <span>{`${drinkLayer.label} ${formatLayerBreakdown(drink, drinkLayer.amountPercent)}`}</span>
                  ) : showLayerAmounts && drinkLayer.layerFillPercent >= 10 ? (
                    <span className="cup-diagram__layer-amount">{`~${formatMl(drinkLayer.layerVolumeMl)}`}</span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="cup-diagram__ornaments" aria-hidden="true">
              <span className="cup-diagram__emoji cup-diagram__emoji--badge">{cupEmojis.badge}</span>
              <span className="cup-diagram__emoji cup-diagram__emoji--accent">{cupEmojis.accent}</span>
            </div>
            <span className="cup-diagram__fill-tag" style={{ bottom: `${fillMarkerPercent}%` }}>
              {formatMl(drink.volumeMl)}
            </span>
            <div className="cup-diagram__handle" />
            <div className="cup-diagram__base" />
          </div>
          <div className="cup-diagram__scale" aria-hidden="true">
            <span>{`${REFERENCE_CUP_VOLUME_ML} мл`}</span>
            <span>{`${REFERENCE_CUP_VOLUME_ML / 2} мл`}</span>
            <span>0 мл</span>
          </div>
        </div>
      </div>
    );
  })()
);

const MetricScale = ({ label, value }: { label: string; value: number }) => (
  <div className="metric-scale">
    <div className="metric-scale__header">
      <span>{label}</span>
      <strong>{`${value}/5`}</strong>
    </div>
    <div className="metric-scale__track">
      <div className="metric-scale__fill" style={{ width: `${(value / 5) * 100}%` }} />
    </div>
  </div>
);

const CoffeeCard = ({
  drink,
  onOpen,
}: {
  drink: CoffeeDrink;
  onOpen: (drink: CoffeeDrink) => void;
}) => (
  <button type="button" className="coffee-card" onClick={() => onOpen(drink)}>
    <div className="coffee-card__header">
      <div>
        <h3>{drink.name}</h3>
        <p>{drink.subtitle}</p>
      </div>
      <span className="badge">{`${drink.volumeMl} мл`}</span>
    </div>

    <CupDiagram drink={drink} showLayerAmounts />

    <div className="coffee-card__spotlight">
      <span className="coffee-card__spotlight-label">Характер</span>
      <strong>{drink.spotlightLine}</strong>
    </div>

    <div className="ingredient-legend">
      {drink.layers.map((drinkLayer) => (
        <span key={`${drink.id}-legend-${drinkLayer.id}`} className="ingredient-legend__item">
          <i style={{ background: drinkLayer.color }} />
          {`${drinkLayer.label} ${formatLayerBreakdown(drink, drinkLayer.amountPercent)}`}
        </span>
      ))}
    </div>

    <div className="coffee-card__metrics">
      {(Object.keys(metricLabels) as CoffeeMetricId[]).map((metricId) => (
        <MetricScale
          key={`${drink.id}-${metricId}`}
          label={metricLabels[metricId]}
          value={drink.metrics[metricId]}
        />
      ))}
    </div>

    <div className="coffee-card__footer">
      <span>{drink.baseLabel}</span>
      <strong>Нажмите, чтобы открыть рецепт</strong>
    </div>
  </button>
);

const CoffeeModal = ({
  drink,
  onClose,
}: {
  drink: CoffeeDrink;
  onClose: () => void;
}) => (
  <div className="coffee-modal__overlay" onClick={onClose} role="presentation">
    <div
      className="coffee-modal panel"
      onClick={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`coffee-modal-title-${drink.id}`}
    >
      <button type="button" className="coffee-modal__close" onClick={onClose} aria-label="Закрыть">
        ×
      </button>
      <div className="coffee-modal__layout">
        <div className="coffee-modal__visual">
          <div className="coffee-modal__topline">
            <span className="section__eyebrow">{drink.baseLabel}</span>
            <span className="badge">{`${drink.volumeMl} мл`}</span>
          </div>
          <h3 id={`coffee-modal-title-${drink.id}`}>{drink.name}</h3>
          <p className="muted-copy">{drink.description}</p>
          <CupDiagram drink={drink} labelled />
          <div className="ingredient-legend ingredient-legend--modal">
            {drink.layers.map((drinkLayer) => (
              <span key={`${drink.id}-modal-${drinkLayer.id}`} className="ingredient-legend__item">
                <i style={{ background: drinkLayer.color }} />
                {`${drinkLayer.label} ${formatLayerBreakdown(drink, drinkLayer.amountPercent)}`}
              </span>
            ))}
          </div>
        </div>
        <div className="coffee-modal__content">
          <div className="coffee-modal__block">
            <strong>Что в этом напитке цепляет</strong>
            <p className="coffee-modal__spotlight">{drink.spotlightLine}</p>
          </div>
          <div className="coffee-modal__block">
            <strong>Как готовится</strong>
            <p>{drink.brewingMethod}</p>
          </div>
          <div className="coffee-modal__block">
            <strong>Способ приготовления</strong>
            <ol className="coffee-steps">
              {drink.preparationSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="coffee-modal__block">
            <strong>Сенсорный профиль</strong>
            <div className="coffee-card__metrics coffee-card__metrics--modal">
              {(Object.keys(metricLabels) as CoffeeMetricId[]).map((metricId) => (
                <MetricScale
                  key={`${drink.id}-modal-${metricId}`}
                  label={metricLabels[metricId]}
                  value={drink.metrics[metricId]}
                />
              ))}
            </div>
          </div>
          <div className="coffee-modal__block">
            <strong>Когда это уместно</strong>
            <p>{drink.servingNote}</p>
          </div>
          <div className="tag-list">
            {drink.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const CoffeeCatalogTab = () => {
  const [activeFilter, setActiveFilter] = useState<CatalogFilterId>("all");
  const [selectedDrink, setSelectedDrink] = useState<CoffeeDrink | null>(null);

  useEffect(() => {
    if (!selectedDrink) {
      return undefined;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedDrink(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedDrink]);

  const visibleCategories = useMemo(
    () =>
      activeFilter === "all"
        ? coffeeCategories
        : coffeeCategories.filter((category) => category.id === activeFilter),
    [activeFilter],
  );

  return (
    <>
      <Section
        title="Карта кофейных напитков"
        eyebrow="Первый таб"
        aside={<span className="badge badge--accent">Без сиропов и прочей липкой ереси</span>}
      >
        <div className="catalog-intro">
          <div className="catalog-intro__stats">
            <article className="hero-stat">
              <span>Категории</span>
              <strong>{catalogStats.categoryCount}</strong>
            </article>
            <article className="hero-stat">
              <span>Напитки</span>
              <strong>{catalogStats.drinkCount}</strong>
            </article>
            <article className="hero-stat">
              <span>Как читать</span>
              <strong>Нажмите на чашку</strong>
            </article>
          </div>
          <div className="catalog-intro__copy">
            <p className="muted-copy">
              Здесь собраны основные кофейные напитки по трём группам: чёрные, молочные и с
              добавками. У каждой карточки показан разрез чашки относительно общей шкалы 300 мл,
              примерные пропорции и сенсорный профиль по пяти шкалам.
            </p>
            <p className="muted-copy">
              Для наглядности я добавил не только базовые позиции вроде эспрессо и капучино, но и
              нормальные классические вариации: V60, аэропресс, кортадо, бамбл, кафе бомбон,
              бичерин и прочее, но без сиропного цирка.
            </p>
          </div>
        </div>

        <CategoryTabs activeFilter={activeFilter} onChange={setActiveFilter} />
      </Section>

      {visibleCategories.map((category) => (
        <Section
          key={category.id}
          title={`${category.order}. ${category.label}`}
          eyebrow="Категория"
          aside={<span className="badge">{`${getDrinksByCategory(category.id).length} напитков`}</span>}
        >
          <p className="muted-copy catalog-category__description">{category.description}</p>
          <div className="coffee-group-stack">
            {getGroupsByCategory(category.id).map((group) => {
              const groupDrinks = coffeeCatalog.filter(
                (drink) => drink.categoryId === category.id && drink.groupId === group.id,
              );

              if (groupDrinks.length === 0) {
                return null;
              }

              return (
                <section key={group.id} className="coffee-group">
                  <header className="coffee-group__header">
                    <div>
                      <h3>{group.label}</h3>
                      <p>{group.description}</p>
                    </div>
                    <span className="badge">{`${groupDrinks.length} напитков`}</span>
                  </header>
                  <div className="coffee-grid">
                    {groupDrinks.map((drink) => (
                      <CoffeeCard key={drink.id} drink={drink} onOpen={setSelectedDrink} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </Section>
      ))}

      {selectedDrink ? <CoffeeModal drink={selectedDrink} onClose={() => setSelectedDrink(null)} /> : null}
    </>
  );
};
