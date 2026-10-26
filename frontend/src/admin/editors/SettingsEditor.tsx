import type { Category } from '../../content/types';
import { EditorProps, Field, LField, ListEditor, TextInput } from '../ui';

export function SettingsEditor({ draft, update }: EditorProps) {
  const categories = draft.categories;
  const settings = draft.settings;

  function setCategories(items: Category[]) {
    update((content) => ({ ...content, categories: items }));
  }

  function patchCategory(index: number, patch: Partial<Category>) {
    setCategories(categories.map((category, i) => (i === index ? { ...category, ...patch } : category)));
  }

  function setSettings(patch: Partial<typeof settings>) {
    update((content) => ({ ...content, settings: { ...content.settings, ...patch } }));
  }

  return (
    <div className="space-y-6">
      <Field label="Kategori proyek" hint="ID dipakai proyek; ubah hanya bila proyek terkait ikut diubah.">
        <ListEditor<Category>
          items={categories}
          onChange={setCategories}
          create={() => ({ id: 'kategori-baru', label: { id: '', en: '' } })}
          addLabel="Tambah kategori"
          emptyLabel="Belum ada kategori."
          render={(category, index) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Field label="ID">
                <TextInput value={category.id} onChange={(value) => patchCategory(index, { id: value })} mono />
              </Field>
              <div className="sm:col-span-2">
                <LField label="Label" value={category.label} onChange={(value) => patchCategory(index, { label: value })} />
              </div>
            </div>
          )}
        />
      </Field>

      <hr className="border-ink-800" />

      <h3 className="text-small font-medium text-chalk">SEO &amp; situs</h3>
      <LField label="Judul situs" value={settings.title} onChange={(value) => setSettings({ title: value })} />
      <LField label="Deskripsi" value={settings.description} onChange={(value) => setSettings({ description: value })} multiline />
      <LField label="Catatan footer" value={settings.footerNote} onChange={(value) => setSettings({ footerNote: value })} />
    </div>
  );
}