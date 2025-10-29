# Version Control with Git / Kiểm Soát Phiên Bản Với Git
## Tools & Ecosystem - Chapter 3 / Công Cụ & Hệ Sinh Thái - Chương 3

[Back to Table of Contents](../00-table-of-contents.md)

---

## Essential Git Commands

```bash
# Initialize repository / Khởi tạo repository
git init

# Clone repository / Sao chép repository
git clone https://github.com/user/repo.git

# Check status / Kiểm tra trạng thái
git status

# Add files / Thêm file
git add .
git add file.txt

# Commit changes / Commit thay đổi
git commit -m "Add feature"

# Push to remote / Đẩy lên remote
git push origin main

# Pull from remote / Kéo từ remote
git pull origin main

# Create branch / Tạo nhánh
git branch feature-name
git checkout -b feature-name

# Merge branch / Trộn nhánh
git checkout main
git merge feature-name

# Rebase / Rebase
git rebase main

# Stash changes / Cất giữ thay đổi
git stash
git stash pop

# View history / Xem lịch sử
git log
git log --oneline --graph
```

## Git Workflow

```
main (production)
  ↓
develop (integration)
  ↓
feature/new-feature (development)
```

## Commit Message Convention

```
feat: Add user authentication
fix: Resolve login bug
docs: Update README
style: Format code
refactor: Restructure components
test: Add unit tests
chore: Update dependencies
```

---

[Back to Table of Contents](../00-table-of-contents.md)
