import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';
import type { Cuestionario } from '../../types/quiz';

const mockCuestionario: Cuestionario = {
  titulo: 'Cuestionario de Prueba',
  preguntas: [
    {
      numero: 1,
      texto: 'Pregunta 1',
      opciones: { A: 'Opción 1', B: 'Opción 2' },
      respuesta_correcta: 'A'
    },
    {
      numero: 2,
      texto: 'Pregunta 2',
      opciones: { A: 'Opción A', B: 'Opción B', C: 'Opción C' },
      respuesta_correcta: 'B'
    }
  ]
};

describe('useQuiz hook', () => {
  it('debería inicializarse con el estado por defecto', () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.cuestionario).toBeNull();
    expect(result.current.modo).toBe('select');
    expect(result.current.currentPreguntaIndex).toBe(0);
    expect(result.current.respuestasUsuario).toEqual({});
  });

  it('debería poder crear un cuestionario vacío con un título', () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.crearNuevoCuestionario('Nuevo Cuestionario');
    });

    expect(result.current.cuestionario).not.toBeNull();
    expect(result.current.cuestionario?.titulo).toBe('Nuevo Cuestionario');
    expect(result.current.cuestionario?.preguntas).toEqual([]);
    expect(result.current.modo).toBe('create');
  });

  it('debería poder cargar un cuestionario existente', () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.cargarCuestionario(mockCuestionario);
    });

    expect(result.current.cuestionario).toEqual(mockCuestionario);
    expect(result.current.modo).toBe('run');
    expect(result.current.currentPreguntaIndex).toBe(0);
    expect(result.current.respuestasUsuario).toEqual({});
  });

  it('debería gestionar la navegación de preguntas y responder', () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.cargarCuestionario(mockCuestionario);
    });

    // Responder la primera pregunta
    act(() => {
      result.current.seleccionarRespuesta(1, 'A');
    });
    expect(result.current.respuestasUsuario[1]).toBe('A');

    // Siguiente pregunta
    act(() => {
      result.current.siguientePregunta();
    });
    expect(result.current.currentPreguntaIndex).toBe(1);

    // Responder la segunda pregunta
    act(() => {
      result.current.seleccionarRespuesta(2, 'C');
    });
    expect(result.current.respuestasUsuario[2]).toBe('C');

    // Retroceder pregunta
    act(() => {
      result.current.anteriorPregunta();
    });
    expect(result.current.currentPreguntaIndex).toBe(0);
  });

  it('debería calcular correctamente la puntuación al terminar el quiz', () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.cargarCuestionario(mockCuestionario);
    });

    // Responder 1 correcta (A) y 1 incorrecta (C, la correcta es B)
    act(() => {
      result.current.seleccionarRespuesta(1, 'A');
      result.current.seleccionarRespuesta(2, 'C');
    });

    act(() => {
      result.current.terminarQuiz();
    });

    expect(result.current.modo).toBe('results');
    
    // Obtener estadísticas
    const stats = result.current.obtenerEstadisticas();
    expect(stats.totalPreguntas).toBe(2);
    expect(stats.respondidas).toBe(2);
    expect(stats.correctas).toBe(1);
    expect(stats.incorrectas).toBe(1);
    expect(stats.sinDefinir).toBe(0); // Ambas tienen respuesta_correcta definida
    expect(stats.porcentajeAcierto).toBe(50);
  });

  it('debería permitir editar preguntas (crear/modificar/eliminar)', () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.crearNuevoCuestionario('Cuestionario Editable');
    });

    // Agregar pregunta
    const nuevaPregunta = {
      numero: 1,
      texto: '¿Pregunta agregada?',
      opciones: { A: 'Sí', B: 'No' },
      respuesta_correcta: 'A'
    };

    act(() => {
      result.current.guardarPregunta(nuevaPregunta);
    });

    expect(result.current.cuestionario?.preguntas).toHaveLength(1);
    expect(result.current.cuestionario?.preguntas[0]).toEqual(nuevaPregunta);

    // Modificar pregunta
    const preguntaModificada = {
      ...nuevaPregunta,
      texto: '¿Pregunta modificada?'
    };

    act(() => {
      result.current.guardarPregunta(preguntaModificada);
    });

    expect(result.current.cuestionario?.preguntas).toHaveLength(1);
    expect(result.current.cuestionario?.preguntas[0].texto).toBe('¿Pregunta modificada?');

    // Eliminar pregunta
    act(() => {
      result.current.borrarPregunta(1);
    });

    expect(result.current.cuestionario?.preguntas).toHaveLength(0);
  });
});
