# Database Design / Thiết Kế Cơ Sở Dữ Liệu
## System Design - Chapter 5 / Thiết Kế Hệ Thống - Chương 5

[Back to Table of Contents](../00-table-of-contents.md)

---

## SQL vs NoSQL

### When to Use SQL
- ACID transactions required / Yêu cầu giao dịch ACID
- Complex queries and joins / Truy vấn phức tạp và join
- Structured data / Dữ liệu có cấu trúc
- Data integrity critical / Tính toàn vẹn dữ liệu quan trọng

### When to Use NoSQL
- Horizontal scaling needed / Cần mở rộng ngang
- Flexible schema / Schema linh hoạt
- High write throughput / Thông lượng ghi cao
- Document or key-value storage / Lưu trữ document hoặc key-value

## Database Indexing

```sql
-- Create index for faster queries / Tạo index cho truy vấn nhanh hơn
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Composite index / Index tổng hợp
CREATE INDEX idx_products_category_price 
ON products(category_id, price DESC);

-- Unique index / Index duy nhất
CREATE UNIQUE INDEX idx_users_username ON users(username);
```

## Query Optimization

```sql
-- ❌ Slow: Full table scan / Chậm: Quét toàn bộ bảng
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- ✅ Fast: Uses index / Nhanh: Sử dụng index
SELECT * FROM users WHERE email = 'user@example.com';

-- ❌ Slow: N+1 query problem / Chậm: Vấn đề truy vấn N+1
SELECT * FROM orders;
-- Then for each order: / Sau đó cho mỗi đơn hàng:
SELECT * FROM users WHERE id = order.user_id;

-- ✅ Fast: Single query with JOIN / Nhanh: Truy vấn đơn với JOIN
SELECT orders.*, users.name 
FROM orders 
JOIN users ON orders.user_id = users.id;
```

---

[Back to Table of Contents](../00-table-of-contents.md)
