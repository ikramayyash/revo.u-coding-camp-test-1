# Tasks — Retro Snake Game

## Status Legend
- `[ ]` — Belum dimulai
- `[~]` — Sedang dikerjakan
- `[x]` — Selesai

---

## Task 1 — Scaffolding Proyek

**Status:** `[x]`

Buat struktur file dasar proyek.

### Sub-tasks:
- [x] 1.1 Buat folder `retro-snake-game/` di root workspace
- [x] 1.2 Buat `index.html` dengan struktur HTML5 boilerplate
  - Tambahkan `<link>` ke Google Fonts (`Press Start 2P`)
  - Tambahkan `<link>` ke `style.css`
  - Tambahkan `<script src="game.js" defer>`
- [-] 1.3 Buat `style.css` kosong
- [~] 1.4 Buat `game.js` kosong
- [~] 1.5 Verifikasi file terbuka di browser tanpa error konsol

**Acceptance:** Browser menampilkan halaman kosong tanpa error.

---

## Task 2 — Struktur HTML & HUD

**Status:** `[x]`

Bangun kerangka HTML lengkap sesuai spesifikasi desain.

### Sub-tasks:
- [~] 2.1 Tambahkan `#app-container` sebagai wrapper utama
- [~] 2.2 Tambahkan `#hud` dengan elemen `#score-display` dan `#high-score-display`
- [~] 2.3 Tambahkan elemen `<canvas id="gameCanvas" width="400" height="400">`
- [~] 2.4 Tambahkan `#controls-bar` dengan tombol `#btn-pause` dan teks instruksi keyboard
- [~] 2.5 Tambahkan `#overlay-container` yang berisi `#pause-screen` dan `#gameover-screen`
  - `#gameover-screen` harus memiliki elemen: judul, skor akhir, high score, badge new high score, tombol play again
- [~] 2.6 Set semua overlay ke `display: none` secara default

**Acceptance:** Struktur HTML valid; semua elemen dapat ditemukan via `document.getElementById`.

---

## Task 3 — Styling CSS Arcade 8-bit

**Status:** `[x]`

Implementasikan seluruh desain visual.

### Sub-tasks:
- [~] 3.1 Definisikan CSS custom properties (variabel warna & font)
- [~] 3.2 Style `body` dan `#app-container` (dark background, centering, arcade frame border dengan glow)
- [~] 3.3 Style `#hud` (flex layout, font pixel, warna neon yellow untuk label skor)
- [~] 3.4 Style `<canvas>` (border neon cyan, box-shadow glow, display block)
- [~] 3.5 Style `#controls-bar` (tombol pause bergaya arcade, teks instruksi kecil)
- [~] 3.6 Buat `@keyframes flicker` untuk animasi teks GAME OVER
- [~] 3.7 Buat `@keyframes blink` untuk animasi teks PAUSED
- [~] 3.8 Style `#pause-screen` (overlay semi-transparan, teks besar PAUSED)
- [~] 3.9 Style `#gameover-screen` (overlay, teks GAME OVER dengan animasi flicker, layout tombol)
- [~] 3.10 Style badge `#new-highscore-badge` (warna emas, glow)
- [~] 3.11 Pastikan layout responsif di layar kecil (min-width fallback)

**Acceptance:** Tampilan visual sesuai referensi estetika 8-bit; tidak ada overflow atau elemen terpotong.

---

## Task 4 — Inisialisasi Canvas & State Game

**Status:** `[x]`

Setup dasar game di `game.js`.

### Sub-tasks:
- [~] 4.1 Ambil referensi canvas dan context 2D (`const ctx = canvas.getContext('2d')`)
- [~] 4.2 Definisikan konstanta: `GRID_SIZE`, `CELL_SIZE`, `BASE_SPEED`, `SPEED_INCREMENT`, `MIN_SPEED`
- [~] 4.3 Definisikan objek `state` dengan semua field yang diperlukan
- [~] 4.4 Implementasikan fungsi `init()`:
  - Reset `snake`, `direction`, `nextDirection`, `score`, `status`, `speed`, `tickCount`
  - Baca `highScore` dari `localStorage` (key: `retroSnake_highScore`)
  - Panggil `spawnFood()`
  - Update tampilan HUD
- [~] 4.5 Panggil `init()` saat halaman pertama dimuat

**Acceptance:** `console.log(state)` setelah `init()` menunjukkan state yang benar; tidak ada undefined.

---

