# Plan de Alineamiento: Aplicación Web vs. Guión de Exposición (60 Minutos)

Este documento es la **hoja de ruta operativa y técnica** para la exposición de 1 hora. Vincula con precisión de segundos lo que cada expositor debe **decir**, la **sección activa en la pantalla**, los **laboratorios**, los **9 mini-juegos interactivos integrados en cada tema (2 a 3 minutos cada uno)** y las **frases de transición** para ceder la palabra.

---

## Resumen de Tiempos y Roles con Mini-Juegos Integrados

| Turno | Tiempo | Expositor | Tema | Laboratorio en la App | 🎮 Mini-Juego Integrado (2-3 min) |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **1** | 00:00 - 06:00 | **Tú** | **Tema 0: Apertura y Jerarquía** | Canvas 2D + Óvalos | **Juego 0:** ¿En qué Óvalo Cae? *(The Russian Doll Drop)* |
| **2** | 06:00 - 12:00 | **Compañero** | **3-1: Sistemas y Homomorfismos** | Cayley + Cuadrado Conmutativo | **Juego 1:** El Sudoku de Cayley *(Cuadrado Latino)* |
| **3** | 12:00 - 17:00 | **Tú** | **3-2: Semigrupos y Monoides** | Cadenas $A^*$ y MapReduce | **Juego 2:** Duelo de Cadenas *(¿Conmutan o Chocan?)* |
| **4** | 17:00 - 22:00 | **Compañero** | **3-3: Gramáticas y BNF** | Derivaciones $a^n b^n$ + BNF | **Juego 3:** ¿Compila o Explota? *(The Compiler Trap)* |
| **5** | 22:00 - 29:00 | **Tú** | **3-5: Grupos y Simetrías $S_3$** | Composición de simetrías | **Juego 4:** Triángulo Loco *(Adivina el Vértice)* |
| **6** | 29:00 - 36:00 | **Compañero** | **3-5: Subgrupos y Lagrange** | Reloj modular circular $\mathbb{Z}_n$ | **Juego 5:** El Impostor de Lagrange *(Lagrange Bouncer)* |
| **7** | 36:00 - 42:00 | **Tú** | **3-5: Anillos, Dominios y Campos** | Divisores de cero en $\mathbb{Z}_n$ | **Juego 6:** Caza de Divisores *(¿Bomba o Campo?)* |
| **8** | 42:00 - 48:00 | **Compañero** | **3-6: Aritmética de Residuos (RNS)** | Calculadora sin acarreo + Base Mixta | **Juego 7:** El Oráculo Chino *(Adivina el Número con TCR)* |
| **9** | 48:00 - 54:00 | **Tú** | **3-7: Códigos de Grupo y Hamming** | Transmisión con paridad | **Juego 8:** Atrapa al Hacker de Bits *(Inversión de bits)* |
| **Cierre** | 54:00 - 60:00 | **Ambos** | **Conclusiones y Preguntas** | Quizzes interactivos | Resolución de dudas del profesor con contraejemplos |

---

## Guión Técnico y Operativo por Turnos

---

### 🟢 Turno 1 (00:00 - 06:00) | Apertura, Propiedades y «Muñecas Rusas»
* **Expositor:** **TÚ**
* **Pantallas en la App:** `#entrada`, `#inicio` y la tarjeta `#game0`.

#### 1. Qué decir (00:00 - 02:00)
> *"Buenos días profesor y compañeros. Hoy presentaremos la Unidad 3: Estructuras Algebraicas. En ciencias de la computación, lo fundamental no son los números aislados, sino las operaciones y las reglas que cumplen: asociatividad, elemento neutro, inversos y distributividad."*

#### 2. Qué picar en la App (02:00 - 03:30)
* En **#entrada**:
  1. Haz clic en la pestaña **Asociativa** en la fila superior.
  2. Mueve el deslizador del parámetro **$c$** suavemente: muestra cómo las curvas azul y morada coinciden. Cambia a la resta para ver cómo se separan.
* En **#inicio**:
  1. Pulsa el botón **▶ Repetir animación** para mostrar la contracción de óvalos («Muñecas rusas»).

