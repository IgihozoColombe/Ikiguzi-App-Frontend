import { FileDown, FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { api } from '../lib/api.js'

export function ReportsPage() {
  const [loading, setLoading] = useState(null)

  async function download(format) {
    setLoading(format)
    try {
      const res = await api.get('/api/reports/export', {
        params: { format },
        responseType: 'blob',
      })

      const blob = new Blob([res.data], {
        type:
          format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ikiguzi-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Reports</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Export your costs and profits as PDF or Excel.
        </p>
      </div>

      <div className="ik-card p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-700" />
              <div className="text-base font-extrabold text-slate-900">
                PDF report
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Print-friendly summary for farmer groups & cooperatives.
            </p>
            <button
              className="ik-btn-primary mt-3 w-full"
              type="button"
              onClick={() => download('pdf')}
              disabled={loading !== null}
            >
              <FileDown className="h-5 w-5" />
              {loading === 'pdf' ? 'Preparing…' : 'Download PDF'}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-700" />
              <div className="text-base font-extrabold text-slate-900">
                Excel report
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Detailed table for budgeting and auditing.
            </p>
            <button
              className="ik-btn-primary mt-3 w-full"
              type="button"
              onClick={() => download('excel')}
              disabled={loading !== null}
            >
              <FileDown className="h-5 w-5" />
              {loading === 'excel' ? 'Preparing…' : 'Download Excel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

