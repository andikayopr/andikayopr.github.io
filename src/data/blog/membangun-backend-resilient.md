Membangun Backend yang "Anti-Meledak": Panduan Resilience Pattern di FastAPI
Dalam dunia pengembangan backend, membuat kode yang "jalan" itu mudah. Namun, membuat kode yang tetap "berdiri tegak" saat database mati, API pihak ketiga lemot, atau saat diserang ribuan bot, itulah tantangan sebenarnya.

Sebagai Software Engineer, kita harus memikirkan skenario terburuk. Berikut adalah 5 pilar utama untuk membangun sistem yang tahan banting (resilient) menggunakan FastAPI.

1. Graceful Shutdown: "Pamitan" yang Sopan
Bayangkan Anda sedang menulis data ke database, lalu tiba-tiba server dimatikan paksa. Data bisa korup. Graceful Shutdown memastikan aplikasi kita menyelesaikan semua tugasnya dan menutup koneksi database dengan rapi sebelum benar-benar mati.

Prinsip Sederhana: Jangan biarkan pintu terbuka saat Anda meninggalkan rumah.

Python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP: Buka koneksi database
    app.state.pool = await asyncpg.create_pool(DATABASE_URL)
    yield
    # SHUTDOWN: Tutup koneksi dengan rapi
    if app.state.pool:
        await app.state.pool.close()
2. Exponential Backoff (Retry): "Sabar Tetap Gigih"
Koneksi internet tidak selalu stabil. Terkadang terjadi "glitch" selama 1 detik. Daripada langsung memberikan error ke user, sistem kita harus mencoba lagi secara otomatis.

Exponential Backoff artinya kita menunggu sedikit lebih lama di setiap percobaan (1 detik, lalu 2 detik, lalu 4 detik) agar tidak membebani server yang mungkin sedang sesak napas.

Python
@retry(wait=wait_exponential(multiplier=1, min=1, max=10), stop=stop_after_attempt(3))
async def call_database():
    # Jika gagal, akan dicoba lagi otomatis
    ...
3. Circuit Breaker: "Sekring Pengaman"
Jika database mati total, melakukan retry terus-menerus hanya akan membuang waktu dan resource. Circuit Breaker berfungsi seperti sekring listrik di rumah.

Jika terjadi kegagalan berturut-turut (misal 3 kali), saklar akan TERBUKA (OPEN). Selama saklar terbuka, semua request akan langsung ditolak di depan pintu. Ini memberi waktu bagi database untuk "bernapas" dan pulih tanpa gangguan.

Status Circuit Breaker:

Closed: Normal, semua jalan.

Open: Bahaya, semua akses diputus sementara.

Half-Open: Mencoba mengirim 1 request untuk cek apakah sudah sembuh.

4. Rate Limiting: "Budaya Antre"
Jangan biarkan satu user atau bot menghabiskan seluruh tenaga server Anda. Rate Limiting membatasi berapa banyak request yang boleh dilakukan oleh satu alamat IP dalam waktu tertentu (misal: maksimal 5 kali per menit).

Ini melindungi sistem dari serangan spam dan memastikan layanan tetap adil bagi pengguna lain.

Python
@limiter.limit("5/minute")
async def get_pajak(request: Request):
    ...
5. Structured Logging & Observability: "Kotak Hitam Pesawat"
Saat terjadi error, jangan cuma bilang "Something went wrong". Gunakan Structured Logging dengan Request ID.

Setiap request diberikan satu ID unik. Jika ada error, kita bisa melacak seluruh jejak perjalanan request tersebut dari awal sampai akhir. Kita juga mencatat Latency (berapa lama proses berjalan) untuk memantau performa sistem (P95).

Plaintext
# Contoh Log yang Bagus:
INFO | ID: 8a2b-123 | Incoming Request: /create
WARN | ID: 8a2b-123 | Database Timeout, Retrying...
INFO | ID: 8a2b-123 | Success | Latency: 450ms

Kesimpulan
Kita tidak berasumsi sistem akan selalu lancar, tapi kita mempersiapkan sistem untuk tetap tenang saat terjadi bencana.