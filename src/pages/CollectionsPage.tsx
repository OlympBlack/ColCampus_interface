import { CollectionsSection } from '../components/CollectionsSection'

export function CollectionsPage() {
  return (
    <>
      <section className="relative bg-slate-950 text-white overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80"
            alt="Nos collections"
            className="w-full h-full object-cover opacity-55 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 mb-4 sm:mb-5">
            <a href="#/" className="hover:text-white transition-colors">
              Accueil
            </a>
            <span>/</span>
            <span className="text-[#a4c639] font-semibold">Collections</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans mb-3 text-center drop-shadow-md">
            Explorez nos <span style={{ color: '#a4c639' }}>Collections de Chambres</span>
          </h1>

          <p className="max-w-2xl text-slate-200 text-sm sm:text-base leading-relaxed text-center drop-shadow-sm">
            Explorez les typologies de chambres disponibles autour des campus universitaires du Bénin.
          </p>
        </div>
      </section>

      <CollectionsSection
        title={
          <>
            Trouvez la chambre <span className="text-[#a4c639]">qui vous correspond</span>
          </>
        }
        subtitle="Des typologies pensees pour les etudiants des campus universitaires du Benin"
      />
    </>
  )
}
