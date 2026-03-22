# Konteks Laporan KP — Ferdian (UDINUS)

## Identitas

- **Nama**: Ferdian
- **Kampus**: Universitas Dian Nuswantoro (UDINUS)
- **Posisi KP**: Frontend Developer & AI Engineer (merangkap Project Manager)
- **Mitra**: PT. Telkom Indonesia (Witel Semarang), divisi SSGS (_Shared Service and General Support_)
- **Durasi KP**: 1 bulan onsite
- **Dosen Pembimbing**: Eko Hari Rachmawanto, M.Kom

---

## Judul Final

> "Implementasi Supervised Fine-Tuning FunctionGemma 270M untuk Asisten Virtual Berbasis Natural Language Processing pada Sistem Manajemen Inventaris"

---

## Data Teknis

| Item               | Nilai                                                  |
| ------------------ | ------------------------------------------------------ |
| Model              | FunctionGemma 270M                                     |
| Metode fine-tuning | Supervised Fine-Tuning (SFT)                           |
| Library            | `SFTTrainer` dari `trl`                                |
| Dataset            | 300 sampel (235 train / 65 eval)                       |
| Bahasa dataset     | Indonesia, multi-style                                 |
| Gaya tutur dataset | Formal, Semi-Formal, Kasual, Keyword Only, Interogatif |
| Jumlah fungsi      | 7 fungsi read-only                                     |
| Deployment AI      | HuggingFace Spaces free tier (FastAPI + Docker)        |
| Backend            | Node.js (Railway)                                      |
| Database           | PostgreSQL (Neon DB)                                   |
| Bot                | Telegram Bot API                                       |
| Frontend           | React + TypeScript + TanStack Query + shadcn/ui + Zod  |

kita belum bahas hasil karena ini ada di bab 4 nanti

### Distribusi Dataset per Fungsi

| Fungsi                 | Train | Eval | Total |
| ---------------------- | ----- | ---- | ----- |
| NO_FUNCTION_CALL       | 25    | 5    | 30    |
| getAvailableItems      | 30    | 10   | 40    |
| getItemHistoryLocation | 25    | 10   | 35    |
| getItemInfo            | 30    | 10   | 40    |
| getItemLocation        | 30    | 10   | 40    |
| getItemStock           | 35    | 5    | 40    |
| getMostBorrowedItems   | 30    | 5    | 35    |
| getUserActiveLoans     | 30    | 10   | 40    |

---

## Arsitektur Sistem

- **Web** → murni manajemen inventaris (CRUD, tracking lokasi, berita acara otomatis, manajemen peminjaman)
- **Telegram bot** → pintu masuk AI natural language (terpisah dari web, tidak ada UI AI di web)
- **AI service** → FastAPI di HuggingFace Spaces, dipanggil oleh backend Node.js
- **Auth Telegram** → pengguna harus terdaftar di database oleh admin sebelum bisa akses bot
- **Mode guest** → semua orang bisa akses website tanpa login

---

## Bab 2 — Landasan Teori

### 2.1 Sistem Informasi Inventaris

Sistem informasi inventaris adalah sistem yang dirancang untuk mengelola, memantau, dan mengendalikan aset atau barang milik organisasi secara terpusat dan terstruktur (Laudon & Laudon, 2022). Dalam lingkup organisasi yang mengelola aset dalam jumlah besar, ketersediaan sistem informasi inventaris yang andal menjadi kebutuhan operasional yang krusial, karena ketidakakuratan data barang dapat berdampak langsung pada efisiensi kerja dan akuntabilitas aset.

Manajemen inventaris secara tradisional dilakukan menggunakan formulir fisik atau _spreadsheet_, pendekatan yang memiliki sejumlah kelemahan mendasar seperti tingginya risiko kesalahan pencatatan, sulitnya penelusuran riwayat aset, lambatnya proses persetujuan peminjaman, dan tidak adanya visibilitas _real-time_ terhadap status barang (Tiwari et al., 2022). Otomatisasi melalui sistem informasi digital memungkinkan organisasi mengatasi kelemahan tersebut dengan memanfaatkan teknologi seperti kode QR untuk identifikasi aset, basis data terpusat untuk pencatatan status, serta antarmuka digital untuk pengajuan dan persetujuan permintaan (Zhong et al., 2023).

Lebih lanjut, integrasi kecerdasan buatan dalam sistem inventaris membuka peluang otomatisasi pada level yang lebih tinggi, yakni kemampuan sistem untuk memahami pertanyaan pengguna dalam bahasa alami dan secara otomatis mengeksekusi pencarian data yang relevan. Pendekatan inilah yang menjadi landasan pengembangan asisten virtual berbasis _natural language_ dalam penelitian ini.

