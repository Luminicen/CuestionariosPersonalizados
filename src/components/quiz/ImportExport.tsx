import React, { useState, useRef } from 'react';
import type { Cuestionario } from '../../types/quiz';
import { validarCuestionario } from '../../validators/quizValidator';

interface ImportExportProps {
  onImport: (quiz: Cuestionario) => void;
  onCancel: () => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ onImport, onCancel }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('El archivo seleccionado debe ser un archivo JSON (.json)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);
        const validQuiz = validarCuestionario(jsonContent);
        setError(null);
        onImport(validQuiz);
      } catch (err: any) {
        setError(err.message || 'Error al analizar el archivo JSON.');
      }
    };
    reader.onerror = () => {
      setError('Error de lectura del archivo.');
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-panel fade-in" style={{ padding: '2.5rem', maxWidth: '600px', margin: '2rem auto', width: '100%' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        Importar Cuestionario
      </h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
        Carga un archivo JSON que cumpla con el esquema requerido para iniciar el cuestionario.
      </p>

      {error && (
        <div className="alert-box alert-error fade-in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>Error de Validación:</strong>
            <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>{error}</p>
          </div>
        </div>
      )}

      <div
        className={`glass-panel ${isDragOver ? 'selected' : ''}`}
        style={{
          border: '2px dashed var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragOver ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.02)',
          transition: 'all var(--transition-fast)',
          marginBottom: '2rem'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          style={{ display: 'none' }}
        />
        
        <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block', color: 'var(--primary)' }}>
          📥
        </div>
        
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Arrastra tu archivo aquí
        </h3>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          o haz clic para explorar en tu computadora
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
          Volver
        </button>
      </div>
    </div>
  );
};
