import type { L, Profile } from '../../content/types';
import { EditorProps, Field, LField, ListEditor, Select, TextInput, Toggle } from '../ui';
import { emailError } from '../validate';

const ICONS = ['mail', 'github', 'linkedin', 'instagram', 'whatsapp'] as const;

const ICON_LABELS: Record<(typeof ICONS)[number], string> = {
  mail: 'Email',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
};

export function ProfileEditor({ draft, update }: EditorProps) {
  const profile = draft.profile;

  function set(patch: Partial<Profile>) {
    update((content) => ({ ...content, profile: { ...content.profile, ...patch } }));
  }

  function setBio(index: number, value: L) {
    set({ bio: profile.bio.map((item, i) => (i === index ? value : item)) });
  }

  function setSocial(index: number, value: Profile['socials'][number]) {
    set({ socials: profile.socials.map((item, i) => (i === index ? value : item)) });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nama">
          <TextInput value={profile.name} onChange={(value) => set({ name: value })} />
        </Field>
        <Field label="Inisial">
          <TextInput value={profile.initials} onChange={(value) => set({ initials: value })} mono />
        </Field>
      </div>

      <Field label="Email" error={emailError(profile.email)}>
        <TextInput value={profile.email} onChange={(value) => set({ email: value })} mono />
      </Field>

      <LField label="Peran" value={profile.role} onChange={(value) => set({ role: value })} />
      <LField label="Tagline" value={profile.tagline} onChange={(value) => set({ tagline: value })} multiline />
      <LField label="Lokasi" value={profile.location} onChange={(value) => set({ location: value })} />
      <LField label="Ketersediaan" value={profile.availability} onChange={(value) => set({ availability: value })} />
      <LField label="Waktu respons" value={profile.responseTime} onChange={(value) => set({ responseTime: value })} />

      <Field label="Foto profil">
        <div className="flex items-center gap-3">
          <Toggle
            checked={profile.photo !== null}
            onChange={(on) => set({ photo: on ? profile.photo ?? '' : null })}
            label="Tampilkan foto"
          />
          <span className="text-small text-chalk-muted">Tampilkan foto (URL)</span>
        </div>
        {profile.photo !== null ? (
          <div className="mt-2 space-y-2">
            <TextInput
              value={profile.photo}
              onChange={(value) => set({ photo: value })}
              mono
              placeholder="/images/aldi-pixar.webp"
            />
            {profile.photo ? (
              <img src={profile.photo} alt="" className="h-20 w-20 rounded-xl border border-ink-800 object-cover" />
            ) : null}
          </div>
        ) : null}
      </Field>

      <Field label="Bio" hint="Satu paragraf per butir.">
        <ListEditor<L>
          items={profile.bio}
          onChange={(items) => set({ bio: items })}
          create={() => ({ id: '', en: '' })}
          addLabel="Tambah paragraf"
          emptyLabel="Belum ada paragraf bio."
          render={(item, index) => (
            <LField label={`Paragraf ${index + 1}`} value={item} onChange={(value) => setBio(index, value)} multiline />
          )}
        />
      </Field>

      <Field label="Sosial">
        <ListEditor<Profile['socials'][number]>
          items={profile.socials}
          onChange={(items) => set({ socials: items })}
          create={() => ({ label: '', url: '', icon: 'github' })}
          addLabel="Tambah tautan sosial"
          emptyLabel="Belum ada tautan sosial."
          render={(social, index) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Field label="Label">
                <TextInput value={social.label} onChange={(value) => setSocial(index, { ...social, label: value })} />
              </Field>
              <Field label="URL">
                <TextInput value={social.url} onChange={(value) => setSocial(index, { ...social, url: value })} mono />
              </Field>
              <Field label="Ikon">
                <Select
                  value={social.icon}
                  onChange={(value) => setSocial(index, { ...social, icon: value })}
                  options={ICONS.map((icon) => ({ value: icon, label: ICON_LABELS[icon] }))}
                />
              </Field>
            </div>
          )}
        />
      </Field>
    </div>
  );
}