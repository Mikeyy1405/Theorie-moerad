
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TheorieExamen</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Het complete platform voor Nederlandse theorie-examens. 
              Slaag gegarandeerd met onze bewezen lesmethoden.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Cursussen</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="hover:text-blue-400 transition-colors">
                  Auto Theorie
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-blue-400 transition-colors">
                  Motor Theorie
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Inloggen
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-blue-400 transition-colors">
                  Registreren
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@theorieexamen.nl</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>088 - 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Nederland</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 TheorieExamen Platform. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
}
