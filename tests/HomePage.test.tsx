import { render, screen } from '@testing-library/react';
import { HomePage } from '@/pages/HomePage';

describe('HomePage', () => {
  it('показывает название бренда в правильном написании', () => {
    render(<HomePage />);
    expect(screen.getByText('Тыкуэн')).toBeTruthy();
  });
});
