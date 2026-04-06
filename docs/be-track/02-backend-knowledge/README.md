# Backend Knowledge / Kiến Thức Backend

> Navigation index for backend systems interview preparation materials.
> Mục lục cho tài liệu chuẩn bị phỏng vấn kiến thức hệ thống backend.

## Files / Tài Liệu

| #   | File                                                     | Topic / Chủ Đề                                                                                |
| --- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | [01-api-design.md](./01-api-design.md)                   | REST, GraphQL, API versioning, contracts / REST, GraphQL, versioning API, hợp đồng API        |
| 2   | [02-microservices.md](./02-microservices.md)             | Service decomposition, communication, patterns / Phân tách service, giao tiếp, các pattern    |
| 3   | [03-distributed-systems.md](./03-distributed-systems.md) | CAP theorem, consensus, replication / Định lý CAP, đồng thuận, nhân bản dữ liệu               |
| 4   | [04-auth-security.md](./04-auth-security.md)             | Authentication, authorisation, JWT, OAuth2 / Xác thực, phân quyền, JWT, OAuth2                |
| 5   | [05-os-go.md](./05-os-go.md)                             | OS concepts relevant to Go services / Khái niệm hệ điều hành liên quan tới Go service         |
| 6   | [06-networking-go.md](./06-networking-go.md)             | TCP/IP, HTTP internals, connections in Go / TCP/IP, HTTP nội bộ, kết nối trong Go             |
| 7   | [07-resilience-patterns.md](./07-resilience-patterns.md) | Circuit breaker, retry, bulkhead, timeout / Circuit breaker, retry, bulkhead, timeout         |
| 8   | [08-message-queues.md](./08-message-queues.md)           | Kafka, RabbitMQ, async messaging patterns / Kafka, RabbitMQ, các pattern nhắn tin bất đồng bộ |
| 9   | [09-grpc-protobuf.md](./09-grpc-protobuf.md)             | gRPC fundamentals, Protobuf, streaming / Nền tảng gRPC, Protobuf, streaming                   |

## Study Order / Thứ Tự Học

1. Start with API design — the foundation of any backend service / Bắt đầu với thiết kế API — nền tảng của mọi backend service
2. Then OS & networking internals to understand what happens under the hood / Tiếp theo là OS & networking để hiểu cơ chế bên dưới
3. Auth & security — required knowledge for every production system / Xác thực & bảo mật — kiến thức bắt buộc cho mọi hệ thống production
4. Distributed systems theory before tackling microservices / Lý thuyết hệ thống phân tán trước khi học microservices
5. Microservices architecture and decomposition patterns / Kiến trúc microservices và các pattern phân tách
6. Resilience patterns to handle failures gracefully / Các pattern chịu lỗi để xử lý sự cố
7. Message queues for async and event-driven design / Message queue cho thiết kế bất đồng bộ và hướng sự kiện
8. Finish with gRPC & Protobuf for modern service communication / Kết thúc với gRPC & Protobuf cho giao tiếp service hiện đại

## Related / Liên Quan

- [01-golang/](../01-golang/) - Go language features that power these backend patterns / Tính năng Go hỗ trợ các pattern backend
- [03-database-advanced/](../03-database-advanced/) - Database tier in backend architectures / Tầng database trong kiến trúc backend
- [04-be-system-design/](../04-be-system-design/) - Applying backend knowledge to system design problems / Áp dụng kiến thức backend vào bài toán system design
- [CS Fundamentals](../../shared/01-cs-fundamentals/) - Underlying computer science theory / Lý thuyết khoa học máy tính nền tảng
- [System Design](../../shared/02-system-design/) - Cross-track system design principles / Nguyên tắc system design chung
- [Behavioral](../../shared/09-behavioral/) - Situational questions tied to backend experience / Câu hỏi tình huống gắn với kinh nghiệm backend
