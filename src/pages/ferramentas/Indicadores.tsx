import React from 'react';
import { ArrowLeft, Table, PieChart, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Indicadores() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Indicadores e Tabelas 2026</h1>
            <p className="text-slate-500">Consulte alíquotas, tetos e regras vigentes para o ano de 2026.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* INSS Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-indigo-600">📊 Tabela de Alíquotas do INSS – 2026</h2>
            </div>
            
            <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">Faixa</th>
                    <th className="px-6 py-4 font-bold">Até (R$)</th>
                    <th className="px-6 py-4 font-bold">Alíquota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">1ª</td>
                    <td className="px-6 py-4">R$ 1.621,00</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">7,5%</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">2ª</td>
                    <td className="px-6 py-4">R$ 2.902,84</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">9%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">3ª</td>
                    <td className="px-6 py-4">R$ 4.354,27</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">12%</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">4ª</td>
                    <td className="px-6 py-4">R$ 8.475,55</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">14%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800">
               <p className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
                 <Info className="w-4 h-4" /> Teto máximo de contribuição ao INSS (2026): R$ 8.475,55
               </p>
            </div>
          </section>

          {/* IRPF Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-indigo-600">✓ Imposto de Renda 2026 – Isenção e Alíquotas</h2>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A partir de 2026, o Imposto de Renda mensal passou a ter <strong>isenção total para rendimentos de até R$ 5.000,00</strong>, além de uma faixa de redução progressiva até R$ 7.350,00.
            </p>

            <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">Faixa de Rendimentos</th>
                    <th className="px-6 py-4 font-bold">Alíquota</th>
                    <th className="px-6 py-4 font-bold">Regra / Dedução</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">Até R$ 5.000,00</td>
                    <td className="px-6 py-4">0,00%</td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">Isento</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">De R$ 5.000,01 a R$ 7.350,00</td>
                    <td className="px-6 py-4">Redução decrescente</td>
                    <td className="px-6 py-4 text-xs">R$ 978,62 − (0,133145 × rendimentos)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">Acima de R$ 7.350,00</td>
                    <td className="px-6 py-4">27,50%</td>
                    <td className="px-6 py-4">R$ 978,62</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-indigo-600" /> Deduções Permitidas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Dependente</span>
                      <span className="font-bold">R$ 189,59 / mês</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-slate-500">Desconto simplificado</span>
                      <span className="font-bold">R$ 607,20 / mês</span>
                    </div>
                  </div>
               </div>

               <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
                  <h3 className="font-bold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400"><HelpCircle className="w-5 h-5" /> Importante</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-relaxed">
                    A isenção até R$ 5.000,00 ocorre após o desconto do INSS e das deduções legais ou do desconto simplificado, conforme a opção do contribuinte no momento do cálculo.
                  </p>
               </div>
            </div>
          </section>

          {/* Pró-labore Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-indigo-600">📊 Pró-labore – Regras de Tributação</h2>
            </div>
            
            <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">Item</th>
                    <th className="px-6 py-4 font-bold">Regra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">INSS</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">11% sobre o valor bruto</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">Valor Mínimo</td>
                    <td className="px-6 py-4">Salário mínimo (R$ 1.621,00)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">FGTS</td>
                    <td className="px-6 py-4 text-slate-400">Não se aplica</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">Férias / 13º</td>
                    <td className="px-6 py-4 text-slate-400">Não obrigatórios (regra de sócios)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] text-white text-center">
           <h3 className="text-xl font-bold mb-4">Precisa realizar simulações de valores?</h3>
           <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Use nossas calculadoras para simular Folha de Pagamento, Férias e Rescisão com base nestas tabelas.</p>
           <Link to="/ferramentas/calculadoras" className="inline-flex bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all">
             Acessar Calculadoras
           </Link>
        </div>
      </div>
    </div>
  );
}
