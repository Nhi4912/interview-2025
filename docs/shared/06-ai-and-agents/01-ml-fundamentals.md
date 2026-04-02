# ML Fundamentals — Nền tảng Machine Learning cho Developers

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VinAI churn prediction model:** Đội data science build model predict customer churn. Training accuracy: 95%. Production 2 tuần sau: accuracy 60%. Root cause: training data từ tháng 1-6, deploy tháng 8 — mùa hè users có behavior khác (data drift). Fix: retrain weekly với sliding window, monitor feature distribution. Lesson: accuracy on test set ≠ accuracy in production.

**Bài học:** ML là engineering discipline với production challenges riêng: data drift, model degradation, feature skew. "ML Fundamentals" không chỉ là algorithms — là understanding failure modes.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Machine Learning giống dạy trẻ nhận biết chó: bạn cho xem 1000 ảnh (training data), trẻ học pattern. Nếu chỉ cho xem ảnh chó trắng (bias), trẻ sẽ nói chó đen không phải chó (underfitting). Nếu trẻ nhớ từng ảnh cụ thể (overfitting), không nhận ra chó thật. Training accuracy là "bài test ở nhà", production accuracy là "bài test ở trường mới".

**Why it matters:** AI/ML roles đang tăng mạnh tại Grab, VinAI, Shopee. Developer không chuyên ML được expect biết train/deploy cycle, evaluation metrics, và failure modes để collaborate với ML team.

---

## 1. Machine Learning Overview / Tổng quan Machine Learning

> 🧠 **Memory Hook:** ML như dạy em bé nhận biết "con chó" bằng cách cho xem 1000 tấm ảnh — không cần code từng quy tắc "nếu có 4 chân và lông thì là chó", máy tự học pattern từ ví dụ.

**Tại sao tồn tại? / Why does this exist?**

Nhiều bài toán thực tế quá phức tạp để viết if/else thủ công — nhận diện khuôn mặt, lọc spam, dự đoán churn đều có hàng triệu trường hợp ngoại lệ. ML giải quyết bằng cách để dữ liệu tự định nghĩa logic.
→ **Why?** Vì pattern ẩn trong dữ liệu chứa kiến thức mà con người không thể phát biểu tường minh.
→ **Why?** Vì thế giới thực có quá nhiều edge case và context — không thể enumerate thủ công đầy đủ.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Dạy trẻ nhận biết trái xoài bằng cách cho xem 500 quả xoài — không cần giải thích "phải màu vàng, hình oval, mùi thơm". Trẻ tự học pattern. ML làm y vậy: cho máy xem đủ ví dụ, máy tự rút ra quy tắc. "Training data" là các quả xoài mẫu, "model" là trí nhớ của trẻ sau khi học.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Raw Data ──► Feature Engineering ──► Model Training ──► Evaluation
   │                                        │                │
(emails,                             (learns weights    (accuracy,
 images,                              to minimize         F1, AUC)
 transactions)                          loss)
                                         │
                                    ─────▼─────
                                    Deployment
                                    + Monitoring
                                    (data drift!)
