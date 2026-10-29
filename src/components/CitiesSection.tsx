import { useMemo } from 'react'
import { BENIN_CITIES, matchesCity, type BeninCity } from '../constants/cities'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { MapPin, ArrowRight } from 'lucide-react'

export function CitiesSection() {
  const { announcements } = useAnnouncements()

  const countsBySlug = useMemo(() => {
    const map: Record<string, number> = {}
    BENIN_CITIES.forEach((city) => {
      const matches = announcements.filter((a) => matchesCity(a, city)).length
      map[city.slug] = matches > 0 ? matches : city.fallbackCount
    })
    return map
  }, [announcements])

  function handleSelectCity(city: BeninCity) {
    window.location.hash = `#/villes/${city.slug}`
  }

  return (
    <section className="cities-section py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
          Explorez les logements par <span style={{ color: '#dc2626' }} className="text-red-600">ville</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-normal">
          Choisissez votre ville universitaire au Bénin pour découvrir instantanément les chambres vérifiées et colocations disponibles.
        </p>
      </div>

      {/* ── 5-City Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {BENIN_CITIES.map((city) => {
          const count = countsBySlug[city.slug] ?? city.fallbackCount

          return (
            <article
              key={city.slug}
              onClick={() => handleSelectCity(city)}
              className="city-card group"
            >
              {/* Image banner with overlay */}
              <div className="city-card-img-wrap">
                <img
                  src={city.image}
                  alt={city.name}
                  loading="lazy"
                  className="city-card-img"
                />
                <div className="city-card-overlay"></div>
                
                {/* Campus Badge on image */}
                <span className="city-campus-badge">
                  {city.campusName}
                </span>

                {/* Offer Count Badge on image */}
                <span className="city-count-badge">
                  {count} {count > 1 ? 'offres' : 'offre'}
                </span>
              </div>

              {/* Card Bottom Body */}
              <div className="city-card-body">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[14.5px] sm:text-[15.5px] leading-tight group-hover:text-[#6f8d21] transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#a4c639] shrink-0" />
                  <span className="truncate">{city.name}</span>
                </div>

                <p className="city-card-price">
                  {city.startingPrice}
                </p>

                <div className="city-card-footer">
                  <span className="city-card-uni truncate" title={city.universiteFull}>
                    {city.universiteCode}
                  </span>
                  <span className="city-card-cta">
                    Voir <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
