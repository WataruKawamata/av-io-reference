# AV I/O Reference

Physical connector reference for professional AV equipment — inputs and outputs at a glance.

## Features

- **Category tabs** — Video Switchers, Cameras, Capture, Audio, Monitors, Routing
- **Connector color codes** — HDMI / SDI / XLR / TRS / USB / LAN / BNC
- **Signal flow** diagram per device
- **Notes** — key caveats, firmware info, workflow tips
- **Badges** — LEGACY and CONSUMER/PROSUMER labels
- **Search** — press `/` to focus, `Esc` to clear

## Equipment covered

| Category | Manufacturers |
|---|---|
| Video Switcher / Mixer | Roland (V-02HD MK II → V-600UHD, VR-4HD, VR-6HD, VR-120HD, SR-20HD), Blackmagic ATEM Mini / SDI / Television Studio / Constellation series |
| Camera — Cinema Line | Sony VENICE 2, BURANO, FX9, FX6, FX3, FX30, FR7 (PTZ) |
| Camera — XDCAM | Sony PXW-Z200, Z280, Z190, Z90V, X400, X500, FS7/FS7M2, FS5/FS5M2 |
| Camera — NXCAM | Sony HXR-NX800, NX200, NX100, NX80, NX5R, MC88 |
| Camera — Consumer | Sony FDR-AX700, AX45A, AX100, HDR-CX900 / FDR-AX1 |
| Camera — Alpha | Sony α1, α7S III, α7S II, α7R V, α7C II, α6700, α6600, ZV-E1, ZV-E10 II |
| Capture / Encoder | Elgato Cam Link 4K, Blackmagic UltraStudio 4K Mini |
| Audio Interface | Focusrite Scarlett 2i2 (4th Gen) |
| Audio Mixer | Allen & Heath SQ-5 |
| Field Monitor | SmallHD Cine 13, TVLogic SVM-130P |
| Distribution / Routing | Blackmagic Smart Videohub 12×12, Mini Converter SDI Distribution, HDMI↔SDI 6G converters |

## File structure

```
├── index.html    — HTML shell (layout only)
├── style.css     — All styles
├── devices.js    — Device database (CATS + DEVICES arrays)
├── app.js        — Render logic, search, event handlers
└── README.md
```

## Adding a device

Open `devices.js` and add an entry to the `DEVICES` array:

```js
{ id: 'unique-id', category: 'switcher', maker: 'Brand', model: 'Model Name', icon: '🎛️',
  inputs:  [{ name: 'HDMI IN', count: '4×', detail: 'Up to 1080p60', type: 'hdmi' }],
  outputs: [{ name: 'HDMI OUT', count: '2×', detail: 'Program + Preview', type: 'hdmi' }],
  notes:   ['Any important notes here'],
  signal:  ['HDMI IN ×4', '▶ Model Name', 'HDMI OUT ×2'] },
```

**`category`** — one of: `switcher` `camera` `capture` `audio` `mixer` `monitor` `routing`

**`type`** (connector chip color) — one of: `hdmi` `sdi` `xlr` `trs` `mini` `rca` `usb` `lan` `bnc` `other`

**Optional flags**: `legacy: true` · `consumer: true`
