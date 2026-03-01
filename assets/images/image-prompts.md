# Unified image prompts and specs — GeneralControllers

Purpose: consistent visual language for all website imagery. Use these prompts for 3D renders or photorealistic product renders. Use PNG or WebP, optimized for web.

Global style rules (apply to every prompt):
- Lighting: soft studio lighting, neutral white key, subtle rim light.
- Materials: matte metal, painted steel, light anodized finishes.
- Background: clean white to very light steel-blue gradient.
- Color palette: base #eef3f8, secondary #dce6f2, accent #00bcd4 and muted steel tones.
- Camera: slightly elevated 3/8 view for devices; top-down for icons where noted.
- Depth of field: subtle, mild bokeh for background only.
- No text, no logos, no people, no neon, no cartoon.
- Render finish: natural filmic tone, low contrast, no heavy shadows.

Output formats & sizes:
- Hero: 1920x1080, PNG/WebP, high-quality, optimized for web
- Case images: 1200x900, PNG/WebP
- Service visuals (icons): 800x800, PNG/WebP, square

---

## HERO IMAGE
Prompt (concise generator-ready):
"Minimal 3D studio render of a modern smart home cutaway illustrating: an electrical panel with an embedded controller board, heating system elements, sensors, and soft wireless signal lines. Clean composition, white and light steel-blue color palette, matte metal surfaces, soft studio lighting, subtle depth of field, engineering visualization style, no text, no people, highly detailed, photorealistic — aspect 16:9, 1920x1080, PNG/WebP"

Rendering notes: emphasize materials (brushed metal, powder-coated enclosures), avoid glossy/neon highlights; wireframes for signal lines should be subtle, desaturated cyan.

---

## CASE IMAGES (5 prompts)

Case 1 — Electrical breakers control
"3D render of an industrial electrical breaker panel upgraded with a compact embedded control module and small wireless antenna. Clean white/metal background, matte steel surfaces, soft studio lighting, technical precise composition, no text, photorealistic — 1200x900 PNG/WebP"

Case 2 — Elevator control firmware
"Close-up 3D render of an elevator control unit PCB with connectors and microcontroller, high detail, steel and light blue tones, soft studio lighting, clean white background, engineering product render, no text — 1200x900 PNG/WebP"

Case 3 — LoRa smart collar
"Minimal 3D render of a smart animal collar device with small antenna and embedded board, neutral light background, matte plastics and metal, soft shadows, product-focused, no text — 1200x900 PNG/WebP"

Case 4 — Greenhouse automation
"Cutaway 3D visualization of a greenhouse section with sensors, irrigation lines, and a compact control module. Light clean background, technical illustration style, subtle wireless signal indicators (desaturated cyan), soft lighting, no UI overlay — 1200x900 PNG/WebP"

Case 5 — Smart floor heating control
"Minimal 3D render of a floor heating system cutaway showing the heating mat, temperature sensor, and control module. Clean metallic tones, soft studio lighting, subtle depth of field, no text — 1200x900 PNG/WebP"

---

## SERVICES VISUALS (5 prompts — square icons / visuals)

Guidance: keep the same lighting and background as above; simpler compositions, single-subject centered, top-down or neutral angle.

1) Firmware / Embedded
"Top-down minimal 3D render of a microcontroller board placed on a light metallic surface. Matte components, soft studio lighting, white/blue tones, no text — 800x800 PNG/WebP"

2) Equipment Upgrade
"Minimal 3D render of a control board with an added small plug-in module attached, clean metallic background, engineering style, no text — 800x800 PNG/WebP"

3) Smart Home
"Minimal product render: small house outline model with an embedded control module integrated into its base, soft studio lighting, matte finishes, no neon, no text — 800x800 PNG/WebP"

4) IoT
"Small device render emitting subtle signal waves (desaturated cyan) on a clean light background; matte housing, industrial product style, no text — 800x800 PNG/WebP"

5) Prototyping
"Top-down minimal render of a PCB and a few loose components on a clean table with soft shadows; engineering visual, no text — 800x800 PNG/WebP"

---

## Consistency checklist for render pipeline
- Use same HDRI/studio rig across renders for consistent light.
- Use same background gradient or solid tone (#eef3f8 -> #e7edf6).
- Use same DOF settings and camera focal length family (35–50mm equivalent).
- Materials: matte metal, low specular, micro-roughness on metals.
- Color accents: use `#00bcd4` for any signal lines or subtle highlights.
- Export with web-optimized compression and sRGB color profile.

## File naming suggestions
- Hero: hero-1920x1080.png
- Cases: case-01-breakers-1200x900.png ... case-05-heating-1200x900.png
- Services: svc-firmware-800.png, svc-upgrade-800.png, svc-smart-home-800.png, svc-iot-800.png, svc-proto-800.png

---

If you want, I can also generate seedable prompts for a particular renderer (Blender Cycles / KeyShot / DALL·E / Midjourney) — tell me which renderer or generator and I will adapt tone and parameters. 
