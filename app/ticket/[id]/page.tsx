'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '../../components/Navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: number
  title: string
  description: string
  status: 'abierto' | 'en progreso' | 'cerrado'
  createdAt: string
}

export default function TicketDetail({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets')
    if (storedTickets) {
      const tickets = JSON.parse(storedTickets)
      const foundTicket = tickets.find((t: Ticket) => t.id === parseInt(params.id))
      if (foundTicket) {
        setTicket(foundTicket)
      }
    }
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ticket) {
      const storedTickets = localStorage.getItem('tickets')
      if (storedTickets) {
        let tickets = JSON.parse(storedTickets)
        tickets = tickets.map((t: Ticket) => t.id === ticket.id ? ticket : t)
        localStorage.setItem('tickets', JSON.stringify(tickets))
        toast({
          title: "Ticket actualizado",
          description: "El ticket ha sido actualizado exitosamente.",
        })
        router.push('/')
      }
    }
  }

  if (!ticket) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Detalles del Ticket</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">{ticket.title}</h2>
          <p className="text-gray-600 mb-4">{ticket.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Estado: <span className="capitalize">{ticket.status}</span>
            </span>
            <span className="text-sm font-medium text-gray-500">
              Creado el: {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          <Link href={`/ticket/${ticket.id}/edit`}>
            <Button>Editar Ticket</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

