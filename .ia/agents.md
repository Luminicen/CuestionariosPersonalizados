# 📋 Guía para Agentes — Cuestionarios Web

## 🎯 Contexto del Proyecto

Estás trabajando en una **aplicación web personalizada para realizar cuestionarios de opción múltiple**. La aplicación debe permitir al usuario cargar y responder cuestionarios de dos formas:

1. **Modo manual**: el usuario crea y responde preguntas directamente desde la interfaz.
2. **Modo archivo JSON**: el usuario importa un cuestionario desde un archivo `.json` con una estructura predefinida.

---

## 📁 Estructura del archivo JSON

El archivo de entrada debe respetar **estrictamente** el siguiente esquema:

```json
{
  "titulo": "Cuestionario",
  "preguntas": [
    {
      "numero": 1,
      "texto": "los archivos con registros de longitud variable",
      "opciones": {
        "A": "ocupan menos espacio que los registros con longitud fija",
        "B": "ocupan más espacio que los registros con longitud fija",
        "C": "ocupan el mismo espacio que los registros con longitud fija",
        "D": "ninguna de las anteriores"
      },
      "respuesta_correcta": null
    }
  ]
}
```

### Reglas del esquema

- `titulo` (string, obligatorio): nombre del cuestionario.
- `preguntas` (array, obligatorio): lista de preguntas.
- Cada pregunta debe contener:
  - `numero` (entero, obligatorio): identificador secuencial.
  - `texto` (string, obligatorio): enunciado de la pregunta.
  - `opciones` (objeto, obligatorio): claves `A`, `B`, `C`, `D` (mínimo 2 opciones).
  - `respuesta_correcta` (string | null): letra de la opción correcta o `null` si aún no está definida.

> ⚠️ **Validación**: cualquier JSON que no cumpla el esquema debe ser rechazado con un mensaje claro indicando el error.

---

## 🔄 Flujo de trabajo obligatorio (TDD)

Para **cada feature** que desarrolles, debes seguir este orden **sin excepciones**:

### 1. 🧪 Primero: Tests
- Redacta los tests **antes** de escribir el código de la feature.
- Los tests deben cubrir:
  - Casos felices (happy path).
  - Casos borde (inputs inválidos, JSON malformado, preguntas vacías, etc.).
  - Casos de error (excepciones esperadas).
- Los tests deben ejecutarse y **fallar** inicialmente (Red).

### 2. 💻 Segundo: Código
- Implementa la feature con el **mínimo código necesario** para que los tests pasen (Green).
- Refactoriza si es necesario manteniendo los tests en verde (Refactor).

### 3. ✅ Tercero: Verificación
Una vez finalizada la feature, verifica:
- [ ] Todos los tests pasan (`npm test` / `pytest` / equivalente).
- [ ] Cobertura de tests adecuada (mínimo 80%).
- [ ] No hay warnings ni errores de linter.
- [ ] El código sigue los principios SOLID y DRY.
- [ ] **No hay lógica duplicada identificable** (ver sección 🔍).
- [ ] La feature funciona correctamente de forma manual.
- [ ] La feature funciona correctamente cargando un JSON válido.
- [ ] La feature rechaza correctamente un JSON inválido.

---

## 🏆 Buenas prácticas de programación

### General
- **Nombres descriptivos**: variables, funciones y clases deben reflejar su propósito.
- **Funciones pequeñas**: una función, una responsabilidad.
- **Comentarios útiles**: comenta el *por qué*, no el *qué*.
- **Manejo de errores**: nunca silencies errores; usa try/catch con mensajes claros.
- **Inmutabilidad**: prioriza datos inmutables cuando sea posible.

### Frontend
- Componentes reutilizables y desacoplados.
- Separación clara entre lógica de UI y lógica de negocio.
- Accesibilidad (ARIA, navegación por teclado, contraste).
- Diseño responsive.

### Backend / Lógica
- Validación de entrada en todos los endpoints o funciones públicas.
- Separación de responsabilidades (controladores, servicios, repositorios).
- Logs informativos para debugging.

### Tests
- Nombres de tests descriptivos: `deberia_rechazar_json_sin_titulo`.
- Un concepto por test (no mezclar validaciones).
- Datos de prueba aislados y reproducibles.

---

## 🔍 Detección y eliminación de código duplicado

### Principio DRY (Don't Repeat Yourself)

**Regla fundamental**: Si escribes la misma lógica más de **dos veces**, **debes** extraerla a una función, componente o módulo reutilizable.

### Criterios para identificar duplicación

Antes de hacer commit, revisa tu código buscando:

1. **Bloques de código idénticos o muy similares** (3+ líneas repetidas)
2. **Lógica de validación repetida** en múltiples lugares
3. **Transformaciones de datos** que se aplican en varios sitios
4. **Consultas o llamadas a API** con la misma estructura
5. **Manejo de errores** repetitivo
6. **Cálculos o fórmulas** que aparecen más de una vez
7. **Renderizado de componentes** con estructura similar

### Reglas de modularización obligatorias

#### ✅ **CUÁNDO modularizar:**

