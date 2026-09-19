AGENDA_PROMPT = """Je prépare une réunion stratégique
Contexte: {subject}
Enjeu: {stakes}
Déclencheur: {trigger}
Participants ({num_participants}): {participants}
Durée: {duration}

Produis un ordre du jour structuré avec pour chaque point:
- Intitulé précis
- Objectif (décision/validation/alignement/info)
- Durée allouée
- Pilote
- Préparation attendue

Inclus un point d'ouverture (5mn) et clôture (10mn).
La somme doit égaler {duration}."""

CR_PROMPT = """À partir du contexte de réunion et des notes brutes, produis un compte-rendu professionnel:
Contexte: {subject}
Participants: {participants}
Notes brutes: {notes}

Produis:
1. Résumé exécutif (3-4 lignes)
2. Décisions prises (avec propriétaires)
3. Actions (avec responsables et dates)
4. Prochaines étapes
5. Dates des prochaines réunions"""

EMAIL_PROMPT = """Rédige un email de suivi post-réunion:
Sujet: {subject}
Participants: {participants}
Décisions: {decisions}
Actions: {actions}

L'email doit être professionnel, concis et actionable."""

TRACKING_PROMPT = """Analyse l'avancement des actions de réunion:
Réunion: {meeting_subject}
Actions initiales: {initial_actions}
Statuts actuels: {current_status}

Produis un tableau de suivi avec:
1. Action
2. Responsable
3. Statut (En cours/Complétée/Bloquée)
4. Commentaire
5. Prochaine date limite"""
