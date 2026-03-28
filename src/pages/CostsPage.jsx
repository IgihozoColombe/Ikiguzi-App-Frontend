import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Coins } from 'lucide-react'
import { api } from '../lib/api.js'
import { useSearchParams } from 'react-router-dom'

export function CostsPage() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      cropId: '',
      category: 'seeds',
      seeds: 0,
      fertilizer: 0,
      labor: 0,
      pesticide: 0,
      irrigation: 0,
      transport: 0,
      note: '',
    },
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/api/crops')
        const items = res.data.crops || []
        if (mounted) {
          setCrops(items)
          const qpCropId = searchParams.get('cropId')
          const nextCropId = qpCropId || (items[0]?._id ?? '')
          reset((v) => ({ ...v, cropId: v.cropId || nextCropId }))
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [reset])

  async function onSubmit(values) {
    if (!values.cropId) return
    await api.post('/api/costs', {
      cropId: values.cropId,
      category: values.category,
      amountRwf: Number(values.amountRwf || 0),
      note: values.note || '',
      occurredAt: new Date().toISOString(),
    })
    reset({ ...values, amountRwf: 0, note: '' })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Cost tracking</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Record costs: seeds, fertilizer, labor, pesticide, irrigation,
          transport.
        </p>
      </div>

      <form className="ik-card p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="ik-label">Crop</label>
            <select className="ik-input mt-1" disabled={loading} {...register('cropId')}>
              {crops.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="ik-label">Cost type</label>
            <select className="ik-input mt-1" {...register('category')}>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="labor">Labor</option>
              <option value="pesticide">Pesticide</option>
              <option value="irrigation">Irrigation</option>
              <option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="ik-label">Amount (RWF)</label>
            <input className="ik-input mt-1" type="number" min="0" step="1" {...register('amountRwf', { valueAsNumber: true })} />
          </div>

          <div className="sm:col-span-2">
            <label className="ik-label">Note (optional)</label>
            <textarea
              className="ik-input mt-1 min-h-24"
              placeholder="Example: hired 2 workers for weeding"
              {...register('note')}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button className="ik-btn-secondary" type="button" onClick={() => reset()}>
            Clear
          </button>
          <button className="ik-btn-primary" type="submit">
            <Coins className="h-5 w-5" />
            Save cost
          </button>
        </div>
      </form>
    </div>
  )
}

