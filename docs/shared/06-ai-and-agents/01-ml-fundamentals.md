# ML Fundamentals — Nền tảng Machine Learning cho Developers

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## 1. Machine Learning Overview / Tổng quan Machine Learning

### 🟢 Q: What is Machine Learning from a software engineer perspective? `[Junior]`

**A:** Machine Learning (ML) là cách viết phần mềm mà **logic được học từ dữ liệu** thay vì hard-code hoàn toàn bằng if/else.

- Với developer, ML model giống một `function` có tham số rất lớn, được tối ưu từ dữ liệu huấn luyện.
- Input: dữ liệu đặc trưng (features).
- Output: dự đoán (prediction) hoặc phân phối xác suất.
- Quy trình production thường gồm: data pipeline → training → evaluation → deployment → monitoring.
- Điểm khác biệt lớn: chất lượng phụ thuộc dữ liệu nhiều hơn phụ thuộc code thuần túy.

### 🟢 Q: What are common ML problem types? `[Junior]`

**A:** Nhóm bài toán ML phổ biến gồm supervised, unsupervised, reinforcement learning, và self-supervised/pretraining.

- **Classification:** dự đoán nhãn rời rạc (spam/not spam, fraud/not fraud).
- **Regression:** dự đoán số liên tục (giá nhà, thời gian giao hàng).
- **Clustering:** nhóm dữ liệu chưa có nhãn (user segmentation).
- **Dimensionality reduction:** nén feature, giảm nhiễu, visualize.
- **Reinforcement learning:** agent học qua trial-and-error với reward.

---

## 2. Supervised Learning / Học có giám sát

### 🟡 Q: How do classification and regression differ in practice? `[Mid]`

**A:** Khác biệt nằm ở **kiểu output**, hàm loss, và metric đánh giá.

- Classification trả về class/probability; dùng loss như cross-entropy.
- Regression trả về số thực; dùng loss như MSE/MAE/Huber.
- Classification quan tâm precision/recall/F1/AUC.
- Regression quan tâm RMSE/MAE/R2 và phân tích residual.
- Trong production, threshold tuning của classification rất quan trọng để match business risk.

### 🟡 Q: Which classic supervised algorithms should developers know? `[Mid]`

**A:** Bạn không cần derivation toán sâu, nhưng cần biết khi nào dùng mỗi họ thuật toán.

- **Linear/Logistic Regression:** baseline mạnh, dễ giải thích, train nhanh.
- **Decision Tree / Random Forest:** robust với dữ liệu tabular, ít feature engineering hơn.
- **Gradient Boosting (XGBoost/LightGBM/CatBoost):** thường SOTA cho tabular structured data.
- **SVM:** hiệu quả với dataset vừa phải, margin rõ, nhưng khó scale rất lớn.
- **k-NN:** trực quan nhưng inference chậm với dữ liệu lớn nếu không có index.

### 🟢 Q: Why is baseline model important? `[Junior]`

**A:** Baseline giúp team có mốc tham chiếu trước khi dùng mô hình phức tạp.

- Baseline tốt: rule-based đơn giản hoặc logistic regression.
- Nếu model mới không vượt baseline với chi phí hợp lý, không nên ship.
- Baseline còn giúp debug data leakage vì pipeline phức tạp dễ overfit giả tạo.
- Trong interview, nói rõ baseline thể hiện tư duy thực chiến và kiểm soát rủi ro.

---

## 3. Unsupervised Learning / Học không giám sát

### 🟡 Q: What is clustering and when do we use it? `[Mid]`

**A:** Clustering là nhóm các điểm dữ liệu tương tự nhau khi chưa có nhãn ground truth.

- Ứng dụng: customer segmentation, anomaly pre-analysis, topic discovery.
- **K-Means:** nhanh, cần chọn K, giả định cụm dạng cầu.
- **DBSCAN/HDBSCAN:** tìm cụm mật độ, bắt outlier tốt, không cần K cố định.
- **Hierarchical clustering:** hữu ích khi cần cây phân cấp cụm để giải thích.
- Đánh giá nội bộ bằng silhouette score, Davies-Bouldin, hoặc utility theo business task.