## Task 5 — Game Loop & Logika Pergerakan

**Status:** `[x]`

Implementasikan loop utama dan pergerakan ular.

### Sub-tasks:
- [~] 5.1 Implementasikan `gameLoop()` dengan `setTimeout` menggunakan `state.speed`
- [~] 5.2 Implementasikan `applyDirection()` — terapkan `nextDirection` ke `direction`
- [~] 5.3 Implementasikan `moveSnake()`:
  - Hitung posisi kepala baru
  - `unshift` kepala baru ke array `state.snake`
  - `pop` ekor (kecuali jika baru makan makanan)
- [~] 5.4 Implementasikan `checkCollision()`:
  - Cek batas grid (x < 0, x >= GRID_SIZE, y < 0, y >= GRID_SIZE)
  - Cek self-collision (kepala menabrak segmen body lainnya)
  - Panggil `triggerGameOver()` jika terjadi
- [~] 5.5 Implementasikan `checkFoodCollision()`:
  - Jika kepala === posisi makanan: tambah skor, jangan pop ekor, panggil `spawnFood()`
- [~] 5.6 Implementasikan `spawnFood()`:
  - Generate `x` dan `y` acak dalam grid
  - Pastikan posisi tidak ditempati segmen ular manapun (loop ulang jika perlu)
- [~] 5.7 Implementasikan `updateSpeed()`:
  - Setiap kali panjang ular kelipatan 5, kurangi `state.speed` sebesar `SPEED_INCREMENT`
  - Clamp ke `MIN_SPEED`

**Acceptance:** Ular bergerak otomatis, bertambah panjang saat makan, dan game berhenti saat tabrak tepi/diri sendiri.

---

## Task 6 — Rendering Canvas

**Status:** `[x]`

Implementasikan semua fungsi render.

### Sub-tasks:
- [~] 6.1 Implementasikan `render()` yang memanggil semua sub-fungsi render
- [~] 6.2 Implementasikan `drawBackground()`:
  - Fill seluruh canvas dengan `--canvas-bg`
  - Gambar grid tipis (opsional, garis sangat gelap untuk tekstur)
- [~] 6.3 Implementasikan `drawSnake()`:
  - Iterasi `state.snake`; kepala (index 0) warna lebih terang, body lebih gelap
  - Tambahkan `ctx.shadowColor` dan `ctx.shadowBlur` untuk efek neon glow
- [~] 6.4 Implementasikan `drawFood()`:
  - Render kotak merah/oranye dengan glow di posisi `state.food`
  - Opsional: tambah efek pulsing menggunakan `Date.now()` di render
- [~] 6.5 Pastikan `ctx.shadowBlur` di-reset ke 0 setelah setiap elemen untuk tidak bocor ke elemen lain

**Acceptance:** Canvas menampilkan ular neon hijau, makanan merah, dan background hitam dengan grid samar.

---

## Task 7 — Sistem Skor & High Score

**Status:** `[x]`

Implementasikan logika skor dan persistensi.

### Sub-tasks:
- [~] 7.1 Implementasikan `updateScore(points)`:
  - Tambah `state.score` sebesar `points`
  - Update teks `#score-display`
- [~] 7.2 Implementasikan `saveHighScore()`:
  - Bandingkan `state.score` dengan `state.highScore`
  - Jika lebih besar: update `state.highScore`, simpan ke `localStorage`
  - Return `true` jika high score baru, `false` jika tidak
- [~] 7.3 Update `#high-score-display` setiap kali highScore berubah
- [~] 7.4 Panggil `saveHighScore()` di dalam `triggerGameOver()`

**Acceptance:** Skor naik saat makan; high score tersimpan dan tetap ada setelah halaman di-refresh.

---

## Task 8 — Pause / Resume

**Status:** `[x]`

Implementasikan fitur pause dan resume.

### Sub-tasks:
- [~] 8.1 Implementasikan `togglePause()`:
  - Jika `status === 'RUNNING'` → set ke `'PAUSED'`, tampilkan `#pause-screen`
  - Jika `status === 'PAUSED'` → set ke `'RUNNING'`, sembunyikan `#pause-screen`, panggil `gameLoop()`
- [~] 8.2 Pasang event listener pada tombol `#btn-pause` → panggil `togglePause()`
- [~] 8.3 Pasang event listener keyboard untuk key `P` → panggil `togglePause()`
- [~] 8.4 Pastikan `gameLoop()` langsung return jika `status !== 'RUNNING'`

