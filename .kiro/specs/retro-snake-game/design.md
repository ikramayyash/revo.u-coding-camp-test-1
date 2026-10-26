# Design — Retro Snake Game

## Arsitektur Umum

Proyek ini adalah **Single-Page Application (SPA)** tanpa framework dan tanpa dependensi npm. Seluruh kode dibagi menjadi tiga file utama:

```
retro-snake-game/
├── index.html       # Struktur HTML + referensi ke font & asset
├── style.css        # Styling arcade 8-bit (CSS modern)
└── game.js          # Seluruh logika game (ES6+ vanilla JS)
```

---

## Struktur HTML (`index.html`)

```
<body>
  ├── #app-container         — wrapper utama (centering + border arcade)
  │   ├── #hud               — Heads-Up Display
  │   │   ├── #score-display        — "SCORE: 000"
  │   │   └── #high-score-display   — "BEST: 000"
  │   ├── <canvas id="gameCanvas">  — area render utama (400×400)
  │   └── #controls-bar      — tombol PAUSE + instruksi keyboard
  └── #overlay-container     — layar overlay (pause / game over)
      ├── #pause-screen
      └── #gameover-screen
```

---

## Desain Visual & CSS

### Palet Warna

| Token          | Nilai         | Kegunaan                     |
|----------------|---------------|------------------------------|
| `--bg`         | `#0a0a1a`     | Latar halaman                |
| `--canvas-bg`  | `#000`        | Latar canvas                 |
| `--neon-green` | `#39ff14`     | Warna ular (kepala + badan)  |
| `--neon-cyan`  | `#00f5ff`     | Aksen border & frame         |
| `--neon-red`   | `#ff3131`     | Makanan                      |
| `--neon-yellow`| `#ffe000`     | Teks skor & label            |
| `--text-dim`   | `#888`        | Teks sekunder                |

### Font

- **`Press Start 2P`** (Google Fonts) — dipakai untuk semua teks UI.
- Fallback: `monospace`.

### Efek CSS

- `box-shadow` dengan warna neon (`glow effect`) pada canvas border dan teks penting.
- `@keyframes flicker` — animasi flicker untuk teks "GAME OVER".
- `@keyframes blink` — animasi blink untuk teks "PAUSED".
- Canvas dibungkus border bergaya scanline/CRT menggunakan `::before` pseudo-element.

---

## State Machine Game

```
       ┌──────────────┐
       │    IDLE       │  ← Halaman pertama kali dibuka
       └──────┬───────┘
              │ Tekan ENTER / Klik START
              ▼
       ┌──────────────┐
  ┌──▶ │   RUNNING    │ ◀────────────────────┐
  │    └──────┬───────┘                      │
  │           │ Tekan P / Klik Pause          │
  │           ▼                              │
  │    ┌──────────────┐                      │
  │    │    PAUSED    │                      │
  │    └──────┬───────┘                      │
  │           │ Tekan P / Klik Resume         │
  └───────────┘                              │
                                             │
       Tabrakan dinding / diri sendiri       │
              │                              │
              ▼                              │
       ┌──────────────┐                      │
       │  GAME OVER   │ ─── PLAY AGAIN ──────┘
       └──────────────┘
```

---

## Logika Game (`game.js`)

### Struktur Data

```javascript
// State utama
const state = {
  snake: [{ x, y }],     // Array segmen; index 0 = kepala
  direction: { x, y },   // Vektor arah saat ini
  nextDirection: { x, y },
  food: { x, y },
  score: 0,
  highScore: 0,           // Dibaca dari localStorage
  status: 'IDLE',         // 'IDLE' | 'RUNNING' | 'PAUSED' | 'GAMEOVER'
  speed: BASE_SPEED,      // ms per tick
  tickCount: 0,
};

// Konstanta
const GRID_SIZE = 20;       // jumlah sel per sisi
const CELL_SIZE = 20;       // pixel per sel
const BASE_SPEED = 150;     // ms
const SPEED_INCREMENT = 10; // ms dikurangi setiap 5 segmen
const MIN_SPEED = 60;       // batas kecepatan maksimum
```

### Game Loop

