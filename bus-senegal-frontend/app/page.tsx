import { SearchForm } from '@/components/features/search-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Voyagez à travers le Sénégal
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Réservez vos trajets en bus en quelques clics. Simple, rapide et sécurisé.
            </p>
            
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir Bus Sénégal ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle>Facile à utiliser</CardTitle>
                <CardDescription>
                  Recherchez, comparez et réservez en quelques clics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Interface intuitive pour trouver le trajet parfait en quelques secondes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">💳</div>
                <CardTitle>Paiement sécurisé</CardTitle>
                <CardDescription>
                  Orange Money, Wave, Free Money acceptés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Payez avec votre méthode préférée en toute sécurité
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">📱</div>
                <CardTitle>E-ticket instantané</CardTitle>
                <CardDescription>
                  Recevez votre billet par SMS et email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plus besoin d'imprimer, présentez votre QR code à l'embarquement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trajets populaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { from: 'Dakar', to: 'Saint-Louis', price: '5 000' },
              { from: 'Dakar', to: 'Thiès', price: '2 500' },
              { from: 'Dakar', to: 'Kaolack', price: '4 000' },
              { from: 'Dakar', to: 'Ziguinchor', price: '8 000' },
            ].map((route) => (
              <Card key={`${route.from}-${route.to}`} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {route.from} → {route.to}
                  </CardTitle>
                  <CardDescription>
                    À partir de {route.price} XOF
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