### 🟡 Q: What is dimensionality reduction? `[Mid]`

**A:** Dimensionality reduction giảm số chiều feature nhưng vẫn giữ thông tin quan trọng.

- **PCA:** tuyến tính, giữ phương sai lớn nhất, thường dùng trước mô hình cổ điển.
- **t-SNE/UMAP:** phi tuyến, tốt cho visualization 2D/3D của embedding.
- Lợi ích: giảm overfitting, tăng tốc train/inference, giảm noise.
- Rủi ro: mất interpretability và có thể làm hỏng tín hiệu hiếm.

---

## 4. Reinforcement Learning Basics / Cơ bản về RL

### 🟢 Q: What are agent, environment, state, action, reward in RL? `[Junior]`

**A:** RL mô hình hóa quyết định tuần tự dưới dạng vòng lặp tương tác.

- **Agent:** tác nhân ra quyết định.
- **Environment:** thế giới phản hồi lại hành động.
- **State:** mô tả tình trạng hiện tại.
- **Action:** lựa chọn của agent tại mỗi bước.
- **Reward:** tín hiệu phản hồi để học policy tối ưu dài hạn.
- Mục tiêu là tối đa tổng reward kỳ vọng, không chỉ reward tức thời.

### 🟡 Q: How does exploration vs exploitation work? `[Mid]`

**A:** Agent phải cân bằng giữa thử cái mới và tận dụng lựa chọn đang tốt.

- **Exploration:** thử action chưa chắc tốt để học thêm thông tin.
- **Exploitation:** chọn action đã biết cho reward cao.
- Chiến lược phổ biến: epsilon-greedy, softmax policy, UCB.
- Trong production, exploration quá mạnh có thể gây trải nghiệm xấu cho user.

---

## 5. Neural Networks / Mạng nơ-ron

### 🟢 Q: What is a perceptron? `[Junior]`

**A:** Perceptron là đơn vị cơ bản: tính tổng có trọng số rồi qua activation.

- Công thức: `y = activation(w·x + b)`.
- Một perceptron chỉ tách tuyến tính (linear separable).
- Mạng nhiều lớp (MLP) cho phép học biên quyết định phi tuyến.
- Developer nên xem nó như block xây dựng của deep learning.

```python
# Python pseudocode: single perceptron
def perceptron(x, w, b):
    z = sum(x_i * w_i for x_i, w_i in zip(x, w)) + b
    return 1 if z > 0 else 0
```

### 🟡 Q: Why do activation functions matter? `[Mid]`

**A:** Activation tạo phi tuyến; nếu không có nó, nhiều layer vẫn chỉ là linear map.

- **ReLU/GELU:** phổ biến trong deep nets hiện đại.
- **Sigmoid:** output 0-1, hợp logistic nhưng dễ gradient vanishing.
- **Tanh:** centered quanh 0, đôi khi ổn hơn sigmoid.
- Chọn activation ảnh hưởng tốc độ hội tụ và ổn định train.

### 🔴 Q: Explain backpropagation in engineer-friendly terms. `[Senior]`

**A:** Backpropagation là cơ chế tính gradient cho từng tham số bằng chain rule.

- Forward pass: tính prediction và loss.
- Backward pass: truyền lỗi ngược để biết tham số nào cần điều chỉnh bao nhiêu.
- Optimizer (SGD/Adam) dùng gradient để cập nhật trọng số.
- Nhìn theo software: giống auto-diff tạo computational graph rồi tự tính đạo hàm.
- Bạn không cần tự code đạo hàm tay trong production, framework làm phần đó.

---

## 6. Deep Learning vs Traditional ML / Deep Learning và ML truyền thống

### 🟡 Q: When should we use traditional ML instead of deep learning? `[Mid]`

