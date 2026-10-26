# Requirements — Retro Snake Game

## Pendahuluan

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional untuk proyek **Retro Snake Game**, sebuah game berbasis web yang menampilkan estetika arcade 8-bit klasik. Game dibangun menggunakan HTML5 Canvas dan JavaScript murni, tanpa dependensi eksternal.

---

## User Stories & Acceptance Criteria

### 1. Gameplay Inti

**US-01 — Pergerakan Ular**
WHEN pemain menekan tombol panah (↑ ↓ ← →) atau WASD,
THE SYSTEM SHALL menggerakkan kepala ular ke arah yang dipilih pada setiap game tick.

WHEN ular bergerak maju,
THE SYSTEM SHALL memperbarui posisi setiap segmen tubuh mengikuti kepala.

WHEN pemain mencoba membalik arah 180°,
THE SYSTEM SHALL mengabaikan input tersebut dan mempertahankan arah saat ini.

---

**US-02 — Konsumsi Makanan**
WHEN kepala ular menabrak posisi makanan,
THE SYSTEM SHALL menambah satu segmen baru di ekor ular dan menambah skor.

WHEN makanan dikonsumsi,
THE SYSTEM SHALL memunculkan makanan baru di posisi acak yang tidak ditempati ular.

---

**US-03 — Kondisi Game Over**
WHEN kepala ular menabrak batas tepi grid,
THE SYSTEM SHALL menghentikan game dan menampilkan layar Game Over.

WHEN kepala ular menabrak segmen tubuhnya sendiri,
THE SYSTEM SHALL menghentikan game dan menampilkan layar Game Over.

---

### 2. Sistem Skor

**US-04 — Score Counter**
WHEN pemain mengonsumsi makanan,
THE SYSTEM SHALL menambah skor sebesar 10 poin dan menampilkan nilai terkini secara real-time di UI.

WHEN game baru dimulai,
THE SYSTEM SHALL mereset skor ke 0.

---

**US-05 — High Score**
WHEN sesi game berakhir (Game Over),
THE SYSTEM SHALL membandingkan skor akhir dengan high score yang tersimpan.

WHEN skor akhir melebihi high score yang tersimpan,
THE SYSTEM SHALL memperbarui high score dan menyimpannya ke `localStorage`.

WHEN pemain membuka atau me-refresh halaman,
THE SYSTEM SHALL membaca high score dari `localStorage` dan menampilkannya.

---

### 3. Kontrol Pause / Resume

**US-06 — Pause Game**
WHEN pemain menekan tombol `P` atau mengklik tombol Pause di UI,
THE SYSTEM SHALL menghentikan sementara loop game (ular berhenti bergerak, timer berhenti).

WHEN game dalam kondisi pause,
THE SYSTEM SHALL menampilkan overlay "PAUSED" di atas canvas.

---

**US-07 — Resume Game**
WHEN game sedang pause dan pemain menekan `P` atau mengklik tombol Resume,
THE SYSTEM SHALL melanjutkan loop game dari kondisi terakhir.

---

### 4. Layar Game Over

**US-08 — Tampilan Game Over Interaktif**
WHEN game berakhir,
THE SYSTEM SHALL menampilkan layar Game Over dengan:
- Teks "GAME OVER" dengan animasi (misalnya flicker atau fade-in).
- Skor akhir pemain.
- High score terkini.
- Pesan khusus jika pemain mencetak high score baru ("NEW HIGH SCORE!").
- Tombol "PLAY AGAIN" untuk memulai ulang game.

WHEN pemain mengklik "PLAY AGAIN" atau menekan `Enter`,
THE SYSTEM SHALL mereset state game dan memulai sesi baru.

---

### 5. Visual & Estetika 8-bit

**US-09 — Desain Arcade**
WHEN game dirender,
THE SYSTEM SHALL menampilkan:
- Grid pixel-art di canvas sebagai latar game.
- Ular dengan warna neon (hijau, cyan, dll.) dan makanan dengan warna kontras (merah/oranye).
- Font bergaya pixel (misalnya `Press Start 2P` dari Google Fonts).
- Warna latar dark mode (#000 atau dark navy) untuk kesan CRT monitor lama.
- Efek visual border/frame bergaya arcade di sekeliling canvas.

---

### 6. Kecepatan & Kesulitan

**US-10 — Peningkatan Kecepatan**
WHEN panjang ular meningkat setiap kelipatan 5 segmen,
THE SYSTEM SHALL meningkatkan kecepatan game tick secara bertahap (batas maksimum ditentukan).

---

## Batasan & Asumsi

- Game hanya berjalan di browser modern (Chrome, Firefox, Edge terbaru).
- Tidak memerlukan backend — semua state disimpan di memori dan `localStorage`.
- Resolusi canvas: **400×400px** (grid 20×20, tiap sel 20px).
- Tidak ada audio di versi pertama (bisa ditambahkan iterasi berikutnya).
- Aksesibilitas keyboard penuh (semua aksi dapat dilakukan tanpa mouse).
