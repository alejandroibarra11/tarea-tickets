'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '../../../components/Navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: number
  title: string
  description: string
  status: 'abierto' | 'en progreso' | 'cerrado'
  createdAt: string
}

export default function EditTicket({ params }: { params: { id: string } }) {
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
        <h1 className="text-3xl font-bold mb-4">Editar Ticket</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <Input
              type="text"
              id="title"
              value={ticket.title}
              onChange={(e) => setTicket({ ...ticket, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <Textarea
              id="description"
              value={ticket.description}
              onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <Select
              value={ticket.status}
              onValueChange={(value) => setTicket({ ...ticket, status: value as 'abierto' | 'en progreso' | 'cerrado' })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abierto">Abierto</SelectItem>
                <SelectItem value="en progreso">En Progreso</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Actualizar Ticket</Button>
        </form>
      </main>
    </div>
  )
}