**A:** Dữ liệu tabular vừa/nhỏ, cần interpretability cao, hoặc compute hạn chế thì model truyền thống thường thắng.

- Gradient Boosting thường cực mạnh cho tabular business data.
- Deep learning phù hợp dữ liệu unstructured lớn: text, image, audio, video.
- Nếu latency/cost cực chặt, model đơn giản + feature engineering có thể tối ưu hơn.
- Interview tip: luôn nói theo bài toán, dữ liệu, SLO, và ngân sách.

### 🔴 Q: How do you compare model choices at system level? `[Senior]`

**A:** Đừng chỉ so accuracy; hãy so tổng thể **quality + reliability + cost + compliance**.

- Chất lượng: offline metrics + online business metrics.
- Hiệu năng: p95 latency, throughput, memory footprint.
- Vận hành: retraining cadence, monitoring, on-call burden.
- Rủi ro: fairness, explainability, security, data governance.
- Chọn mô hình có ROI tốt nhất, không phải mô hình “ngầu” nhất.

---

## 7. Training Concepts / Khái niệm huấn luyện

### 🟢 Q: What are loss function, gradient descent, learning rate, epoch, and batch size? `[Junior]`

**A:** Đây là bộ từ vựng cốt lõi khi training model.

- **Loss:** sai số giữa prediction và ground truth.
- **Gradient descent:** thuật toán giảm loss bằng cách đi theo hướng âm của gradient.
- **Learning rate:** bước nhảy mỗi lần cập nhật tham số.
- **Epoch:** một vòng đi hết dataset train.
- **Batch size:** số mẫu xử lý mỗi bước cập nhật.
- Tuning sai learning rate là lý do phổ biến khiến mô hình không hội tụ.

### 🟡 Q: Why do we use mini-batch training? `[Mid]`

**A:** Mini-batch cân bằng giữa stability của full-batch và tốc độ của stochastic training.

- Batch quá nhỏ: gradient noisy, train rung lắc.
- Batch quá lớn: tốn memory, có thể tổng quát hóa kém hơn.
- Trong GPU/TPU, batch size còn phụ thuộc VRAM và throughput kernel.
- Thực tế cần tune batch cùng learning rate scheduler.

---

## 8. Overfitting and Underfitting / Quá khớp và thiếu khớp

### 🟢 Q: What is overfitting and underfitting? `[Junior]`

**A:** Overfitting: model học cả noise nên train tốt nhưng test kém; underfitting: model quá đơn giản nên cả train/test đều kém.

- Dấu hiệu overfitting: train loss giảm sâu, validation loss tăng.
- Dấu hiệu underfitting: cả train/val đều cao và plateau sớm.
- Cần theo dõi learning curves để chẩn đoán.
- Giải pháp phụ thuộc nguyên nhân (data, model capacity, regularization).

### 🟡 Q: How do regularization, dropout, and cross-validation help? `[Mid]`

**A:** Các kỹ thuật này giúp mô hình tổng quát hóa tốt hơn trên dữ liệu chưa thấy.

- **L1/L2 regularization:** phạt trọng số lớn, giảm độ phức tạp hiệu dụng.
- **Dropout:** tắt ngẫu nhiên neuron lúc train để tránh phụ thuộc cục bộ.
- **Early stopping:** dừng khi val metric ngừng cải thiện.
- **Cross-validation:** đánh giá ổn định hơn khi dữ liệu hạn chế.

---

## 9. Transfer Learning and RLHF / Transfer Learning và RLHF

### 🟢 Q: What is transfer learning? `[Junior]`

**A:** Transfer learning là tái sử dụng model đã pre-train trên dữ liệu lớn cho task mới.

- Bước phổ biến: load pre-trained checkpoint → thêm head task-specific → fine-tune.
- Lợi ích: giảm data cần thu thập, giảm thời gian train.
- Đặc biệt hiệu quả với NLP và computer vision.
- Rủi ro: domain mismatch gây giảm chất lượng nếu dữ liệu đích quá khác.

