import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:text-gray-300">Inicio</Link></li>
        <li><Link href="/create" className="hover:text-gray-300">Crear Ticket</Link></li>
      </ul>
    </nav>
  )
}

