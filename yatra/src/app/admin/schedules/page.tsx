'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  Clock,
  Bus,
  MapPin,
  Pencil,
  Trash2,
  X,
  Loader2,
} from 'lucide-react'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface RouteOption {
  _id: string
  locations: { _id: string; name: string; city: string }[]
  distanceInKm: number
}

interface VehicleOption {
  _id: string
  vehicleNumber: string
  brand?: string
  model?: string
  vehicleType: string
}

interface ScheduleItem {
  _id: string
  routeId: RouteOption
  vehicleId: VehicleOption
  departureTime: string
  estimatedDurationInMinutes: number
  daysOfWeek: number[]
  isActive: boolean
  validFrom?: string
  validTill?: string
}

interface FormState {
  _id?: string
  routeId: string
  vehicleId: string
  departureTime: string
  estimatedDurationInMinutes: string
  daysOfWeek: number[]
  validFrom: string
  validTill: string
}

const emptyForm: FormState = {
  routeId: '',
  vehicleId: '',
  departureTime: '',
  estimatedDurationInMinutes: '',
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  validFrom: '',
  validTill: '',
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [schedulesRes, routesRes, vehiclesRes] = await Promise.all([
        axios.get('/api/admin/schedules'),
        axios.get('/api/admin/routes'),
        axios.get('/api/admin/vehicle?limit=200'),
      ])

      if (schedulesRes.data.success) setSchedules(schedulesRes.data.schedules)
      if (routesRes.data.success) setRoutes(routesRes.data.routes)

      const vehicleList = vehiclesRes.data.vehicles ?? vehiclesRes.data.data ?? []
      setVehicles(vehicleList)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const openCreateForm = () => {
    setForm(emptyForm)
    setFormError('')
    setFormOpen(true)
  }

  const openEditForm = (s: ScheduleItem) => {
    setForm({
      _id: s._id,
      routeId: s.routeId._id,
      vehicleId: s.vehicleId._id,
      departureTime: s.departureTime,
      estimatedDurationInMinutes: String(s.estimatedDurationInMinutes ?? ''),
      daysOfWeek: s.daysOfWeek,
      validFrom: s.validFrom ? s.validFrom.slice(0, 10) : '',
      validTill: s.validTill ? s.validTill.slice(0, 10) : '',
    })
    setFormError('')
    setFormOpen(true)
  }

  const toggleDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }))
  }

  const handleSave = async () => {
    setFormError('')

    if (!form.routeId || !form.vehicleId || !form.departureTime) {
      setFormError('Route, vehicle and departure time are required')
      return
    }
    if (form.daysOfWeek.length === 0) {
      setFormError('Select at least one day of the week')
      return
    }

    setSaving(true)
    try {
      const payload = {
        routeId: form.routeId,
        vehicleId: form.vehicleId,
        departureTime: form.departureTime,
        estimatedDurationInMinutes: form.estimatedDurationInMinutes
          ? Number(form.estimatedDurationInMinutes)
          : undefined,
        daysOfWeek: form.daysOfWeek,
        validFrom: form.validFrom || undefined,
        validTill: form.validTill || undefined,
      }

      if (form._id) {
        await axios.patch(`/api/admin/schedules/${form._id}`, payload)
      } else {
        await axios.post('/api/admin/schedules', payload)
      }

      setFormOpen(false)
      fetchAll()
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Failed to save schedule')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (s: ScheduleItem) => {
    try {
      await axios.patch(`/api/admin/schedules/${s._id}`, { isActive: !s.isActive })
      fetchAll()
    } catch (err) {
      console.log('Failed to toggle schedule:', err)
    }
  }

  const handleDeactivate = async (s: ScheduleItem) => {
    if (!confirm(`Deactivate this schedule (${s.vehicleId?.vehicleNumber})? It will stop generating new trips, but trips already created stay as-is.`)) return
    try {
      await axios.delete(`/api/admin/schedules/${s._id}`)
      fetchAll()
    } catch (err) {
      console.log('Failed to deactivate schedule:', err)
    }
  }

  const routeLabel = (route: RouteOption) => {
    if (!route?.locations?.length) return '—'
    const first = route.locations[0]?.name ?? route.locations[0]?.city
    const last = route.locations[route.locations.length - 1]?.name ?? route.locations[route.locations.length - 1]?.city
    return `${first} → ${last}`
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-6 pr-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bus Schedules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control which days and times each vehicle runs. Trips for upcoming dates are created automatically from these schedules.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary-hover transition-colors rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          Add Schedule
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={22} className="animate-spin text-muted-foreground" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Clock size={28} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No schedules yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add one to start generating daily trips automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => (
            <div
              key={s._id}
              className={`rounded-2xl border p-5 bg-card ${s.isActive ? 'border-border' : 'border-border opacity-60'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPin size={15} className="text-primary shrink-0" />
                    {routeLabel(s.routeId)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bus size={13} /> {s.vehicleId?.vehicleNumber ?? '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {s.departureTime}
                      {s.estimatedDurationInMinutes ? ` (${s.estimatedDurationInMinutes} min)` : ''}
                    </span>
                    {!s.isActive && (
                      <span className="text-warning font-medium">Inactive</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {DAY_LABELS.map((label, idx) => (
                      <span
                        key={label}
                        className={`text-[11px] px-2 py-1 rounded-md font-medium ${
                          s.daysOfWeek.includes(idx)
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(s)}
                    className="text-xs font-medium px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                  >
                    {s.isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={() => openEditForm(s)}
                    className="p-2 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer text-muted-foreground"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDeactivate(s)}
                    className="p-2 rounded-lg border border-destructive/30 hover:bg-destructive/10 transition-colors cursor-pointer text-destructive"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  {form._id ? 'Edit Schedule' : 'Add Schedule'}
                </h2>
                <button onClick={() => setFormOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Route</label>
                  <select
                    value={form.routeId}
                    onChange={(e) => setForm((p) => ({ ...p, routeId: e.target.value }))}
                    disabled={!!form._id}
                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  >
                    <option value="">Select a route</option>
                    {routes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {routeLabel(r)} ({r.distanceInKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Vehicle</label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => setForm((p) => ({ ...p, vehicleId: e.target.value }))}
                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.vehicleNumber} — {v.brand ?? ''} {v.model ?? v.vehicleType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Departure time</label>
                    <input
                      type="time"
                      value={form.departureTime}
                      onChange={(e) => setForm((p) => ({ ...p, departureTime: e.target.value }))}
                      className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Duration (min)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 240"
                      value={form.estimatedDurationInMinutes}
                      onChange={(e) => setForm((p) => ({ ...p, estimatedDurationInMinutes: e.target.value }))}
                      className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Runs on</label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {DAY_LABELS.map((label, idx) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${
                          form.daysOfWeek.includes(idx)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-muted-foreground border-border hover:bg-accent'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Valid from (optional)</label>
                    <input
                      type="date"
                      value={form.validFrom}
                      onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))}
                      className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Valid till (optional)</label>
                    <input
                      type="date"
                      value={form.validTill}
                      onChange={(e) => setForm((p) => ({ ...p, validTill: e.target.value }))}
                      className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>

                {formError && <p className="text-destructive text-sm">{formError}</p>}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors rounded-lg py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving…' : form._id ? 'Save changes' : 'Create schedule'}
                </button>

                {form._id && (
                  <p className="text-[11px] text-muted-foreground text-center">
                    Changing the time or vehicle updates all upcoming trips on this schedule that haven't departed yet.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