### 🔴 Q: Explain RLHF in simple but accurate terms. `[Senior]`

**A:** RLHF (Reinforcement Learning from Human Feedback) dùng phản hồi người để align model với kỳ vọng an toàn/hữu ích.

- B1: pretrain model dự đoán token trên corpora lớn.
- B2: thu thập cặp output được human preference ranking.
- B3: train reward model để ước lượng “con người thích output nào”.
- B4: tối ưu policy model (thường PPO hoặc biến thể) theo reward model + penalty lệch xa base model.
- Kết quả: model trả lời “hợp ý người dùng” hơn nhưng cần guard để tránh over-optimization.

---

## 10. Evaluation Metrics / Chỉ số đánh giá

### 🟢 Q: How do accuracy, precision, recall, F1, and AUC differ? `[Junior]`

**A:** Không có metric “đúng cho mọi bài toán”; phải chọn theo cost của false positives/false negatives.

- **Accuracy:** đúng tổng thể, nhưng dễ gây ảo giác với dữ liệu lệch lớp.
- **Precision:** trong các mẫu dự đoán positive, bao nhiêu mẫu đúng.
- **Recall:** trong các mẫu positive thật, model bắt được bao nhiêu.
- **F1:** trung bình điều hòa precision/recall, cân bằng hai phía.
- **AUC-ROC:** khả năng phân biệt lớp trên mọi threshold.

### 🔴 Q: How would you pick a metric for fraud detection? `[Senior]`

**A:** Fraud thường là class imbalance nặng, nên accuracy gần như vô nghĩa.

- Nếu miss fraud rất đắt: ưu tiên recall cao, chấp nhận precision thấp hơn có kiểm soát.
- Nếu review thủ công tốn tiền: cần precision đủ cao để không quá tải đội điều tra.
- Dùng PR-AUC và cost-sensitive thresholding thay vì chỉ ROC-AUC.
- Cuối cùng tối ưu theo business utility: expected loss saved per 1,000 transactions.

---

## 11. Python Pseudocode Walkthrough / Pseudocode Python cho vòng đời ML

### 🟡 Q: Can you outline a minimal ML pipeline in Python pseudocode? `[Mid]`

**A:** Đây là skeleton đủ để giải thích end-to-end trong interview kỹ thuật.

- Tách train/validation/test rõ ràng để tránh data leakage.
- Fit scaler trên train rồi transform val/test.
- Log metric theo version model và dataset hash.
- Lưu model artifact + metadata để reproducibility.

```python
# Python pseudocode: simple supervised training loop
X_train, X_val, y_train, y_val = split_data(data, seed=42)
scaler = StandardScaler().fit(X_train)
X_train_s = scaler.transform(X_train)
X_val_s = scaler.transform(X_val)
model = GradientBoostingClassifier(max_depth=4, n_estimators=300)
model.fit(X_train_s, y_train)
val_prob = model.predict_proba(X_val_s)[:, 1]
threshold = tune_threshold(val_prob, y_val, objective='expected_cost')
save_artifact(model, scaler, threshold, metrics={'f1': f1_score(y_val, val_prob > threshold)})
```

---

## 12. Câu Hỏi Phỏng Vấn / Interview Q&A Bank

> Tổng Quan: Phần này tổng hợp các câu hỏi thường gặp. Giải thích bằng tiếng Việt kèm Ví dụ thực tế.

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #1? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #2? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #3? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #4? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #5? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #6? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #7? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #8? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #9? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #10? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #11? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #12? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #13? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #14? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #15? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #16? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #17? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #18? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #19? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #20? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #21? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #22? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #23? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #24? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #25? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #26? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #27? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #28? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #29? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #30? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #31? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #32? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #33? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #34? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #35? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #36? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #37? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #38? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #39? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #40? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #41? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #42? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #43? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #44? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #45? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #46? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #47? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #48? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #49? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #50? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #51? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #52? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #53? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #54? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #55? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #56? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #57? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #58? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #59? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in ML fundamentals scenario #60? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in ML fundamentals scenario #61? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in ML fundamentals scenario #62? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: What is the difference between supervised, unsupervised, and reinforcement learning? / Phân biệt supervised, unsupervised, reinforcement learning? 🟢 Junior

