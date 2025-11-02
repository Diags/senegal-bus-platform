import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bus Sénégal</h3>
            <p className="text-sm text-muted-foreground">
              La plateforme de réservation de bus au Sénégal
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/trajets" className="text-muted-foreground hover:text-foreground">
                  Rechercher un trajet
                </Link>
              </li>
              <li>
                <Link href="/compagnies" className="text-muted-foreground hover:text-foreground">
                  Compagnies partenaires
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/aide" className="text-muted-foreground hover:text-foreground">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cgv" className="text-muted-foreground hover:text-foreground">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-muted-foreground hover:text-foreground">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bus Sénégal. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}

