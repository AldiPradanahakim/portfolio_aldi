import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { DataSource } from '../data/adapters/types';
import { exportJson, parseImport, useContentDraft } from '../data/store';
import { validateContent } from './validate';
import { Badge, Btn } from './ui';
import { ProfileEditor } from './editors/ProfileEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { JourneyEditor } from './editors/JourneyEditor';
import { SettingsEditor } from './editors/SettingsEditor';

const SECTIONS = [
  { id: 'profile', label: 'Profil' },
  { id: 'projects', label: 'Proyek' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'journey', label: 'Perjalanan' },
  { id: 'settings', label: 'Kategori & SEO' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

interface DashboardProps {
  email: string;
  source: DataSource;
  signOut: () => Promise<void>;
}

export function Dashboard({ email, source, signOut }: DashboardProps) {
  const { draft, update, dirty, saving, save, discard } = useContentDraft();
  const [section, setSection] = useState<SectionId>('profile');
  const [toast, setToast] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(tone: 'ok' | 'error', text: string) {
    setToast({ tone, text });
  }

  async function handleSave() {
    const issues = validateContent(draft);
    if (issues.length > 0) {
      const more = issues.length > 1 ? ` (dan ${issues.length - 1} lainnya)` : '';
      notify('error', `Belum bisa disimpan — ${issues[0]}${more}`);
      return;
    }
    try {
      await save();
      notify('ok', 'Tersimpan.');
    } catch (cause) {
      notify('error', cause instanceof Error ? cause.message : String(cause));
    }
  }

  function handleDiscard() {
    discard();
    notify('ok', 'Editan dibuang.');
  }

  function handleExport() {
    exportJson(draft);
    notify('ok', 'Berkas JSON diunduh.');
  }

  function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    void file.text().then((text) => {
      try {
        update(() => parseImport(text));
        notify('ok', 'Berkas dimuat; klik Simpan untuk menerapkan.');
      } catch (cause) {
        notify('error', cause instanceof Error ? cause.message : String(cause));
      }
    });
  }

  return (
    <div className="min-h-screen bg-ink-950 text-chalk">
      <header className="sticky top-0 z-20 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-h3 font-medium text-chalk">Panel CMS</span>
            <Badge>{source}</Badge>
            {dirty ? <Badge tone="accent">belum disimpan</Badge> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-ink-800 px-3 py-2 text-small text-chalk transition hover:border-ink-700"
            >
              Lihat situs
            </a>
            <Btn onClick={handleDiscard} disabled={!dirty || saving}>
              Batal
            </Btn>
            <Btn onClick={handleExport}>Ekspor</Btn>
            <Btn onClick={() => fileRef.current?.click()}>Impor</Btn>
            <Btn onClick={handleSave} variant="primary" disabled={!dirty || saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Btn>
            <Btn onClick={() => void signOut()} variant="danger">
              Keluar
            </Btn>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="flex shrink-0 gap-1 overflow-x-auto lg:w-48 lg:flex-col">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-left text-small transition ${
                section === item.id ? 'bg-ink-850 text-chalk' : 'text-chalk-muted hover:text-chalk'
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <main className="min-w-0 flex-1">
          {section === 'profile' ? <ProfileEditor draft={draft} update={update} /> : null}
          {section === 'projects' ? <ProjectsEditor draft={draft} update={update} /> : null}
          {section === 'skills' ? <SkillsEditor draft={draft} update={update} /> : null}
          {section === 'journey' ? <JourneyEditor draft={draft} update={update} /> : null}
          {section === 'settings' ? <SettingsEditor draft={draft} update={update} /> : null}
        </main>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />

      {toast ? (
        <div
          className={`fixed bottom-4 right-4 z-30 rounded-xl border px-4 py-3 text-small shadow-lg ${
            toast.tone === 'ok' ? 'border-accent bg-ink-900 text-chalk' : 'border-danger-border bg-ink-900 text-danger'
          }`}
        >
          {toast.text}
        </div>
      ) : null}

      <footer className="border-t border-ink-800 px-6 py-3 text-small text-chalk-faint">
        Masuk sebagai {email}
      </footer>
    </div>
  );
}