```

1. Thu thập & làm sạch dữ liệu (thường chiếm 70% thời gian)
2. Feature engineering: biến raw data thành vector số
3. Training: tối ưu tham số model để minimize loss function
4. Evaluation: đánh giá trên held-out test set
5. Deploy + monitor: production ≠ test set (data drift, concept drift)

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Chất lượng model phụ thuộc data nhiều hơn thuật toán — "garbage in, garbage out"
- Production accuracy thường thấp hơn test accuracy đáng kể (distribution shift)
- Thêm data không phải lúc nào cũng giúp — cần đúng loại data
- ML pipeline phức tạp hơn software thông thường: data versioning, model versioning, feature skew

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                  | Đúng là                                                   |
| -------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| Dùng accuracy làm metric chính với imbalanced data | 99% accuracy có thể đạt bằng cách predict majority class mãi | Dùng F1/AUC-ROC, phân tích confusion matrix               |
| Skip baseline model, nhảy thẳng vào model phức tạp | Không biết improvement thực sự bao nhiêu, khó debug          | Luôn build baseline đơn giản (logistic regression) trước  |
| Train và test trên cùng một tập dữ liệu            | Đánh giá sai — model chỉ memorize, không generalize          | Tách train/val/test nghiêm ngặt, test chỉ dùng 1 lần cuối |

**🎯 Interview Pattern:**

- Khi thấy: "Explain what ML is" hoặc "When would you use ML?"
- Nhớ đến: data → pattern → prediction, supervised/unsupervised/RL, production challenges
- Mở đầu: "From an engineering perspective, ML is learning a function from data rather than hard-coding rules. The real challenge isn't the algorithm — it's data quality and production monitoring."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CS Fundamentals](../01-cs-fundamentals/README.md)
- ➡️ Để hiểu tiếp: [Supervised Learning](#2-supervised-learning--học-có-giám-sát)

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

> 🧠 **Memory Hook:** Supervised learning như thầy giáo chấm bài có đáp án — mỗi lần em trả lời sai, thầy chỉ rõ "đáp án đúng là X", em học từ lỗi sai, dần dần làm bài mới không cần thầy.

**Tại sao tồn tại? / Why does this exist?**

Chúng ta có hàng triệu email đã được đánh nhãn spam/không-spam, hàng triệu giao dịch đã biết fraud/legitimate — tại sao không tận dụng kiến thức ẩn trong dữ liệu đó để tự động hóa quyết định?
→ **Why?** Vì rule-based systems thất bại khi pattern quá phức tạp hoặc thay đổi theo thời gian.
→ **Why?** Vì thế giới thực có quá nhiều exception để hard-code, nhưng historical data đã "encode" những exception đó.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Học sinh ôn thi với bộ đề có đáp án — làm đề, chấm điểm, xem lỗi sai, làm đề mới. Sau 1000 bài, học sinh học được pattern của "đề đúng". Supervised learning y vậy: (X = input, Y = correct label) là bộ đề có đáp án, model "ôn thi" cho đến khi predict đúng trên data mới chưa thấy.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
1. Collect labeled data: [(email_1, spam=1), (email_2, spam=0), ...]
         ↓
2. Split: 70% Train | 15% Validation | 15% Test (NEVER touch test until final eval!)
         ↓
3. Train: model learns f(X) → Y by minimizing loss on train set
   ┌─────────────────────────────────────────┐
   │  Classification: Cross-Entropy loss     │
   │  Regression:     MSE / MAE / Huber loss │
   └─────────────────────────────────────────┘
         ↓
4. Tune hyperparams on VALIDATION set (not test!)
         ↓
5. Final evaluation on TEST set (once!)
         ↓
6. Deploy → monitor for distribution drift
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Label noise (nhãn sai do human annotator mệt) làm hỏng model không kém data ít
- Class imbalance (99% negative, 1% positive) khiến model ignore minority class
- Feature leakage: dùng feature chỉ có sau khi biết kết quả — model "gian lận" trong training
- Train-production distribution shift: behavior user tháng 8 ≠ tháng 1 (xem VinAI scenario)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                    | Đúng là                                           |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------------------- |
| Đánh giá model trên training data    | Cho kết quả tốt giả tạo — model chỉ memorize   | Luôn dùng held-out test set chưa từng "nhìn thấy" |
| Fit scaler/encoder trên toàn bộ data | Data leakage từ test vào train, inflate metric | Fit scaler chỉ trên train set, transform val/test |
| Bỏ qua class imbalance               | Model predict majority class mãi, recall=0     | Dùng class_weight, SMOTE, hoặc threshold tuning   |

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi về classification/regression, spam, fraud, churn prediction
- Nhớ đến: labels required → loss function → metric phụ thuộc business cost of FP/FN
- Mở đầu: "This is a supervised learning problem. I'd frame it as classification because the output is discrete. Key question: what's the cost of false positives vs false negatives?"

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [ML Overview](#1-machine-learning-overview--tổng-quan-machine-learning)
- ➡️ Để hiểu tiếp: [Unsupervised Learning](#3-unsupervised-learning--học-không-giám-sát)

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

> 🧠 **Memory Hook:** Unsupervised learning như nhân viên mới nhận đống hồ sơ khách hàng không có nhãn — tự tìm ra nhóm "khách VIP", "khách churn", "khách tiềm năng" mà không ai chỉ trước.

**Tại sao tồn tại? / Why does this exist?**

Tạo labeled data tốn tiền và thời gian — cần human annotator chuyên môn. Với clustering/DR, ta vẫn rút được insight từ raw unlabeled data: phân nhóm khách hàng, phát hiện anomaly, compress feature space.
→ **Why?** Vì pattern tự nhiên tồn tại trong data ngay cả khi không có nhãn do con người đặt.
→ **Why?** Vì data được sinh ra bởi các quá trình có cấu trúc — hành vi người dùng, tính chất sản phẩm tạo ra cụm tự nhiên.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Sắp xếp một đống đồ chơi Lego hỗn hợp thành nhóm mà không có hướng dẫn — bạn tự nhiên nhóm theo màu sắc, hình dạng, kích thước. Đó là clustering: tìm nhóm tự nhiên mà không cần ai nói trước "nhóm nào là nhóm nào". Machine tự tìm ra cấu trúc ẩn trong data.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
K-Means Clustering:
1. Chọn K centroids ngẫu nhiên
2. Gán mỗi điểm vào centroid gần nhất
3. Cập nhật centroid = trung bình các điểm trong nhóm
4. Lặp cho đến khi không thay đổi

      Before              After K-Means (K=3)
   ○○○△△□□□             ○──Group A
   ○△△□□○△              △──Group B
   △□○○△□               □──Group C

DBSCAN (density-based): không cần chọn K trước, tìm cụm mật độ cao, bắt outlier tốt
PCA (dimensionality reduction): giữ directions of max variance, compress feature space
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- K-Means yêu cầu chọn K trước — chọn sai K cho kết quả vô nghĩa về mặt business
- Curse of dimensionality: khoảng cách Euclidean mất ý nghĩa ở không gian chiều cao
- K-Means giả định cụm hình cầu — thất bại với cụm hình dạng phức tạp (dùng DBSCAN)
- Silhouette score tốt ≠ cụm có ý nghĩa business — cần validate với domain expert

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                       | Đúng là                                                           |
| -------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| Chọn K bằng cảm tính trong K-Means           | Clusters không có ý nghĩa thực tế, unstable       | Dùng elbow method hoặc silhouette score để chọn K                 |
| Quên normalize features trước clustering     | Feature có scale lớn (giá tiền) dominate distance | StandardScaler trước, hoặc dùng distance metric phù hợp           |
| Coi cluster output là ground truth tuyệt đối | Clustering là exploratory, không có "đáp án đúng" | Kết hợp với domain expert để validate cluster có ý nghĩa business |

**🎯 Interview Pattern:**

- Khi thấy: "customer segmentation", "anomaly detection", "topic discovery", "no labels available"
- Nhớ đến: K-Means vs DBSCAN tradeoff, silhouette score, luôn validate với business
- Mở đầu: "Since we don't have labels, I'd use unsupervised clustering. My first choice would be K-Means for speed, but I'd validate K with silhouette score and run DBSCAN to catch non-spherical clusters."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Supervised Learning](#2-supervised-learning--học-có-giám-sát)
- ➡️ Để hiểu tiếp: [Reinforcement Learning Basics](#4-reinforcement-learning-basics--cơ-bản-về-rl)

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

> 🧠 **Memory Hook:** RL như dạy chó bằng bánh thưởng — ngồi xuống được kẹo, cắn chủ bị phạt, chó tự học hành xử đúng để maximize phần thưởng mà không cần ai code từng quy tắc.

**Tại sao tồn tại? / Why does this exist?**

Có những bài toán không có "đáp án đúng" cố định để học — trong game cờ vua, quyết định tốt nhất phụ thuộc vào hàng triệu tình huống tiếp theo. RL cho phép agent học policy qua trial-and-error với feedback từ môi trường.
→ **Why?** Vì action tối ưu phụ thuộc vào future states, không chỉ current state — cần maximize cumulative reward.
→ **Why?** Vì maximize short-term reward thường dẫn đến sub-optimal long-term outcome (đi xe nhanh để đến sớm nhưng gây tai nạn).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Học chơi cờ vua — không ai đưa cho bạn "bộ đề có đáp án" cho từng nước đi. Bạn chơi nhiều ván, thắng/thua, và dần nhận ra pattern nào dẫn đến chiến thắng. Reward (thắng=+1, thua=-1) đến cuối game mới biết. RL agent học theo cách này: thử, nhận feedback, điều chỉnh chiến lược.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌─────────────────────────────────────────────────┐
│                  RL Loop                        │
│                                                 │
│  Agent observes State (s_t)                     │
│       ↓                                         │
│  Policy π(s_t) → selects Action (a_t)           │
│       ↓                                         │
│  Environment transitions to State (s_{t+1})     │
│       ↓                                         │
│  Agent receives Reward (r_t)                    │
│       ↓                                         │
│  Update policy to maximize Σ γ^t * r_t          │
│  (γ = discount factor, values future rewards)   │
└─────────────────────────────────────────────────┘

Key strategies:
  ε-greedy: explore random action with prob ε, exploit best known (1-ε)
  UCB: explore actions with high uncertainty
  PPO: modern policy gradient, used in RLHF for LLMs
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Sparse reward: reward chỉ ở cuối game → học rất chậm (credit assignment problem)
- Reward hacking: agent tìm cách "gian lận" để maximize reward theo cách không mong muốn
- Real-world RL nguy hiểm hơn simulation — bad action có thể affect real users
- Exploration quá mạnh trong production gây trải nghiệm xấu cho user thật

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                | Tại sao sai                                       | Đúng là                                                        |
| ------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------- |
| Chỉ dùng reward tức thời (greedy policy)               | Bỏ qua hệ quả dài hạn, local optimum              | Dùng discounted future reward với γ (gamma discount factor)    |
| Bỏ qua exploration khi deploy                          | Agent không bao giờ học được cách mới tốt hơn     | Duy trì ε nhỏ để thỉnh thoảng thử action mới                   |
| Deploy RL agent trực tiếp lên production chưa converge | Agent chưa học xong có thể gây hại cho users thật | Test trong simulation → A/B test nhỏ → rollout dần có giám sát |

**🎯 Interview Pattern:**

- Khi thấy: recommendation systems, ad bidding, robotics, game AI, RLHF
- Nhớ đến: agent-environment loop, exploration vs exploitation, reward design là trọng tâm
- Mở đầu: "This is a sequential decision problem — RL applies. The critical design question is: how do we define the reward function to capture what we actually want the business to optimize?"

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Supervised Learning](#2-supervised-learning--học-có-giám-sát)
- ➡️ Để hiểu tiếp: [Neural Networks](#5-neural-networks--mạng-nơ-ron)

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

> 🧠 **Memory Hook:** Neural network như nhà máy chế biến có nhiều công đoạn — mỗi công nhân (neuron) làm một việc nhỏ rất đơn giản, nhưng cộng nhiều tầng lại tạo ra sản phẩm phức tạp mà không công nhân nào hiểu toàn bộ.

**Tại sao tồn tại? / Why does this exist?**

Linear models chỉ học được đường thẳng phân chia class — không thể nhận ra khuôn mặt hay dịch ngôn ngữ. Neural networks stack nhiều lớp phi tuyến để học được function cực kỳ phức tạp từ raw data.
→ **Why?** Vì mỗi layer học một mức representation trừu tượng hơn — pixel → cạnh → mắt → khuôn mặt.
→ **Why?** Vì composition của các hàm đơn giản có thể xấp xỉ bất kỳ hàm liên tục nào (Universal Approximation Theorem).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Dây chuyền phân loại xoài: công nhân tầng 1 kiểm tra màu sắc, tầng 2 kiểm tra kích thước và độ cứng, tầng 3 kiểm tra mùi, tầng 4 tổng hợp để quyết định "xoài hạng A/B/C". Không công nhân nào tự làm được một mình, nhưng dây chuyền kết hợp cho ra quyết định chính xác hơn chuyên gia đơn lẻ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Input         Hidden-L1       Hidden-L2        Output
  [x1] ──┐       [h1] ──┐        [h4] ──┐
  [x2] ──┼──w──▶ [h2] ──┼──w──▶  [h5] ──┼──w──▶ [ŷ]
  [x3] ──┘       [h3] ──┘
              (ReLU activation) (ReLU activation) (Sigmoid)

Each node: z = Σ(w_i * x_i) + b
           output = activation(z)

Training via Backpropagation:
  Forward pass  → compute loss L(ŷ, y_true)
  Backward pass → compute ∂L/∂w for every weight (chain rule)
  Update        → w = w - lr * ∂L/∂w  (gradient descent)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Vanishing gradient: gradient trở nên cực nhỏ ở layer đầu → weights không update (common với sigmoid)
- Dying ReLU: neuron bị kẹt output=0 khi weight âm, không bao giờ activate nữa
- Batch normalization giúp ổn định training nhưng thêm complexity lúc inference
- Depth vs width tradeoff: sâu hơn học abstract features tốt hơn, rộng hơn capture patterns đơn giản nhiều hơn

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                            | Đúng là                                                      |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| Dùng sigmoid ở tất cả hidden layers | Vanishing gradient trong deep networks, train rất chậm | Dùng ReLU/GELU cho hidden layers, sigmoid chỉ ở output layer |
| Không normalize input data          | Gradient descent hội tụ chậm, weight update không đều  | StandardScaler input hoặc dùng BatchNorm layer               |
| Không dùng regularization từ đầu    | Overfit nhanh trên training data                       | Thêm dropout (0.1–0.5) và L2 weight decay ngay từ đầu        |

**🎯 Interview Pattern:**

- Khi thấy: image, text, audio, video — bất kỳ unstructured data
- Nhớ đến: MLP → CNN (image) → RNN/LSTM (sequence) → Transformer (modern); activation + backprop
- Mở đầu: "For this unstructured data, I'd use a neural network. Architecture choice depends on data type: CNN for spatial data, Transformer for sequences..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [ML Overview](#1-machine-learning-overview--tổng-quan-machine-learning)
- ➡️ Để hiểu tiếp: [Deep Learning vs Traditional ML](#6-deep-learning-vs-traditional-ml--deep-learning-và-ml-truyền-thống)

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

> 🧠 **Memory Hook:** Deep learning như máy CNC đắt tiền — cực mạnh và linh hoạt, nhưng nếu chỉ cần cắt gỗ thẳng thì cưa tay (XGBoost) vẫn nhanh hơn, rẻ hơn, và dễ sửa hơn.

**Tại sao tồn tại? / Why does this exist?**

Developers thường default vào deep learning vì trendy, nhưng với tabular data, dataset nhỏ, hoặc cần interpretability — traditional ML như XGBoost thường thắng ở lower cost. Cần framework để chọn đúng công cụ.
→ **Why?** Vì model complexity phải match data complexity — dùng model quá phức tạp với data đơn giản gây overfit và waste compute.
→ **Why?** Vì business care về ROI: accuracy/latency/cost/maintainability, không phải "dùng model ngầu nhất".

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Chọn phương tiện phù hợp với đường đi: xe máy (logistic regression) chạy tốt trong hẻm nhỏ ít data, ô tô (Random Forest/XGBoost) phù hợp đường quốc lộ tabular data lớn, máy bay (deep learning) cần đường băng dài (massive unstructured data) mới phát huy tốc độ. Dùng máy bay cho chuyến 10km là sai công cụ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Decision Framework — Chọn model theo đặc điểm bài toán:

          Kiểu Data?
         /           \
    Tabular          Unstructured (text/image/audio)
   (structured)              │
      /    \                 └──► Deep Learning
  Small   Large                   (CNN/Transformer)
 Dataset Dataset
    │       │
  Linear  XGBoost /
  + LR    LightGBM    ← SOTA for structured business data
  + rules (CatBoost)

Ngoài ra cần cân nhắc:
  Interpretability needed? → Tree models + SHAP
  Latency < 10ms?          → Smaller/quantized models
  Tiny dataset (<1k)?      → Transfer learning or classical
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- XGBoost/LightGBM thường beat deep learning trên tabular data ngay cả ở scale lớn
- Deep learning cần 10-100x data hơn traditional ML để tránh overfitting
- Traditional ML dễ explain hơn nhiều (feature importance, SHAP) — quan trọng với regulated industries
- DL inference latency khó optimize hơn XGBoost (quantization, pruning phức tạp hơn)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                             | Tại sao sai                                              | Đúng là                                                                    |
| --------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Luôn dùng deep learning vì "mạnh hơn"               | Overengineering, tốn compute/time, khó maintain          | Thử XGBoost trước cho tabular data, chỉ dùng DL khi cần                    |
| Bỏ qua feature engineering khi dùng DL              | Deep learning không phải magic — garbage in, garbage out | Đầu tư data cleaning và domain feature engineering                         |
| So sánh model chỉ dựa accuracy, bỏ qua latency/cost | Model "tốt nhất" không feasible là model vô dụng         | So sánh toàn diện: accuracy + p95 latency + serving cost + maintainability |

**🎯 Interview Pattern:**

- Khi thấy: "which model would you use?", "how do you choose between DL and traditional ML?"
- Nhớ đến: data type → tabular=XGBoost first, unstructured=DL; rồi xét interpretability + SLO + budget
- Mở đầu: "Before choosing, I'd ask: What's the data type? Dataset size? Latency SLO? Interpretability requirement? Budget? For tabular business data, my default is XGBoost — beats DL more often than people think."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Neural Networks](#5-neural-networks--mạng-nơ-ron)
- ➡️ Để hiểu tiếp: [Training Concepts](#7-training-concepts--khái-niệm-huấn-luyện)

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

> 🧠 **Memory Hook:** Training ML như chạy bộ giảm cân — loss function là cân nặng hiện tại, gradient descent là hướng chạy để giảm cân nhanh nhất, learning rate là sải chân, epoch là số ngày tập, batch là km mỗi buổi chạy.

**Tại sao tồn tại? / Why does this exist?**

Hiểu các khái niệm training là điều kiện để diagnose vấn đề: model không hội tụ, train chậm, loss đột ngột tăng — tất cả đều có nguyên nhân cụ thể liên quan đến learning rate, batch size, hay optimizer.
→ **Why?** Vì ML training là optimization problem phức tạp — loss surface có nhiều local minima và saddle points.
→ **Why?** Vì con đường đi đến minimum (path) quan trọng không kém bản thân minimum đó — ảnh hưởng đến generalization.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Học tiếng Anh có phương pháp: loss là điểm IELTS hiện tại, gradient descent là "học theo kỹ năng yếu nhất", learning rate là số giờ học mỗi ngày (học 16h/ngày = burnout = diverge), epoch là hoàn thành 1 lượt hết sách giáo trình, batch là số bài tập mỗi buổi trước khi ôn lại. Tune sai learning rate (học quá nhiều quá sớm) gây tác dụng ngược.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Training Loop (Gradient Descent):

1. Initialize weights W randomly
2. For each epoch:
   For each mini-batch B of size b:
     a. Forward pass:  ŷ = model(X_B; W)
     b. Compute loss:  L = loss(ŷ, y_B)
     c. Backward pass: ∂L/∂W = backprop(L)
     d. Update:        W = W - lr × ∂L/∂W

Key hyperparameters:
  Learning rate (lr): step size — too high=diverge, too low=slow
  Batch size (b):     32–256 typical; affects GPU utilization + generalization
  Epochs:             full passes through dataset; use early stopping
  Optimizer:          SGD (simple) → Adam (adaptive, default for DL)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Learning rate quá cao: loss thành NaN/Inf trong vài epoch đầu → reduce LR ngay
- Batch size 1 (pure stochastic): gradient rất noisy, train không ổn định, không tận dụng GPU
- Gradient explosion trong RNN: giải quyết bằng gradient clipping
- Learning rate warmup quan trọng với Transformer — tránh collapse ở đầu training

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                             | Đúng là                                                  |
| ------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------------------- |
| Giữ learning rate cố định suốt training          | LR cao tốt ban đầu nhưng cần giảm khi gần minimum       | Dùng LR scheduler: warmup → cosine decay hoặc step decay |
| Dùng batch size 1 (pure stochastic GD)           | Gradient noise quá lớn, không tận dụng GPU parallelism  | Dùng mini-batch (32–256), tune batch cùng learning rate  |
| Train đến epoch cố định, không theo dõi val loss | Overfit sau early stopping point — model bị "học thuộc" | Dùng early stopping + lưu checkpoint best val metric     |

**🎯 Interview Pattern:**

- Khi thấy: "Why isn't my model converging?", "Explain the training pipeline"
- Nhớ đến: loss → gradient → optimizer (Adam default) → LR scheduler → early stopping
- Mở đầu: "To diagnose convergence issues, I first plot the learning curve. Loss diverging? LR too high. Plateauing early? Try reducing LR or increasing model capacity..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Neural Networks](#5-neural-networks--mạng-nơ-ron)
- ➡️ Để hiểu tiếp: [Overfitting and Underfitting](#8-overfitting-and-underfitting--quá-khớp-và-thiếu-khớp)

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

> 🧠 **Memory Hook:** Overfitting như học sinh học thuộc đề thi cũ — thi lại y chang thì 10 điểm, đổi đề một chút là 0 điểm; underfitting như không học gì cả — đề nào cũng 2 điểm.

**Tại sao tồn tại? / Why does this exist?**

Hầu hết dự án ML thất bại đầu tiên vì overfitting hoặc underfitting. Hiểu bias-variance tradeoff là nền tảng để diagnose vấn đề model và chọn đúng giải pháp thay vì thử ngẫu nhiên.
→ **Why?** Vì model không generalize được lên data mới thì không có giá trị production nào.
→ **Why?** Vì model phải học underlying signal của data, không phải noise ngẫu nhiên trong training set.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Ba kiểu học sinh: học thuộc lòng đáp án (overfit — train 10đ, test 2đ), hiểu lý thuyết thật sự (good fit — cả train và test đều tốt), không học gì (underfit — cả train và test đều kém). Giáo viên (validation set) là người phát hiện ra học sinh nào chỉ học vẹt mà không thực sự hiểu bài.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Learning Curves — Chẩn đoán bằng biểu đồ:

Training Loss  │ Val Loss  │ Chẩn đoán      │ Giải pháp
───────────────┼───────────┼────────────────┼──────────────────────
HIGH           │ HIGH      │ Underfitting   │ Model lớn hơn, thêm features
LOW            │ HIGH      │ Overfitting    │ Regularization, dropout, more data
LOW            │ LOW   ✓  │ Good fit       │ Deploy!
LOW→HIGH curve │ Diverging │ LR hoặc bug   │ Debug pipeline

Regularization tools:
  L2 (Ridge):   phạt weight lớn → weight nhỏ đều → smooth model
  L1 (Lasso):   phạt |weight| → sparse weights (feature selection)
  Dropout:      tắt ngẫu nhiên neurons lúc train → ensemble effect
  Early stopping: dừng khi val loss ngừng cải thiện
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Double descent: với model rất lớn (overparameterized), test error có thể giảm lại — hiện tượng DL hiện đại
- Underfitting có thể do architecture sai, không chỉ do model quá nhỏ
- Regularization quá mạnh → underfitting — cần tune lambda/dropout rate
- Trong transfer learning, các layer khác nhau có thể overfit độc lập

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                             | Đúng là                                                          |
| --------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| Chỉ nhìn training loss để đánh giá model      | Training loss thấp ≠ model tốt — có thể chỉ là memorize | Luôn theo dõi validation loss song song trong mọi experiment     |
| Thêm dropout mạnh khi model đang underfitting | Dropout giảm effective capacity → underfitting tệ hơn   | Xác định overfitting bằng learning curve TRƯỚC khi dùng dropout  |
| Dùng test set nhiều lần để tune hyperparams   | Vô tình overfit hyperparams đến test data               | Tune trên validation set, dùng test set chỉ đúng 1 lần cuối cùng |

**🎯 Interview Pattern:**

- Khi thấy: "model performs well in training but poorly in production"
- Nhớ đến: plot train vs val loss → diagnose over/underfitting → chọn đúng fix
- Mở đầu: "This sounds like overfitting or distribution shift. I'd first compare training vs validation loss curves. If val diverges, it's overfitting — I'd add regularization and check for data leakage..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Training Concepts](#7-training-concepts--khái-niệm-huấn-luyện)
- ➡️ Để hiểu tiếp: [Transfer Learning and RLHF](#9-transfer-learning-and-rlhf--transfer-learning-và-rlhf)

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

> 🧠 **Memory Hook:** Transfer learning như thuê nhân viên có kinh nghiệm từ công ty khác — không cần train từ đầu, chỉ cần onboard thêm kỹ năng mới cho task cụ thể của bạn, tiết kiệm cả năm đào tạo.

**Tại sao tồn tại? / Why does this exist?**

Hầu hết công ty không có đủ data và compute để train model lớn từ đầu. Transfer learning cho phép tận dụng kiến thức từ model đã pre-train trên hàng tỷ ví dụ và fine-tune với data nhỏ hơn nhiều.
→ **Why?** Vì representation học được từ data lớn transfer tốt sang task liên quan — lower layers học universal features.
→ **Why?** Vì deep networks học hierarchical features: pixels → edges → shapes → objects — các tầng thấp là "universal" across tasks.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Đầu bếp giỏi từ nhà hàng Pháp sang làm cho nhà hàng Ý — kỹ năng dao, nhiệt, kỹ thuật nấu đã có sẵn (pre-trained knowledge), chỉ cần học thêm công thức Ý và hương vị đặc trưng (fine-tuning on new domain). So với tuyển người chưa biết nấu ăn: tiết kiệm 90% thời gian đào tạo.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Transfer Learning Flow:
  Pre-trained Model (trained on massive data: ImageNet/internet text)
         ↓
  Load checkpoint ───── Freeze lower layers (optional)
         │                (preserve universal features)
         ↓
  Add task-specific head
  [frozen encoder layers] → [new trainable head]
         ↓
  Fine-tune on small domain dataset (small LR!)
         ↓
  Evaluate → Deploy

RLHF (LLM Alignment) — 4 bước:
  Step 1: Pretrain   → predict next token on trillion tokens of text
  Step 2: SFT        → fine-tune on curated human-written responses
  Step 3: Reward Model → learn human preference from ranked (A vs B) pairs
  Step 4: PPO/GRPO   → optimize SFT model toward reward model
                        + KL penalty (stay close to SFT, prevent collapse)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Domain mismatch: medical images ≠ ImageNet — transfer kém hiệu quả hơn, cần nhiều data hơn
- Catastrophic forgetting: fine-tuning trên task mới xóa kiến thức task cũ
- RLHF reward hacking: model học "gian lận" reward model → sycophancy, over-explanation
- LoRA/QLoRA: fine-tune chỉ low-rank adapter matrices — tiết kiệm 99% memory so với full fine-tune

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                             | Đúng là                                                         |
| ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| Fine-tune toàn bộ model trên dataset nhỏ        | Catastrophic forgetting + overfit nhanh trên domain nhỏ | Freeze early layers, chỉ fine-tune top layers + head            |
| Bỏ qua domain gap giữa pre-train và target data | Transfer kém, metric thấp hơn kỳ vọng                   | Kiểm tra data distribution similarity trước khi chọn base model |
| Dùng learning rate cao khi fine-tuning          | Phá vỡ features đã học từ pre-training                  | Dùng LR nhỏ hơn 10–100x so với training from scratch            |

**🎯 Interview Pattern:**

- Khi thấy: "small dataset", "domain-specific NLP/Vision task", "LLM fine-tuning", "how ChatGPT is trained"
- Nhớ đến: load pretrained → freeze → add head → fine-tune small LR; RLHF = SFT → RM → PPO
- Mở đầu: "With limited domain data, I'd use transfer learning. Start from a pre-trained checkpoint — this leverages features from massive datasets we couldn't afford to train ourselves..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Neural Networks](#5-neural-networks--mạng-nơ-ron)
- ➡️ Để hiểu tiếp: [LLM & Transformers](./02-llm-and-transformers.md)

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

> 🧠 **Memory Hook:** Chọn metric ML như chấm thi theo môn: môn Toán (precision — bao nhiêu bài nói đúng thật đúng), môn Văn (recall — bao nhiêu ý quan trọng không bị bỏ sót), F1 là điểm tổng hợp. Chấm Toán bằng thang đo Văn là sai.

**Tại sao tồn tại? / Why does this exist?**

Chọn sai metric có thể khiến bạn deploy một model tệ trông như model tốt. 99% accuracy trên fraud detection có thể đạt bằng cách không catch được fraudster nào cả — nếu chỉ có 1% giao dịch là gian lận.
→ **Why?** Vì class imbalance khiến accuracy trở thành chỉ số vô nghĩa.
→ **Why?** Vì chi phí của false positive và false negative hiếm khi bằng nhau trong thực tế business.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tuyển thủ bóng đá có metric khác nhau: thủ môn cần "recall cao" — không để lọt bóng (miss fraud = disaster), tiền đạo cần "precision cao" — sút là phải ghi bàn (spam filter wrongly blocking real emails = users angry). Mỗi vị trí có KPI riêng. Đánh giá thủ môn bằng số bàn thắng là sai hoàn toàn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Confusion Matrix (Binary Classification):
                    Predicted +    Predicted -
Actual Positive:    TP (correct!)  FN (missed — dangerous!)
Actual Negative:    FP (false alarm) TN (correct!)

Metrics derived:
  Precision = TP / (TP + FP)   "Sút là phải vào" — clean predictions
  Recall    = TP / (TP + FN)   "Không để lọt bóng" — catch all positives
  F1        = 2·P·R / (P+R)   Harmonic mean — balanced
  AUC-ROC   = area under ROC  Threshold-independent, good for balanced data
  PR-AUC    = area under PR   Better than ROC for HEAVY class imbalance

Fraud detection example (99% negative, 1% fraud):
  Predict "no fraud" always → Accuracy=99%, Recall=0% ← useless model!
  Fix: PR-AUC + cost-sensitive threshold tuning on validation set
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- AUC-ROC có thể misleading với extreme imbalance (1:1000) — PR-AUC is preferred
- Threshold tuning thay đổi precision/recall tradeoff mà không retraining
- Multi-class: micro-average (weight by count) vs macro-average (weight by class) cho kết quả khác nhau
- Business utility function ($ saved per 1000 transactions) thường là metric cuối cùng cần optimize

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                              | Đúng là                                                               |
| ----------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Báo accuracy 99% với imbalanced dataset         | Đạt được bằng cách predict majority class mãi — recall=0 | Dùng F1/PR-AUC, phân tích confusion matrix đầy đủ                     |
| Tune threshold trên test set                    | Overfit threshold đến test data — inflate metric giả     | Tune threshold trên validation set, evaluate 1 lần trên test          |
| Dùng AUC-ROC cho fraud detection cực imbalanced | ROC curve có thể trông tốt dù precision rất thấp         | Dùng PR-AUC và precision-recall curve, cộng thêm business cost metric |

**🎯 Interview Pattern:**

- Khi thấy: "how do you evaluate this model?", bất kỳ classification problem nào
- Nhớ đến: hỏi về class balance → hỏi về cost FP vs FN → chọn metric → tune threshold trên val
- Mở đầu: "Metric choice depends on class distribution and business cost of errors. For fraud with extreme imbalance, I'd use PR-AUC over ROC-AUC, and optimize threshold based on expected dollar cost per error..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Supervised Learning](#2-supervised-learning--học-có-giám-sát)
- ➡️ Để hiểu tiếp: [AI Engineering Practice](./05-ai-engineering-practice.md)

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

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "Explain the bias-variance tradeoff — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. Bias-variance tradeoff là sự đánh đổi giữa model quá đơn giản (high bias, underfitting) và quá phức tạp (high variance, overfitting).
2. High bias → model không học đủ patterns; high variance → model memorize noise thay vì generalize.
3. Ví dụ: linear regression trên data phi tuyến (high bias); decision tree không giới hạn depth (high variance).
4. Giải pháp: regularization giảm variance, bagging (Random Forest) giảm variance, boosting (XGBoost) giảm bias.

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                                    |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Giải thích bias-variance tradeoff với một ví dụ cụ thể — khi nào thì model có high bias? High variance?                                                    |
| 2   | 🎨 Visual      | Vẽ confusion matrix 2×2, điền TP/FP/TN/FN, sau đó tính precision, recall, F1 cho bài toán fraud detection với TP=80, FP=20, FN=10, TN=890                  |
| 3   | 🛠️ Application | Model fraud detection của bạn đạt 99% accuracy. Product manager vui mừng. Bạn có deploy không? Giải thích tại sao và chọn metric nào thay thế              |
| 4   | 🐛 Debug       | Model supervised learning accuracy cao khi train nhưng thấp khi production sau 2 tuần. List ít nhất 4 nguyên nhân có thể và cách kiểm tra từng nguyên nhân |
| 5   | 🎓 Teach       | Giải thích supervised vs unsupervised learning cho người không biết ML, dùng 1 analogy từ cuộc sống hàng ngày ở Việt Nam                                   |

💬 **Feynman Prompt:** Giải thích tại sao model với 95% accuracy có thể vô dụng cho fraud detection — và metric nào phù hợp hơn (hint: class imbalance).

---

## 🔁 Spaced Repetition / Lịch Ôn Tập

| Review | Date     | Focus                                        |
| ------ | -------- | -------------------------------------------- |
| Day 1  | Today    | Full read + highlight Memory Hooks           |
| Day 3  | +3 days  | Cold Call + Self-Check only                  |
| Day 7  | +7 days  | Q&A bank (cover answers, recall from memory) |
| Day 14 | +14 days | Teach someone / Feynman technique            |
| Day 30 | +30 days | Mock interview practice                      |

## Connections / Liên Kết

- ➡️ **Applied in**: [LLM & Transformers](./02-llm-and-transformers.md) — deep learning foundation
- ➡️ **Applied in**: [AI Engineering Practice](./05-ai-engineering-practice.md) — ML ops and deployment
- 🔗 **Related**: [AI Evaluation Testing](./08-ai-evaluation-testing.md) — how to evaluate ML models
- 🔗 **Related**: [Information Theory](../01-cs-fundamentals/information-theory.md) — entropy is used in decision trees
