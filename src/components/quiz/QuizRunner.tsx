import React from 'react';
import type { Cuestionario } from '../../types/quiz';

interface QuizRunnerProps {
  cuestionario: Cuestionario;
  currentPreguntaIndex: number;
  respuestasUsuario: Record<number, string>;
  seleccionarRespuesta: (preguntaNumero: number, opcion: string) => void;
  siguientePregunta: () => void;
  anteriorPregunta: () => void;
  terminarQuiz: () => void;
  onCancel: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  cuestionario,
  currentPreguntaIndex,
  respuestasUsuario,
  seleccionarRespuesta,
  siguientePregunta,
  anteriorPregunta,
  terminarQuiz,
  onCancel
}) => {
  const totalPreguntas = cuestionario.preguntas.length;
  if (totalPreguntas === 0) return null;

  const pregunta = cuestionario.preguntas[currentPreguntaIndex];
  const seleccion = respuestasUsuario[pregunta.numero];
  const hasCorrectAnswerDefined = pregunta.respuesta_correcta !== null;
  const isFirst = currentPreguntaIndex === 0;
  const isLast = currentPreguntaIndex === totalPreguntas - 1;
  const progressPercent = Math.round(((currentPreguntaIndex + 1) / totalPreguntas) * 100);

  const handleSelectOption = (key: string) => {
    // If they already answered and there is immediate feedback, lock it so they don't change it,
    // or let them change it? Usually, locking after selecting makes feedback more meaningful,
    // but in case they made a mistake we can let them change if not locked, or just lock it if there's immediate feedback.
    // Let's lock if there's immediate feedback, so they see their score result clearly.
    if (seleccion !== undefined && hasCorrectAnswerDefined) return;
    seleccionarRespuesta(pregunta.numero, key);
  };

  return (
    <div className="glass-panel fade-in" style={{ padding: '2.5rem', maxWidth: '800px', margin: '2rem auto', width: '100%' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-secondary" onClick={onCancel} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          🏠 Salir
        </button>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Pregunta {currentPreguntaIndex + 1} de {totalPreguntas}
        </span>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        {cuestionario.titulo}
      </h2>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Question Card */}
      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, textAlign: 'left' }}>
          {pregunta.texto}
        </h3>
      </div>

      {/* Option Choices */}
      <div className="options-grid">
        {Object.keys(pregunta.opciones).map((key) => {
          const text = pregunta.opciones[key];
          const isThisSelected = seleccion === key;
          
          let cardClass = '';
          if (seleccion !== undefined) {
            if (hasCorrectAnswerDefined) {
              if (key === pregunta.respuesta_correcta) {
                cardClass = 'correct'; // Show correct key in green
              } else if (isThisSelected) {
                cardClass = 'incorrect'; // User selected incorrect key in red
              }
            } else if (isThisSelected) {
              cardClass = 'selected'; // Just highlight selection
            }
          }

          return (
            <div
              key={key}
              onClick={() => handleSelectOption(key)}
              className={`option-card ${cardClass}`}
              style={{
                cursor: (seleccion !== undefined && hasCorrectAnswerDefined) ? 'not-allowed' : 'pointer'
              }}
            >
              <div className="option-letter">{key}</div>
              <div className="option-text">{text}</div>
            </div>
          );
        })}
      </div>

      {/* Immediate feedback message */}
      {seleccion !== undefined && hasCorrectAnswerDefined && (
        <div className="fade-in" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          {seleccion === pregunta.respuesta_correcta ? (
            <span style={{ color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              ✓ ¡Respuesta Correcta!
            </span>
          ) : (
            <span style={{ color: 'var(--error)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              ✗ Respuesta Incorrecta. La correcta es la ({pregunta.respuesta_correcta})
            </span>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', gap: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={anteriorPregunta}
          disabled={isFirst}
          style={{ flex: 1 }}
        >
          ← Anterior
        </button>

        {isLast ? (
          <button
            className="btn btn-primary"
            onClick={terminarQuiz}
            disabled={seleccion === undefined}
            style={{ flex: 1 }}
          >
            Finalizar Cuestionario
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={siguientePregunta}
            disabled={seleccion === undefined}
            style={{ flex: 1 }}
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
};
