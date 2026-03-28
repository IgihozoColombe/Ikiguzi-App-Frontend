import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Wheat } from 'lucide-react'
import { api } from '../lib/api.js'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export function CropsPage() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editCropId, setEditCropId] = useState(null)
  const navigate = useNavigate()

  const schema = z.object({
    name: z.string().min(2),
    areaHa: z.coerce.number().nonnegative().optional().default(0),
    season: z.string().optional().default(''),
    expectedYieldKg: z.coerce.number().nonnegative().optional().default(0),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/api/crops')
        if (mounted) setCrops(res.data.crops || [])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  async function onAdd(values) {
    const payload = {
      name: values.name,
      areaHa: values.areaHa ?? 0,
      season: values.season ?? '',
      expectedYieldKg: values.expectedYieldKg ?? 0,
    }

    if (editCropId) {
      await api.patch(`/api/crops/${editCropId}`, payload)
    } else {
      await api.post('/api/crops', payload)
    }
    reset()
    setEditCropId(null)
    setAdding(false)
    const res = await api.get('/api/crops')
    setCrops(res.data.crops || [])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Crops</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Add maize, beans, rice, coffee and more.
          </p>
        </div>
        <button
          className="ik-btn-primary px-4 py-2"
          type="button"
          onClick={() => {
            setEditCropId(null)
            setAdding(true)
          }}
        >
          <Plus className="h-5 w-5" />
          Add crop
        </button>
      </div>

      {adding ? (
        <form
          className="ik-card p-5 text-left"
          onSubmit={handleSubmit(onAdd)}
        >
          <h3 className="text-lg font-extrabold text-slate-900">
            {editCropId ? 'Edit crop' : 'Add crop'}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="ik-label">Crop name</label>
              <input
                className="ik-input mt-1"
                placeholder="Maize"
                {...register('name')}
              />
              {errors.name ? (
                <p className="mt-1 text-sm font-semibold text-rose-700">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="ik-label">Area (ha)</label>
              <input
                className="ik-input mt-1"
                type="number"
                min="0"
                step="0.1"
                {...register('areaHa')}
              />
            </div>

            <div>
              <label className="ik-label">Expected yield (kg)</label>
              <input
                className="ik-input mt-1"
                type="number"
                min="0"
                step="1"
                {...register('expectedYieldKg')}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="ik-label">Season</label>
              <input
                className="ik-input mt-1"
                placeholder="2026 A or Perennial"
                {...register('season')}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="ik-btn-secondary"
              type="button"
              onClick={() => {
                setAdding(false)
                setEditCropId(null)
                reset()
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button className="ik-btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save crop'}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="ik-card p-5 text-sm font-semibold text-slate-600">
          Loading crops…
        </div>
      ) : crops.length === 0 ? (
        <div className="ik-card p-5 text-sm font-semibold text-slate-600">
          No crops yet. Tap “Add crop”.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {crops.map((c) => (
            <div key={c._id} className="ik-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {c.name}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-600">
                    Area: {c.areaHa ?? 0} ha • Season:{' '}
                    {c.season || '—'}
                  </div>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Wheat className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="ik-btn-secondary px-3 py-2"
                  type="button"
                  onClick={() => {
                    setEditCropId(c._id)
                    reset({
                      name: c.name,
                      areaHa: c.areaHa ?? 0,
                      season: c.season || '',
                      expectedYieldKg: c.expectedYieldKg ?? 0,
                    })
                    setAdding(true)
                  }}
                >
                  Edit
                </button>
                <button
                  className="ik-btn-secondary px-3 py-2"
                  type="button"
                  onClick={() => navigate(`/costs?cropId=${c._id}`)}
                >
                  View costs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

