import { SearchForm } from '@/components/features/search-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section ULTRA MODERNE avec identité sénégalaise */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background avec pattern africain */}
        <div className="pattern-african gradient-hero absolute inset-0"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-senegal-green/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-senegal-yellow/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container-centered relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
              {/* Badge Teranga avec effet glass */}
              <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full shadow-senegal-md mb-8 animate-bounce-in hover-lift">
                <span className="text-3xl animate-float">🇸🇳</span>
                <span className="font-bold text-lg text-senegal-green">
                  La Teranga du voyage
                </span>
              </div>
              
              {/* Titre principal MEGA */}
              <h1 className="heading-xl mb-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <span className="block mb-3 text-gray-800">Voyagez à travers le</span>
                <span className="gradient-text-senegal block text-5xl md:text-6xl lg:text-7xl font-black">
                  SÉNÉGAL
                </span>
                <div className="gradient-senegal h-1.5 w-64 mx-auto mt-6 rounded-full"></div>
              </h1>
              
              {/* Sous-titre punchy */}
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-fadeInUp text-balanced" style={{animationDelay: '0.2s'}}>
                De <span className="font-bold text-senegal-green">Dakar</span> à{' '}
                <span className="font-bold text-senegal-green">Saint-Louis</span>,{' '}
                de <span className="font-bold text-senegal-green">Touba</span> à{' '}
                <span className="font-bold text-senegal-green">Ziguinchor</span>
                <br />
                <span className="inline-block mt-3 px-6 py-2 bg-senegal-yellow/20 rounded-full font-bold text-senegal-green">
                  ⚡ Réservez en 2 minutes chrono !
                </span>
              </p>
              
              {/* Stats avec cards modernes */}
              <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <div className="card-ultra hover-lift text-center px-8 py-6 min-w-[140px]">
                  <div className="text-5xl font-black text-senegal-green mb-2">5+</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Compagnies</div>
                </div>
                <div className="card-ultra hover-lift text-center px-8 py-6 min-w-[140px]">
                  <div className="text-5xl font-black text-senegal-green mb-2">15+</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Trajets/jour</div>
                </div>
                <div className="card-ultra hover-lift text-center px-8 py-6 min-w-[140px]">
                  <div className="text-5xl font-black text-senegal-green mb-2">100%</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Sécurisé</div>
                </div>
              </div>
              
              {/* Formulaire de recherche ULTRA moderne */}
              <div className="max-w-4xl mx-auto animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <div className="card-ultra shadow-senegal-xl p-8 md:p-10">
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-senegal-green flex items-center justify-center gap-3">
                      <span className="text-4xl">🔍</span>
                      Trouvez votre trajet idéal
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Plus de <span className="font-bold text-senegal-green">50 destinations</span> à travers tout le Sénégal
                    </p>
                  </div>
                  <SearchForm />
                  
                  {/* Quick Search Suggestions */}
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-gray-500 mr-2">Recherches populaires :</span>
                    {['Dakar → Saint-Louis', 'Dakar → Touba', 'Dakar → Thiès'].map((route) => (
                      <button
                        key={route}
                        className="px-4 py-1.5 text-sm font-medium rounded-full border-2 border-senegal-green/20 text-senegal-green hover:bg-senegal-green hover:text-white transition-all"
                      >
                        {route}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section ULTRA - Parfaitement centrée */}
      <section className="space-section bg-white">
        <div className="space-container">
          {/* Header centré */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="heading-lg mb-4">
              Pourquoi <span className="text-senegal-green">Bus Sénégal</span> ?
            </h2>
            <p className="text-gray-600 text-lg">
              Avec <span className="font-bold text-teranga-orange">Teranga</span>, nous rendons vos voyages simples, sûrs et mémorables
            </p>
          </div>
          
          {/* Grid parfaitement centrée */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Simple et Rapide */}
            <div className="card-ultra hover-lift text-center group relative overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-senegal-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl center-flex text-4xl hover-scale bg-gradient-to-br from-senegal-green/10 to-senegal-green/5 shadow-senegal-sm">
                  🎯
                </div>
                <h3 className="text-2xl font-bold mb-3 text-senegal-green">
                  Simple et Rapide
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Trouvez et réservez votre trajet en moins de 2 minutes
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-senegal-green/10 center-flex text-xs">✓</span>
                    <span>Recherche instantanée</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-senegal-green/10 center-flex text-xs">✓</span>
                    <span>Comparaison des prix</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-senegal-green/10 center-flex text-xs">✓</span>
                    <span>Réservation en un clic</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2 - Paiement */}
            <div className="card-ultra hover-lift text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-senegal-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl center-flex text-4xl hover-scale bg-gradient-to-br from-senegal-yellow/20 to-senegal-yellow/5 shadow-md">
                  💳
                </div>
                <h3 className="text-2xl font-bold mb-3 text-senegal-green">
                  Paiement 100% Local
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Tous les moyens de paiement sénégalais acceptés
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="badge-premium">💰 Orange Money</span>
                  <span className="badge-yellow">📱 Wave</span>
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    💙 Free Money
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3 - E-ticket */}
            <div className="card-ultra hover-lift text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-senegal-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl center-flex text-4xl hover-scale bg-gradient-to-br from-senegal-red/10 to-senegal-red/5 shadow-senegal-sm">
                  📱
                </div>
                <h3 className="text-2xl font-bold mb-3 text-senegal-green">
                  E-Billet Instantané
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Recevez votre billet partout, instantanément
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-senegal-green/10 center-flex text-xs">✓</span>
                    <span>QR Code sécurisé</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-senegal-green/10 center-flex text-xs">✓</span>
                    <span>WhatsApp + SMS + Email</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-senegal-green/10 center-flex text-xs">✓</span>
                    <span>Accès hors ligne</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes - ULTRA moderne et centré */}
      <section className="space-section gradient-senegal-soft relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-senegal-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-senegal-yellow/5 rounded-full blur-3xl"></div>
        
        <div className="space-container relative z-10">
          {/* Header parfaitement centré */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <span className="text-6xl">🗺️</span>
            </div>
            <h2 className="heading-lg mb-4">
              Destinations <span className="gradient-text-senegal">Populaires</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Les trajets les plus demandés par nos voyageurs
            </p>
          </div>
          
          {/* Grid parfaitement centrée */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { from: 'Dakar', to: 'Saint-Louis', price: '8 000', duration: '4h30', icon: '🏛️', popular: true },
              { from: 'Dakar', to: 'Touba', price: '5 000', duration: '3h00', icon: '🕌', popular: true },
              { from: 'Dakar', to: 'Thiès', price: '3 000', duration: '1h00', icon: '🏭', popular: false },
              { from: 'Dakar', to: 'Mbour', price: '4 000', duration: '1h30', icon: '🏖️', popular: false },
              { from: 'Dakar', to: 'Kaolack', price: '6 500', duration: '2h30', icon: '🌾', popular: false },
              { from: 'Dakar', to: 'Ziguinchor', price: '15 000', duration: '9h00', icon: '🌴', popular: true },
              { from: 'Saint-Louis', to: 'Richard-Toll', price: '3 500', duration: '1h30', icon: '🌊', popular: false },
              { from: 'Dakar', to: 'Tambacounda', price: '12 000', duration: '8h00', icon: '🦁', popular: false },
            ].map((route, index) => (
              <div 
                key={`${route.from}-${route.to}`} 
                className="card-ultra hover-lift cursor-pointer group relative overflow-hidden animate-fadeInUp"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                {/* Badge "Populaire" */}
                {route.popular && (
                  <div className="absolute top-3 right-3 badge-popular z-10 animate-pulse">
                    ⭐ Top
                  </div>
                )}
                
                {/* Gradient overlay au hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-senegal-green/0 to-senegal-green/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icône grande et animée */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl center-flex text-5xl hover-scale bg-gradient-to-br from-gray-50 to-gray-100 shadow-md group-hover:shadow-senegal-md transition-all">
                    {route.icon}
                  </div>
                  
                  {/* Villes */}
                  <h3 className="font-bold text-xl mb-1 text-gray-900">
                    {route.from}
                  </h3>
                  
                  {/* Arrow avec animation */}
                  <div className="flex items-center justify-center gap-2 my-3">
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-senegal-green to-transparent"></div>
                    <span className="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-senegal-green to-transparent"></div>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-4 text-gray-900">
                    {route.to}
                  </h3>
                  
                  {/* Divider */}
                  <div className="h-px bg-gray-200 my-4"></div>
                  
                  {/* Prix MEGA visible */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">À partir de</div>
                    <div className="text-3xl font-black text-senegal-green">
                      {route.price}
                      <span className="text-lg font-normal text-gray-600 ml-1">FCFA</span>
                    </div>
                  </div>
                  
                  {/* Durée */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <span>⏱️</span>
                    <span className="font-semibold">{route.duration}</span>
                  </div>
                  
                  {/* Bouton avec effet moderne */}
                  <button className="w-full mt-4 py-3 rounded-xl font-bold text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ripple shadow-senegal-md hover:shadow-senegal-lg"
                          style={{background: 'linear-gradient(135deg, var(--senegal-green), var(--senegal-green-dark))'}}>
                    Réserver maintenant →
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA voir tous centered */}
          <div className="text-center mt-16">
            <button className="btn-primary text-xl px-12 py-5 shadow-senegal-xl hover-glow ripple">
              Voir tous les trajets disponibles →
            </button>
          </div>
        </div>
      </section>

      {/* Section Teranga MEGA - Parfaitement centrée */}
      <section className="space-section bg-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-10 w-40 h-40 bg-teranga-orange/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-senegal-green/10 rounded-full blur-2xl"></div>
        
        <div className="space-container relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Icon mega */}
            <div className="text-center mb-8">
              <span className="text-8xl inline-block animate-float">🤝</span>
            </div>
            
            {/* Title */}
            <h2 className="heading-lg text-center mb-6">
              La <span className="gradient-text-senegal">Teranga</span> avant tout
            </h2>
            
            {/* Quote sénégalaise */}
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 text-center max-w-3xl mx-auto shadow-multi">
              <p className="text-2xl md:text-3xl text-gray-800 font-medium leading-relaxed italic mb-4">
                "Au Sénégal, l'hospitalité n'est pas qu'un mot, c'est un art de vivre"
              </p>
              <p className="text-gray-600">
                C'est pourquoi chaque trajet est une expérience unique, marquée par la chaleur humaine et le service d'excellence.
              </p>
            </div>
            
            {/* Features grid parfaitement centrée */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '🏆', title: 'Service 24/7', desc: 'Support client permanent' },
                { icon: '💯', title: 'Remboursement', desc: 'Facile et rapide' },
                { icon: '❄️', title: 'Bus climatisés', desc: 'Confort garanti' },
                { icon: '✅', title: 'Trajets vérifiés', desc: 'Sécurité maximale' },
              ].map((feature, i) => (
                <div key={i} className="card-ultra hover-lift text-center p-6 animate-scaleIn" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{feature.title}</div>
                  <div className="text-xs text-gray-500">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final MEGA - Parfaitement centré */}
      <section className="space-section relative overflow-hidden" style={{background: 'linear-gradient(135deg, var(--senegal-green) 0%, var(--senegal-green-dark) 100%)'}}>
        {/* Pattern overlay */}
        <div className="pattern-african absolute inset-0 opacity-10"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-senegal-yellow/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        
        <div className="space-container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Icon */}
            <div className="text-7xl mb-8 animate-float">🚌</div>
            
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Prêt à voyager ?
            </h2>
            
            {/* Subtitle */}
            <p className="text-2xl mb-12 opacity-95 font-medium">
              Découvrez le Sénégal avec confort et sérénité
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-senegal-green px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-senegal-xl hover:scale-105 transition-all ripple min-w-[280px]">
                🔍 Rechercher un trajet
              </button>
              <button className="bg-senegal-yellow text-gray-900 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-2xl hover:scale-105 transition-all ripple min-w-[280px]">
                ⭐ Offres spéciales
              </button>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-16 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>Paiement sécurisé SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>Confirmation instantanée</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🇸🇳</span>
                <span>100% Sénégalais</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
