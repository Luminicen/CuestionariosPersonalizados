import React, { useState } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { ImportExport } from './components/quiz/ImportExport';
import { QuizCreator } from './components/quiz/QuizCreator';
import { QuizRunner } from './components/quiz/QuizRunner';
import { QuizResults } from './components/quiz/QuizResults';
import type { Cuestionario } from './types/quiz';

const DEMO_QUIZ: Cuestionario = {
  titulo: 'Trivia de Informática y Sistemas Operativos',
  preguntas: [
    {
      numero: 1,
      texto: 'Las siglas "CPU" en informática hacen referencia a...',
      opciones: {
        A: 'Central Processing Unit (Unidad Central de Procesamiento)',
        B: 'Computer Personal Unit (Unidad Personal de Computadora)',
        C: 'Control Process Utility (Utilidad de Control de Procesos)',
        D: 'Core Processor Unified (Procesador de Núcleo Unificado)'
      },
      respuesta_correcta: 'A'
    },
    {
      numero: 2,
      texto: 'En Git, ¿cuál de los siguientes comandos se utiliza para crear una nueva rama local y cambiarse a ella inmediatamente?',
      opciones: {
        A: 'git branch -d <nombre-rama>',
        B: 'git checkout -b <nombre-rama>',
        C: 'git commit -m <nombre-rama>',
        D: 'git merge <nombre-rama>'
      },
      "respuesta_correcta": "B"
    },
    {
      numero: 3,
      texto: '¿Cuál de las siguientes memorias es volátil (pierde los datos al apagarse el equipo)?',
      opciones: {
        A: 'Memoria ROM',
        B: 'Memoria RAM',
        C: 'Disco de Estado Sólido (SSD)',
        D: 'Memoria Flash USB'
      },
      respuesta_correcta: 'B'
    },
    {
      numero: 4,
      texto: 'Los archivos con registros de longitud variable...',
      opciones: {
        A: 'Ocupan menos espacio que los registros con longitud fija',
        B: 'Ocupan más espacio que los registros con longitud fija',
        C: 'Ocupan el mismo espacio que los registros con longitud fija',
        D: 'Ninguna de las anteriores'
      },
      respuesta_correcta: 'A'
    }
  ]
};

