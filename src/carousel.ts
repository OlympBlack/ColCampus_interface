/**
 * Initialisation des carrousels du template (Slick + Owl) depuis React.
 * Le template repose sur jQuery : les bibliothecs sont chargees dans index.html.
 */

type JQ = any

function getJQuery(): JQ {
  if (typeof window === 'undefined') return null
  return (window as any).jQuery ?? null
}

const HERO_SLIDER_OPTIONS = {
  autoplay: true,
  autoplaySpeed: 10000,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: false,
  dots: true,
  pauseOnDotsHover: true,
  cssEase: 'linear',
  draggable: false,
  prevArrow: '<button class="PrevArrow"></button>',
  nextArrow: '<button class="NextArrow"></button>',
}

const TESTIMONIALS_OPTIONS = {
  loop: true,
  nav: false,
  dots: true,
  items: 1,
  margin: 30,
  autoplay: false,
  smartSpeed: 700,
  autoplayTimeout: 6000,
  responsive: {
    0: { items: 1, margin: 0 },
    460: { items: 1, margin: 0 },
    576: { items: 2, margin: 20 },
    992: { items: 2, margin: 30 },
  },
}

export function initHeroSlider(element: HTMLElement | null) {
  const $ = getJQuery()
  if (!element || !$.fn?.slick) return
  const $el = $(element)
  if ($el.hasClass('slick-initialized')) return
  $el.slick(HERO_SLIDER_OPTIONS)
}

export function destroyHeroSlider(element: HTMLElement | null) {
  const $ = getJQuery()
  if (!element || !$.fn?.slick) return
  const $el = $(element)
  if ($el.hasClass('slick-initialized')) {
    $el.slick('unslick')
  }
}

export function initTestimonialsCarousel(element: HTMLElement | null) {
  const $ = getJQuery()
  if (!element || !$.fn?.owlCarousel) return
  const $el = $(element)
  if ($el.data('owl.carousel')) return
  $el.owlCarousel(TESTIMONIALS_OPTIONS)
}

export function destroyTestimonialsCarousel(element: HTMLElement | null) {
  const $ = getJQuery()
  if (!element || !$.fn?.owlCarousel) return
  const $el = $(element)
  if ($el.data('owl.carousel')) {
    $el.trigger('destroy.owl.carousel')
    $el.removeData('owl.carousel')
  }
}
