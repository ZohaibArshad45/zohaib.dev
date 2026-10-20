/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzsvmxdeyrxiddbwjctt.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_p2aqeeQBWR_oYMOKNAAg0Q_zzawtR5R';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.join(__dirname, '..', 'data');

async function syncAll() {
  console.log('--- Starting Sync to Supabase Database ---');

  // 1. Categories
  try {
    const rawCategories = fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8');
    const categories = JSON.parse(rawCategories);
    const categoryRows = categories.map((c) => ({ name: typeof c === 'string' ? c : c.name }));
    const { error: catErr } = await supabase.from('categories').upsert(categoryRows, { onConflict: 'name' });
    console.log('Categories synced:', catErr ? catErr.message : `${categoryRows.length} rows`);
  } catch (e) {
    console.warn('Categories sync skipped/error:', e.message);
  }

  // 2. Settings
  try {
    const rawSettings = fs.readFileSync(path.join(DATA_DIR, 'settings.json'), 'utf8');
    const settings = JSON.parse(rawSettings);
    const { error: setErr } = await supabase.from('site_settings').upsert([
      { key: 'portfolio_settings', value: JSON.stringify(settings), updated_at: new Date().toISOString() },
      { key: 'admin_password', value: '786109Sz9@', updated_at: new Date().toISOString() }
    ], { onConflict: 'key' });
    console.log('Site settings synced:', setErr ? setErr.message : 'SUCCESS');
  } catch (e) {
    console.warn('Settings sync skipped/error:', e.message);
  }

  // 3. Projects
  try {
    const rawProjects = fs.readFileSync(path.join(DATA_DIR, 'projects.json'), 'utf8');
    const projects = JSON.parse(rawProjects);
    const projectRows = projects.map((p) => ({
      slug: p.slug,
      number: p.number || '01',
      title: p.title,
      short_title: p.shortTitle || p.title,
      status: p.status || '',
      categories: Array.isArray(p.categories) ? p.categories : [],
      headline: p.headline || '',
      subhead: p.subhead || '',
      description: p.description || '',
      outcome: p.outcome || '',
      tags: Array.isArray(p.tags) ? p.tags : [],
      images: Array.isArray(p.images) ? p.images : [],
      preview_type: p.previewType || 'dashboard',
      client: p.client || '',
      role: p.role || '',
      timeline: p.timeline || '',
      deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
      problem: p.problem || '',
      solution: p.solution || '',
      architecture_highlights: Array.isArray(p.architectureHighlights) ? p.architectureHighlights : [],
      metrics: Array.isArray(p.metrics) ? p.metrics : [],
      demo_url: p.demoUrl || null,
      github_url: p.githubUrl || null,
      updated_at: new Date().toISOString(),
    }));

    const { error: projErr } = await supabase.from('projects').upsert(projectRows, { onConflict: 'slug' });
    console.log('Projects synced:', projErr ? projErr.message : `${projectRows.length} projects`);
  } catch (e) {
    console.warn('Projects sync error:', e.message);
  }

  // 4. Services
  try {
    const rawServices = fs.readFileSync(path.join(DATA_DIR, 'services.json'), 'utf8');
    const services = JSON.parse(rawServices);
    const serviceRows = services.map((s) => ({
      id: s.id,
      slug: s.slug,
      number: s.number,
      category: s.category,
      title: s.title,
      description: s.description,
      items: Array.isArray(s.items) ? s.items : [],
      best_for: s.bestFor || '',
      stack: Array.isArray(s.stack) ? s.stack : (typeof s.stack === 'string' ? s.stack.split('/').map(x => x.trim()).filter(Boolean) : []),
      turnaround: s.timeline || null,
      starting_price: s.startingPrice || null,
      cta_text: s.cta || "Let's Talk ↗",
      href: s.href || '/contact',
      updated_at: new Date().toISOString(),
    }));

    const { error: srvErr } = await supabase.from('services').upsert(serviceRows, { onConflict: 'slug' });
    console.log('Services synced:', srvErr ? srvErr.message : `${serviceRows.length} services`);
  } catch (e) {
    console.warn('Services sync error:', e.message);
  }

  // 5. Resources
  try {
    const rawResources = fs.readFileSync(path.join(DATA_DIR, 'resources.json'), 'utf8');
    const resources = JSON.parse(rawResources);
    if (Array.isArray(resources) && resources.length > 0) {
      const resourceRows = resources.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        description: r.description,
        category: r.category,
        type: r.type,
        file_url: r.fileUrl,
        file_size: r.fileSize || null,
        cover_image: r.coverImage || null,
        tags: Array.isArray(r.tags) ? r.tags : [],
        downloads_count: r.downloadsCount || 0,
        featured: Boolean(r.featured),
        created_at: r.createdAt || new Date().toISOString(),
        updated_at: r.updatedAt || new Date().toISOString(),
        external_link: r.externalLink || null,
      }));

      const { error: resErr } = await supabase.from('resources').upsert(resourceRows, { onConflict: 'slug' });
      console.log('Resources synced:', resErr ? resErr.message : `${resourceRows.length} resources`);
    } else {
      console.log('Resources: 0 in file, skipping or table already empty.');
    }
  } catch (e) {
    console.warn('Resources sync error:', e.message);
  }

  console.log('--- Database Sync Complete ---');
}

syncAll();
