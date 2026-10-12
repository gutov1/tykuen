import { useState, type FormEvent } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

type AuthDialogProps = {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
};

type AuthMode = 'login' | 'register';

const settlements = [
  'Нальчик',
  'Баксан',
  'Прохладный',
  'Нарткала',
  'Чегем',
  'Тырныауз',
  'Майский',
  'Терек',
  'Кашхатау',
];

function getAuthError(message: string) {
  const normalized = message.toLocaleLowerCase('ru');
  if (normalized.includes('invalid login credentials')) return 'Неверная почта или пароль.';
  if (normalized.includes('user already registered'))
    return 'Аккаунт с такой почтой уже существует. Войди в него.';
  if (normalized.includes('password should be at least'))
    return 'Пароль должен содержать не менее 6 символов.';
  if (normalized.includes('email not confirmed'))
    return 'Подтверждение почты включено в настройках Supabase. Отключи его для проекта Тыкуэн.';
  if (normalized.includes('rate limit')) return 'Слишком много попыток. Попробуй немного позже.';
  return 'Не удалось выполнить запрос. Проверь данные и попробуй ещё раз.';
}

export function AuthDialog({ open, onClose, onAuthenticated }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [settlement, setSettlement] = useState('Нальчик');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!supabase) {
      setError('Сначала подключи Supabase: добавь URL проекта и anon key в файл .env.local.');
      return;
    }

    if (mode === 'register' && fullName.trim().length < 2) {
      setError('Укажи имя не короче двух символов.');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              settlement,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          onAuthenticated();
          onClose();
        } else {
          setNotice(
            'Аккаунт создан. Если вход не выполнился автоматически, проверь настройку подтверждения email в Supabase.',
          );
          setMode('login');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        onAuthenticated();
        onClose();
      }
    } catch (caught) {
      setError(getAuthError(caught instanceof Error ? caught.message : 'unknown'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="auth-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
        <div className="auth-mark" aria-hidden="true">
          т
        </div>
        <div className="eyebrow auth-eyebrow">СВОИ ЛЮДИ РЯДОМ</div>
        <h2 id="auth-title">{mode === 'login' ? 'С возвращением!' : 'Добро пожаловать'}</h2>
        <p className="auth-intro">
          {mode === 'login'
            ? 'Войди, чтобы находить своё и общаться с соседями.'
            : 'Создай аккаунт, чтобы пользоваться Тыкуэн.'}
        </p>

        {!isSupabaseConfigured && (
          <div className="auth-config-note" role="status">
            Авторизация подготовлена, но ещё не подключена к базе. Добавь{' '}
            <code>VITE_SUPABASE_URL</code> и <code>VITE_SUPABASE_ANON_KEY</code> в{' '}
            <code>.env.local</code>.
          </div>
        )}

        <div className="auth-tabs" role="tablist" aria-label="Способ входа">
          <button
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login');
              setError('');
              setNotice('');
            }}
          >
            Войти
          </button>
          <button
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => {
              setMode('register');
              setError('');
              setNotice('');
            }}
          >
            Регистрация
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>
                Как тебя зовут?
                <input
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Имя"
                  required
                  minLength={2}
                />
              </label>
              <label>
                Твой населённый пункт
                <select
                  value={settlement}
                  onChange={(event) => setSettlement(event.target.value)}
                  required
                >
                  {settlements.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                  <option value="Другой населённый пункт КБР">Другой населённый пункт КБР</option>
                </select>
              </label>
            </>
          )}
          <label>
            Электронная почта
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Не менее 6 символов"
              minLength={6}
              required
            />
          </label>
          {error && (
            <p className="auth-message error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="auth-message success" role="status">
              {notice}
            </p>
          )}
          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? 'Подожди…' : mode === 'login' ? 'Войти в Тыкуэн' : 'Создать аккаунт'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="auth-terms">
          Продолжая, ты соглашаешься использовать платформу уважительно и безопасно.
        </p>
      </section>
    </div>
  );
}
