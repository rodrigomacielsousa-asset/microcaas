const fs = require('fs');
const path = './src/pages/NexusDF.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace RATIOS section
const ratiosRegex = /\{activeStatementTab === 'RATIOS' && \([\s\S]*?\}\s*?\)\s*?\}/;
const newRatios = `{activeStatementTab === 'RATIOS' && (
                  <div className="space-y-8 mt-8">
                    {!financialRatios ? (
                      <div className="bg-amber-50 border border-amber-200 p-12 rounded-[2.5rem] text-center">
                         <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                         <h3 className="text-xl font-bold text-amber-800">Cálculo Pendente</h3>
                         <p className="text-amber-600 max-w-md mx-auto mt-2">
                           Os índices financeiros só podem ser calculados após a reconciliação total do Balanço Patrimonial e DRE.
                         </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Liquidez Corrente */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
                          <div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Liquidez Corrente</span>
                             <p className="text-4xl font-black text-indigo-600 group-hover:scale-105 transition-transform origin-left">{financialRatios.liqCorrente.toFixed(2)}</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Base: BP 2024</span>
                                <span className="font-mono text-slate-300">AC / PC</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium">Solvência: Circulante por Passivo.</p>
                          </div>
                        </div>

                        {/* 2. Liquidez Seca */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
                          <div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Liquidez Seca</span>
                             <p className="text-4xl font-black text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{financialRatios.liqSeca.toFixed(2)}</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Base: BP 2024</span>
                                <span className="font-mono text-slate-300">(AC-Est) / PC</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium">Solvência imediata sem estoques.</p>
                          </div>
                        </div>

                        {/* 3. Margem Bruta */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all">
                          <div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Margem Bruta</span>
                             <p className="text-4xl font-black text-emerald-600 group-hover:scale-105 transition-transform origin-left">{financialRatios.margemBruta.toFixed(1)}%</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Base: DRE 2024</span>
                                <span className="font-mono text-slate-300">LB / Receita</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium">Eficiência na gestão de custos diretos.</p>
                          </div>
                        </div>

                        {/* 4. Margem Líquida */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all">
                          <div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 md:mb-2 text-slate-400">Margem Líquida</span>
                             <p className="text-4xl font-black text-emerald-600 group-hover:scale-105 transition-transform origin-left">{financialRatios.margemLiq.toFixed(1)}%</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Base: DRE 2024</span>
                                <span className="font-mono text-slate-300">LL / Receita</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium">Eficiência total líquida.</p>
                          </div>
                        </div>

                        {/* 5. EBITDA */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
                          <div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 md:mb-2">EBITDA Anual</span>
                             <p className="text-2xl md:text-3xl font-black text-blue-600 group-hover:scale-105 transition-transform origin-left">R$ {financialRatios.ebitda.toLocaleString()}</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Base: DRE 2024</span>
                                <span className="font-mono text-slate-300">LOp + Depr</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium">Geração de caixa operacional.</p>
                          </div>
                        </div>

                        {/* 6. Endividamento */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-rose-200 transition-all">
                          <div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Endividamento Geral</span>
                             <p className="text-4xl font-black text-rose-600 group-hover:scale-105 transition-transform origin-left">{financialRatios.endividamento.toFixed(1)}%</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Base: BP 2024</span>
                                <span className="font-mono text-slate-300">PT / AT</span>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium">Dependência de capital de terceiros.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}`;

content = content.replace(ratiosRegex, newRatios);

