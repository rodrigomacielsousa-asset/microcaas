import fs from 'fs';
const content = fs.readFileSync('src/pages/NexusDF.tsx', 'utf8');

// O objetivo é reconstruir a seção (activeStatementTab === 'BP')
// E garantir que a anterior (RATIOS) esteja fechada.

const lines = content.split('\n');

// 1. Localizar o início do RATIOS
const ratiosStart = lines.findIndex(l => l.includes("activeStatementTab === 'RATIOS'"));
// 2. Localizar o início do BP
const bpStart = lines.findIndex(l => l.includes("activeStatementTab === 'BP'"));

if (ratiosStart !== -1 && bpStart !== -1) {
    // Corrigir o fechamento de RATIOS antes de BP
    // RATIOS deve terminar com:
    //                          </div>
    //                        </div>
    //                       </>
    //                     )}
    //                   </div>
    //                 )}
    
    const beforeBP = [
        '                          </div>',
        '                        </div>',
        '                       </>',
        '                     )}',
        '                   </div>',
        '                 )}',
        ''
    ];
    
    // Substituir tudo entre o fim do conteúdo de ROE e o início do BP
    const roeLine = lines.findIndex((l, i) => i > ratiosStart && i < bpStart && l.includes('Lucratividade sobre o capital próprio dos sócios.'));
    if (roeLine !== -1) {
        lines.splice(roeLine + 1, bpStart - (roeLine + 1), ...beforeBP);
    }
}

// 3. Limpar o bloco BP (remover duplicatas e tags órfãs)
// Vamos localizar o fim do BP (antes de DMPL)
const bpFinalStart = lines.findIndex(l => l.includes("activeStatementTab === 'BP'"));
const dmplStart = lines.findIndex(l => l.includes("activeStatementTab === 'DMPL'"));

if (bpFinalStart !== -1 && dmplStart !== -1) {
    // Localizar o "totalPassivo" e as tags de fechamento logo após
    const totalPassivoIdx = lines.findIndex((l, i) => i > bpFinalStart && i < dmplStart && l.includes('t.statements.totalPassivo'));
    if (totalPassivoIdx !== -1) {
        // Encontrar o fechamento do card de Passivo
        let endOfPassivoCard = -1;
        let divCount = 0;
        for (let i = totalPassivoIdx; i < dmplStart; i++) {
             if (lines[i].includes('</div>')) divCount++;
             if (divCount === 4) { // 1 for total, 1 for inner, 1 for outer content, 1 for card
                endOfPassivoCard = i;
                break;
             }
        }
        
        if (endOfPassivoCard !== -1) {
            // Agora as próximas tags devem ser: </div> (grid), </>, )} (if BP)
            lines.splice(endOfPassivoCard + 1, dmplStart - (endOfPassivoCard + 1), 
                '                    </div>',
                '                  </>',
                '                )}',
                ''
            );
        }
    }
}

fs.writeFileSync('src/pages/NexusDF.tsx', lines.join('\n'));
console.log('Final fix applied to NexusDF.tsx');
