import { signUpAction } from '../actions'
import { signUpStyles as s } from '../signUpStyles'

export default function SignUpForm() {
  return (
    <div className={s.wrapper}>
      <div className={s.card}>
        <h1 className={s.heading}>Create account</h1>
        <p className={s.subheading}>sign up to get started</p>

        <form action={signUpAction} className={s.form}>

          <div className={s.field.wrapper}>
            <label className={s.field.label}>Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className={s.field.input}
            />
          </div>

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
            <label className={s.field.label}>Role</label>
            <select name="role" required className={s.field.select}>
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className={s.field.wrapper}>
            <label className={s.field.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className={s.field.input}
            />
          </div>

          <button type="submit" className={s.button}>
            Create account
          </button>

        </form>

        <p className={s.footer}>
          Already have an account?{' '}
          <a href="/login" className={s.footerLink}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