#### 3. 🎮 Mini-Juego 0: «¿En qué Óvalo Cae?» (03:30 - 05:30)
* Avanza a la tarjeta **#game0**:
  - Di a la clase: *"¡Vamos a jugar! En pantalla aparece el sistema $(\mathbb{Z}, -)$. Tienen 10 segundos para votar: ¿Hasta qué óvalo llega antes de rebotar?"*
  - Si el grupo dice "Semigrupo", haz clic en **Semigrupo**: la app muestra en rojo: *«¡REBOTÓ! La resta no es asociativa»*.
  - Pulsa **🎲 Siguiente Sistema**: sale $(\mathbb{N}, +)$. El grupo vota "Monoide": haz clic en **Monoide** y la app celebra en verde: *«¡CORRECTO! Tiene neutro 0 pero carece de inversos»*.

#### 4. Frase de Transición (05:30 - 06:00)
> *"Para formalizar la base de esta jerarquía, mi compañero explicará la sección 3-1: Sistemas Algebraicos y Homomorfismos."*

---

### 🔵 Turno 2 (06:00 - 12:00) | 3-1 Sistemas Algebraicos, Cayley y Homomorfismos
* **Expositor:** **COMPAÑERO**
* **Pantallas en la App:** `#s31`, modal del Cuadrado Conmutativo y tarjeta `#game1`.

#### 1. Qué decir (06:00 - 08:00)
> *"Un sistema algebraico $(S, *)$ formaliza un conjunto con una operación binaria cerrada. En conjuntos finitos, su estructura se estudia con Tablas de Cayley. Los Homomorfismos preservan operaciones a través del cuadrado conmutativo: $f(a * b) = f(a) \star f(b)$."*

#### 2. Qué picar en la App (08:00 - 09:30)
* En **#s31**:
  1. Haz clic en el nuevo botón: **🔲 Abrir Cuadrado Conmutativo Interactivo**. Se despliega la ventana modal flotante. Muestra los dos caminos en paralelo y cierra el modal con la tachita `✕`.
  2. En el laboratorio de tablas, pulsa una casilla para mostrar cómo cambia el veredicto en vivo.

#### 3. 🎮 Mini-Juego 1: «El Sudoku de Cayley» (09:30 - 11:30)
* Avanza a la tarjeta **#game1**:
  - Di a la clase: *"En la tabla de un grupo rige la regla del Cuadrado Latino: ningún elemento se repite en fila ni columna. En pantalla hay una casilla marcada con '?'"*.
  - Pregunta al salón: *«¿Qué elemento va en la casilla ? sin hacer cálculos?»*.
  - Alguien grita la respuesta; pulsa el botón correspondiente: la app muestra en verde: *«¡EXCELENTE! Por descarte en esa fila/columna era la única opción legal»*.
  - Pulsa **🎲 Otra Tabla** para una segunda ronda rápida.

#### 4. Frase de Transición (11:30 - 12:00)
> *"Los enteros de 32 bits en hardware forman $\mathbb{Z}_{2^{32}}$ con desbordamiento. Mi compañero explicará ahora las estructuras más usadas en big data: Semigrupos y Monoides."*

---

### 🟢 Turno 3 (12:00 - 17:00) | 3-2 Semigrupos, Monoides y Cadenas
* **Expositor:** **TÚ**
* **Pantallas en la App:** `#s32` y tarjeta `#game2`.

#### 1. Qué decir (12:00 - 13:30)
> *"Semigrupo exige solo asociatividad. Monoide agrega elemento neutro. En informática, el ejemplo reina es el Monoide Libre de Cadenas $(A^*, \cdot)$ con la concatenación y neutro $\Lambda$ (cadena vacía)."*

#### 2. Qué picar en la App (13:30 - 14:30)
* En **#s32**:
  - En las cajas escribe $x=$ `hola`, $y=$ `mundo`. Muestra que $xy \neq yx$, pero las longitudes son un homomorfismo: $\ell(xy) = \ell(x) + \ell(y)$.

