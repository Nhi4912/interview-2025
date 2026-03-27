# gRPC & Protocol Buffers / gRPC và Protocol Buffers

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [API Design](./01-api-design.md) | [Networking for Go](./06-networking-go.md)
> **See also**: [Microservices](./02-microservices.md) | [Distributed Systems](./03-distributed-systems.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Grab Driver-Dispatch Service (thực tế):** Service tính toán driver matching nhận 50,000 location updates/giây từ driver app. Dùng REST/JSON: payload 850 bytes/request, tổng bandwidth 42 MB/s. Sau khi migrate sang gRPC/protobuf: payload 95 bytes/request (11x nhỏ hơn), bandwidth 4.8 MB/s, latency giảm 40% vì HTTP/2 multiplexing loại bỏ TCP handshake overhead.

**Bài học:** gRPC không phải "REST mà cool hơn" — nó giải quyết bài toán cụ thể: high-throughput internal service communication với strongly-typed contracts.

## What & Why / Cái Gì & Tại Sao

**Analogy:** REST giống điện thoại: bạn gọi, đọc số, bên kia nghe và ghi lại. gRPC giống tín hiệu nhị phân giữa hai máy tính: nhanh hơn, chính xác hơn, ít lỗi hơn — nhưng con người không đọc được. Protocol Buffers là ngôn ngữ chung mà cả hai máy đều hiểu, được generate thành code tự động.

**Why it matters:** Microservices cần internal communication hiệu quả. JSON/REST tốn CPU để parse text, tốn bandwidth, không có schema enforcement. gRPC giải quyết cả 3.

## Concept Map / Bản Đồ Khái Niệm

```
[gRPC Stack]
        │
        ├── Protocol Buffers (.proto file)
        │     ├── Schema definition → code generation
        │     ├── Binary serialization (3-10x smaller than JSON)
        │     └── Strong typing: compile-time contract
        │
        ├── HTTP/2 Transport
        │     ├── Multiplexing: multiple streams on 1 TCP connection
        │     ├── Header compression (HPACK)
        │     └── Server push capability
        │
        └── RPC Patterns
              ├── Unary: 1 request → 1 response (like REST)
              ├── Server Streaming: 1 request → N responses
              ├── Client Streaming: N requests → 1 response
              └── Bidirectional: N requests ↔ N responses (WebSocket-like)
```

---

## Overview / Tổng Quan

gRPC là RPC framework của Google, dùng Protocol Buffers (protobuf) cho serialization và HTTP/2 cho transport. Hay được hỏi ở phỏng vấn Grab, Axon, Zalo vì đây là standard cho internal microservice communication.

| #   | Concept                             | Role                                                      | Interview Weight |
| --- | ----------------------------------- | --------------------------------------------------------- | ---------------- |
| 1   | gRPC vs REST Trade-offs             | Architectural decision for API communication              | ⭐⭐⭐⭐⭐       |
| 2   | Protocol Buffers & Schema Evolution | Binary serialization with backward/forward compatibility  | ⭐⭐⭐⭐         |
| 3   | gRPC Streaming Patterns             | Unary, server, client, bidirectional streaming            | ⭐⭐⭐⭐         |
| 4   | Interceptors (Middleware)           | Cross-cutting concerns: auth, logging, metrics            | ⭐⭐⭐           |
| 5   | gRPC Error Handling & Status Codes  | Structured error responses with rich details              | ⭐⭐⭐           |
| 6   | Load Balancing for gRPC             | HTTP/2 multiplexing breaks L4 LB → need L7 or client-side | ⭐⭐⭐⭐⭐       |
| 7   | gRPC Retry & Resilience             | Built-in retry policy, hedging, deadline propagation      | ⭐⭐⭐⭐         |

**Relationship / Mối quan hệ:** Trade-off decision (1) → Protobuf schema (2) → Streaming patterns (3) expand capability → Interceptors (4) add cross-cutting logic → Error handling (5) ensures reliability → Load balancing (6) is the production gotcha → Retry & Resilience (7) completes production-readiness.

---

## Core Concepts — Phase 2 Deep Treatment / Khái Niệm Cốt Lõi — Xử Lý Sâu

### Concept 1: gRPC vs REST Trade-offs

**🧠 Memory Hook:** "gRPC = internal highway (fast, typed, binary), REST = public road (universal, readable, browser-friendly)."
_gRPC = đường cao tốc nội bộ (nhanh, typed, binary), REST = đường công cộng (ai cũng dùng được, đọc được)._

**❓ Why exists (root-cause tracing):**

- Level 1: Why is gRPC faster? → Binary protobuf vs text JSON + HTTP/2 multiplexing vs HTTP/1.1 head-of-line blocking
- Level 2: Why not use gRPC everywhere? → Browsers can't use HTTP/2 trailers natively → need gRPC-Web proxy → extra infra
- Level 3: Why does Grab use both? → Internal: gRPC for 50K+ RPS driver-dispatch. External: REST for partner APIs because universality > performance

**⚠️ Common Mistakes:**

1. Using gRPC for public APIs → browser clients can't call directly
2. Assuming gRPC = always faster → for low-frequency CRUD, REST simplicity wins
3. Not considering debugging difficulty — binary payloads need tools like `grpcurl`

**🎯 Interview Pattern:** "Why did your team choose gRPC?" → specific numbers (payload size, latency, RPS) + explain when REST is better

**🔗 Knowledge Chain:** REST Limitations → HTTP/2 Advantages → Protobuf Efficiency → gRPC Decision Framework

---

### Concept 2: Protocol Buffers & Schema Evolution

**🧠 Memory Hook:** "Field numbers are forever — change the name, never the number."
_Field number là vĩnh viễn — đổi tên được, không đổi số._

**❓ Why exists (root-cause tracing):**

- Level 1: Why field numbers instead of names? → Binary encoding uses field number as key → 1 byte vs N bytes for string name
- Level 2: Why backward/forward compatibility? → Microservices deploy independently → old client must talk to new server and vice versa
- Level 3: Why `reserved` keyword? → Prevent reuse of deleted field numbers → avoids data corruption when old messages with that number are deserialized

**⚠️ Common Mistakes:**

1. Changing field number → breaks all existing clients silently (data corruption, not error)
2. Using `required` (proto2) → impossible to evolve schema → proto3 made everything optional
3. Not using `reserved` for deleted fields → future developer reuses number → corrupt data

**🎯 Interview Pattern:** "How do you evolve a protobuf schema without breaking clients?" → add fields (never remove number) + use `reserved` + version via package name

**🔗 Knowledge Chain:** Schema Definition → Field Numbers → Wire Format → Backward Compatibility → Schema Evolution → API Versioning

---

### Concept 3: gRPC Streaming Patterns

**🧠 Memory Hook:** "4 patterns = walkie-talkie modes: one-way message, broadcast, collect, two-way radio."
_4 patterns = chế độ bộ đàm: gửi 1 chiều, phát sóng, thu thập, 2 chiều._

**❓ Why exists (root-cause tracing):**

- Level 1: Why server streaming? → Large result sets or real-time feeds → avoid loading everything into memory
- Level 2: Why client streaming? → Batch upload or aggregation → client sends many items, server responds once with summary
- Level 3: Why bidirectional? → Chat, telemetry, collaborative editing → both sides send independently, unlike request-response

**⚠️ Common Mistakes:**

1. Using unary for large data → OOM when response is 100MB → use server streaming instead
2. Not handling stream errors mid-flight → partial data processed without rollback
3. Forgetting to close send stream → server hangs waiting for more messages

**🎯 Interview Pattern:** "Design real-time driver location tracking" → bidirectional stream: driver sends locations, server sends route updates

**🔗 Knowledge Chain:** Unary RPC → Server Streaming → Client Streaming → Bidirectional → Flow Control → Backpressure

---

### Concept 4: Interceptors (Middleware)

**🧠 Memory Hook:** "Interceptors = security checkpoints at the airport — every request passes through auth, logging, metrics before reaching the gate."
_Interceptors = trạm kiểm soát sân bay — mọi request qua auth, logging, metrics trước khi đến gate._

**❓ Why exists (root-cause tracing):**

- Level 1: Why interceptors instead of per-handler logic? → Cross-cutting concerns repeated in every handler → interceptor centralizes
- Level 2: Why chain multiple interceptors? → Auth first, then logging, then metrics → order matters → chain pattern
- Level 3: Why separate unary vs stream interceptors? → Stream interceptors wrap the entire stream lifecycle, not just one call

**⚠️ Common Mistakes:**

1. Putting auth logic in each handler → inconsistent enforcement, easy to miss one
2. Wrong interceptor order → logging before auth means unauthenticated requests logged without rejection
3. Not propagating metadata → auth token in metadata lost when calling downstream services

**🎯 Interview Pattern:** "How do you add auth to all gRPC services?" → unary + stream interceptors → extract JWT from metadata → validate → reject or continue chain

**🔗 Knowledge Chain:** Handler Logic → Cross-Cutting Concerns → Interceptor Chain → Metadata Propagation → Context Enrichment

---

### Concept 5: gRPC Error Handling & Status Codes

**🧠 Memory Hook:** "gRPC status codes = HTTP status codes' disciplined cousin — specific, enumerated, with rich error details."
_gRPC status codes = anh em có kỷ luật của HTTP status — cụ thể, liệt kê rõ, kèm chi tiết._

**❓ Why exists (root-cause tracing):**

- Level 1: Why not just return errors as strings? → Clients can't programmatically handle "something went wrong" → status codes enable switch/case handling
- Level 2: Why rich error details? → `InvalidArgument` alone doesn't say which field → `BadRequest.FieldViolation` tells exactly what's wrong
- Level 3: Why map to HTTP codes? → gRPC-Web and gRPC-Gateway translate to REST → consistent error experience for both gRPC and REST clients

**⚠️ Common Mistakes:**

1. Returning `Internal` for everything → client can't distinguish retryable vs permanent errors
2. Not using error details → `InvalidArgument` without field name forces client to guess
3. Confusing `NotFound` vs `FailedPrecondition` → NotFound = resource doesn't exist, FailedPrecondition = resource exists but wrong state

**🎯 Interview Pattern:** "How do you design error responses in gRPC?" → specific status codes + error details + mapping to retry policy

**🔗 Knowledge Chain:** Status Codes → Error Details (proto) → Client Handling → Retry Decision → gRPC-Gateway HTTP Mapping

---

### Concept 6: Load Balancing for gRPC

**🧠 Memory Hook:** "L4 LB + HTTP/2 = all eggs in one basket — one connection, all RPCs, one backend."
_L4 LB + HTTP/2 = bỏ hết trứng vào 1 rổ — 1 connection, mọi RPC, 1 backend._

**❓ Why exists (root-cause tracing):**

- Level 1: Why doesn't AWS NLB work for gRPC? → HTTP/2 multiplexes all RPCs on one TCP connection → L4 LB sees one connection → routes all to one backend
- Level 2: Why client-side LB? → Client resolves DNS → round-robin across backends → each RPC goes to different backend → true load distribution
- Level 3: Why Envoy/Istio preferred in K8s? → L7 proxy understands HTTP/2 frames → per-RPC routing → plus service mesh benefits (mTLS, observability)

**⚠️ Common Mistakes:**

1. Using TCP-mode load balancer → all traffic to one backend → others idle
2. Not enabling `round_robin` in client service config → default picks one and sticks
3. DNS caching → client resolves once, doesn't pick up new pods → stale backend list

**🎯 Interview Pattern:** "Your gRPC service has uneven load across pods" → check if using L4 LB → switch to client-side or L7 proxy

**🔗 Knowledge Chain:** HTTP/2 Multiplexing → L4 vs L7 LB → Client-Side LB → Service Mesh → Health Checking

---

### Concept 7: gRPC Retry & Resilience

**🧠 Memory Hook:** "Retry only UNAVAILABLE and RESOURCE*EXHAUSTED — never retry INVALID_ARGUMENT (garbage in, garbage out)."
\_Chỉ retry UNAVAILABLE và RESOURCE_EXHAUSTED — đừng bao giờ retry INVALID_ARGUMENT (rác vào, rác ra).*

**❓ Why exists (root-cause tracing):**

- Level 1: Why built-in retry? → Every gRPC client implements retry → standardize in service config → consistent behavior
- Level 2: Why only certain status codes? → `UNAVAILABLE` = transient → retry likely succeeds. `INVALID_ARGUMENT` = permanent → retry wastes resources
- Level 3: Why hedging? → Tail latency problem → send to multiple backends, take first response → reduces p99 at cost of extra load

**⚠️ Common Mistakes:**

1. Retrying `DEADLINE_EXCEEDED` → original deadline already passed → retry with same deadline fails immediately
2. No max attempts → exponential retry creates thundering herd → amplifies outage
3. Not propagating deadline → parent deadline 5s, child call also 5s → total could exceed 10s

**🎯 Interview Pattern:** "How do you handle transient failures in gRPC?" → service config retry policy + deadline propagation + circuit breaker for persistent failures

**🔗 Knowledge Chain:** Status Code Classification → Retry Policy Config → Backoff Strategy → Hedging → Deadline Propagation → Circuit Breaker

---

## 1. gRPC vs REST / So Sánh

### Q: When would you choose gRPC over REST? 🟡 Mid

**A:**

| Feature             | gRPC                           | REST/JSON                |
| ------------------- | ------------------------------ | ------------------------ |
| **Protocol**        | HTTP/2                         | HTTP/1.1 or 2            |
| **Serialization**   | Protobuf (binary)              | JSON (text)              |
| **Payload size**    | 3–10x smaller                  | Larger                   |
| **Speed**           | ~7x faster encode/decode       | Slower                   |
| **Streaming**       | Bidirectional, server, client  | Limited (SSE, WebSocket) |
| **Type safety**     | Strong (generated code)        | None (at API boundary)   |
| **Browser support** | Limited (needs gRPC-Web proxy) | Native                   |
| **Human readable**  | No (binary)                    | Yes                      |
| **API discovery**   | .proto file                    | OpenAPI/Swagger          |

**Choose gRPC when:**

- Internal service-to-service communication (microservices)
- Performance critical (high frequency calls, low latency)
- Strongly typed contracts across teams/languages
- Need streaming (real-time data, bidirectional)

**Choose REST when:**

- Public API (browsers, mobile, third-party clients)
- Simple CRUD, few calls per second
- Team unfamiliar with protobuf toolchain
- Need human-readable debugging

**Grab/Zalo pattern**: gRPC for internal services, REST/GraphQL for client-facing APIs.

---

## 2. Protocol Buffers / Ngôn Ngữ Định Nghĩa Giao Thức

### Q: Write a protobuf definition for a user service and explain key concepts. 🟢 Junior → 🔴 Senior

**A:**

```protobuf
// user.proto
syntax = "proto3";

package user.v1;

option go_package = "github.com/myapp/gen/user/v1";

// Service definition
service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (User);
  rpc WatchUserActivity(WatchRequest) returns (stream ActivityEvent); // server streaming
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);          // bidirectional
}

// Messages
message User {
  string id = 1;        // field number 1 — used in binary encoding (NOT the value)
  string email = 2;
  string name = 3;
  UserStatus status = 4;
  repeated string roles = 5;   // repeated = list/array
  google.protobuf.Timestamp created_at = 6;
  oneof contact {              // oneof = exactly one field set
    string phone = 7;
    string social_id = 8;
  }
}

enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0; // proto3: must have 0 value
  USER_STATUS_ACTIVE = 1;
  USER_STATUS_SUSPENDED = 2;
}

message GetUserRequest  { string id = 1; }
message GetUserResponse { User user = 1; }

message ListUsersRequest {
  int32 page_size = 1;
  string page_token = 2;  // cursor-based pagination
  string filter = 3;
}

message ListUsersResponse {
  repeated User users = 1;
  string next_page_token = 2;
}
```

**Key protobuf concepts:**

- **Field numbers** (not values) are what gets encoded in binary — never change them
- `repeated` = slice/array
- `oneof` = union type — at most one field set
- **Default values**: proto3 omits zero values in encoding — `0`, `""`, `false` are defaults
- **Backward compatibility**: add fields freely, never remove or renumber

**Thay đổi schema an toàn**:

```protobuf
// Safe: add new optional field
message User {
  string id = 1;
  string email = 2;
  string name = 3;
  string avatar_url = 9;  // new field — old clients ignore it, new clients use it
}

// UNSAFE: change field number or type
// message User { string email = 3; }  // NEVER — breaks binary compatibility
```

---

## 3. Go Implementation / Triển Khai với Go

### Q: Implement a gRPC server and client in Go. 🟡 Mid

**A:**

**Step 1: Generate Go code from proto**

```bash
# Install tools
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Generate
protoc --go_out=. --go_opt=paths=source_relative \
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
       proto/user.proto
```

**Step 2: Implement the server**

```go
package server

import (
    "context"
    "fmt"
    "net"

    "google.golang.org/grpc"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
    pb "github.com/myapp/gen/user/v1"
)

type UserServer struct {
    pb.UnimplementedUserServiceServer // embed for forward compatibility
    repo UserRepository
}

func (s *UserServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
    if req.Id == "" {
        return nil, status.Error(codes.InvalidArgument, "user id is required")
    }

    user, err := s.repo.FindByID(ctx, req.Id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, status.Errorf(codes.NotFound, "user %s not found", req.Id)
        }
        return nil, status.Errorf(codes.Internal, "get user: %v", err)
    }

    return &pb.GetUserResponse{User: userToProto(user)}, nil
}

// Server streaming: send events as they happen
func (s *UserServer) WatchUserActivity(req *pb.WatchRequest, stream pb.UserService_WatchUserActivityServer) error {
    ch := s.eventBus.Subscribe(req.UserId)
    defer s.eventBus.Unsubscribe(ch)

    for {
        select {
        case event := <-ch:
            if err := stream.Send(eventToProto(event)); err != nil {
                return err // client disconnected
            }
        case <-stream.Context().Done():
            return nil // client cancelled
        }
    }
}

func main() {
    lis, _ := net.Listen("tcp", ":50051")

    s := grpc.NewServer(
        grpc.UnaryInterceptor(loggingInterceptor),
        grpc.StreamInterceptor(streamLoggingInterceptor),
    )
    pb.RegisterUserServiceServer(s, &UserServer{})

    fmt.Println("gRPC server listening on :50051")
    s.Serve(lis)
}
```

**Step 3: Client**

```go
func NewUserClient(addr string) (pb.UserServiceClient, error) {
    conn, err := grpc.Dial(addr,
        grpc.WithTransportCredentials(insecure.NewCredentials()), // use TLS in prod
        grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(10*1024*1024)), // 10MB
        grpc.WithKeepaliveParams(keepalive.ClientParameters{
            Time:    30 * time.Second,
            Timeout: 10 * time.Second,
        }),
    )
    if err != nil {
        return nil, err
    }
    return pb.NewUserServiceClient(conn), nil
}

// Usage
func getUser(client pb.UserServiceClient, userID string) (*pb.User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    resp, err := client.GetUser(ctx, &pb.GetUserRequest{Id: userID})
    if err != nil {
        // Check gRPC status code
        if st, ok := status.FromError(err); ok {
            switch st.Code() {
            case codes.NotFound:
                return nil, ErrUserNotFound
            case codes.DeadlineExceeded:
                return nil, ErrTimeout
            }
        }
        return nil, err
    }
    return resp.User, nil
}
```

---

## 4. Interceptors (Middleware) / Middleware trong gRPC

### Q: How do you add authentication, logging, and metrics to gRPC? 🟢 Junior → 🔴 Senior

**A:** gRPC interceptors = middleware for unary and streaming calls.

```go
// Unary interceptor (for regular RPC calls)
func authInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    // Extract token from metadata
    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return nil, status.Error(codes.Unauthenticated, "missing metadata")
    }

    tokens := md.Get("authorization")
    if len(tokens) == 0 {
        return nil, status.Error(codes.Unauthenticated, "missing token")
    }

    userID, err := validateToken(tokens[0])
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "invalid token")
    }

    // Add to context for downstream handlers
    ctx = context.WithValue(ctx, userIDKey{}, userID)
    return handler(ctx, req)
}

// Logging + metrics interceptor
func loggingInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    start := time.Now()
    resp, err := handler(ctx, req)
    duration := time.Since(start)

    code := codes.OK
    if err != nil {
        code = status.Code(err)
    }

    log.Printf("method=%s code=%s duration=%v", info.FullMethod, code, duration)
    metrics.RecordRPCCall(info.FullMethod, code.String(), duration)

    return resp, err
}

// Chain multiple interceptors
s := grpc.NewServer(
    grpc.ChainUnaryInterceptor(
        recoveryInterceptor,   // panic recovery — must be first
        loggingInterceptor,
        authInterceptor,
        rateLimitInterceptor,
    ),
)
```

**Client-side metadata (equivalent to HTTP headers):**

```go
// Send auth token with every call
ctx = metadata.AppendToOutgoingContext(ctx,
    "authorization", "Bearer "+token,
    "x-request-id", requestID,
)
resp, err := client.GetUser(ctx, req)
```

---

## 5. Error Handling / Xử Lý Lỗi

### Q: How do gRPC status codes map to HTTP and how should you use them? 🟡 Mid

**A:**

| gRPC Code            | HTTP | When to use                             |
| -------------------- | ---- | --------------------------------------- |
| `OK`                 | 200  | Success                                 |
| `INVALID_ARGUMENT`   | 400  | Bad input from client                   |
| `NOT_FOUND`          | 404  | Resource doesn't exist                  |
| `ALREADY_EXISTS`     | 409  | Duplicate create                        |
| `PERMISSION_DENIED`  | 403  | Authenticated but no permission         |
| `UNAUTHENTICATED`    | 401  | No/invalid credentials                  |
| `RESOURCE_EXHAUSTED` | 429  | Rate limited                            |
| `UNAVAILABLE`        | 503  | Server temporarily down (safe to retry) |
| `DEADLINE_EXCEEDED`  | 504  | Timeout                                 |
| `INTERNAL`           | 500  | Unexpected server error                 |

```go
// Return rich errors with details
import "google.golang.org/genproto/googleapis/rpc/errdetails"

func (s *UserServer) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.User, error) {
    if req.Email == "" {
        st, _ := status.New(codes.InvalidArgument, "validation failed").
            WithDetails(&errdetails.BadRequest{
                FieldViolations: []*errdetails.BadRequest_FieldViolation{
                    {Field: "email", Description: "email is required"},
                },
            })
        return nil, st.Err()
    }
    // ...
}

// Client extracts details
if st, ok := status.FromError(err); ok && st.Code() == codes.InvalidArgument {
    for _, detail := range st.Details() {
        if br, ok := detail.(*errdetails.BadRequest); ok {
            for _, v := range br.FieldViolations {
                fmt.Printf("field %s: %s\n", v.Field, v.Description)
            }
        }
    }
}
```

---

## 6. Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: How does gRPC handle load balancing? 🔴 Senior

**A:** gRPC runs over HTTP/2 with multiplexed streams on a single TCP connection → L4 load balancers (AWS NLB, HAProxy TCP mode) don't distribute RPC calls, only connections.

**Solutions:**

1. **Client-side load balancing**: client resolves service DNS → picks backend round-robin or least-conn
2. **gRPC-aware proxy**: Envoy/Linkerd understands HTTP/2 frames → true per-RPC load balancing
3. **Headless service** (Kubernetes): DNS returns all pod IPs → client picks

```go
// Client-side LB with round-robin
conn, _ := grpc.Dial(
    "dns:///user-service.default.svc.cluster.local:50051",
    grpc.WithDefaultServiceConfig(`{"loadBalancingPolicy":"round_robin"}`),
    grpc.WithTransportCredentials(insecure.NewCredentials()),
)
```

**Tại sao quan trọng**: Đây là câu hỏi hay trick người dùng gRPC lần đầu. Nếu dùng AWS ALB → phải enable HTTP/2 ALB mode. Trong K8s → dùng Envoy sidecar (Istio) hoặc headless service.

---

### Q: What is gRPC reflection and when is it useful? 🟡 Mid

**A:** gRPC reflection = server exposes its service definitions at runtime, allowing tools like `grpcurl` to call services without the `.proto` file.

```go
import "google.golang.org/grpc/reflection"

s := grpc.NewServer()
pb.RegisterUserServiceServer(s, &UserServer{})
reflection.Register(s) // enable reflection

// Now you can use grpcurl to test:
// grpcurl -plaintext localhost:50051 list
// grpcurl -plaintext -d '{"id":"123"}' localhost:50051 user.v1.UserService/GetUser
```

**Production note**: Enable reflection only in dev/staging — in prod it exposes your API surface.

---

## Summary / Tổng Kết

| Topic            | Key Points                                                |
| ---------------- | --------------------------------------------------------- |
| gRPC vs REST     | gRPC for internal; REST for external/browser              |
| Protobuf         | Field numbers never change; add fields freely             |
| Server streaming | `stream` return type; client streaming: `stream` param    |
| Interceptors     | Chain for auth + logging + metrics                        |
| Error codes      | Use specific codes (NotFound, InvalidArgument, etc.)      |
| Load balancing   | L4 LB won't work; need gRPC-aware proxy or client-side LB |

---

**See also**: [API Design](./01-api-design.md) | [Microservices](./02-microservices.md) | [Resilience Patterns](./07-resilience-patterns.md)

---

## 8. gRPC vs REST vs GraphQL / So Sánh

### Q: When do you choose gRPC vs REST vs GraphQL? / Khi nào chọn gRPC, REST, GraphQL? 🟡 Mid

**A:**

| Use Case                                   | Choose             | Reason                                                              |
| ------------------------------------------ | ------------------ | ------------------------------------------------------------------- |
| Internal microservice-to-microservice      | **gRPC**           | Strong typing, streaming, multiplexing, 5–10x faster than JSON/REST |
| Public API consumed by web/mobile browsers | **REST**           | Browser support, easy to debug, widely understood                   |
| Mobile app with complex nested data needs  | **GraphQL**        | Avoid over-fetching, single endpoint, type system                   |
| Realtime bidirectional (chat, telemetry)   | **gRPC streaming** | Bidirectional streaming > WebSocket for typed protocols             |
| Simple CRUD with many clients              | **REST**           | Simplicity wins, wide tooling support                               |

Vietnamese: Rule of thumb cho phỏng vấn: **gRPC = internal backend-to-backend** (hiệu suất cao, typed contract), **REST = external API** (universal client support), **GraphQL = data-driven frontend** (mobile app muốn fetch exactly what they need). gRPC không work trực tiếp trên browser vì gRPC dùng HTTP/2 trailers (không support trong browser XHR/fetch). Muốn dùng gRPC từ browser phải có gRPC-Web proxy (Envoy).

---

### Q: How do you handle retries in gRPC? / Handle retry trong gRPC thế nào? 🔴 Senior

**A:** gRPC has built-in retry policy configurable in service config. Only retry on `UNAVAILABLE` and `RESOURCE_EXHAUSTED` — never retry `INVALID_ARGUMENT` or `NOT_FOUND` (non-transient).

```go
// Client-side retry via service config (Go)
serviceConfig := `{
  "methodConfig": [{
    "name": [{"service": "OrderService"}],
    "retryPolicy": {
      "maxAttempts": 4,
      "initialBackoff": "0.1s",
      "maxBackoff": "1s",
      "backoffMultiplier": 2,
      "retryableStatusCodes": ["UNAVAILABLE"]
    }
  }]
}`
conn, _ := grpc.Dial(addr,
  grpc.WithDefaultServiceConfig(serviceConfig),
)
```

Vietnamese: gRPC retry policy quan trọng cần biết: (1) Chỉ retry **idempotent operations** hoặc operations có retry-safe guarantee. (2) `UNAVAILABLE` = server unavailable → safe to retry. `RESOURCE_EXHAUSTED` = rate limit → retry sau backoff. `DEADLINE_EXCEEDED` = timeout → thường không nên retry (đã hết deadline). (3) Hedged requests: gửi request đến multiple backends đồng thời, lấy response đầu tiên — tradeoff: server load vs latency tail reduction. Dùng cho read-only operations trong low latency systems.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                       | Difficulty | Core Concept        | Key Signal                                                          |
| --- | ---------------------------------------------- | ---------- | ------------------- | ------------------------------------------------------------------- |
| Q1  | When would you choose gRPC over REST?          | 🟡 Mid     | gRPC vs REST        | payload size + HTTP/2 multiplexing + type safety vs browser support |
| Q2  | Write a protobuf definition for a user service | 🟢→🔴      | Protobuf Schema     | field numbers never change + reserved + backward compatibility      |
| Q3  | Implement a gRPC server and client in Go       | 🟡 Mid     | gRPC Implementation | protoc codegen + server registration + client dial + context        |
| Q4  | How do you add auth, logging, metrics to gRPC? | 🟢→🔴      | Interceptors        | unary + stream interceptors + chain order + metadata propagation    |
| Q5  | How do gRPC status codes map to HTTP?          | 🟡 Mid     | Error Handling      | specific codes + error details + retry decision based on code type  |
| Q6  | How does gRPC handle load balancing?           | 🔴 Senior  | Load Balancing      | L4 LB fails with HTTP/2 + client-side round_robin + Envoy L7        |
| Q7  | What is gRPC reflection?                       | 🟡 Mid     | Debugging           | runtime service discovery + grpcurl + disable in prod               |
| Q8  | When gRPC vs REST vs GraphQL?                  | 🟡 Mid     | Architecture        | internal=gRPC, external=REST, data-driven frontend=GraphQL          |
| Q9  | How do you handle retries in gRPC?             | 🔴 Senior  | Retry & Resilience  | service config policy + retryable status codes + hedging + deadline |

**Distribution:** 🟢→🔴 2 | 🟡 5 | 🔴 2

---

## ⚡ Cold Call Simulation / Mô Phỏng Cold Call

**Scenario:** "Your gRPC microservice has extremely uneven CPU usage across pods — one pod at 90%, others at 5%. What's happening?"

**30-Second Answer:**
"This is the classic HTTP/2 + L4 load balancer problem. gRPC uses HTTP/2, which multiplexes all RPC calls over a single TCP connection. If we're using a TCP-mode load balancer like AWS NLB, it sees one connection and routes ALL traffic to one backend pod. Fix: switch to either client-side load balancing with `round_robin` policy in the gRPC service config, or use an L7 proxy like Envoy that understands HTTP/2 frames and can distribute per-RPC. In Kubernetes, Istio's Envoy sidecar handles this automatically."

**Follow-up:** "How would you propagate deadlines across a chain of 5 gRPC services?"
→ "Context deadline propagation: the originating client sets a 3-second deadline. Each hop subtracts elapsed time — if 1s used, 2s remaining is propagated. Each service checks `ctx.Err()` before starting expensive work. If deadline already exceeded, return `DEADLINE_EXCEEDED` immediately instead of doing wasted computation. This prevents cascading timeouts."

---

## Self-Check / Tự Kiểm Tra

**Instructions:** Cover the answers, try to recall from memory. Check key points after.

| #   | Question                                              | Key Points to Recall                                                                          |
| --- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | Why is protobuf binary smaller than JSON?             | Field numbers (1-2 bytes) vs field names (N bytes) + no whitespace + varint encoding          |
| 2   | Name 4 gRPC streaming patterns with use cases         | Unary (CRUD), Server streaming (feed), Client streaming (upload), Bidirectional (chat)        |
| 3   | Why does HTTP/2 multiplexing break L4 load balancing? | One TCP connection = one L4 routing decision → all RPCs to one backend                        |
| 4   | Which gRPC status codes should trigger retry?         | UNAVAILABLE (transient) + RESOURCE_EXHAUSTED (rate limit). Never: INVALID_ARGUMENT, NOT_FOUND |
| 5   | How does protobuf achieve backward compatibility?     | Add new fields freely + never change/reuse field numbers + use `reserved` for deleted fields  |
| 6   | Why interceptor order matters?                        | Auth must run before logging/metrics → reject before recording + metadata must exist          |
| 7   | What is hedging and when to use it?                   | Send to multiple backends, take first response → reduces p99 → only for read-only operations  |

### 📅 Spaced Repetition Schedule

| Round | When   | Focus                                                             |
| ----- | ------ | ----------------------------------------------------------------- |
| 1     | Day 1  | Read all Memory Hooks, redraw Concept Map                         |
| 2     | Day 3  | Answer Self-Check from memory, review Common Mistakes             |
| 3     | Day 7  | Cold Call practice, explain gRPC vs REST to a friend              |
| 4     | Day 14 | Full Interview Q&A walkthrough, write .proto + server from memory |
| 5     | Day 30 | Review only what you got wrong in Round 4                         |

---

## Connections / Liên Kết

**Same-track links:**

- ⬅️ [API Design](./01-api-design.md) — REST vs gRPC is a core API design decision
- ⬅️ [Microservices](./02-microservices.md) — gRPC is standard for internal service communication
- ⬅️ [Networking for Go](./06-networking-go.md) — HTTP/2 and TLS fundamentals underpin gRPC
- ➡️ [Resilience Patterns](./07-resilience-patterns.md) — Circuit breaker complements gRPC retry policy
- ➡️ [Message Queues](./08-message-queues.md) — Sync (gRPC) vs async (MQ) communication trade-off

**Cross-track links:**

- 🔗 [Distributed Patterns](../04-be-system-design/04-distributed-patterns.md) — gRPC bidirectional streaming for real-time patterns
- 🔗 [Go Concurrency](../01-golang/03-concurrency.md) — Context and deadline propagation patterns
- 🔗 [Auth & Security](./04-auth-security.md) — mTLS and JWT interceptor patterns for gRPC
