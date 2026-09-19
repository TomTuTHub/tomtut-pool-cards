/*
 * Winziger YAML-Leser — nur fuer die Test-Fixtures.
 * Kann: verschachtelte Maps ueber Einrueckung, Listen (skalar und Map),
 * Kommentare, einfache Skalare. Mehr braucht diese Card nicht, und so bleibt
 * das Repo frei von Test-Abhaengigkeiten.
 */

const stripComment = (line) => {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === "#" && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i);
    }
  }
  return line;
};

const unquote = (s) =>
  (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))
    ? s.slice(1, -1)
    : s;

const scalar = (s) => {
  const v = unquote(s.trim());
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~" || v === "") return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
};

const tokenize = (text) => {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = stripComment(raw);
    if (!line.trim()) continue;
    let indent = line.match(/^ */)[0].length;
    let rest = line.trim();
    while (rest === "-" || rest.startsWith("- ")) {
      out.push({ indent, item: true });
      indent += 2;
      rest = rest === "-" ? "" : rest.slice(2).trim();
      if (!rest) break;
    }
    if (rest) out.push({ indent, text: rest });
  }
  return out;
};

export function parseYaml(text) {
  const toks = tokenize(text);
  let p = 0;

  const parseNode = (indent) => {
    if (p >= toks.length) return null;
    if (toks[p].item && toks[p].indent === indent) {
      const arr = [];
      while (p < toks.length && toks[p].item && toks[p].indent === indent) {
        p++;
        if (p < toks.length && toks[p].indent > indent) arr.push(parseNode(toks[p].indent));
        else arr.push(null);
      }
      return arr;
    }
    /* einzelner Skalar (Listeneintrag ohne Schluessel) */
    if (!/^[^\s:]+\s*:(\s|$)/.test(toks[p].text || "")) {
      const value = scalar(toks[p].text);
      p++;
      return value;
    }
    const obj = {};
    while (p < toks.length && !toks[p].item && toks[p].indent === indent) {
      const m = toks[p].text.match(/^([^:]+):\s*(.*)$/);
      if (!m) {
        p++;
        continue;
      }
      const key = unquote(m[1].trim());
      const value = m[2].trim();
      p++;
      if (value !== "") obj[key] = scalar(value);
      else if (p < toks.length && toks[p].indent > indent) obj[key] = parseNode(toks[p].indent);
      else obj[key] = null;
    }
    return obj;
  };

  return parseNode(toks.length ? toks[0].indent : 0);
}