const App: React.FC = () => {
  const {
    cuestionario,
    modo,
    currentPreguntaIndex,
    respuestasUsuario,
    setModo,
    crearNuevoCuestionario,
    cargarCuestionario,
    actualizarTitulo,
    guardarPregunta,
    borrarPregunta,
    seleccionarRespuesta,
    siguientePregunta,
    anteriorPregunta,
    terminarQuiz,
    reiniciarQuiz,
    obtenerEstadisticas
  } = useQuiz();

  const [isImporting, setIsImporting] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [showTitleModal, setShowTitleModal] = useState(false);

  const handleLoadDemo = () => {
    cargarCuestionario(DEMO_QUIZ);
    setShowDemoAlert(true);
    setTimeout(() => setShowDemoAlert(false), 3000);
  };

  const handleStartManualCreate = () => {
    setShowTitleModal(true);
  };

  const handleConfirmManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;
    crearNuevoCuestionario(newQuizTitle.trim());
    setShowTitleModal(false);
    setNewQuizTitle('');
  };

  return (
    <>
      {/* Background Animated Glows */}
      <div className="bg-glow-container" aria-hidden="true">
        <div className="bg-glow-orb orb-1"></div>
        <div className="bg-glow-orb orb-2"></div>
      </div>

      {/* Header bar */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">📊</div>
          <span className="title-gradient">Cuestionarios Personalizados</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a
            href="https://github.com/Luminicen/CuestionariosPersonalizados"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, padding: '0.4rem 0.8rem' }}
            className="glass-panel-interactive btn-secondary btn"
          >
            GitHub Repo
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-container">
        
        {/* Demo Loaded Banner */}
        {showDemoAlert && (
          <div className="alert-box alert-success fade-in" style={{ maxWidth: '600px', margin: '0 auto 1.5rem', width: '100%' }}>
            ✓ ¡Cuestionario de prueba cargado correctamente! Iniciando trivia...
          </div>
        )}

        {/* Dashboard Select Mode */}
        {modo === 'select' && !isImporting && (
          <div className="fade-in" style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '650px' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>
                Cuestionarios Interactivos <br />
                <span className="title-gradient">a tu Medida</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Prepara exámenes de opción múltiple, súbelos como archivos JSON, o créalos desde nuestra moderna interfaz interactiva.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', maxWidth: '900px', marginBottom: '3rem' }}>
              
              {/* Option 1: Load JSON */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>📂</div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Cargar Archivo JSON</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                    Sube un archivo de cuestionario previamente exportado en formato JSON que cumpla el esquema requerido.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsImporting(true)} style={{ width: '100%' }}>
                  Subir archivo .json
                </button>
              </div>

              {/* Option 2: Manual Create */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>✏️</div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Creación Manual</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                    Crea preguntas personalizadas con opciones múltiples, define la clave de respuesta correcta y descárgalo.
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={handleStartManualCreate} style={{ width: '100%' }}>
                  Comenzar a escribir
                </button>
              </div>

            </div>

            {/* Quick Demo Option */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                ¿Quieres probar la aplicación de inmediato?
              </p>
              <button className="btn btn-secondary" onClick={handleLoadDemo} style={{ border: '1px dashed var(--primary)' }}>
                🚀 Cargar Trivia de Demostración
              </button>
            </div>
          </div>
        )}

        {/* Modal input for manual creation title */}
        {showTitleModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1.5rem'
          }}>
            <form onSubmit={handleConfirmManualCreate} className="glass-panel fade-in" style={{ padding: '2.5rem', maxWidth: '450px', width: '100%' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Título del Cuestionario</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Escribe un nombre identificativo para tu nuevo cuestionario personalizado.
              </p>
              <div className="form-group">
                <input
                  type="text"
                  required
                  className="input-text"
                  placeholder="Ej: Parcial de Base de Datos"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTitleModal(false)} style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Render importing screen */}
        {isImporting && (
          <ImportExport
            onImport={(quiz) => {
              cargarCuestionario(quiz);
              setIsImporting(false);
            }}
            onCancel={() => setIsImporting(false)}
          />
        )}

        {/* Render creator mode */}
        {modo === 'create' && cuestionario && (
          <QuizCreator
            cuestionario={cuestionario}
            actualizarTitulo={actualizarTitulo}
            guardarPregunta={guardarPregunta}
            borrarPregunta={borrarPregunta}
            onStartQuiz={() => setModo('run')}
            onCancel={() => setModo('select')}
          />
        )}

        {/* Render runner mode */}
        {modo === 'run' && cuestionario && (
          <QuizRunner
            cuestionario={cuestionario}
            currentPreguntaIndex={currentPreguntaIndex}
            respuestasUsuario={respuestasUsuario}
            seleccionarRespuesta={seleccionarRespuesta}
            siguientePregunta={siguientePregunta}
            anteriorPregunta={anteriorPregunta}
            terminarQuiz={terminarQuiz}
            onCancel={() => setModo('select')}
          />
        )}

        {/* Render results mode */}
        {modo === 'results' && cuestionario && (
          <QuizResults
            cuestionario={cuestionario}
            respuestasUsuario={respuestasUsuario}
            obtenerEstadisticas={obtenerEstadisticas}
            reiniciarQuiz={reiniciarQuiz}
            onEditQuiz={() => setModo('create')}
            onCancel={() => setModo('select')}
          />
        )}

      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
        © {new Date().getFullYear()} Cuestionarios Personalizados. Hecho con React, Vite y TypeScript para GitHub Pages.
      </footer>
    </>
  );
};

export default App;
