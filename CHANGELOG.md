# Changelog - selfX

## Version 26.01.08 (8 Januari 2025)

### 🎉 Fitur Baru

#### 1. Custom Toast Notification System
- Mengganti sistem notifikasi sonner dengan custom toast popup
- Toast muncul di tengah layar dengan animasi smooth
- Auto-close dalam 3 detik dengan progress bar visual
- Tombol close manual untuk kontrol pengguna
- Mendukung 3 tipe: success, error, dan info

#### 2. Statistik Cerita (Story Statistics)
- Menambahkan 2 statistik baru: **Total Cerita** dan **Cerita Hari Ini**
- Total statistik sekarang menjadi 6 (Posts, Bookmarks, Stories, Today's Posts, Today's Bookmarks, Today's Stories)
- Terintegrasi di 3 halaman: Settings, Profile, dan Calendar
- Icon BookOpen untuk representasi cerita
- Real-time update saat cerita dibuat/dihapus

#### 3. Voice Recorder (Perekam Suara)
- Fitur perekaman audio langsung dari aplikasi
- Batas maksimal 3 menit per rekaman
- Visualisasi waveform dengan 25 bar animasi
- Kontrol lengkap: Record, Pause, Resume, Stop
- Preview audio sebelum ditambahkan ke post
- Handling permission mikrofon otomatis
- Limit 1 audio per post
- Audio tersimpan dalam format WebM/MP4

#### 4. Audio Player UI
- Player audio di PostCard dengan kontrol play/pause
- Progress bar real-time dengan tracking durasi
- Display waktu current/total (format MM:SS)
- Tombol download untuk save audio
- Player audio di MultiMediaPicker untuk preview
- Icon centering yang pixel-perfect
- Responsive dan mobile-friendly

#### 5. URL Detection & Styling
- Deteksi otomatis URL dalam konten post
- URL menjadi clickable link dengan target _blank
- Icon Lucide Link2 SVG inline (bukan emoji)
- Styling khusus dengan warna primary dan hover effect
- Icon scalable dan konsisten di semua device
- Inherit color untuk mendukung dark/light theme

#### 6. Calendar View
- Halaman kalender untuk melihat aktivitas berdasarkan tanggal
- Period summary dengan statistik lengkap
- Navigation mudah antar bulan

#### 7. Archive Page
- Halaman untuk mengelola post yang diarsipkan
- Unarchive dan delete permanent
- Search dan sort functionality

#### 8. Advanced Photo Editor
- Crop tool dengan aspect ratio preset (1:1, 4:5, 16:9)
- Rotate dan flip (90°, 180°, 270°, horizontal, vertical)
- Filter effects: Grayscale, Sepia, Blur, Sharpen, Vintage, Cool, Warm
- Brightness adjustment (-100 sampai +100)
- Contrast adjustment (-100 sampai +100)
- Real-time preview dan reset function
- Responsive UI untuk mobile dan desktop

#### 9. Bug Fixes & Improvements
- Fix memory leak pada audio recorder
- Fix progress bar update issues
- Fix toast notification bugs
- Fix statistics real-time update
- Fix image transparency issues
- Fix dark mode inconsistency
- Performance optimizations (rendering, bundle size, IndexedDB)
- Stability improvements (error handling, offline functionality)

### 🔧 Perbaikan & Peningkatan

#### Performance
- Optimasi timer dengan cleanup yang proper
- Audio progress tracking dengan onTimeUpdate event
- Cleanup audio resources saat component unmount
- Efficient state management untuk audio playback

#### UI/UX
- Icon play/pause dengan margin adjustment untuk centering
- Progress bar dengan animasi smooth
- Waveform visualization yang responsif
- URL link dengan inline-flex untuk alignment sempurna
- Consistent spacing dan padding di semua komponen

#### Code Quality
- TypeScript types yang lebih strict untuk MediaItem
- Separation of concerns untuk audio encryption
- Reusable audio player components
- Clean utility functions untuk URL detection
- Proper error handling untuk microphone permission

### 📁 File Baru
- `src/lib/toast.ts` - Global toast callback system
- `src/components/CustomToast.tsx` - Custom toast component
- `src/components/AudioRecorder.tsx` - Voice recorder component
- `src/lib/urlUtils.ts` - URL detection utilities

### 📝 File Dimodifikasi
- `src/App.tsx` - Integrasi CustomToast
- `src/lib/stats.ts` - Story statistics functions
- `src/lib/types.ts` - MediaItem interface dengan audio type
- `src/pages/Settings.tsx` - Story statistics display
- `src/pages/Profile.tsx` - Story statistics display
- `src/components/PeriodSummary.tsx` - Story stats di calendar
- `src/components/MultiMediaPicker.tsx` - Audio recorder integration
- `src/components/PostCard.tsx` - Audio player implementation
- `src/index.css` - URL link styling

### 🎨 Design System
- Consistent icon usage dari Lucide React
- Mobile-first approach dengan min 40px touch targets
- Dark/Light theme support untuk semua komponen baru
- Framer Motion animations untuk smooth transitions

### 🔐 Security & Privacy
- Audio tersimpan 100% offline di IndexedDB
- Tidak ada external API calls untuk URL metadata
- Microphone permission handling yang aman
- Audio encryption support untuk backup/export

### 📱 PWA Support
- Audio recording bekerja di PWA mode
- Offline-first untuk semua fitur baru
- Service worker compatible
- Install-able di Android, iOS, dan Desktop

---

## Version History

### Version 1.0.0 (Desember 2024)
- Initial release
- Basic post creation dengan foto/video
- Bookmark system dengan kategori
- Dark/Light mode
- Export/Import terenkripsi
- PWA support
- Story editor dengan kategori
- Enkripsi AES-256 multi-layer

---

**Developer**: M. Nafiurohman  
**Project**: Bezn Project  
**Website**: https://selfx.bezn.web.id
