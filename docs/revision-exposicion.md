# Revisión del guion y la experiencia de exposición

Revisados el PDF y su fuente `Estructuras_Algebraicas_Guia_Exposicion.tex`, junto con `index.html` y `unidad3.html`. Los adjuntos originales se conservan sin editar. Esta revisión acompaña los cambios de la app y señala qué conviene ajustar al ensayar el discurso.

## Recorrido implementado

La opción predeterminada «Exposición · 60 min» contiene 30 pantallas: apertura, propiedades, mapa, nueve retos, demostraciones y cierre. «Consulta · todo el material» conserva las definiciones y laboratorios extensos. Las dos entradas HTML comparten los archivos de interfaz y actividades en `assets/`.

Cada bloque muestra el expositor y el intervalo del cronograma del guion. Son referencias para el ensayo, no un cronómetro automático. Expositor 1 corresponde a «Tú» y expositor 2 a «Compañero». En el cierre participan ambos.

| Minutos | Presenta | Evidencia que debe conseguir del público |
| --- | --- | --- |
| 00–06 | 1 | Distinguir orden de agrupación y clasificar un sistema con su operación |
| 06–12 | 2 | Completar una casilla de Cayley y explicar por qué una tabla latina no basta para ser grupo |
| 12–17 | 1 | Dar un contraejemplo a la conmutatividad de cadenas y reconocer Λ |
| 17–22 | 2 | Validar contra una gramática explícita y derivar una cadena |
| 22–29 | 1 | Seguir un vértice del triángulo y comparar los dos órdenes |
| 29–36 | 2 | Descartar un tamaño por Lagrange y comprobar cerradura en un subconjunto |
| 36–42 | 1 | Encontrar factores no nulos de producto cero y explicar por qué eso impide ser campo |
| 42–48 | 2 | Recuperar un entero de 0 a 104 y explicar la ambigüedad fuera del rango |
| 48–54 | 1 | Separar detección por paridad de corrección por repetición triple |
| 54–60 | Ambos | Recuperar tres ideas y responder preguntas |

Los retos usan voto → comprobación explícita → explicación → caso de contraste. No muestran la solución antes del voto ni premian velocidad. Una respuesta incorrecta abre una explicación concreta, no una penalización. Se pueden reiniciar para ensayar. El oráculo recibe residuos, no el número secreto, valida los límites y muestra cómo reconstruyó el resultado.

## Correcciones que también conviene llevar al discurso