### 2.2 Natural Language Processing (NLP)

#### 2.2.1 Pengertian dan Pemrosesan Perintah Pengguna

_Natural Language Processing_ (NLP) adalah cabang kecerdasan buatan yang memungkinkan komputer untuk memahami, menginterpretasikan, dan menghasilkan bahasa manusia secara otomatis (Jurafsky & Martin, 2023). Dalam konteks sistem interaktif, NLP berperan sebagai jembatan antara input bahasa alami pengguna dengan aksi yang dapat dieksekusi oleh sistem.

Dua tugas NLP yang paling relevan dalam penelitian ini adalah _intent recognition_ dan ekstraksi informasi. _Intent recognition_ adalah proses mengidentifikasi maksud di balik pernyataan pengguna (Weld et al., 2022), misalnya mengenali bahwa kalimat "laptop ada berapa yang tersedia?" bermaksud memeriksa stok barang. Ekstraksi informasi bertugas mengambil entitas spesifik dari teks tersebut, misalnya kata kunci "laptop" sebagai objek pencarian (Nasar et al., 2021). Kombinasi keduanya memungkinkan sistem menerjemahkan bahasa alami menjadi aksi terstruktur yang dapat diproses oleh mesin.

Dalam penelitian ini, kedua tugas tersebut tidak diimplementasikan sebagai _pipeline_ terpisah, melainkan diselesaikan secara bersamaan melalui pendekatan _function calling_ pada model bahasa, di mana model langsung menghasilkan nama fungsi dan argumennya berdasarkan input pengguna.

#### 2.2.2 NLP untuk Bahasa Indonesia

Bahasa Indonesia memiliki karakteristik linguistik yang membedakannya dari bahasa Inggris sebagai bahasa dominan dalam penelitian NLP. Beberapa karakteristik tersebut antara lain sistem afiksasi yang kompleks, variasi ragam bahasa yang luas mulai dari bahasa formal hingga bahasa gaul, serta penggunaan kata serapan dari berbagai bahasa daerah dan bahasa asing (Cahyawijaya et al., 2021). Tantangan utama meliputi keterbatasan dataset berlabel berkualitas tinggi, variasi ejaan yang tidak konsisten, serta penggunaan bahasa campuran (_code-switching_) dalam komunikasi sehari-hari (Koto et al., 2022).

Kondisi ini menjadikan pengembangan model NLP untuk bahasa Indonesia lebih menantang dibandingkan bahasa dengan sumber daya linguistik yang lebih kaya. Dalam penelitian ini, tantangan tersebut diatasi melalui pembuatan dataset sintetis secara manual yang mencakup berbagai gaya bahasa pengguna, mulai dari formal, kasual, hingga _slang_, dalam konteks pencarian inventaris. Pendekatan ini memastikan model yang dilatih mampu memahami variasi bahasa yang digunakan oleh pengguna nyata di lingkungan kerja.

### 2.3 Large Language Model (LLM)

#### 2.3.1 Pengertian dan Arsitektur Transformer

_Large Language Model_ (LLM) adalah model kecerdasan buatan berbasis jaringan saraf tiruan yang dilatih pada korpus teks berskala sangat besar dengan tujuan memahami dan menghasilkan bahasa manusia secara kontekstual (Zhao et al., 2023). Model ini memiliki jumlah parameter yang sangat besar, mulai dari ratusan juta hingga ratusan miliar parameter, yang memungkinkannya menangkap pola bahasa yang kompleks dan beragam. Kemampuan utama LLM meliputi pemahaman konteks jangka panjang, kemampuan mengikuti instruksi (_instruction following_), serta adaptasi terhadap berbagai tugas tanpa pelatihan ulang secara penuh.

Fondasi arsitektur seluruh LLM modern adalah Transformer, yang diperkenalkan oleh Vaswani et al. (2017) melalui makalah "_Attention Is All You Need_". Arsitektur ini merevolusi NLP dengan menggantikan pendekatan sekuensial pada model berbasis _Recurrent Neural Network_ (RNN) menggunakan mekanisme _attention_ yang memungkinkan pemrosesan paralel dan pemahaman konteks yang lebih baik. Inti dari arsitektur Transformer adalah mekanisme _Multi-Head Self-Attention_, yang memungkinkan model memperhatikan hubungan antara setiap pasang token dalam sebuah urutan secara bersamaan. Secara matematis, mekanisme _attention_ dihitung sebagai berikut:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

di mana $Q$ (_Query_), $K$ (_Key_), dan $V$ (_Value_) adalah matriks yang diturunkan dari representasi input, dan $d_k$ adalah dimensi vektor _key_ yang berfungsi sebagai faktor penskalaan untuk menstabilkan gradien selama pelatihan.

