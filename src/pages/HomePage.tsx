import { APP_SLOGAN } from '@/shared/lib/brand';
import { Logo } from '@/shared/ui/Logo';

export function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 16px' }}>
      <Logo size={56} />
      <p style={{ color: 'var(--color-muted)', fontSize: 18 }}>{APP_SLOGAN}</p>
      <p>Проект в разработке.</p>
    </main>
  );
}