1. **Mapa de estructuras (tema 0).** No presentar la cadena «grupos abelianos ⊃ anillos» como inclusión literal de estructuras con la misma operación. Un anillo tiene dos operaciones y su estructura aditiva es un grupo abeliano. La app ahora muestra dos recorridos conectados. Para pasar de anillo a dominio entero hay que añadir conmutatividad del producto, identidad 1 ≠ 0 y ausencia de divisores de cero; no solo esta última condición. Los videos antiguos de óvalos no se regeneraron y no forman parte de la ruta nueva.
2. **Cancelación (tema 0 y tabla de anillos).** En grupos: `a*b = a*c ⇒ b = c`, sin excepción de «a ≠ 0». En un dominio entero, para cancelar un factor del producto se exige `a ≠ 0`. En ℤ₁₂ no basta: `3·4 = 3·0` y `4 ≠ 0`. El guion omite la condición en algunas menciones de dominios.
3. **Cayley.** Ningún símbolo repetido en filas y columnas es una condición necesaria para un grupo finito, no suficiente. Se agregó una segunda ronda que lo pregunta expresamente. «Sudoku» sirve como analogía de deducción, pero no como definición de grupo.
4. **Cadenas.** A* con Λ es el monoide libre; A⁺, sin Λ, es el semigrupo libre. La concatenación no es conmutativa cuando el alfabeto tiene al menos dos símbolos. Que `ab` y `abab` conmuten no prueba conmutatividad de toda la operación. En MapReduce, asociatividad permite reagrupar; reordenar además exige conmutatividad o conservar el orden al combinar.
5. **BNF.** El guion propone `var_total`, `2contador` y `precio$` sin precisar qué se permite. Con la BNF de la app, los tres son inválidos. El reto ahora incluye `suma2` como caso válido y declara la regla. No afirmar que `_` o `$` son ilegales en todos los lenguajes ni llamar «compilación» a validar solo el nombre de una variable.
6. **Triángulo.** Decir «primero p, luego q»; eso se escribe `q ∘ p`. La tabla existente ya indica fila = primero, columna = luego. Los nombres de los ejes μ dependen de cómo se numeran; seguir una etiqueta evita memorizar una fórmula sin entenderla. En la aplicación 3D del guion, SO(3) contiene rotaciones, pero no reflexiones; para incluir estas últimas se habla de O(3).
7. **Lagrange.** Si el tamaño no divide, es imposible. Si divide, el teorema por sí solo no garantiza existencia ni que un subconjunto concreto sea subgrupo. La segunda ronda usa `{0,1}` en ℤ₆: tiene tamaño divisor de 6, pero no es cerrado. Los grupos cíclicos de orden primo usados en criptografía evitan subgrupos propios no triviales; la seguridad requiere otras condiciones, no se deduce solo de Lagrange.
8. **Campos.** Adoptar `1 ≠ 0` al definir dominios y campos. GF(2⁸) no es ℤ₂₅₆. En AES, la inversión de los elementos no nulos es parte de la construcción de la S-box, junto con una transformación afín; el cero se trata por convención. Evitar que «todo byte tiene inverso» incluya al cero.
9. **Oráculo.** El guion dice 1–105 pero la fórmula devuelve representantes 0–104: el secreto 105 devolvería 0. La app usa explícitamente 0–104. Los pesos 70, 21 y 15 son correctos para módulos 3, 5 y 7. No presentarlo como adivinación sin explicar rango y unicidad módulo 105.
10. **Canal con ruido.** Paridad (4,5) detecta cualquier error de un bit y no puede corregirlo. Mayoría necesita repetición triple (4,12), una codificación diferente. La tercera ronda muestra dos errores en la misma posición de dos copias: la mayoría falla. El simulador conoce lo enviado para evaluar el resultado; el receptor real no tiene ese dato. La interfaz ahora distingue esas perspectivas y permite quitar el ruido.

## Ritmo y reparto

El desglose inicial del guion suma entre 6 y 8 minutos por bloque (2 de teoría + 1–2 de demostración + 2–3 de juego + 1 de aplicación). Por nueve bloques puede superar los 54 minutos disponibles antes del cierre. Para los bloques de seis minutos, ensayen aproximadamente 1 minuto de idea, 2 de demostración, 2 de reto y 1 de aplicación/pase. En los de cinco minutos, reduzcan la demostración a un minuto; los dos bloques de siete tienen margen para seguir el triángulo y las clases laterales con calma.

Quien expone hace una pregunta y espera una explicación. La otra persona recoge la votación y opera la interfaz; luego intercambian papeles. La app no recoge respuestas de teléfonos ni cuenta votos: está pensada para proyección y voto oral o a mano alzada.

No es necesario completar todos los casos si el grupo ya explicó la idea; los botones de navegación no bloquean el avance. Para el ensayo completo sí conviene recorrer las rondas y probar una respuesta equivocada en cada reto. Los laboratorios originales sirven para demostrar; los nuevos retos comprueban predicciones sin revelar antes la respuesta.

En el cierre, eviten leer otra definición: pidan un ejemplo, un contraejemplo y una diferencia entre detectar y corregir. Para el PDF, también conviene eliminar las afirmaciones finales de «repositorio institucional sincronizado» y «estándares de la Sociedad Matemática Americana» si no las pueden respaldar: usar paquetes AMS no acredita ese estándar editorial.

## Validación técnica

Con el servidor estático activo, `node tests/exposicion.cjs` usa Playwright y Chromium. En este entorno ambos están disponibles; en otro equipo se deben instalar esas herramientas o configurar `CHROMIUM_PATH`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory /workspace/Discretas-
# En otra terminal, desde el repositorio:
node tests/exposicion.cjs
```

La prueba recorre las dos entradas, las rondas de los nueve retos, voto incorrecto, explicación, reinicio, las 105 reconstrucciones del oráculo, límites de entrada, fallos y aciertos de los códigos y disposición a 1280×720 y 390×844. En pantallas bajas, las diapositivas permiten desplazamiento vertical en vez de reducir el texto automáticamente hasta hacerlo ilegible.

La validación funcional y la revisión matemática no sustituyen el ensayo con ustedes y el público: ahí se ajustan vocabulario, pausas y tiempos según lo que realmente logren explicar los compañeros.