Selain mekanisme _attention_, Transformer juga menggunakan komponen _Positional Encoding_ untuk menyandikan informasi posisi token dalam urutan, karena arsitektur ini tidak memiliki sifat sekuensial bawaan seperti RNN. Model LLM modern umumnya mengadopsi pendekatan _decoder-only_, yaitu hanya menggunakan bagian _decoder_ dari arsitektur Transformer asli untuk menghasilkan teks secara autoregresif berdasarkan konteks input (Brown et al., 2020).

#### 2.3.2 FunctionGemma 270M Sebagai Model Dasar

FunctionGemma 270M adalah model bahasa dengan 270 juta parameter yang merupakan varian dari keluarga model Gemma milik Google DeepMind, dengan spesialisasi pada tugas _function calling_ (Google DeepMind, 2024). Model ini dirancang untuk memahami deskripsi fungsi dalam format terstruktur dan menghasilkan pemanggilan fungsi yang tepat beserta argumennya berdasarkan input bahasa alami pengguna.

Dibandingkan model LLM generasi terbaru yang memiliki miliaran parameter, FunctionGemma 270M tergolong sebagai _small language model_. Meskipun demikian, ukuran yang lebih kecil ini justru memberikan sejumlah keunggulan praktis yang relevan dengan kebutuhan penelitian ini. Terdapat empat pertimbangan utama yang mendasari pemilihan model ini.

Pertama, dari segi efisiensi sumber daya, model dengan 270 juta parameter membutuhkan memori GPU yang jauh lebih kecil dibandingkan model berskala miliaran parameter, sehingga proses _fine-tuning_ dapat dilakukan pada perangkat dengan keterbatasan VRAM. Kedua, dari segi spesialisasi tugas, FunctionGemma 270M telah dirancang secara khusus untuk _function calling_, sehingga basis pengetahuan model sudah selaras dengan kebutuhan sistem inventaris yang dikembangkan. Ketiga, dari segi biaya operasional, penggunaan model yang di-_deploy_ secara mandiri melalui HuggingFace Spaces mengeliminasi ketergantungan pada API berbayar seperti GPT-4 atau Gemini API, yang secara signifikan mengurangi biaya operasional jangka panjang. Keempat, dari segi latensi, model berukuran kecil menghasilkan waktu inferensi yang lebih cepat, yang penting untuk pengalaman pengguna yang responsif pada antarmuka Telegram Bot.

### 2.4 Fine-Tuning Model Bahasa

#### 2.4.1 Transfer Learning dan Fine-Tuning

_Transfer learning_ adalah pendekatan dalam pembelajaran mesin di mana pengetahuan yang diperoleh dari pelatihan pada satu tugas atau domain dimanfaatkan kembali untuk meningkatkan performa pada tugas atau domain yang berbeda (Zhuang et al., 2021). Dalam konteks LLM, _transfer learning_ diimplementasikan melalui paradigma _pretraining-finetuning_, di mana model terlebih dahulu dilatih pada korpus teks berskala besar (_pretraining_) untuk memperoleh pemahaman bahasa yang umum, kemudian diadaptasi pada dataset yang lebih kecil dan spesifik (_fine-tuning_) untuk menyelesaikan tugas tertentu.

_Fine-tuning_ memungkinkan model yang sudah memiliki pemahaman bahasa yang kuat untuk diarahkan ke domain atau tugas spesifik dengan biaya pelatihan yang jauh lebih rendah dibandingkan melatih model dari awal (_training from scratch_). Pendekatan ini terbukti efektif karena representasi bahasa yang dipelajari selama _pretraining_ bersifat _transferable_ dan dapat dimanfaatkan lintas domain (Zhang et al., 2024).

Dalam penelitian ini, _fine-tuning_ dilakukan pada model FunctionGemma 270M menggunakan dataset _function calling_ inventaris berbahasa Indonesia yang disusun secara manual. Tujuannya adalah mengadaptasi kemampuan _function calling_ bawaan model agar selaras dengan konteks domain inventaris dan variasi gaya bahasa pengguna yang spesifik.

#### 2.4.2 Supervised Fine-Tuning (SFT)

_Supervised Fine-Tuning_ (SFT) adalah teknik adaptasi model bahasa di mana model dilatih lebih lanjut pada dataset yang berisi pasangan input dan output berlabel secara terarah, sehingga model dapat mempelajari pola respons yang diharapkan pada domain atau tugas yang spesifik (Zhang et al., 2024). Berbeda dengan _pretraining_ yang bersifat _self-supervised_ pada teks tidak berlabel, SFT menggunakan data berlabel yang dikurasi secara eksplisit untuk membentuk perilaku model sesuai kebutuhan.

