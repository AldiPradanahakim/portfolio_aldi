import type { L, SkillGroup } from '../../content/types';
import { EditorProps, Field, LField, ListEditor, TextInput } from '../ui';

export function SkillsEditor({ draft, update }: EditorProps) {
  const groups = draft.skills;

  function setGroups(items: SkillGroup[]) {
    update((content) => ({ ...content, skills: items }));
  }

  function patchGroup(index: number, patch: Partial<SkillGroup>) {
    setGroups(groups.map((group, i) => (i === index ? { ...group, ...patch } : group)));
  }

  function replaceItem(groupIndex: number, idx: number, value: L) {
    patchGroup(groupIndex, { items: groups[groupIndex].items.map((item, i) => (i === idx ? value : item)) });
  }

  return (
    <ListEditor<SkillGroup>
      items={groups}
      onChange={setGroups}
      create={() => ({ id: '', title: { id: '', en: '' }, items: [] })}
      addLabel="Tambah kelompok keahlian"
      emptyLabel="Belum ada kelompok."
      render={(group, index) => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="ID">
              <TextInput value={group.id} onChange={(value) => patchGroup(index, { id: value })} mono />
            </Field>
            <LField label="Judul" value={group.title} onChange={(value) => patchGroup(index, { title: value })} />
          </div>
          <Field label="Butir keahlian">
            <ListEditor<L>
              items={group.items}
              onChange={(items) => patchGroup(index, { items })}
              create={() => ({ id: '', en: '' })}
              addLabel="Tambah butir"
              emptyLabel="Belum ada butir."
              render={(item, idx) => (
                <LField label={`Butir ${idx + 1}`} value={item} onChange={(value) => replaceItem(index, idx, value)} />
              )}
            />
          </Field>
        </div>
      )}
    />
  );
}