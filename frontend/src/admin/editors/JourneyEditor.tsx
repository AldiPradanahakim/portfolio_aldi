import type { Milestone } from '../../content/types';
import { EditorProps, Field, LField, ListEditor, Select, TextInput } from '../ui';

const KINDS: { value: Milestone['kind']; label: string }[] = [
  { value: 'education', label: 'Pendidikan' },
  { value: 'project', label: 'Proyek' },
  { value: 'work', label: 'Pekerjaan' },
];

export function JourneyEditor({ draft, update }: EditorProps) {
  const journey = draft.journey;

  function setJourney(items: Milestone[]) {
    update((content) => ({ ...content, journey: items }));
  }

  function patch(index: number, patch: Partial<Milestone>) {
    setJourney(journey.map((milestone, i) => (i === index ? { ...milestone, ...patch } : milestone)));
  }

  return (
    <ListEditor<Milestone>
      items={journey}
      onChange={setJourney}
      create={() => ({ period: '', kind: 'project', title: { id: '', en: '' }, org: { id: '', en: '' }, detail: { id: '', en: '' } })}
      addLabel="Tambah tonggak"
      emptyLabel="Belum ada tonggak."
      render={(milestone, index) => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Periode">
              <TextInput value={milestone.period} onChange={(value) => patch(index, { period: value })} mono />
            </Field>
            <Field label="Jenis">
              <Select value={milestone.kind} onChange={(value) => patch(index, { kind: value })} options={KINDS} />
            </Field>
          </div>
          <LField label="Judul" value={milestone.title} onChange={(value) => patch(index, { title: value })} />
          <LField label="Organisasi" value={milestone.org} onChange={(value) => patch(index, { org: value })} />
          <LField label="Detail" value={milestone.detail} onChange={(value) => patch(index, { detail: value })} multiline />
        </div>
      )}
    />
  );
}