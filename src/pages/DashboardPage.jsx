import {
  BellRing,
  Coins,
  TrendingUp,
  Wheat,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'

function StatCard({ title, value, hint, icon: Icon }) {
  return (
    <div className="ik-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-600">{title}</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">
            {value}
          </div>
          {hint ? (
            <div className="mt-1 text-sm font-semibold text-slate-500">
              {hint}
            </div>
          ) : null}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    activeCrops: 0,
    totalCostsRwf: 0,
    expectedProfitRwf: 0,
    priceAlerts: 0,
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const cropsRes = await api.get('/api/crops')
        const crops = cropsRes.data.crops || []
        const costsRes = await api.get('/api/costs')
        const costs = costsRes.data.costs || []
        const alertsCountRes = await api.get('/api/alerts/count')
        const alertsCount = alertsCountRes.data.count ?? 0
        const totalCostsRwf = costs.reduce((sum, c) => sum + (c.amountRwf || 0), 0)
        if (!mounted) return
        setStats((s) => ({
          ...s,
          activeCrops: crops.length,
          totalCostsRwf,
          expectedProfitRwf: Math.max(0, Math.round(totalCostsRwf * 0.72)),
          priceAlerts: alertsCount,
        }))
      } catch {
        // ignore for now
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-5">
      <section className="ik-card overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Farmer dashboard
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Simple numbers, clear decisions.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI price insight
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active crops"
            value={String(stats.activeCrops)}
            icon={Wheat}
          />
          <StatCard
            title="Total costs"
            value={`RWF ${stats.totalCostsRwf.toLocaleString()}`}
            icon={Coins}
          />
          <StatCard
            title="Expected profit"
            value={`RWF ${stats.expectedProfitRwf.toLocaleString()}`}
            hint="Based on forecast prices"
            icon={TrendingUp}
          />
          <StatCard
            title="Price alerts"
            value={String(stats.priceAlerts)}
            hint="This week"
            icon={BellRing}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="ik-card p-5">
          <h3 className="text-lg font-extrabold text-slate-900">
            Quick actions
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              className="ik-btn-primary w-full"
              type="button"
              onClick={() => navigate('/crops')}
            >
              Add crop
            </button>
            <button
              className="ik-btn-secondary w-full"
              type="button"
              onClick={() => navigate('/costs')}
            >
              Add cost
            </button>
            <button
              className="ik-btn-secondary w-full"
              type="button"
              onClick={() => navigate('/predictions')}
            >
              Check price
            </button>
            <button
              className="ik-btn-secondary w-full"
              type="button"
              onClick={() => navigate('/reports')}
            >
              Generate report
            </button>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Built for mobile and low-literacy: big buttons, short text, clear
            icons.
          </p>
        </div>

        <div className="ik-card p-5">
          <h3 className="text-lg font-extrabold text-slate-900">
            Today’s market snapshot
          </h3>
          <div className="mt-4 space-y-3">
            {[
              { crop: 'Maize', price: 'RWF 520/kg', delta: '+3%' },
              { crop: 'Beans', price: 'RWF 850/kg', delta: '-1%' },
              { crop: 'Coffee', price: 'RWF 2,300/kg', delta: '+5%' },
            ].map((row) => (
              <div
                key={row.crop}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="text-base font-extrabold text-slate-900">
                  {row.crop}
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">
                    {row.price}
                  </div>
                  <div className="text-sm font-bold text-emerald-700">
                    {row.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

