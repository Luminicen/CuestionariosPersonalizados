import { describe, it, expect } from 'vitest';
import { validarCuestionario } from '../quizValidator';

describe('validarCuestionario', () => {
  it('debería aceptar un cuestionario JSON 100% válido (happy path)', () => {
    const validQuiz = {
      titulo: 'Examen de Sistemas Operativos',
      preguntas: [
        {
          numero: 1,
          texto: '¿Qué tipo de registros ocupan menos espacio?',
          opciones: {
            A: 'Registros de longitud variable',
            B: 'Registros de longitud fija',
            C: 'Ocupan el mismo espacio',
            D: 'Ninguna de las anteriores'
          },
          respuesta_correcta: 'A'
        },
        {
          numero: 2,
          texto: 'Pregunta sin respuesta correcta definida',
          opciones: {
            A: 'Opción A',
            B: 'Opción B'
          },
          respuesta_correcta: null
        }
      ]
    };

    expect(() => validarCuestionario(validQuiz)).not.toThrow();
    const result = validarCuestionario(validQuiz);
    expect(result.titulo).toBe('Examen de Sistemas Operativos');
    expect(result.preguntas).toHaveLength(2);
  });

  it('debería rechazar un objeto vacío o nulo', () => {
    expect(() => validarCuestionario(null)).toThrow('El cuestionario no puede ser nulo o vacío');
    expect(() => validarCuestionario(undefined)).toThrow('El cuestionario no puede ser nulo o vacío');
    expect(() => validarCuestionario({})).toThrow('El campo "titulo" es obligatorio');
  });

  it('debería rechazar si falta el título o no es un string', () => {
    const sinTitulo = {
      preguntas: []
    };
    const tituloInvalido = {
      titulo: 123,
      preguntas: []
    };

    expect(() => validarCuestionario(sinTitulo)).toThrow('El campo "titulo" es obligatorio');
    expect(() => validarCuestionario(tituloInvalido)).toThrow('El campo "titulo" debe ser un texto');
  });

  it('debería rechazar si falta preguntas o no es un array', () => {
    const sinPreguntas = {
      titulo: 'Mi Quiz'
    };
    const preguntasNoArray = {
      titulo: 'Mi Quiz',
      preguntas: 'no-un-array'
    };

    expect(() => validarCuestionario(sinPreguntas)).toThrow('El campo "preguntas" es obligatorio');
    expect(() => validarCuestionario(preguntasNoArray)).toThrow('El campo "preguntas" debe ser una lista');
  });

  it('debería rechazar si una pregunta no tiene número o no es entero', () => {
    const nroFaltante = {
      titulo: 'Quiz',
      preguntas: [
        {
          texto: 'Texto de la pregunta',
          opciones: { A: '1', B: '2' },
          respuesta_correcta: null
        }
      ]
    };
    const nroNoEntero = {
      titulo: 'Quiz',
      preguntas: [
        {
          numero: 1.5,
          texto: 'Texto de la pregunta',
          opciones: { A: '1', B: '2' },
          respuesta_correcta: null
        }
      ]
    };

    expect(() => validarCuestionario(nroFaltante)).toThrow('La pregunta 1 debe tener un número identificador entero');
    expect(() => validarCuestionario(nroNoEntero)).toThrow('La pregunta en posición 1 debe tener un número identificador entero');
  });

  it('debería rechazar si una pregunta no tiene texto o no es string', () => {
    const textoFaltante = {
      titulo: 'Quiz',
      preguntas: [
        {
          numero: 1,
          opciones: { A: '1', B: '2' },
          respuesta_correcta: null
        }
      ]
    };

    expect(() => validarCuestionario(textoFaltante)).toThrow('La pregunta 1 debe tener un texto descriptivo');
  });

  it('debería rechazar si opciones no es un objeto o tiene menos de 2 opciones', () => {
    const opcionesFaltantes = {
      titulo: 'Quiz',
      preguntas: [
        {
          numero: 1,
          texto: 'Pregunta',
          respuesta_correcta: null
        }
      ]
    };
    const pocasOpciones = {
      titulo: 'Quiz',
      preguntas: [
        {
          numero: 1,
          texto: 'Pregunta',
          opciones: { A: 'Sola' },
          respuesta_correcta: null
        }
      ]
    };

    expect(() => validarCuestionario(opcionesFaltantes)).toThrow('La pregunta 1 debe incluir un objeto con las opciones de respuesta');
    expect(() => validarCuestionario(pocasOpciones)).toThrow('La pregunta 1 debe tener al menos 2 opciones');
  });

  it('debería rechazar si la respuesta correcta no coincide con las opciones o es un tipo inválido', () => {
    const respuestaInexistente = {
      titulo: 'Quiz',
      preguntas: [
        {
          numero: 1,
          texto: 'Pregunta',
          opciones: { A: 'Op A', B: 'Op B' },
          respuesta_correcta: 'C'
        }
      ]
    };
    const respuestaTipoInvalido = {
      titulo: 'Quiz',
      preguntas: [
        {
          numero: 1,
          texto: 'Pregunta',
          opciones: { A: 'Op A', B: 'Op B' },
          respuesta_correcta: 123
        }
      ]
    };

    expect(() => validarCuestionario(respuestaInexistente)).toThrow('La respuesta correcta "C" no coincide con ninguna de las opciones disponibles (A, B)');
    expect(() => validarCuestionario(respuestaTipoInvalido)).toThrow('La respuesta correcta de la pregunta 1 debe ser un texto indicando la letra seleccionada (o null)');
  });
});
