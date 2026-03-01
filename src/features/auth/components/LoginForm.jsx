import { loginAction } from '../actions'
import { loginStyles as s } from '../loginStyles'

export default function LoginForm() {
  return (
    <div className={s.wrapper}>
      <div className={s.card}>
        <h1 className={s.heading}>Welcome back</h1>
        <p className={s.subheading}>sign in to your account</p>

        <form action={loginAction} className={s.form}>

          <div className={s.field.wrapper}>
            <label className={s.field.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className={s.field.input}
            />
          </div>

          <div className={s.field.wrapper}>
            <div className="flex items-center justify-between">
              <label className={s.field.label}>Password</label>
              <a href="/forgot-password" className={s.forgotPassword}>Forgot password?</a>
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className={s.field.input}
            />
          </div>

          <button type="submit" className={s.button}>
            Sign in
          </button>

        </form>

        <p className={s.footer}>
          Don&apos;t have an account?{' '}
          <a href="/register" className={s.footerLink}>Sign up</a>
        </p>
      </div>
    </div>
  )
}
