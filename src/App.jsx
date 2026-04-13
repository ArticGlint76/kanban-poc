import { useState } from 'react'

const INITIAL_CARDS = [
  { id: '1', text: 'Review pull request' },
  { id: '2', text: 'Update project documentation' },
  { id: '3', text: 'Fix login page bug' },
  { id: '4', text: 'Design new dashboard layout' },
]

export default function App() {
  const [todo, setTodo] = useState(INITIAL_CARDS)
  const [done, setDone] = useState([])
  const [dragging, setDragging] = useState(null)

  function onDragStart(e, card, source) {
    setDragging({ card, source })
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.classList.add('dragging')
  }

  function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging')
    setDragging(null)
  }

  function onDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function onDrop(target) {
    if (!dragging) return
    const { card, source } = dragging
    if (source === target) return
    if (source === 'todo') {
      setTodo(prev => prev.filter(c => c.id !== card.id))
      setDone(prev => [...prev, card])
    } else {
      setDone(prev => prev.filter(c => c.id !== card.id))
      setTodo(prev => [...prev, card])
    }
    setDragging(null)
  }

  return (
    <div className="app">
      <h1 className="title">Kanban Board</h1>
      <div className="board">
        <Column
          label="To Do"
          cards={todo}
          columnId="todo"
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={() => onDrop('todo')}
          isOver={dragging && dragging.source !== 'todo'}
        />
        <Column
          label="Done"
          cards={done}
          columnId="done"
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={() => onDrop('done')}
          isOver={dragging && dragging.source !== 'done'}
        />
      </div>
    </div>
  )
}

function Column({ label, cards, columnId, onDragStart, onDragEnd, onDragOver, onDrop, isOver }) {
  return (
    <div
      className={`column ${isOver ? 'column--over' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="column-header">
        <h2>{label}</h2>
        <span className="badge">{cards.length}</span>
      </div>
      <div className="card-list">
        {cards.map(card => (
          <div
            key={card.id}
            className="card"
            draggable
            onDragStart={e => onDragStart(e, card, columnId)}
            onDragEnd={onDragEnd}
          >
            {card.text}
          </div>
        ))}
        {cards.length === 0 && (
          <p className="empty">Drop items here</p>
        )}
      </div>
    </div>
  )
}
