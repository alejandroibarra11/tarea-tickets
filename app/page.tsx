'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navigation } from './components/Navigation'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { sampleTickets } from './utils/sampleData'

interface Ticket {
  id: number
  title: string
  status: 'abierto' | 'en progreso' | 'cerrado'
  createdAt: string
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets')
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets))
    } else {
      setTickets(sampleTickets as Ticket[])
      localStorage.setItem('tickets', JSON.stringify(sampleTickets))
    }
  }, [])

  const onDragEnd = (result: any) => {
    console.log(result);
    if (!result.destination) return;
    console.log(result);

    const newTickets = Array.from(tickets).map((ticket) => {
      if (Number(ticket.id) === Number(result.draggableId)) {
        return {
          ...ticket,
          status: result.destination.droppableId as 'abierto' | 'en progreso' | 'cerrado'
        }
      }
      return ticket;
    });

    setTickets(newTickets);
    localStorage.setItem('tickets', JSON.stringify(newTickets));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Tickets de Soporte</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['abierto', 'en progreso', 'cerrado'] as const).map((status) => (
              <div key={status} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2 capitalize">{status}</h2>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {tickets
                        .filter((ticket) => ticket.status === status)
                        .map((ticket, index) => (
                          <Draggable key={ticket.id} draggableId={ticket.id.toString()} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-100 p-2 rounded"
                              >
                                <Link href={`/ticket/${ticket.id}`}>
                                  <div className="font-medium">{ticket.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                  </div>
                                </Link>
                              </li>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  )
}

