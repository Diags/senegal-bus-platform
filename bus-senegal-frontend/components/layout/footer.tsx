import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white">
      {/* Barre tricolore inversée */}
      <div className="gradient-senegal h-1 w-full"></div>
      
      <div className="space-container py-12 md:py-16">
        {/* Grid principale parfaitement centrée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto mb-12">
          {/* Logo et description */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <span className="text-4xl">🚌</span>
              <div>
                <h3 className="text-2xl font-bold text-senegal-green">Bus Sénégal</h3>
                <p className="text-xs text-gray-400">La Teranga du voyage</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              La première plateforme de réservation de bus 100% sénégalaise. 
              Voyagez avec confiance et sérénité.
            </p>
            <div className="flex gap-3 mt-6 justify-center md:justify-start">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-senegal-green center-flex transition-all hover-scale">
                📘
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-senegal-green center-flex transition-all hover-scale">
                📸
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-senegal-green center-flex transition-all hover-scale">
                💬
              </a>
            </div>
          </div>
          
          {/* Liens Rapides */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-senegal-yellow">
              Liens Rapides
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/trajets" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>🔍</span>
                  <span>Rechercher un trajet</span>
                </Link>
              </li>
              <li>
                <Link href="/compagnies" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>🏢</span>
                  <span>Compagnies partenaires</span>
                </Link>
              </li>
              <li>
                <Link href="/mes-reservations" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>📋</span>
                  <span>Mes réservations</span>
                </Link>
              </li>
              <li>
                <Link href="/offres" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>🎁</span>
                  <span>Offres spéciales</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-senegal-yellow">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/aide" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>❓</span>
                  <span>Centre d'aide</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>📞</span>
                  <span>Nous contacter</span>
                </Link>
              </li>
              <li>
                <a href="tel:+221338123456" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>☎️</span>
                  <span>+221 33 812 34 56</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@bus-senegal.sn" className="text-gray-400 hover:text-senegal-green transition-colors flex items-center gap-2 justify-center md:justify-start">
                  <span>📧</span>
                  <span>contact@bus-senegal.sn</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Paiements & Légal */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-senegal-yellow">
              Paiements Acceptés
            </h4>
            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
              <span className="badge-premium text-xs">💰 Orange Money</span>
              <span className="badge-yellow text-xs">📱 Wave</span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-semibold">💙 Free Money</span>
            </div>
            
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-senegal-yellow">
              Légal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cgv" className="text-gray-400 hover:text-senegal-green transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-gray-400 hover:text-senegal-green transition-colors">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} <span className="font-bold text-senegal-green">Bus Sénégal</span>. 
              Tous droits réservés. Fait avec <span className="text-red-500">❤️</span> au Sénégal 🇸🇳
            </p>
            
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span>🔒</span>
                <span>Paiement sécurisé</span>
              </span>
              <span className="flex items-center gap-1">
                <span>✅</span>
                <span>Certifié ARTP</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barre finale tricolore */}
      <div className="gradient-senegal h-1 w-full"></div>
    </footer>
  )
}