#### 3. 🎮 Mini-Juego 2: «Duelo de Cadenas: ¿Conmutan o Chocan?» (14:30 - 16:30)
* Avanza a la tarjeta **#game2**:
  - Di al salón: *"En pantalla tenemos dos palabras: x='ab' e y='ba'. ¿Conmutan (xy = yx) o chocan (xy ≠ yx)?"*.
  - La clase grita *"¡Chocan!"*. Presionas **💥 NO Conmutan**: la app valida en verde: *«¡CORRECTO! 'abba' ≠ 'baab'»*.
  - Pulsas **🎲 Otro Par**: sale $x=$ `na`, $y=$ `nana`. La clase duda; votan que sí. Presionas **🤝 SÍ Conmutan**: la app valida: *«¡EXCELENTE! 'nananana' = 'nananana' porque son potencias de la misma base»*.

#### 4. Frase de Transición (16:30 - 17:00)
> *"Esto fundamenta MapReduce en cómputo distribuido. Mi compañero explicará cómo las cadenas dan origen a las Gramáticas y los Compiladores."*

---

### 🔵 Turno 4 (17:00 - 22:00) | 3-3 Gramáticas, Lenguajes y BNF
* **Expositor:** **COMPAÑERO**
* **Pantallas en la App:** `#s33` y tarjeta `#game3`.

#### 1. Qué decir (17:00 - 18:30)
> *"Un lenguaje es un subconjunto de cadenas $L \subseteq A^*$. Una gramática formal $G=(V, S, v_0, \mapsto)$ genera oraciones válidas mediante producciones finitas. Los compiladores usan la notación BNF para validar identificadores y expresiones."*

#### 2. Qué picar en la App (18:30 - 19:30)
* En **#s33**:
  - Presiona dos veces `v₀ ↦ a v₀ b` y luego `v₀ ↦ ab` para derivar la cadena $a^3 b^3$ en vivo.

#### 3. 🎮 Mini-Juego 3: «¿Compila o Explota?» (19:30 - 21:30)
* Avanza a la tarjeta **#game3**:
  - Di a la clase: *"Tienen 10 segundos. En pantalla hay 3 nombres de variables: ¿cuál de ellos hará explotar al compilador con un Syntax Error bajo la regla BNF?"*.
  - La clase señala `9cuenta`. Haces clic en el botón `9cuenta`: la app enciende la alerta: *«💥 ¡EXPLOTÓ EL COMPILADOR! Un identificador BNF no puede iniciar con un dígito»*.
  - Pulsa **🎲 Otra Terna** para poner a prueba si detectan símbolos prohibidos (como `mi-variable` o `total$`).

#### 4. Frase de Transición (21:30 - 22:00)
> *"Los parsers de C++ y Python usan esto para detectar errores de sintaxis. Ahora mi compañero entrará a la estructura de la simetría: los Grupos."*

---

### 🟢 Turno 5 (22:00 - 29:00) | 3-5 Grupos y Simetrías de $S_3$
* **Expositor:** **TÚ**
* **Pantallas en la App:** `#s35` y tarjeta `#game4`.

#### 1. Qué decir (22:00 - 24:00)
> *"Un Grupo es un monoide donde cada elemento tiene inverso: toda acción se puede deshacer. Las simetrías de un objeto forman un grupo. En el triángulo equilátero tenemos $S_3$ con 6 simetrías: 3 rotaciones y 3 reflexiones."*

#### 2. Qué picar en la App (24:00 - 25:30)
* En **#s35**:
  - Aplica rotación $\rho_1$ y luego reflexión $\mu_1$. Invierte el orden para demostrar que $S_3$ no es abeliano.

#### 3. 🎮 Mini-Juego 4: «Triángulo Loco de $S_3$» (25:30 - 28:00)
* Avanza a la tarjeta **#game4**:
  - Di al salón: *"Reto mental: El triángulo tiene el vértice 1 arriba. Vamos a aplicar una rotación de 120° ($\rho_1$) y luego un espejo vertical ($\mu_1$). ¿Dónde va a terminar el Vértice 1? ¿Arriba, abajo-derecha o abajo-izquierda?"*.
  - Pide a un voluntario que vote. Selecciona la opción en pantalla (ej. *Abajo-Izquierda*).
  - Presiona **▶ Animar y Comprobar**: la app gira y refleja el triángulo, validando si acertaron y mostrando la explicación matemática de la permutación.

