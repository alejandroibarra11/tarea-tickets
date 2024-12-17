'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '../components/Navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function CreateTicket() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const storedTickets = localStorage.getItem('tickets')
    const tickets = storedTickets ? JSON.parse(storedTickets) : []
    const newTicket = {
      id: Date.now(),
      title,
      description,
      status: 'abierto',
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('tickets', JSON.stringify([...tickets, newTicket]))
    toast({
      title: "Ticket creado",
      description: "El ticket ha sido creado exitosamente.",
    })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Crear Nuevo Ticket</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Crear Ticket</Button>
        </form>
      </main>
    </div>
  )
}