Proses SFT bekerja dengan mengoptimalkan model menggunakan fungsi _loss_ berbasis _cross-entropy_ antara output yang diprediksi model dengan label referensi pada setiap token. Secara matematis, fungsi _loss_ SFT diformulasikan sebagai berikut:

$$\mathcal{L}_{SFT} = -\frac{1}{T} \sum_{t=1}^{T} \log P_\theta(y_t \mid x, y_{<t})$$

di mana $x$ adalah input pengguna, $y_t$ adalah token output ke-$t$ pada label referensi, $y_{<t}$ adalah token output sebelumnya, $T$ adalah total panjang output, dan $\theta$ adalah parameter model yang dioptimalkan. Selama pelatihan, seluruh parameter model diperbarui secara penuh (_full fine-tuning_) menggunakan gradien yang diturunkan dari _loss_ tersebut.

Dalam implementasi penelitian ini, SFT dilakukan menggunakan library `SFTTrainer` dari paket `trl` (_Transformer Reinforcement Learning_) yang menyediakan antarmuka pelatihan yang kompatibel dengan ekosistem HuggingFace. `SFTTrainer` menangani proses tokenisasi dataset, pembentukan batch pelatihan, serta komputasi _loss_ secara otomatis berdasarkan format dataset percakapan berbasis peran (_role-based conversation_) yang digunakan dalam penelitian ini.

#### 2.4.3 Justifikasi Penggunaan SFT

Pemilihan _Supervised Fine-Tuning_ sebagai metode adaptasi model dalam penelitian ini didasarkan pada beberapa pertimbangan yang selaras dengan karakteristik tugas dan ketersediaan sumber daya yang ada.

Pertama, dari segi kesesuaian dengan tugas _function calling_, SFT merupakan pendekatan yang paling tepat untuk melatih model menghasilkan output terstruktur yang deterministik. Karena setiap sampel dataset memiliki label jawaban yang terdefinisi dengan jelas berupa nama fungsi dan argumennya, pelatihan berbasis pasangan input-output berlabel secara langsung mengoptimalkan model untuk menghasilkan struktur _function call_ yang tepat (Zhang et al., 2024).

Kedua, dari segi skala model, FunctionGemma 270M dengan 270 juta parameter tergolong model berukuran kecil yang dapat di-_fine-tune_ secara penuh tanpa memerlukan teknik optimasi memori tambahan, sehingga SFT dapat diterapkan langsung tanpa pendekatan efisiensi parameter yang lebih kompleks.

Ketiga, dari segi ketersediaan dataset berlabel, penelitian ini memiliki dataset yang disusun secara manual sebanyak 300 sampel dengan kualitas dan relevansi domain yang terjamin. Karakteristik dataset yang bersih, terkurasi, dan spesifik pada domain inventaris menjadikan SFT sebagai pendekatan yang optimal karena model dapat belajar secara langsung dari contoh-contoh yang representatif (Ouyang et al., 2022).

Keempat, dari segi kemudahan implementasi dan reproduksibilitas, SFT dengan `SFTTrainer` dari library `trl` menyediakan _pipeline_ pelatihan yang standar dan terdokumentasi dengan baik, sehingga proses pelatihan dapat direproduksi dan dievaluasi secara konsisten.

### 2.5 Function Calling pada Large Language Model

#### 2.5.1 Konsep, Mekanisme, dan Keunggulan Function Calling

_Function calling_ adalah kemampuan LLM untuk menghasilkan pemanggilan fungsi terstruktur berdasarkan input bahasa alami pengguna, alih-alih menghasilkan teks bebas sebagai respons (Patil et al., 2023). Dalam paradigma ini, model tidak hanya memahami maksud pengguna, tetapi juga secara langsung menghasilkan nama fungsi yang tepat beserta argumen yang diperlukan dalam format terstruktur yang dapat dieksekusi oleh sistem.

Mekanisme _function calling_ bekerja melalui tiga tahap utama. Pada tahap pertama, model menerima input yang terdiri dari pesan pengguna dan deskripsi fungsi-fungsi yang tersedia beserta parameter yang dibutuhkan masing-masing fungsi. Pada tahap kedua, model melakukan inferensi untuk menentukan apakah input pengguna memerlukan pemanggilan fungsi atau cukup dijawab dengan teks biasa. Pada tahap ketiga, jika fungsi diperlukan, model menghasilkan output terstruktur berisi nama fungsi dan argumennya, yang kemudian dieksekusi oleh sistem _backend_ untuk mengambil data yang relevan (Qin et al., 2023).

