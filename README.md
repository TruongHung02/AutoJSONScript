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

- Lấy đường dẫn cài đặt chromium

```sh
which chromium
```

5. Cấu hình

```sh
nano src/config.ts
```

- Dán đường dẫn chromium vào file src/config.ts
  `EXECUTABLE_PATH: 'path to chromnium'`

6. Một số cấu hình thêm

   1. Proxy

```sh
   nano proxies.txt
```
   `user:pass@host:port`

2.  Extension
    1. Tạo folder extensions ở root project
    2. Copy thư mục extension chứa file background.js và manifest.json vào folder extensions vừa tạo
    3. Thêm tên thư mục extension vào file src/config.js
       Ví dụ `extensions: ['Toggle', 'Dawn'],`
3.  Headless mode
    `headless: true`

4.  Input
```sh
   nano input.txt
```
   `username password`

```sh
touch clipboard.txt
touch accounts.txt

npm install
npm run dev
```
