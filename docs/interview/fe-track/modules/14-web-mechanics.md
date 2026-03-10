# Web Mechanics - Cơ chế Web

> Phần này bao gồm các câu hỏi liên quan đến kiến thức tổng quan về hệ sinh thái web và cách nó hoạt động.

## Mục lục

1. [Internet hoạt động như thế nào?](#1-internet-hoạt-động-như-thế-nào)
2. [Webpage, Website, Web Server và Search Engine khác nhau thế nào?](#2-webpage-website-web-server-và-search-engine-khác-nhau-thế-nào)
3. [Hyperlinks (Siêu liên kết) là gì?](#3-hyperlinks-siêu-liên-kết-là-gì)
4. [Domain Name (Tên miền) là gì?](#4-domain-name-tên-miền-là-gì)
5. [URL là gì?](#5-url-là-gì)
6. [Web Server là gì?](#6-web-server-là-gì)
7. [Cách báo cáo lỗi với trình duyệt](#7-cách-báo-cáo-lỗi-với-trình-duyệt)

---

## 1. Internet hoạt động như thế nào?

### Tóm tắt

**Internet là xương sống của Web**, là hạ tầng kỹ thuật làm cho Web hoạt động được. Ở mức cơ bản nhất, Internet là một mạng lưới lớn các máy tính giao tiếp với nhau.

> Lịch sử của Internet bắt đầu từ những năm 1960 như một dự án nghiên cứu được tài trợ bởi quân đội Mỹ, sau đó phát triển thành hạ tầng công cộng vào những năm 1980 với sự hỗ trợ của nhiều trường đại học công lập và các công ty tư nhân.

### Mạng đơn giản (Simple Network)

Khi hai máy tính cần giao tiếp, bạn phải kết nối chúng:

- **Có dây**: Cáp Ethernet
- **Không dây**: Wi-Fi hoặc Bluetooth

**Vấn đề**: Nếu muốn kết nối 10 máy tính với nhau, bạn cần 45 cáp, với 9 cổng cắm cho mỗi máy tính!

**Giải pháp - Switch mạng**:

- Mỗi máy tính kết nối với một thiết bị nhỏ gọi là **network switch**
- Switch đảm bảo tin nhắn từ máy A chỉ đến đúng máy B
- Với 10 máy tính, chỉ cần 10 cáp: một cho mỗi máy tính và switch có 10 cổng

### Mạng của các mạng (Network of Networks)

```
┌─────────────────────────────────────────────────────────────┐
│                    Cấu trúc Internet                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   [Máy tính] ──┐                                            │
│   [Máy tính] ──┼── [Switch] ──┐                             │
│   [Máy tính] ──┘              │                             │
│                               ├── [Router] ── [Modem]       │
│   [Máy tính] ──┐              │                    │        │
│   [Máy tính] ──┼── [Switch] ──┘                    │        │
│   [Máy tính] ──┘                                   │        │
│                                                    ▼        │
│                                            [ISP Networks]   │
│                                                    │        │
│                                                    ▼        │
│                                              [INTERNET]     │
└─────────────────────────────────────────────────────────────┘
```

**Các thành phần quan trọng**:

| Thành phần | Mô tả                                                      |
| ---------- | ---------------------------------------------------------- |
| **Switch** | Kết nối các máy tính trong mạng cục bộ                     |
| **Router** | Chuyển tiếp tin nhắn giữa các mạng (như bưu điện)          |
| **Modem**  | Chuyển đổi thông tin mạng sang tín hiệu điện thoại         |
| **ISP**    | Nhà cung cấp dịch vụ Internet, quản lý các router đặc biệt |

### Tìm máy tính - Địa chỉ IP và Domain Name

- **Địa chỉ IP**: Địa chỉ duy nhất của mỗi máy tính, VD: `192.0.2.172`
- **Domain Name**: Tên dễ đọc thay thế IP, VD: `google.com` → `142.250.190.78`

### Internet vs Web

| Internet                 | Web                                                   |
| ------------------------ | ----------------------------------------------------- |
| Hạ tầng kỹ thuật         | Dịch vụ xây dựng trên hạ tầng                         |
| Kết nối hàng tỷ máy tính | Các trang web có thể đọc bởi trình duyệt              |
| Bao gồm nhiều dịch vụ    | Chỉ là một trong các dịch vụ (cùng với email, IRC...) |

### Intranet và Extranet

- **Intranet**: Mạng riêng giới hạn cho các thành viên của một tổ chức
  - Chia sẻ tài liệu, công cụ cộng tác, wiki nội bộ
- **Extranet**: Mạng riêng mở một phần cho đối tác bên ngoài
  - Chia sẻ an toàn với khách hàng và các bên liên quan

---

## 2. Webpage, Website, Web Server và Search Engine khác nhau thế nào?

### Tóm tắt

Các thuật ngữ này thường gây nhầm lẫn cho người mới bắt đầu. Dưới đây là sự phân biệt rõ ràng:

### Webpage (Trang web)

Là một **tài liệu đơn lẻ** có thể hiển thị trong trình duyệt web.

- Thường được viết bằng HTML.
- Có thể nhúng các tài nguyên khác như style (CSS), script (JavaScript), hình ảnh, video.
- Mỗi webpage có một địa chỉ duy nhất gọi là URL.

> **Ví dụ**: Bài viết bạn đang đọc này là một webpage.

### Website (Website)

Là một **tập hợp các webpage** liên quan được nhóm lại với nhau và thường được kết nối thông qua các liên kết.

- Các trang này thường nằm dưới cùng một **domain name**.
- Tạo thành một tài nguyên thống nhất.

> **Ví dụ**: `developer.mozilla.org` là một website chứa hàng nghìn webpage khác nhau.

### Web Server (Máy chủ web)

Là **máy tính lưu trữ** các file của website (HTML, CSS, hình ảnh...) và phân phối chúng cho người dùng khi có yêu cầu.

- Gồm phần cứng (máy tính) và phần mềm (HTTP server).
- Một web server có thể lưu trữ nhiều website.

> **Ví dụ**: Khi bạn nhập URL, trình duyệt gửi yêu cầu đến web server, server sẽ gửi lại các file webpage tương ứng.

### Search Engine (Công cụ tìm kiếm)

Là một **dịch vụ web** giúp người dùng tìm kiếm thông tin và các webpage khác trên World Wide Web.

- Sử dụng "crawlers" để khám phá và lập chỉ mục nội dung.
- Trả về kết quả phù hợp với truy vấn của người dùng.

> **Ví dụ**: Google, Bing, DuckDuckGo.

### Bảng so sánh nhanh

| Thuật ngữ         | Định nghĩa ngắn gọn | Ví dụ thực tế         |
| ----------------- | ------------------- | --------------------- |
| **Webpage**       | Một tài liệu đơn lẻ | Một trang sách        |
| **Website**       | Tập hợp các webpage | Một cuốn sách         |
| **Web Server**    | Nơi lưu trữ website | Thư viện lưu trữ sách |
| **Search Engine** | Công cụ tìm kiếm    | Thủ thư giúp tìm sách |

---

## 3. Hyperlinks (Siêu liên kết) là gì?

### Tóm tắt

**Hyperlinks** (thường gọi là "links") là khái niệm nền tảng của Web.

Năm 1989, Tim Berners-Lee (cha đẻ của Web) đã nói về **ba trụ cột** của Web:

1. **URL**: Hệ thống địa chỉ theo dõi các tài liệu Web
2. **HTTP**: Giao thức truyền tải để tìm tài liệu khi có URL
3. **HTML**: Định dạng tài liệu cho phép nhúng các hyperlinks

> Links nổi bật so với văn bản xung quanh bởi **gạch chân và màu xanh**. Nhấp hoặc chạm để kích hoạt link.

### Các loại Links

| Loại              | Mô tả                                        | Ví dụ                     |
| ----------------- | -------------------------------------------- | ------------------------- |
| **Internal Link** | Liên kết giữa hai trang trong cùng website   | Menu điều hướng           |
| **External Link** | Liên kết đến trang web khác                  | Tham khảo nguồn bên ngoài |
| **Incoming Link** | Liên kết từ trang web khác đến trang của bạn | Backlinks                 |

### Anchors (Neo)

- Links thông thường kết nối **hai trang web** với nhau
- **Anchors** kết nối **hai phần** trong cùng một tài liệu
- Khi theo dõi anchor, trình duyệt **cuộn đến** phần đó thay vì tải trang mới

```html
<!-- Tạo anchor -->
<h2 id="section-2">Phần 2</h2>

<!-- Link đến anchor -->
<a href="#section-2">Đi đến Phần 2</a>
```

### Links và Công cụ Tìm kiếm (SEO)

Các yếu tố ảnh hưởng đến SEO:

- ✅ **Văn bản hiển thị** của link ảnh hưởng đến kết quả tìm kiếm
- ✅ Càng nhiều **incoming links** → xếp hạng càng cao
- ✅ **External links** ảnh hưởng đến cả nguồn và đích

> **SEO** (Search Engine Optimization) là nghiên cứu cách làm cho website xếp hạng cao trong kết quả tìm kiếm.

---

## 4. Domain Name (Tên miền) là gì?

### Tóm tắt

**Domain names** là phần quan trọng của hạ tầng Internet. Chúng cung cấp **địa chỉ dễ đọc** cho bất kỳ web server nào trên Internet.

**Vấn đề**:

- IPv4: `192.0.2.172`
- IPv6: `2001:db8:8b73:0000:0000:8a2e:0370:1337`

→ Khó nhớ! → **Giải pháp: Domain name**

### Cấu trúc Domain Name

```
          TLD
           │
     ┌─────┴─────┐
developer.mozilla.org
└───────┘ └──────┘
   SLD    Subdomain
```

#### TLD (Top-Level Domain)

| TLD                    | Mục đích                      |
| ---------------------- | ----------------------------- |
| `.com`, `.org`, `.net` | Chung, không yêu cầu đặc biệt |
| `.us`, `.fr`, `.vn`    | Quốc gia/ngôn ngữ cụ thể      |
| `.gov`                 | Chính phủ                     |
| `.edu`                 | Giáo dục                      |

- Độ dài tối đa: 63 ký tự
- Danh sách đầy đủ TLD được [ICANN](https://www.icann.org/en/contracted-parties/registry-operators/resources/list-of-top-level-domains) quản lý

#### Label (Nhãn)

- Chuỗi ký tự từ 1-63 ký tự
- Chỉ chứa: `A-Z`, `0-9`, `-` (không được ở đầu/cuối)
- **SLD** (Secondary Level Domain): Label ngay trước TLD
- Có thể tạo **subdomain** như: `developer.mozilla.org`, `support.mozilla.org`

### Mua Domain Name

> ⚠️ Bạn không thể "mua" domain name - bạn chỉ trả tiền cho **quyền sử dụng** trong một hoặc nhiều năm.

**Quy trình**:

1. Đến website của **registrar** (nhà đăng ký)
2. Kiểm tra domain có sẵn (dùng `whois`)
3. Điền thông tin và thanh toán
4. Đợi vài giờ để DNS cập nhật

**Kiểm tra domain có sẵn**:

```bash
whois mozilla.org
# Nếu trả về "NOT FOUND" → Domain có sẵn
```

### Cách DNS Request hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                     DNS Request Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Nhập mozilla.org vào trình duyệt                        │
│                    │                                         │
│                    ▼                                         │
│  2. Trình duyệt kiểm tra DNS cache cục bộ                   │
│                    │                                         │
│         ┌─────────┴─────────┐                               │
│         │                   │                                │
│    [Tìm thấy]          [Không có]                           │
│         │                   │                                │
│         ▼                   ▼                                │
│    Trả về IP       3. Hỏi DNS Server                        │
│         │                   │                                │
│         │                   ▼                                │
│         │          4. DNS trả về IP                          │
│         │                   │                                │
│         └────────┬──────────┘                               │
│                  ▼                                           │
│         5. Kết nối đến web server                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. URL là gì?

### Tóm tắt

**URL** (Uniform Resource Locator) là địa chỉ của một tài nguyên duy nhất trên internet. Đây là cơ chế quan trọng được **trình duyệt** sử dụng để lấy các tài nguyên như trang HTML, CSS, hình ảnh...

### Cấu trúc URL (Anatomy of a URL)

```
https://username:password@www.example.com:80/path/to/file.html?key1=value1&key2=value2#anchor
└──┬──┘ └──────┬───────┘ └───────┬──────┘└┬┘└───────┬────────┘└──────────┬──────────┘└──┬──┘
 Scheme     Credentials      Domain    Port     Path              Parameters        Anchor
```

#### Các thành phần chi tiết

| Thành phần     | Mô tả                     | Ví dụ                            |
| -------------- | ------------------------- | -------------------------------- |
| **Scheme**     | Giao thức sử dụng         | `https://`, `http://`, `mailto:` |
| **Authority**  | Domain + Port             | `www.example.com:80`             |
| **Path**       | Đường dẫn đến tài nguyên  | `/path/to/myfile.html`           |
| **Parameters** | Các tham số key=value     | `?key1=value1&key2=value2`       |
| **Anchor**     | "Bookmark" trong tài liệu | `#section-name`                  |

> 💡 **Lưu ý**: Phần sau `#` (fragment identifier) **không bao giờ** được gửi đến server.

### Cách sử dụng URL trong HTML

```html
<!-- Liên kết đến tài liệu -->
<a href="https://example.com">Link</a>

<!-- Liên kết tài nguyên -->
<link rel="stylesheet" href="styles.css" />
<script src="script.js"></script>

<!-- Hiển thị media -->
<img src="image.jpg" />
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>

<!-- Nhúng tài liệu HTML khác -->
<iframe src="page.html"></iframe>
```

### URL Tuyệt đối vs Tương đối

**URL Tuyệt đối**: Chứa đầy đủ tất cả các phần

```
https://developer.mozilla.org/en-US/docs/Learn
```

**URL Tương đối**: Dựa vào context của tài liệu hiện tại

| Loại             | Ví dụ                | Giải thích              |
| ---------------- | -------------------- | ----------------------- |
| Scheme-relative  | `//example.com/page` | Dùng protocol hiện tại  |
| Domain-relative  | `/en-US/docs`        | Dùng domain hiện tại    |
| Sub-resources    | `images/logo.png`    | Từ thư mục hiện tại     |
| Parent directory | `../other/page`      | Đi lên một cấp          |
| Anchor-only      | `#section`           | Trong tài liệu hiện tại |

### Semantic URLs

**Semantic URLs** sử dụng từ có ý nghĩa mà bất kỳ ai cũng hiểu:

✅ **Tốt**: `example.com/products/shoes/running`
❌ **Tệ**: `example.com/p?id=12345&cat=7`

**Lợi ích**:

- Dễ thao tác và nhớ
- Người dùng hiểu họ đang ở đâu
- Cải thiện SEO

---

## 6. Web Server là gì?

### Tóm tắt

**Web server** có thể là **phần cứng** hoặc **phần mềm**, hoặc cả hai hoạt động cùng nhau.

| Khía cạnh    | Mô tả                                                    |
| ------------ | -------------------------------------------------------- |
| **Hardware** | Máy tính lưu trữ phần mềm web server và các file website |
| **Software** | HTTP server - phần mềm hiểu URLs và HTTP                 |

### Quy trình cơ bản

```
┌──────────────────────────────────────────────────────────────┐
│                    Web Server Request Flow                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   [Browser]                              [Web Server]         │
│       │                                       │               │
│       │  1. HTTP Request (GET page.html)     │               │
│       │─────────────────────────────────────▶│               │
│       │                                       │               │
│       │                           2. Tìm file │               │
│       │                                       │               │
│       │  3. HTTP Response (200 OK + content) │               │
│       │◀─────────────────────────────────────│               │
│       │                                       │               │
│       │      hoặc 404 Not Found              │               │
│       │◀─────────────────────────────────────│               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Hosting Files

**Tại sao dùng dedicated web server?**

✅ Luôn khả dụng (up and running)
✅ Luôn kết nối Internet
✅ Có địa chỉ IP cố định (dedicated IP)
✅ Được bảo trì bởi bên thứ ba

### Giao tiếp qua HTTP

**HTTP** (Hypertext Transfer Protocol) là giao thức **textual** và **stateless**:

| Đặc điểm      | Mô tả                                         |
| ------------- | --------------------------------------------- |
| **Textual**   | Tất cả lệnh là plain-text, con người đọc được |
| **Stateless** | Server không nhớ các giao tiếp trước đó       |

**Quy tắc HTTP**:

- ✅ Client gửi HTTP requests, server trả lời
- ✅ Khi yêu cầu file, client phải cung cấp URL
- ✅ Web server phải trả lời mọi request (ít nhất là error message)

### Static vs Dynamic Content

| Static Web Server      | Dynamic Web Server                            |
| ---------------------- | --------------------------------------------- |
| Hardware + HTTP Server | Static server + Application server + Database |
| Gửi file "as-is"       | Tạo nội dung theo yêu cầu                     |
| Dễ thiết lập           | Stack phức tạp hơn                            |
| Phù hợp: blog đơn giản | Phù hợp: MDN, Wikipedia                       |

**Dynamic server workflow**:

```
Client Request → Application Server → Database Query →
HTML Template + Data → Final HTML → Client Response
```

---

## 7. Cách báo cáo lỗi với trình duyệt

### Xác định lỗi thuộc về ai?

Trước khi báo cáo lỗi trình duyệt, kiểm tra:

| Nguồn             | Hành động                        |
| ----------------- | -------------------------------- |
| **Code của bạn**  | Kiểm tra lỗi chính tả, logic     |
| **Documentation** | Có thể tài liệu lỗi thời         |
| **Browser**       | So sánh với các trình duyệt khác |
| **Specification** | Nguồn đáng tin cậy nhất          |

### Tạo Test Case

**Test case tối thiểu** nên là:

- File HTML đơn lẻ với CSS/JS nhúng
- Không phụ thuộc bên ngoài
- Không có code không liên quan

```html
<!-- Ví dụ test case cho :autofill -->
<style>
  :autofill {
    border: 3px solid darkorange;
  }
</style>
<input id="name" name="name" type="text" autocomplete="name" />
<input id="email" name="email" type="email" autocomplete="email" />
```

### Kiểm tra Implementation Status

**Các nguồn tham khảo**:

1. **MDN Browser Compatibility Tables**: Xem browser nào hỗ trợ feature
2. **Specification Repositories**:
   - [WHATWG](https://github.com/whatwg) - DOM, HTML, Fetch
   - [CSSWG](https://github.com/w3c/csswg-drafts) - CSS
   - [TC39](https://github.com/tc39) - JavaScript
3. **Community Forums**: MDN Community, Stack Overflow
4. **Issue Trackers**: Tìm bug đã được báo cáo

### Browser Bug Trackers

| Browser | Bug Tracker                                           |
| ------- | ----------------------------------------------------- |
| Safari  | [WebKit Bugzilla](https://webkit.org/reporting-bugs/) |
| Chrome  | [Chromium Issues](https://issues.chromium.org/issues) |
| Firefox | [Mozilla Bugzilla](https://bugzilla.mozilla.org/)     |
| Opera   | [Opera Bug Wizard](https://bugs.opera.com/wizard/)    |

**Khi báo cáo bug mới**:

- ✅ Cung cấp minimal test case
- ✅ Phiên bản browser
- ✅ Kết quả mong đợi vs thực tế
- ✅ Screenshots nếu cần

---

## Tài liệu tham khảo

- [How does the Internet work? - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work)
- [What are hyperlinks? - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_are_hyperlinks)
- [What is a Domain Name? - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name)
- [What is a URL? - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL)
- [What is a web server? - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server)
- [When and how to file bugs with browsers - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/File_browser_bugs)
