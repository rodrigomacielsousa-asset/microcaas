import fs from 'fs';
const content = fs.readFileSync('src/pages/NexusDF.tsx', 'utf8');
const lines = content.split('\n');

// Localizar a quebra na linha 1130 aprox
// 1128:                                    `R$ ${displayVal.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
// 1129:                                  )}
// 1130:                             {/* BP Content Section */}

const index1129 = lines.findIndex(l => l.includes('R$ ${displayVal.toLocaleString') && l.includes('minimumFractionDigits: 0'));
if (index1129 !== -1) {
    const startFix = index1129 + 1; // 1129: )}
    if (lines[startFix].includes(')}')) {
        lines.splice(startFix + 1, 0, 
            '                                </p>',
            '                              </div>',
            '                            );',
            '                          })}',
            '                     </div>',
            ''
        );
    }
}

// Localizar a quebra no final do Passivo
// 1292:                        </tbody>
// 1293:                           </table>
// 1294:                         </div>
// 1295:                       </div>
// 1296:                    </div>

const index1292 = lines.findIndex(l => l.trim() === '</tbody>' && lines[lines.indexOf(l) + 1]?.trim() === '</table>' && lines[lines.indexOf(l) + 2]?.trim() === '</div>');
if (index1292 !== -1) {
    lines.splice(index1292, 5);
}

fs.writeFileSync('src/pages/NexusDF.tsx', lines.join('\n'));
console.log('Fixed NexusDF.tsx syntax issues via script');
