import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { api } from '../lib/api.js'

function ConfidencePill({ confidence }) {
  const pct = Math.round(confidence * 100)
  const color =
    pct >= 80
      ? 'bg-emerald-600'
      : pct >= 60
        ? 'bg-amber-500'
        : 'bg-rose-600'
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold text-white ${color}`}
    >
      Confidence {pct}%
    </span>
  )
}

export function PredictionsPage() {
  const [crops, setCrops] = useState([])
  const [cropId, setCropId] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      const res = await api.get('/api/crops')
      const items = res.data.crops || []
      if (!mounted) return
      setCrops(items)
      setCropId(items[0]?._id || '')
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  async function predict() {
    if (!cropId) return
    const res = await api.post('/api/predictions', { cropId, windowDays: 14 })
    setResult(res.data)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          AI price predictions
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Forecast market prices with a confidence score.
        </p>
      </div>

      <div className="ik-card p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="ik-label">Crop</label>
            <select
              className="ik-input mt-1"
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
            >
              {crops.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="ik-btn-primary w-full" type="button" onClick={predict}>
              <Sparkles className="h-5 w-5" />
              Predict
            </button>
          </div>
        </div>

        {result ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-600">
                  Next {result.windowDays} days
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900">
                  {result.cropName}: RWF {result.predictedPriceRwfPerKg}/kg
                </div>
              </div>
              <ConfidencePill confidence={result.confidence} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

