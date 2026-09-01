/**
 * A small Markdown renderer for case-study files.
 *
 * Deliberately not a full CommonMark implementation — it covers the subset that
 * case-studies/TEMPLATE.md produces (front matter, headings, paragraphs, lists,
 * tables, emphasis, links, code) with no dependency and no build step.
 */

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Split YAML-ish front matter off the top. Values are kept as raw strings. */
export function splitFrontMatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let value = kv[2].trim().replace(/^["'](.*)["']$/, '$1');
    if (/^\[.*\]$/.test(value)) {
      value = value.slice(1, -1).split(',').map((v) => v.trim()).filter(Boolean);
    }
    meta[kv[1]] = value;
  }
  return { meta, body: text.slice(match[0].length) };
}

/**
 * Pull a leading `# Heading` off the body and return it as the title. Front
 * matter is preferred where it exists; this covers files written without it,
 * which would otherwise show a raw filename in the drawer header.
 */
export function extractTitle(md) {
  const match = /^\s*#\s+(.+?)\s*$/m.exec(md.split('\n').slice(0, 3).join('\n'));
  if (!match) return { title: null, body: md };
  return { title: match[1], body: md.replace(match[0], '') };
}

function inline(text) {
  let out = escapeHTML(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(
    /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return out;
}

const isTableRow = (line) => /^\s*\|.*\|\s*$/.test(line);
const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i += 1; continue; }

    if (/^---+\s*$/.test(line)) { html.push('<hr>'); i += 1; continue; }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 6); // h1 is the panel title
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (isTableRow(line) && isTableRow(lines[i + 1] || '') && /^[\s|:-]+$/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && isTableRow(lines[i])) { body.push(cells(lines[i])); i += 1; }
      html.push(
        '<div class="table-scroll"><table><thead><tr>'
        + head.map((c) => `<th>${inline(c)}</th>`).join('')
        + '</tr></thead><tbody>'
        + body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')
        + '</tbody></table></div>',
      );
      continue;
    }

    const bullet = /^\s*[-*]\s+/;
    const numbered = /^\s*\d+\.\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const ordered = numbered.test(line);
      const marker = ordered ? numbered : bullet;
      const items = [];
      while (i < lines.length && marker.test(lines[i])) {
        let item = lines[i].replace(marker, '');
        i += 1;
        // Continuation lines of the same item are indented, not markers.
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !marker.test(lines[i])) {
          item += ` ${lines[i].trim()}`;
          i += 1;
        }
        items.push(`<li>${inline(item)}</li>`);
      }
      html.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim()
           && !/^(#{1,6}\s|---+\s*$)/.test(lines[i])
           && !bullet.test(lines[i]) && !numbered.test(lines[i])
           && !isTableRow(lines[i])) {
      para.push(lines[i].trim());
      i += 1;
    }
    if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return html.join('\n');
}