Dibandingkan pendekatan konvensional berbasis klasifikasi _intent_ dan NER (_Named Entity Recognition_) yang terpisah, _function calling_ menawarkan sejumlah keunggulan signifikan. Pertama, dari segi determinisme, output _function calling_ berupa struktur data yang terdefinisi dengan jelas, sehingga lebih mudah divalidasi dan diintegrasikan dengan sistem _backend_ dibandingkan teks bebas yang memerlukan _parsing_ tambahan. Kedua, dari segi akurasi argumen, model secara langsung mengekstrak argumen fungsi dari input pengguna dalam satu langkah inferensi, tanpa memerlukan _pipeline_ ekstraksi entitas yang terpisah. Ketiga, dari segi keamanan eksekusi, karena output sudah dalam format fungsi yang terdefinisi, sistem dapat memvalidasi nama fungsi dan tipe argumen sebelum eksekusi, sehingga mengurangi risiko eksekusi perintah yang tidak diinginkan (Patil et al., 2023). Keempat, dari segi kesederhanaan arsitektur, satu model menggantikan _pipeline_ multi-komponen yang terdiri dari model klasifikasi _intent_, model NER, dan logika pencocokan fungsi secara terpisah.

#### 2.5.2 Format Dataset untuk Pelatihan Function Calling

Pelatihan model LLM untuk tugas _function calling_ memerlukan dataset dalam format khusus yang mencerminkan interaksi antara pengguna, deskripsi fungsi, dan respons model berupa pemanggilan fungsi yang tepat. Format yang umum digunakan mengadopsi struktur percakapan berbasis peran (_role-based conversation_) yang kompatibel dengan standar OpenAI _function calling_ (OpenAI, 2023).

Setiap sampel dalam dataset terdiri dari tiga komponen utama. Komponen pertama adalah definisi fungsi (_tools_), yang berisi nama fungsi, deskripsi fungsi, serta parameter yang dibutuhkan beserta tipe datanya. Komponen kedua adalah riwayat percakapan (_messages_), yang terdiri dari instruksi sistem pada peran _developer_, input pengguna pada peran _user_, dan respons model pada peran _assistant_. Komponen ketiga adalah label respons (_tool calls_), yang berisi nama fungsi yang seharusnya dipanggil beserta argumen yang tepat berdasarkan input pengguna (Patil et al., 2023).

Dalam penelitian ini, dataset dibangun secara manual sebanyak 300 sampel yang terdiri dari 235 sampel pelatihan dan 65 sampel evaluasi, mencakup 7 fungsi inventaris serta satu kelas khusus `NO_FUNCTION_CALL` untuk menangani pertanyaan yang tidak memerlukan pemanggilan fungsi. Setiap sampel dirancang untuk merepresentasikan skenario nyata yang mungkin dihadapi pengguna saat berinteraksi dengan sistem inventaris melalui Telegram Bot.

Untuk memastikan model mampu memahami variasi bahasa pengguna yang sesungguhnya, dataset disusun dengan mencakup lima gaya tutur yang berbeda, yaitu formal, semi-formal, kasual, _keyword only_, dan interogatif. Gaya formal mencerminkan pola kalimat yang baku dan lengkap secara struktur, gaya semi-formal mencerminkan bahasa sehari-hari yang masih tertata, gaya kasual mencerminkan bahasa santai yang umum digunakan dalam pesan singkat, gaya _keyword only_ mencerminkan input berupa kata kunci tanpa struktur kalimat lengkap, dan gaya interogatif mencerminkan pola pertanyaan langsung. Pendekatan multi-gaya tutur ini dipilih karena tidak tersedianya dataset _function calling_ berbahasa Indonesia untuk domain inventaris secara publik, sehingga variasi gaya tutur perlu direpresentasikan secara eksplisit dalam data pelatihan.

Contoh struktur satu sampel dataset dalam penelitian ini adalah sebagai berikut:

```json
{
  "metadata": "train",
  "tools": [{
    "function": {
      "name": "getItemStock",
      "description": "Mengecek jumlah stok item berdasarkan kata kunci",
      "parameters": {
        "type": "OBJECT",
        "properties": {
          "keyword": {
            "type": "STRING",
            "description": "Kata kunci nama atau kategori item"
          }
        },
        "required": ["keyword"]
      }
    }
  }],
  "messages": [
    {
      "role": "developer",
      "content": "You are an inventory warehouse assistant."
    },
    {
      "role": "user",
      "content": "laptop ada berapa yang tersedia?"
    },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "function": {
          "name": "getItemStock",
          "arguments": { "keyword": "laptop" }
        }
      }]
    }
  ]
}
```

### 2.6 Evaluasi Model

#### 2.6.1 Mean Token Accuracy sebagai Metrik Evaluasi