#### 4. Frase de Transición (28:00 - 29:00)
> *"Los motores 3D de videojuegos y el Cubo de Rubik usan exactamente estos grupos de permutaciones. Mi compañero explicará qué pasa dentro de un grupo: Subgrupos y Lagrange."*

---

### 🔵 Turno 6 (29:00 - 36:00) | 3-5 Subgrupos y Teorema de Lagrange
* **Expositor:** **COMPAÑERO**
* **Pantallas en la App:** `#lagrange` y tarjeta `#game5`.

#### 1. Qué decir (29:00 - 31:00)
> *"Un subgrupo $H$ hereda la estructura del grupo. Las clases laterales dividen al grupo en bloques del mismo tamaño. El Teorema de Lagrange dice con rigor que el tamaño del subgrupo $|H|$ divide exactamente al orden total $|G|$."*

#### 2. Qué picar en la App (31:00 - 32:30)
* En **#lagrange**:
  - En el reloj circular selecciona $n=12$, toca el número 4 para ver las 4 clases disjuntas de 3 elementos ($12 = 3 \times 4$).

#### 3. 🎮 Mini-Juego 5: «El Impostor de Lagrange» (32:30 - 35:00)
* Avanza a la tarjeta **#game5**:
  - Di al grupo: *"Tenemos un grupo de orden |G| = 24. Tres de los candidatos son subgrupos legales, pero uno es un IMPOSTOR que viola a Lagrange. ¿Quién es?"*.
  - Muestra las opciones: `Subgrupo de 3`, `Subgrupo de 6`, `Subgrupo de 7`, `Subgrupo de 8`.
  - La clase grita: *"¡El 7!"*.
  - Haces clic en el 7: la app proyecta en verde: *«🎯 ¡IMPOSTOR EXPULSADO! 7 no divide a 24 (24/7 = 3.42). Es imposible que exista un subgrupo de tamaño 7»*.
  - Pulsa **🎲 Otro Grupo** para probar con orden 20 o 30.

#### 4. Frase de Transición (35:00 - 36:00)
> *"En criptografía de curvas elípticas se usan grupos de orden primo para que no existan subgrupos vulnerables. Mi compañero pasará a sistemas con dos operaciones: Anillos y Campos."*

---

### 🟢 Turno 7 (36:00 - 42:00) | 3-5 Anillos, Dominios y Campos
* **Expositor:** **TÚ**
* **Pantallas en la App:** `#anillos` y tarjeta `#game6`.

#### 1. Qué decir (36:00 - 38:00)
> *"Un Anillo tiene suma y multiplicación distributiva. Pero puede tener una patología: divisores de cero ($a \neq 0, b \neq 0$ pero $ab = 0$). Un Dominio Entero no tiene divisores de cero. Y un Campo permite dividir: todo número no nulo tiene inverso multiplicativo."*

#### 2. Qué picar en la App (38:00 - 39:00)
* En **#anillos**:
  - Compara $\mathbb{Z}_6$ (divisores de cero) frente a $\mathbb{Z}_7$ (campo primo).

#### 3. 🎮 Mini-Juego 6: «Caza de Divisores de Cero: ¿Bomba o Campo?» (39:00 - 41:00)
* Avanza a la tarjeta **#game6**:
  - Di al salón: *"En pantalla aparece el anillo ℤ₁₂. Tienen 15 segundos: ¿qué dos números no nulos al multiplicarse en este reloj dan 0? ¿O acaso es un Campo?"*.
  - El grupo propone `3 y 4` ($3 \times 4 = 12 \equiv 0$). Pulsas la opción y la app confirma el acierto.
  - Pulsas **🎲 Otro Anillo**: sale $\mathbb{Z}_{13}$. La clase busca números; tú retas: *«¡Nadie va a encontrar ninguno! 13 es primo, por lo tanto es un Campo y no tiene divisores de cero»*. Pulsas `🛡️ ¡Es un Campo!` y la app celebra.

#### 4. Frase de Transición (41:00 - 42:00)
> *"El cifrado AES que protege WhatsApp opera en el campo de Galois $GF(2^8)$. Ahora mi compañero explicará cómo operar a máxima velocidad mediante Aritmética de Residuos."*

---

### 🔵 Turno 8 (42:00 - 48:00) | 3-6 Aritmética de Residuos y TCR
* **Expositor:** **COMPAÑERO**
* **Pantallas en la App:** `#s36` y tarjeta `#game7`.

