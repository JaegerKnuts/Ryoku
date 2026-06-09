"use client";

import { useEffect, useState } from "react";

const NEW_TAG_VALUE = "__new__";

interface BlogTagFieldProps {
  value: string;
  onChange: (tag: string) => void;
}

export default function BlogTagField({ value, onChange }: BlogTagFieldProps) {
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);
  const inputClass =
    "w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]";

  useEffect(() => {
    fetch("/api/admin/blog/tags")
      .then((res) => res.json())
      .then((data) => {
        const tags: string[] = data.tags || [];
        setExistingTags(tags);
        if (value) {
          setIsNew(!tags.includes(value));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!value || existingTags.length === 0) return;
    setIsNew(!existingTags.includes(value));
  }, [value, existingTags]);

  const handleSelectChange = (selected: string) => {
    if (selected === NEW_TAG_VALUE) {
      setIsNew(true);
      onChange("");
      return;
    }
    setIsNew(false);
    onChange(selected);
  };

  const selectOptions = [...existingTags];
  if (value && !selectOptions.includes(value)) {
    selectOptions.unshift(value);
  }

  return (
    <div className="space-y-2">
      <select
        value={isNew ? NEW_TAG_VALUE : value}
        onChange={(e) => handleSelectChange(e.target.value)}
        className={inputClass}
      >
        <option value="" disabled>
          Seleccionar sección
        </option>
        {selectOptions.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
        <option value={NEW_TAG_VALUE}>Nueva sección...</option>
      </select>
      {isNew && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nombre de la nueva sección"
          className={inputClass}
        />
      )}
    </div>
  );
}
