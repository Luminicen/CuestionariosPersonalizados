export interface Pregunta {
  numero: number;
  texto: string;
  opciones: {
    [key: string]: string; // E.g., "A", "B", "C", "D"
  };
  respuesta_correcta: string | null; // E.g., "A", "B" or null if not set
}

export interface Cuestionario {
  titulo: string;
  preguntas: Pregunta[];
}