**A:** Three major ML paradigms:

```
Supervised Learning
├── Training data: labeled (X → Y)
├── Goal: learn mapping function f(X) ≈ Y
├── Examples: classification (spam), regression (price prediction)
└── Algorithms: linear regression, SVM, neural nets, decision trees

Unsupervised Learning
├── Training data: unlabeled (X only)
├── Goal: discover hidden structure/patterns
├── Examples: clustering customers, dimensionality reduction, anomaly detection
└── Algorithms: K-Means, DBSCAN, PCA, autoencoders

Reinforcement Learning
├── Training data: environment feedback (reward/penalty)
├── Goal: learn policy to maximize cumulative reward
├── Examples: game playing (AlphaGo), robotics, recommendation systems
└── Algorithms: Q-learning, PPO, A3C
```

**Khi nào dùng loại nào:**
- **Supervised**: bạn có labeled data và rõ ràng output mong muốn (most production ML)
- **Unsupervised**: không có labels, muốn khám phá cấu trúc dữ liệu (customer segmentation)
- **Reinforcement**: tối ưu hóa sequential decisions với delayed reward (game AI, trading bots)

### Q: What is overfitting and how do you prevent it? / Overfitting là gì và cách phòng tránh? 🟡 Mid

**A:** Overfitting = model learns training data too well, including noise, and fails to generalize.

```
        Training Loss     Validation Loss
Underfit:  ████████████     ████████████   (both high — model too simple)
Good fit:  ████             ████           (both low — generalizes well)
Overfit:   ██               ████████████   (train low, val high — memorized)
```

**Prevention techniques:**
```
1. Regularization
   - L1 (Lasso): adds |weights| penalty → sparse weights (feature selection)
   - L2 (Ridge): adds weights² penalty → small weights (all features kept)
   - Dropout (neural nets): randomly zero out neurons during training

2. Cross-validation
   - K-Fold: split data into K folds, train on K-1, validate on 1, rotate
   - Prevents lucky/unlucky train-val splits

3. More data
   - Data augmentation: flip, rotate, crop images; back-translation for text
   - Synthetic data generation

4. Early stopping
   - Monitor validation loss, stop when it starts increasing

5. Simpler model
   - Reduce model capacity (fewer layers, smaller tree depth)
   - Feature selection / dimensionality reduction
```

**Bias-Variance Tradeoff:**
- High bias = underfitting (model too simple, wrong assumptions)
- High variance = overfitting (model too complex, too sensitive to training data)
- Goal: find sweet spot where bias + variance is minimized

**Cách giải thích trong phỏng vấn:** Overfitting là khi model "học thuộc lòng" training set thay vì học quy luật tổng quát. Giải pháp chính là regularization, more data, và cross-validation. Trade-off cơ bản là bias vs variance.

### Q: Explain gradient descent and its variants / Giải thích gradient descent và các biến thể? 🟡 Mid

**A:** Gradient descent = optimization algorithm that iteratively updates model parameters to minimize loss.

```python
# Conceptual gradient descent
θ = θ - α * ∇L(θ)
# θ = parameters, α = learning rate, ∇L = gradient of loss

# Three variants:
# 1. Batch GD: use ALL training examples per update
#    - Stable, but slow for large datasets
# 2. Stochastic GD (SGD): use 1 example per update  
#    - Fast, noisy, can escape local minima
# 3. Mini-batch GD: use small batch (32-256) per update
#    - Best of both worlds — most commonly used in practice
```