Menggunakan `setTimeout` (bukan `requestAnimationFrame`) agar kecepatan game bisa dikontrol secara presisi berdasarkan `state.speed`.

```
gameLoop()
  ├── if status !== RUNNING → return
  ├── update()
  │     ├── applyDirection()      — terapkan nextDirection ke direction
  │     ├── moveSnake()           — geser semua segmen
  │     ├── checkCollision()      — dinding & diri sendiri → GAMEOVER
  │     ├── checkFoodCollision()  — konsumsi makanan, tambah skor, spawn makanan baru
  │     └── updateSpeed()         — cek apakah perlu naikkan kecepatan
  ├── render()
  │     ├── drawBackground()
  │     ├── drawFood()
  │     └── drawSnake()
  └── setTimeout(gameLoop, state.speed)
```

### Fungsi Kunci

| Fungsi               | Tanggung Jawab                                              |
|----------------------|-------------------------------------------------------------|
| `init()`             | Reset seluruh state, baca highScore dari localStorage       |
| `spawnFood()`        | Generate posisi acak yang tidak ditempati ular              |
| `moveSnake()`        | Prepend kepala baru, pop ekor (kecuali ada makanan)         |
| `checkCollision()`   | Cek batas grid + self-collision                             |
| `triggerGameOver()`  | Set status, simpan highScore, tampilkan overlay             |
| `togglePause()`      | Toggle status PAUSED/RUNNING, tampilkan/sembunyikan overlay |
| `updateSpeed()`      | Kurangi `state.speed` tiap kelipatan 5 ekor (min capped)    |
| `drawSnake()`        | Render tiap segmen; kepala berwarna lebih terang             |
| `drawFood()`         | Render makanan dengan efek glow (shadow ctx)                |

### Rendering Canvas

```javascript
// Contoh render ular
function drawSnake() {
  state.snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#39ff14' : '#28b800';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = i === 0 ? 12 : 6;
    ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  });
}
```

---

## Persistensi Data

- **Key localStorage**: `retroSnake_highScore`
- Dibaca saat `init()` dipanggil.
- Ditulis saat `triggerGameOver()` jika skor akhir > highScore tersimpan.

---

## Penanganan Input

| Input              | Aksi                                 |
|--------------------|--------------------------------------|
| `ArrowUp` / `W`    | Arah atas (jika bukan sedang ke bawah) |
| `ArrowDown` / `S`  | Arah bawah (jika bukan sedang ke atas) |
| `ArrowLeft` / `A`  | Arah kiri (jika bukan sedang ke kanan) |
| `ArrowRight` / `D` | Arah kanan (jika bukan sedang ke kiri) |
| `P`                | Toggle pause/resume                  |
| `Enter`            | Start game (IDLE) / Restart (GAMEOVER) |

Input disimpan ke `state.nextDirection` dan baru diterapkan di awal game tick berikutnya untuk mencegah self-reverse di tick yang sama.

---

## Overlay Screens

### Pause Screen
- Overlay semi-transparan di atas canvas.
- Teks "⏸ PAUSED" dengan animasi `blink`.

### Game Over Screen
- Overlay dengan teks "GAME OVER" ber-animasi `flicker`.
- Tampilkan `SCORE` dan `BEST`.
- Jika skor baru = high score: tampilkan badge "✦ NEW HIGH SCORE ✦".
- Tombol "▶ PLAY AGAIN" (keyboard: `Enter`).

---

## Testing Strategy

| Skenario                            | Cara Verifikasi                               |
|-------------------------------------|-----------------------------------------------|
| Ular bergerak setiap tick           | Visual di browser + console log koordinat     |
| Input 180° diabaikan                | Tekan ↑ saat arah ↓ — kepala tidak berbalik   |
| Skor bertambah saat makan           | UI score counter terupdate real-time          |
| High score tersimpan di localStorage| DevTools → Application → localStorage        |
| Pause menghentikan loop             | Tekan P → ular berhenti, overlay muncul       |
| Game Over muncul saat tabrak dinding| Jalankan ke tepi — overlay tampil             |
| Restart mereset state penuh         | Klik PLAY AGAIN → ular kembali ke awal, skor 0|
| Kecepatan naik tiap 5 ekor          | Observasi visual atau log `state.speed`       |
