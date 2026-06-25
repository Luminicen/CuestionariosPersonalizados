import type { Cuestionario, Pregunta } from '../types/quiz';

export function validarCuestionario(data: any): Cuestionario {
  if (data === null || data === undefined) {
    throw new Error('El cuestionario no puede ser nulo o vacío');
  }

  if (typeof data !== 'object') {
    throw new Error('El cuestionario no puede ser nulo o vacío');
  }

  if (!('titulo' in data)) {
    throw new Error('El campo "titulo" es obligatorio');
  }

  if (typeof data.titulo !== 'string') {
    throw new Error('El campo "titulo" debe ser un texto');
  }

  if (!('preguntas' in data)) {
    throw new Error('El campo "preguntas" es obligatorio');
  }

  if (!Array.isArray(data.preguntas)) {
    throw new Error('El campo "preguntas" debe ser una lista');
  }

  const preguntasValidadas: Pregunta[] = [];

  for (let i = 0; i < data.preguntas.length; i++) {
    const p = data.preguntas[i];
    const pos = i + 1;

    if (p === null || p === undefined || typeof p !== 'object') {
      throw new Error(`La pregunta en posición ${pos} no es válida`);
    }

    // Validar número
    if (!('numero' in p) || p.numero === undefined || p.numero === null) {
      throw new Error(`La pregunta ${pos} debe tener un número identificador entero`);
    }

    if (typeof p.numero !== 'number' || !Number.isInteger(p.numero)) {
      throw new Error(`La pregunta en posición ${pos} debe tener un número identificador entero`);
    }

    // Validar texto
    if (!('texto' in p) || p.texto === undefined || p.texto === null || typeof p.texto !== 'string') {
      throw new Error(`La pregunta ${p.numero} debe tener un texto descriptivo`);
    }

    // Validar opciones
    if (!('opciones' in p) || p.opciones === null || typeof p.opciones !== 'object' || Array.isArray(p.opciones)) {
      throw new Error(`La pregunta ${p.numero} debe incluir un objeto con las opciones de respuesta`);
    }

    const opcionesKeys = Object.keys(p.opciones);
    if (opcionesKeys.length < 2) {
      throw new Error(`La pregunta ${p.numero} debe tener al menos 2 opciones`);
    }

    // Validar respuesta_correcta
    if (!('respuesta_correcta' in p)) {
      throw new Error(`La pregunta ${p.numero} debe incluir el campo "respuesta_correcta"`);
    }

    const rc = p.respuesta_correcta;
    if (rc !== null) {
      if (typeof rc !== 'string') {
        throw new Error(`La respuesta correcta de la pregunta ${p.numero} debe ser un texto indicando la letra seleccionada (o null)`);
      }

      if (!(rc in p.opciones)) {
        throw new Error(`La respuesta correcta "${rc}" no coincide con ninguna de las opciones disponibles (${opcionesKeys.join(', ')})`);
      }
    }

    preguntasValidadas.push({
      numero: p.numero,
      texto: p.texto,
      opciones: { ...p.opciones },
      respuesta_correcta: rc
    });
  }

  return {
    titulo: data.titulo,
    preguntas: preguntasValidadas
  };
}