**Acceptance:** Tekan P → ular berhenti, overlay muncul. Tekan P lagi → ular lanjut dari posisi sama.

---

## Task 9 — Layar Game Over Interaktif

**Status:** `[x]`

Implementasikan transisi dan interaksi layar Game Over.

### Sub-tasks:
- [~] 9.1 Implementasikan `triggerGameOver()`:
  - Set `state.status = 'GAMEOVER'`
  - Panggil `saveHighScore()` dan simpan hasilnya (`isNewHighScore`)
  - Isi teks elemen skor akhir dan high score di overlay
  - Tampilkan/sembunyikan `#new-highscore-badge` berdasarkan `isNewHighScore`
  - Tampilkan `#gameover-screen` (tambahkan class atau ubah `display`)
- [~] 9.2 Pasang event listener pada tombol `#btn-play-again` → panggil `restartGame()`
- [~] 9.3 Implementasikan `restartGame()`:
  - Sembunyikan `#gameover-screen`
  - Panggil `init()`
  - Set `state.status = 'RUNNING'`
  - Panggil `gameLoop()`
- [~] 9.4 Pasang event listener keyboard `Enter` untuk restart saat status `GAMEOVER`

**Acceptance:** Layar Game Over tampil dengan animasi; klik/Enter memulai ulang game dengan benar.

---

## Task 10 — Input Keyboard Lengkap

**Status:** `[x]`

Implementasikan semua kontrol keyboard.

### Sub-tasks:
- [~] 10.1 Pasang satu `keydown` event listener global di `document`
- [~] 10.2 Map `ArrowUp`/`w` → `nextDirection = {x:0, y:-1}` (blokir jika arah saat ini ke bawah)
- [~] 10.3 Map `ArrowDown`/`s` → `nextDirection = {x:0, y:1}` (blokir jika arah saat ini ke atas)
- [~] 10.4 Map `ArrowLeft`/`a` → `nextDirection = {x:-1, y:0}` (blokir jika arah saat ini ke kanan)
- [~] 10.5 Map `ArrowRight`/`d` → `nextDirection = {x:1, y:0}` (blokir jika arah saat ini ke kiri)
- [~] 10.6 Map `p`/`P` → `togglePause()` (hanya saat status `RUNNING` atau `PAUSED`)
- [~] 10.7 Map `Enter` → `restartGame()` (hanya saat status `GAMEOVER`) atau `startGame()` (saat `IDLE`)
- [~] 10.8 Panggil `e.preventDefault()` untuk tombol panah agar halaman tidak scroll

**Acceptance:** Semua kontrol keyboard berfungsi; halaman tidak scroll saat menekan panah.

---

## Task 11 — Start Screen (IDLE State)

**Status:** `[x]`

Tambahkan layar awal sebelum game dimulai.

### Sub-tasks:
- [~] 11.1 Buat elemen `#start-screen` di HTML (tersembunyi secara default)
- [~] 11.2 Tampilkan `#start-screen` saat `status === 'IDLE'` di `init()`
- [~] 11.3 Render canvas dalam kondisi statis (ular awal, no movement) saat IDLE
- [~] 11.4 Implementasikan `startGame()` yang menyembunyikan `#start-screen`, set status `RUNNING`, panggil `gameLoop()`
- [~] 11.5 Pasang event listener: klik `#start-screen` atau tekan `Enter` → `startGame()`

**Acceptance:** Saat pertama dibuka, game menampilkan layar start; Enter/klik memulai permainan.

---

## Task 12 — Polish & QA Final

**Status:** `[ ]`

Perbaikan akhir dan pemeriksaan kualitas.

### Sub-tasks:
- [~] 12.1 Uji semua skenario di tabel Testing Strategy (lihat `design.md`)
- [~] 12.2 Pastikan tidak ada memory leak (timer yang tidak di-clear)
- [~] 12.3 Uji persistensi localStorage: skor tersimpan setelah refresh
- [~] 12.4 Cek tampilan di viewport kecil (< 480px)
- [~] 12.5 Pastikan tidak ada scroll otomatis saat menekan tombol panah
- [~] 12.6 Audit aksesibilitas dasar: tombol memiliki `aria-label`, contrast ratio memadai
- [~] 12.7 Minifikasi atau bersihkan komentar debug sebelum rilis

**Acceptance:** Semua skenario lulus; tidak ada error di console; tampilan rapi di berbagai ukuran layar.
