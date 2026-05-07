import fs from 'fs';
const content = fs.readFileSync('src/pages/NexusDF.tsx', 'utf8');
let lines = content.split('\n');

// Fix 1: Analysis tab unclosed table
// Around line 809
const tbodyIndex = lines.findIndex(l => l.includes('<tbody className="divide-y divide-slate-50 dark:divide-slate-800">'));
if (tbodyIndex !== -1) {
    const mapEndIndex = lines.findIndex((l, i) => i > tbodyIndex && l.trim() === '))}');
    if (mapEndIndex !== -1) {
        // After map end, we need to close tbody, table, div, div
        if (!lines[mapEndIndex + 1].includes('</tbody>')) {
            lines.splice(mapEndIndex + 1, 0, 
                '                      </tbody>',
                '                    </table>',
                '                  </div>',
                '                </div>'
            );
        }
    }
}

// Fix 2: redundant tags in BP
// Around line 1290+
const redundantStart = lines.findIndex((l, i) => i > 1200 && l.trim() === '</tbody>' && lines[i+1]?.trim() === '</table>');
if (redundantStart !== -1) {
    // We want the SECOND occurrence of this pattern or just the one that is clearly redundant (outside the table)
    // Actually, looking at the previous view_file, they are at 1293
    const badIndex = lines.findIndex((l, i) => i > 1250 && l.trim() === '</tbody>');
    if (badIndex !== -1) {
        lines.splice(badIndex, 5);
    }
}

fs.writeFileSync('src/pages/NexusDF.tsx', lines.join('\n'));
console.log('Fixed NexusDF.tsx syntax issues via script v3');