// Replace BP section
const bpRegex = /\{activeStatementTab === 'BP' && \([\s\S]*?\{activeStatementTab === 'DRE' && \(/;
const newBP = `{activeStatementTab === 'BP' && (
                  <div className="mt-8">
                    {/* BP Content Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                          <h3 className="text-xl font-black uppercase tracking-tight">{t.statements.ativo}</h3>
                        </div>
                        <div className="p-4 md:p-8 flex-1 w-full overflow-x-hidden">
                           <table className="w-full text-xs md:text-sm table-auto">
                            <thead>
                              <tr className="text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-800">
                                 <th className="px-2 md:px-4 py-3 text-left w-12">Nota</th>
                                 <th className="px-2 md:px-4 py-3 text-left">Propriedade</th>
                                 <th className="px-2 md:px-4 py-3 text-right">2024</th>
                                 {!showOnlyCurrentYear && <th className="px-2 md:px-4 py-3 text-right">2023</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {STRUCTURE.BP_ATIVO.map((line) => {
                                const currentVal = calculateLineValue(line.id, 'current');
                                const prevVal = calculateLineValue(line.id, 'prev');
                                if (currentVal === 0 && prevVal === 0 && line.id !== '1.TOTAL') return null;

                                const isBold = line.id.split('.').length <= 2 || line.id === '1.TOTAL';
                                const indentClass = line.indent === 1 ? 'pl-4 md:pl-6' : line.indent === 2 ? 'pl-8 md:pl-10' : 'pl-0';

                                return (
                                  <tr key={line.id} className={cn("border-b dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors", isBold && "bg-slate-50/30 dark:bg-slate-800/10 font-bold")}>
                                     <td className="px-2 md:px-4 py-3 text-slate-400 font-mono text-[10px]">
                                       {line.noteId && (
                                         <button onClick={() => { setActiveTab('notes'); setNoteFilter(line.noteId); }} className="hover:text-indigo-600 transition-colors">
                                            {line.noteId}
                                         </button>
                                       )}
                                     </td>
                                     <td className={cn("px-2 md:px-4 py-3", indentClass)}>{line.label}</td>
                                     <td className="px-2 md:px-4 py-3 text-right tabular-nums">
                                       {currentVal.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                     </td>
                                     {!showOnlyCurrentYear && (
                                       <td className="px-2 md:px-4 py-3 text-right text-slate-500 tabular-nums">
                                         {prevVal.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                       </td>
                                     )}
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bg-slate-900 text-white dark:bg-indigo-600">
                               <tr className="font-black text-[10px] md:text-xs">
                                  <td colSpan={2} className="px-2 md:px-4 py-4 md:py-6 uppercase tracking-wider">{t.statements.totalAtivo}</td>
                                  <td className="px-2 md:px-4 py-4 md:py-6 text-right text-base md:text-lg">
                                    R$ {Math.abs(calculateLineValue('1.TOTAL', 'current')).toLocaleString()}
                                  </td>
                                  {!showOnlyCurrentYear && (
                                    <td className="px-2 md:px-4 py-4 md:py-6 text-right opacity-80 text-sm md:text-base border-l border-white/10">
                                      R$ {Math.abs(calculateLineValue('1.TOTAL', 'prev')).toLocaleString()}
                                    </td>
                                  )}
                               </tr>
                            </tfoot>
                           </table>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                          <h3 className="text-xl font-black uppercase tracking-tight">{t.statements.passivo}</h3>
                        </div>
                        <div className="p-4 md:p-8 flex-1 w-full overflow-x-hidden">
                           <table className="w-full text-xs md:text-sm table-auto">
                            <thead>
                              <tr className="text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-800">
                                 <th className="px-2 md:px-4 py-3 text-left w-12">Nota</th>
                                 <th className="px-2 md:px-4 py-3 text-left">Propriedade</th>
                                 <th className="px-2 md:px-4 py-3 text-right">2024</th>
                                 {!showOnlyCurrentYear && <th className="px-2 md:px-4 py-3 text-right">2023</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {STRUCTURE.BP_PASSIVO.map((line) => {
                                const currentVal = calculateLineValue(line.id, 'current');
                                const prevVal = calculateLineValue(line.id, 'prev');
                                if (currentVal === 0 && prevVal === 0 && line.id !== '2.PASSIVO_TOTAL') return null;

                                const isBold = line.id.split('.').length <= 2 || line.id === '2.PASSIVO_TOTAL';
                                const indentClass = line.indent === 1 ? 'pl-4 md:pl-6' : line.indent === 2 ? 'pl-8 md:pl-10' : 'pl-0';

                                return (
                                  <tr key={line.id} className={cn("border-b dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors", isBold && "bg-slate-50/30 dark:bg-slate-800/10 font-bold")}>
                                     <td className="px-2 md:px-4 py-3 text-slate-400 font-mono text-[10px]">
                                       {line.noteId && (
                                         <button onClick={() => { setActiveTab('notes'); setNoteFilter(line.noteId); }} className="hover:text-indigo-600 transition-colors">
                                            {line.noteId}
                                         </button>
                                       )}
                                     </td>
                                     <td className={cn("px-2 md:px-4 py-3", indentClass)}>{line.label}</td>
                                     <td className="px-2 md:px-4 py-3 text-right tabular-nums">
                                       {currentVal.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                     </td>
                                     {!showOnlyCurrentYear && (
                                       <td className="px-2 md:px-4 py-3 text-right text-slate-500 tabular-nums">
                                         {prevVal.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                       </td>
                                     )}
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bg-slate-900 text-white dark:bg-slate-800">
                               <tr className="font-black text-[10px] md:text-xs text-indigo-400">
                                  <td colSpan={2} className="px-2 md:px-4 py-4 md:py-6 uppercase tracking-wider">{t.statements.totalPassivoPL}</td>
                                  <td className="px-2 md:px-4 py-4 md:py-6 text-right text-base md:text-lg">
                                    R$ {Math.abs(calculateLineValue('2.PASSIVO_TOTAL', 'current')).toLocaleString()}
                                  </td>
                                  {!showOnlyCurrentYear && (
                                    <td className="px-2 md:px-4 py-4 md:py-6 text-right opacity-80 text-sm md:text-base border-l border-white/10">
                                      R$ {Math.abs(calculateLineValue('2.PASSIVO_TOTAL', 'prev')).toLocaleString()}
                                    </td>
                                  )}
                               </tr>
                            </tfoot>
                           </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeStatementTab === 'DRE' && (`;

content = content.replace(bpRegex, newBP);

fs.writeFileSync(path, content);
console.log('Successfully updated NexusDF.tsx');
