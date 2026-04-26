---
author: andikayopr
pubDatetime: 2026-04-26T22:22:15+07:00
modDatetime: 2026-04-26T22:22:15+07:00
title: Logging bukan sekedar teks
featured: true
draft: false
tags:
  - backend
  - logging
description: Logging bukan sekedar teks, tapi mata kita di sistem yang buta.
---

Banyak dari kita menganggap *logging* itu remeh. *"Yang penting muncul di konsol,"* pikir kita. Sampai akhirnya terjadi insiden di jam 2 pagi, dan kamu sadar kalau log yang kamu punya cuma tumpukan teks acak yang tidak membantu sama sekali.

Sebagai backend engineer, *logging* adalah mata kamu di sistem yang buta. Kalau kamu ingin naik level dari sekadar "bisa ngoding" jadi engineer yang bertanggung jawab atas sistem production, kamu harus serius mengelola log.

## 1. Berhenti Pakai Plain Text, Mulailah dengan Structured Logging
Komputer sangat payah dalam membaca paragraf, tapi sangat jago membaca **JSON**.

* **Cara Buruk:** `[INFO] User 12345 sukses checkout barang 67890 di jam 10:00`
* **Cara Pro (Structured):**
    ```json
    {
      "level": "info",
      "event": "checkout_success",
      "user_id": 12345,
      "item_id": 67890,
      "duration_ms": 150,
      "trace_id": "a1-b2-c3-d4",
      "service": "order-service"
    }
    ```
Dengan format JSON, kamu bisa melakukan filter di Log Management tool (misalnya: "Tampilkan semua user yang gagal checkout dalam 5 menit terakhir") hanya dalam hitungan detik.

## 2. Kenali Log Level Kamu
Jangan memukul rata semua log. Gunakan kasta yang jelas agar kamu tidak pusing saat melakukan *debugging*:

* **DEBUG:** Informasi detail untuk masa pembangunan (matikan di produksi agar tidak memenuhi storage).
* **INFO:** Kejadian normal yang penting (misal: "Service started", "Payment processed").
* **WARN:** Ada yang aneh, tapi sistem masih bisa jalan (misal: "Database connection slow, retrying...").
* **ERROR:** Ada yang rusak dan butuh perhatian segera (misal: "API gateway timeout").
* **FATAL:** Sistem mati total dan tidak bisa lanjut jalan.

## 3. Context is King: Trace ID
Di sistem yang kompleks (terutama kalau kamu main di microservices atau modular monolith), satu *request* bisa melewati banyak fungsi atau service. Tanpa **Trace ID**, kamu akan tersesat.

Pastikan setiap request memiliki ID unik yang ditempelkan di setiap baris log terkait. Begitu ada error, kamu cukup cari satu ID itu, dan kamu bisa melihat seluruh perjalanan datanya dari awal sampai akhir tanpa menebak-nebak.

## 4. Rekomendasi Tech Stack untuk Kamu
Jangan simpan log di file `.log` di server. Itu cara lama yang menyulitkan kalau server kamu sudah lebih dari satu. Cobalah stack modern ini:

| Komponen | Pilihan Populer | Mengapa Ini? |
| :--- | :--- | :--- |
| **Shipper** | **Fluent Bit** atau **Vector** | Mengambil log dari aplikasi dan mengirimnya ke pusat data dengan sangat ringan. |
| **Storage & Search** | **Grafana Loki** | Sedang naik daun karena jauh lebih ringan dari Elasticsearch dan hemat storage. |
| **Visualization** | **Grafana** | Dashboard andalan untuk melihat grafik error sekaligus mencari log secara visual. |
| **Library (Go)** | **Zap** atau **Zerolog** | Sangat cepat, alokasi memori rendah, dan mendukung JSON logging secara native. |
| **Library (.NET)** | **Serilog** | Sangat fleksibel dan punya banyak "sinks" untuk kirim log ke mana saja. |

## 5. Pesan Penting: Jangan Log Data Sensitif!
Ini adalah kesalahan fatal yang sering terjadi. Jangan pernah memasukkan data berikut ke dalam log:
* Password, PIN, atau Token.
* Nomor kartu kredit (CVV).
* Data pribadi (PII) seperti alamat lengkap atau nomor HP tanpa disensor.

Selalu lakukan *masking* (misal: `0812****123`) sebelum data dikirim ke storage log kamu.

---

## Kesimpulan
Log management yang baik adalah investasi agar kamu bisa tidur nyenyak. Mungkin terasa repot di awal saat menyusun konfigurasinya, tapi saat sistem kamu *scaled up* atau ada bug misterius di production, kamu akan berterima kasih pada dirimu sendiri karena sudah punya log yang rapi.