#### 1. Qué decir (42:00 - 44:00)
> *"Sumar en binario tradicional ralentiza los procesadores por la propagación de acarreos. La Aritmética de Residuos (RNS) usa el isomorfismo $\mathbb{Z}_M \cong \mathbb{Z}_{m_1} \times \dots \times \mathbb{Z}_{m_k}$ para calcular en paralelo sin acarreos entre módulos."*

#### 2. Qué picar en la App (44:00 - 45:00)
* En **#s36**:
  - En la calculadora residual muestra la suma y multiplicación de $23$ y $41$ en módulos $3, 5, 7$ operando en paralelo.

#### 3. 🎮 Mini-Juego 7: «El Oráculo Chino: Adivino tu Número Secreto» (45:00 - 47:30)
* Avanza a la tarjeta **#game7**:
  - Dices al profesor o a un compañero: *"Piense un número secreto entre 1 y 105 y no me lo diga"*.
  - Le pides:
    1. ¿Cuánto sobra si divide su número entre 3? $\to$ Escribes el residuo en `mod 3`.
    2. ¿Cuánto sobra si lo divide entre 5? $\to$ Escribes el residuo en `mod 5`.
    3. ¿Cuánto sobra si lo divide entre 7? $\to$ Escribes el residuo en `mod 7`.
  - Presionas el botón: **🔮 Adivinar Número Secreto**.
  - La app ejecuta el TCR en pantalla: $(r_3 \cdot 70 + r_5 \cdot 21 + r_7 \cdot 15) \bmod 105$ y revela el número en grande ante el asombro del grupo.

#### 4. Frase de Transición (47:30 - 48:00)
> *"El Teorema de Euler y el TCR aceleran el cifrado RSA en internet. Mi compañero cerrará explicando cómo corregir datos corruptos con Códigos de Grupo."*

---

### 🟢 Turno 9 (48:00 - 54:00) | 3-7 Códigos de Grupo y Hamming
* **Expositor:** **TÚ**
* **Pantallas en la App:** `#s37` y tarjeta `#game8`.

#### 1. Qué decir (48:00 - 50:00)
> *"Al transmitir datos por cables o Wi-Fi, el ruido altera bits ($0 \leftrightarrow 1$). Con la distancia de Hamming $\delta(x,y)$, para detectar $k$ errores requerimos distancia $\ge k+1$, y para corregir requerimos $\ge 2k+1$. Al formar un subgrupo, la distancia mínima es el peso mínimo de unos."*

#### 2. Qué picar en la App (50:00 - 51:00)
* En **#s37**:
  - Muestra la palabra con bit de paridad y cómo se detecta el cambio de paridad par a impar.

#### 3. 🎮 Mini-Juego 8: «Atrapa al Hacker de Bits» (51:00 - 53:00)
* Avanza a la tarjeta **#game8**:
  - Di a un compañero de la clase: *"Pasa al frente y actúa como el 'Hacker del Ruido'. Toca cualquier bit en la pantalla para alterarlo mientras yo no miro"*.
  - El compañero toca un bit (ej. cambia un 1 por un 0).
  - La app enciende de inmediato una alarma roja: *«🚨 ¡HACKER DETECTADO EN EL CANAL! La paridad es impar. Alteración de datos identificada automáticamente»*.
  - Presionas **🔄 Restaurar Transmisión** para ver el canal limpio nuevamente.

#### 4. Cierre y Transición Final (53:00 - 54:00)
> *"Gracias a los códigos de grupo tenemos memorias RAM ECC en servidores y códigos QR que se leen aunque estén rayados. Pasamos ahora a nuestras conclusiones y ronda de preguntas."*

---

### 👥 Cierre y Preguntas (54:00 - 60:00) | Dinámica en Pareja
* **Expositores:** **AMBOS**
* **Pantalla en la App:** Quizzes interactivos (`.quiz`) y vista general.
* **Min 54-57:** Resuelvan 2 preguntas rápidas del Quiz con la clase.
* **Min 57-60:** Agradezcan la atención y respondan las preguntas del profesor utilizando los laboratorios y contraejemplos interactivos de la aplicación.