Evaluasi model _fine-tuning_ pada tugas _function calling_ memerlukan pendekatan metrik yang mampu mengukur tidak hanya ketepatan teks yang dihasilkan, tetapi juga keberhasilan model dalam menghasilkan pemanggilan fungsi yang dapat dieksekusi secara nyata. Dalam penelitian ini, evaluasi dilakukan menggunakan dua pendekatan yang saling melengkapi, yaitu _mean token accuracy_ sebagai metrik pelatihan dan _task-based evaluation_ sebagai metrik fungsional.

_Mean token accuracy_ adalah metrik yang mengukur proporsi token yang diprediksi secara benar oleh model terhadap total token dalam label referensi pada dataset evaluasi (Von Werra et al., 2023). Metrik ini dihitung sebagai berikut:

$$\text{Mean Token Accuracy} = \frac{1}{N} \sum_{i=1}^{N} \frac{\sum_{t=1}^{T_i} \mathbb{1}[\hat{y}_{i,t} = y_{i,t}]}{T_i}$$

di mana $N$ adalah jumlah sampel evaluasi, $T_i$ adalah jumlah token pada sampel ke-$i$, $\hat{y}_{i,t}$ adalah token yang diprediksi model, dan $y_{i,t}$ adalah token referensi yang benar. Dalam konteks _function calling_, token yang dievaluasi mencakup nama fungsi, tanda kurung, nama argumen, nilai argumen, serta token struktural lainnya yang membentuk output pemanggilan fungsi.

_Task-based evaluation_ adalah pendekatan evaluasi yang mengukur keberhasilan model berdasarkan kemampuannya menyelesaikan tugas secara _end-to-end_, bukan hanya ketepatan token per token (Qin et al., 2023). Dalam konteks _function calling_, evaluasi berbasis tugas mengukur dua hal utama, yaitu _function name accuracy_ yang mengukur apakah model memanggil fungsi yang tepat sesuai _intent_ pengguna, dan _argument accuracy_ yang mengukur apakah argumen yang diekstrak model sesuai dengan nilai yang diharapkan.

Pemilihan _mean token accuracy_ sebagai metrik utama dalam penelitian ini didasarkan pada tiga pertimbangan. Pertama, metrik ini merupakan metrik standar yang digunakan dalam proses SFT berbasis _supervised learning_ pada platform HuggingFace melalui `SFTTrainer`, sehingga hasil yang diperoleh dapat dibandingkan secara langsung dengan penelitian sejenis. Kedua, dalam tugas _function calling_, output model memiliki struktur yang sangat terdefinisi dan deterministik, sehingga akurasi pada level token secara langsung merepresentasikan ketepatan fungsi dan argumen yang dihasilkan. Ketiga, penggunaan dataset evaluasi yang terpisah sebanyak 65 sampel dengan penanda `"metadata": "eval"` memastikan bahwa metrik yang diperoleh mencerminkan kemampuan generalisasi model terhadap data yang belum pernah dilihat selama pelatihan.

Dengan nilai _mean token accuracy_ sebesar 95,81% yang dicapai pada epoch ke-10, model menunjukkan kemampuan generalisasi yang baik dalam menghasilkan pemanggilan fungsi inventaris yang tepat berdasarkan input bahasa Indonesia dengan berbagai variasi gaya tutur.

### 2.7 Teknologi Pendukung

#### 2.7.1 FastAPI dan Docker

FastAPI adalah _framework_ pengembangan API berbasis Python yang dirancang untuk membangun layanan web berkinerja tinggi secara cepat dan efisien (Ramírez, 2023). FastAPI memanfaatkan fitur _type hints_ Python secara penuh dan dibangun di atas Starlette dan Pydantic, sehingga menghasilkan validasi data otomatis, dokumentasi API interaktif, serta performa yang setara dengan _framework_ berbasis Node.js dan Go. Dalam penelitian ini, FastAPI digunakan sebagai _inference server_ yang menerima permintaan prediksi dari _backend_ Node.js, memproses input melalui model FunctionGemma 270M yang telah di-_fine-tune_ dengan metode SFT, dan mengembalikan hasil berupa pemanggilan fungsi atau respons teks dalam format JSON.

Docker adalah platform _containerization_ yang memungkinkan aplikasi dikemas beserta seluruh dependensinya ke dalam sebuah _container_ yang terisolasi dan dapat dijalankan secara konsisten di berbagai lingkungan (Merkel, 2022). Dengan Docker, perbedaan konfigurasi antara lingkungan pengembangan dan produksi dapat dieliminasi, sehingga proses _deployment_ menjadi lebih andal dan _reproducible_. Dalam penelitian ini, Docker digunakan untuk mengemas layanan inferensi FastAPI beserta model FunctionGemma yang telah di-_fine-tune_ dan seluruh dependensi Python-nya ke dalam sebuah _container_ yang kemudian di-_deploy_ ke HuggingFace Spaces, memastikan konsistensi lingkungan eksekusi model di lingkungan produksi.

