import { useMemo, useState } from 'react';
import { AuthDialog } from '../features/auth/AuthDialog';
import { useAuth } from '../features/auth/useAuth';
import { supabase } from '../lib/supabase';

type Category = 'Все' | 'Вещи' | 'Отдам' | 'Обмен' | 'Услуги';

type Listing = {
  id: number;
  title: string;
  price: string;
  place: string;
  category: Exclude<Category, 'Все'>;
  visual: string;
  tone: string;
  detail: string;
};

const categories: { label: Category; icon: string }[] = [
  { label: 'Все', icon: '✳' },
  { label: 'Вещи', icon: '◈' },
  { label: 'Отдам', icon: '♡' },
  { label: 'Обмен', icon: '⇄' },
  { label: 'Услуги', icon: '✦' },
];

const listings: Listing[] = [
  {
    id: 1,
    title: 'Плёночный фотоаппарат',
    price: '2 500 ₽',
    place: 'Нальчик',
    category: 'Вещи',
    visual: '📷',
    tone: 'peach',
    detail: 'В отличном состоянии',
  },
  {
    id: 2,
    title: 'Комнатные растения',
    price: 'Бесплатно',
    place: 'Чегем',
    category: 'Отдам',
    visual: '🪴',
    tone: 'mint',
    detail: 'Заберите несколько',
  },
  {
    id: 3,
    title: 'Наушники на обмен',
    price: 'Обмен',
    place: 'Нальчик',
    category: 'Обмен',
    visual: '🎧',
    tone: 'lilac',
    detail: 'Рассмотрю ваши варианты',
  },
  {
    id: 4,
    title: 'Помощь с английским',
    price: 'От 500 ₽',
    place: 'Прохладный',
    category: 'Услуги',
    visual: '📚',
    tone: 'yellow',
    detail: 'Онлайн или лично',
  },
  {
    id: 5,
    title: 'Городской рюкзак',
    price: '1 200 ₽',
    place: 'Баксан',
    category: 'Вещи',
    visual: '🎒',
    tone: 'blue',
    detail: 'Аккуратный, вместительный',
  },
  {
    id: 6,
    title: 'Настольные игры',
    price: 'Бесплатно',
    place: 'Нальчик',
    category: 'Отдам',
    visual: '🎲',
    tone: 'pink',
    detail: 'Переезжаю, отдаю',
  },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Все');
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading } = useAuth();
  const displayName = String(user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? '');

  const visibleListings = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('ru');
    return listings.filter((listing) => {
      const matchesCategory = activeCategory === 'Все' || listing.category === activeCategory;
      const matchesSearch = [listing.title, listing.place, listing.detail].some((value) =>
        value.toLocaleLowerCase('ru').includes(normalizedSearch),
      );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Тыкуэн — главная">
          <span className="brand-mark" aria-hidden="true">
            т
          </span>
          <span>
            тыкуэн<span className="brand-period">.</span>
          </span>
        </a>
        <nav className="top-nav" aria-label="Главная навигация">
          <a className="nav-link active" href="#listings">
            Объявления
          </a>
          <a className="nav-link" href="#how-it-works">
            Как это работает
          </a>
        </nav>
        <button
          className="profile-button"
          type="button"
          disabled={loading}
          onClick={() => {
            if (user) {
              void supabase?.auth.signOut();
            } else {
              setAuthOpen(true);
            }
          }}
        >
          <span className="profile-icon" aria-hidden="true">
            {user ? displayName.slice(0, 1).toLocaleUpperCase('ru') : '↗'}
          </span>
          <span>{loading ? 'Загрузка…' : user ? 'Выйти' : 'Войти'}</span>
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> СВОЁ СООБЩЕСТВО В КБР
            </div>
            <h1>
              Своё
              <br />
              <span>рядом.</span>
            </h1>
            <p className="hero-description">
              Находи вещи, делись хорошим и открывай людей рядом. Всё начинается с соседства.
            </p>
            <a className="hero-cta" href="#listings">
              Смотреть объявления <span aria-hidden="true">↘</span>
            </a>
            <div className="hero-note">
              <span className="note-avatars" aria-hidden="true">
                <i>☀</i>
                <i>✿</i>
                <i>↗</i>
              </span>
              <span>Люди рядом. Вещи по делу.</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Иллюстрация вещей для обмена">
            <div className="art-sun" />
            <div className="art-spark spark-one">✳</div>
            <div className="art-spark spark-two">✦</div>
            <div className="art-card art-card-back">
              <span>ОТДАЮ</span>
              <strong>♡</strong>
            </div>
            <div className="art-bag">👜</div>
            <div className="art-card art-card-front">
              <span>НАХОДИ СВОЁ</span>
              <strong>✳</strong>
            </div>
            <div className="art-caption">
              <span className="caption-pin">⌖</span>
              <span>
                Начинается
                <br />с твоего района
              </span>
            </div>
          </div>
          <div className="hero-stamp">
            <span>СОСЕДИ</span>
            <strong>↗</strong>
            <span>ПО СОСЕДСТВУ</span>
          </div>
        </section>

        <section className="browse-section" id="listings">
          <div className="section-heading">
            <div>
              <div className="eyebrow section-eyebrow">МАРКЕТПЛЕЙС ПО СОСЕДСТВУ</div>
              <h2>
                Что ищем <span>сегодня?</span>
              </h2>
            </div>
            <p>
              Хорошие вещи не должны пылиться.
              <br />
              Пусть найдут нового хозяина.
            </p>
          </div>

          <div className="search-row">
            <label className="search-box">
              <span className="search-symbol" aria-hidden="true">
                ⌕
              </span>
              <input
                aria-label="Поиск"
                type="search"
                placeholder="Что-то конкретное? Попробуй найти..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>↵</kbd>
            </label>
            <button
              className="location-button"
              type="button"
              onClick={() =>
                window.alert('Выбор населённого пункта появится после подключения профиля.')
              }
            >
              <span aria-hidden="true">⌖</span> Кабардино-Балкария{' '}
              <span className="chevron">⌄</span>
            </button>
          </div>

          <div className="category-row" aria-label="Категории объявлений">
            {categories.map((category) => (
              <button
                className={
                  activeCategory === category.label ? 'category-chip selected' : 'category-chip'
                }
                key={category.label}
                type="button"
                aria-pressed={activeCategory === category.label}
                onClick={() => setActiveCategory(category.label)}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.label}
              </button>
            ))}
            <span className="category-hint">НАЙДИ СВОЁ ✳</span>
          </div>

          <div className="listing-grid" aria-live="polite">
            {visibleListings.map((listing) => (
              <article className="listing-card" key={listing.id}>
                <div className={`listing-visual ${listing.tone}`}>
                  <span className="listing-type">{listing.category}</span>
                  <span className="listing-emoji" aria-hidden="true">
                    {listing.visual}
                  </span>
                  <button
                    className="favorite-button"
                    type="button"
                    aria-label={`Добавить в избранное: ${listing.title}`}
                    onClick={(event) => event.currentTarget.classList.toggle('is-favorite')}
                  >
                    ♡
                  </button>
                  <span className="visual-decoration" aria-hidden="true">
                    ✳
                  </span>
                </div>
                <div className="listing-info">
                  <div className="listing-meta">
                    <span>{listing.place}</span>
                    <span>СЕГОДНЯ</span>
                  </div>
                  <h3>{listing.title}</h3>
                  <p>{listing.detail}</p>
                  <div className="listing-bottom">
                    <strong>{listing.price}</strong>
                    <button type="button" aria-label={`Открыть объявление: ${listing.title}`}>
                      ↗
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visibleListings.length === 0 && (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>Пока ничего не нашлось</h3>
              <p>Попробуй изменить запрос или выбрать другую категорию.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('Все');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          <div className="more-row">
            <span>МАЛЕНЬКИЕ НАХОДКИ — БОЛЬШИЕ ИСТОРИИ</span>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('Все');
                setSearch('');
              }}
            >
              Все объявления <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>

        <section className="community-strip" id="how-it-works">
          <div className="community-icon" aria-hidden="true">
            ✳
          </div>
          <div>
            <h2>
              Не просто вещи. <span>Свои люди.</span>
            </h2>
            <p>Договаривайся напрямую, встречайся рядом и давай вещам вторую жизнь.</p>
          </div>
          <a href="#listings">
            Начать искать <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            т
          </span>
          <span>
            тыкуэн<span className="brand-period">.</span>
          </span>
        </a>
        <span>Сделано для соседей в Кабардино-Балкарии</span>
        <span>© Тыкуэн 2026</span>
      </footer>
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={() => setAuthOpen(false)}
      />
    </div>
  );
}

export default App;
