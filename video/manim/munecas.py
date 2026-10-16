"""«Muñecas rusas»: las estructuras algebraicas como óvalos anidados.

Render con ManimGX (API de Manim CE):
    manimgx render munecas.py
"""
import manimgx as m

m.config.background_color = "#1C1C1C"

# (nombre, ejemplo en LaTeX, color, regla que se agrega, quién se queda afuera y por qué)
NIVELES = [
    ("Sistema algebraico", r"(\mathbb{Z},\,-)", "#7B9CFF", "un conjunto + una operación cerrada", None),
    ("Semigrupo", r"(\mathbb{Z}^{+},\,+)", "#58C4DD", "+ asociativa",
     (r"(\mathbb{Z},\,-)", r"(5-3)-1 \neq 5-(3-1)")),
    ("Monoide", r"(\mathbb{N},\,+)", "#5CD0B3", "+ identidad",
     (r"(\mathbb{Z}^{+},\,+)", r"0 \notin \mathbb{Z}^{+}")),
    ("Grupo", r"S_3", "#83C167", "+ inversos",
     (r"(\mathbb{N},\,+)", r"-3 \notin \mathbb{N}")),
    ("Grupo abeliano", r"(\mathbb{Z},\,+)", "#B8D86B", "+ conmutativa",
     (r"S_3", r"\rho_1\mu_1 \neq \mu_1\rho_1")),
    ("Anillo", r"\mathbb{Z}_6", "#F0AC5F", "+ 2ª operación (·) y distributiva",
     (r"(\mathbb{Z},\,+)", r"\text{una sola operación}")),
    ("Dominio entero", r"\mathbb{Z}", "#FC6255", "+ sin divisores de cero",
     (r"\mathbb{Z}_6", r"2\cdot 3 = 0")),
    ("Campo", r"\mathbb{Q},\ \mathbb{R},\ \mathbb{Z}_7", "#E3639B", "+ inverso para todo a ≠ 0",
     (r"\mathbb{Z}", r"\tfrac{1}{2} \notin \mathbb{Z}")),
]
ROJO = "#FC6255"
AMARILLO = "#FFE066"
GRIS = "#9A9A9A"

CENTRO = m.LEFT * 2.75 + m.DOWN * 0.15
PANEL_X = 4.35


def radios(k):
    if k == 7:
        return 1.2, 0.7
    return 4.15 - k * 0.42, 3.62 - k * 0.42