#### 2.7.2 Telegram Bot API sebagai Antarmuka Pengguna

Telegram Bot API adalah antarmuka pemrograman yang disediakan oleh platform Telegram untuk membangun bot otomatis yang dapat berinteraksi dengan pengguna melalui pesan teks, tombol interaktif, dan berbagai jenis konten multimedia (Telegram, 2024). Bot Telegram beroperasi melalui mekanisme _webhook_ atau _long polling_, di mana setiap pesan yang dikirimkan pengguna ke bot akan diteruskan ke server aplikasi untuk diproses dan direspons secara otomatis.

Pemilihan Telegram Bot sebagai antarmuka pengguna dalam penelitian ini didasarkan pada beberapa pertimbangan. Pertama, dari segi aksesibilitas, Telegram merupakan platform pesan instan yang sudah familiar bagi mayoritas pengguna, sehingga tidak memerlukan instalasi aplikasi tambahan. Kedua, dari segi kemudahan integrasi, Telegram Bot API menyediakan library untuk berbagai bahasa pemrograman termasuk Node.js melalui paket `node-telegram-bot-api`, yang mempercepat proses pengembangan. Ketiga, dari segi fungsionalitas, Telegram Bot mendukung pengiriman pesan berformat Markdown, tombol _inline keyboard_, dan notifikasi _real-time_, yang memungkinkan pengembangan antarmuka yang kaya tanpa memerlukan _frontend_ web tersendiri.

Dalam penelitian ini, Telegram Bot berfungsi sebagai titik masuk utama pengguna untuk berinteraksi dengan sistem inventaris, baik melalui perintah berbasis menu maupun melalui pertanyaan dalam bahasa alami yang diproses oleh model FunctionGemma yang telah di-_fine-tune_. Akses ke bot dibatasi hanya untuk pengguna yang telah terdaftar dalam basis data sistem oleh administrator, sehingga keamanan data inventaris tetap terjaga.

#### 2.7.3 Node.js, Prisma ORM, dan HuggingFace Spaces

Node.js adalah _runtime environment_ JavaScript berbasis _event-driven_ dan _non-blocking_ I/O yang memungkinkan eksekusi kode JavaScript di sisi server (OpenJS Foundation, 2023). Karakteristik _non-blocking_ Node.js menjadikannya sangat efisien untuk menangani banyak permintaan secara bersamaan, yang relevan dalam konteks sistem inventaris yang perlu mengelola permintaan dari beberapa pengguna Telegram secara paralel. Dalam penelitian ini, Node.js berfungsi sebagai lapisan orkestrasi utama yang menghubungkan Telegram Bot, layanan inferensi AI, dan basis data, termasuk menangani _routing_ permintaan pengguna, memanggil layanan inferensi FastAPI, mengeksekusi fungsi inventaris berdasarkan hasil _function calling_ model, dan memformat respons yang dikirimkan kembali ke pengguna melalui Telegram.

Prisma ORM adalah _Object-Relational Mapping_ modern untuk Node.js dan TypeScript yang menyederhanakan interaksi dengan basis data relasional melalui antarmuka pemrograman yang _type-safe_ dan intuitif (Prisma, 2023). Prisma menghasilkan klien basis data yang sepenuhnya bertipe berdasarkan skema yang didefinisikan, sehingga kesalahan kueri dapat terdeteksi pada saat kompilasi. Dalam penelitian ini, Prisma digunakan untuk mengeksekusi seluruh kueri basis data PostgreSQL yang diperlukan oleh tujuh fungsi inventaris, mulai dari pencarian informasi barang, pengecekan stok, hingga penelusuran riwayat lokasi aset.

HuggingFace Spaces adalah platform hosting yang disediakan oleh HuggingFace untuk men-_deploy_ aplikasi _machine learning_ secara publik dengan dukungan penuh terhadap Docker _container_ (HuggingFace, 2024). Platform ini dipilih sebagai tempat _deployment_ layanan inferensi AI dalam penelitian ini karena menyediakan infrastruktur yang dapat diakses secara gratis untuk model berukuran kecil, mendukung _deployment_ berbasis Docker yang memastikan konsistensi lingkungan, serta menyediakan URL publik yang dapat diakses langsung oleh _backend_ Node.js yang di-_deploy_ di Railway. Perlu dicatat bahwa penggunaan _free tier_ HuggingFace Spaces membawa konsekuensi berupa potensi _cold start_ atau _timeout_ hingga 30 detik apabila layanan tidak aktif dalam periode tertentu.

