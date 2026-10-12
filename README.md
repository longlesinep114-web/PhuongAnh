# Hướng Dẫn Tùy Chỉnh & Đưa Lên Mạng (Deploy) Trang Web Tỏ Tình Phương Anh 🌸

Trang web đã được thiết kế hoàn chỉnh theo tiêu chuẩn **Mobile-First & Cinematic Landscape**, tối ưu từng mili-giây hiệu ứng, hỗ trợ font tiếng Việt tinh tế và nhạc nền êm dịu.

---

## 1. Cấu Trúc Thư Mục
```text
my-workspace/
├── index.html          # Khung giao diện HTML5 chuẩn responsive
├── style.css           # Hiệu ứng pastel pink mộng mơ, glassmorphism, cinematic landscape
├── script.js           # Xử lý gõ chữ (typing), chuyển cảnh, hạt tim bay lấp đầy trái tim & nhạc
├── assets/
│   ├── phuong-anh.jpg  # Ảnh chân dung của Phương Anh (bạn thay ảnh thật vào đây)
│   └── love-song.mp3   # File nhạc tình cảm (nếu muốn dùng bài nhạc yêu thích)
└── README.md           # Hướng dẫn chi tiết
```

---

## 2. Cách Thay Ảnh & Thay Nhạc

### 🌸 Thay ảnh của Phương Anh:
- Chuẩn bị 1 tấm ảnh xinh nhất của Phương Anh (ảnh vuông hoặc dọc 1:1, 4:5 hoặc 9:16 đều đẹp).
- Đổi tên file thành `phuong-anh.jpg` và dán đè vào thư mục `assets/` (thay thế cho file mẫu hiện tại).
- Nếu ảnh đuôi `.png` hoặc `.jpeg`, bạn chỉ cần đổi lại đuôi trong `index.html` tại 2 chỗ: `src="assets/phuong-anh.jpg"`.

### 🎵 Thay nhạc nền theo sở thích:
- Tải file bài hát tình cảm (nhạc cụ piano, bản ballad nhẹ nhàng hoặc bài hát kỷ niệm của 2 bạn) dưới dạng đuôi `.mp3`.
- Đổi tên file thành `love-song.mp3` và copy vào thư mục `assets/`.
- *Lưu ý:* Trang web đã tích hợp sẵn **bộ tổng hợp âm thanh Web Audio Romantic Synthesizer**, tức là ngay cả khi chưa kịp thêm file mp3 hoặc mạng tải chậm, hệ thống vẫn tự động đàn giai điệu tình ca lãng mạn du dương mà không bao giờ bị im lặng!

---

## 3. Cách Đưa Lên Link Online (Deploy Miễn Phí, Cực Nhanh Trong 1 Phút)

Để gửi đường link qua **Zalo / Messenger / Instagram / iMessage** cho cô ấy:

### Cách 1: Vercel (Khuyên dùng - Nhanh & Mượt nhất)
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập (bằng GitHub, Google hoặc Email).
2. Kéo thả toàn bộ thư mục `my-workspace` vào khung tải lên của Vercel.
3. Nhấn **Deploy**. Chỉ sau 15 giây, bạn sẽ nhận được đường link dạng `https://gui-phuong-anh.vercel.app`.

### Cách 2: Netlify Drop (Không cần cài đặt, kéo thả ăn ngay)
1. Mở trình duyệt vào [app.netlify.com/drop](https://app.netlify.com/drop).
2. Kéo thả cả thư mục `my-workspace` thả vào giữa trang web.
3. Đợi 10 giây là bạn có ngay 1 đường link online công khai để gửi cho cô ấy.

### Cách 3: GitHub Pages
1. Tạo 1 repository mới trên GitHub (ví dụ: `gui-phuong-anh`).
2. Upload toàn bộ các file `index.html`, `style.css`, `script.js` và thư mục `assets/` lên repo.
3. Vào mục **Settings** -> **Pages** -> chọn nhánh `main` / `root` -> **Save**.
4. Đường link sẽ có dạng: `https://<ten-user>.github.io/gui-phuong-anh/`.

---

## 4. Các Điểm Nổi Bật Đã Được Tối Ưu Cho Phương Anh:
1. **Flow cảm xúc kể chuyện:** 
   - Màn hình đón chào mộng mơ với lời dẫn “*Chạm nhẹ để bắt đầu*”.
   - 4 câu tỏ tình gõ chữ (typing effect) nhẹ nhàng, sâu lắng, ngắt nhịp 2 giây mỗi câu để đọc trọn cảm xúc.
2. **Khoảnh khắc Climax (Điểm nhấn lớn nhất):**
   - Trái tim lớn viền trắng phát sáng kỳ ảo ở trung tâm.
   - Hơn 350 trái tim đỏ mini từ bốn phía bay vào, lấp đầy trái tim rỗng như rót đầy tình yêu.
   - Câu tỏ tình **“Em làm người yêu anh nhé.”** hiện dần ở chính giữa trái tim cùng 2 nút phản hồi cực dễ thương: *“Đồng ý nha 💖”* và *“Dạ vâng ạ 🙈”*.
3. **Trải nghiệm xoay ngang (Cinematic Landscape):**
   - Tối ưu đặc biệt cho điện thoại: khi xoay ngang, màn hình chia bố cục như một khung phim điện ảnh (ảnh bên trái, tâm sự bên phải), trái tim lớn căn chuẩn tâm và không bao giờ bị reload hay gián đoạn trải nghiệm.
