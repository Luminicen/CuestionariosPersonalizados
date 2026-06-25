import React from 'react';
import type { Cuestionario } from '../../types/quiz';

interface QuizResultsProps {
  cuestionario: Cuestionario;
  respuestasUsuario: Record<number, string>;
  obtenerEstadisticas: () => {
    totalPreguntas: number;
    respondidas: number;
    correctas: number;
    incorrectas: number;
    sinDefinir: number;
    porcentajeAcierto: number;
  };
  reiniciarQuiz: () => void;
  onEditQuiz: () => void;
  onCancel: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  cuestionario,
  respuestasUsuario,
  obtenerEstadisticas,
  reiniciarQuiz,
  onEditQuiz,
  onCancel
}) => {
  const stats = obtenerEstadisticas();

  // SVG dash offset calculation
  // Radius: 80, Circumference: 2 * PI * 80 = 502.65
  const strokeDashoffset = 502.65 - (502.65 * stats.porcentajeAcierto) / 100;

  return (
    <div className="glass-panel fade-in" style={{ padding: '2.5rem', maxWidth: '850px', margin: '2rem auto', width: '100%' }}>
      <h2 style={{ fontSize: '2.2rem', textAlign: 'center', marginBottom: '0.5rem' }} className="title-gradient">
        Resultados de la Prueba
      </h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>
        Resumen general y desglose detallado de tu intento para: <strong>{cuestionario.titulo}</strong>
      </p>

      {/* SVG Circular score graph and Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}>
        {/* SVG Circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="circular-progress">
            <svg>
              <defs>
                <linearGradient id="gradient-success-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--success)" />
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r="80" className="bg-circle" />
              <circle
                cx="90"
                cy="90"
                r="80"
                className="fg-circle"
                style={{ strokeDashoffset }}
              />
            </svg>
            <div className="circular-progress-text">
              <span className="circular-progress-val">{stats.porcentajeAcierto}%</span>
              <div className="circular-progress-label">Aciertos</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }}>
            {stats.correctas} de {cuestionario.preguntas.filter(p => p.respuesta_correcta !== null).length} correctas
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Total Preguntas</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>{stats.totalPreguntas}</strong>
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Respondidas</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>{stats.respondidas}</strong>
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Correctas</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--success)' }}>{stats.correctas}</strong>
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Incorrectas</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--error)' }}>{stats.incorrectas}</strong>
          </div>
          {stats.sinDefinir > 0 && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center', gridColumn: 'span 1' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>Sin clave definida</span>
              <strong style={{ fontSize: '1.75rem', color: 'var(--warning)' }}>{stats.sinDefinir}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown review section */}
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Revisión de Respuestas
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {cuestionario.preguntas.map((p) => {
          const resp = respuestasUsuario[p.numero];
          const isCorrect = p.respuesta_correcta !== null && resp === p.respuesta_correcta;
          const hasCorrectKey = p.respuesta_correcta !== null;

          let statusBorder = 'var(--border-color)';
          let statusText = '';
          let statusColor = 'var(--text-secondary)';

          if (resp !== undefined) {
            if (hasCorrectKey) {
              if (isCorrect) {
                statusBorder = 'var(--success-border)';
                statusText = '✓ Correcto';
                statusColor = 'var(--success)';
              } else {
                statusBorder = 'var(--error-border)';
                statusText = '✗ Incorrecto';
                statusColor = 'var(--error)';
              }
            } else {
              statusText = 'Respondido (Sin evaluar)';
              statusColor = 'var(--warning)';
            }
          } else {
            statusText = 'No respondido';
            statusColor = 'var(--text-muted)';
          }

          return (
            <div
              key={p.numero}
              style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid',
                borderColor: statusBorder,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                  {p.numero}. {p.texto}
                </span>
                <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.85rem' }}>
                  {statusText}
                </span>
              </div>

              {/* Show options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
                {Object.keys(p.opciones).map((key) => {
                  const val = p.opciones[key];
                  const isThisSelected = resp === key;
                  const isThisCorrect = p.respuesta_correcta === key;

                  let optionStyle: React.CSSProperties = {
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  };

                  if (isThisSelected) {
                    if (hasCorrectKey) {
                      if (isCorrect) {
                        optionStyle.background = 'var(--success-bg)';
                        optionStyle.borderColor = 'var(--success)';
                      } else {
                        optionStyle.background = 'var(--error-bg)';
                        optionStyle.borderColor = 'var(--error)';
                      }
                    } else {
                      optionStyle.background = 'var(--primary-glow)';
                      optionStyle.borderColor = 'var(--primary)';
                    }
                  } else if (isThisCorrect && hasCorrectKey) {
                    // Highlight correct key even if user didn't pick it
                    optionStyle.background = 'var(--success-bg)';
                    optionStyle.borderColor = 'var(--success)';
                  }

                  return (
                    <div key={key} style={optionStyle}>
                      <span style={{
                        fontWeight: 700,
                        background: 'var(--bg-tertiary)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}>{key}</span>
                      <span style={{ flexGrow: 1 }}>{val}</span>
                      {isThisSelected && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Tu selección</span>}
                      {isThisCorrect && hasCorrectKey && <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Correcta</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          🏠 Inicio
        </button>
        <button className="btn btn-secondary" onClick={onEditQuiz}>
          ✏️ Editar Cuestionario
        </button>
        <button className="btn btn-primary" onClick={reiniciarQuiz} style={{ flexGrow: 1 }}>
          🔄 Reiniciar Intento
        </button>
      </div>
    </div>
  );
};
