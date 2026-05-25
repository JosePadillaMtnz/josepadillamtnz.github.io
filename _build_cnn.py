#!/usr/bin/env python3
"""Restructures cnn.html into a 3-tab layout preserving all existing JS/HTML."""
import re

with open('/home/thinkmeapp/personal/webapge/cnn.html', 'r') as f:
    html = f.read()

# ── Locate section boundaries ───────────────────────────────────────────────
arq_start      = html.index('<!-- ═══════════════════════════════════════════\n     ARQUITECTURA')
conv_start     = html.index('<!-- ═══════════════════════════════════════════\n     CONVOLUCI')
upload_start   = html.index('<!-- ═══════════════════════════════════════════\n     TU IMAGEN') \
                 if '     TU IMAGEN' in html \
                 else html.index('<section id="tu-imagen">')
yolo_start     = html.index('<!-- ═══════════════════════════════════════════\n     YOLO')
footer_start   = html.index('<!-- FOOTER -->')
scripts_start  = html.index('<!-- ═══════════════ SCRIPTS ═══════════════ -->')

before_arq   = html[:arq_start]
arq_section  = html[arq_start:conv_start]
conv_section = html[conv_start:upload_start]
upload_section = html[upload_start:yolo_start]
yolo_section = html[yolo_start:footer_start]
footer_html  = html[footer_start:scripts_start]
scripts_html = html[scripts_start:]

# ── Patch head: add TF.js, update title ────────────────────────────────────
tfjs = '''  <!-- TF.js (lazy-loaded, Tab 3 only) -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js" defer></script>
'''
before_arq = before_arq.replace(
    '<link rel="stylesheet" href="style.css" />',
    '<link rel="stylesheet" href="style.css" />\n' + tfjs
)
before_arq = before_arq.replace(
    '<title>¿Cómo aprende una CNN? — José Padilla</title>',
    '<title>Redes Neuronales Convolucionales — José Padilla</title>'
)

# ── Patch nav: replace step-links with tab-buttons ─────────────────────────
old_nav_links = '''    <ul class="nav-links">
      <li><a href="#arquitectura">Arquitectura</a></li>
      <li><a href="#convolucion">Convolución</a></li>
      <li><a href="#tu-imagen">Tu imagen</a></li>
      <li><a href="#yolo">YOLO</a></li>
    </ul>'''
new_nav_links = '''    <ul class="nav-links">
      <li><button class="tab-nav-btn" onclick="activateTab(\'fundamentos\')">Fundamentos</button></li>
      <li><button class="tab-nav-btn" onclick="activateTab(\'interactivo\')">Interactivo</button></li>
      <li><button class="tab-nav-btn" onclick="activateTab(\'playground\')">Playground</button></li>
    </ul>'''
before_arq = before_arq.replace(old_nav_links, new_nav_links)

# ── Patch hero: update subtitle & CTAs ────────────────────────────────────
before_arq = before_arq.replace(
    '<span class="section-label">Guía interactiva</span>',
    '<span class="section-label">Guía completa CNN</span>'
)
old_ctabtn = '''    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="#convolucion" class="btn btn-primary">Ver animación</a>
      <a href="#tu-imagen" class="btn btn-secondary">Probar con mi imagen</a>
    </div>'''
new_ctabtn = '''    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <button onclick="activateTab(\'fundamentos\')" class="btn btn-primary">📚 Fundamentos</button>
      <button onclick="activateTab(\'interactivo\')" class="btn btn-secondary">🔬 Interactivo</button>
      <button onclick="activateTab(\'playground\')" class="btn btn-secondary">🎮 Playground</button>
    </div>'''
before_arq = before_arq.replace(old_ctabtn, new_ctabtn)

# ── Remove "Paso N" labels from moved sections ──────────────────────────────
for old, new in [
    ('<span class="section-label">Paso 1</span>', '<span class="section-label">Interactivo · 1</span>'),
    ('<span class="section-label">Paso 2</span>', '<span class="section-label">Interactivo · 2</span>'),
    ('<span class="section-label">Paso 3</span>', '<span class="section-label">Playground</span>'),
    ('<span class="section-label">Paso 4</span>', '<span class="section-label">Interactivo · 3</span>'),
]:
    arq_section   = arq_section.replace(old, new)
    conv_section  = conv_section.replace(old, new)
    upload_section = upload_section.replace(old, new)
    yolo_section  = yolo_section.replace(old, new)

# ── Assemble new HTML ────────────────────────────────────────────────────────
TAB_NAV = '''
<!-- ── TAB NAVIGATION ─────────────────────── -->
<div class="cnn-tabs-nav" id="cnnTabsNav">
  <button class="tab-btn" data-tab="fundamentos">📚 Fundamentos</button>
  <button class="tab-btn active" data-tab="interactivo">🔬 Comprensión Interactiva</button>
  <button class="tab-btn" data-tab="playground">🎮 Prueba tú mismo</button>
</div>

'''

new_html = (
    before_arq
    + TAB_NAV
    + '<!-- ── TAB 1: FUNDAMENTOS ─────────────────── -->\n'
    + '<div class="tab-panel" id="tab-fundamentos">\n'
    + '<!-- FUNDAMENTOS_CONTENT -->\n'
    + '</div>\n\n'
    + '<!-- ── TAB 2: INTERACTIVO ─────────────────── -->\n'
    + '<div class="tab-panel active" id="tab-interactivo">\n'
    + arq_section
    + conv_section
    + '\n<!-- INTERACTIVO_NEW_SECTIONS -->\n\n'
    + yolo_section
    + '</div>\n\n'
    + '<!-- ── TAB 3: PLAYGROUND ──────────────────── -->\n'
    + '<div class="tab-panel" id="tab-playground">\n'
    + '<!-- PLAYGROUND_UI -->\n\n'
    + upload_section
    + '</div>\n\n'
    + footer_html
    + scripts_html
)

with open('/home/thinkmeapp/personal/webapge/cnn.html', 'w') as f:
    f.write(new_html)

print("Done. Placeholders inserted:")
for p in ['FUNDAMENTOS_CONTENT', 'INTERACTIVO_NEW_SECTIONS', 'PLAYGROUND_UI']:
    print(f"  <!-- {p} --> found:", f'<!-- {p} -->' in new_html)