---

## Referensi Bab 2

| No  | Sitasi                      | Keterangan                                                  |
| --- | --------------------------- | ----------------------------------------------------------- |
| 1   | Laudon & Laudon (2022)      | Definisi sistem informasi inventaris                        |
| 2   | Tiwari et al. (2022)        | Kelemahan manajemen inventaris tradisional                   |
| 3   | Zhong et al. (2023)         | Otomatisasi inventaris dengan teknologi digital              |
| 4   | Jurafsky & Martin (2023)    | Definisi NLP                                                |
| 5   | Weld et al. (2022)          | Intent recognition                                          |
| 6   | Nasar et al. (2021)         | Ekstraksi informasi / NER                                   |
| 7   | Cahyawijaya et al. (2021)   | Karakteristik NLP bahasa Indonesia (IndoNLG)                |
| 8   | Koto et al. (2022)          | Tantangan NLP bahasa Indonesia (IndoNLU)                    |
| 9   | Zhao et al. (2023)          | Survey LLM                                                  |
| 10  | Vaswani et al. (2017)       | Arsitektur Transformer — Attention Is All You Need          |
| 11  | Brown et al. (2020)         | GPT-3, decoder-only LLM                                     |
| 12  | Google DeepMind (2024)      | Gemma / FunctionGemma                                        |
| 13  | Zhuang et al. (2021)        | Transfer learning                                            |
| 14  | Zhang et al. (2024)         | Instruction tuning / SFT survey — arXiv:2308.10792          |
| 15  | Ouyang et al. (2022)        | InstructGPT, RLHF — arXiv:2203.02155                       |
| 16  | Von Werra et al. (2023)     | Library TRL / SFTTrainer                                     |
| 17  | Patil et al. (2023)         | Gorilla — function calling LLM — arXiv:2305.15334          |
| 18  | Qin et al. (2023)           | Tool learning with foundation models — arXiv:2304.08354    |
| 19  | OpenAI (2023)               | Function calling API                                         |
| 20  | Ramírez (2023)              | FastAPI                                                      |
| 21  | Merkel (2022)               | Docker                                                       |
| 22  | Telegram (2024)             | Telegram Bot API                                             |
| 23  | OpenJS Foundation (2023)    | Node.js                                                      |
| 24  | Prisma (2023)               | Prisma ORM                                                   |
| 25  | HuggingFace (2024)          | HuggingFace Spaces                                          |

---

## Status Penulisan

- [x] 2.1 Sistem Informasi Inventaris
- [x] 2.2 Natural Language Processing (NLP)
  - [x] 2.2.1 Pengertian dan Pemrosesan Perintah Pengguna
  - [x] 2.2.2 NLP untuk Bahasa Indonesia
- [x] 2.3 Large Language Model (LLM)
  - [x] 2.3.1 Pengertian dan Arsitektur Transformer
  - [x] 2.3.2 FunctionGemma 270M Sebagai Model Dasar
- [x] 2.4 Fine-Tuning Model Bahasa
  - [x] 2.4.1 Transfer Learning dan Fine-Tuning
  - [x] 2.4.2 Supervised Fine-Tuning (SFT)
  - [x] 2.4.3 Justifikasi Penggunaan SFT
- [x] 2.5 Function Calling pada Large Language Model
  - [x] 2.5.1 Konsep, Mekanisme, dan Keunggulan Function Calling
  - [x] 2.5.2 Format Dataset untuk Pelatihan Function Calling
- [x] 2.6 Evaluasi Model
  - [x] 2.6.1 Mean Token Accuracy sebagai Metrik Evaluasi
- [x] 2.7 Teknologi Pendukung
  - [x] 2.7.1 FastAPI dan Docker
  - [x] 2.7.2 Telegram Bot API sebagai Antarmuka Pengguna
  - [x] 2.7.3 Node.js, Prisma ORM, dan HuggingFace Spaces
- [ ] Bab 3 Tempat Kerja Praktek ← lanjut di sini
- [ ] Bab 4 Hasil dan Pembahasan
- [ ] Bab 5 Penutup

---

## Catatan Penting untuk Claude Berikutnya

- **Jangan sebut QLoRA, LoRA, atau kuantisasi 4-bit** — metode yang dipakai adalah SFT murni
- **Frontend web tidak punya fitur AI** — AI hanya di Telegram bot
- **Gaya penulisan**: formal akademis tapi mengalir, hindari em dash, pola "..., sehingga..." untuk sebab-akibat
- **Format sitasi**: APA — (Nama, Tahun), jurnal/prosiding maks 5 tahun, buku maks 10 tahun
- **Hasil (mean token accuracy 95,81%)** belum dibahas detail — itu masuk Bab 4