class MunecasRusas(m.Scene):
    def construct(self):
        # 1. La pregunta
        pregunta = m.Text("¿Qué estructura va dentro de cuál?", font_size=54)
        sub = m.Text("Unidad 3 · Estructuras algebraicas", font_size=28, color=GRIS)
        sub.next_to(pregunta, m.DOWN, buff=0.35)
        self.play(m.Write(pregunta), run_time=1.6)
        self.play(m.FadeIn(sub, shift=m.UP * 0.2))
        self.wait(0.8)
        self.play(m.FadeOut(pregunta), m.FadeOut(sub))

        # 2. Los óvalos, de afuera hacia adentro
        ejemplos = []
        panel = None
        for k, (nombre, ej, color, regla, afuera) in enumerate(NIVELES):
            rx, ry = radios(k)
            ovalo = m.Ellipse(width=2 * rx, height=2 * ry, color=color,
                              stroke_width=6 if k == 7 else 3.5)
            ovalo.set_fill(color, opacity=0.22 if k == 7 else 0.06)
            ovalo.move_to(CENTRO)

            if k < 7:
                etiqueta = m.Text(nombre, font_size=18, color=color, weight=m.BOLD)
                etiqueta.move_to(CENTRO + m.UP * (ry - 0.27))
                ejemplo = m.MathTex(ej, font_size=24)
                ejemplo.move_to(CENTRO + m.DOWN * (ry - 0.22))
            else:
                etiqueta = m.Text(nombre, font_size=30, color=color, weight=m.BOLD)
                etiqueta.move_to(CENTRO + m.UP * 0.2)
                ejemplo = m.MathTex(ej, font_size=28)
                ejemplo.move_to(CENTRO + m.DOWN * 0.24)

            # panel derecho del paso
            paso = m.Text(f"PASO {k + 1} DE 8", font_size=18, color=GRIS)
            titulo = m.Text(nombre, font_size=40, color=color, weight=m.BOLD)
            def_ = m.Text(regla, font_size=24, color=AMARILLO)
            ejp = m.VGroup(m.Text("ej.", font_size=24), m.MathTex(ej, font_size=30)).arrange(m.RIGHT, buff=0.15)
            filas = [paso, titulo, def_, ejp]
            if afuera:
                quien, porque = afuera
                fuera = m.VGroup(
                    m.Text("✗", font_size=26, color=ROJO),
                    m.MathTex(quien, font_size=28, color=ROJO),
                    m.Text("se queda afuera:", font_size=22, color=ROJO),
                ).arrange(m.RIGHT, buff=0.12)
                razon = m.MathTex(porque, font_size=32, color=ROJO)
                filas += [fuera, razon]
            nuevo = m.VGroup(*filas).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.22)
            for fila in filas[1:]:
                fila.align_to(paso, m.LEFT)
            nuevo.move_to([PANEL_X, 0.2, 0]).align_to([PANEL_X - 1.9, 0, 0], m.LEFT)
            if nuevo.width > 4.6:
                nuevo.scale_to_fit_width(4.6).align_to([PANEL_X - 1.9, 0, 0], m.LEFT)

            anims = [m.Create(ovalo, run_time=1.0)]
            if panel is None:
                anims.append(m.FadeIn(nuevo, shift=m.LEFT * 0.3))
            else:
                anims.append(m.FadeOut(panel, shift=m.LEFT * 0.3))
            self.play(*anims)
            if panel is not None:
                self.play(m.FadeIn(nuevo, shift=m.LEFT * 0.3), run_time=0.5)
            self.play(m.FadeIn(etiqueta), m.FadeIn(ejemplo, shift=m.UP * 0.15), run_time=0.6)
            # el ejemplo anterior "se queda afuera": parpadea en rojo
            if ejemplos:
                previo = ejemplos[-1]
                self.play(previo.animate.set_color(ROJO), run_time=0.35)
                self.wait(0.5)
                self.play(previo.animate.set_color(m.WHITE), run_time=0.35)
            else:
                self.wait(0.6)
            ejemplos.append(ejemplo)
            panel = nuevo
            if k == 7:
                self.campo = (ovalo, etiqueta)

        # 3. El campo brilla
        ovalo_campo, etiqueta_campo = self.campo
        brillo = m.Ellipse(width=3.3, height=2.05, color=AMARILLO, stroke_width=0)
        brillo.set_fill(AMARILLO, opacity=0.14).move_to(CENTRO)
        self.play(m.FadeIn(brillo), m.Indicate(etiqueta_campo, color=AMARILLO, scale_factor=1.15), run_time=1.2)
        self.wait(0.6)

        # 4. Cierre: la cadena de inclusiones
        cierre_titulo = m.VGroup(
            m.Text("Cada regla nueva", font_size=36),
            m.Text("encierra a menos", font_size=36, t2c={"menos": AMARILLO}),
        ).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.12)
        renglones = []
        for i, (nombre, _, color, _, _) in enumerate(reversed(NIVELES)):
            simbolo = m.MathTex(r"\subset" if i else r"\phantom{\subset}", font_size=30, color=GRIS)
            renglones.append(m.VGroup(simbolo, m.Text(nombre, font_size=25, color=color)).arrange(m.RIGHT, buff=0.15))
        lista = m.VGroup(*renglones).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.14)
        pie = m.VGroup(m.Text("Hacia adentro:", font_size=20, color=GRIS), m.Text("más reglas, menos miembros.", font_size=20, color=GRIS)).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.08)
        cierre = m.VGroup(cierre_titulo, lista, pie).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.4)
        cierre.move_to([PANEL_X, 0, 0]).align_to([PANEL_X - 1.9, 0, 0], m.LEFT)

        self.play(m.FadeOut(panel, shift=m.LEFT * 0.3))
        self.play(m.Write(cierre_titulo), run_time=1.2)
        self.play(m.LaggedStart(*[m.FadeIn(r, shift=m.RIGHT * 0.2) for r in renglones], lag_ratio=0.25), run_time=2.4)
        self.play(m.FadeIn(pie))
        self.wait(3)
