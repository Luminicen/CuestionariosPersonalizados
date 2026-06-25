import { useState, useCallback } from 'react';
import type { Cuestionario, Pregunta } from '../types/quiz';

export function useQuiz() {
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [modo, setModo] = useState<'select' | 'create' | 'run' | 'results'>('select');
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState<number>(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<Record<number, string>>({});

  const crearNuevoCuestionario = useCallback((titulo: string) => {
    setCuestionario({
      titulo,
      preguntas: []
    });
    setModo('create');
    setCurrentPreguntaIndex(0);
    setRespuestasUsuario({});
  }, []);

  const cargarCuestionario = useCallback((nuevoCuestionario: Cuestionario) => {
    setCuestionario(nuevoCuestionario);
    setModo('run');
    setCurrentPreguntaIndex(0);
    setRespuestasUsuario({});
  }, []);

  const actualizarTitulo = useCallback((nuevoTitulo: string) => {
    setCuestionario(prev => {
      if (!prev) return null;
      return {
        ...prev,
        titulo: nuevoTitulo
      };
    });
  }, []);

  const guardarPregunta = useCallback((nuevaPregunta: Pregunta) => {
    setCuestionario(prev => {
      if (!prev) return null;
      const index = prev.preguntas.findIndex(p => p.numero === nuevaPregunta.numero);
      const nuevasPreguntas = [...prev.preguntas];

      if (index > -1) {
        nuevasPreguntas[index] = nuevaPregunta;
      } else {
        nuevasPreguntas.push(nuevaPregunta);
      }

      // Asegurar que queden ordenadas por número secuencial
      nuevasPreguntas.sort((a, b) => a.numero - b.numero);

      return {
        ...prev,
        preguntas: nuevasPreguntas
      };
    });
  }, []);

  const borrarPregunta = useCallback((numero: number) => {
    setCuestionario(prev => {
      if (!prev) return null;
      const nuevasPreguntas = prev.preguntas
        .filter(p => p.numero !== numero)
        // Reordenar secuencialmente los números tras eliminar
        .map((p, idx) => ({
          ...p,
          numero: idx + 1
        }));

      return {
        ...prev,
        preguntas: nuevasPreguntas
      };
    });
  }, []);

  const seleccionarRespuesta = useCallback((preguntaNumero: number, opcion: string) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [preguntaNumero]: opcion
    }));
  }, []);

  const siguientePregunta = useCallback(() => {
    if (!cuestionario) return;
    setCurrentPreguntaIndex(prev => Math.min(prev + 1, cuestionario.preguntas.length - 1));
  }, [cuestionario]);

  const anteriorPregunta = useCallback(() => {
    setCurrentPreguntaIndex(prev => Math.max(0, prev - 1));
  }, []);

  const terminarQuiz = useCallback(() => {
    setModo('results');
  }, []);

  const reiniciarQuiz = useCallback(() => {
    setRespuestasUsuario({});
    setCurrentPreguntaIndex(0);
    setModo(cuestionario && cuestionario.preguntas.length > 0 ? 'run' : 'select');
  }, [cuestionario]);

  const obtenerEstadisticas = useCallback(() => {
    if (!cuestionario) {
      return {
        totalPreguntas: 0,
        respondidas: 0,
        correctas: 0,
        incorrectas: 0,
        sinDefinir: 0,
        porcentajeAcierto: 0
      };
    }

    const totalPreguntas = cuestionario.preguntas.length;
    let respondidas = 0;
    let correctas = 0;
    let incorrectas = 0;
    let sinDefinir = 0;

    cuestionario.preguntas.forEach(p => {
      const resp = respuestasUsuario[p.numero];
      if (resp !== undefined) {
        respondidas++;
        if (p.respuesta_correcta === null) {
          sinDefinir++;
        } else if (p.respuesta_correcta === resp) {
          correctas++;
        } else {
          incorrectas++;
        }
      } else {
        if (p.respuesta_correcta === null) {
          sinDefinir++;
        }
      }
    });

    // Para preguntas que no tienen respuesta correcta definida, o si no se han respondido, no cuentan como acierto
    // El porcentaje se calcula en base a las preguntas que sí tienen respuesta correcta establecida,
    // o sobre el total de preguntas que sí se pueden evaluar.
    const preguntasEvaluables = cuestionario.preguntas.filter(p => p.respuesta_correcta !== null).length;
    const porcentajeAcierto = preguntasEvaluables > 0 ? Math.round((correctas / preguntasEvaluables) * 100) : 0;

    return {
      totalPreguntas,
      respondidas,
      correctas,
      incorrectas,
      sinDefinir,
      porcentajeAcierto
    };
  }, [cuestionario, respuestasUsuario]);

  return {
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
    obtenerEstadisticas,
    setCurrentPreguntaIndex
  };
}
