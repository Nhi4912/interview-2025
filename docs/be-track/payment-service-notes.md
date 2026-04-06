# Payment Service — Interview Notes

> Manabie Go Monorepo | Tổng hợp kiến thức cho Technical Interview

---

## Mục lục

1. [Tổng quan Kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Product Types & Master Data](#2-product-types--master-data)
3. [Order Types & Lifecycle](#3-order-types--lifecycle)
4. [CreateOrderGroup — Full Flow](#4-createordergroup--full-flow)
5. [Bill Item Generation](#5-bill-item-generation)
6. [Database Schema](#6-database-schema-key-tables)
7. [Design Patterns & Interview Points](#7-design-patterns--interview-points)
8. [Related Features](#8-related-features)
9. [Câu hỏi Interview thường gặp](#9-câu-hỏi-interview-thường-gặp)
10. [Key Code Files Reference](#10-key-code-files-reference)

---

## 1. Tổng quan Kiến trúc

### Tech Stack

| Component       | Technology                                      |
| --------------- | ----------------------------------------------- |
| Language        | Go 1.24 (monorepo, single binary)               |
| RPC             | gRPC + gRPC-Gateway (REST bridge)               |
| Database        | PostgreSQL (shared `fatima` DB via pgxpool)      |
| Messaging       | NATS (real-time), Kafka (event streaming)        |
| Feature Flags   | Unleash                                          |
| Auth            | Firebase / Keycloak, RBAC (7 roles)             |
| External        | Salesforce integration via Shamir service        |
| Tracing         | OpenCensus                                       |
| HTTP            | Gin (Swagger local/staging)                     |

### Service Registration Pattern

Payment service đăng ký qua Go `init()` function trong `cmd/server/payment/gserver.go`:

```go
func init() {
    s := &server{}
    bootstrap.
        WithGRPC(s).
        WithHTTP(s).
        WithNatsServicer(s).
        Register(s)
}
```

> **Ghi nhớ:** Payment service dùng DB của Fatima: `rsc.DBWith("fatima")`. Không có migrations riêng trong `migrations/payment/` — tất cả nằm trong Fatima.

### Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL CLIENTS                                │
│   Salesforce ──── gRPC ────┐     Admin Portal ── gRPC ──┐              │
│   Parent Webform ─ gRPC ──┐│                             │              │
└───────────────────────────┼┼─────────────────────────────┼──────────────┘
                            ││                             │
┌───────────────────────────┼┼─────────────────────────────┼──────────────┐
│  PAYMENT SERVICE          ││                             │              │
│  (cmd/server/payment)     ▼▼                             ▼              │
│  ┌───────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  ExternalOrderService (SF)    │  │  OrderService (Backoffice)   │    │
│  │  - CreateOrderGroup           │  │  - CreateOrder               │    │
│  │  - VoidOrderGroup             │  │  - CreateBulkOrder           │    │
│  │  - CreateBulkOrderGroup       │  │  - VoidOrder                 │    │
│  │  - GetExternalOrderInfo       │  │  - GenerateBillingItems      │    │
│  │  - RetrieveListOfOrders       │  │  - RetrieveListOfOrders      │    │
│  └──────────┬────────────────────┘  └──────────┬───────────────────┘    │
│             │                                   │                       │
│  ┌──────────▼───────────────────────────────────▼───────────────────┐   │
│  │                   DOMAIN SERVICES                                │   │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────────────────┐  │   │
│  │  │ Billing │ │ Discount │ │ Package   │ │ Student Product    │  │   │
│  │  │ - BillItem│ │         │ │ - Course  │ │                    │  │   │
│  │  │ - Schedule│ │         │ │           │ │                    │  │   │
│  │  └─────────┘ └──────────┘ └───────────┘ └────────────────────┘  │   │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐           │   │
│  │  │ Price   │ │ Tax      │ │ Material  │ │ Fee      │           │   │
│  │  └─────────┘ └──────────┘ └───────────┘ └──────────┘           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│  ┌───────────────────────────▼──────────────────────────────────────┐   │
│  │                    REPOSITORIES (90+)                            │   │
│  │  order, order_item, bill_item, student_product, product,        │   │
│  │  package, discount, billing_schedule, tax, ...                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                  ┌───────────▼─────────────┐                           │
│                  │  PostgreSQL (fatima DB)  │                           │
│                  │  via pgxpool + DBTrace   │                           │
│                  └─────────────────────────┘                           │
│                                                                        │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────┐                  │
│  │ NATS       │  │ Kafka       │  │ Unleash        │                  │
│  │ (events)   │  │ (events)    │  │ (feature flags)│                  │
│  └────────────┘  └─────────────┘  └────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
        ┌──────────┐  ┌────────────┐  ┌──────────────┐
        │ Fatima   │  │ Shamir     │  │ MasterMgmt   │
        │ (Exams)  │  │ (SF sync)  │  │ (Master data)│
        └──────────┘  └────────────┘  └──────────────┘
```

### Codebase Structure

| Directory                            | Mô tả                                       |
| ------------------------------------ | -------------------------------------------- |
| `cmd/server/payment/`                | Entry point: gserver.go, auth.go, set_up.go  |
| `internal/payment/backoffice/`       | Backoffice logic (entities, repos, services)  |
| `internal/payment/salesforce/`       | Salesforce-facing logic                       |
| `proto/payment/v1/`                  | 17 proto files                                |
| `features/payment/`                  | 100+ BDD test files (Godog)                   |
| `mock/payment/`                      | 100+ mock files                               |

### gRPC Services (14 services)

1. OrderService (22 RPCs)
2. ExternalOrderService (SF)
3. ExternalOrderWebformService
4. ImportMasterDataService (17 RPCs)
5. InternalService (8 RPCs)
6. ExportService
7. CourseService
8. + 7 more domain services

---

## 2. Product Types & Master Data

### Product Type Hierarchy

```
Product (product table)
├── product_type: PACKAGE | MATERIAL | FEE
├── billing_schedule_id: NULL = One-Time, Present = Recurring
│
├── PACKAGE (package table)
│   ├── ONE_TIME    (no billing_schedule)
│   ├── SLOT_BASED  (recurring)
│   ├── FREQUENCY   (recurring)
│   ├── SCHEDULED   (recurring)
│   └── MONTHLY     (recurring, KHÔNG THỂ UPDATE)
│   │
│   └── Contains: PackageCourse[] → each has:
│       ├── PackageCourseFee[]     (associated fees)
│       └── PackageCourseMaterial[] (associated materials)
│
├── FEE (fee table)
│   ├── ONE_TIME    (no billing_schedule)
│   └── RECURRING   (has billing_schedule)
│
└── MATERIAL (material table)
    ├── ONE_TIME    (no billing_schedule)
    └── RECURRING   (has billing_schedule)
```

> **Quan trọng — One-Time vs Recurring:** Phân biệt bằng `billing_schedule_id`:
> - `NULL` → One-Time product
> - `Present` → Recurring product (có billing schedule periods)

### 6 Billing Item Types

|                          | PACKAGE           | FEE           | MATERIAL           |
| ------------------------ | ----------------- | ------------- | ------------------ |
| **One-Time** (no schedule)  | ONE_TIME_PACKAGE  | ONE_TIME_FEE  | ONE_TIME_MATERIAL  |
| **Recurring** (has schedule)| RECURRING_PACKAGE | RECURRING_FEE | RECURRING_MATERIAL |

### Package Composition

Package là sản phẩm phức hợp, chứa courses, mỗi course có thể có fee và material đi kèm:

```
Package
  └── PackageCourse[] (package_course table)
       ├── PackageCourseFee[]      (associated fees)
       └── PackageCourseMaterial[] (associated materials)
```

**Package Types:**
- **ONE_TIME**: Mua 1 lần, không billing schedule
- **SLOT_BASED**: Recurring, giới hạn max slot
- **FREQUENCY**: Recurring, theo tần suất
- **SCHEDULED**: Recurring, theo lịch
- **MONTHLY**: Recurring, hàng tháng (**không thể update**)

### Discount Types (8 loại)

| #  | Type                | Mô tả                    |
| -- | ------------------- | ------------------------- |
| 1  | COMBO               | Combo discount (có duration) |
| 2  | REGULAR             | Giảm giá thông thường     |
| 3  | SCHOLARSHIP         | Học bổng                  |
| 4  | SIBLING             | Giảm giá anh chị em       |
| 5  | STAFF               | Giảm giá nhân viên        |
| 6  | PARENT_COMPANY      | Giảm giá công ty mẹ       |
| 7  | NEW_STUDENT         | Học sinh mới              |
| 8  | STUDENT_PROMOTIONAL | Khuyến mãi               |

**Discount entity fields quan trọng:**
- `discount_amount_type`: Percentage hoặc Fixed amount
- `discount_amount_value`: Giá trị giảm
- `recurring_valid_duration`: Số period áp dụng (recurring)
- `discount_tag_id`: Liên kết với discount tag
- `student_tag_id_validation`: Validate theo student tag

### Master Data Tables Reference

| Table                        | Key Fields                                     | Mục đích            |
| ---------------------------- | ---------------------------------------------- | -------------------- |
| `product`                    | product_type, billing_schedule_id, tax_id      | Product definition   |
| `product_price`              | product_id, price, quantity                    | Bảng giá             |
| `product_location`           | product_id, location_id                        | Nơi bán              |
| `product_grade`              | product_id, grade_id                           | Khối lớp áp dụng     |
| `product_discount`           | product_id, discount_id                        | Discount áp dụng     |
| `product_setting`            | product_id, ...                                | Config bổ sung       |
| `product_accounting_category`| product_id, acct_category_id                   | Phân loại kế toán    |
| `package`                    | package_type, max_slot                         | Chi tiết package     |
| `package_course`             | package_id, course_id                          | Course trong package |
| `fee`                        | fee_id, fee_type                               | Chi tiết fee         |
| `material`                   | material_id, material_type                     | Chi tiết material    |
| `discount`                   | 8 types, amount_type/value                     | Quy tắc giảm giá    |
| `tax`                        | tax_percentage                                 | Thuế                 |
| `billing_schedule`           | name                                           | Lịch billing         |
| `billing_schedule_period`    | start/end/billing_date                         | Các period           |
| `billing_ratio`              | numerator, denominator                         | Pro-rating ratios    |
| `academic_year`              | name                                           | Năm học              |

---

## 3. Order Types & Lifecycle

### 9 Order Types

| Order Type      | Internal Mapping   | Mô tả                                     |
| --------------- | ------------------ | ------------------------------------------ |
| NEW             | OrderCreate        | Tạo đơn hàng mới                          |
| ENROLLMENT      | OrderEnrollment    | Đăng ký (đã enroll trong org)              |
| UPDATE          | OrderUpdate        | Cập nhật (discount/course/duration)        |
| CANCEL          | OrderCancel        | Hủy sản phẩm                              |
| WITHDRAWAL      | OrderWithdraw      | Rút học sinh                               |
| LOA             | OrderLOA           | Leave of Absence                           |
| RESUME          | OrderResume        | Quay lại sau LOA                           |
| GRADUATE        | OrderGraduate      | Tốt nghiệp                                |
| CUSTOM_BILLING  | —                  | Billing tùy chỉnh                          |

### Order Status Flow

```
DRAFT ──→ SUBMITTED ──→ PENDING ──→ INVOICED
  │                        │
  ▼                        ▼
DRAFT_DELETED          REJECTED
                          │
                          ▼
                       VOIDED
```

---

## 4. CreateOrderGroup — Full Flow

> **Interview Tip:** Đây là core flow quan trọng nhất. Nắm vững 5 bước chính và giải thích được tại sao mỗi bước lại cần thiết.

### Request Structure

```
CreateOrderGroupRequest {
  order_group_id: string          // Unique group ID (validated)
  timezone: int32                 // Timezone offset
  orders: [
    {
      order_type: NEW | UPDATE | CANCEL | ENROLLMENT | ...
      student_id, location_id, academic_year_id
      order_items: [
        {
          product_id, discount_id (optional)
          start_date, end_date (optional)
          effective_date        // for UPDATE
          student_product_id    // for UPDATE/CANCEL
          courses: [{sf_course_offering_id, quantity}]
          discount_duration: {start, end}  // COMBO only
          is_cancel_item: bool
        }
      ]
    }
  ]
  custom_billings: [...]
}
```

### 5 Bước Chính

#### Bước 1: Extract Request (`extractOrderGroupRequest`)

Thu thập tất cả IDs từ request: product_ids, student_ids, location_ids, discount_ids, academic_year_ids, course_offering_ids.

> **Mục đích:** Chuẩn bị danh sách IDs cho bước Batch Prefetch, tránh phải scan request nhiều lần.

#### Bước 2: Prepare Data — Batch Prefetch (`PrepareDataForImportOrderGroup`)

Query **30+ maps** dữ liệu master vào cache `IPreparedDataCacherForImportOrderGroup`:

- Students, Products, Product Prices, Product Settings
- Product Locations, Product Grades, Product Discounts
- Packages, Package Courses, Fees, Materials
- Locations, Academic Years, Course Offerings
- Discounts, Discount Tags
- Billing Schedules, Billing Periods, Billing Ratios
- Tax, Accounting Categories
- Student Package Orders, Enrollment Status
- ...

> **Quan trọng — N+1 Prevention:** Thay vì query DB cho từng order item, hệ thống prefetch ALL master data 1 lần duy nhất rồi lookup từ cache. Giảm hàng trăm queries xuống còn ~30 queries.

#### Bước 3: Validate

- `validateCreateGroupOrderRequest()` — Validate business rules
- `validateReqTime()` — Validate request timestamp
- `IsValidOrderGroupID()` — Validate format order group ID

#### Bước 4: DB Transaction (`ExecInTxWithContextDeadline`)

Toàn bộ xử lý trong **1 transaction** với context deadline:

**a) `generateCreateOrderRequests()` — Sắp xếp theo precedence:**
1. CANCEL orders **first**
2. UPDATE orders **second**
3. NEW orders **last**

> **Interview Tip:** *"Tại sao CANCEL trước?"* — Cancel giải phóng resources (student product slots, billing items). Update cần biết trạng thái mới nhất. NEW cần kiểm tra slot availability — nên phải cancel/update trước.

**Per CANCEL order item:**
- Validate student_product_id exists
- Validate product exists + academic_year match
- Validate not already cancelled
- Convert SF course offering IDs → Manabie course IDs

**Per UPDATE order item:**
- Same validations as CANCEL
- Combo discount duration check
- Effective date eligibility
- GetHighestDiscounts check

**Per NEW order item:**
- Location/academic_year required
- Product validation
- SF course ID → Manabie convert

**b) `CreateOrderByLocationAndAcademicYear()` per order:**
- Nếu `isDraft`: `saveDraftOrder()` (save JSONB)
- Nếu submit: `submitOrder()` → flow chi tiết bên dưới

**c) `CreateCustomBilling()` per custom billing item**

**d) `handleResponse()` — Tổng hợp kết quả**

#### Bước 5: Post-Transaction

- Publish student package events qua **NATS/Kafka**
- Log API trace

### submitOrder() Detail Flow

```
submitOrder()
  ├── buildOrderItems()
  │     ├── Per order item, dispatch by type:
  │     │   ├── NEW        → buildOrderItemForCreate()
  │     │   ├── ENROLLMENT → buildOrderItemForEnrollment()
  │     │   ├── UPDATE     → buildOrderItemForUpdate()
  │     │   └── CANCEL     → buildOrderItemForCancel()
  │     │
  │     └── Each builds OrderItemInfo with:
  │           product validation, discount validation,
  │           bill items generation
  │
  ├── UpsertOrderForCreateOrder()
  │
  └── createOrderItems() per item:
        ├── CreateStudentProduct
        ├── CreateOrderItem
        ├── CreateOrderItemCourse (for packages)
        ├── CreateStudentPackage (for packages, returns events)
        └── CreateAndCancelBillItemsForCreateOrder
```

### buildOrderItemForCreate() — Chi tiết

1. Validate product location (product phải available tại location)
2. Validate orderable-once (nếu product là unique)
3. Validate enrollment-required
4. Validate academic year
5. Nếu Package: validate course data, get package info (quantity, succeeding quantity)
6. Optional: validate discount (type, eligibility, amount)
7. Gọi `GenerateBillItemsForNew()` — tạo bill items
8. Build `OrderItemInfo` với OrderType = OrderCreate

### buildOrderItemForCancel() — Chi tiết

1. Get existing StudentProduct by student_product_id
2. Determine `IsCancelCompletely`:
   - Explicit flag trong request, HOẶC
   - Recurring: reqEndDate < startDate AND now < startDate, HOẶC
   - One-time product: **luôn cancel completely**
3. Gọi `GenerateBillItemsForCancel()` — returns 3 lists: new, adjustment, cancelled
4. Build OrderItemInfo với OrderType = OrderCancel

### Update Order Behaviors

> **Quan trọng:** Chỉ **1 behavior** được phép tại một thời điểm. Monthly packages **KHÔNG THỂ** update.

| Behavior          | Mô tả                  | Điều kiện                                        |
| ----------------- | ----------------------- | ------------------------------------------------ |
| UPDATE_DISCOUNT   | Thay đổi discount       | Discount ID thay đổi                             |
| UPDATE_COURSE     | Thay đổi courses        | Course list thay đổi                             |
| UPDATE_DURATION   | Thay đổi thời hạn       | Chỉ cho one-time package với IsAvailabilitySetInOrder |

**Rules:**
- Duration change KHÔNG thể combine với changes khác
- EndDate phải ≥ StartDate
- Monthly packages cannot be updated

---

## 5. Bill Item Generation

### Architecture

```
GenerateBillItemsService
├── BillItemOneTimeProduct
│   ├── GenerateBillItemsForNew()    → 1 bill item
│   ├── GenerateBillItemsForUpdate() → new + adjustment + cancelled
│   └── GenerateBillItemsForCancel() → new + adjustment + cancelled
│
└── BillItemRecurringProduct
    ├── GenerateBillItemsForNew()    → N bill items (per billing period)
    ├── GenerateBillItemsForUpdate() → new + adjustment + cancelled
    └── GenerateBillItemsForCancel() → new + adjustment + cancelled
```

Sử dụng 13 domain services: Tax, Discount, Material, StudentProduct, Price, Course, Package, OrderItem, BillItem, Fee, BillingSchedule.

### Bill Item Calculation Formula

```
ProductPricing = Price × (BillingRatioNumerator / BillingRatioDenominator)

DiscountAmount =
  if percentage: ProductPricing × DiscountPercentage
  if fixed:      DiscountFixedValue

TaxAmount = (ProductPricing - DiscountAmount) × TaxPercentage

FinalPrice = ProductPricing - DiscountAmount

AdjustmentPrice = [(OldPrice - OldDiscount) - (NewPrice - NewDiscount)] × Ratio
```

### One-Time vs Recurring

|                       | One-Time                      | Recurring                         |
| --------------------- | ----------------------------- | --------------------------------- |
| Bill items count      | 1                             | N (per billing period)            |
| Billing schedule      | Không cần                     | Bắt buộc có                      |
| Pro-rating            | Không (hoặc disable flag)     | Có (billing_ratio)               |
| Cancel behavior       | Luôn cancel completely        | Partial hoặc completely           |
| Duration              | Fixed                         | Theo billing schedule periods     |
| Billing date          | Ngày order hoặc custom        | Theo billing_date của period      |

### 3 Loại Bill Items khi Cancel/Update

1. **New Bill Items**: Bill items mới được tạo (ví dụ: periods còn lại sau update)
2. **Adjustment Bill Items**: Điều chỉnh cho periods đã billed (hoàn tiền/thu thêm)
3. **Cancelled Bill Items**: Bill items bị cancel (upcoming periods)

---

## 6. Database Schema (Key Tables)

### Order Tables

**`order` table:**
```
order_id, student_id, student_full_name, location_id,
order_sequence_number, order_comment, order_status, order_type,
academic_year_id, is_draft, draft_order_items (JSONB),
is_reviewed, version_number,
withdrawal_effective_date, loa_start_date, loa_end_date,
background, future_measures,
updated_at, created_at, resource_path
```

**`order_item` table:**
```
order_item_id, order_id, product_id, discount_id,
student_product_id, product_name,
start_date, effective_date, cancellation_date, end_date,
academic_year_id, created_at, resource_path
```

### Bill Item Table

**`bill_item` table:**
```
bill_item_sequence_number, student_id, student_product_id,
order_id, product_id,
bill_type, bill_status, bill_date, bill_from, bill_to,
billing_item_description (JSONB),
bill_schedule_period_id,

-- Pricing
price (raw), product_pricing (Price × Ratio),
discount_amount_type, discount_amount_value,
discount_amount, raw_discount_amount, discount_id,
tax_id, tax_category, tax_amount, tax_percentage,
final_price (ProductPricing - DiscountAmount),
adjustment_price,
billing_ratio_numerator, billing_ratio_denominator,

-- Metadata
location_id, location_name, academic_year_id,
previous_bill_item_sequence_number, previous_bill_item_status,
is_latest_bill_item, old_price, is_reviewed,
bill_approval_status, reference,
updated_at, created_at, resource_path
```

**`billing_item_description` (JSONB):**
```
product_id, product_name, product_type, package_type,
material_type, fee_type, quantity_type,
billing_period, billing_ratio,
course_items[], billing_period_name, billing_schedule_name,
billing_ratio_numerator/denominator,
discount_name, grade_id, grade_name
```

### Student Product Table

**`student_product` table:**
```
student_product_id, student_id, product_id,
start_date, end_date, upcoming_billing_date,
product_status, approval_status,
location_id, academic_year_id,
updated_from_student_product_id, updated_to_student_product_id,
student_product_label, is_unique, is_associated,
root_student_product_id, version_number,
updated_at, created_at, deleted_at, resource_path
```

### All Tables (inferred from 90+ repositories)

**Order domain:** order, order_item, order_item_course, order_action_log, order_leaving_reason, order_event_log

**Billing domain:** bill_item, bill_item_course, bill_item_account_category, bill_item_salesforce, upcoming_bill_item

**Student domain:** student, student_product, student_package, student_package_order, student_package_access_path, student_package_class, student_package_log, student_course, student_enrollment_status_history, student_associated_product

**Product domain:** product, product_price, product_grade, product_location, product_discount, product_setting, product_accounting_category, product_group, product_group_mapping

**Package domain:** package, package_course, package_course_fee, package_course_material, package_quantity_type_mapping

**Master data:** fee, material, tax, discount, billing_schedule, billing_schedule_period, billing_ratio, accounting_category, academic_year, map_academic_year_product, notification_date, leaving_reason

**Infrastructure:** location, user, user_access_path, user_discount_tag, class, course_access_path, grade, file, cronjob_log

---

## 7. Design Patterns & Interview Points

### Pattern 1: Batch Prefetch (N+1 Prevention)

> **"Tại sao dùng cache thay vì query trực tiếp?"** — Vì 1 order group có thể chứa hàng chục orders, mỗi order có nhiều items. Nếu query per-item sẽ có hàng trăm DB round-trips. Batch prefetch giảm xuống ~30 queries.

### Pattern 2: Order Precedence (CANCEL → UPDATE → NEW)

> **"Tại sao phải xử lý CANCEL trước?"** — Cancel giải phóng student product slots và billing items. Update cần state mới nhất. NEW cần kiểm tra slot availability. Thứ tự đảm bảo consistency.

### Pattern 3: Transaction Boundary

Toàn bộ order group xử lý trong **1 DB transaction** (`ExecInTxWithContextDeadline`):
- **Atomic**: all-or-nothing
- **Context deadline**: tránh long-running transactions
- **Rollback tự động** nếu có error

### Pattern 4: Event-Driven Post-Processing

Sau transaction commit thành công:
- Publish student package events qua **NATS** (real-time)
- Publish qua **Kafka** (event streaming, downstream consumers)
- Events **KHÔNG** publish trong transaction (tránh side effects khi rollback)

### Pattern 5: Draft Support

- Orders save as draft: `draft_order_items` (JSONB column)
- Draft **không** tạo bill items hay student products
- Submit draft → full order processing flow

### Pattern 6: Salesforce Integration

- SF course offering IDs → convert sang Manabie course IDs
- External API (ExternalOrderService) tách biệt với internal (OrderService)
- Shamir service làm bridge giữa SF và Manabie

### Pattern 7: RBAC & Auth

- ~130 endpoints protected
- 7 roles: SchoolAdmin, HQStaff, CentreManager, CentreLead, CentreStaff, AdminStaff, Parent
- 8 InternalService endpoints bypass auth (fake JWT) — cho cron jobs

---

## 8. Related Features

### ExternalOrderService RPCs (Salesforce-facing)

| RPC                             | Mô tả                              |
| ------------------------------- | ----------------------------------- |
| CreateOrderGroup                | Tạo nhóm đơn hàng (core)           |
| CreateBulkOrderGroup            | Tạo nhiều nhóm cùng lúc            |
| VoidOrderGroup                  | Hủy bỏ nhóm đơn hàng              |
| VerifyCreatingOrderGroup        | Verify trước khi tạo (dry-run)     |
| GetExternalOrderInfo            | Lấy thông tin order                |
| RetrieveExternalListOfOrders    | Danh sách orders                   |

### Supporting Services

| Service                 | RPCs     | Mô tả                                     |
| ----------------------- | -------- | ------------------------------------------ |
| ImportMasterDataService | 17 RPCs  | Import CSV master data                     |
| InternalService         | 8 RPCs   | Cron: GenerateBillingItems, SyncStudentProducts |
| OrderService            | 22 RPCs  | Backoffice order management                |
| ExportService           | —        | Export data                                |
| CourseService           | —        | Import student courses/classes             |
| OrderWebformService     | —        | Parent-facing webform                      |

---

## 9. Câu hỏi Interview thường gặp

### Q1: Mô tả flow CreateOrderGroup?

**Trả lời:** 5 bước — Extract IDs → Batch Prefetch 30+ maps → Validate → DB Transaction (CANCEL→UPDATE→NEW, per order: buildItems→upsert→createItems→billItems) → Publish events.

### Q2: Tại sao dùng batch prefetch thay vì query on-demand?

**Trả lời:** Tránh N+1 problem. 1 order group có thể có 10+ orders × 5+ items = 50+ items. Query per-item = 100+ DB calls. Batch = ~30 calls.

### Q3: Phân biệt One-Time và Recurring product?

**Trả lời:** Dựa vào `billing_schedule_id`: NULL = one-time (1 bill item), Present = recurring (N bill items per billing schedule period, có pro-rating).

### Q4: Tại sao CANCEL xử lý trước NEW?

**Trả lời:** Giải phóng resources (slots, billing) trước. Update cần state mới nhất. NEW cần kiểm tra availability sau cancel/update.

### Q5: Bill item được tính như thế nào?

**Trả lời:** ProductPricing = Price × BillingRatio. FinalPrice = ProductPricing - DiscountAmount. AdjustmentPrice cho update/cancel = delta × ratio.

### Q6: Draft order hoạt động thế nào?

**Trả lời:** Save JSONB `draft_order_items` trong order table. Không tạo student product hay bill items. Submit draft = full processing.

### Q7: Events publish khi nào?

**Trả lời:** SAU transaction commit (không trong transaction). Qua NATS (real-time) và Kafka (streaming). Tránh side effects khi rollback.

### Q8: Có bao nhiêu loại product?

**Trả lời:** 3 loại chính (Package, Fee, Material) × 2 (One-Time/Recurring) = 6 billing item types. Package có 5 sub-types.

### Q9: Update order có giới hạn gì?

**Trả lời:** Chỉ 1 behavior/lần (discount OR course OR duration). Monthly packages không update được. Duration chỉ cho one-time package.

### Q10: Cancel completely vs partial cancel?

**Trả lời:** Completely = set endDate = startDate (xóa toàn bộ). One-time luôn cancel completely. Recurring có thể partial (set endDate < original endDate).

---

## 10. Key Code Files Reference

| File                                                                     | Mô tả                          |
| ------------------------------------------------------------------------ | ------------------------------- |
| `cmd/server/payment/gserver.go`                                          | Service bootstrap, 14 gRPC services |
| `cmd/server/payment/auth.go`                                             | RBAC, ~130 endpoints            |
| `proto/payment/v1/external_order.proto`                                  | ExternalOrderService proto      |
| `proto/payment/v1/enums.proto`                                           | All enums                       |
| `internal/payment/salesforce/services/order_mgmt/order_mgmt.go`          | ExternalOrderService struct     |
| `.../order_mgmt/create_order/create_order_group.go`                      | CreateOrderGroup flow (745 lines) |
| `.../create_order/prepare_data_for_creating_order_group.go`              | Batch prefetch 30+ maps         |
| `.../create_order/create_order.go`                                       | Core order creation (~1900 lines) |
| `.../create_order/generate_bill_items/generate_bill_items.go`            | Bill item generation             |
| `internal/payment/backoffice/entities/*.go`                              | All entity definitions           |
| `internal/payment/backoffice/repositories/*.go`                          | 90+ repositories                 |
