import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext.jsx'

const schema = z
  .object({
    name: z.string().min(2),
    phone: z.string().min(8).optional().or(z.literal('')),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    await registerUser({
      name: values.name,
      phone: values.phone,
      email: values.email,
      password: values.password,
    })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="mx-auto grid min-h-full w-full max-w-md place-items-center px-4 py-10">
      <div className="ik-card w-full p-6 text-left">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Create account
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Add crops, track costs, and get price alerts.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="ik-label">Full name</label>
            <input
              className="ik-input mt-1"
              placeholder="Your name"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm font-semibold text-rose-700">
                Enter your name
              </p>
            )}
          </div>

          <div>
            <label className="ik-label">Phone (optional)</label>
            <input
              className="ik-input mt-1"
              inputMode="tel"
              placeholder="07xx xxx xxx"
              {...register('phone')}
            />
          </div>

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

          <div>
            <label className="ik-label">Confirm password</label>
            <input
              className="ik-input mt-1"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm font-semibold text-rose-700">
                {errors.confirmPassword.message?.toString() ??
                  'Confirm your password'}
              </p>
            )}
          </div>

          <button className="ik-btn-primary w-full" disabled={isSubmitting}>
            Create account
          </button>
        </form>

        <p className="mt-4 text-sm font-semibold text-slate-700">
          Already have an account?{' '}
          <Link className="text-emerald-700 underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

