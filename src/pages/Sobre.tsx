import { Mail, Phone, MapPin, Linkedin, Instagram, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="pb-24">
      <section className="py-24 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold font-display">A Revolução da <br /> <span className="text-primary-600">Contabilidade Modular</span></h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Nascemos em 2024 com um propósito claro: acabar com os softwares monolíticos e trazer agilidade para o contador através do conceito de MicroCaaS.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nossa História</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              O ecossistema CaaS Contábil começou como um hub interno para resolver dores de um grande escritório de contabilidade. Percebemos que as microsoluções que criávamos eram universais e extremamente valiosas para todo o mercado.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nosso Propósito</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Empoderar o contador para que ele foque na inteligência e não na burocracia operacional. Acreditamos que a tecnologia deve ser modular, acessível e ultra-especializada.
            </p>
          </div>
        </div>

        <div id="contato" className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 space-y-8">
          <h2 className="text-3xl font-bold">Entre em Contato</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">E-mail</p>
                <p className="font-bold text-slate-700 dark:text-slate-200">contato@microcaas.com.br</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">WhatsApp</p>
                <p className="font-bold text-slate-700 dark:text-slate-200">+55 (65) 99205-8727</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Endereço</p>
                <p className="font-bold text-slate-700 dark:text-slate-200">Brasília, DF - Brasil</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex gap-4">
            <a href="#" className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Globe className="w-4 h-4" /></a>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Nossos Pilares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { t: 'Inovação Aberta', d: 'Fomentamos a criação de MicroCaaS por terceiros, expandindo a inteligência coletiva.' },
            { t: 'Foco na Dor Real', d: 'Não criamos recursos inúteis. Cada micro ferramenta resolve um problema prático.' },
            { t: 'Ética de Dados', d: 'Segurança absoluta e transparência total no tratamento de informações fiscais.' }
          ].map(pilar => (
            <div key={pilar.t} className="text-center space-y-4">
              <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto" />
              <h4 className="text-xl font-bold">{pilar.t}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{pilar.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
