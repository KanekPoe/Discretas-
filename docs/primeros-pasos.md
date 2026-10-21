# Inicio visual de la exposición

En «Exposición · 60 min», después de la apertura se demuestra cerradura. Luego vienen las máquinas y el viaje del inverso. El material extenso se conserva en «Referencia · por páginas»; la presentación usa escenas con límites de pantalla.

## Las dos máquinas

1. Empezar con «Cambiar el orden» y «Resta». Pedir una predicción y seleccionar el voto de la clase.
2. «Poner a prueba» intercambia físicamente las tarjetas de B. Todavía no muestra resultados.
3. «Calcular y comparar» revela 5 y −5: cambiar el orden sí afecta a la resta.
4. Avanzar a la pantalla de asociatividad. Los números 8, 3, 2 conservan su orden; el corchete de B se desplaza a la pareja de la derecha.
5. «Resolver las parejas» deja a la vista 5 − 2 y 8 − 1. Esperar la explicación del público antes de revelar 3 y 7.
6. Como contraste opcional, elegir «Suma» en el selector de la máquina: ambos órdenes dan 11 y ambas agrupaciones dan 13. Recordar que comprobar un ejemplo no demuestra una propiedad universal.

Los botones marcan el ritmo: ninguna animación avanza las diapositivas ni revela automáticamente el paso siguiente. Se puede reiniciar o cambiar el experimento durante el movimiento; las animaciones anteriores se cancelan.

## El viaje de ida y vuelta

1. «Aplicar +3» mueve la ficha desde casa (0) hasta la estación 3.
2. Probar una tarjeta natural. +0 deja la ficha en 3; +1 la lleva a 4; +3 la lleva a 6. Cada intento parte otra vez de 3 para mantener el mismo problema.
3. Explicar la imposibilidad: sumar cualquier natural a 3 no puede reducirlo hasta 0. El argumento vale para todos los naturales, no solo para las tres tarjetas mostradas.
4. «Habilitar enteros ℤ» abre el territorio negativo y permite usar −3.
5. Al sumar −3 la ficha vuelve a casa: 3 + (−3) = 0. La operación sigue siendo suma; lo que cambió fue el conjunto disponible.

La tarjeta 0 ilustra identidad; la tarjeta −3 ilustra el inverso de 3. No intercambiar esos conceptos.

## El pasaporte

Después del mapa, el primer reto registra las propiedades hacia grupo abeliano. Los sellos se revelan solo después del voto. Si se incumple un requisito, el recorrido se detiene y los siguientes figuran «Sin evaluar», lo que no significa que también sean falsos. Por ejemplo, ℕ con suma sí es conmutativo aunque no sea grupo.

## Ritmo y accesibilidad

Para conservar los seis minutos de apertura: unos 2 minutos de máquinas, 1 minuto de viaje, 1 de mapa y 2 de pasaporte; evitar ejecutar todas las variantes de suma durante la exposición. El ensayo sirve para elegir los contrastes según las dudas del público.

Las animaciones respetan `prefers-reduced-motion`: conservan estados, resultados y controles, pero eliminan movimientos y pulsos. Las tarjetas se seleccionan con botones y radios, sin requerir arrastre. Los resultados y explicaciones usan regiones de estado para lectores de pantalla. Las pantallas se dividen por pasos y no permiten desplazamiento. En horizontal, la operación y la explicación se muestran lado a lado.

Pruebas: `node tests/primeros-pasos.cjs`, con el servidor estático activo y Playwright/Chromium disponibles. Incluye movimiento normal y reducido, las cuatro variantes de cálculo, la separación de resultados intermedios, los límites del conjunto, reinicios en movimiento La comprobación de tamaños está en `tests/sin-desplazamiento.cjs`.