**Modern optimizers:**
```
SGD with Momentum
├── Accumulate velocity in gradient direction
├── Dampens oscillations, accelerates convergence
└── θ = θ - v; v = β*v + α*∇L

Adam (Adaptive Moment Estimation)
├── Combines momentum + adaptive learning rates
├── Maintains per-parameter moving avg of gradients and squared gradients
├── Default choice for most deep learning
└── m = β1*m + (1-β1)*∇L; v = β2*v + (1-β2)*∇L²; θ = θ - α*m/√v
```

**Learning rate intuition:**
- Too high → diverge (loss explodes)
- Too low → slow convergence, stuck in local minima
- Learning rate schedules: warmup → decay (cosine, step, exponential)

**Điểm quan trọng cho phỏng vấn:** Mini-batch GD + Adam optimizer là default trong deep learning. Hiểu learning rate scheduling (warmup + decay) rất quan trọng khi train LLMs.

### Q: What are precision, recall, and F1? When to prioritize which? / Khi nào ưu tiên precision vs recall? 🟡 Mid

**A:**

```
Confusion Matrix:
                  Predicted Positive    Predicted Negative
Actual Positive:  TP (True Positive)    FN (False Negative)
Actual Negative:  FP (False Positive)   TN (True Negative)

Precision = TP / (TP + FP)
├── "Of all predicted positives, how many are actually positive?"
└── Minimize: cost of false alarm (spam filter incorrectly flagging legit email)

Recall = TP / (TP + FN)
├── "Of all actual positives, how many did we catch?"
└── Minimize: cost of missing positives (cancer detection missing real cases)

F1 = 2 * (Precision * Recall) / (Precision + Recall)
└── Harmonic mean — balanced when both matter equally
```

**Decision framework:**
```
High Recall priority (low FN):
├── Medical diagnosis (missing cancer = fatal)
├── Fraud detection (missing fraud = financial loss)
└── Security threat detection

High Precision priority (low FP):
├── Spam filtering (blocking legit email = annoying)
├── Legal document retrieval (irrelevant docs waste time)
└── Product recommendation (irrelevant recs hurt UX)

Both matter → F1 score
Imbalanced classes → use AUC-ROC (threshold-independent)
```

**Cách nhớ:** Precision = khi bạn nói "yes", bạn đúng bao nhiêu %. Recall = trong tất cả cái thực sự "yes", bạn tìm được bao nhiêu. Medical domain thường ưu tiên recall (không bỏ sót bệnh nhân thật sự bệnh).

### Q: What is the difference between bagging and boosting? / Sự khác biệt giữa bagging và boosting? 🔴 Senior

**A:** Both are ensemble methods combining multiple weak learners, but different strategies:

```
Bagging (Bootstrap AGGregating)
├── Train models in PARALLEL on random subsets of data
├── Each model independent, votes equally (majority/average)
├── Reduces VARIANCE (overfitting)
├── Example: Random Forest
│   └── N decision trees on bootstrap samples + random feature subsets
└── Best for: high-variance, low-bias base models (deep trees)

Boosting
├── Train models SEQUENTIALLY, each correcting previous errors
├── Later models focus more on misclassified examples (higher weights)
├── Reduces BIAS (underfitting)
├── Examples: AdaBoost, Gradient Boosting, XGBoost, LightGBM
│   └── XGBoost: gradient descent in function space, regularized, fast
└── Best for: high-bias, low-variance base models (shallow trees)

Comparison:
         Bagging          Boosting
Speed:   Parallelizable   Sequential (slower)
Overfit: Resistant        Can overfit (tune iterations, learning rate)
Noise:   More robust      Sensitive to outliers
SOTA:    Random Forest    XGBoost/LightGBM (Kaggle winner baseline)
```

**XGBoost vs LightGBM:**
- XGBoost: level-wise tree growth, more regularization options
- LightGBM: leaf-wise growth (faster), better on large datasets
- CatBoost: handles categorical features natively

**Điểm senior cần biết:** Boosting thường outperform bagging trên structured/tabular data. XGBoost là baseline default cho nhiều competition. Ensemble methods quan trọng hơn deep learning cho tabular data ở production.
