# 📊 Cuestionarios Personalizados

Una aplicación web moderna, interactiva y premium para crear, realizar y compartir cuestionarios de opción múltiple. Construida utilizando **React + Vite + TypeScript**, estilizada con **CSS Vanilla** (diseño Glassmorphic adaptable) y testeada con **Vitest + React Testing Library**.

Desplegable de forma automatizada mediante GitHub Actions en **GitHub Pages**.

---

## 🎯 Características Principales

1. **Modo Creación Manual**:
   - Agrega, modifica y elimina preguntas dinámicamente.
   - Configura de 2 a 6 opciones de respuesta por pregunta.
   - Define opcionalmente la respuesta correcta para habilitar feedback inmediato.
   - Modifica el título y exporta tus cuestionarios creados como archivos `.json` que cumplen con el esquema oficial.

2. **Modo Archivo JSON**:
   - Arrastra y suelta (Drag and Drop) archivos `.json` directamente en la interfaz.
   - Validación estricta del esquema de datos con alertas explicativas detalladas si el formato es inválido.

3. **Modo Resolución Interactiva**:
   - Vista optimizada de preguntas una por una con barra de progreso interactiva.
   - Si la respuesta correcta está predefinida, recibe feedback visual inmediato (Acierto en Verde / Error en Rojo).
   - Animaciones fluidas al avanzar o retroceder de pregunta.

4. **Modo Resultados**:
   - Gráfico de porcentaje de aciertos animado mediante SVG.
   - Desglose detallado de cada pregunta comparando la opción seleccionada con la respuesta correcta.
   - Opción para reiniciar el cuestionario o volver a editarlo en caliente.

5. **Alineación de Diseño**:
   - Diseño moderno optimizado en modo oscuro por defecto (con soporte nativo adaptable).
   - Efecto Glassmorphism traslúcido, fuentes personalizadas y micro-interacciones hover.

---

## 📁 Estructura del Archivo JSON de Entrada

Cualquier archivo importado debe respetar **estrictamente** la siguiente estructura. De lo contrario, la aplicación rechazará el archivo mostrando el campo y el motivo exacto del fallo:

```json
{
  "titulo": "Examen de Sistemas Operativos",
  "preguntas": [
    {
      "numero": 1,
      "texto": "Los archivos con registros de longitud variable...",
      "opciones": {
        "A": "ocupan menos espacio que los registros con longitud fija",
        "B": "ocupan más espacio que los registros con longitud fija",
        "C": "ocupan el mismo espacio que los registros con longitud fija",
        "D": "ninguna de las anteriores"
      },
      "respuesta_correcta": "A"
    }
  ]
}
```

### Reglas de Validación
- `titulo` (string, obligatorio): Nombre principal de la trivia.
- `preguntas` (array, obligatorio): Lista de preguntas indexadas.
- Para cada pregunta:
  - `numero` (entero, obligatorio): Identificador secuencial correlativo.
  - `texto` (string, obligatorio): Enunciado de la pregunta.
  - `opciones` (objeto, obligatorio): Claves de opciones (mínimo 2 opciones, ej: A, B, C, D).
  - `respuesta_correcta` (string | null): Letra de la opción correcta o `null` si aún no está definida. Si se establece, debe existir obligatoriamente en las claves del objeto `opciones`.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos Previos
- Node.js (versión 20 o superior recomendada)
- npm (gestor de paquetes de Node)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:5173/](http://localhost:5173/) para usar la aplicación.

### 3. Compilar para producción
```bash
npm run build
```
Este comando verificará los tipos de TypeScript (`tsc`) y compilará los recursos listos para producción en la carpeta `dist/`.

---

## 🧪 Pruebas Unitarias e Integración (TDD)

Hemos implementado pruebas detalladas utilizando **Vitest** y **React Testing Library** cubriendo validación de esquemas JSON, casos límite, estructura de datos y la lógica del gestor de estados `useQuiz`.

Ejecutar las pruebas en modo de observación continua:
```bash
npm run test
```

Ejecutar la suite completa de pruebas una sola vez (ideal para CI):
```bash
npm run test:run
```

---

## 🌐 Despliegue en GitHub Pages

Esta aplicación está configurada para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

Al empujar cambios a la rama principal `main`:
1. El workflow `.github/workflows/deploy.yml` se activará automáticamente.
2. Compilará la aplicación con la base `/CuestionariosPersonalizados/`.
3. Desplegará la carpeta `dist/` en tu sitio web de GitHub Pages asociado al repositorio.

Asegúrate de tener habilitadas las páginas en la sección de configuración de tu repositorio de GitHub (`Settings` -> `Pages` -> Source: `GitHub Actions`).
