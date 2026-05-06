import { supabase } from './supabase'

// ─── Shape converters ────────────────────────────────────────────────────────
// DB row  →  frontend site object
function rowToSite(row) {
  return {
    id:       row.id,
    name:     row.name,
    slug:     row.slug,
    template: row.template_id,
    status:   row.status,
    visitors: row.visitors ?? 0,
    domain:   row.domain ?? `${row.slug}.weblith.site`,
    favicon:  row.favicon ?? (row.name || 'NS').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase(),
    color:    row.color ?? 'oklch(0.92 0.04 80)',
    edited:   formatRelative(row.updated_at),
    content: {
      title:    row.name,
      tagline:  row.tagline ?? '',
      sections: row.sections ?? [],
    },
  }
}

// Frontend site object  →  DB upsert payload
function siteToRow(site, userId) {
  return {
    user_id:     userId,
    name:        site.name,
    slug:        site.slug,
    template_id: site.template ?? null,
    status:      site.status ?? 'draft',
    domain:      site.domain ?? `${site.slug}.weblith.site`,
    favicon:     site.favicon ?? '',
    color:       site.color ?? 'oklch(0.92 0.04 80)',
    tagline:     site.content?.tagline ?? '',
    sections:    site.content?.sections ?? [],
    visitors:    site.visitors ?? 0,
  }
}

function formatRelative(iso) {
  if (!iso) return 'just now'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}

// ─── Sites ───────────────────────────────────────────────────────────────────
export async function fetchSites() {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToSite)
}

export async function createSite(site, userId) {
  const row = siteToRow(site, userId)
  const { data, error } = await supabase
    .from('sites')
    .insert(row)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error(`The URL "${site.slug}" is already taken. Choose a different one.`)
    throw error
  }
  await logActivity(userId, data.id, 'created_site', { name: site.name })
  return rowToSite(data)
}

export async function updateSite(site, userId) {
  const { user_id, ...fields } = siteToRow(site, userId)
  const { data, error } = await supabase
    .from('sites')
    .update(fields)
    .eq('id', site.id)
    .select()
    .single()
  if (error) throw error
  return rowToSite(data)
}

export async function deleteSite(siteId) {
  const { error } = await supabase.from('sites').delete().eq('id', siteId)
  if (error) throw error
}

export async function publishSite(siteId, userId) {
  const { data, error } = await supabase
    .from('sites')
    .update({ status: 'published' })
    .eq('id', siteId)
    .select()
    .single()
  if (error) throw error
  await logActivity(userId, siteId, 'published_site', {})
  return rowToSite(data)
}

// ─── Profiles ────────────────────────────────────────────────────────────────
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data ?? null
}

export async function upsertProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Site versions ───────────────────────────────────────────────────────────
export async function saveVersion(site, userId, note = '') {
  const { error } = await supabase
    .from('site_versions')
    .insert({
      site_id:  site.id,
      user_id:  userId,
      snapshot: siteToRow(site, userId),
      note:     note || `Auto-saved`,
    })
  if (error) throw error
}

export async function fetchVersions(siteId) {
  const { data, error } = await supabase
    .from('site_versions')
    .select('id, note, created_at')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data ?? []
}

export async function restoreVersion(versionId, userId) {
  const { data: ver, error: ve } = await supabase
    .from('site_versions')
    .select('snapshot, site_id')
    .eq('id', versionId)
    .single()
  if (ve) throw ve
  const { data, error } = await supabase
    .from('sites')
    .update(ver.snapshot)
    .eq('id', ver.site_id)
    .select()
    .single()
  if (error) throw error
  await logActivity(userId, ver.site_id, 'restored_version', { version_id: versionId })
  return rowToSite(data)
}

// ─── Activity ────────────────────────────────────────────────────────────────
export async function logActivity(userId, siteId, action, meta = {}) {
  const { error } = await supabase
    .from('activity')
    .insert({ user_id: userId, site_id: siteId ?? null, action, meta })
  if (error) console.warn('Activity log error:', error.message)
}

export async function fetchActivity(limit = 20) {
  const { data, error } = await supabase
    .from('activity')
    .select('id, action, meta, created_at, sites(name)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map(r => ({
    id:     r.id,
    action: r.action,
    meta:   r.meta,
    on:     r.sites?.name ?? null,
    when:   formatRelative(r.created_at),
  }))
}
