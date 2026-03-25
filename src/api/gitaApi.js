const BASE = 'https://vedicscriptures.github.io';

export const getChapters = () =>
  fetch(`${BASE}/chapters`).then(r => { if (!r.ok) throw new Error(); return r.json(); });

export const getVerse = (ch, v) =>
  fetch(`${BASE}/slok/${ch}/${v}`).then(r => { if (!r.ok) throw new Error(); return r.json(); });
