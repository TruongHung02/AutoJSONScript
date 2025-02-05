# Auto Script

Chạy srcipt tự động theo file json theo định dạng được export từ GenLogin

## Set up Ubuntu

1. Clone repo

```sh
git clone https://github.com/TruongHung02/AutoJSONScript.git
cd AutoJSONScript
```

2. Tạo folder jsonscript
3. Copy file automation export từ GenLogin vào folder jsonscript, đổi tên thành _auto.genlogin.json_
4. Cài đặt chromnium

```sh
sudo snap install chromium
```

5. Cấu hình file src/config.ts

- Lấy đường dẫn cài đặt chromium

```sh
which chromium
```

- Dán đường dẫn chromium vào file src/config.ts
  `EXECUTABLE_PATH: 'path to chromnium'`

6. Run

```sh
npm install
npm run dev
```

```sh

```
