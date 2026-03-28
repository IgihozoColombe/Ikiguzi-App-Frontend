import { useEffect, useState } from 'react'
import { BellRing, Mail, Phone, Plus } from 'lucide-react'
import { api } from '../lib/api.js'

export function AlertsPage() {
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [crops, setCrops] = useState([])
  const [alerts, setAlerts] = useState([])
  const [checkResult, setCheckResult] = useState(null)

  const [form, setForm] = useState({
    cropId: '',
    direction: 'above',
    thresholdRwfPerKg: 0,
    notifySMS: false,
    notifyEmail: true,
  })

  async function loadAll() {
    const [prefRes, cropsRes, alertsRes] = await Promise.all([
      api.get('/api/alerts/preferences'),
      api.get('/api/crops'),
      api.get('/api/alerts'),
    ])

    const pref = prefRes.data
    const items = cropsRes.data.crops || []
    const list = alertsRes.data.alerts || []

    setSmsEnabled(Boolean(pref.smsEnabled))
    setEmailEnabled(Boolean(pref.emailEnabled))
    setCrops(items)
    setAlerts(list)

    setForm((f) => ({
      ...f,
      cropId: f.cropId || items[0]?._id || '',
      notifySMS: Boolean(pref.smsEnabled),
      notifyEmail: Boolean(pref.emailEnabled),
    }))
  }

  useEffect(() => {
    loadAll().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function savePreferences(next) {
    const res = await api.post('/api/alerts/preferences', next)
    setSmsEnabled(Boolean(res.data.smsEnabled))
    setEmailEnabled(Boolean(res.data.emailEnabled))
    setForm((f) => ({
      ...f,
      notifySMS: Boolean(res.data.smsEnabled),
      notifyEmail: Boolean(res.data.emailEnabled),
    }))
    const alertsRes = await api.get('/api/alerts')
    setAlerts(alertsRes.data.alerts || [])
  }

  async function createAlert() {
    if (!form.cropId) return
    const payload = {
      cropId: form.cropId,
      direction: form.direction,
      thresholdRwfPerKg: Number(form.thresholdRwfPerKg || 0),
      windowDays: 14,
      notifySMS: Boolean(form.notifySMS),
      notifyEmail: Boolean(form.notifyEmail),
    }
    await api.post('/api/alerts', payload)
    await loadAll()
  }

  async function checkNow() {
    const res = await api.post('/api/alerts/check')
    setCheckResult(res.data)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Price alerts</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Get notified by SMS or email when prices change.
        </p>
      </div>

      <div className="ik-card p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Phone className="h-5 w-5 text-emerald-700" />
              <div className="text-base font-extrabold">SMS alerts</div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              SMS provider integration is simulated (console logs).
            </p>
            <button
              className="ik-btn-secondary mt-3 w-full"
              type="button"
              onClick={() =>
                savePreferences({ smsEnabled: !smsEnabled, emailEnabled })
              }
            >
              {smsEnabled ? 'SMS enabled' : 'Enable SMS'}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Mail className="h-5 w-5 text-emerald-700" />
              <div className="text-base font-extrabold">Email alerts</div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Email uses SMTP if configured; otherwise it is simulated.
            </p>
            <button
              className="ik-btn-secondary mt-3 w-full"
              type="button"
              onClick={() =>
                savePreferences({ smsEnabled, emailEnabled: !emailEnabled })
              }
            >
              {emailEnabled ? 'Email enabled' : 'Enable email'}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-extrabold text-slate-900">Create alert</h3>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="ik-label">Crop</label>
              <select
                className="ik-input mt-1"
                value={form.cropId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cropId: e.target.value }))
                }
              >
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="ik-label">When price</label>
              <select
                className="ik-input mt-1"
                value={form.direction}
                onChange={(e) =>
                  setForm((f) => ({ ...f, direction: e.target.value }))
                }
              >
                <option value="above">goes above</option>
                <option value="below">goes below</option>
              </select>
            </div>

            <div>
              <label className="ik-label">Threshold (RWF/kg)</label>
              <input
                className="ik-input mt-1"
                type="number"
                min="0"
                step="1"
                value={form.thresholdRwfPerKg}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    thresholdRwfPerKg: e.target.value,
                  }))
                }
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.notifySMS}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        notifySMS: e.target.checked,
                      }))
                    }
                  />
                  SMS
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.notifyEmail}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        notifyEmail: e.target.checked,
                      }))
                    }
                  />
                  Email
                </label>
              </div>
            </div>
          </div>

          <button
            className="ik-btn-primary mt-4 w-full"
            type="button"
            onClick={createAlert}
            disabled={!form.cropId}
          >
            <Plus className="h-5 w-5" />
            Save alert
          </button>

          <button
            className="ik-btn-secondary mt-3 w-full"
            type="button"
            onClick={checkNow}
            disabled={false}
          >
            Check now (send notifications)
          </button>

          {checkResult ? (
            <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-sm font-extrabold text-emerald-900">
                Result
              </div>
              <div className="mt-1 text-sm font-semibold text-emerald-900/90">
                Triggered: {checkResult.triggered} • Checked:{' '}
                {checkResult.checked}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="ik-card p-5">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-emerald-700" />
          <div className="text-lg font-extrabold text-slate-900">Your alerts</div>
        </div>

        {alerts.length === 0 ? (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            No alerts yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-800">
            {alerts.map((a) => (
              <li
                key={a._id}
                className="rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>{a.cropName || 'Crop'}</span>
                  <span>
                    {a.direction} {a.thresholdRwfPerKg} RWF/kg
                  </span>
                </div>
                <div className="mt-1 text-xs font-bold text-slate-600">
                  SMS: {a.notifySMS ? 'Yes' : 'No'} • Email:{' '}
                  {a.notifyEmail ? 'Yes' : 'No'} • Window: {a.windowDays} days
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

