import "./App.css";
import { useState } from "react";
import { catalogStats } from "./catalog/coffeeCatalog";
import { CoffeeCatalogTab } from "./components/CoffeeCatalogTab";
import { SimulationWorkspace } from "./components/SimulationWorkspace";
import { defaultParameters } from "./presets";
import type { BrewParameters, SimulationPreset } from "./types/domain";
import { formatSeconds } from "./utils/format";

type AppTabId = "catalog" | "simulation";

const appTabs: Array<{ id: AppTabId; label: string }> = [
  { id: "catalog", label: "1. Карта напитков" },
  { id: "simulation", label: "2. Симулятор экстракции" },
];

function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>("catalog");
  const [parameters, setParameters] = useState<BrewParameters>(defaultParameters);

  const handlePresetApply = (preset: SimulationPreset) => {
    setParameters(preset.parameters);
  };

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" />
      <main className="app">
        <header className="hero panel">
          <div className="hero__copy">
            <p className="hero__eyebrow">Coffee Extraction Engine</p>
            {activeTab === "catalog" ? (
              <>
                <h1>Карта кофейных напитков и их состава</h1>
                <p className="hero__lead">
                  Первый таб показывает основные чёрные, молочные и кофейные напитки с добавками.
                  У каждой чашки есть визуальный разрез, сенсорные шкалы и развёрнутое описание по
                  клику.
                </p>
              </>
            ) : (
              <>
                <h1>Численная модель экстракции кофе в браузере</h1>
                <p className="hero__lead">
                  Один и тот же ODE-процесс решается двумя методами: Euler и RK4. Сравнивайте, как
                  шаг интегрирования и параметры пролива меняют профиль чашки, объём и диагноз.
                </p>
              </>
            )}
          </div>
          <div className="hero__stats">
            {activeTab === "catalog" ? (
              <>
                <article className="hero-stat">
                  <span>Категории</span>
                  <strong>{catalogStats.categoryCount}</strong>
                </article>
                <article className="hero-stat">
                  <span>Напитки</span>
                  <strong>{catalogStats.drinkCount}</strong>
                </article>
                <article className="hero-stat">
                  <span>Фокус</span>
                  <strong>Состав и приготовление</strong>
                </article>
              </>
            ) : (
              <>
                <article className="hero-stat">
                  <span>Напиток</span>
                  <strong>{parameters.drinkType === "lungo" ? "Лунго" : parameters.drinkType === "americano" ? "Американо" : "Эспрессо"}</strong>
                </article>
                <article className="hero-stat">
                  <span>Время пролива</span>
                  <strong>{formatSeconds(parameters.brewTimeSec)}</strong>
                </article>
                <article className="hero-stat">
                  <span>dt</span>
                  <strong>{formatSeconds(parameters.dtSec)}</strong>
                </article>
              </>
            )}
          </div>
        </header>

        <nav className="tabs panel" aria-label="Основные вкладки">
          {appTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "tabs__button tabs__button--active" : "tabs__button"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "catalog" ? (
          <CoffeeCatalogTab />
        ) : (
          <SimulationWorkspace
            parameters={parameters}
            onChange={setParameters}
            onPresetApply={handlePresetApply}
          />
        )}
      </main>
    </div>
  );
}

export default App;
