import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setMeetingData,
  addAction,
  clearMeeting
} from '../store/slices/meetingsSlice'
import axios from 'axios'

export default function MeetingsWizard() {
  const dispatch = useDispatch()
  const meeting = useSelector(state => state.meetings.current)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000')
  })

  const handleGenerateAgenda = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.post('/api/meetings/generate/agenda', {
        subject: meeting.subject,
        stakes: meeting.stakes,
        trigger: meeting.trigger,
        participants: meeting.participants,
        duration: meeting.duration
      })
      dispatch(setMeetingData({ agenda: data.agenda }))
      setStep(3)
    } catch (error) {
      console.error('Agenda generation error:', error)
      alert('Erreur lors de la génération: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateEmail = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.post('/api/meetings/generate/email', {
        subject: meeting.subject,
        participants: meeting.participants,
        decisions: meeting.decisions,
        actions: meeting.actions
      })
      dispatch(setMeetingData({ email: data.email }))
      setStep(6)
    } catch (error) {
      console.error('Email generation error:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="meetings-wizard">
      <h1>Gestion des Réunions</h1>

      {step === 1 && (
        <div className="step">
          <h2>Étape 1: Contexte</h2>
          <input
            type="text"
            placeholder="Sujet de la réunion"
            value={meeting.subject || ''}
            onChange={(e) => dispatch(setMeetingData({ subject: e.target.value }))}
          />
          <textarea
            placeholder="Enjeux"
            value={meeting.stakes || ''}
            onChange={(e) => dispatch(setMeetingData({ stakes: e.target.value }))}
          />
          <textarea
            placeholder="Déclencheur"
            value={meeting.trigger || ''}
            onChange={(e) => dispatch(setMeetingData({ trigger: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Participants (séparés par virgule)"
            value={meeting.participants?.join(', ') || ''}
            onChange={(e) => dispatch(setMeetingData({
              participants: e.target.value.split(',').map(p => p.trim())
            }))}
          />
          <select
            value={meeting.duration || '60'}
            onChange={(e) => dispatch(setMeetingData({ duration: e.target.value }))}
          >
            <option value="30">30 minutes</option>
            <option value="60">1 heure</option>
            <option value="90">1h30</option>
            <option value="120">2 heures</option>
          </select>
          <button onClick={() => setStep(2)}>Suivant</button>
        </div>
      )}

      {step === 2 && (
        <div className="step">
          <h2>Étape 2: Génération Agenda</h2>
          <button onClick={handleGenerateAgenda} disabled={loading}>
            {loading ? 'Génération...' : 'Générer l\'agenda'}
          </button>
          {meeting.agenda && (
            <div className="agenda-preview">
              <h3>Agenda généré:</h3>
              <pre>{meeting.agenda}</pre>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="step">
          <h2>Étape 3: Facilitation</h2>
          <p>Réunion en cours...</p>
          <button onClick={() => setStep(4)}>Réunion terminée →</button>
        </div>
      )}

      {step === 4 && (
        <div className="step">
          <h2>Étape 4: Compte-Rendu</h2>
          <textarea
            placeholder="Notes brutes de réunion"
            value={meeting.notes || ''}
            onChange={(e) => dispatch(setMeetingData({ notes: e.target.value }))}
          />
          <button onClick={() => setStep(5)}>Analyser →</button>
        </div>
      )}

      {step === 5 && (
        <div className="step">
          <h2>Étape 5: Actions</h2>
          <input
            type="text"
            placeholder="Décisions prises"
            value={meeting.decisions || ''}
            onChange={(e) => dispatch(setMeetingData({ decisions: e.target.value }))}
          />
          <textarea
            placeholder="Actions à accomplir"
            value={meeting.actions || ''}
            onChange={(e) => dispatch(setMeetingData({ actions: e.target.value }))}
          />
          <button onClick={handleGenerateEmail} disabled={loading}>
            {loading ? 'Génération...' : 'Générer email suivi'}
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="step">
          <h2>Étape 6: Email Suivi</h2>
          {meeting.email && (
            <div className="email-preview">
              <pre>{meeting.email}</pre>
              <button onClick={() => navigator.clipboard.writeText(meeting.email)}>
                Copier email
              </button>
            </div>
          )}
          <button onClick={() => setStep(7)}>Suivi →</button>
        </div>
      )}

      {step === 7 && (
        <div className="step">
          <h2>Étape 7: Suivi</h2>
          <p>Suivi des actions en cours...</p>
          <button onClick={() => { dispatch(clearMeeting()); setStep(1); }}>
            Nouvelle réunion
          </button>
        </div>
      )}

      <style>{`
        .meetings-wizard { padding: 20px; max-width: 900px; margin: 0 auto; }
        .step { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 10px 0; }
        input, textarea, select { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px 10px 0; }
        button:hover { background: #0056b3; }
        button:disabled { background: #999; cursor: not-allowed; }
        .agenda-preview, .email-preview { background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 15px; max-height: 400px; overflow-y: auto; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
      `}</style>
    </div>
  )
}