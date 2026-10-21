# Plan e implementación: exposición sin desplazamiento

## Objetivo

Mostrar un paso completo por pantalla, en móvil y proyector. Mantener las comparaciones juntas, con texto legible y sin usar recortes ni reducción automática de escala como solución de diseño.

## Cambios implementados

1. **Estructura de la exposición.** Recorrido principal de 35 pantallas con nueve bloques temáticos y un cierre. Los pasos dentro de una demostración no añaden temas; separan pregunta, operación y conclusión. Suma frente a resta es una variante opcional en las máquinas.
2. **Demostraciones densas.** Cayley muestra primero una intersección, después identidad. S₃ compara ambos órdenes de composición con dos triángulos. Lagrange construye una partición de ℤ₆. Residuos muestra primero entradas, después residuos, suma por carriles y reconstrucción. Los códigos mantienen visible solo la codificación seleccionada y distinguen detector, decodificador y evaluación del simulador.
3. **Puentes conceptuales.** Cerradura usa ℕ frente a ℤ. Distributividad cuenta 3 paquetes de 2 fichas azules y 4 doradas. El homomorfismo recorre «operar → transformar» y «transformar → operar». El ejemplo recurrente de ℤ₆ conecta suma, clases laterales y divisores de cero; ℤ₇ sirve como contraste de campo.
4. **Retos.** La pregunta y la explicación son estados separados. Las opciones conservan su significado, pero cambia su posición entre rondas. El pasaporte conserva sus sellos al revelar la evidencia. El oráculo pasa de entrada a reconstrucción y ofrece «Nuevo número».
5. **Referencia.** La consulta extensa se divide en unidades de lectura por tema. El límite de palabras se adapta al tamaño de pantalla; no se reduce la escala del texto. Los párrafos, definiciones, resultados de ejemplo y tablas originales se conservan como texto estructurado. Las pantallas antiguas densas no forman parte del recorrido proyectado.
6. **Navegación.** Selector de temas en lugar de una tira que exige desplazamiento horizontal. Flechas y teclas de avance se conservan. La sesión recuerda la pantalla y el modo al recargar. Los procesos animados siguen respetando movimiento reducido.
7. **Móvil.** Pantallas verticales con controles compactos. En horizontal se distribuyen evidencia y explicación en columnas. Las áreas seguras del dispositivo se incluyen en el cálculo del encabezado y la barra inferior.

## Validación

Con el servidor estático activo en el puerto 8000:

```sh
node tests/exposicion.cjs
node tests/primeros-pasos.cjs
node tests/sin-desplazamiento.cjs
```

La prueba de exposición verifica resultados matemáticos, ambos caminos del homomorfismo, composiciones de S₃, derivación, partición de Lagrange, códigos, los nueve retos, las 105 reconstrucciones del oráculo y recuperación de pantalla.

La prueba del inicio verifica estados intermedios, cuatro combinaciones de operación/propiedad, reinicios durante animaciones y movimiento normal/reducido.

La prueba de tamaños recorre el modo principal y la referencia, además de respuestas y estados intermedios, en 1280×720, 390×844, 360×640, 320×568 y 844×390. Comprueba tanto `scrollHeight`/`scrollWidth` como los límites geométricos visibles: ocultar un desbordamiento no cuenta como ajuste válido. Son comprobaciones de Chromium con tamaños emulados; no equivalen a ensayos con el público ni a pruebas en todos los modelos de teléfono.

## Uso durante la exposición

En los seis minutos iniciales, usar cerradura brevemente, un ejemplo de resta para orden y otro para agrupación, el regreso a cero, el mapa y una ronda del pasaporte. Las variantes de suma y las otras rondas son ampliaciones si el público necesita contraste. Los intervalos del guion son referencias para el ensayo; no bloquean ni aceleran las actividades.
