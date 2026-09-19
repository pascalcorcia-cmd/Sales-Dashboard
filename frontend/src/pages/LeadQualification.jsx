import React, { useState, useRef, useEffect } from 'react'
import { streamMessage } from '../api'
import MessageBubble from '../components/MessageBubble'
import ToolOutput from '../components/ToolOutput'

export default function LeadQualification() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendInitialPrompt = async () => {
    const prompt = "Je veux qualifier un lead avec la méthode BANT/MEDDPICC. Aide-moi à : 1) Identifier le Budget disponible, 2) Comprendre l'Authority décisionnelle, 3) Valider les besoins réels, 4) Confirmer la Timeline. Posez-moi les questions clés pour qualifier ce lead."
    await handleSend(prompt)
  }

  const handleSend = async (text = null) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    let toolCalls = []

    setMessages(prev => [...prev, { role: 'assistant', content: '', toolCalls: [], streaming: true }])

    try {
      await streamMessage(userMsg, conversationId, (event) => {
        switch (event.type) {
          case 'conversation_id':
            setConversationId(event.data)
            break
          case 'text':
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].content += event.data
              return updated
            })
            break
          case 'tool_start':
            toolCalls.push({ tool: event.data.tool, status: 'running' })
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].toolCalls = [...toolCalls]
              return updated
            })
            break
          case 'tool_result':
            toolCalls = toolCalls.map(tc =>
              tc.tool === event.data.tool ? { ...tc, status: 'done', result: event.data.result } : tc
            )
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].toolCalls = [...toolCalls]
              return updated
            })
            break
          case 'done':
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].streaming = false
              return updated
            })
            break
        }
      })
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Erreur: ${err.message}`,
          streaming: false
        }
        return updated
      })
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  return (
    <>
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <h2 style={styles.welcomeTitle}>🎯 Qualification Leads</h2>
            <p style={styles.welcomeText}>Qualifiez vos leads avec BANT/MEDDPICC</p>
            <button onClick={sendInitialPrompt} style={styles.startBtn}>
              Commencer qualification
            </button>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.toolCalls?.map((tc, j) => <ToolOutput key={j} toolCall={tc} />)}
            {msg.content && <MessageBubble message={msg} />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend() }} style={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Répondez aux questions..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>
          ➤
        </button>
      </form>
    </>
  )
}

const styles = {
  messages: { flex: 1, overflowY: 'auto', padding: '20px' },
  welcome: { textAlign: 'center', padding: '60px 20px 40px' },
  welcomeTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' },
  welcomeText: { color: '#94a3b8', marginBottom: 24, fontSize: 16 },
  startBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
  },
  inputForm: { display: 'flex', gap: 8, padding: '16px 20px', borderTop: '1px solid #1e293b' },
  input: {
    flex: 1,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 600,
  },
}