- **Funciones utilitarias**: Si usas la misma función en 2+ archivos → crear `utils/` o `helpers/`
- **Validaciones**: Si validas el mismo esquema en múltiples lugares → crear `validators/`
- **Componentes UI**: Si un bloque de UI se repite → crear componente reutilizable
- **Servicios/API**: Si llamas a la misma API con lógica similar → crear servicio centralizado
- **Hooks/Composables**: Si la misma lógica de estado se repite → crear custom hook o composable
- **Constantes**: Si usas el mismo valor mágico múltiples veces → crear `constants/`

#### 📁 **Estructura de módulos sugerida:**

```
src/
├── components/          # Componentes UI reutilizables
│   ├── common/         # Botones, inputs, modales genéricos
│   └── quiz/           # Componentes específicos del cuestionario
├── services/           # Lógica de negocio y llamadas API
├── utils/              # Funciones auxiliares puras
├── validators/         # Esquemas de validación (Zod, Joi, etc.)
├── hooks/              # Custom hooks (React) o composables (Vue)
├── constants/          # Constantes y configuraciones
└── types/              # Definiciones de tipos/interfaces
```

#### 🚫 **CUÁNDO NO modularizar prematuramente:**

- Si solo se usa en **un lugar** → mantener inline
- Si la "duplicación" es **accidental** (similar pero con lógica diferente) → no forzar abstracción
- Si la abstracción sería **más compleja** que el código duplicado → esperar

### Proceso de refactorización

Cuando detectes duplicación:

1. **Identifica** el patrón repetido
2. **Extrae** a una función/módulo con nombre descriptivo
3. **Parametriza** las diferencias (usa argumentos, no hardcode)
4. **Reemplaza** todas las ocurrencias con la nueva abstracción
5. **Ejecuta tests** para asegurar que no rompiste nada
6. **Documenta** la nueva función/módulo si es necesario

### Herramientas recomendadas

- **ESLint**: regla `no-duplicate-imports`, `no-duplicate-case`
- **SonarQube** o **CodeClimate**: detectan duplicación automáticamente
- **jscpd** (JavaScript Copy/Paste Detector): herramienta específica para detectar duplicados
- **Revisión manual**: antes de commit, busca con Ctrl+F patrones sospechosos

### Ejemplo de refactorización

**❌ ANTES (código duplicado):**

```javascript
// En ComponenteA.jsx
const validarJSON = (data) => {
  if (!data.titulo) throw new Error('Falta título');
  if (!data.preguntas) throw new Error('Faltan preguntas');
  return true;
};

// En ComponenteB.jsx
const validarJSON = (data) => {
  if (!data.titulo) throw new Error('Falta título');
  if (!data.preguntas) throw new Error('Faltan preguntas');
  return true;
};
```

**✅ DESPUÉS (modularizado):**

```javascript
// En validators/jsonValidator.js
export const validarCuestionario = (data) => {
  if (!data.titulo) throw new Error('Falta título');
  if (!data.preguntas) throw new Error('Faltan preguntas');
  return true;
};

// En ComponenteA.jsx
import { validarCuestionario } from '../validators/jsonValidator';

// En ComponenteB.jsx
import { validarCuestionario } from '../validators/jsonValidator';
```

### Checklist de duplicación

Antes de cada commit, pregúntate:

- [ ] ¿Hay alguna función que escribí más de una vez?
- [ ] ¿Hay validaciones que se repiten en diferentes archivos?
- [ ] ¿Hay componentes UI con estructura similar que podría unificar?
- [ ] ¿Hay lógica de negocio que podría extraerse a un servicio?
- [ ] ¿Usé el mismo valor mágico en múltiples lugares?
- [ ] ¿La abstracción que voy a crear es más simple que el código duplicado?

---

## 📐 Criterios de aceptación de una feature

Una feature se considera **completa** solo cuando:

1. ✅ Los tests fueron escritos antes que el código.
2. ✅ Todos los tests pasan.
3. ✅ El código fue revisado (self-review o peer-review).
4. ✅ **No hay lógica duplicada identificable.**
5. ✅ La lógica común está correctamente modularizada.
6. ✅ Funciona en modo manual.
7. ✅ Funciona con archivo JSON válido.
8. ✅ Rechaza correctamente archivos JSON inválidos.
9. ✅ No introduce regresiones en features anteriores.
10. ✅ La documentación (README o inline) está actualizada.

---

## 🚦 Checklist rápido antes de hacer commit

```
[ ] Escribí los tests primero
[ ] Los tests pasan
[ ] El linter no reporta errores
[ ] No hay código duplicado (revisé con Ctrl+F y herramientas)
[ ] La lógica común está modularizada en utils/services/components
[ ] Probé la feature manualmente
[ ] Probé la feature con un JSON válido
[ ] Probé la feature con un JSON inválido
[ ] No rompí nada existente
[ ] Actualicé la documentación si fue necesario
```

---

## 💬 Nota final

> **Principio rector**: *código que no tiene tests, es código que no funciona*.  
> **Segundo principio**: *código duplicado es código que eventualmente se romperá en un lugar y no en el otro*.  
> Antes de preguntar "¿funciona?", pregunta "¿hay un test que lo demuestre?" y "¿hay duplicación que pueda causar bugs futuros?".