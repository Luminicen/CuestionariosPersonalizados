import React, { useState } from 'react';
import type { Cuestionario, Pregunta } from '../../types/quiz';

interface QuizCreatorProps {
  cuestionario: Cuestionario;
  actualizarTitulo: (titulo: string) => void;
  guardarPregunta: (pregunta: Pregunta) => void;
  borrarPregunta: (numero: number) => void;
  onStartQuiz: () => void;
  onCancel: () => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({
  cuestionario,
  actualizarTitulo,
  guardarPregunta,
  borrarPregunta,
  onStartQuiz,
  onCancel
}) => {
  const [selectedPreguntaNo, setSelectedPreguntaNo] = useState<number | null>(
    cuestionario.preguntas.length > 0 ? cuestionario.preguntas[0].numero : null
  );

  // Form states for the currently edited question
  const selectedPregunta = cuestionario.preguntas.find(p => p.numero === selectedPreguntaNo);

  const [preguntaTexto, setPreguntaTexto] = useState(selectedPregunta?.texto || '');
  const [opciones, setOpciones] = useState<Record<string, string>>(selectedPregunta?.opciones || { A: '', B: '' });
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<string | null>(selectedPregunta?.respuesta_correcta || null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Sync state when selected question changes
  const handleSelectPregunta = (numero: number) => {
    setSelectedPreguntaNo(numero);
    const p = cuestionario.preguntas.find(x => x.numero === numero);
    if (p) {
      setPreguntaTexto(p.texto);
      setOpciones({ ...p.opciones });
      setRespuestaCorrecta(p.respuesta_correcta);
      setErrorLocal(null);
    }
  };

  const handleAddPregunta = () => {
    const nuevoNumero = cuestionario.preguntas.length + 1;
    const nuevaP: Pregunta = {
      numero: nuevoNumero,
      texto: `Nueva Pregunta ${nuevoNumero}`,
      opciones: { A: 'Opción A', B: 'Opción B' },
      respuesta_correcta: null
    };
    guardarPregunta(nuevaP);
    setSelectedPreguntaNo(nuevoNumero);
    setPreguntaTexto(nuevaP.texto);
    setOpciones({ ...nuevaP.opciones });
    setRespuestaCorrecta(nuevaP.respuesta_correcta);
    setErrorLocal(null);
  };

  const handleRemovePregunta = (numero: number) => {
    borrarPregunta(numero);
    // Adjust selections
    const remaining = cuestionario.preguntas.filter(p => p.numero !== numero);
    if (remaining.length > 0) {
      // Select the first remaining question
      const newSel = remaining[0].numero;
      handleSelectPregunta(newSel);
    } else {
      setSelectedPreguntaNo(null);
      setPreguntaTexto('');
      setOpciones({ A: '', B: '' });
      setRespuestaCorrecta(null);
    }
    setErrorLocal(null);
  };

  const handleSavePregunta = () => {
    if (!selectedPreguntaNo) return;
    
    if (!preguntaTexto.trim()) {
      setErrorLocal('El texto de la pregunta no puede estar vacío');
      return;
    }

    const keys = Object.keys(opciones);
    if (keys.length < 2) {
      setErrorLocal('La pregunta debe tener al menos 2 opciones');
      return;
    }

    // Check if any option is empty
    for (const key of keys) {
      if (!opciones[key].trim()) {
        setErrorLocal(`El contenido de la opción ${key} no puede estar vacío`);
        return;
      }
    }

    if (respuestaCorrecta && !(respuestaCorrecta in opciones)) {
      setErrorLocal(`La respuesta correcta (${respuestaCorrecta}) debe coincidir con alguna opción`);
      return;
    }

    setErrorLocal(null);
    guardarPregunta({
      numero: selectedPreguntaNo,
      texto: preguntaTexto.trim(),
      opciones,
      respuesta_correcta: respuestaCorrecta
    });
  };

  const handleOptionChange = (key: string, value: string) => {
    setOpciones(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddOption = () => {
    const keys = Object.keys(opciones);
    if (keys.length >= 6) {
      setErrorLocal('Máximo 6 opciones permitidas por pregunta');
      return;
    }
    // Find next char
    const lastChar = keys[keys.length - 1];
    const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
    setOpciones(prev => ({
      ...prev,
      [nextChar]: ''
    }));
  };

  const handleRemoveOption = (key: string) => {
    const keys = Object.keys(opciones);
    if (keys.length <= 2) {
      setErrorLocal('Una pregunta debe tener al menos 2 opciones');
      return;
    }
    const newOpciones = { ...opciones };
    delete newOpciones[key];

    // Re-key remaining options to remain sequential (A, B, C, ...)
    const values = Object.values(newOpciones);
    const rekeyed: Record<string, string> = {};
    values.forEach((val, idx) => {
      const optionKey = String.fromCharCode(65 + idx); // 65 is 'A'
      rekeyed[optionKey] = val;
    });

    setOpciones(rekeyed);
    
    // Adjust correct answer if it was deleted or changed
    if (respuestaCorrecta === key) {
      setRespuestaCorrecta(null);
    } else if (respuestaCorrecta) {
      // Find new key of the old selected answer
      const deletedIndex = keys.indexOf(key);
      const correctIndex = keys.indexOf(respuestaCorrecta);
      if (correctIndex > deletedIndex) {
        const newCorrectKey = String.fromCharCode(respuestaCorrecta.charCodeAt(0) - 1);
        setRespuestaCorrecta(newCorrectKey);
      }
    }
  };

  const exportToJson = () => {
    if (cuestionario.preguntas.length === 0) {
      setErrorLocal('Agrega al menos una pregunta para poder exportar.');
      return;
    }

    // Clean JSON structures
    const cleanQuiz = {
      titulo: cuestionario.titulo,
      preguntas: cuestionario.preguntas.map(p => ({
        numero: p.numero,
        texto: p.texto,
        opciones: p.opciones,
        respuesta_correcta: p.respuesta_correcta
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cleanQuiz, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const sanitizedTitle = cuestionario.titulo.toLowerCase().replace(/[^a-z0-9]/gi, '_');
    downloadAnchor.setAttribute('download', `${sanitizedTitle}_cuestionario.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Top Header Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flexGrow: 1, minWidth: '300px' }}>
          <label className="form-label">Título del Cuestionario</label>
          <input
            type="text"
            className="input-text"
            value={cuestionario.titulo}
            onChange={(e) => actualizarTitulo(e.target.value)}
            placeholder="Introduce el título del cuestionario"
            style={{ fontSize: '1.25rem', fontWeight: 600 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            🏠 Inicio
          </button>
          <button
            className="btn btn-secondary"
            onClick={exportToJson}
            disabled={cuestionario.preguntas.length === 0}
          >
            📥 Exportar JSON
          </button>
          <button
            className="btn btn-primary"
            onClick={onStartQuiz}
            disabled={cuestionario.preguntas.length === 0}
          >
            ▶️ Iniciar Prueba
          </button>
        </div>
      </div>

      {/* Main Creator Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '1.5rem' }}>
        
        {/* Sidebar: Question list */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Preguntas</h3>
            <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--border-color)', borderRadius: '999px', fontWeight: 600 }}>
              {cuestionario.preguntas.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {cuestionario.preguntas.map((p) => (
              <div
                key={p.numero}
                onClick={() => handleSelectPregunta(p.numero)}
                className={`option-card ${selectedPreguntaNo === p.numero ? 'selected' : ''}`}
                style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                  <strong>{p.numero}.</strong> {p.texto}
                </div>
                <button
                  className="btn-danger"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePregunta(p.numero);
                  }}
                  title="Eliminar pregunta"
                >
                  ✕
                </button>
              </div>
            ))}
            {cuestionario.preguntas.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>
                No hay preguntas
              </p>
            )}
          </div>

          <button className="btn btn-secondary" onClick={handleAddPregunta} style={{ width: '100%' }}>
            ➕ Nueva Pregunta
          </button>
        </div>

        {/* Editing Form Panel */}
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
          {selectedPreguntaNo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.4rem' }}>
                  Editando Pregunta {selectedPreguntaNo}
                </h3>
                <button className="btn btn-primary" onClick={handleSavePregunta} style={{ padding: '0.5rem 1.25rem' }}>
                  💾 Guardar Pregunta
                </button>
              </div>

              {errorLocal && (
                <div className="alert-box alert-error fade-in" style={{ padding: '0.75rem' }}>
                  {errorLocal}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Texto de la Pregunta</label>
                <textarea
                  className="input-text"
                  value={preguntaTexto}
                  onChange={(e) => setPreguntaTexto(e.target.value)}
                  placeholder="Escribe el enunciado de la pregunta aquí..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Opciones de Respuesta</label>
                  <button className="btn btn-secondary" onClick={handleAddOption} style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    ➕ Agregar Opción
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.keys(opciones).map((key) => (
                    <div key={key} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button
                        className={`option-letter ${respuestaCorrecta === key ? 'correct' : ''}`}
                        onClick={() => setRespuestaCorrecta(key)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem',
                          background: respuestaCorrecta === key ? 'var(--success)' : 'var(--bg-tertiary)',
                          color: respuestaCorrecta === key ? 'white' : 'var(--text-secondary)'
                        }}
                        title={respuestaCorrecta === key ? "Respuesta Correcta" : "Marcar como Correcta"}
                      >
                        {key}
                      </button>
                      <input
                        type="text"
                        className="input-text"
                        value={opciones[key]}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        placeholder={`Introduce la descripción de la opción ${key}`}
                        style={{ flexGrow: 1 }}
                      />
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveOption(key)}
                        disabled={Object.keys(opciones).length <= 2}
                        style={{ padding: '0.75rem' }}
                        title="Eliminar opción"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Respuesta Correcta</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {respuestaCorrecta ? `Opción seleccionada: ${respuestaCorrecta}` : 'Ninguna seleccionada (se puede completar después)'}
                  </p>
                </div>
                {respuestaCorrecta && (
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setRespuestaCorrecta(null)}>
                    Desmarcar
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✏️</div>
              <h3>Editor de Preguntas</h3>
              <p style={{ textAlign: 'center', maxWidth: '300px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Selecciona una pregunta de la lista de la izquierda para comenzar a editarla, o haz clic en "Nueva Pregunta" para crear una.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
