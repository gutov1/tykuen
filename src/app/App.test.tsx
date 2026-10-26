import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import App from "./App"

vi.mock("../features/auth/useAuth", () => ({
  useAuth: () => ({
    session: null,
    user: null,
    loading: false
  })
}))

vi.mock("../lib/supabase", () => ({
  isSupabaseConfigured: false,
  supabase: null
}))

afterEach(cleanup)

describe("App", () => {
  it("renders the Тыкуэн homepage", () => {
    render(<App />)

    expect(
      screen.getByRole("heading", { name: /Своё рядом/i })
    ).toBeInTheDocument()

    expect(screen.getByRole("searchbox", { name: /Поиск/i })).toBeInTheDocument()
  })

  it("opens the sign-in and registration dialog", () => {
    render(<App />)

    fireEvent.click(screen.getByRole("button", { name: /Войти/i }))

    expect(
      screen.getByRole("dialog", { name: /с возвращением/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("tab", { name: /регистрация/i })
    ).toBeInTheDocument()
  })

  it("explains how to configure Supabase when credentials are missing", () => {
    render(<App />)
    fireEvent.click(screen.getByRole("button", { name: /Войти/i }))
  
    expect(screen.getByRole("status")).toHaveTextContent(
      /VITE_SUPABASE_URL.*VITE_SUPABASE_ANON_KEY.*\.env\.local/i
    )
  })
})