import { SearchForm } from '@/components/features/search-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section avec identité sénégalaise */}
      <section className="relative overflow-hidden">
        {/* Barre tricolore du drapeau en haut */}
        <div className="gradient-senegal h-2 w-full"></div>
        
        {/* Background avec pattern africain */}
        <div className="pattern-african bg-gradient-to-br from-[#F4E4C1] via-white to-[#E8F5E9] py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge Teranga */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md mb-6 animate-fadeInUp">
                <span className="text-2xl">🇸🇳</span>
                <span style={{color: 'var(--senegal-green)'}} className="font-semibold">
                  La Teranga du voyage
                </span>
              </div>
              
              {/* Titre principal */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <span className="block mb-2">Voyagez à travers le</span>
                <span className="bg-gradient-to-r from-[var(--senegal-green)] via-[var(--senegal-yellow)] to-[var(--senegal-red)] bg-clip-text text-transparent">
                  Sénégal
                </span>
              </h1>
              
              {/* Sous-titre */}
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                Dakar, Touba, Saint-Louis, Ziguinchor... 
                <br className="hidden sm:block" />
                <span className="font-semibold" style={{color: 'var(--senegal-green)'}}>
                  Réservez votre billet en 2 minutes !
                </span>
              </p>
              
              {/* Stats rapides */}
              <div className="flex justify-center gap-8 mb-12 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{color: 'var(--senegal-green)'}}>5+</div>
                  <div className="text-sm text-gray-600">Compagnies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{color: 'var(--senegal-green)'}}>15+</div>
                  <div className="text-sm text-gray-600">Trajets/jour</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{color: 'var(--senegal-green)'}}>100%</div>
                  <div className="text-sm text-gray-600">Sécurisé</div>
                </div>
              </div>
              
              {/* Formulaire de recherche avec style sénégalais */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <div className="mb-4 text-center">
                  <h2 className="text-xl md:text-2xl font-bold mb-2" style={{color: 'var(--senegal-green)'}}>
                    🚌 Trouvez votre trajet
                  </h2>
                  <p className="text-sm text-gray-600">
                    Où souhaitez-vous aller aujourd'hui ?
                  </p>
                </div>
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Avec style sénégalais */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir <span style={{color: 'var(--senegal-green)'}}>Bus Sénégal</span> ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Avec Teranga, nous rendons vos voyages simples, sûrs et agréables
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Facile à utiliser */}
            <div className="card-elevated bg-white rounded-xl p-6 text-center group hover:border-2" style={{borderColor: 'var(--senegal-green)'}}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl" 
                   style={{backgroundColor: 'rgba(0, 132, 61, 0.1)'}}>
                🎯
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--senegal-green)'}}>
                Simple et Rapide
              </h3>
              <p className="text-gray-600 mb-4">
                Trouvez et réservez votre trajet en moins de 2 minutes
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>✓ Recherche instantanée</li>
                <li>✓ Comparaison des prix</li>
                <li>✓ Réservation en un clic</li>
              </ul>
            </div>

            {/* Paiement sécurisé */}
            <div className="card-elevated bg-white rounded-xl p-6 text-center group hover:border-2" style={{borderColor: 'var(--senegal-yellow)'}}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                   style={{backgroundColor: 'rgba(255, 242, 0, 0.15)'}}>
                💳
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--senegal-green)'}}>
                Paiement 100% Sénégalais
              </h3>
              <p className="text-gray-600 mb-4">
                Tous les moyens de paiement locaux acceptés
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="badge-green">Orange Money</span>
                <span className="badge-yellow">Wave</span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full">Free Money</span>
              </div>
            </div>

            {/* E-ticket */}
            <div className="card-elevated bg-white rounded-xl p-6 text-center group hover:border-2" style={{borderColor: 'var(--senegal-red)'}}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                   style={{backgroundColor: 'rgba(224, 30, 36, 0.1)'}}>
                📱
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--senegal-green)'}}>
                E-Billet Instantané
              </h3>
              <p className="text-gray-600 mb-4">
                Recevez votre billet sur WhatsApp, SMS et Email
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>✓ QR Code sécurisé</li>
                <li>✓ Pas besoin d'imprimer</li>
                <li>✓ Accès hors ligne</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes - Style sénégalais */}
      <section className="py-16 md:py-20 gradient-senegal-soft">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🗺️ Destinations <span style={{color: 'var(--senegal-green)'}}>Populaires</span>
            </h2>
            <p className="text-gray-600">
              Les trajets les plus demandés au Sénégal
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { from: 'Dakar', to: 'Saint-Louis', price: '8 000', duration: '4h30', icon: '🏛️', popular: true },
              { from: 'Dakar', to: 'Touba', price: '5 000', duration: '3h00', icon: '🕌', popular: true },
              { from: 'Dakar', to: 'Thiès', price: '3 000', duration: '1h00', icon: '🏭', popular: false },
              { from: 'Dakar', to: 'Mbour', price: '4 000', duration: '1h30', icon: '🏖️', popular: false },
              { from: 'Dakar', to: 'Kaolack', price: '6 500', duration: '2h30', icon: '🌾', popular: false },
              { from: 'Dakar', to: 'Ziguinchor', price: '15 000', duration: '9h00', icon: '🌴', popular: true },
              { from: 'Saint-Louis', to: 'Richard-Toll', price: '3 500', duration: '1h30', icon: '🌊', popular: false },
              { from: 'Dakar', to: 'Tambacounda', price: '12 000', duration: '8h00', icon: '🦁', popular: false },
            ].map((route) => (
              <div 
                key={`${route.from}-${route.to}`} 
                className="card-elevated bg-white rounded-xl p-5 cursor-pointer group relative overflow-hidden"
              >
                {/* Badge "Populaire" */}
                {route.popular && (
                  <div className="absolute top-2 right-2 badge-green text-xs">
                    ⭐ Populaire
                  </div>
                )}
                
                {/* Icône de la destination */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {route.icon}
                </div>
                
                {/* Trajet */}
                <h3 className="font-bold text-lg mb-1">
                  {route.from}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <span className="text-xs text-gray-500">🚌</span>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                </div>
                <h3 className="font-bold text-lg mb-3">
                  {route.to}
                </h3>
                
                {/* Prix et durée */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">💰 À partir de</span>
                    <span className="font-bold text-lg" style={{color: 'var(--senegal-green)'}}>
                      {route.price} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">⏱️ Durée</span>
                    <span className="text-sm font-medium">{route.duration}</span>
                  </div>
                </div>
                
                {/* Hover effect - bouton */}
                <button className="w-full mt-4 py-2 rounded-lg font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{backgroundColor: 'var(--senegal-green)'}}>
                  Réserver →
                </button>
              </div>
            ))}
          </div>
          
          {/* CTA voir tous les trajets */}
          <div className="text-center mt-12">
            <button className="btn-senegal text-lg px-8 py-4 shadow-lg">
              Voir tous les trajets disponibles →
            </button>
          </div>
        </div>
      </section>

      {/* Section Teranga - Valeur ajoutée */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-5xl mb-4 block">🤝</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              La <span style={{color: 'var(--teranga-orange)'}}>Teranga</span> avant tout
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Au Sénégal, la Teranga (hospitalité) est sacrée. C'est pourquoi nous mettons tout en œuvre 
              pour que votre voyage soit confortable, sûr et mémorable. Des compagnies fiables, des bus 
              entretenus, et un service client à votre écoute 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <span>✅</span>
                <span>Service client 24/7</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <span>✅</span>
                <span>Remboursement facile</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <span>✅</span>
                <span>Bus climatisés</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <span>✅</span>
                <span>Trajets vérifiés</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 md:py-20" style={{backgroundColor: 'var(--senegal-green)'}}>
        <div className="container px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à voyager ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Réservez votre prochain trajet dès maintenant
          </p>
          <button className="bg-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  style={{color: 'var(--senegal-green)'}}>
            🚌 Rechercher un trajet
          </button>
        </div>
      </section>
    </div>
  )
}
