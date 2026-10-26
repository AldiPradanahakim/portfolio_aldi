import { useState } from 'react';
import type { Category, Feature, Metric, Project } from '../../content/types';
import { Badge, Btn, EditorProps, Field, LField, ListEditor, Select, TextInput, Toggle } from '../ui';
import { slugError, slugify } from '../validate';

const STATUS: { value: Project['status']; label: string }[] = [
  { value: 'shipped', label: 'Rilis (shipped)' },
  { value: 'in-development', label: 'Pengembangan (in-development)' },
];

function uniqueSlug(projects: Project[], base = 'proyek-baru'): string {
  if (!projects.some((project) => project.slug === base)) return base;
  let n = 2;
  while (projects.some((project) => project.slug === `${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function ProjectsEditor({ draft, update }: EditorProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const [freshSlug, setFreshSlug] = useState(false);
  const projects = draft.projects;
  const categories = draft.categories;

  function setProjects(next: Project[]) {
    update((content) => ({ ...content, projects: next }));
  }

  function patchProject(index: number, patch: Partial<Project>) {
    setProjects(projects.map((project, i) => (i === index ? { ...project, ...patch } : project)));
  }

  function move(from: number, to: number) {
    update((content) => {
      const next = [...content.projects];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...content, projects: next.map((project, index) => ({ ...project, order: index })) };
    });
  }

  function addProject() {
    const project: Project = {
      slug: uniqueSlug(projects),
      name: 'Proyek baru',
      category: categories[0]?.id ?? 'web-app',
      year: String(new Date().getFullYear()),
      role: { id: '', en: '' },
      tagline: { id: '', en: '' },
      summary: { id: '', en: '' },
      problem: { id: '', en: '' },
      solution: { id: '', en: '' },
      features: [],
      metrics: [],
      stack: [],
      cover: null,
      gallery: [],
      links: {},
      status: 'in-development',
      featured: false,
      order: projects.length,
    };
    update((content) => ({ ...content, projects: [...content.projects, project] }));
    setFreshSlug(true);
    setEditing(projects.length);
  }

  function duplicateProject(index: number) {
    update((content) => {
      const source = content.projects[index];
      const copy: Project = {
        ...source,
        slug: uniqueSlug(content.projects, `${source.slug}-salinan`),
        name: `${source.name} (salinan)`,
        order: content.projects.length,
      };
      return { ...content, projects: [...content.projects, copy] };
    });
  }

  function removeProject(index: number) {
    const project = projects[index];
    if (!window.confirm(`Hapus proyek "${project.name}"?`)) return;
    setProjects(projects.filter((_, i) => i !== index));
    setEditing(null);
  }

  if (editing !== null && projects[editing]) {
    return (
      <ProjectForm
        key={projects[editing].slug}
        project={projects[editing]}
        index={editing}
        projects={projects}
        categories={categories}
        isNew={freshSlug}
        onPatch={(patch) => patchProject(editing, patch)}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project, index) => {
        const categoryLabel = categories.find((category) => category.id === project.category)?.label.id ?? project.category;
        return (
          <div key={project.slug} className="flex items-center gap-3 rounded-xl border border-ink-800 bg-ink-900 p-3">
            <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-ink-800 bg-ink-850">
              {project.cover ? (
                <img src={project.cover} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center font-mono text-[10px] text-chalk-faint">-</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-small font-medium text-chalk">{project.name}</span>
                {project.featured ? <Badge tone="accent">Unggulan</Badge> : null}
                <Badge tone={project.status === 'shipped' ? 'ok' : 'neutral'}>
                  {project.status === 'shipped' ? 'Rilis' : 'Pengembangan'}
                </Badge>
              </div>
              <p className="truncate text-small text-chalk-muted">
                {categoryLabel} · {project.year}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Btn onClick={() => move(index, index - 1)} disabled={index === 0} ariaLabel="Naik">
                ↑
              </Btn>
              <Btn onClick={() => move(index, index + 1)} disabled={index === projects.length - 1} ariaLabel="Turun">
                ↓
              </Btn>
              <Btn onClick={() => { setFreshSlug(false); setEditing(index); }}>Edit</Btn>
              <Btn onClick={() => duplicateProject(index)}>Duplikat</Btn>
              <Btn onClick={() => removeProject(index)} variant="danger">
                Hapus
              </Btn>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addProject}
        className="w-full rounded-xl border border-dashed border-ink-700 py-3 text-small text-chalk-muted transition hover:border-accent hover:text-accent"
      >
        Tambah proyek
      </button>
    </div>
  );
}

interface ProjectFormProps {
  project: Project;
  index: number;
  projects: Project[];
  categories: Category[];
  isNew: boolean;
  onPatch: (patch: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectForm({ project, index, projects, categories, isNew, onPatch, onCancel }: ProjectFormProps) {
  const [autoSlug, setAutoSlug] = useState(isNew);

  function onName(value: string) {
    const patch: Partial<Project> = { name: value };
    if (autoSlug) patch.slug = slugify(value);
    onPatch(patch);
  }

  function replaceFeature(idx: number, feature: Feature) {
    onPatch({ features: project.features.map((item, i) => (i === idx ? feature : item)) });
  }

  function replaceMetric(idx: number, metric: Metric) {
    onPatch({ metrics: project.metrics.map((item, i) => (i === idx ? metric : item)) });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h3 font-medium text-chalk">{project.name || 'Proyek baru'}</h2>
        <Btn onClick={onCancel}>Kembali</Btn>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nama" error={!project.name.trim() ? 'Nama wajib diisi.' : undefined}>
          <TextInput value={project.name} onChange={onName} />
        </Field>
        <Field
          label="Slug"
          error={slugError(projects, project.slug, index)}
          hint={autoSlug ? 'Slug dibuat otomatis dari nama; ketik untuk menimpa.' : undefined}
        >
          <TextInput
            value={project.slug}
            onChange={(value) => {
              setAutoSlug(false);
              onPatch({ slug: value });
            }}
            mono
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Kategori">
          <Select
            value={project.category}
            onChange={(value) => onPatch({ category: value })}
            options={categories.map((category) => ({ value: category.id, label: category.id }))}
          />
        </Field>
        <Field label="Tahun">
          <TextInput value={project.year} onChange={(value) => onPatch({ year: value })} mono />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Status">
          <Select value={project.status} onChange={(value) => onPatch({ status: value })} options={STATUS} />
        </Field>
        <Field label="Unggulan">
          <div className="flex h-9 items-center gap-3">
            <Toggle checked={project.featured} onChange={(value) => onPatch({ featured: value })} label="Tandai unggulan" />
            <span className="text-small text-chalk-muted">{project.featured ? 'Ditampilkan unggulan' : 'Tidak unggulan'}</span>
          </div>
        </Field>
      </div>

      <LField label="Peran" value={project.role} onChange={(value) => onPatch({ role: value })} multiline />
      <LField label="Tagline" value={project.tagline} onChange={(value) => onPatch({ tagline: value })} multiline />
      <LField label="Ringkasan" value={project.summary} onChange={(value) => onPatch({ summary: value })} multiline />
      <LField label="Masalah" value={project.problem} onChange={(value) => onPatch({ problem: value })} multiline />
      <LField label="Solusi" value={project.solution} onChange={(value) => onPatch({ solution: value })} multiline />

      <Field label="Cover">
        <div className="flex items-center gap-3">
          <Toggle
            checked={project.cover !== null}
            onChange={(on) => onPatch({ cover: on ? '' : null })}
            label="Pakai cover"
          />
          <span className="text-small text-chalk-muted">{project.cover !== null ? 'Tanpa gambar' : 'Dengan gambar'}</span>
        </div>
        {project.cover !== null ? (
          <div className="mt-2 space-y-2">
            <TextInput
              value={project.cover}
              onChange={(value) => onPatch({ cover: value })}
              mono
              placeholder="/images/projects/af-gps-tracker.webp"
            />
            {project.cover ? (
              <img src={project.cover} alt="" className="h-28 w-44 rounded-xl border border-ink-800 object-cover" />
            ) : null}
          </div>
        ) : null}
      </Field>

      <Field label="Galeri" hint="URL gambar; kosongkan jika tidak ada.">
        <ListEditor<string>
          items={project.gallery}
          onChange={(items) => onPatch({ gallery: items })}
          create={() => ''}
          addLabel="Tambah gambar galeri"
          emptyLabel="Belum ada galeri."
          render={(url, idx) => (
            <TextInput
              value={url}
              onChange={(value) => onPatch({ gallery: project.gallery.map((g, i) => (i === idx ? value : g)) })}
              mono
            />
          )}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Tautan demo">
          <TextInput
            value={project.links.demo ?? ''}
            onChange={(value) => onPatch({ links: { ...project.links, demo: value } })}
            mono
          />
        </Field>
        <Field label="Tautan repo">
          <TextInput
            value={project.links.repo ?? ''}
            onChange={(value) => onPatch({ links: { ...project.links, repo: value } })}
            mono
          />
        </Field>
      </div>

      <Field label="Teknologi (stack)" hint="Pisahkan dengan koma.">
        <TextInput
          value={project.stack.join(', ')}
          onChange={(value) => onPatch({ stack: value.split(',').map((item) => item.trim()).filter(Boolean) })}
        />
        {project.stack.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        ) : null}
      </Field>

      <Field label="Fitur">
        <ListEditor<Feature>
          items={project.features}
          onChange={(items) => onPatch({ features: items })}
          create={() => ({ title: { id: '', en: '' }, detail: { id: '', en: '' } })}
          addLabel="Tambah fitur"
          emptyLabel="Belum ada fitur."
          render={(feature, idx) => (
            <div className="space-y-2">
              <LField label="Judul" value={feature.title} onChange={(value) => replaceFeature(idx, { ...feature, title: value })} />
              <LField label="Detail" value={feature.detail} onChange={(value) => replaceFeature(idx, { ...feature, detail: value })} multiline />
            </div>
          )}
        />
      </Field>

      <Field label="Metrik">
        <ListEditor<Metric>
          items={project.metrics}
          onChange={(items) => onPatch({ metrics: items })}
          create={() => ({ value: '', label: { id: '', en: '' } })}
          addLabel="Tambah metrik"
          emptyLabel="Belum ada metrik."
          render={(metric, idx) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Field label="Nilai">
                <TextInput value={metric.value} onChange={(value) => replaceMetric(idx, { ...metric, value })} mono />
              </Field>
              <div className="sm:col-span-2">
                <LField label="Label" value={metric.label} onChange={(value) => replaceMetric(idx, { ...metric, label: value })} />
              </div>
            </div>
          )}
        />
      </Field>
    </div>
  );
}