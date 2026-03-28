import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext.jsx'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    await login(values)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="mx-auto grid min-h-full w-full max-w-md place-items-center px-4 py-10">
      <div className="ik-card w-full p-6 text-left">
        <h1 className="text-2xl font-extrabold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back. Track your crop costs and prices.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="ik-label">Email</label>
            <input
              className="ik-input mt-1"
              inputMode="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm font-semibold text-rose-700">
                Enter a valid email
              </p>
            )}
          </div>

          <div>
            <label className="ik-label">Password</label>
            <input
              className="ik-input mt-1"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm font-semibold text-rose-700">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <button className="ik-btn-primary w-full" disabled={isSubmitting}>
            Sign in
          </button>
        </form>

        <p className="mt-4 text-sm font-semibold text-slate-700">
          New here?{' '}
          <Link className="text-emerald-700 underline" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

