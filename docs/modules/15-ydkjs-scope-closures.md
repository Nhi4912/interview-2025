# You Don't Know JS Yet: Scope & Closures - 2nd Edition (Vietnamese Translation)

> **Lưu ý**: Đây là bản dịch tiếng Việt của cuốn sách "You Don't Know JS Yet: Scope & Closures" (2nd Edition) của Kyle Simpson.

## Mục lục

1. [Lời tựa (Foreword)](#lời-tựa-foreword)
2. [Lời nói đầu (Preface)](#lời-nói-đầu-preface)
3. [Chương 1: Scope là gì? (What's the Scope?)](#chương-1-scope-là-gì)
4. [Chương 2: Minh họa Lexical Scope (Illustrating Lexical Scope)](#chương-2-minh-họa-lexical-scope)
5. [Chương 3: Chuỗi Scope (The Scope Chain)](#chương-3-chuỗi-scope-the-scope-chain)
6. [Chương 4: Xung quanh Global Scope (Around the Global Scope)](#chương-4-xung-quanh-global-scope)
7. [Chương 5: Vòng đời (không quá) bí mật của biến (The (Not So) Secret Lifecycle of Variables)](#chương-5-vòng-đời-không-quá-bí-mật-của-biến)
8. [Chương 6: Giới hạn sự phơi bày của Scope (Limiting Scope Exposure)](#chương-6-giới-hạn-sự-phơi-bày-của-scope)
9. [Chương 7: Sử dụng Closures (Using Closures)](#chương-7-sử-dụng-closures)
10. [Chương 8: Module Pattern (The Module Pattern)](#chương-8-module-pattern)
11. [Phụ lục A: Khám phá thêm (Exploring Further)](#phụ-lục-a-khám-phá-thêm)
12. [Phụ lục B: Thực hành (Practice)](#phụ-lục-b-thực-hành)

---

## Lời tựa (Foreword)

_Bởi Sarah Drasner_

Nếu tôi nhìn qua những cuốn sách trên giá sách của mình, tôi có thể thấy rõ ràng những cuốn nào được yêu thích nhất. "Được yêu thích" ở đây có nghĩa là chúng hơi bị sờn. Gáy sách bị gãy, các trang bị rách, thậm chí có thể có một vài vết ố do đồ uống đổ vào. Điều trớ trêu đối với tôi là những cuốn sách tôi yêu thích nhất thường trông có vẻ ít được giữ gìn nhất, mặc dù sự thật hoàn toàn ngược lại.

_Scope and Closures_ (ấn bản 1) là một trong những cuốn sách tôi yêu thích nhất. Nó nhỏ nhắn, nhưng phần gáy sách đang bong ra. Các trang giấy đã sờn và quăn góc. Nó hơi nhăn nheo. Đó không phải là cuốn sách tôi chỉ đọc một lần. Tôi đã cầm nó lên đọc đi đọc lại nhiều lần trong nhiều năm kể từ khi nó được xuất bản lần đầu.

Đối với tôi, nó cũng là một cột mốc cho sự tiến bộ cá nhân của tôi với JavaScript. Khi tôi đọc nó lần đầu vào năm 2014, tôi đã quen thuộc với các khái niệm nhưng thừa nhận rằng chiều sâu hiểu biết của tôi không sâu như cuốn sách mỏng này.

Qua nhiều năm, mặc dù tôi không nhất thiết cảm thấy sự tiến bộ của mình hàng ngày, nhưng từng khái niệm đã trở nên dễ tiếp cận hơn. Tôi tự mỉm cười, nhận ra mình đã đi được bao xa nhờ sự giúp đỡ của những hướng dẫn này. Rõ ràng là có một mối tương quan nghịch đảo giữa việc tôi giữ gìn cuốn sách tốt như thế nào và việc tôi yêu thích nó bao nhiêu.

Khi Kyle nhờ tôi viết Lời tựa cho ấn bản thứ 2, tôi đã rất ngạc nhiên. Không thường xuyên bạn được yêu cầu viết về một cuốn sách đã góp phần định hình sự hiểu biết và sự nghiệp của chính bạn, đặc biệt là _Scope and Closures_. Tôi nhớ ngày đầu tiên tôi hiểu về closures, lần đầu tiên tôi sử dụng nó thành thạo. Sự thỏa mãn thật tuyệt vời, một phần vì sự đối xứng của ý tưởng này rất hấp dẫn đối với tôi. Trước khi cầm cuốn sách này lên, tôi đã say mê closures. Tuy nhiên, có sự khác biệt giữa việc có thể thực thi code thành công và việc khám phá đầy đủ các khái niệm với bất kỳ độ sâu nào. Cuốn sách này đã lấy đi sự hiểu biết cơ bản của tôi và khơi dậy nó, giúp tôi làm chủ nó.

Cuốn sách này ngắn một cách đánh lừa. Việc nó nhỏ gọn là rất hữu ích vì nó chứa đầy kiến thức bổ ích. Vì nó nhỏ gọn, tôi khuyên bạn nên dành thời gian để tiếp thu từng trang. Hãy từ từ với nó. Hãy đối xử với cuốn sách một cách cẩn thận, và ý tôi là, hãy làm sờn nó đi.

**Sarah Drasner**
Head of Developer Experience
Netlify

---

## Lời nói đầu (Preface)

Chào mừng bạn đến với ấn bản thứ 2 của loạt sách _You Don't Know JS_ (**YDKJS**) được đánh giá cao: \*You Don't Know JS **Yet\*** (**YDKJSY**).

Nếu bạn đã đọc bất kỳ cuốn sách nào thuộc ấn bản 1, bạn có thể mong đợi một cách tiếp cận mới mẻ trong những cuốn mới này, với nhiều nội dung cập nhật về những gì đã thay đổi trong JS trong 5 năm qua. Nhưng điều tôi hy vọng và tin rằng bạn vẫn sẽ _nhận được_ là cam kết tương tự về việc tôn trọng JS và đào sâu vào những gì thực sự làm cho nó hoạt động.

Nếu đây là lần đầu tiên bạn đọc những cuốn sách này, tôi rất vui vì bạn ở đây. Hãy chuẩn bị cho một hành trình sâu rộng vào tất cả các ngóc ngách của JavaScript.

Nếu bạn mới làm quen với lập trình hoặc JS, hãy lưu ý rằng những cuốn sách này không nhằm mục đích là một "lời giới thiệu nhẹ nhàng về JavaScript". Tài liệu này đôi khi phức tạp và đầy thách thức, và đi sâu hơn nhiều so với mức điển hình cho người mới học lần đầu. Bạn được chào đón ở đây bất kể nền tảng của bạn là gì, nhưng những cuốn sách này được viết với giả định rằng bạn đã thoải mái với JS và có ít nhất 6–9 tháng kinh nghiệm với nó.

### Các Phần (The Parts)

Những cuốn sách này tiếp cận JavaScript hoàn toàn trái ngược với cách mà _The Good Parts_ đối xử với ngôn ngữ. Không, điều đó không có nghĩa là chúng ta đang xem xét _những phần xấu_, mà thay vào đó, khám phá **tất cả các phần**.

Bạn có thể đã được nghe nói, hoặc tự cảm thấy, rằng JS là một ngôn ngữ có nhiều khiếm khuyết sâu sắc, được thiết kế kém và thực thi không nhất quán. Nhiều người đã khẳng định rằng đó là ngôn ngữ phổ biến tồi tệ nhất trên thế giới; rằng không ai viết JS vì họ muốn, mà chỉ vì họ phải làm vậy do vị trí của nó ở trung tâm của web. Đó là một tuyên bố nực cười, không lành mạnh và hoàn toàn trịch thượng.

Hàng triệu lập trình viên viết JavaScript mỗi ngày, và nhiều người trong số họ đánh giá cao và tôn trọng ngôn ngữ này.

Giống như bất kỳ ngôn ngữ tuyệt vời nào, nó có những phần rực rỡ cũng như những vết sẹo. Ngay cả cha đẻ của JavaScript, Brendan Eich, cũng than phiền về một số phần đó là sai lầm. Nhưng ông ấy đã sai: chúng hoàn toàn không phải là sai lầm. JS là chính nó ngày nay—ngôn ngữ lập trình phổ biến nhất và do đó có ảnh hưởng nhất thế giới—chính xác là nhờ _tất cả những phần đó_.

Đừng tin vào lời nói dối rằng bạn chỉ nên học và sử dụng một bộ sưu tập nhỏ _những phần tốt_ trong khi tránh tất cả những thứ tồi tệ. Đừng tin vào lời khuyên "X là Y mới", rằng một tính năng mới của ngôn ngữ ngay lập tức làm cho tất cả việc sử dụng tính năng trước đó trở nên lỗi thời và thiếu hiểu biết. Đừng nghe khi ai đó nói code của bạn không "hiện đại" vì nó chưa sử dụng tính năng stage-0 mới chỉ được đề xuất vài tuần trước!

Mọi phần của JS đều hữu ích. Một số phần hữu ích hơn những phần khác. Một số phần đòi hỏi bạn phải cẩn thận và có chủ đích hơn.

Tôi thấy thật vô lý khi cố gắng trở thành một lập trình viên JavaScript thực sự hiệu quả trong khi chỉ sử dụng một phần nhỏ những gì ngôn ngữ cung cấp. Bạn có thể tưởng tượng một công nhân xây dựng với hộp dụng cụ đầy đủ, nhưng chỉ sử dụng búa và chế giễu tuốc nơ vít hay thước dây là kém cỏi không? Điều đó thật ngớ ngẩn.

Khẳng định không dè dặt của tôi là bạn nên học tất cả các phần của JavaScript, và khi thích hợp, hãy sử dụng chúng! Và nếu tôi có thể mạo muội đề nghị: đã đến lúc vứt bỏ bất kỳ cuốn sách JS nào bảo bạn làm ngược lại.

### Tiêu đề? (The Title?)

Vậy tiêu đề của loạt sách này nói về điều gì?

Tôi không cố gắng xúc phạm bạn bằng những lời chỉ trích về sự thiếu kiến thức hoặc hiểu biết hiện tại của bạn về JavaScript. Tôi không ám chỉ rằng bạn không thể hoặc sẽ không thể học JavaScript. Tôi không khoe khoang về những bí mật cao siêu mà chỉ tôi và một số ít người được chọn mới sở hữu.

Nghiêm túc mà nói, tất cả những điều đó là phản ứng thực tế đối với tiêu đề loạt sách gốc trước khi mọi người đọc sách. Và chúng hoàn toàn vô căn cứ.

Điểm chính của tiêu đề "You Don't Know JS Yet" (Bạn Chưa Biết JS Đâu) là để chỉ ra rằng hầu hết các lập trình viên JS không dành thời gian để thực sự hiểu code mà họ viết hoạt động như thế nào. Họ biết _rằng_ nó hoạt động—rằng nó tạo ra kết quả mong muốn. Nhưng họ hoặc không hiểu chính xác _làm thế nào_, hoặc tệ hơn, họ có một mô hình tư duy không chính xác về cái _làm thế nào_ đó, thứ sẽ sụp đổ khi xem xét kỹ lưỡng hơn.

Tôi đang đưa ra một thách thức nhẹ nhàng nhưng nghiêm túc cho bạn, người đọc, để gạt bỏ những giả định bạn có về JS, và tiếp cận nó với đôi mắt mới mẻ và sự tò mò mạnh mẽ dẫn bạn đến việc hỏi _tại sao_ cho mỗi dòng code bạn viết. Tại sao nó làm những điều nó làm? Tại sao cách này tốt hơn hoặc phù hợp hơn nửa tá cách khác mà bạn có thể đã thực hiện? Tại sao tất cả "những đứa trẻ nổi tiếng" nói hãy làm X với code của bạn, nhưng hóa ra Y có thể là một lựa chọn tốt hơn?

Tôi đã thêm "Yet" (Chưa/Vẫn) vào tiêu đề, không chỉ vì đây là ấn bản thứ hai, mà vì cuối cùng tôi muốn những cuốn sách này thách thức bạn theo một cách đầy hy vọng thay vì nản lòng.

Nhưng để tôi nói rõ: Tôi không nghĩ rằng có thể _biết_ hoàn toàn JS. Đó không phải là một thành tựu để đạt được, mà là một mục tiêu để phấn đấu. Bạn không bao giờ hoàn thành việc biết mọi thứ về JS, bạn chỉ tiếp tục học hỏi nhiều hơn và nhiều hơn nữa khi bạn dành nhiều thời gian hơn với ngôn ngữ này. Và bạn càng đi sâu, bạn càng xem lại những gì bạn _đã biết_ trước đây, và bạn học lại nó từ góc nhìn kinh nghiệm hơn đó.

Tôi khuyến khích bạn áp dụng một tư duy xung quanh JavaScript, và thực tế là tất cả việc phát triển phần mềm, rằng bạn sẽ không bao giờ hoàn toàn làm chủ nó, nhưng bạn có thể và nên tiếp tục làm việc để tiến gần hơn đến đích đó, một hành trình sẽ kéo dài trong suốt sự nghiệp phát triển phần mềm của bạn, và hơn thế nữa.

Bạn luôn có thể biết JS tốt hơn hiện tại. Đó là những gì tôi hy vọng những cuốn sách YDKJSY này đại diện.

### Sứ mệnh (The Mission)

Không thực sự cần phải lập luận tại sao các lập trình viên nên coi trọng JS—tôi nghĩ nó đã được chứng minh là xứng đáng với vị thế hạng nhất trong số các ngôn ngữ lập trình trên thế giới.

Nhưng một trường hợp khác, quan trọng hơn vẫn cần được thực hiện, và những cuốn sách này vươn lên thách thức đó.

Tôi đã dạy hơn 5.000 lập trình viên từ các nhóm và công ty trên khắp thế giới, ở hơn 25 quốc gia trên sáu lục địa. Và những gì tôi thấy là quá thường xuyên, cái _được tính_ thường chỉ là kết quả của chương trình, chứ không phải cách chương trình được viết hay làm thế nào/tại sao nó hoạt động.

Kinh nghiệm của tôi không chỉ với tư cách là một lập trình viên mà còn trong việc giảng dạy nhiều lập trình viên khác cho tôi biết: bạn sẽ luôn hiệu quả hơn trong công việc phát triển của mình nếu bạn hiểu đầy đủ hơn cách code của bạn hoạt động so với việc bạn chỉ đơn thuần _làm cho_ nó tạo ra kết quả mong muốn.

Nói cách khác, _đủ tốt để hoạt động_ không phải, và không nên là, _đủ tốt_.

Tất cả các lập trình viên thường xuyên vật lộn với một đoạn code không hoạt động chính xác, và họ không thể tìm ra lý do tại sao. Nhưng quá thường xuyên, các lập trình viên JS sẽ đổ lỗi điều này cho ngôn ngữ thay vì thừa nhận rằng sự hiểu biết của chính họ đang thiếu sót. Những cuốn sách này phục vụ như cả câu hỏi và câu trả lời: tại sao nó làm _điều này_, và đây là cách để làm cho nó làm _điều kia_ thay thế.

Sứ mệnh của tôi với YDKJSY là trao quyền cho mỗi lập trình viên JS để hoàn toàn làm chủ code họ viết, để hiểu nó và viết với ý định và sự rõ ràng.

### Con đường (The Path)

Một số bạn đã bắt đầu đọc cuốn sách này với mục tiêu hoàn thành tất cả sáu cuốn, liên tục.

Tôi muốn cảnh báo bạn hãy cân nhắc thay đổi kế hoạch đó.

Ý định của tôi không phải là YDKJSY được đọc một mạch. Tài liệu trong những cuốn sách này rất dày đặc, bởi vì JavaScript mạnh mẽ, tinh vi và ở một số phần khá phức tạp. Không ai thực sự có thể hy vọng _tải xuống_ tất cả thông tin này vào não bộ của họ trong một lần đọc và giữ lại bất kỳ lượng đáng kể nào của nó. Điều đó là vô lý, và thật ngu ngốc khi thử.

Đề xuất của tôi là bạn hãy dành thời gian đi qua YDKJSY. Lấy một chương, đọc nó hoàn toàn từ đầu đến cuối, và sau đó quay lại và đọc lại từng phần một. Dừng lại giữa mỗi phần, và thực hành code hoặc ý tưởng từ phần đó. Đối với các khái niệm lớn hơn, có lẽ là một ý tưởng hay khi mong đợi dành vài ngày để tiêu hóa, đọc lại, thực hành, sau đó tiêu hóa thêm một chút nữa.

Bạn có thể dành một hoặc hai tuần cho mỗi chương, và một hoặc hai tháng cho mỗi cuốn sách, và một năm hoặc nhiều hơn cho cả bộ, và bạn vẫn sẽ không vắt kiệt từng giọt của YDKJSY.

Đừng đọc ngấu nghiến những cuốn sách này; hãy kiên nhẫn và trải rộng việc đọc của bạn. Đan xen việc đọc với nhiều thực hành trên code thực tế trong công việc hoặc trên các dự án bạn tham gia. Đấu tranh với các ý kiến tôi đã trình bày trên đường đi, tranh luận với người khác, và trên hết, không đồng ý với tôi! Điều hành một nhóm học tập hoặc câu lạc bộ sách. Dạy các hội thảo nhỏ tại văn phòng của bạn. Viết bài blog về những gì bạn đã học được. Nói về những chủ đề này tại các buổi gặp mặt JS địa phương.

Không bao giờ là mục tiêu của tôi để thuyết phục bạn đồng ý với ý kiến của tôi, mà là khuyến khích bạn sở hữu và có thể bảo vệ ý kiến của mình. Bạn không thể đến _đó_ với một lần đọc lướt qua những cuốn sách này. Đó là một cái gì đó mất nhiều thời gian để xuất hiện, từng chút một, khi bạn nghiên cứu và suy ngẫm và xem lại.

Những cuốn sách này nhằm mục đích là một hướng dẫn thực địa trên những chuyến lang thang của bạn qua JavaScript, từ bất cứ nơi nào bạn hiện đang ở với ngôn ngữ, đến một nơi hiểu biết sâu sắc hơn. Và bạn càng hiểu sâu về JS, bạn sẽ càng hỏi nhiều câu hỏi và bạn sẽ càng phải khám phá nhiều hơn! Đó là những gì tôi thấy rất thú vị!

Tôi rất vui vì bạn đang bắt tay vào hành trình này, và tôi rất vinh dự khi bạn cân nhắc và tham khảo những cuốn sách này trên đường đi. Đã đến lúc bắt đầu _làm quen với JS_.

---

## Chương 1: Scope là gì? (What's the Scope?)

Đến khi bạn viết được vài chương trình đầu tiên, có thể bạn đã khá thoải mái với việc tạo biến và lưu trữ giá trị trong chúng. Làm việc với các biến là một trong những điều cơ bản nhất chúng ta làm trong lập trình!

Nhưng có thể bạn chưa xem xét kỹ lưỡng các cơ chế bên dưới được engine sử dụng để tổ chức và quản lý các biến này. Tôi không nói về cách bộ nhớ được cấp phát trên máy tính, mà là: làm thế nào JS biết biến nào có thể truy cập được bởi bất kỳ câu lệnh nào, và nó xử lý hai biến cùng tên như thế nào?

Câu trả lời cho các câu hỏi như thế này ẩn dưới dạng các quy tắc được xác định rõ gọi là scope (phạm vi). Cuốn sách này sẽ đào sâu qua tất cả các khía cạnh của scope—cách nó hoạt động, nó hữu ích cho cái gì, các cạm bẫy cần tránh—và sau đó chỉ ra các pattern scope phổ biến hướng dẫn cấu trúc của các chương trình.

Bước đầu tiên của chúng ta là khám phá cách JS engine xử lý chương trình của chúng ta **trước khi** nó chạy.

### Về cuốn sách này (About This Book)

Chào mừng bạn đến với cuốn sách thứ 2 trong loạt _You Don't Know JS Yet_! Nếu bạn đã hoàn thành _Get Started_ (cuốn đầu tiên), bạn đang ở đúng nơi! Nếu chưa, trước khi tiếp tục, tôi khuyến khích bạn _bắt đầu từ đó_ để có nền tảng tốt nhất.

Trọng tâm của chúng ta sẽ là trụ cột đầu tiên trong ba trụ cột của ngôn ngữ JS: hệ thống scope và các function closures của nó, cũng như sức mạnh của module design pattern.

JS thường được phân loại là một ngôn ngữ kịch bản thông dịch (interpreted scripting language), vì vậy hầu hết mọi người đều cho rằng các chương trình JS được xử lý trong một lần chạy từ trên xuống dưới. Nhưng thực tế JS được phân tích/biên dịch (parsed/compiled) trong một giai đoạn riêng biệt **trước khi việc thực thi bắt đầu**. Các quyết định của tác giả code về nơi đặt biến, hàm và khối (blocks) đối với nhau được phân tích theo các quy tắc của scope, trong giai đoạn phân tích/biên dịch ban đầu. Cấu trúc scope kết quả thường không bị ảnh hưởng bởi các điều kiện runtime.

Các hàm JS bản thân chúng là các giá trị first-class; chúng có thể được gán và truyền đi giống như số hoặc chuỗi. Nhưng vì các hàm này giữ và truy cập các biến, chúng duy trì scope ban đầu của chúng bất kể nơi nào trong chương trình các hàm cuối cùng được thực thi. Đây được gọi là closure.

Modules là một mô hình tổ chức code được đặc trưng bởi các phương thức public có quyền truy cập đặc quyền (thông qua closure) vào các biến và hàm ẩn trong scope nội bộ của module.

### Biên dịch vs. Thông dịch (Compiled vs. Interpreted)

Bạn có thể đã nghe nói về _biên dịch code_ trước đây, nhưng có lẽ nó có vẻ như một chiếc hộp đen bí ẩn nơi mã nguồn trượt vào một đầu và các chương trình thực thi bật ra ở đầu kia.

Tuy nhiên, nó không bí ẩn hay ma thuật. Biên dịch code là một tập hợp các bước xử lý văn bản code của bạn và biến nó thành một danh sách các hướng dẫn mà máy tính có thể hiểu được. Thông thường, toàn bộ mã nguồn được chuyển đổi cùng một lúc, và các hướng dẫn kết quả đó được lưu dưới dạng đầu ra (thường trong một file) có thể được thực thi sau đó.

Bạn cũng có thể đã nghe nói rằng code có thể được _thông dịch_, vậy nó khác gì so với được _biên dịch_?

Thông dịch thực hiện một nhiệm vụ tương tự như biên dịch, ở chỗ nó chuyển đổi chương trình của bạn thành các hướng dẫn mà máy có thể hiểu được. Nhưng mô hình xử lý thì khác. Khác với một chương trình được biên dịch tất cả cùng một lúc, với thông dịch, mã nguồn được chuyển đổi từng dòng một; mỗi dòng hoặc câu lệnh được thực thi trước khi ngay lập tức tiến hành xử lý dòng tiếp theo của mã nguồn.

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig1.png" width="650" alt="Code Compilation and Code Interpretation" align="center">
    <figcaption><em>Hình 1: Code Biên dịch vs. Code Thông dịch</em></figcaption>
    <br><br>
</figure>

Hình 1 minh họa việc biên dịch so với thông dịch chương trình.

Hai mô hình xử lý này có loại trừ lẫn nhau không? Nói chung là có. Tuy nhiên, vấn đề có nhiều sắc thái hơn, bởi vì thông dịch thực sự có thể diễn ra dưới các hình thức khác thay vì chỉ hoạt động từng dòng trên văn bản mã nguồn. Các JS engine hiện đại thực sự sử dụng nhiều biến thể của cả biên dịch và thông dịch trong việc xử lý các chương trình JS.

Nhớ lại rằng chúng ta đã khảo sát chủ đề này trong Chương 1 của cuốn _Get Started_. Kết luận của chúng ta ở đó là JS được mô tả chính xác nhất là một **ngôn ngữ biên dịch**. Vì lợi ích của độc giả ở đây, các phần sau sẽ xem xét lại và mở rộng khẳng định đó.

### Biên dịch Code (Compiling Code)

Nhưng trước tiên, tại sao việc JS được biên dịch hay không lại quan trọng?

Scope chủ yếu được xác định trong quá trình biên dịch, vì vậy hiểu cách biên dịch và thực thi liên quan là chìa khóa để làm chủ scope.

Trong lý thuyết biên dịch cổ điển, một chương trình được xử lý bởi trình biên dịch theo ba giai đoạn cơ bản:

1. **Tokenizing/Lexing:** chia nhỏ một chuỗi ký tự thành các khối có ý nghĩa (đối với ngôn ngữ), gọi là tokens. Ví dụ, xem xét chương trình: `var a = 2;`. Chương trình này có thể sẽ được chia thành các tokens sau: `var`, `a`, `=`, `2`, và `;`. Khoảng trắng có thể được giữ lại hoặc không dưới dạng token, tùy thuộc vào việc nó có ý nghĩa hay không.

   (Sự khác biệt giữa tokenizing và lexing là tinh tế và mang tính học thuật, nhưng nó tập trung vào việc liệu các tokens này có được xác định theo cách _không trạng thái_ (stateless) hay _có trạng thái_ (stateful) hay không. Nói một cách đơn giản, nếu tokenizer gọi các quy tắc phân tích có trạng thái để tìm ra liệu `a` nên được coi là một token riêng biệt hay chỉ là một phần của token khác, thì _đó_ sẽ là **lexing**.)

2. **Parsing:** lấy một luồng (mảng) các tokens và chuyển nó thành một cây các phần tử lồng nhau, đại diện chung cho cấu trúc ngữ pháp của chương trình. Đây được gọi là Cây Cú pháp Trừu tượng (Abstract Syntax Tree - AST).

   Ví dụ, cây cho `var a = 2;` có thể bắt đầu với một node cấp cao nhất gọi là `VariableDeclaration`, với một node con gọi là `Identifier` (có giá trị là `a`), và một node con khác gọi là `AssignmentExpression` mà chính nó có một node con gọi là `NumericLiteral` (có giá trị là `2`).

3. **Code Generation:** lấy một AST và chuyển nó thành mã thực thi. Phần này thay đổi rất nhiều tùy thuộc vào ngôn ngữ, nền tảng mà nó hướng tới, và các yếu tố khác.

   JS engine lấy AST vừa mô tả cho `var a = 2;` và chuyển nó thành một tập hợp các hướng dẫn máy để thực sự _tạo_ một biến gọi là `a` (bao gồm dự trữ bộ nhớ, v.v.), và sau đó lưu trữ một giá trị vào `a`.

> **LƯU Ý**: Chi tiết triển khai của một JS engine (sử dụng tài nguyên bộ nhớ hệ thống, v.v.) sâu hơn nhiều so với những gì chúng ta sẽ đào sâu ở đây. Chúng ta sẽ giữ trọng tâm vào hành vi có thể quan sát được của các chương trình và để JS engine quản lý các trừu tượng cấp hệ thống sâu hơn đó.

JS engine phức tạp hơn nhiều so với _chỉ_ ba giai đoạn này. Trong quá trình parsing và code generation, có các bước để tối ưu hóa hiệu suất thực thi (ví dụ: thu gọn các phần tử dư thừa). Trên thực tế, code thậm chí có thể được biên dịch lại và tối ưu hóa lại trong quá trình thực thi.

Vì vậy, tôi chỉ đang phác họa những nét chính ở đây. Nhưng bạn sẽ sớm thấy tại sao _những_ chi tiết mà chúng ta _có_ đề cập, ngay cả ở mức độ cao, lại có liên quan.

Các JS engine không có sự xa xỉ về thời gian dồi dào để thực hiện công việc và tối ưu hóa của chúng, bởi vì việc biên dịch JS không xảy ra trong một bước build trước đó, như với các ngôn ngữ khác. Nó thường phải xảy ra chỉ trong vài micro giây (hoặc ít hơn!) ngay trước khi code được thực thi. Để đảm bảo hiệu suất nhanh nhất dưới những ràng buộc này, các JS engine sử dụng đủ loại thủ thuật (như JITs, biên dịch lười (lazy compile) và thậm chí biên dịch lại nóng (hot re-compile)); những điều này nằm ngoài "phạm vi" thảo luận của chúng ta ở đây.

#### Bắt buộc: Hai Giai đoạn (Required: Two Phases)

Để nói một cách đơn giản nhất có thể, quan sát quan trọng nhất mà chúng ta có thể thực hiện về việc xử lý các chương trình JS là nó xảy ra trong (ít nhất) hai giai đoạn: phân tích/biên dịch trước, sau đó thực thi.

Việc tách biệt giai đoạn phân tích/biên dịch khỏi giai đoạn thực thi tiếp theo là sự thật có thể quan sát được, không phải lý thuyết hay ý kiến. Mặc dù đặc tả JS không yêu cầu "biên dịch" một cách rõ ràng, nhưng nó yêu cầu hành vi về cơ bản chỉ thực tế với cách tiếp cận biên dịch-rồi-thực thi.

Có ba đặc điểm chương trình bạn có thể quan sát để chứng minh điều này cho chính mình: lỗi cú pháp (syntax errors), lỗi sớm (early errors), và hoisting.

**Lỗi Cú pháp ngay từ đầu (Syntax Errors from the Start)**

Xem xét chương trình này:

```js
var greeting = "Hello";

console.log(greeting);

greeting = ."Hi";
// SyntaxError: unexpected token .
```

Chương trình này không tạo ra đầu ra nào (`"Hello"` không được in), mà thay vào đó ném ra một `SyntaxError` về token `.` không mong muốn ngay trước chuỗi `"Hi"`. Vì lỗi cú pháp xảy ra sau câu lệnh `console.log(..)` đúng định dạng, nếu JS thực thi từ trên xuống dưới từng dòng một, người ta sẽ mong đợi thông báo `"Hello"` được in ra trước khi lỗi cú pháp bị ném ra. Điều đó không xảy ra.

Thực tế, cách duy nhất JS engine có thể biết về lỗi cú pháp ở dòng thứ ba, trước khi thực thi dòng thứ nhất và thứ hai, là JS engine phải phân tích toàn bộ chương trình trước khi bất kỳ phần nào của nó được thực thi.

**Lỗi Sớm (Early Errors)**

Tiếp theo, xem xét:

```js
console.log("Howdy");

saySomething("Hello", "Hi");
// Uncaught SyntaxError: Duplicate parameter name not
// allowed in this context

function saySomething(greeting, greeting) {
  "use strict";
  console.log(greeting);
}
```

Thông báo `"Howdy"` không được in ra, mặc dù là một câu lệnh đúng định dạng.

Thay vào đó, giống như đoạn trích trong phần trước, `SyntaxError` ở đây được ném ra trước khi chương trình được thực thi. Trong trường hợp này, đó là do strict-mode (chỉ chọn tham gia cho hàm `saySomething(..)` ở đây) cấm, trong số nhiều thứ khác, các hàm có tên tham số trùng lặp; điều này luôn được cho phép trong non-strict-mode.

Lỗi được ném ra không phải là lỗi cú pháp theo nghĩa là một chuỗi tokens sai định dạng (như `."Hi"` trước đó), nhưng trong strict-mode vẫn được yêu cầu bởi đặc tả phải được ném ra như một "lỗi sớm" trước khi bất kỳ việc thực thi nào bắt đầu.

Nhưng làm thế nào JS engine biết rằng tham số `greeting` bị trùng lặp? Làm thế nào nó biết rằng hàm `saySomething(..)` thậm chí đang ở trong strict-mode trong khi xử lý danh sách tham số (chỉ thị `"use strict"` xuất hiện sau đó, trong thân hàm)?

Một lần nữa, lời giải thích hợp lý duy nhất là code phải được phân tích _đầy đủ_ trước khi bất kỳ việc thực thi nào xảy ra.

**Hoisting**

Cuối cùng, xem xét:

```js
function saySomething() {
  var greeting = "Hello";
  {
    greeting = "Howdy"; // lỗi đến từ đây
    let greeting = "Hi";
    console.log(greeting);
  }
}

saySomething();
// ReferenceError: Cannot access 'greeting' before
// initialization
```

`ReferenceError` được ghi chú xảy ra từ dòng có câu lệnh `greeting = "Howdy"`. Điều đang xảy ra là biến `greeting` cho câu lệnh đó thuộc về khai báo ở dòng tiếp theo, `let greeting = "Hi"`, thay vì câu lệnh `var greeting = "Hello"` trước đó.

Cách duy nhất JS engine có thể biết, tại dòng nơi lỗi được ném ra, rằng _câu lệnh tiếp theo_ sẽ khai báo một biến block-scoped cùng tên (`greeting`) là nếu JS engine đã xử lý code này trong một lần chạy trước đó, và đã thiết lập tất cả các scopes và các liên kết biến của chúng. Việc xử lý scopes và khai báo này chỉ có thể được thực hiện chính xác bằng cách phân tích chương trình trước khi thực thi.

`ReferenceError` ở đây về mặt kỹ thuật đến từ việc `greeting = "Howdy"` truy cập biến `greeting` **quá sớm**, một xung đột được gọi là Temporal Dead Zone (TDZ). Chương 5 sẽ đề cập chi tiết hơn về điều này.

> **CẢNH BÁO**: Thường có khẳng định rằng các khai báo `let` và `const` không được hoisted, như một lời giải thích cho hành vi TDZ vừa được minh họa. Nhưng điều này không chính xác. Chúng ta sẽ quay lại và giải thích cả hoisting và TDZ của `let`/`const` trong Chương 5.

Hy vọng bây giờ bạn đã bị thuyết phục rằng các chương trình JS được phân tích trước khi bất kỳ việc thực thi nào bắt đầu. Nhưng điều đó có chứng minh chúng được biên dịch không?

Đây là một câu hỏi thú vị để suy ngẫm. JS có thể phân tích một chương trình, nhưng sau đó thực thi chương trình đó bằng cách _thông dịch_ các hoạt động được biểu diễn trong AST **mà không** biên dịch chương trình trước không? Có, điều đó _có thể_. Nhưng nó cực kỳ khó xảy ra, chủ yếu là vì nó sẽ cực kỳ kém hiệu quả về mặt hiệu suất.

Thật khó để tưởng tượng một JS engine chất lượng production lại đi qua tất cả rắc rối của việc phân tích một chương trình thành AST, nhưng sau đó không chuyển đổi (hay còn gọi là "biên dịch") AST đó thành biểu diễn (nhị phân) hiệu quả nhất để engine thực thi sau đó.

Nhiều người đã nỗ lực chẻ sợi tóc làm tư với thuật ngữ này, vì có rất nhiều sắc thái và các câu xen vào kiểu "thực ra thì..." trôi nổi xung quanh. Nhưng về tinh thần và thực tế, những gì engine đang làm trong việc xử lý các chương trình JS **giống việc biên dịch hơn nhiều** so với không.

Phân loại JS là một ngôn ngữ biên dịch không liên quan đến mô hình phân phối cho các biểu diễn thực thi nhị phân (hoặc byte-code) của nó, mà là giữ một sự phân biệt rõ ràng trong tâm trí chúng ta về giai đoạn mà code JS được xử lý và phân tích; giai đoạn này quan sát được và không thể chối cãi xảy ra _trước khi_ code bắt đầu được thực thi.

Chúng ta cần các mô hình tư duy đúng đắn về cách JS engine xử lý code của chúng ta nếu chúng ta muốn hiểu JS và scope một cách hiệu quả.

### Ngôn ngữ của Trình biên dịch (Compiler Speak)

Với nhận thức về hai giai đoạn xử lý của một chương trình JS (biên dịch, sau đó thực thi), hãy chuyển sự chú ý của chúng ta sang cách JS engine xác định các biến và xác định các scope của một chương trình khi nó được biên dịch.

Đầu tiên, hãy xem xét một chương trình JS đơn giản để sử dụng cho phân tích trong vài chương tiếp theo:

```js
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getStudentName(studentID) {
  for (let student of students) {
    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);

console.log(nextStudent);
// Suzy
```

Ngoài các khai báo, tất cả các lần xuất hiện của biến/định danh trong một chương trình đều phục vụ trong một trong hai "vai trò": hoặc chúng là _đích_ (target) của một phép gán hoặc chúng là _nguồn_ (source) của một giá trị.

(Khi tôi lần đầu tiên học lý thuyết biên dịch trong khi lấy bằng khoa học máy tính, tôi đã được dạy các thuật ngữ "LHS" (aka, _target_) và "RHS" (aka, _source_) cho các vai trò này, tương ứng. Như bạn có thể đoán từ chữ "L" và "R", các từ viết tắt có nghĩa là "Left-Hand Side" (Phía bên trái) và "Right-Hand Side" (Phía bên phải), như trong hai bên trái và phải của một toán tử gán `=`. Tuy nhiên, các mục tiêu và nguồn gán không phải lúc nào cũng xuất hiện theo nghĩa đen ở bên trái hoặc phải của dấu `=`, vì vậy có lẽ rõ ràng hơn khi nghĩ theo nghĩa _target_ / _source_ thay vì _left_ / _right_.)

Làm thế nào bạn biết một biến có phải là _target_ không? Kiểm tra xem có giá trị nào đang được gán cho nó không; nếu có, nó là một _target_. Nếu không, thì biến đó là một _source_.

Để JS engine xử lý đúng các biến của chương trình, trước tiên nó phải dán nhãn cho mỗi lần xuất hiện của biến là _target_ hoặc _source_. Bây giờ chúng ta sẽ đào sâu vào cách xác định từng vai trò.

#### Targets

Điều gì làm cho một biến trở thành _target_? Xem xét:

```js
students = [ // ..
```

Câu lệnh này rõ ràng là một hoạt động gán; hãy nhớ rằng, phần `var students` được xử lý hoàn toàn như một khai báo tại thời gian biên dịch, và do đó không liên quan trong quá trình thực thi; chúng tôi đã bỏ qua nó để rõ ràng và tập trung. Tương tự với câu lệnh `nextStudent = getStudentName(73)`.

Nhưng có ba hoạt động gán _target_ khác trong code có lẽ ít rõ ràng hơn. Một trong số đó:

```js
for (let student of students) {
```

Câu lệnh đó gán một giá trị cho `student` cho mỗi lần lặp của vòng lặp. Một tham chiếu _target_ khác:

```js
getStudentName(73);
```

Nhưng làm thế nào đó lại là một phép gán cho một _target_? Nhìn kỹ: đối số `73` được gán cho tham số `studentID`.

Và có một tham chiếu _target_ (tinh tế) cuối cùng trong chương trình của chúng ta. Bạn có thể phát hiện ra nó không?

..

..

..

Bạn đã xác định được cái này chưa?

```js
function getStudentName(studentID) {
```

Một khai báo `function` là một trường hợp đặc biệt của tham chiếu _target_. Bạn có thể nghĩ về nó giống như `var getStudentName = function(studentID)`, nhưng điều đó không hoàn toàn chính xác. Một định danh `getStudentName` được khai báo (tại thời gian biên dịch), nhưng phần `= function(studentID)` cũng được xử lý tại thời gian biên dịch; sự liên kết giữa `getStudentName` và hàm được thiết lập tự động khi bắt đầu scope thay vì chờ đợi một câu lệnh gán `=` được thực thi.

> **LƯU Ý**: Sự liên kết tự động của hàm và biến này được gọi là "function hoisting", và được đề cập chi tiết trong Chương 5.

#### Sources

Vậy chúng ta đã xác định tất cả năm tham chiếu _target_ trong chương trình. Các tham chiếu biến khác sau đó phải là tham chiếu _source_ (vì đó là tùy chọn duy nhất còn lại!).

Trong `for (let student of students)`, chúng ta đã nói rằng `student` là một _target_, nhưng `students` là một tham chiếu _source_. Trong câu lệnh `if (student.id == studentID)`, cả `student` và `studentID` đều là tham chiếu _source_. `student` cũng là một tham chiếu _source_ trong `return student.name`.

Trong `getStudentName(73)`, `getStudentName` là một tham chiếu _source_ (chúng ta hy vọng nó phân giải thành một giá trị tham chiếu hàm). Trong `console.log(nextStudent)`, `console` là một tham chiếu _source_, cũng như `nextStudent`.

> **LƯU Ý**: Trong trường hợp bạn đang thắc mắc, `id`, `name`, và `log` đều là các thuộc tính, không phải tham chiếu biến.

Tầm quan trọng thực tế của việc hiểu _targets_ vs. _sources_ là gì? Trong Chương 2, chúng ta sẽ xem xét lại chủ đề này và đề cập đến việc vai trò của một biến ảnh hưởng như thế nào đến việc tra cứu của nó (cụ thể là nếu việc tra cứu thất bại).

### Gian lận: Sửa đổi Scope tại Runtime (Cheating: Runtime Scope Modifications)

Đến giờ, rõ ràng scope được xác định khi chương trình được biên dịch, và nói chung không nên bị ảnh hưởng bởi các điều kiện runtime. Tuy nhiên, trong non-strict-mode, về mặt kỹ thuật vẫn có hai cách để gian lận quy tắc này, sửa đổi các scopes của chương trình trong quá trình runtime.

Không có kỹ thuật nào trong hai kỹ thuật này _nên_ được sử dụng—cả hai đều nguy hiểm và gây nhầm lẫn, và dù sao bạn cũng nên sử dụng strict-mode (nơi chúng bị cấm). Nhưng điều quan trọng là phải nhận thức được chúng trong trường hợp bạn bắt gặp chúng trong một số chương trình.

Hàm `eval(..)` nhận một chuỗi code để biên dịch và thực thi ngay lập tức trong quá trình runtime của chương trình. Nếu chuỗi code đó có khai báo `var` hoặc `function` trong đó, các khai báo đó sẽ sửa đổi scope hiện tại mà `eval(..)` đang thực thi trong đó:

```js
function badIdea() {
  eval("var oops = 'Ugh!';");
  console.log(oops);
}
badIdea(); // Ugh!
```

Nếu `eval(..)` không hiện diện, biến `oops` trong `console.log(oops)` sẽ không tồn tại, và sẽ ném ra một `ReferenceError`. Nhưng `eval(..)` sửa đổi scope của hàm `badIdea()` tại runtime. Điều này tồi tệ vì nhiều lý do, bao gồm cả việc ảnh hưởng đến hiệu suất của việc sửa đổi scope đã được biên dịch và tối ưu hóa, mỗi khi `badIdea()` chạy.

Cách gian lận thứ hai là từ khóa `with`, về cơ bản biến một object thành một local scope một cách linh hoạt—các thuộc tính của nó được coi là các định danh trong block của scope mới đó:

```js
var badIdea = { oops: "Ugh!" };

with (badIdea) {
  console.log(oops); // Ugh!
}
```

Global scope không bị sửa đổi ở đây, nhưng `badIdea` đã được biến thành một scope tại runtime thay vì thời gian biên dịch, và thuộc tính `oops` của nó trở thành một biến trong scope đó. Một lần nữa, đây là một ý tưởng tồi tệ, vì lý do hiệu suất và khả năng đọc.

Bằng mọi giá, hãy tránh `eval(..)` (ít nhất là `eval(..)` tạo ra các khai báo) và `with`. Một lần nữa, không có kỹ thuật gian lận nào trong số này có sẵn trong strict-mode, vì vậy nếu bạn chỉ sử dụng strict-mode (bạn nên làm vậy!) thì sự cám dỗ sẽ biến mất!

### Lexical Scope

Chúng ta đã chứng minh rằng scope của JS được xác định tại thời gian biên dịch; thuật ngữ cho loại scope này là "lexical scope". "Lexical" liên quan đến giai đoạn "lexing" của quá trình biên dịch, như đã thảo luận trước đó trong chương này.

Để thu hẹp chương này thành một kết luận hữu ích, ý tưởng chính của "lexical scope" là nó được kiểm soát hoàn toàn bởi việc đặt các hàm, blocks, và khai báo biến, trong mối quan hệ với nhau.

Nếu bạn đặt một khai báo biến bên trong một hàm, trình biên dịch xử lý khai báo này khi nó đang phân tích hàm, và liên kết khai báo đó với scope của hàm. Nếu một biến được khai báo block-scope (`let` / `const`), thì nó được liên kết với khối `{ .. }` bao quanh gần nhất, thay vì hàm bao quanh của nó (như với `var`).

Hơn nữa, một tham chiếu (vai trò _target_ hoặc _source_) cho một biến phải được phân giải như đến từ một trong các scopes _có sẵn về mặt từ vựng_ (lexically available) cho nó; nếu không biến được cho là "undeclared" (thường dẫn đến lỗi!). Nếu biến không được khai báo trong scope hiện tại, scope bên ngoài/bao quanh tiếp theo sẽ được tham khảo. Quá trình bước ra một cấp độ lồng nhau của scope này tiếp tục cho đến khi tìm thấy khai báo biến phù hợp, hoặc đạt đến global scope và không còn nơi nào khác để đi.

Điều quan trọng cần lưu ý là việc biên dịch không thực sự _làm bất cứ điều gì_ về mặt dự trữ bộ nhớ cho scopes và biến. Chưa có phần nào của chương trình được thực thi.

Thay vào đó, việc biên dịch tạo ra một bản đồ của tất cả các lexical scopes vạch ra những gì chương trình sẽ cần trong khi nó thực thi. Bạn có thể nghĩ về kế hoạch này như code được chèn vào để sử dụng tại runtime, định nghĩa tất cả các scopes (aka, "lexical environments") và đăng ký tất cả các định danh (biến) cho mỗi scope.

Nói cách khác, trong khi scopes được xác định trong quá trình biên dịch, chúng không thực sự được tạo ra cho đến runtime, mỗi khi một scope cần chạy. Trong chương tiếp theo, chúng ta sẽ phác thảo các nền tảng khái niệm cho lexical scope.

---

## Chương 2: Minh họa Lexical Scope (Illustrating Lexical Scope)

Trong Chương 1, chúng ta đã khám phá cách scope được xác định trong quá trình biên dịch code, một mô hình được gọi là "lexical scope". Thuật ngữ "lexical" đề cập đến giai đoạn đầu tiên của quá trình biên dịch (lexing/parsing).

Để _lý luận_ đúng đắn về các chương trình của chúng ta, điều quan trọng là phải có một nền tảng khái niệm vững chắc về cách scope hoạt động. Nếu chúng ta dựa vào phỏng đoán và trực giác, đôi khi chúng ta có thể vô tình nhận được câu trả lời đúng, nhưng nhiều lần khác chúng ta sẽ sai lệch. Đây không phải là công thức cho sự thành công.

Giống như hồi còn học toán ở trường tiểu học, nhận được câu trả lời đúng là chưa đủ nếu chúng ta không chỉ ra các bước chính xác để đến đó! Chúng ta cần xây dựng các mô hình tư duy chính xác và hữu ích làm nền tảng để tiến về phía trước.

Chương này sẽ minh họa _scope_ với một số phép ẩn dụ. Mục tiêu ở đây là _nghĩ_ về cách chương trình của bạn được xử lý bởi JS engine theo những cách phù hợp hơn với cách JS engine thực sự hoạt động.

### Bi, Xô, và Bong bóng... Ôi chao! (Marbles, and Buckets, and Bubbles... Oh My!)

Một phép ẩn dụ mà tôi thấy hiệu quả trong việc hiểu scope là phân loại các viên bi màu vào các xô có màu tương ứng.

Hãy tưởng tượng bạn bắt gặp một đống bi, và nhận thấy rằng tất cả các viên bi đều có màu đỏ, xanh dương hoặc xanh lá cây. Hãy phân loại tất cả các viên bi, thả những viên màu đỏ vào xô đỏ, xanh lá cây vào xô xanh lá cây, và xanh dương vào xô xanh dương. Sau khi phân loại, khi bạn cần một viên bi xanh lá cây sau đó, bạn đã biết xô xanh lá cây là nơi để lấy nó.

Trong phép ẩn dụ này, các viên bi là các biến trong chương trình của chúng ta. Các xô là các scopes (hàm và khối), chúng ta chỉ gán các màu riêng lẻ về mặt khái niệm cho mục đích thảo luận của chúng ta. Màu của mỗi viên bi do đó được xác định bởi scope _màu_ nào mà chúng ta thấy viên bi được tạo ra ban đầu trong đó.

Hãy chú thích ví dụ chương trình đang chạy từ Chương 1 với các nhãn màu scope:

```js
// outer/global scope: RED

var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getStudentName(studentID) {
  // function scope: BLUE

  for (let student of students) {
    // loop scope: GREEN

    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);
console.log(nextStudent); // Suzy
```

Chúng ta đã chỉ định ba màu scope với các chú thích code: RED (global scope ngoài cùng), BLUE (scope của hàm `getStudentName(..)`), và GREEN (scope của/bên trong vòng lặp `for`). Nhưng vẫn có thể khó nhận ra ranh giới của các xô scope này khi nhìn vào một danh sách code.

Hình 2 giúp hình dung ranh giới của các scopes bằng cách vẽ các bong bóng màu (hay còn gọi là xô) xung quanh mỗi scope:

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig2.png" width="500" alt="Colored Scope Bubbles" align="center">
    <figcaption><em>Hình 2: Các Bong bóng Scope Có màu</em></figcaption>
</figure>

1. **Bong bóng 1** (RED) bao gồm global scope, chứa ba định danh/biến: `students` (dòng 1), `getStudentName` (dòng 8), và `nextStudent` (dòng 16).

2. **Bong bóng 2** (BLUE) bao gồm scope của hàm `getStudentName(..)` (dòng 8), chứa chỉ một định danh/biến: tham số `studentID` (dòng 8).

3. **Bong bóng 3** (GREEN) bao gồm scope của vòng lặp `for` (dòng 9), chứa chỉ một định danh/biến: `student` (dòng 9).

> **LƯU Ý**: Về mặt kỹ thuật, tham số `studentID` không chính xác nằm trong scope BLUE(2). Chúng ta sẽ gỡ rối sự nhầm lẫn đó trong "Implied Scopes" ở Phụ lục A. Hiện tại, coi `studentID` là một viên bi BLUE(2) là đủ gần đúng.

Các bong bóng scope được xác định trong quá trình biên dịch dựa trên nơi các hàm/khối của scope được viết, sự lồng nhau bên trong nhau, v.v. Mỗi bong bóng scope hoàn toàn nằm trong bong bóng scope cha của nó—một scope không bao giờ nằm một phần trong hai scope bên ngoài khác nhau.

Mỗi viên bi (biến/định danh) được tô màu dựa trên bong bóng (xô) nào mà nó được khai báo trong đó, không phải màu của scope mà nó có thể được truy cập từ đó (ví dụ: `students` ở dòng 9 và `studentID` ở dòng 10).

> **LƯU Ý**: Hãy nhớ chúng ta đã khẳng định trong Chương 1 rằng `id`, `name`, và `log` đều là các thuộc tính, không phải biến; nói cách khác, chúng không phải là bi trong xô, vì vậy chúng không được tô màu dựa trên bất kỳ quy tắc nào chúng ta đang thảo luận trong cuốn sách này. Để hiểu cách các truy cập thuộc tính như vậy được xử lý, hãy xem cuốn thứ ba trong loạt sách, _Objects & Classes_.

Khi JS engine xử lý một chương trình (trong quá trình biên dịch), và tìm thấy một khai báo cho một biến, về cơ bản nó sẽ hỏi, "Tôi hiện đang ở trong scope _màu_ nào (bong bóng hoặc xô)?" Biến được chỉ định cùng _màu_ đó, nghĩa là nó thuộc về cái xô/bong bóng đó.

Xô GREEN(3) hoàn toàn nằm lồng bên trong xô BLUE(2), và tương tự xô BLUE(2) hoàn toàn nằm lồng bên trong xô RED(1). Scopes có thể lồng vào nhau như đã thấy, đến bất kỳ độ sâu nào mà chương trình của bạn cần.

Các tham chiếu (không phải khai báo) đến các biến/định danh được cho phép nếu có một khai báo phù hợp hoặc trong scope hiện tại, hoặc bất kỳ scope nào bên trên/bên ngoài scope hiện tại, nhưng không phải với các khai báo từ các scope thấp hơn/lồng nhau.

Một biểu thức trong xô RED(1) chỉ có quyền truy cập vào các viên bi RED(1), **không** phải BLUE(2) hoặc GREEN(3). Một biểu thức trong xô BLUE(2) có thể tham chiếu đến các viên bi BLUE(2) hoặc RED(1), **không** phải GREEN(3). Và một biểu thức trong xô GREEN(3) có quyền truy cập vào các viên bi RED(1), BLUE(2), và GREEN(3).

Chúng ta có thể khái niệm hóa quá trình xác định màu của các viên bi không phải khai báo này trong quá trình runtime như một sự tra cứu (lookup). Vì tham chiếu biến `students` trong câu lệnh vòng lặp `for` ở dòng 9 không phải là một khai báo, nó không có màu. Vì vậy, chúng ta hỏi xô scope BLUE(2) hiện tại xem nó có viên bi nào khớp với tên đó không. Vì nó không có, việc tra cứu tiếp tục với scope bên ngoài/chứa tiếp theo: RED(1). Xô RED(1) có một viên bi tên là `students`, vì vậy tham chiếu biến `students` của câu lệnh vòng lặp được xác định là một viên bi RED(1).

Câu lệnh `if (student.id == studentID)` ở dòng 10 được xác định tương tự để tham chiếu đến một viên bi GREEN(3) tên là `student` và một viên bi BLUE(2) `studentID`.

> **LƯU Ý**: JS engine nói chung không xác định màu của các viên bi này trong quá trình runtime; "việc tra cứu" ở đây là một biện pháp tu từ để giúp bạn hiểu các khái niệm. Trong quá trình biên dịch, hầu hết hoặc tất cả các tham chiếu biến sẽ khớp với các xô scope đã biết, vì vậy màu của chúng đã được xác định, và được lưu trữ với mỗi tham chiếu viên bi để tránh các cuộc tra cứu không cần thiết khi chương trình chạy. Chi tiết hơn về sắc thái này trong Chương 3.

Những điểm chính từ bi & xô (và bong bóng!):

- Các biến được khai báo trong các scopes cụ thể, có thể được coi là các viên bi màu từ các xô có màu tương ứng.

- Bất kỳ tham chiếu biến nào xuất hiện trong scope nơi nó được khai báo, hoặc xuất hiện trong bất kỳ scopes lồng nhau sâu hơn nào, sẽ được dán nhãn là một viên bi cùng màu đó—trừ khi một scope xen vào "shadows" (che khuất) khai báo biến; xem "Shadowing" trong Chương 3.

- Việc xác định các xô màu, và các viên bi chúng chứa, xảy ra trong quá trình biên dịch. Thông tin này được sử dụng cho các cuộc "tra cứu" biến (màu viên bi) trong quá trình thực thi code.

### Một Cuộc Trò Chuyện Giữa Những Người Bạn (A Conversation Among Friends)

Một phép ẩn dụ hữu ích khác cho quá trình phân tích các biến và các scopes mà chúng đến từ là tưởng tượng các cuộc trò chuyện khác nhau diễn ra bên trong engine khi code được xử lý và sau đó được thực thi. Chúng ta có thể "nghe lén" những cuộc trò chuyện này để có nền tảng khái niệm tốt hơn về cách scopes hoạt động.

Bây giờ hãy gặp gỡ các thành viên của JS engine sẽ có các cuộc trò chuyện khi họ xử lý chương trình của chúng ta:

- _Engine_: chịu trách nhiệm biên dịch và thực thi từ đầu đến cuối chương trình JavaScript của chúng ta.

- _Compiler_: một trong những người bạn của _Engine_; xử lý tất cả công việc nặng nhọc của phân tích (parsing) và tạo code (code-generation) (xem phần trước).

- _Scope Manager_: một người bạn khác của _Engine_; thu thập và duy trì danh sách tra cứu của tất cả các biến/định danh đã khai báo, và thực thi một tập hợp các quy tắc về cách chúng có thể truy cập được đối với code đang thực thi hiện tại.

Để bạn _hoàn toàn hiểu_ cách JavaScript hoạt động, bạn cần bắt đầu _nghĩ_ như _Engine_ (và những người bạn) nghĩ, đặt câu hỏi họ hỏi, và trả lời câu hỏi của họ tương tự.

Để khám phá những cuộc trò chuyện này, hãy nhớ lại ví dụ chương trình đang chạy của chúng ta:

```js
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getStudentName(studentID) {
  for (let student of students) {
    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);

console.log(nextStudent);
// Suzy
```

Hãy xem xét cách JS sẽ xử lý chương trình đó, cụ thể bắt đầu với câu lệnh đầu tiên. Mảng và nội dung của nó chỉ là các giá trị JS literals cơ bản (và do đó không bị ảnh hưởng bởi bất kỳ mối quan tâm scoping nào), vì vậy trọng tâm của chúng ta ở đây sẽ là phần khai báo và gán khởi tạo `var students = [ .. ]`.

Chúng ta thường nghĩ về điều đó như một câu lệnh đơn lẻ, nhưng đó không phải là cách người bạn _Engine_ của chúng ta nhìn thấy nó. Thực tế, JS coi chúng là hai hoạt động riêng biệt, một hoạt động mà _Compiler_ sẽ xử lý trong quá trình biên dịch, và hoạt động kia mà _Engine_ sẽ xử lý trong quá trình thực thi.

Điều đầu tiên _Compiler_ sẽ làm với chương trình này là thực hiện lexing để chia nhỏ nó thành các tokens, sau đó nó sẽ phân tích thành một cây (AST).

Khi _Compiler_ đến phần tạo code, có nhiều chi tiết cần xem xét hơn mức có thể thấy rõ. Một giả định hợp lý sẽ là _Compiler_ sẽ tạo code cho câu lệnh đầu tiên như: "Cấp phát bộ nhớ cho một biến, dán nhãn nó là `students`, sau đó gắn một tham chiếu đến mảng vào biến đó." Nhưng đó không phải là toàn bộ câu chuyện.

Dưới đây là các bước _Compiler_ sẽ tuân theo để xử lý câu lệnh đó:

1. Bắt gặp `var students`, _Compiler_ sẽ hỏi _Scope Manager_ xem một biến có tên `students` đã tồn tại cho xô scope cụ thể đó chưa. Nếu có, _Compiler_ sẽ bỏ qua khai báo này và tiếp tục. Nếu không, _Compiler_ sẽ tạo ra code mà (tại thời gian thực thi) yêu cầu _Scope Manager_ tạo một biến mới gọi là `students` trong xô scope đó.

2. _Compiler_ sau đó tạo ra code cho _Engine_ để thực thi sau này, để xử lý phép gán `students = []`. Code mà _Engine_ chạy đầu tiên sẽ hỏi _Scope Manager_ xem có một biến gọi là `students` có thể truy cập được trong xô scope hiện tại hay không. Nếu không, _Engine_ tiếp tục tìm kiếm ở nơi khác (xem "Nested Scope" bên dưới). Khi _Engine_ tìm thấy một biến, nó gán tham chiếu của mảng `[ .. ]` cho nó.

Ở dạng đối thoại, giai đoạn đầu tiên của quá trình biên dịch cho chương trình có thể diễn ra giữa _Compiler_ và _Scope Manager_ như thế này:

> **_Compiler_**: Này, _Scope Manager_ (của global scope), tôi tìm thấy một khai báo chính thức cho một định danh gọi là `students`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Chưa, chưa bao giờ nghe về nó, vì vậy tôi vừa tạo nó cho bạn.

> **_Compiler_**: Này, _Scope Manager_, tôi tìm thấy một khai báo chính thức cho một định danh gọi là `getStudentName`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Chưa, nhưng tôi vừa tạo nó cho bạn.

> **_Compiler_**: Này, _Scope Manager_, `getStudentName` trỏ đến một hàm, vì vậy chúng ta cần một xô scope mới.

> **_(Function) Scope Manager_**: Hiểu rồi, đây là xô scope.

> **_Compiler_**: Này, _Scope Manager_ (của hàm), tôi tìm thấy một khai báo tham số chính thức cho `studentID`, đã từng nghe về nó chưa?

> **_(Function) Scope Manager_**: Chưa, nhưng bây giờ nó đã được tạo trong scope này.

> **_Compiler_**: Này, _Scope Manager_ (của hàm), tôi tìm thấy một vòng lặp `for` sẽ cần xô scope riêng của nó.

> ...

Cuộc trò chuyện là một cuộc trao đổi hỏi đáp, trong đó **Compiler** hỏi _Scope Manager_ hiện tại xem một khai báo định danh đã gặp có đã được gặp trước đó chưa. Nếu "chưa," _Scope Manager_ tạo biến đó trong scope đó. Nếu câu trả lời là "rồi," thì nó được bỏ qua một cách hiệu quả vì không còn gì để _Scope Manager_ đó làm nữa.

_Compiler_ cũng báo hiệu khi nó chạy qua các hàm hoặc block scopes, để một xô scope mới và _Scope Manager_ có thể được khởi tạo.

Sau đó, khi nói đến việc thực thi chương trình, cuộc trò chuyện sẽ chuyển sang _Engine_ và _Scope Manager_, và có thể diễn ra như thế này:

> **_Engine_**: Này, _Scope Manager_ (của global scope), trước khi chúng ta bắt đầu, bạn có thể tra cứu định danh `getStudentName` để tôi có thể gán hàm này cho nó không?

> **_(Global) Scope Manager_**: Ừ, biến đây.

> **_Engine_**: Này, _Scope Manager_, tôi tìm thấy một tham chiếu _target_ cho `students`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Có, nó đã được khai báo chính thức cho scope này, nên nó đây.

> **_Engine_**: Cảm ơn, tôi đang khởi tạo `students` thành `undefined`, vì vậy nó sẵn sàng để sử dụng.

> Này, _Scope Manager_ (của global scope), tôi tìm thấy một tham chiếu _target_ cho `nextStudent`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Có, nó đã được khai báo chính thức cho scope này, nên nó đây.

> **_Engine_**: Cảm ơn, tôi đang khởi tạo `nextStudent` thành `undefined`, vì vậy nó sẵn sàng để sử dụng.

> Này, _Scope Manager_ (của global scope), tôi tìm thấy một tham chiếu _source_ cho `getStudentName`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Có, nó đã được khai báo chính thức cho scope này. Nó đây.

> **_Engine_**: Tuyệt, giá trị trong `getStudentName` là một hàm, vì vậy tôi sẽ thực thi nó.

> **_Engine_**: Này, _Scope Manager_, bây giờ chúng ta cần khởi tạo scope của hàm.

> ...

Cuộc trò chuyện này là một cuộc trao đổi hỏi đáp khác, trong đó _Engine_ trước tiên yêu cầu _Scope Manager_ hiện tại tra cứu định danh `getStudentName` đã được hoisted, để liên kết hàm với nó. _Engine_ sau đó tiến hành hỏi _Scope Manager_ về tham chiếu _target_ cho `students`, và v.v.

Để xem xét và tóm tắt cách một câu lệnh như `var students = [ .. ]` được xử lý, trong hai bước riêng biệt:

1. _Compiler_ thiết lập khai báo biến scope (vì nó chưa được khai báo trước đó trong scope hiện tại).

2. Trong khi _Engine_ đang thực thi, để xử lý phần gán của câu lệnh, _Engine_ yêu cầu _Scope Manager_ tra cứu biến, khởi tạo nó thành `undefined` để nó sẵn sàng sử dụng, và sau đó gán giá trị mảng cho nó.

### Nested Scope

Khi đến lúc thực thi hàm `getStudentName()`, _Engine_ yêu cầu một instance _Scope Manager_ cho scope của hàm đó, và sau đó nó sẽ tiến hành tra cứu tham số (`studentID`) để gán giá trị đối số `73` cho nó, và v.v.

Function scope cho `getStudentName(..)` được lồng bên trong global scope. Block scope của vòng lặp `for` tương tự được lồng bên trong function scope đó. Scopes có thể được lồng về mặt từ vựng đến bất kỳ độ sâu tùy ý nào mà chương trình xác định.

Mỗi scope nhận được instance _Scope Manager_ riêng mỗi khi scope đó được thực thi (một hoặc nhiều lần). Mỗi scope tự động có tất cả các định danh của nó được đăng ký khi bắt đầu scope được thực thi (điều này được gọi là "variable hoisting"; xem Chương 5).

Khi bắt đầu một scope, nếu bất kỳ định danh nào đến từ một khai báo `function`, biến đó sẽ tự động được khởi tạo với tham chiếu hàm liên quan của nó. Và nếu bất kỳ định danh nào đến từ một khai báo `var` (trái ngược với `let`/`const`), biến đó sẽ tự động được khởi tạo thành `undefined` để nó có thể được sử dụng; nếu không, biến vẫn chưa được khởi tạo (aka, trong "TDZ" của nó, xem Chương 5) và không thể được sử dụng cho đến khi việc khai báo và khởi tạo đầy đủ của nó được thực thi.

Trong câu lệnh `for (let student of students) {`, `students` là một tham chiếu _source_ phải được tra cứu. Nhưng việc tra cứu đó sẽ được xử lý như thế nào, vì scope của hàm sẽ không tìm thấy định danh như vậy?

Để giải thích, hãy tưởng tượng đoạn hội thoại đó diễn ra như sau:

> **_Engine_**: Này, _Scope Manager_ (cho hàm), tôi có một tham chiếu _source_ cho `students`, đã từng nghe về nó chưa?

> **_(Function) Scope Manager_**: Chưa, chưa bao giờ nghe về nó. Thử scope bên ngoài tiếp theo xem.

> **_Engine_**: Này, _Scope Manager_ (cho global scope), tôi có một tham chiếu _source_ cho `students`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Có, nó đã được khai báo chính thức, nó đây.

> ...

Một trong những khía cạnh chính của lexical scope là bất cứ khi nào một tham chiếu định danh không thể tìm thấy trong scope hiện tại, scope bên ngoài tiếp theo trong việc lồng ghép sẽ được tham khảo; quá trình đó được lặp lại cho đến khi tìm thấy câu trả lời hoặc không còn scope nào để tham khảo nữa.

#### Lỗi Tra cứu (Lookup Failures)

Khi _Engine_ đã dùng hết tất cả các scopes _có sẵn về mặt từ vựng_ (di chuyển ra ngoài) và vẫn không thể giải quyết việc tra cứu một định danh, một điều kiện lỗi sau đó tồn tại. Tuy nhiên, tùy thuộc vào chế độ của chương trình (strict-mode hay không) và vai trò của biến (tức là _target_ vs. _source_; xem Chương 1), điều kiện lỗi này sẽ được xử lý khác nhau.

**Mớ hỗn độn Undefined (Undefined Mess)**

Nếu biến là một _source_, một tra cứu định danh không được giải quyết được coi là một biến chưa được khai báo (không biết, thiếu), điều này luôn dẫn đến việc ném ra một `ReferenceError`. Ngoài ra, nếu biến là một _target_, và code tại thời điểm đó đang chạy trong strict-mode, biến được coi là chưa được khai báo và tương tự cũng ném ra một `ReferenceError`.

Thông báo lỗi cho một tình trạng biến chưa được khai báo, trong hầu hết các môi trường JS, sẽ trông giống như, "Reference Error: XYZ is not defined." Cụm từ "not defined" (không được định nghĩa) có vẻ gần như giống hệt với từ "undefined" (không xác định), theo như ngôn ngữ tiếng Anh. Nhưng hai điều này rất khác nhau trong JS, và thông báo lỗi này thật không may tạo ra một sự nhầm lẫn dai dẳng.

"Not defined" thực sự có nghĩa là "not declared" (không được khai báo)—hoặc, đúng hơn là "undeclared" (chưa được khai báo), như trong một biến không có khai báo chính thức phù hợp trong bất kỳ scope _có sẵn về mặt từ vựng_ nào. Ngược lại, "undefined" thực sự có nghĩa là một biến đã được tìm thấy (đã khai báo), nhưng biến đó hiện không có giá trị nào khác, vì vậy nó mặc định là giá trị `undefined`.

Để duy trì sự nhầm lẫn thậm chí còn xa hơn, toán tử `typeof` của JS trả về chuỗi `"undefined"` cho các tham chiếu biến ở cả hai trạng thái:

```js
var studentName;
typeof studentName; // "undefined"

typeof doesntExist; // "undefined"
```

Hai tham chiếu biến này ở trong các điều kiện rất khác nhau, nhưng JS chắc chắn làm vẩn đục nước. Mớ hỗn độn thuật ngữ này gây nhầm lẫn và cực kỳ đáng tiếc. Thật không may, các nhà phát triển JS chỉ cần chú ý kỹ để không nhầm lẫn _loại_ "undefined" nào họ đang đối phó!

**Global... Cái gì!? (Global... What!?)**

Nếu biến là một _target_ và strict-mode không có hiệu lực, một hành vi cũ đáng ngạc nhiên và khó hiểu sẽ xuất hiện. Kết quả phiền toái là _Scope Manager_ của global scope sẽ chỉ tạo ra một **biến toàn cục tình cờ** (accidental global variable) để hoàn thành phép gán target đó!

Xem xét:

```js
function getStudentName() {
  // gán cho một biến chưa được khai báo :(
  nextStudent = "Suzy";
}

getStudentName();

console.log(nextStudent);
// "Suzy" -- oops, một biến toàn cục tình cờ!
```

Đây là cách _cuộc trò chuyện_ đó sẽ tiếp tục:

> **_Engine_**: Này, _Scope Manager_ (cho hàm), tôi có một tham chiếu _target_ cho `nextStudent`, đã từng nghe về nó chưa?

> **_(Function) Scope Manager_**: Chưa, chưa bao giờ nghe về nó. Thử scope bên ngoài tiếp theo xem.

> **_Engine_**: Này, _Scope Manager_ (cho global scope), tôi có một tham chiếu _target_ cho `nextStudent`, đã từng nghe về nó chưa?

> **_(Global) Scope Manager_**: Chưa, nhưng vì chúng ta đang ở non-strict-mode, tôi đã giúp bạn và vừa tạo một biến toàn cục cho bạn, nó đây!

Kinh khủng.

Loại tai nạn này (gần như chắc chắn sẽ dẫn đến lỗi cuối cùng) là một ví dụ tuyệt vời về các biện pháp bảo vệ có lợi được cung cấp bởi strict-mode, và tại sao nó là một ý tưởng tồi tệ khi _không_ sử dụng strict-mode. Trong strict-mode, **_Global Scope Manager_** thay vào đó sẽ trả lời:

> **_(Global) Scope Manager_**: Chưa, chưa bao giờ nghe về nó. Xin lỗi, tôi phải ném ra một `ReferenceError`.

Gán cho một biến chưa bao giờ được khai báo _là_ một lỗi, vì vậy thật đúng đắn khi chúng ta nhận được một `ReferenceError` ở đây.

Đừng bao giờ dựa vào các biến toàn cục tình cờ. Luôn sử dụng strict-mode, và luôn khai báo chính thức các biến của bạn. Sau đó, bạn sẽ nhận được một `ReferenceError` hữu ích nếu bạn vô tình cố gắng gán cho một biến chưa được khai báo.

#### Xây Dựng Trên Các Phép Ẩn Dụ (Building On Metaphors)

Để hình dung độ phân giải scope lồng nhau, tôi thích một phép ẩn dụ khác, một tòa nhà văn phòng, như trong Hình 3:

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig3.png" width="250" alt="Scope &quot;Building&quot;" align="center">
    <figcaption><em>Hình 3: "Tòa nhà" Scope</em></figcaption>
    <br><br>
</figure>

Tòa nhà đại diện cho bộ sưu tập scope lồng nhau của chương trình của chúng ta. Tầng đầu tiên của tòa nhà đại diện cho scope đang thực thi hiện tại. Tầng cao nhất của tòa nhà là global scope.

Bạn giải quyết một tham chiếu biến _target_ hoặc _source_ bằng cách trước tiên tìm kiếm ở tầng hiện tại, và nếu bạn không tìm thấy nó, hãy đi thang máy lên tầng tiếp theo (tức là, một scope bên ngoài), nhìn vào đó, sau đó là tầng tiếp theo, và v.v. Khi bạn lên đến tầng cao nhất (global scope), bạn hoặc tìm thấy những gì bạn đang tìm kiếm, hoặc bạn không. Nhưng bạn phải dừng lại bất kể thế nào.

### Tiếp Tục Cuộc Trò Chuyện (Continue the Conversation)

Đến thời điểm này, bạn nên phát triển các mô hình tư duy phong phú hơn cho những gì scope là và cách JS engine xác định và sử dụng nó từ code của bạn.

Trước khi _tiếp tục_, hãy đi tìm một số code trong một trong các dự án của bạn và chạy qua các cuộc trò chuyện này. Nghiêm túc đấy, hãy thực sự nói to. Tìm một người bạn và thực hành từng vai trò với họ. Nếu một trong hai bạn thấy mình bối rối hoặc vấp ngã, hãy dành nhiều thời gian hơn để xem lại tài liệu này.

Khi chúng ta di chuyển (lên) chương (bên ngoài) tiếp theo, chúng ta sẽ khám phá cách các lexical scopes của một chương trình được kết nối trong một chuỗi.

---

## Chương 3: Chuỗi Scope (The Scope Chain)

Chương 1 và 2 đã đặt ra một định nghĩa cụ thể về _lexical scope_ (và các phần của nó) và minh họa các phép ẩn dụ hữu ích cho nền tảng khái niệm của nó. Trước khi tiếp tục chương này, hãy tìm người khác để giải thích (viết hoặc nói to), bằng lời của riêng bạn, lexical scope là gì và tại sao nó hữu ích để hiểu.

Đó có vẻ như là một bước bạn có thể bỏ qua, nhưng tôi thấy nó thực sự giúp dành thời gian để xây dựng lại các ý tưởng này như những lời giải thích cho người khác. Điều đó giúp não bộ của chúng ta tiêu hóa những gì chúng ta đang học!

Bây giờ là lúc đào sâu vào các chi tiết cốt lõi, vì vậy hãy mong đợi rằng mọi thứ sẽ trở nên chi tiết hơn nhiều từ đây trở đi. Tuy nhiên, hãy kiên trì với nó, bởi vì những cuộc thảo luận này thực sự nhấn mạnh việc tất cả chúng ta _không biết_ bao nhiêu về scope. Hãy chắc chắn dành thời gian của bạn với văn bản và tất cả các đoạn mã được cung cấp.

Để làm mới bối cảnh của ví dụ đang chạy của chúng ta, hãy nhớ lại minh họa được mã hóa màu của các bong bóng scope lồng nhau, từ Chương 2, Hình 2:

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig2.png" width="500" alt="Colored Scope Bubbles" align="center">
    <figcaption><em>Hình 2 (Ch. 2): Các Bong bóng Scope Có màu</em></figcaption>
    <br><br>
</figure>

Các kết nối giữa các scopes được lồng trong các scopes khác được gọi là chuỗi scope (scope chain), xác định đường dẫn mà các biến có thể được truy cập. Chuỗi này có hướng, nghĩa là việc tra cứu chỉ di chuyển lên trên/ra ngoài.

### "Tra Cứu" Là (Chủ Yếu) Về Khái Niệm ("Lookup" Is (Mostly) Conceptual)

Trong Hình 2, hãy chú ý màu của tham chiếu biến `students` trong vòng lặp `for`. Chính xác thì chúng ta đã xác định nó là một viên bi RED(1) như thế nào?

Trong Chương 2, chúng ta đã mô tả quyền truy cập runtime của một biến như một "cuộc tra cứu" (lookup), nơi _Engine_ phải bắt đầu bằng cách hỏi _Scope Manager_ của scope hiện tại xem nó có biết về một định danh/biến nào không, và tiến hành đi ngược lên/ra ngoài thông qua chuỗi các scopes lồng nhau (về phía global scope) cho đến khi tìm thấy, nếu có. Việc tra cứu dừng lại ngay khi tìm thấy khai báo được đặt tên phù hợp đầu tiên trong một xô scope.

Quá trình tra cứu do đó đã xác định rằng `students` là một viên bi RED(1), bởi vì chúng ta chưa tìm thấy tên biến phù hợp nào khi chúng ta đi qua chuỗi scope, cho đến khi chúng ta đến global scope RED(1) cuối cùng.

Tương tự, `studentID` trong câu lệnh `if` được xác định là một viên bi BLUE(2).

Gợi ý này về một quá trình tra cứu runtime hoạt động tốt cho sự hiểu biết về khái niệm, nhưng thực tế đó không phải là cách mọi thứ thường hoạt động trong thực tế.

Màu của xô của một viên bi (hay còn gọi là thông tin meta về scope mà một biến bắt nguồn) _thường được xác định_ trong quá trình xử lý biên dịch ban đầu. Bởi vì lexical scope khá nhiều đã được hoàn thiện tại điểm đó, màu của một viên bi sẽ không thay đổi dựa trên bất cứ điều gì có thể xảy ra sau đó trong quá trình runtime.

Vì màu của viên bi được biết từ khi biên dịch, và nó là bất biến, thông tin này có thể sẽ được lưu trữ với (hoặc ít nhất là có thể truy cập từ) mục nhập của mỗi biến trong AST; thông tin đó sau đó được sử dụng một cách rõ ràng bởi các hướng dẫn thực thi tạo nên runtime của chương trình.

Nói cách khác, _Engine_ (từ Chương 2) không cần phải tra cứu qua một loạt các scopes để tìm ra xô scope nào mà một biến đến từ. Thông tin đó đã được biết! Tránh sự cần thiết cho một cuộc tra cứu runtime là một lợi ích tối ưu hóa chính của lexical scope. Runtime hoạt động hiệu quả hơn mà không tốn thời gian cho tất cả các cuộc tra cứu này.

Nhưng tôi đã nói "...thường được xác định..." chỉ một lát trước, liên quan đến việc tìm ra màu của một viên bi trong quá trình biên dịch. Vì vậy, trong trường hợp nào nó sẽ _không_ được biết trong quá trình biên dịch?

Xem xét một tham chiếu đến một biến không được khai báo trong bất kỳ scopes _có sẵn về mặt từ vựng_ nào trong file hiện tại—xem _Get Started_, Chương 1, khẳng định rằng mỗi file là chương trình riêng biệt của nó từ quan điểm của biên dịch JS. Nếu không tìm thấy khai báo nào, đó không _nhất thiết_ là một lỗi. Một file (chương trình) khác trong runtime thực sự có thể khai báo biến đó trong global scope được chia sẻ.

Vì vậy, sự xác định cuối cùng về việc liệu biến có bao giờ được khai báo thích hợp trong một số xô có thể truy cập hay không có thể cần phải hoãn lại đến runtime.

Bất kỳ tham chiếu đến một biến nào ban đầu là _chưa được khai báo_ (undeclared) được để lại như một viên bi chưa có màu trong quá trình biên dịch của file đó; màu này không thể được xác định cho đến khi (các) file liên quan khác đã được biên dịch và runtime ứng dụng bắt đầu. Cuộc tra cứu bị hoãn lại đó cuối cùng sẽ giải quyết màu cho bất kỳ scope nào mà biến được tìm thấy trong đó (có thể là global scope).

Tuy nhiên, cuộc tra cứu này sẽ chỉ cần thiết tối đa một lần cho mỗi biến, vì không có gì khác trong quá trình runtime có thể thay đổi màu của viên bi đó sau này.

Phần "Lỗi Tra cứu" trong Chương 2 bao gồm những gì xảy ra nếu một viên bi cuối cùng vẫn chưa có màu tại thời điểm tham chiếu của nó được thực thi runtime.

### Shadowing (Che Bóng/Che Khuất)

"Shadowing" có thể nghe có vẻ bí ẩn và hơi sơ sài. Nhưng đừng lo lắng, nó hoàn toàn hợp pháp!

Ví dụ đang chạy của chúng ta cho các chương này sử dụng các tên biến khác nhau qua các ranh giới scope. Vì tất cả chúng đều có tên duy nhất, theo một cách nào đó, sẽ không thành vấn đề nếu tất cả chúng chỉ được lưu trữ trong một xô (như RED(1)).

Nơi việc có các xô lexical scope khác nhau bắt đầu quan trọng hơn là khi bạn có hai hoặc nhiều biến, mỗi biến trong các scopes khác nhau, với cùng tên lexical. Một scope đơn lẻ không thể có hai hoặc nhiều biến cùng tên; các tham chiếu nhiều lần như vậy sẽ được giả định chỉ là một biến.

Vì vậy, nếu bạn cần duy trì hai hoặc nhiều biến cùng tên, bạn phải sử dụng các scopes riêng biệt (thường là lồng nhau). Và trong trường hợp đó, rất có liên quan đến việc các xô scope khác nhau được bố trí như thế nào.

Xem xét:

```js
var studentName = "Suzy";

function printStudent(studentName) {
  studentName = studentName.toUpperCase();
  console.log(studentName);
}

printStudent("Frank");
// FRANK

printStudent(studentName);
// SUZY

console.log(studentName);
// Suzy
```

> **MẸO**: Trước khi bạn tiếp tục, hãy dành chút thời gian để phân tích code này bằng cách sử dụng các kỹ thuật/phép ẩn dụ khác nhau mà chúng ta đã đề cập trong cuốn sách. Cụ thể, hãy chắc chắn xác định màu viên bi/bong bóng trong đoạn trích này. Đó là sự thực hành tốt!

Biến `studentName` ở dòng 1 (câu lệnh `var studentName = ..`) tạo ra một viên bi RED(1). Biến cùng tên được khai báo là một viên bi BLUE(2) ở dòng 3, tham số trong định nghĩa hàm `printStudent(..)`.

Viên bi `studentName` sẽ có màu gì trong câu lệnh gán `studentName = studentName.toUpperCase()` và câu lệnh `console.log(studentName)`? Cả ba tham chiếu `studentName` sẽ là BLUE(2).

Với khái niệm về "tra cứu", chúng ta đã khẳng định rằng nó bắt đầu với scope hiện tại và làm việc theo cách của nó ra ngoài/lên trên, dừng lại ngay khi tìm thấy một biến phù hợp. `studentName` BLUE(2) được tìm thấy ngay lập tức. `studentName` RED(1) thậm chí không bao giờ được xem xét.

Đây là một khía cạnh chính của hành vi lexical scope, được gọi là _shadowing_. Biến `studentName` BLUE(2) (tham số) shadows (che khuất) `studentName` RED(1). Vì vậy, tham số đang che khuất biến toàn cục (bị che khuất). Lặp lại câu đó với chính bạn một vài lần để đảm bảo bạn nắm rõ thuật ngữ!

Đó là lý do tại sao việc gán lại `studentName` chỉ ảnh hưởng đến biến bên trong (tham số): `studentName` BLUE(2), không phải `studentName` RED(1) toàn cục.

Khi bạn chọn shadow một biến từ một scope bên ngoài, một tác động trực tiếp là từ scope đó vào trong/xuống dưới (thông qua bất kỳ scopes lồng nhau nào), bây giờ không thể có bất kỳ viên bi nào được tô màu như biến bị che khuất—(RED(1), trong trường hợp này). Nói cách khác, bất kỳ tham chiếu định danh `studentName` nào cũng sẽ tương ứng với biến tham số đó, không bao giờ là biến `studentName` toàn cục. Về mặt từ vựng, không thể tham chiếu `studentName` toàn cục ở bất cứ đâu bên trong hàm `printStudent(..)` (hoặc từ bất kỳ scopes lồng nhau nào).

#### Thủ thuật Unshadowing Toàn cục (Global Unshadowing Trick)

Xin hãy cẩn thận: tận dụng kỹ thuật mà tôi sắp mô tả không phải là thực hành tốt lắm, vì nó bị hạn chế về tiện ích, gây nhầm lẫn cho người đọc code của bạn, và có khả năng mời gọi lỗi cho chương trình của bạn. Tôi chỉ đề cập đến nó bởi vì bạn có thể bắt gặp hành vi này trong các chương trình hiện có, và hiểu những gì đang xảy ra là rất quan trọng để không bị vấp ngã.

_Có_ thể truy cập một biến toàn cục từ một scope nơi biến đó đã bị shadow, nhưng không thông qua một tham chiếu định danh lexical điển hình.

Trong global scope (RED(1)), các khai báo `var` và `function` cũng tự lộ diện dưới dạng các thuộc tính (cùng tên với định danh) trên _global object_—về cơ bản là một đại diện object của global scope. Nếu bạn đã viết JS cho môi trường trình duyệt, có lẽ bạn nhận ra global object là `window`. Điều đó không _hoàn toàn_ chính xác, nhưng đủ tốt cho cuộc thảo luận của chúng ta. Trong chương tiếp theo, chúng ta sẽ khám phá chủ đề global scope/object nhiều hơn.

Xem xét chương trình này, được thực thi cụ thể dưới dạng tệp .js độc lập trong môi trường trình duyệt:

```js
var studentName = "Suzy";

function printStudent(studentName) {
  console.log(studentName);
  console.log(window.studentName);
}

printStudent("Frank");
// "Frank"
// "Suzy"
```

Chú ý tham chiếu `window.studentName`? Biểu thức này đang truy cập biến `studentName` toàn cục như một thuộc tính trên `window` (mà chúng ta đang giả vờ hiện tại là đồng nghĩa với global object). Đó là cách duy nhất để truy cập một biến bị shadow từ bên trong một scope nơi biến shadow đang hiện diện.

`window.studentName` là một tấm gương của biến `studentName` toàn cục, không phải là một bản sao chụp nhanh riêng biệt. Thay đổi đối với một cái vẫn được nhìn thấy từ cái kia, theo cả hai hướng. Bạn có thể nghĩ về `window.studentName` như một getter/setter truy cập biến `studentName` thực tế. Trên thực tế, bạn thậm chí có thể _thêm_ một biến vào global scope bằng cách tạo/đặt một thuộc tính trên global object.

> **CẢNH BÁO**: Hãy nhớ: chỉ vì bạn _có thể_ không có nghĩa là bạn _nên_. Đừng shadow một biến toàn cục mà bạn cần truy cập, và ngược lại, tránh sử dụng thủ thuật này để truy cập một biến toàn cục mà bạn đã shadow. Và chắc chắn đừng làm người đọc code của bạn bối rối bằng cách tạo các biến toàn cục dưới dạng thuộc tính `window` thay vì với các khai báo chính thức!

"Thủ thuật" nhỏ này chỉ hoạt động để truy cập một biến global scope (không phải một biến bị shadow từ một scope lồng nhau), và thậm chí sau đó, chỉ một biến được khai báo với `var` hoặc `function`.

Các hình thức khai báo global scope khác không tạo ra các thuộc tính global object được phản chiếu:

```js
var one = 1;
let notOne = 2;
const notTwo = 3;
class notThree {}

console.log(window.one); // 1
console.log(window.notOne); // undefined
console.log(window.notTwo); // undefined
console.log(window.notThree); // undefined
```

Các biến (bất kể chúng được khai báo như thế nào!) tồn tại trong bất kỳ scope nào khác ngoài global scope đều hoàn toàn không thể truy cập được từ một scope nơi chúng đã bị shadow:

```js
var special = 42;

function lookingFor(special) {
  // Định danh `special` (tham số) trong scope này
  // bị shadow bên trong keepLooking(), và
  // do đó không thể truy cập từ scope đó.

  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(window.special);
  }

  keepLooking();
}

lookingFor(112358132134);
// 3.141592
// 42
```

Biến `special` RED(1) toàn cục bị shadow bởi biến `special` BLUE(2) (tham số), và biến `special` BLUE(2) chính nó bị shadow bởi biến `special` GREEN(3) bên trong `keepLooking()`. Chúng ta vẫn có thể truy cập `special` RED(1) bằng cách sử dụng tham chiếu gián tiếp `window.special`. Nhưng không có cách nào để `keepLooking()` truy cập `special` BLUE(2) đang giữ số `112358132134`.

#### Sao chép Không phải là Truy cập (Copying Is Not Accessing)

Tôi đã được hỏi câu hỏi "Nhưng còn... thì sao?" hàng tá lần. Xem xét:

```js
var special = 42;

function lookingFor(special) {
  var another = {
    special: special,
  };

  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(another.special); // Ooo, lắt léo!
    console.log(window.special);
  }

  keepLooking();
}

lookingFor(112358132134);
// 3.141592
// 112358132134
// 42
```

Ồ! Vậy kỹ thuật object `another` này có bác bỏ tuyên bố của tôi rằng tham số `special` là "hoàn toàn không thể truy cập" từ bên trong `keepLooking()` không? Không, tuyên bố đó vẫn đúng.

`special: special` đang sao chép giá trị của biến tham số `special` vào một thùng chứa khác (một thuộc tính cùng tên). Tất nhiên, nếu bạn đặt một giá trị vào một thùng chứa khác, shadowing không còn áp dụng nữa (trừ khi `another` cũng bị shadow!). Nhưng điều đó không có nghĩa là chúng ta đang truy cập tham số `special`; nó có nghĩa là chúng ta đang truy cập bản sao của giá trị mà nó có tại thời điểm đó, thông qua _một_ thùng chứa khác (thuộc tính object). Chúng ta không thể gán lại tham số `special` BLUE(2) thành một giá trị khác từ bên trong `keepLooking()`.

Một câu hỏi "Nhưng mà...!?" khác bạn có thể sắp nêu ra: điều gì sẽ xảy ra nếu tôi đã sử dụng objects hoặc arrays làm giá trị thay vì các số (`112358132134`, v.v.)? Việc chúng ta có các tham chiếu đến objects hay vì bản sao của các giá trị nguyên thủy có "sửa chữa" tính không thể truy cập không?

Không. Đột biến nội dung của giá trị object thông qua một bản sao tham chiếu **không** giống như việc truy cập biến đó về mặt từ vựng. Chúng ta vẫn không thể gán lại tham số `special` BLUE(2).

#### Shadowing Bất hợp pháp (Illegal Shadowing)

Không phải tất cả các kết hợp của shadowing khai báo đều được phép. `let` có thể shadow `var`, nhưng `var` không thể shadow `let`:

```js
function something() {
  var special = "JavaScript";

  {
    let special = 42; // shadowing hoàn toàn ổn

    // ..
  }
}

function another() {
  // ..

  {
    let special = "JavaScript";

    {
      var special = "JavaScript";
      // ^^^ Syntax Error

      // ..
    }
  }
}
```

Chú ý trong hàm `another()`, khai báo `var special` bên trong đang cố gắng khai báo một `special` trên toàn hàm, bản thân nó và chính nó là ổn (như được hiển thị bởi hàm `something()`).

Mô tả lỗi cú pháp trong trường hợp này chỉ ra rằng `special` đã được định nghĩa, nhưng thông báo lỗi đó hơi gây hiểu lầm—một lần nữa, không có lỗi như vậy xảy ra trong `something()`, vì shadowing thường được cho phép.

Lý do thực sự nó được nêu ra như một `SyntaxError` là bởi vì `var` về cơ bản đang cố gắng "vượt qua ranh giới" của (hoặc nhảy qua) khai báo `let` cùng tên, điều này không được phép.

Việc cấm vượt qua ranh giới đó dừng lại một cách hiệu quả ở mỗi ranh giới hàm, vì vậy biến thể này không gây ra ngoại lệ nào:

```js
function another() {
  // ..

  {
    let special = "JavaScript";

    ajax("https://some.url", function callback() {
      // shadowing hoàn toàn ổn
      var special = "JavaScript";

      // ..
    });
  }
}
```

Tóm tắt: `let` (trong một scope bên trong) luôn có thể shadow `var` của một scope bên ngoài. `var` (trong một scope bên trong) chỉ có thể shadow `let` của một scope bên ngoài nếu có một ranh giới hàm ở giữa.

### Scope Tên Hàm (Function Name Scope)

Như bạn đã thấy, một khai báo `function` trông như thế này:

```js
function askQuestion() {
  // ..
}
```

Và như đã thảo luận trong các Chương 1 và 2, một khai báo `function` như vậy sẽ tạo ra một định danh trong scope bao quanh (trong trường hợp này là global scope) có tên `askQuestion`.

Còn chương trình này thì sao?

```js
var askQuestion = function () {
  // ..
};
```

Điều tương tự cũng đúng đối với biến `askQuestion` được tạo. Nhưng vì nó là một biểu thức `function`—một định nghĩa hàm được sử dụng như giá trị thay vì một khai báo độc lập—bản thân hàm sẽ không "hoist" (xem Chương 5).

Một sự khác biệt lớn giữa các khai báo `function` và các biểu thức `function` là điều gì xảy ra với định danh tên của hàm. Xem xét một biểu thức `function` được đặt tên:

```js
var askQuestion = function ofTheTeacher() {
  // ..
};
```

Chúng ta biết `askQuestion` kết thúc ở scope bên ngoài. Nhưng còn định danh `ofTheTeacher` thì sao? Đối với các khai báo `function` chính thức, định danh tên kết thúc ở scope bên ngoài/bao quanh, vì vậy có thể hợp lý khi cho rằng đó là trường hợp ở đây. Nhưng `ofTheTeacher` được khai báo là một định danh **bên trong chính hàm đó**:

```js
var askQuestion = function ofTheTeacher() {
  console.log(ofTheTeacher);
};

askQuestion();
// function ofTheTeacher()...

console.log(ofTheTeacher);
// ReferenceError: ofTheTeacher is not defined
```

> **LƯU Ý**: Thực ra, `ofTheTeacher` không chính xác _nằm trong scope của hàm_. Phụ lục A, "Implied Scopes" sẽ giải thích thêm.

Không chỉ `ofTheTeacher` được khai báo bên trong hàm thay vì bên ngoài, mà nó còn được định nghĩa là read-only (chỉ đọc):

```js
var askQuestion = function ofTheTeacher() {
  "use strict";
  ofTheTeacher = 42; // TypeError

  //..
};

askQuestion();
// TypeError
```

Bởi vì chúng ta đã sử dụng strict-mode, lỗi gán được báo cáo là một `TypeError`; trong non-strict-mode, việc gán như vậy thất bại âm thầm mà không có ngoại lệ.

Còn khi một biểu thức `function` không có định danh tên thì sao?

```js
var askQuestion = function () {
  // ..
};
```

Một biểu thức `function` với một định danh tên được gọi là "named function expression" (biểu thức hàm có tên), nhưng một biểu thức không có định danh tên được gọi là "anonymous function expression" (biểu thức hàm ẩn danh). Các biểu thức hàm ẩn danh rõ ràng không có định danh tên nào ảnh hưởng đến cả hai scope.

> **LƯU Ý**: Chúng ta sẽ thảo luận về các biểu thức `function` có tên vs. ẩn danh chi tiết hơn nhiều, bao gồm các yếu tố ảnh hưởng đến quyết định sử dụng cái này hay cái kia, trong Phụ lục A.

### Arrow Functions (Hàm Mũi tên)

ES6 đã thêm một dạng biểu thức `function` bổ sung vào ngôn ngữ, được gọi là "arrow functions":

```js
var askQuestion = () => {
  // ..
};
```

Hàm mũi tên `=>` không yêu cầu từ khóa `function` để định nghĩa nó. Ngoài ra, `( .. )` xung quanh danh sách tham số là tùy chọn trong một số trường hợp đơn giản. Tương tự, `{ .. }` xung quanh thân hàm là tùy chọn trong một số trường hợp. Và khi `{ .. }` bị lược bỏ, một giá trị trả về được gửi ra ngoài mà không cần sử dụng từ khóa `return`.

> **LƯU Ý**: Sự hấp dẫn của các hàm mũi tên `=>` thường được bán dưới dạng "cú pháp ngắn hơn," và điều đó được cho là tương đương với code dễ đọc hơn một cách khách quan. Tuyên bố này là đáng ngờ nhất, và tôi tin là hoàn toàn sai lầm. Chúng ta sẽ đào sâu vào "tính dễ đọc" của các dạng hàm khác nhau trong Phụ lục A.

Các hàm mũi tên là ẩn danh về mặt từ vựng, nghĩa là chúng không có định danh liên quan trực tiếp nào tham chiếu đến hàm. Việc gán cho `askQuestion` tạo ra một tên được suy luận là "askQuestion", nhưng điều đó **không giống với việc không ẩn danh**:

```js
var askQuestion = () => {
  // ..
};

askQuestion.name; // askQuestion
```

Các hàm mũi tên đạt được sự ngắn gọn về cú pháp với cái giá phải trả là phải tung hứng trong đầu một loạt các biến thể cho các hình thức/điều kiện khác nhau. Chỉ một vài ví dụ:

```js
() => 42;

(id) => id.toUpperCase();

(id, name) => ({ id, name });

(...args) => {
  return args[args.length - 1];
};
```

Lý do thực sự tôi đưa ra các hàm mũi tên là vì tuyên bố phổ biến nhưng không chính xác rằng các hàm mũi tên bằng cách nào đó hoạt động khác nhau đối với lexical scope so với các hàm `function` tiêu chuẩn.

Điều này là không chính xác.

Ngoài việc ẩn danh (và không có dạng khai báo), các hàm mũi tên `=>` có cùng các quy tắc lexical scope như các hàm `function`. Một hàm mũi tên, có hoặc không có `{ .. }` xung quanh thân của nó, vẫn tạo ra một xô scope lồng nhau riêng biệt. Các khai báo biến bên trong xô scope lồng nhau này hoạt động giống như trong một scope `function`.

### Rút Lui (Backing Out)

Khi một hàm (khai báo hoặc biểu thức) được định nghĩa, một scope mới được tạo ra. Việc định vị các scopes lồng vào nhau tạo ra một phân cấp scope tự nhiên xuyên suốt chương trình, được gọi là chuỗi scope (scope chain). Chuỗi scope kiểm soát quyền truy cập biến, định hướng lên trên và ra ngoài.

Mỗi scope mới cung cấp một bảng trắng, một không gian để chứa tập hợp các biến của riêng nó. Khi một tên biến được lặp lại ở các cấp độ khác nhau của chuỗi scope, shadowing xảy ra, ngăn cản quyền truy cập vào biến bên ngoài từ điểm đó vào trong.

Khi chúng ta lùi lại từ những chi tiết tinh tế này, chương tiếp theo chuyển trọng tâm sang scope chính mà tất cả các chương trình JS đều bao gồm: global scope.

---

## Chương 4: Xung Quanh Global Scope (Around the Global Scope)

Chương 3 đã đề cập đến "global scope" vài lần, nhưng bạn có thể vẫn tự hỏi tại sao scope ngoài cùng của một chương trình lại quan trọng như vậy trong JS hiện đại. Phần lớn công việc hiện nay được thực hiện bên trong các hàm và modules thay vì toàn cục.

Liệu có đủ tốt không khi chỉ khẳng định, "Tránh sử dụng global scope," và xong chuyện?

Global scope của một chương trình JS là một chủ đề phong phú, với nhiều tiện ích và sắc thái hơn bạn có thể nghĩ. Chương này trước tiên khám phá cách global scope (vẫn) hữu ích và có liên quan đến việc viết các chương trình JS ngày nay, sau đó xem xét sự khác biệt ở nơi và _cách truy cập_ global scope trong các môi trường JS khác nhau.

Hiểu đầy đủ về global scope là rất quan trọng trong việc làm chủ việc sử dụng lexical scope để cấu trúc các chương trình của bạn.

### Tại Sao Lại Là Global Scope? (Why Global Scope?)

Có lẽ không có gì ngạc nhiên đối với độc giả rằng hầu hết các ứng dụng được cấu thành từ nhiều (đôi khi rất nhiều!) tệp JS riêng lẻ. Vậy chính xác thì làm thế nào để tất cả các tệp riêng biệt đó được khâu lại với nhau trong một ngữ cảnh runtime duy nhất bởi JS engine?

Đối với các ứng dụng được thực thi trên trình duyệt, có ba cách chính.

Thứ nhất, nếu bạn đang sử dụng trực tiếp ES modules (không biên dịch chúng sang một định dạng module-bundle nào khác), các tệp này được tải riêng lẻ bởi môi trường JS. Mỗi module sau đó `import` các tham chiếu đến bất kỳ module nào khác mà nó cần truy cập. Các tệp module riêng biệt hợp tác với nhau độc quyền thông qua các imports được chia sẻ này, mà không cần bất kỳ scope bên ngoài được chia sẻ nào.

Thứ hai, nếu bạn đang sử dụng một bundler trong quy trình build của mình, tất cả các tệp thường được nối lại với nhau trước khi chuyển đến trình duyệt và JS engine, sau đó chỉ xử lý một tệp lớn. Ngay cả với tất cả các phần của ứng dụng được đặt cùng nhau trong một tệp duy nhất, vẫn cần một cơ chế nào đó để mỗi phần đăng ký một _tên_ để được các phần khác tham chiếu, cũng như một cơ sở nào đó để quyền truy cập đó xảy ra.

Trong một số thiết lập build, toàn bộ nội dung của tệp được bao bọc trong một scope bao quanh duy nhất, chẳng hạn như một hàm wrapper, universal module (UMD—xem Phụ lục A), v.v. Mỗi phần có thể đăng ký chính nó để truy cập từ các phần khác bằng cách sử dụng các biến cục bộ trong scope được chia sẻ đó. Ví dụ:

```js
(function wrappingOuterScope() {
  var moduleOne = (function one() {
    // ..
  })();

  var moduleTwo = (function two() {
    // ..

    function callModuleOne() {
      moduleOne.someMethod();
    }

    // ..
  })();
})();
```

Như đã thấy, các biến cục bộ `moduleOne` và `moduleTwo` bên trong function scope `wrappingOuterScope()` được khai báo để các modules này có thể truy cập lẫn nhau cho sự hợp tác của chúng.

Mặc dù scope của `wrappingOuterScope()` là một hàm và không phải là global scope của môi trường đầy đủ, nó đóng vai trò như một loại "scope toàn ứng dụng," một cái xô nơi tất cả các định danh cấp cao nhất có thể được lưu trữ, mặc dù không phải trong global scope thực sự. Nó giống như một người đóng thế cho global scope về phương diện đó.

Và cuối cùng, cách thứ ba: liệu một công cụ bundler có được sử dụng cho một ứng dụng hay không, hay liệu các tệp (không phải ES module) đơn giản được tải trong trình duyệt riêng lẻ (thông qua thẻ `<script>` hoặc tải tài nguyên JS động khác), nếu không có scope bao quanh duy nhất nào bao gồm tất cả các phần này, **global scope** là cách duy nhất để chúng hợp tác với nhau:

Một tệp được đóng gói thuộc loại này thường trông giống như thế này:

```js
var moduleOne = (function one() {
  // ..
})();
var moduleTwo = (function two() {
  // ..

  function callModuleOne() {
    moduleOne.someMethod();
  }

  // ..
})();
```

Ở đây, vì không có function scope bao quanh, các khai báo `moduleOne` và `moduleTwo` này chỉ đơn giản được thả vào global scope. Điều này thực sự giống như thể các tệp chưa được nối, nhưng được tải riêng biệt:

module1.js:

```js
var moduleOne = (function one() {
  // ..
})();
```

module2.js:

```js
var moduleTwo = (function two() {
  // ..

  function callModuleOne() {
    moduleOne.someMethod();
  }

  // ..
})();
```

Nếu các tệp này được tải riêng biệt như các tệp .js độc lập bình thường trong môi trường trình duyệt, mỗi khai báo biến cấp cao nhất sẽ kết thúc như một biến toàn cục, vì global scope là tài nguyên được chia sẻ duy nhất giữa hai tệp riêng biệt này—chúng là các chương trình độc lập, từ quan điểm của JS engine.

Ngoài việc (có khả năng) giải thích nơi code của ứng dụng cư trú trong quá trình runtime, và cách mỗi phần có thể truy cập các phần khác để hợp tác, global scope cũng là nơi:

- JS để lộ các built-ins của nó:

  - nguyên thủy (primitives): `undefined`, `null`, `Infinity`, `NaN`
  - natives: `Date()`, `Object()`, `String()`, v.v.
  - các hàm toàn cục: `eval()`, `parseInt()`, v.v.
  - namespaces: `Math`, `Atomics`, `JSON`
  - bạn bè của JS: `Intl`, `WebAssembly`

- Môi trường lưu trữ JS engine để lộ các built-ins của riêng nó:

  - `console` (và các phương thức của nó)
  - DOM (`window`, `document`, v.v.)
  - timers (`setTimeout(..)`, v.v.)
  - web platform APIs: `navigator`, `history`, geolocation, WebRTC, v.v.

Đây chỉ là một số trong nhiều _globals_ mà chương trình của bạn sẽ tương tác.

> **LƯU Ý:** Node cũng để lộ một số thành phần "toàn cục," nhưng về mặt kỹ thuật chúng không nằm trong `global` scope: `require()`, `__dirname`, `module`, `URL`, và v.v.

Hầu hết các nhà phát triển đồng ý rằng global scope không nên chỉ là một bãi rác cho mọi biến trong ứng dụng của bạn. Đó là một mớ hỗn độn của các lỗi chỉ chờ xảy ra. Nhưng cũng không thể phủ nhận rằng global scope là một _chất keo_ quan trọng cho thực tế mọi ứng dụng JS.

### Chính Xác Thì Global Scope Này Ở Đâu? (Where Exactly is this Global Scope?)

Có vẻ hiển nhiên rằng global scope nằm ở phần ngoài cùng của một tệp; nghĩa là, không nằm trong bất kỳ hàm hoặc khối nào khác. Nhưng nó không hoàn toàn đơn giản như vậy.

Các môi trường JS khác nhau xử lý scopes của các chương trình của bạn, đặc biệt là global scope, một cách khác nhau. Khá phổ biến khi các nhà phát triển JS nuôi dưỡng những quan niệm sai lầm mà không hề nhận ra.

#### Trình duyệt "Window" (Browser "Window")

Liên quan đến việc xử lý global scope, môi trường _tinh khiết_ nhất mà JS có thể được chạy là như một tệp .js độc lập được tải trong môi trường trang web trong trình duyệt. Tôi không có ý nói "tinh khiết" nghĩa là không có gì được thêm vào tự động—nhiều thứ có thể được thêm vào!—mà đúng hơn là về sự xâm nhập tối thiểu vào code hoặc sự can thiệp vào hành vi global scope mong đợi của nó.

Xem xét tệp .js này:

```js
var studentName = "Kyle";

function hello() {
  console.log(`Hello, ${studentName}!`);
}

hello();
// Hello, Kyle!
```

Code này có thể được tải trong môi trường trang web bằng cách sử dụng thẻ `<script>` nội tuyến, thẻ script `<script src=..>` trong markup, hoặc thậm chí là một phần tử DOM `<script>` được tạo động. Trong cả ba trường hợp, các định danh `studentName` và `hello` được khai báo trong global scope.

Điều đó có nghĩa là nếu bạn truy cập global object (thường là `window` trong trình duyệt), bạn sẽ tìm thấy các thuộc tính có cùng tên đó ở đó:

```js
var studentName = "Kyle";

function hello() {
  console.log(`Hello, ${window.studentName}!`);
}

window.hello();
// Hello, Kyle!
```

Đó là hành vi mặc định mà người ta mong đợi từ việc đọc đặc tả JS: scope bên ngoài _là_ global scope và `studentName` được tạo hợp pháp như biến toàn cục.

Đó là những gì tôi muốn nói về _tinh khiết_. Nhưng thật không may, điều đó sẽ không phải lúc nào cũng đúng với tất cả các môi trường JS mà bạn gặp phải, và điều đó thường gây ngạc nhiên cho các nhà phát triển JS.

**Globals Shadowing Globals**

Hãy nhớ lại cuộc thảo luận về shadowing (và global unshadowing) từ Chương 3, nơi một khai báo biến có thể ghi đè và ngăn chặn quyền truy cập vào một khai báo cùng tên từ một scope bên ngoài.

Một hệ quả bất thường của sự khác biệt giữa một biến toàn cục và một thuộc tính global object cùng tên là, chỉ trong chính global scope, một thuộc tính global object có thể bị shadow bởi một biến toàn cục:

```js
window.something = 42;

let something = "Kyle";

console.log(something);
// Kyle

console.log(window.something);
// 42
```

Khai báo `let` thêm một biến toàn cục `something` nhưng không phải là một thuộc tính global object (xem Chương 3). Tác dụng sau đó là định danh lexical `something` shadows thuộc tính global object `something`.

Chắc chắn là một ý tưởng tồi khi tạo ra sự khác biệt giữa global object và global scope. Người đọc code của bạn gần như chắc chắn sẽ bị vấp ngã.

Một cách đơn giản để tránh cạm bẫy này với các khai báo toàn cục: luôn sử dụng `var` cho globals. Nhường `let` và `const` cho block scopes (xem "Scoping with Blocks" trong Chương 6).

**DOM Globals**

Tôi đã khẳng định rằng môi trường JS do trình duyệt lưu trữ có hành vi global scope _tinh khiết_ nhất mà chúng ta sẽ thấy. Tuy nhiên, nó không hoàn toàn _tinh khiết_.

Một hành vi đáng ngạc nhiên trong global scope mà bạn có thể gặp phải với các ứng dụng JS dựa trên trình duyệt: một phần tử DOM có thuộc tính `id` sẽ tự động tạo một biến toàn cục tham chiếu đến nó.

Xem xét markup này:

```text
<ul id="my-todo-list">
   <li id="first">Write a book</li>
   ..
</ul>
```

Và JS cho trang đó có thể bao gồm:

```js
first;
// <li id="first">..</li>

window["my-todo-list"];
// <ul id="my-todo-list">..</ul>
```

Nếu giá trị `id` là một tên lexical hợp lệ (như `first`), biến lexical được tạo ra. Nếu không, cách duy nhất để truy cập global đó là thông qua global object (`window[..]`).

Việc tự động đăng ký tất cả các phần tử DOM mang `id` như các biến toàn cục là một hành vi trình duyệt cũ vẫn phải duy trì vì rất nhiều trang web cũ vẫn dựa vào nó. Lời khuyên của tôi là không bao giờ sử dụng các biến toàn cục này, mặc dù chúng sẽ luôn được tạo âm thầm.

**Có Gì Trong Một Cái Tên (Window)? (What's in a (Window) Name?)**

Một điều kỳ quặc khác về global scope trong JS dựa trên trình duyệt:

```js
var name = 42;

console.log(name, typeof name);
// "42" string
```

`window.name` là một "global" được định nghĩa trước trong ngữ cảnh trình duyệt; nó là một thuộc tính trên global object, vì vậy nó có vẻ như là một biến toàn cục bình thường (nhưng nó là bất cứ điều gì ngoài "bình thường").

Chúng ta đã sử dụng `var` cho khai báo của mình, điều này **không** shadow thuộc tính toàn cục `name` được định nghĩa trước. Điều đó có nghĩa là, một cách hiệu quả, khai báo `var` bị bỏ qua, vì đã có một thuộc tính global scope object của tên đó. Như chúng ta đã thảo luận trước đó, nếu chúng ta đã sử dụng `let name`, chúng ta sẽ shadow `window.name` với một biến toàn cục `name` riêng biệt.

Nhưng hành vi thực sự đáng ngạc nhiên là ngay cả khi chúng ta gán số `42` cho `name` (và do đó `window.name`), khi chúng ta lấy giá trị của nó, nó là một chuỗi `"42"`! Trong trường hợp này, sự kỳ lạ là do `name` thực sự là một getter/setter được định nghĩa trước trên đối tượng `window`, khăng khăng rằng giá trị của nó là một giá trị chuỗi. Yikes!

Ngoại trừ một số trường hợp góc hiếm gặp như ID phần tử DOM và `window.name`, JS chạy như một tệp độc lập trong một trang trình duyệt có một số hành vi global scope _tinh khiết_ nhất mà chúng ta sẽ gặp phải.

#### Web Workers

Web Workers là một phần mở rộng nền tảng web trên hành vi trình duyệt-JS, cho phép một tệp JS chạy trong một luồng hoàn toàn riêng biệt (về mặt hệ điều hành) so với luồng đang chạy chương trình JS chính.

Vì các chương trình Web Worker này chạy trên một luồng riêng biệt, chúng bị hạn chế trong giao tiếp với luồng ứng dụng chính, để tránh/hạn chế các điều kiện tranh chấp (race conditions) và các biến chứng khác. Code Web Worker không có quyền truy cập vào DOM, chẳng hạn. Tuy nhiên, một số web APIs được cung cấp cho worker, chẳng hạn như `navigator`.

Vì một Web Worker được coi là một chương trình hoàn toàn riêng biệt, nó không chia sẻ global scope với chương trình JS chính. Tuy nhiên, JS engine của trình duyệt vẫn đang chạy code, vì vậy chúng ta có thể mong đợi _sự tinh khiết_ tương tự về hành vi global scope của nó. Vì không có quyền truy cập DOM, bí danh `window` cho global scope không tồn tại.

Trong một Web Worker, tham chiếu global object thường được thực hiện bằng cách sử dụng `self`:

```js
var studentName = "Kyle";
let studentID = 42;

function hello() {
  console.log(`Hello, ${self.studentName}!`);
}

self.hello();
// Hello, Kyle!

self.studentID;
// undefined
```

Cũng giống như với các chương trình JS chính, các khai báo `var` và `function` tạo ra các thuộc tính được phản chiếu trên global object (aka, `self`), trong khi các khai báo khác (`let`, v.v.) thì không.

Vì vậy một lần nữa, hành vi global scope mà chúng ta thấy ở đây là gần như _tinh khiết_ nhất có thể để chạy các chương trình JS; có lẽ nó thậm chí còn _tinh khiết_ hơn vì không có DOM làm rối tung mọi thứ!

#### Developer Tools Console/REPL

Hãy nhớ lại từ Chương 1 trong _Get Started_ rằng Developer Tools không tạo ra một môi trường JS tuân thủ hoàn toàn. Chúng xử lý code JS, nhưng chúng cũng thiên về tương tác UX thân thiện nhất với các nhà phát triển (aka, trải nghiệm nhà phát triển, hoặc DX).

Trong một số trường hợp, việc ưu tiên DX khi nhập các đoạn JS ngắn, hơn là các bước nghiêm ngặt bình thường được mong đợi để xử lý một chương trình JS đầy đủ, tạo ra sự khác biệt có thể quan sát được trong hành vi code giữa các chương trình và công cụ. Ví dụ, một số điều kiện lỗi áp dụng cho một chương trình JS có thể được nới lỏng và không hiển thị khi code được nhập vào một công cụ phát triển.

Liên quan đến các cuộc thảo luận của chúng ta ở đây về scope, những khác biệt có thể quan sát được về hành vi như vậy có thể bao gồm:

- Hành vi của global scope

- Hoisting (xem Chương 5)

- Block-scoping declarators (`let` / `const`, xem Chương 6) khi được sử dụng trong scope ngoài cùng

Mặc dù có vẻ như, trong khi sử dụng console/REPL, các câu lệnh được nhập vào scope ngoài cùng đang được xử lý trong global scope thực sự, nhưng điều đó không hoàn toàn chính xác. Các công cụ như vậy thường mô phỏng vị trí global scope ở một mức độ nào đó; đó là sự mô phỏng, không phải sự tuân thủ nghiêm ngặt. Các môi trường công cụ này ưu tiên sự thuận tiện cho nhà phát triển, điều đó có nghĩa là đôi khi (chẳng hạn như với các cuộc thảo luận hiện tại của chúng ta về scope), hành vi quan sát được có thể sai lệch so với đặc tả JS.

Điểm mấu chốt là Developer Tools, mặc dù được tối ưu hóa để thuận tiện và hữu ích cho nhiều hoạt động của nhà phát triển, **không** phải là môi trường phù hợp để xác định hoặc xác minh các hành vi rõ ràng và sắc thái của bối cảnh chương trình JS thực tế.

#### ES Modules (ESM)

ES6 đã giới thiệu hỗ trợ hạng nhất cho pattern module (được đề cập trong Chương 8). Một trong những tác động rõ ràng nhất của việc sử dụng ESM là cách nó thay đổi hành vi của scope cấp cao nhất có thể quan sát được trong một tệp.

Hãy nhớ lại đoạn code này từ trước đó (chúng ta sẽ điều chỉnh sang định dạng ESM bằng cách sử dụng từ khóa `export`):

```js
var studentName = "Kyle";

function hello() {
    console.log(`Hello, ${ studentName }!`);
}

hello();
// Hello, Kyle!

export hello;
```

Nếu code đó nằm trong một tệp được tải như một ES module, nó vẫn sẽ chạy chính xác như vậy. Tuy nhiên, các hiệu ứng có thể quan sát được, từ quan điểm tổng thể của ứng dụng, sẽ khác nhau.

Mặc dù được khai báo ở cấp cao nhất của tệp (module), trong scope rõ ràng ngoài cùng, `studentName` và `hello` không phải là biến toàn cục. Thay vào đó, chúng là module-wide, hoặc nếu bạn thích, "module-global."

Tuy nhiên, trong một module không có "object scope toàn module" ngầm định nào để các khai báo cấp cao nhất này được thêm vào dưới dạng thuộc tính, như khi các khai báo xuất hiện ở cấp cao nhất của các tệp JS non-module. Điều này không có nghĩa là các biến toàn cục không thể tồn tại hoặc được truy cập trong các chương trình như vậy. Chỉ là các biến toàn cục không được _tạo ra_ bằng cách khai báo các biến trong scope cấp cao nhất của một module.

Scope cấp cao nhất của module là hậu duệ của global scope, gần như thể toàn bộ nội dung của module được bao bọc trong một hàm. Do đó, tất cả các biến tồn tại trong global scope (cho dù chúng nằm trên global object hay không!) đều có sẵn dưới dạng các định danh lexical từ bên trong scope của module.

ESM khuyến khích giảm thiểu sự phụ thuộc vào global scope, nơi bạn import bất kỳ modules nào bạn có thể cần cho module hiện tại hoạt động. Như vậy, bạn ít thấy việc sử dụng global scope hoặc global object của nó hơn.

Tuy nhiên, như đã lưu ý trước đó, vẫn còn rất nhiều JS và web globals mà bạn sẽ tiếp tục truy cập từ global scope, cho dù bạn có nhận ra hay không!

#### Node

Một khía cạnh của Node thường khiến các nhà phát triển JS mất cảnh giác là Node coi mọi tệp .js mà nó tải, bao gồm cả tệp chính bạn bắt đầu quy trình Node, như một _module_ (ES module hoặc CommonJS module, xem Chương 8). Hiệu ứng thực tế là cấp cao nhất của các chương trình Node của bạn **không bao giờ thực sự là global scope**, theo cách mà nó là khi tải một tệp non-module trong trình duyệt.

Vào thời điểm viết bài này, Node gần đây đã thêm hỗ trợ cho ES modules. Nhưng ngoài ra, Node ngay từ đầu đã hỗ trợ một định dạng module được gọi là "CommonJS", trông giống như thế này:

```js
var studentName = "Kyle";

function hello() {
  console.log(`Hello, ${studentName}!`);
}

hello();
// Hello, Kyle!

module.exports.hello = hello;
```

Trước khi xử lý, Node bao bọc một cách hiệu quả code như vậy trong một hàm, sao cho các khai báo `var` và `function` được chứa trong scope của hàm bao bọc đó, **không** được coi là các biến toàn cục.

Hình dung code trước đó được Node nhìn thấy như thế này (minh họa, không phải thực tế):

```js
function Module(module,require,__dirname,...) {
    var studentName = "Kyle";

    function hello() {
        console.log(`Hello, ${ studentName }!`);
    }

    hello();
    // Hello, Kyle!

    module.exports.hello = hello;
}
```

Node sau đó về cơ bản gọi hàm `Module(..)` đã thêm để chạy module của bạn. Bạn có thể thấy rõ ràng ở đây tại sao các định danh `studentName` và `hello` không phải là global, mà được khai báo trong scope của module.

Như đã lưu ý trước đó, Node định nghĩa một số "globals" như `require()`, nhưng chúng thực sự không phải là các định danh trong global scope (cũng không phải là thuộc tính của global object). Chúng được tiêm vào scope của mọi module, về cơ bản hơi giống các tham số được liệt kê trong khai báo hàm `Module(..)`.

Vậy làm thế nào để bạn định nghĩa các biến toàn cục thực tế trong Node? Cách duy nhất để làm điều đó là thêm các thuộc tính vào một trong những "globals" được cung cấp tự động khác của Node, trớ trêu thay được gọi là `global`. `global` là một tham chiếu đến đối tượng global scope thực sự, phần nào giống như sử dụng `window` trong môi trường trình duyệt JS.

Xem xét:

```js
global.studentName = "Kyle";

function hello() {
  console.log(`Hello, ${studentName}!`);
}

hello();
// Hello, Kyle!

module.exports.hello = hello;
```

Ở đây chúng ta thêm `studentName` như một thuộc tính trên đối tượng `global`, và sau đó trong câu lệnh `console.log(..)`, chúng ta có thể truy cập `studentName` như một biến toàn cục bình thường.

Hãy nhớ rằng, định danh `global` không được định nghĩa bởi JS; nó được định nghĩa cụ thể bởi Node.

### Global This (Global This)

Xem xét lại các môi trường JS mà chúng ta đã xem xét cho đến nay, một chương trình có thể hoặc không thể:

- Khai báo một biến toàn cục trong scope cấp cao nhất với các khai báo `var` hoặc `function`—hoặc `let`, `const`, và `class`.

- Cũng thêm các khai báo biến toàn cục dưới dạng thuộc tính của đối tượng global scope nếu `var` hoặc `function` được sử dụng cho việc khai báo.

- Tham chiếu đến đối tượng global scope (để thêm hoặc lấy các biến toàn cục, dưới dạng thuộc tính) với `window`, `self`, hoặc `global`.

Tôi nghĩ thật công bằng khi nói rằng quyền truy cập và hành vi của global scope phức tạp hơn hầu hết các nhà phát triển giả định, như các phần trước đã minh họa. Nhưng sự phức tạp không bao giờ rõ ràng hơn khi cố gắng xác định một tham chiếu áp dụng phổ biến cho đối tượng global scope.

Lại thêm một "thủ thuật" khác để có được một tham chiếu đến đối tượng global scope trông giống như:

```js
const theGlobalScopeObject = new Function("return this")();
```

> **LƯU Ý**: Một hàm có thể được xây dựng động từ code được lưu trữ trong một giá trị chuỗi với constructor `Function()`, tương tự như `eval(..)` (xem "Cheating: Runtime Scope Modifications" trong Chương 1). Một hàm như vậy sẽ tự động được chạy trong non-strict-mode (vì lý do kế thừa) khi được gọi với lời gọi hàm `()` bình thường như đã thấy; `this` của nó sẽ trỏ vào global object. Xem cuốn thứ ba trong loạt sách, _Objects & Classes_, để biết thêm thông tin về việc xác định các ràng buộc `this`.

Vì vậy, chúng ta có `window`, `self`, `global`, và thủ thuật `new Function(..)` xấu xí này. Đó là rất nhiều cách khác nhau để cố gắng tiếp cận global object này. Mỗi cách đều có ưu và nhược điểm.

Tại sao không giới thiệu thêm một cái nữa!?!?

Kể từ ES2020, JS cuối cùng đã định nghĩa một tham chiếu chuẩn hóa đến đối tượng global scope, được gọi là `globalThis`. Vì vậy, tùy thuộc vào độ mới của các JS engines mà code của bạn chạy trong đó, bạn có thể sử dụng `globalThis` thay cho bất kỳ phương pháp tiếp cận nào khác.

Chúng ta thậm chí có thể cố gắng định nghĩa một polyfill đa môi trường an toàn hơn trên các môi trường JS tiền-`globalThis`, chẳng hạn như:

```js
const theGlobalScopeObject =
  typeof globalThis != "undefined"
    ? globalThis
    : typeof global != "undefined"
    ? global
    : typeof window != "undefined"
    ? window
    : typeof self != "undefined"
    ? self
    : new Function("return this")();
```

Phew! Điều đó chắc chắn không lý tưởng, nhưng nó hoạt động nếu bạn thấy mình cần một tham chiếu global scope đáng tin cậy.

(Cái tên được đề xuất `globalThis` khá gây tranh cãi trong khi tính năng này đang được thêm vào JS. Cụ thể, tôi và nhiều người khác cảm thấy tham chiếu "this" trong tên của nó gây hiểu lầm, vì lý do bạn tham chiếu đối tượng này là để truy cập vào global scope, không bao giờ để truy cập một loại ràng buộc `this` toàn cục/mặc định nào đó. Có nhiều tên khác được xem xét, nhưng vì nhiều lý do bị loại trừ. Thật không may, cái tên được chọn cuối cùng lại là phương sách cuối cùng. Nếu bạn định tương tác với đối tượng global scope trong các chương trình của mình, để giảm bớt sự nhầm lẫn, tôi thực sự khuyên bạn nên chọn một cái tên tốt hơn, chẳng hạn như (dài đáng buồn cười nhưng chính xác!) `theGlobalScopeObject` được sử dụng ở đây.)

### Nhận Thức Toàn Cục (Globally Aware)

Global scope hiện diện và có liên quan trong mọi chương trình JS, mặc dù các mô hình hiện đại để tổ chức code thành các modules làm giảm bớt nhiều sự phụ thuộc vào việc lưu trữ các định danh trong namespace đó.

Tuy nhiên, khi code của chúng ta sinh sôi nảy nở ngày càng nhiều vượt ra ngoài giới hạn của trình duyệt, điều đặc biệt quan trọng là chúng ta phải nắm vững sự khác biệt trong cách global scope (và đối tượng global scope!) hoạt động trên các môi trường JS khác nhau.

Với bức tranh toàn cảnh về global scope giờ đây đã sắc nét hơn trong tiêu điểm, chương tiếp theo một lần nữa đi sâu vào các chi tiết sâu hơn của lexical scope, kiểm tra cách thức và thời điểm các biến có thể được sử dụng.

---

## Chương 5: Vòng Đời (Không Hề) Bí Mật Của Biến (The (Not So) Secret Lifecycle of Variables)

Đến bây giờ bạn đã có một sự hiểu biết khá tốt về việc lồng ghép các scopes, từ global scope trở xuống—được gọi là chuỗi scope (scope chain) của một chương trình.

Nhưng chỉ biết một biến đến từ scope nào chỉ là một phần của câu chuyện. Nếu một khai báo biến xuất hiện sau câu lệnh đầu tiên của một scope, bất kỳ tham chiếu nào đến định danh đó _trước_ khi khai báo sẽ hoạt động như thế nào? Điều gì xảy ra nếu bạn cố gắng khai báo cùng một biến hai lần trong một scope?

Hương vị lexical scope đặc biệt của JS chứa đầy sắc thái về cách thức và thời điểm các biến ra đời và trở nên có sẵn cho chương trình.

### Khi Nào Tôi Có Thể Sử Dụng Một Biến? (When Can I Use a Variable?)

Tại thời điểm nào một biến trở nên có sẵn để sử dụng trong scope của nó? Có vẻ như có một câu trả lời hiển nhiên: _sau_ khi biến đã được khai báo/tạo. Đúng không? Không hẳn vậy.

Xem xét:

```js
greeting();
// Hello!

function greeting() {
  console.log("Hello!");
}
```

Code này hoạt động tốt. Bạn có thể đã thấy hoặc thậm chí viết code giống như vậy trước đây. Nhưng bạn đã bao giờ tự hỏi làm thế nào hoặc tại sao nó hoạt động? Cụ thể, tại sao bạn có thể truy cập định danh `greeting` từ dòng 1 (để lấy và thực thi một tham chiếu hàm), ngay cả khi khai báo hàm `greeting()` không xảy ra cho đến dòng 4?

Hãy nhớ lại Chương 1 chỉ ra rằng tất cả các định danh được đăng ký với scopes tương ứng của chúng trong thời gian biên dịch (compile time). Hơn nữa, mọi định danh được _tạo ra_ ở đầu scope mà nó thuộc về, **mỗi khi scope đó được nhập**.

Thuật ngữ thường được sử dụng nhất cho một biến có thể nhìn thấy từ đầu scope bao quanh của nó, mặc dù khai báo của nó có thể xuất hiện xa hơn trong scope, được gọi là **hoisting**.

Nhưng hoisting một mình không trả lời đầy đủ câu hỏi. Chúng ta có thể thấy một định danh được gọi là `greeting` từ đầu scope, nhưng tại sao chúng ta có thể **gọi** hàm `greeting()` trước khi nó được khai báo?

Nói cách khác, làm thế nào biến `greeting` có bất kỳ giá trị nào (tham chiếu hàm) được gán cho nó, ngay từ thời điểm scope bắt đầu chạy? Câu trả lời là một đặc điểm đặc biệt của các khai báo `function` chính thức, được gọi là _function hoisting_. Khi định danh tên của một khai báo `function` được đăng ký ở đầu scope của nó, nó còn được tự động khởi tạo (auto-initialized) với tham chiếu của hàm đó. Đó là lý do tại sao hàm có thể được gọi trong toàn bộ scope!

Một chi tiết quan trọng là cả _function hoisting_ và _variable hoisting_ kiểu `var` đều gắn các định danh tên của chúng vào **function scope** (hoặc, nếu không có, là global scope) bao quanh gần nhất, không phải block scope.

> **LƯU Ý:** Các khai báo với `let` và `const` vẫn hoisting (xem thảo luận về TDZ sau trong chương này). Nhưng hai dạng khai báo này gắn vào block bao quanh của chúng thay vì chỉ là một hàm bao quanh như với các khai báo `var` và `function`. Xem "Scoping with Blocks" trong Chương 6 để biết thêm thông tin.

#### Hoisting: Khai Báo vs. Biểu Thức (Hoisting: Declaration vs. Expression)

_Function hoisting_ chỉ áp dụng cho các khai báo `function` chính thức (cụ thể là những khai báo xuất hiện bên ngoài các blocks—xem "FiB" trong Chương 6), không áp dụng cho các phép gán biểu thức `function`. Xem xét:

```js
greeting();
// TypeError

var greeting = function greeting() {
  console.log("Hello!");
};
```

Dòng 1 (`greeting();`) ném ra một lỗi. Nhưng _loại_ lỗi được ném ra là rất quan trọng để nhận thấy. Một `TypeError` có nghĩa là chúng ta đang cố gắng làm điều gì đó với một giá trị không được phép. Tùy thuộc vào môi trường JS của bạn, thông báo lỗi sẽ nói điều gì đó như, "'undefined' is not a function," hoặc hữu ích hơn, "'greeting' is not a function."

Lưu ý rằng lỗi **không phải** là một `ReferenceError`. JS không nói với chúng ta rằng nó không thể tìm thấy `greeting` như một định danh trong scope. Nó đang nói với chúng ta rằng `greeting` đã được tìm thấy nhưng không giữ một tham chiếu hàm vào thời điểm đó. Chỉ các hàm mới có thể được gọi, vì vậy việc cố gắng gọi một giá trị không phải hàm sẽ dẫn đến lỗi.

Nhưng `greeting` giữ cái gì, nếu không phải là tham chiếu hàm?

Ngoài việc được hoisted, các biến được khai báo với `var` cũng được tự động khởi tạo thành `undefined` ở đầu scope của chúng—một lần nữa, hàm bao quanh gần nhất, hoặc global. Sau khi được khởi tạo, chúng có sẵn để được sử dụng (gán cho, lấy từ, v.v.) trong toàn bộ scope.

Vì vậy, ở dòng đầu tiên đó, `greeting` tồn tại, nhưng nó chỉ giữ giá trị mặc định `undefined`. Phải đến dòng 4, `greeting` mới được gán tham chiếu hàm.

Hãy chú ý kỹ đến sự phân biệt ở đây. Một khai báo `function` được hoisted **và được khởi tạo với giá trị hàm của nó** (một lần nữa, được gọi là _function hoisting_). Một biến `var` cũng được hoisted, và sau đó tự động khởi tạo thành `undefined`. Bất kỳ phép gán biểu thức `function` nào tiếp theo cho biến đó đều không xảy ra cho đến khi phép gán đó được xử lý trong quá trình thực thi runtime.

Trong cả hai trường hợp, tên của định danh được hoisted. Nhưng liên kết tham chiếu hàm không được xử lý tại thời điểm khởi tạo (đầu scope) trừ khi định danh được tạo trong một khai báo `function` chính thức.

#### Variable Hoisting

Hãy xem một ví dụ khác về _variable hoisting_:

```js
greeting = "Hello!";
console.log(greeting);
// Hello!

var greeting = "Howdy!";
```

Mặc dù `greeting` không được khai báo cho đến dòng 5, nó có sẵn để được gán sớm nhất là từ dòng 1. Tại sao?

Có hai phần cần thiết cho lời giải thích:

- định danh được hoisted,
- **và** nó được tự động khởi tạo với giá trị `undefined` từ đầu scope.

> **LƯU Ý:** Việc sử dụng _variable hoisting_ kiểu này có lẽ cảm thấy không tự nhiên, và nhiều độc giả có thể muốn tránh dựa vào nó trong các chương trình của họ. Nhưng liệu tất cả hoisting (bao gồm _function hoisting_) có nên tránh không? Chúng ta sẽ khám phá những quan điểm khác nhau về hoisting chi tiết hơn trong Phụ lục A.

### Hoisting: Lại Một Ẩn Dụ Nữa (Hoisting: Yet Another Metaphor)

Chương 2 đầy những ẩn dụ (để minh họa scope), nhưng ở đây chúng ta phải đối mặt với một ẩn dụ khác: chính là hoisting. Thay vì hoisting là một bước thực thi cụ thể mà JS engine thực hiện, sẽ hữu ích hơn khi nghĩ về hoisting như một hình ảnh hóa các hành động khác nhau mà JS thực hiện trong việc thiết lập chương trình **trước khi thực thi**.

Khẳng định điển hình về ý nghĩa của hoisting: _nâng lên_—giống như nâng một vật nặng lên trên—bất kỳ định danh nào lên tận cùng của một scope. Lời giải thích thường được khẳng định là JS engine sẽ thực sự _viết lại_ chương trình đó trước khi thực thi, để nó trông giống như thế này hơn:

```js
var greeting; // hoisted declaration
greeting = "Hello!"; // dòng 1 gốc
console.log(greeting); // Hello!
greeting = "Howdy!"; // `var` đã biến mất!
```

Hoisting (ẩn dụ) đề xuất rằng JS tiền xử lý chương trình gốc và sắp xếp lại nó một chút, sao cho tất cả các khai báo đã được di chuyển lên đầu các scopes tương ứng của chúng, trước khi thực thi. Hơn nữa, ẩn dụ hoisting khẳng định rằng các khai báo `function` được hoisted toàn bộ lên đầu mỗi scope. Xem xét:

```js
studentName = "Suzy";
greeting();
// Hello Suzy!

function greeting() {
  console.log(`Hello ${studentName}!`);
}
var studentName;
```

"Quy tắc" của ẩn dụ hoisting là các khai báo function được hoisted trước, sau đó các biến được hoisted ngay sau tất cả các hàm. Do đó, câu chuyện hoisting gợi ý rằng chương trình được _sắp xếp lại_ bởi JS engine để trông giống như thế này:

```js
function greeting() {
  console.log(`Hello ${studentName}!`);
}
var studentName;

studentName = "Suzy";
greeting();
// Hello Suzy!
```

Ẩn dụ hoisting này rất tiện lợi. Lợi ích của nó là cho phép chúng ta vẫy tay qua quá trình tiền xử lý nhìn trước (look-ahead) kỳ diệu cần thiết để tìm tất cả các khai báo bị chôn vùi sâu trong các scopes và bằng cách nào đó di chuyển (hoist) chúng lên trên cùng; chúng ta chỉ cần nghĩ về chương trình như thể nó được thực thi bởi JS engine trong một **lượt duy nhất** (single pass), từ trên xuống dưới.

Single-pass chắc chắn có vẻ đơn giản hơn khẳng định xử lý hai giai đoạn của Chương 1.

Hoisting như một cơ chế để sắp xếp lại code có thể là một sự đơn giản hóa hấp dẫn, nhưng nó không chính xác. JS engine không thực sự sắp xếp lại code. Nó không thể nhìn trước một cách kỳ diệu và tìm các khai báo; cách duy nhất để tìm chúng một cách chính xác, cũng như tất cả các ranh giới scope trong chương trình, sẽ là phân tích cú pháp (parse) code đầy đủ.

Đoán xem parsing là gì? Giai đoạn đầu tiên của quá trình xử lý hai giai đoạn! Không có phép thể dục dụng cụ trí tuệ kỳ diệu nào có thể lách qua sự thật đó.

Vì vậy, nếu ẩn dụ hoisting (tốt nhất là) không chính xác, chúng ta nên làm gì với thuật ngữ này? Tôi nghĩ nó vẫn hữu ích—thực sự, ngay cả các thành viên của TC39 cũng thường xuyên sử dụng nó!—nhưng tôi không nghĩ chúng ta nên tuyên bố nó là một sự sắp xếp lại thực tế của mã nguồn.

> **CẢNH BÁO:** Các mô hình tinh thần không chính xác hoặc không đầy đủ thường vẫn có vẻ đủ vì đôi khi chúng có thể dẫn đến các câu trả lời đúng ngẫu nhiên. Nhưng về lâu dài, khó có thể phân tích và dự đoán kết quả chính xác nếu suy nghĩ của bạn không đặc biệt phù hợp với cách thức hoạt động của JS engine.

Tôi khẳng định rằng hoisting _nên_ được sử dụng để đề cập đến **hoạt động thời gian biên dịch** (compile-time operation) của việc tạo ra các hướng dẫn runtime cho việc đăng ký tự động của một biến ở đầu scope của nó, mỗi khi scope đó được nhập.

Đó là một sự thay đổi tinh tế nhưng quan trọng, từ hoisting như một hành vi runtime sang vị trí thích hợp của nó giữa các tác vụ thời gian biên dịch.

### Khai Báo Lại? (Re-declaration?)

Bạn nghĩ điều gì sẽ xảy ra khi một biến được khai báo nhiều hơn một lần trong cùng một scope? Xem xét:

```js
var studentName = "Frank";
console.log(studentName);
// Frank

var studentName;
console.log(studentName); // ???
```

Bạn mong đợi điều gì sẽ được in cho thông báo thứ hai đó? Nhiều người tin rằng `var studentName` thứ hai đã khai báo lại biến (và do đó "reset" nó), vì vậy họ mong đợi `undefined` sẽ được in ra.

Nhưng có cái gọi là một biến bị "khai báo lại" trong cùng một scope không? Không.

Nếu bạn xem xét chương trình này từ góc độ của ẩn dụ hoisting, code sẽ được sắp xếp lại như thế này cho mục đích thực thi:

```js
var studentName;
var studentName; // rõ ràng là một no-op vô nghĩa!

studentName = "Frank";
console.log(studentName);
// Frank

console.log(studentName);
// Frank
```

Vì hoisting thực sự là về việc đăng ký một biến ở đầu scope, không có gì để làm ở giữa scope nơi chương trình gốc thực sự có câu lệnh `var studentName` thứ hai. Nó chỉ là một no-op(eration) (không làm gì), một câu lệnh vô nghĩa.

> **MẸO:** Theo phong cách của câu chuyện hội thoại từ Chương 2, _Compiler_ sẽ tìm thấy câu lệnh khai báo `var` thứ hai và hỏi _Scope Manager_ xem nó đã thấy định danh `studentName` chưa; vì nó đã thấy, sẽ không còn gì khác để làm.

Cũng quan trọng để chỉ ra rằng `var studentName;` không có nghĩa là `var studentName = undefined;`, như hầu hết mọi người giả định. Hãy chứng minh chúng khác nhau bằng cách xem xét biến thể này của chương trình:

```js
var studentName = "Frank";
console.log(studentName); // Frank

var studentName;
console.log(studentName); // Frank <--- vẫn vậy!

// hãy thêm việc khởi tạo một cách rõ ràng
var studentName = undefined;
console.log(studentName); // undefined <--- thấy chưa!?
```

Thấy cách khởi tạo `= undefined` rõ ràng tạo ra một kết quả khác so với việc giả định nó xảy ra ngầm định khi bị bỏ qua không? Trong phần tiếp theo, chúng ta sẽ xem lại chủ đề khởi tạo biến từ các khai báo của chúng.

Một khai báo `var` lặp lại của cùng một tên định danh trong một scope thực sự là một hoạt động không làm gì cả. Đây là một minh họa khác, lần này qua một hàm cùng tên:

```js
var greeting;

function greeting() {
  console.log("Hello!");
}

// về cơ bản, một no-op
var greeting;

typeof greeting; // "function"

var greeting = "Hello!";

typeof greeting; // "string"
```

Khai báo `greeting` đầu tiên đăng ký định danh cho scope, và vì nó là một `var`, việc tự động khởi tạo sẽ là `undefined`. Khai báo `function` không cần đăng ký lại định danh, nhưng vì _function hoisting_, nó ghi đè việc tự động khởi tạo để sử dụng tham chiếu hàm. `var greeting` thứ hai tự nó không làm gì cả vì `greeting` đã là một định danh và _function hoisting_ đã ưu tiên cho việc tự động khởi tạo.

Thực tế gán `"Hello!"` cho `greeting` thay đổi giá trị của nó từ hàm `greeting()` ban đầu thành chuỗi; bản thân `var` không có bất kỳ tác dụng nào.

Còn về việc lặp lại một khai báo trong một scope sử dụng `let` hoặc `const` thì sao?

```js
let studentName = "Frank";

console.log(studentName);

let studentName = "Suzy";
```

Chương trình này sẽ không thực thi, mà thay vào đó ngay lập tức ném ra một `SyntaxError`. Tùy thuộc vào môi trường JS của bạn, thông báo lỗi sẽ chỉ ra điều gì đó như: "studentName has already been declared." Nói cách khác, đây là trường hợp mà nỗ lực "khai báo lại" rõ ràng là không được phép!

Không chỉ là hai khai báo liên quan đến `let` sẽ ném lỗi này. Nếu một trong hai khai báo sử dụng `let`, khai báo kia có thể là `let` hoặc `var`, và lỗi vẫn sẽ xảy ra, như được minh họa với hai biến thể sau:

```js
var studentName = "Frank";

let studentName = "Suzy";
```

và:

```js
let studentName = "Frank";

var studentName = "Suzy";
```

Trong cả hai trường hợp, một `SyntaxError` được ném ra ở khai báo _thứ hai_. Nói cách khác, cách duy nhất để "khai báo lại" một biến là sử dụng `var` cho tất cả (hai hoặc nhiều hơn) các khai báo của nó.

Nhưng tại sao lại không cho phép nó? Lý do cho lỗi này không phải là kỹ thuật, vì việc "khai báo lại" `var` đã luôn được cho phép; rõ ràng, sự cho phép tương tự có thể được thực hiện cho `let`.

Nó thực sự là một vấn đề "kỹ thuật xã hội" (social engineering) hơn. "Khai báo lại" các biến được một số người, bao gồm nhiều người trong cơ quan TC39, coi là một thói quen xấu có thể dẫn đến lỗi chương trình. Vì vậy, khi ES6 giới thiệu `let`, họ đã quyết định ngăn chặn việc "khai báo lại" bằng một lỗi.

> **LƯU Ý:** Đương nhiên đây là một ý kiến về phong cách, không thực sự là một lập luận kỹ thuật. Nhiều nhà phát triển đồng ý với quan điểm này, và đó có lẽ một phần là lý do tại sao TC39 bao gồm lỗi này (cũng như `let` tuân thủ `const`). Nhưng một trường hợp hợp lý có thể đã được đưa ra rằng việc giữ nhất quán với tiền lệ của `var` là thận trọng hơn, và việc thực thi quan điểm như vậy tốt nhất nên để cho các công cụ opt-in như linters. Trong Phụ lục A, chúng ta sẽ khám phá xem liệu `var` (và hành vi liên quan của nó, như "khai báo lại") có còn hữu ích trong JS hiện đại hay không.

Khi _Compiler_ hỏi _Scope Manager_ về một khai báo, nếu định danh đó đã được khai báo, và nếu một trong hai/cả hai khai báo được thực hiện với `let`, một lỗi sẽ được ném ra. Tín hiệu dự định cho nhà phát triển là "Ngừng dựa vào việc khai báo lại cẩu thả!"

#### Hằng Số? (Constants?)

Từ khóa `const` bị hạn chế hơn `let`. Giống như `let`, `const` không thể được lặp lại với cùng một định danh trong cùng một scope. Nhưng thực sự có một lý do kỹ thuật ghi đè tại sao loại "khai báo lại" đó không được phép, không giống như `let` không cho phép "khai báo lại" chủ yếu vì lý do phong cách.

Từ khóa `const` yêu cầu một biến phải được khởi tạo, vì vậy bỏ qua việc gán trong khai báo sẽ dẫn đến `SyntaxError`:

```js
const empty;   // SyntaxError
```

Các khai báo `const` tạo ra các biến không thể được gán lại:

```js
const studentName = "Frank";
console.log(studentName);
// Frank

studentName = "Suzy"; // TypeError
```

Biến `studentName` không thể được gán lại vì nó được khai báo với một `const`.

> **CẢNH BÁO:** Lỗi được ném ra khi gán lại `studentName` là một `TypeError`, không phải là `SyntaxError`. Sự khác biệt tinh tế ở đây thực sự khá quan trọng, nhưng thật không may là quá dễ bị bỏ qua. Syntax errors đại diện cho các lỗi trong chương trình ngăn nó thậm chí bắt đầu thực thi. Type errors đại diện cho các lỗi phát sinh trong quá trình thực thi chương trình. Trong đoạn trích trước, `"Frank"` được in ra trước khi chúng ta xử lý việc gán lại `studentName`, điều này sau đó ném lỗi.

Vì vậy, nếu các khai báo `const` không thể được gán lại, và các khai báo `const` luôn yêu cầu các phép gán, thì chúng ta có một lý do kỹ thuật rõ ràng tại sao `const` phải không cho phép bất kỳ sự "khai báo lại" nào: bất kỳ sự "khai báo lại" `const` nào cũng nhất thiết phải là một sự gán lại `const`, điều này không thể được phép!

```js
const studentName = "Frank";

// rõ ràng điều này phải là một lỗi
const studentName = "Suzy";
```

Vì việc "khai báo lại" `const` phải không được phép (trên cơ sở kỹ thuật đó), TC39 về cơ bản cảm thấy rằng việc "khai báo lại" `let` cũng nên không được phép, để nhất quán. Có thể tranh luận xem liệu đây có phải là lựa chọn tốt nhất hay không, nhưng ít nhất chúng ta có lý do đằng sau quyết định này.

#### Các Vòng Lặp (Loops)

Vì vậy, rõ ràng từ cuộc thảo luận trước đó của chúng ta rằng JS thực sự không muốn chúng ta "khai báo lại" các biến của mình trong cùng một scope. Điều đó có lẽ có vẻ như một lời khuyên đơn giản, cho đến khi bạn xem xét ý nghĩa của nó đối với việc thực thi lặp lại các câu lệnh khai báo trong các vòng lặp. Xem xét:

```js
var keepGoing = true;
while (keepGoing) {
  let value = Math.random();
  if (value > 0.5) {
    keepGoing = false;
  }
}
```

Liệu `value` có bị "khai báo lại" lặp đi lặp lại trong chương trình này không? Chúng ta sẽ nhận được lỗi ném ra không? Không.

Tất cả các quy tắc của scope (bao gồm "khai báo lại" các biến do `let` tạo ra) được áp dụng _trên mỗi thực thể scope_ (per scope instance). Nói cách khác, mỗi khi một scope được nhập trong quá trình thực thi, mọi thứ sẽ reset.

Mỗi lần lặp lại vòng lặp là một thực thể scope mới của riêng nó, và trong mỗi thực thể scope, `value` chỉ được khai báo một lần. Vì vậy, không có nỗ lực "khai báo lại" nào, và do đó không có lỗi. Trước khi chúng ta xem xét các dạng vòng lặp khác, điều gì sẽ xảy ra nếu khai báo `value` trong đoạn trích trước được thay đổi thành một `var`?

```js
var keepGoing = true;
while (keepGoing) {
  var value = Math.random();
  if (value > 0.5) {
    keepGoing = false;
  }
}
```

Liệu `value` có bị "khai báo lại" ở đây không, đặc biệt là vì chúng ta biết `var` cho phép nó? Không. Vì `var` không được coi là một khai báo block-scoping (xem Chương 6), nó gắn chính nó vào global scope. Vì vậy chỉ có một biến `value`, trong cùng một scope với `keepGoing` (global scope, trong trường hợp này). Cũng không có "khai báo lại" ở đây!

Một cách để giữ cho tất cả điều này rõ ràng là nhớ rằng các từ khóa `var`, `let`, và `const` thực sự bị _loại bỏ_ khỏi code vào thời điểm nó bắt đầu thực thi. Chúng được xử lý hoàn toàn bởi trình biên dịch.

Nếu bạn xóa các từ khóa khai báo trong đầu và sau đó cố gắng xử lý code, nó sẽ giúp bạn quyết định xem liệu và khi nào các khai báo (lại) có thể xảy ra.

Còn về "khai báo lại" với các dạng vòng lặp khác, như vòng lặp `for` thì sao?

```js
for (let i = 0; i < 3; i++) {
  let value = i * 10;
  console.log(`${i}: ${value}`);
}
// 0: 0
// 1: 10
// 2: 20
```

Nên rõ ràng rằng chỉ có một `value` được khai báo trên mỗi thực thể scope. Nhưng còn `i` thì sao? Nó có bị "khai báo lại" không?

Để trả lời điều đó, hãy xem xét `i` nằm trong scope nào. Có vẻ như nó sẽ ở trong scope bên ngoài (trong trường hợp này, global), nhưng không phải vậy. Nó nằm trong scope của thân vòng lặp `for`, giống như `value` vậy. Trên thực tế, bạn có thể nghĩ về vòng lặp đó trong dạng tương đương dài dòng hơn này:

```js
{
  // một biến hư cấu để minh họa
  let $$i = 0;

  for (; /* không có gì */ $$i < 3; $$i++) {
    // đây là `i` thực tế của vòng lặp của chúng ta!
    let i = $$i;

    let value = i * 10;
    console.log(`${i}: ${value}`);
  }
  // 0: 0
  // 1: 10
  // 2: 20
}
```

Bây giờ nên rõ ràng: các biến `i` và `value` đều được khai báo chính xác một lần **trên mỗi thực thể scope**. Không có "khai báo lại" ở đây.

Còn về các dạng vòng lặp `for` khác thì sao?

```js
for (let index in students) {
  // điều này ổn
}

for (let student of students) {
  // cái này cũng vậy
}
```

Tương tự với các vòng lặp `for..in` và `for..of`: biến được khai báo được coi là _bên trong_ thân vòng lặp, và do đó được xử lý trên mỗi lần lặp (aka, mỗi thực thể scope). Không có "khai báo lại."

OK, tôi biết bạn đang nghĩ rằng tôi nghe như một chiếc đĩa hát bị hỏng vào thời điểm này. Nhưng hãy khám phá cách `const` tác động đến các cấu trúc lặp này. Xem xét:

```js
var keepGoing = true;
while (keepGoing) {
  // ooo, một hằng số sáng bóng!
  const value = Math.random();
  if (value > 0.5) {
    keepGoing = false;
  }
}
```

Giống như biến thể `let` của chương trình này mà chúng ta đã thấy trước đó, `const` đang được chạy chính xác một lần trong mỗi lần lặp vòng lặp, vì vậy nó an toàn khỏi các rắc rối "khai báo lại". Nhưng mọi thứ trở nên phức tạp hơn khi chúng ta nói về các vòng lặp `for`.

`for..in` và `for..of` đều ổn khi sử dụng với `const`:

```js
for (const index in students) {
  // điều này ổn
}

for (const student of students) {
  // điều này cũng ổn
}
```

Nhưng không phải vòng lặp `for` chung:

```js
for (const i = 0; i < 3; i++) {
  // oops, điều này sẽ thất bại với
  // một Type Error sau lần lặp đầu tiên
}
```

Có gì sai ở đây? Chúng ta có thể sử dụng `let` tốt trong cấu trúc này, và chúng ta đã khẳng định rằng nó tạo ra một `i` mới cho mỗi scope lần lặp vòng lặp, vì vậy nó thậm chí có vẻ không phải là một "khai báo lại."

Hãy "mở rộng" vòng lặp đó trong đầu như chúng ta đã làm trước đó:

```js
{
  // một biến hư cấu để minh họa
  const $$i = 0;

  for (; $$i < 3; $$i++) {
    // đây là `i` thực tế của vòng lặp của chúng ta!
    const i = $$i;
    // ..
  }
}
```

Bạn có phát hiện ra vấn đề không? `i` của chúng ta thực sự chỉ được tạo một lần bên trong vòng lặp. Đó không phải là vấn đề. Vấn đề là `$$i` khái niệm phải được tăng lên mỗi lần với biểu thức `$$i++`. Đó là **gán lại** (re-assignment) (không phải "khai báo lại"), điều không được phép đối với các hằng số.

Hãy nhớ rằng, dạng "mở rộng" này chỉ là một mô hình khái niệm để giúp bạn trực giác về nguồn gốc của vấn đề. Bạn có thể tự hỏi liệu JS có thể thực hiện `const $$i = 0` thay vào đó thành `let $ii = 0` một cách hiệu quả, điều này sau đó sẽ cho phép `const` hoạt động với vòng lặp `for` cổ điển của chúng ta không? Có thể, nhưng sau đó nó có thể đã đưa ra các ngoại lệ có khả năng gây ngạc nhiên cho ngữ nghĩa của vòng lặp `for`.

Ví dụ, sẽ là một ngoại lệ sắc thái khá tùy ý (và có khả năng gây nhầm lẫn) để cho phép `i++` trong header của vòng lặp `for` lách qua sự nghiêm ngặt của việc gán `const`, nhưng không cho phép các phép gán lại `i` khác bên trong lần lặp vòng lặp, như đôi khi hữu ích.

Câu trả lời đơn giản là: `const` không thể được sử dụng với dạng vòng lặp `for` cổ điển vì yêu cầu gán lại.

Thú vị thay, nếu bạn không thực hiện gán lại, thì nó hợp lệ:

```js
var keepGoing = true;

for (const i = 0; keepGoing /* không có gì ở đây */; ) {
  keepGoing = Math.random() > 0.5;
  // ..
}
```

Điều đó hoạt động, nhưng nó vô nghĩa. Không có lý do gì để khai báo `i` ở vị trí đó với một `const`, vì toàn bộ mục đích của một biến như vậy ở vị trí đó là **để được sử dụng cho việc đếm số lần lặp**. Chỉ cần sử dụng một dạng vòng lặp khác, như vòng lặp `while`, hoặc sử dụng một `let`!

### Các Biến Chưa Được Khởi Tạo (aka, TDZ) (Uninitialized Variables (aka, TDZ))

Với các khai báo `var`, biến được "hoisted" lên đầu scope của nó. Nhưng nó cũng được tự động khởi tạo với giá trị `undefined`, để biến có thể được sử dụng trong toàn bộ scope.

Tuy nhiên, các khai báo `let` và `const` không hoàn toàn giống nhau về mặt này.

Xem xét:

```js
console.log(studentName);
// ReferenceError

let studentName = "Suzy";
```

Kết quả của chương trình này là một `ReferenceError` được ném ra ở dòng đầu tiên. Tùy thuộc vào môi trường JS của bạn, thông báo lỗi có thể nói điều gì đó như: "Cannot access studentName before initialization."

> **LƯU Ý:** Thông báo lỗi như thấy ở đây từng mơ hồ hoặc gây hiểu lầm hơn nhiều. Rất may, một số người trong chúng ta trong cộng đồng đã thành công trong việc vận động các JS engines cải thiện thông báo lỗi này để nó cho bạn biết chính xác hơn những gì sai!

Thông báo lỗi đó khá chỉ dẫn về những gì sai: `studentName` tồn tại ở dòng 1, nhưng nó chưa được khởi tạo, vì vậy nó chưa thể được sử dụng. Hãy thử điều này:

```js
studentName = "Suzy"; // hãy thử khởi tạo nó!
// ReferenceError

console.log(studentName);

let studentName;
```

Oops. Chúng ta vẫn nhận được `ReferenceError`, nhưng bây giờ là ở dòng đầu tiên nơi chúng ta đang cố gắng gán cho (aka, khởi tạo!) biến được gọi là "chưa được khởi tạo" `studentName` này. Vấn đề là gì!?

Câu hỏi thực sự là, làm thế nào để chúng ta khởi tạo một biến chưa được khởi tạo? Đối với `let`/`const`, **cách duy nhất** để làm như vậy là với một phép gán được gắn vào một câu lệnh khai báo. Một phép gán tự nó là không đủ! Xem xét:

```js
let studentName = "Suzy";
console.log(studentName); // Suzy
```

Ở đây, chúng ta đang khởi tạo `studentName` (trong trường hợp này, thành `"Suzy"` thay vì `undefined`) bằng cách sử dụng dạng câu lệnh khai báo `let` được kết hợp với một phép gán.

Hoặc:

```js
// ..

let studentName;
// hoặc:
// let studentName = undefined;

// ..

studentName = "Suzy";

console.log(studentName);
// Suzy
```

> **LƯU Ý:** Thật thú vị! Hãy nhớ lại từ trước đó, chúng ta đã nói rằng `var studentName;` _không_ giống với `var studentName = undefined;`, nhưng ở đây với `let`, chúng hoạt động giống nhau. Sự khác biệt nằm ở thực tế là `var studentName` tự động khởi tạo ở đầu scope, trong khi `let studentName` thì không.

Hãy nhớ rằng chúng ta đã khẳng định một vài lần cho đến nay rằng _Compiler_ cuối cùng sẽ loại bỏ bất kỳ declarators `var`/`let`/`const` nào, thay thế chúng bằng các hướng dẫn ở đầu mỗi scope để đăng ký các định danh thích hợp.

Vì vậy, nếu chúng ta phân tích những gì đang diễn ra ở đây, chúng ta thấy rằng một sắc thái bổ sung là _Compiler_ cũng đang thêm một hướng dẫn ở giữa chương trình, tại điểm mà biến `studentName` được khai báo, để xử lý việc tự động khởi tạo của khai báo đó. Chúng ta không thể sử dụng biến tại bất kỳ điểm nào trước khi việc khởi tạo đó xảy ra. Điều tương tự cũng áp dụng cho `const` như đối với `let`.

Thuật ngữ được TC39 đặt ra để chỉ _khoảng thời gian_ này từ khi nhập một scope đến nơi việc tự động khởi tạo của biến xảy ra là: Temporal Dead Zone (TDZ).

TDZ là cửa sổ thời gian nơi một biến tồn tại nhưng vẫn chưa được khởi tạo, và do đó không thể được truy cập theo bất kỳ cách nào. Chỉ việc thực thi các hướng dẫn do _Compiler_ để lại tại điểm của khai báo gốc mới có thể thực hiện việc khởi tạo đó. Sau thời điểm đó, TDZ kết thúc, và biến được tự do sử dụng cho phần còn lại của scope.

Một `var` cũng có TDZ về mặt kỹ thuật, nhưng nó có độ dài bằng không và do đó không thể quan sát được đối với các chương trình của chúng ta! Chỉ `let` và `const` có một TDZ có thể quan sát được.

Nhân tiện, "temporal" trong TDZ thực sự đề cập đến _thời gian_ không phải _vị trí trong code_. Xem xét:

```js
askQuestion();
// ReferenceError

let studentName = "Suzy";

function askQuestion() {
  console.log(`${studentName}, do you know?`);
}
```

Mặc dù về mặt vị trí, `console.log(..)` tham chiếu `studentName` đến _sau_ khai báo `let studentName`, về mặt thời gian hàm `askQuestion()` được gọi _trước_ khi câu lệnh `let` được bắt gặp, trong khi `studentName` vẫn đang trong TDZ của nó! Do đó có lỗi.

Có một quan niệm sai lầm phổ biến rằng TDZ có nghĩa là `let` và `const` không hoist. Đây là một tuyên bố không chính xác, hoặc ít nhất là hơi gây hiểu lầm. Chúng chắc chắn có hoist.

Sự khác biệt thực tế là các khai báo `let`/`const` không tự động khởi tạo ở đầu scope, theo cách mà `var` làm. _Cuộc tranh luận_ sau đó là liệu việc tự động khởi tạo có phải là _một phần của_ hoisting hay không? Tôi nghĩ rằng việc tự động đăng ký một biến ở đầu scope (tức là, cái mà tôi gọi là "hoisting") và việc tự động khởi tạo ở đầu scope (thành `undefined`) là các hoạt động riêng biệt và không nên bị gộp chung dưới một thuật ngữ duy nhất "hoisting."

Chúng ta đã thấy rằng `let` và `const` không tự động khởi tạo ở đầu scope. Nhưng hãy chứng minh rằng `let` và `const` _có_ hoist (tự động đăng ký ở đầu scope), nhờ vào người bạn shadowing của chúng ta (xem "Shadowing" trong Chương 3):

```js
var studentName = "Kyle";

{
  console.log(studentName);
  // ???

  // ..

  let studentName = "Suzy";

  console.log(studentName);
  // Suzy
}
```

Điều gì sẽ xảy ra với câu lệnh `console.log(..)` đầu tiên? Nếu `let studentName` không hoist lên đầu scope, thì `console.log(..)` đầu tiên _nên_ in `"Kyle"`, đúng không? Vào thời điểm đó, có vẻ như chỉ có `studentName` bên ngoài tồn tại, vì vậy đó là biến mà `console.log(..)` nên truy cập và in ra.

Nhưng thay vào đó, `console.log(..)` đầu tiên ném ra một lỗi TDZ, bởi vì thực tế, `studentName` của scope bên trong **đã** được hoisted (tự động đăng ký ở đầu scope). Điều **chưa** xảy ra (chưa!) là việc tự động khởi tạo của `studentName` bên trong đó; nó vẫn chưa được khởi tạo vào thời điểm đó, do đó có vi phạm TDZ!

Vì vậy, để tóm tắt, lỗi TDZ xảy ra vì các khai báo `let`/`const` _có_ hoist các khai báo của chúng lên đầu scopes của chúng, nhưng không giống như `var`, chúng hoãn việc tự động khởi tạo các biến của chúng cho đến thời điểm trong trình tự của code nơi khai báo gốc xuất hiện. Cửa sổ thời gian này (gợi ý: temporal), bất kể độ dài của nó là bao nhiêu, là TDZ.

Làm thế nào bạn có thể tránh lỗi TDZ?

Lời khuyên của tôi: luôn đặt các khai báo `let` và `const` của bạn ở đầu bất kỳ scope nào. Thu nhỏ cửa sổ TDZ xuống độ dài bằng không (hoặc gần bằng không), và sau đó nó sẽ không còn là vấn đề.

Nhưng tại sao TDZ lại là một vấn đề? Tại sao TC39 không quy định rằng `let`/`const` tự động khởi tạo theo cách `var` làm? Chỉ cần kiên nhẫn, chúng ta sẽ quay trở lại để khám phá _lý do_ của TDZ trong Phụ lục A.

### Cuối Cùng Cũng Được Khởi Tạo (Finally Initialized)

Làm việc với các biến có nhiều sắc thái hơn vẻ ngoài thoạt nhìn. _Hoisting_, _(tái) khai báo_, và _TDZ_ là những nguồn gây nhầm lẫn phổ biến cho các nhà phát triển, đặc biệt là những người đã làm việc trong các ngôn ngữ khác trước khi đến với JS. Trước khi tiếp tục, hãy đảm bảo mô hình tinh thần của bạn hoàn toàn dựa trên các khía cạnh này của JS scope và các biến.

Hoisting thường được trích dẫn như một cơ chế rõ ràng của JS engine, nhưng thực sự nó giống một ẩn dụ hơn để mô tả các cách khác nhau mà JS xử lý các khai báo biến trong quá trình biên dịch. Nhưng ngay cả khi là một ẩn dụ, hoisting cung cấp cấu trúc hữu ích để suy nghĩ về vòng đời của một biến—khi nào nó được tạo ra, khi nào nó có sẵn để sử dụng, khi nào nó biến mất.

Khai báo và khai báo lại các biến có xu hướng gây nhầm lẫn khi được coi là các hoạt động runtime. Nhưng nếu bạn chuyển sang suy nghĩ thời gian biên dịch (compile-time) cho các hoạt động này, những điều kỳ quặc và _bóng tối_ sẽ giảm bớt.

Lỗi TDZ (temporal dead zone) rất lạ và gây nản lòng khi gặp phải. May mắn thay, TDZ tương đối đơn giản để tránh nếu bạn luôn cẩn thận đặt các khai báo `let`/`const` ở đầu bất kỳ scope nào.

Khi bạn điều hướng thành công những khúc quanh và ngã rẽ này của variable scope, chương tiếp theo sẽ đưa ra các yếu tố hướng dẫn các quyết định của chúng ta để đặt các khai báo trong các scopes khác nhau, đặc biệt là các nested blocks.

---

## Chương 6: Giới Hạn Sự Phơi Bày Của Scope (Limiting Scope Exposure)

Cho đến nay trọng tâm của chúng ta là giải thích cơ chế hoạt động của scopes và các biến. Với nền tảng đó giờ đây đã vững chắc, sự chú ý của chúng ta nâng lên một cấp độ tư duy cao hơn: các quyết định và mô hình chúng ta áp dụng trên toàn bộ chương trình.

Để bắt đầu, chúng ta sẽ xem xét cách thức và lý do tại sao chúng ta nên sử dụng các cấp độ scope khác nhau (hàm và blocks) để tổ chức các biến của chương trình, cụ thể là để giảm sự phơi bày quá mức của scope.

### Phơi Bày Ít Nhất (Least Exposure)

Việc các hàm định nghĩa scopes riêng của chúng là hợp lý. Nhưng tại sao chúng ta cũng cần các blocks để tạo ra scopes?

Kỹ thuật phần mềm nêu rõ một kỷ luật cơ bản, thường được áp dụng cho bảo mật phần mềm, được gọi là "Nguyên tắc Đặc quyền Ít nhất" (The Principle of Least Privilege - POLP). [^POLP] Và một biến thể của nguyên tắc này áp dụng cho cuộc thảo luận hiện tại của chúng ta thường được dán nhãn là "Phơi bày Ít nhất" (Least Exposure - POLE).

POLP thể hiện một tư thế phòng thủ đối với kiến trúc phần mềm: các thành phần của hệ thống nên được thiết kế để hoạt động với ít đặc quyền nhất, ít quyền truy cập nhất, ít sự phơi bày nhất. Nếu mỗi mảnh được kết nối với các khả năng tối thiểu cần thiết, hệ thống tổng thể sẽ mạnh hơn từ quan điểm bảo mật, bởi vì sự thỏa hiệp hoặc thất bại của một mảnh có tác động giảm thiểu đến phần còn lại của hệ thống.

Nếu POLP tập trung vào thiết kế thành phần cấp hệ thống, biến thể POLE _Exposure_ tập trung vào cấp độ thấp hơn; chúng ta sẽ áp dụng nó vào cách các scopes tương tác với nhau.

Khi tuân theo POLE, chúng ta muốn giảm thiểu sự phơi bày của cái gì? Đơn giản là: các biến được đăng ký trong mỗi scope.

Hãy nghĩ theo cách này: tại sao bạn không nên chỉ đặt tất cả các biến của chương trình của mình ra ngoài global scope? Điều đó có lẽ ngay lập tức cảm thấy giống như một ý tưởng tồi, nhưng đáng để xem xét lý do tại sao lại như vậy. Khi các biến được sử dụng bởi một phần của chương trình được phơi bày cho một phần khác của chương trình, thông qua scope, có ba mối nguy hiểm chính thường phát sinh:

- **Xung đột Tên (Naming Collisions)**: nếu bạn sử dụng một tên biến/hàm phổ biến và hữu ích trong hai phần khác nhau của chương trình, nhưng định danh đến từ một scope được chia sẻ (như global scope), thì xung đột tên xảy ra, và rất có thể các lỗi sẽ xảy ra khi một phần sử dụng biến/hàm theo cách mà phần kia không mong đợi.

  Ví dụ, hãy tưởng tượng nếu tất cả các vòng lặp của bạn sử dụng một biến index `i` toàn cục duy nhất, và sau đó xảy ra trường hợp một vòng lặp trong một hàm đang chạy trong một lần lặp của một vòng lặp từ một hàm khác, và bây giờ biến `i` được chia sẻ nhận một giá trị không mong muốn.

- **Hành vi Không mong muốn (Unexpected Behavior)**: nếu bạn phơi bày các biến/hàm mà việc sử dụng chúng nếu không sẽ là _riêng tư_ (private) cho một phần của chương trình, nó cho phép các nhà phát triển khác sử dụng chúng theo những cách bạn không dự định, điều này có thể vi phạm hành vi mong đợi và gây ra lỗi.

  Ví dụ, nếu phần chương trình của bạn giả định một mảng chứa tất cả các số, nhưng code của người khác truy cập và sửa đổi mảng để bao gồm booleans và chuỗi, code của bạn sau đó có thể hoạt động sai theo những cách không mong muốn.

  Tệ hơn, việc phơi bày các chi tiết _riêng tư_ mời gọi những người có ý đồ xấu cố gắng lách qua các giới hạn bạn đã áp đặt, để làm những điều với phần mềm của bạn mà không nên được phép.

- **Sự phụ thuộc Không chủ ý (Unintended Dependency)**: nếu bạn phơi bày các biến/hàm một cách không cần thiết, nó mời gọi các nhà phát triển khác sử dụng và phụ thuộc vào những phần _riêng tư_ đó. Mặc dù điều đó không phá vỡ chương trình của bạn ngày hôm nay, nó tạo ra một mối nguy hiểm tái cấu trúc trong tương lai, bởi vì bây giờ bạn không thể dễ dàng tái cấu trúc biến hoặc hàm đó mà không có khả năng phá vỡ các phần khác của phần mềm mà bạn không kiểm soát.

  Ví dụ, nếu code của bạn dựa vào một mảng các số, và sau đó bạn quyết định tốt hơn là nên sử dụng một cấu trúc dữ liệu khác thay vì mảng, bây giờ bạn phải chịu trách nhiệm điều chỉnh các phần bị ảnh hưởng khác của phần mềm.

POLE, khi áp dụng cho scoping của biến/hàm, về cơ bản nói rằng, mặc định là phơi bày mức tối thiểu cần thiết, giữ mọi thứ khác riêng tư nhất có thể. Khai báo các biến trong các scopes càng nhỏ và lồng nhau càng sâu càng tốt, thay vì đặt mọi thứ trong global (hoặc thậm chí outer function) scope.

Nếu bạn thiết kế phần mềm của mình phù hợp, bạn có cơ hội lớn hơn nhiều để tránh (hoặc ít nhất là giảm thiểu) ba mối nguy hiểm này.

Xem xét:

```js
function diff(x, y) {
  if (x > y) {
    let tmp = x;
    x = y;
    y = tmp;
  }

  return y - x;
}

diff(3, 7); // 4
diff(7, 5); // 2
```

Trong hàm `diff(..)` này, chúng ta muốn đảm bảo rằng `y` lớn hơn hoặc bằng `x`, để khi chúng ta trừ (`y - x`), kết quả là `0` hoặc lớn hơn. Nếu `x` ban đầu lớn hơn (kết quả sẽ là âm!), chúng ta hoán đổi `x` và `y` bằng cách sử dụng một biến `tmp`, để giữ cho kết quả dương.

Trong ví dụ đơn giản này, có vẻ không quan trọng liệu `tmp` nằm bên trong blocks `if` hay nó thuộc về cấp độ hàm—nó chắc chắn không nên là một biến toàn cục! Tuy nhiên, theo nguyên tắc POLE, `tmp` nên được ẩn trong scope càng nhiều càng tốt. Vì vậy, chúng ta block scope `tmp` (sử dụng `let`) vào block `if`.

### Ẩn Trong Scope (Hàm) Đơn Giản (Hiding in Plain (Function) Scope)

Bây giờ hẳn đã rõ tại sao việc ẩn các khai báo biến và hàm của chúng ta trong các scopes thấp nhất (lồng nhau sâu nhất) có thể là quan trọng. Nhưng chúng ta làm điều đó như thế nào?

Chúng ta đã thấy các từ khóa `let` và `const`, là các bộ khai báo block scoped; chúng ta sẽ quay lại với chúng chi tiết hơn ngay sau đây. Nhưng trước tiên, còn về việc ẩn các khai báo `var` hoặc `function` trong scopes thì sao? Điều đó có thể dễ dàng được thực hiện bằng cách bao bọc một `function` scope xung quanh một khai báo.

Hãy xem xét một ví dụ nơi `function` scoping có thể hữu ích.

Phép toán "giai thừa" (ký hiệu là "6!") là phép nhân của một số nguyên nhất định với tất cả các số nguyên thấp hơn liên tiếp xuống đến `1`—thực ra, bạn có thể dừng ở `2` vì nhân với `1` không làm gì cả. Nói cách khác, "6!" giống như "6 _ 5!", giống như "6 _ 5 \* 4!", và cứ thế. Do bản chất của toán học liên quan, một khi giai thừa của bất kỳ số nguyên nào (như "4!") đã được tính toán, chúng ta không cần phải làm lại công việc đó nữa, vì nó sẽ luôn là cùng một câu trả lời.

Vì vậy, nếu bạn tính giai thừa một cách ngây thơ cho `6`, sau đó muốn tính giai thừa cho `7`, bạn có thể tính toán lại một cách không cần thiết các giai thừa của tất cả các số nguyên từ 2 đến 6. Nếu bạn sẵn sàng đánh đổi bộ nhớ lấy tốc độ, bạn có thể giải quyết việc tính toán lãng phí đó bằng cách lưu trữ (caching) giai thừa của mỗi số nguyên khi nó được tính toán:

```js
var cache = {};

function factorial(x) {
  if (x < 2) return 1;
  if (!(x in cache)) {
    cache[x] = x * factorial(x - 1);
  }
  return cache[x];
}

factorial(6);
// 720

cache;
// {
//     "2": 2,
//     "3": 6,
//     "4": 24,
//     "5": 120,
//     "6": 720
// }

factorial(7);
// 5040
```

Chúng ta đang lưu trữ tất cả các giai thừa đã tính toán trong `cache` để qua nhiều lần gọi đến `factorial(..)`, các tính toán trước đó vẫn còn. Nhưng biến `cache` khá rõ ràng là một chi tiết _riêng tư_ về cách `factorial(..)` hoạt động, không phải là thứ nên được phơi bày trong một outer scope—đặc biệt không phải là global scope.

> **LƯU Ý:** `factorial(..)` ở đây là đệ quy—một cuộc gọi đến chính nó được thực hiện từ bên trong—nhưng đó chỉ là vì sự ngắn gọn của code; một triển khai không đệ quy sẽ mang lại phân tích scoping tương tự đối với `cache`.

Tuy nhiên, việc sửa vấn đề phơi bày quá mức này không đơn giản như việc ẩn biến `cache` bên trong `factorial(..)`, như vẻ ngoài của nó. Vì chúng ta cần `cache` tồn tại qua nhiều lần gọi, nó phải được đặt trong một scope bên ngoài hàm đó. Vì vậy, chúng ta có thể làm gì?

Định nghĩa một middle scope khác (giữa outer/global scope và bên trong của `factorial(..)`) để `cache` được đặt ở đó:

```js
// outer/global scope

function hideTheCache() {
  // "middle scope", nơi chúng ta ẩn `cache`
  var cache = {};

  return factorial;

  // **********************

  function factorial(x) {
    // inner scope
    if (x < 2) return 1;
    if (!(x in cache)) {
      cache[x] = x * factorial(x - 1);
    }
    return cache[x];
  }
}

var factorial = hideTheCache();

factorial(6);
// 720

factorial(7);
// 5040
```

Hàm `hideTheCache()` không phục vụ mục đích nào khác ngoài việc tạo một scope để `cache` tồn tại trong đó qua nhiều lần gọi đến `factorial(..)`. Nhưng để `factorial(..)` có quyền truy cập vào `cache`, chúng ta phải định nghĩa `factorial(..)` bên trong cùng scope đó. Sau đó, chúng ta trả về tham chiếu hàm, như một giá trị từ `hideTheCache()`, và lưu trữ nó trong một biến outer scope, cũng được đặt tên là `factorial`. Bây giờ khi chúng ta gọi `factorial(..)` (nhiều lần!), `cache` bền bỉ của nó vẫn được ẩn nhưng chỉ có thể truy cập được đối với `factorial(..)`!

OK, nhưng... sẽ thật tẻ nhạt khi phải định nghĩa (và đặt tên!) một `hideTheCache(..)` function scope mỗi khi nhu cầu ẩn biến/hàm như vậy xảy ra, đặc biệt là vì chúng ta có thể sẽ muốn tránh xung đột tên với hàm này bằng cách đặt cho mỗi lần xuất hiện một cái tên duy nhất. Ugh.

> **LƯU Ý:** Kỹ thuật được minh họa—lưu trữ đầu ra đã tính toán của một hàm để tối ưu hóa hiệu suất khi các cuộc gọi lặp lại của cùng đầu vào được mong đợi—khá phổ biến trong thế giới Lập trình Hàm (Functional Programming - FP), thường được gọi là "memoization"; việc lưu trữ này dựa vào closure (xem Chương 7). Ngoài ra, có những lo ngại về sử dụng bộ nhớ (được giải quyết trong "A Word About Memory" trong Phụ lục B). Các thư viện FP thường sẽ cung cấp một tiện ích được tối ưu hóa và kiểm tra kỹ lưỡng cho việc memoization của các hàm, sẽ thay thế cho `hideTheCache(..)` ở đây. Memoization nằm ngoài _scope_ (chơi chữ!) của cuộc thảo luận của chúng ta, nhưng hãy xem cuốn sách _Functional-Light JavaScript_ của tôi để biết thêm thông tin.

Thay vì định nghĩa một hàm mới và được đặt tên duy nhất mỗi khi một trong những tình huống scope-chỉ-dành-cho-mục-đích-ẩn-một-biến đó xảy ra, một giải pháp có lẽ tốt hơn là sử dụng một biểu thức hàm (function expression):

```js
var factorial = (function hideTheCache() {
  var cache = {};

  function factorial(x) {
    if (x < 2) return 1;
    if (!(x in cache)) {
      cache[x] = x * factorial(x - 1);
    }
    return cache[x];
  }

  return factorial;
})();

factorial(6);
// 720

factorial(7);
// 5040
```

Đợi đã! Điều này vẫn đang sử dụng một hàm để tạo scope cho việc ẩn `cache`, và trong trường hợp này, hàm vẫn được đặt tên là `hideTheCache`, vậy nó giải quyết được gì?

Hãy nhớ lại từ "Function Name Scope" (trong Chương 3), những gì xảy ra với định danh tên từ một biểu thức `function`. Vì `hideTheCache(..)` được định nghĩa là một biểu thức `function` thay vì một khai báo `function`, tên của nó nằm trong scope riêng của nó—về cơ bản là cùng scope với `cache`—thay vì trong outer/global scope.

Điều đó có nghĩa là chúng ta có thể đặt tên cho mỗi lần xuất hiện của một biểu thức hàm như vậy cùng một cái tên chính xác, và không bao giờ có bất kỳ xung đột nào. Thích hợp hơn, chúng ta có thể đặt tên cho mỗi lần xuất hiện theo ngữ nghĩa dựa trên bất cứ điều gì chúng ta đang cố gắng ẩn, và không lo lắng rằng bất kỳ cái tên nào chúng ta chọn sẽ xung đột với bất kỳ biểu thức `function` scope nào khác trong chương trình.

Trên thực tế, chúng ta _có thể_ chỉ cần bỏ qua tên hoàn toàn—do đó định nghĩa một "biểu thức `function` ẩn danh" thay vào đó. Nhưng Phụ lục A sẽ thảo luận về tầm quan trọng của tên ngay cả đối với các hàm chỉ dành cho scope như vậy.

#### Gọi Ngay Lập Tức Các Biểu Thức Hàm (Invoking Function Expressions Immediately)

Có một chút quan trọng khác trong chương trình đệ quy giai thừa trước đó mà dễ bị bỏ lỡ: dòng ở cuối biểu thức `function` chứa `})();`.

Lưu ý rằng chúng ta đã bao quanh toàn bộ biểu thức `function` trong một cặp `( .. )`, và sau đó ở cuối, chúng ta đã thêm cặp ngoặc đơn `()` thứ hai đó; đó thực sự là gọi biểu thức `function` mà chúng ta vừa định nghĩa. Hơn nữa, trong trường hợp này, cặp `( .. )` bao quanh đầu tiên xung quanh biểu thức hàm không thực sự cần thiết (sẽ nói thêm về điều đó trong giây lát), nhưng chúng ta đã sử dụng chúng để dễ đọc dù sao đi nữa.

Vì vậy, nói cách khác, chúng ta đang định nghĩa một biểu thức `function` sau đó được gọi ngay lập tức. Mô hình phổ biến này có một cái tên (rất sáng tạo!): Biểu thức Hàm được Gọi Ngay lập tức (Immediately Invoked Function Expression - IIFE).

Một IIFE hữu ích khi chúng ta muốn tạo một scope để ẩn các biến/hàm. Vì nó là một biểu thức, nó có thể được sử dụng ở **bất kỳ** nơi nào trong một chương trình JS nơi một biểu thức được cho phép. Một IIFE có thể được đặt tên, như với `hideTheCache()`, hoặc (phổ biến hơn nhiều!) không tên/ẩn danh. Và nó có thể đứng một mình hoặc, như trước đây, là một phần của một câu lệnh khác—`hideTheCache()` trả về tham chiếu hàm `factorial()` sau đó được `=` gán cho biến `factorial`.

Để so sánh, đây là một ví dụ về một IIFE đứng một mình:

```js
// outer scope

(function () {
  // inner hidden scope
})();

// more outer scope
```

Không giống như trước đó với `hideTheCache()`, nơi `(..)` bao quanh bên ngoài được ghi chú là một lựa chọn phong cách tùy chọn, đối với một IIFE đứng một mình, chúng là **bắt buộc**; chúng phân biệt `function` như một biểu thức, không phải một câu lệnh. Tuy nhiên, để nhất quán, hãy luôn bao quanh một `function` IIFE với `( .. )`.

> **LƯU Ý:** Về mặt kỹ thuật, `( .. )` bao quanh không phải là cách cú pháp duy nhất để đảm bảo `function` trong một IIFE được trình phân tích cú pháp JS coi là một biểu thức hàm. Chúng ta sẽ xem xét một số tùy chọn khác trong Phụ lục A.

**Ranh Giới Hàm (Function Boundaries)**

Hãy cẩn thận rằng việc sử dụng một IIFE để định nghĩa một scope có thể có một số hậu quả không chủ ý, tùy thuộc vào code xung quanh nó. Bởi vì một IIFE là một hàm đầy đủ, ranh giới hàm thay đổi hành vi của các câu lệnh/cấu trúc nhất định.

Ví dụ, một câu lệnh `return` trong một đoạn code nào đó sẽ thay đổi ý nghĩa của nó nếu một IIFE được bọc quanh nó, bởi vì bây giờ `return` sẽ tham chiếu đến hàm của IIFE. Các IIFE không phải arrow function cũng thay đổi ràng buộc của một từ khóa `this`—xem thêm về điều đó trong cuốn sách _Objects & Classes_. Và các câu lệnh như `break` và `continue` sẽ không hoạt động qua một ranh giới hàm IIFE để kiểm soát một vòng lặp hoặc block bên ngoài.

Vì vậy, nếu code bạn cần bọc một scope xung quanh có `return`, `this`, `break`, hoặc `continue` trong đó, một IIFE có lẽ không phải là cách tiếp cận tốt nhất. Trong trường hợp đó, bạn có thể tìm cách tạo scope với một block thay vì một hàm.

### Scoping với Blocks (Scoping with Blocks)

Đến điểm này, bạn nên cảm thấy khá thoải mái với những lợi ích của việc tạo scopes để giới hạn sự phơi bày của định danh.

Cho đến nay, chúng ta đã xem xét việc thực hiện điều này thông qua scope `function` (tức là, IIFE). Nhưng bây giờ chúng ta hãy xem xét việc sử dụng các khai báo `let` với các nested blocks. Nói chung, bất kỳ cặp ngoặc nhọn `{ .. }` nào là một câu lệnh sẽ hoạt động như một block, nhưng **không nhất thiết** là một scope.

Một block chỉ trở thành một scope nếu cần thiết, để chứa các khai báo block-scoped của nó (tức là, `let` hoặc `const`). Xem xét:

```js
{
  // chưa nhất thiết là một scope

  // ..

  // bây giờ chúng ta biết block cần phải là một scope
  let thisIsNowAScope = true;

  for (let i = 0; i < 5; i++) {
    // đây cũng là một scope, được kích hoạt mỗi
    // lần lặp
    if (i % 2 == 0) {
      // đây chỉ là một block, không phải là một scope
      console.log(i);
    }
  }
}
// 0 2 4
```

Không phải tất cả các cặp ngoặc nhọn `{ .. }` đều tạo ra các blocks (và do đó đủ điều kiện để trở thành scopes):

- Object literals sử dụng các cặp ngoặc nhọn `{ .. }` để giới hạn các danh sách key-value của chúng, nhưng các giá trị object như vậy **không phải** là scopes.

- `class` sử dụng ngoặc nhọn `{ .. }` xung quanh định nghĩa thân của nó, nhưng đây không phải là một block hoặc scope.

- Một `function` sử dụng `{ .. } ` xung quanh thân của nó, nhưng về mặt kỹ thuật đây không phải là một block—nó là một câu lệnh đơn cho thân hàm. Tuy nhiên, nó _là_ một (function) scope.

- Cặp ngoặc nhọn `{ .. }` trên một câu lệnh `switch` (xung quanh tập hợp các mệnh đề `case`) không định nghĩa một block/scope.

Ngoài các ví dụ không phải block như vậy, một cặp ngoặc nhọn `{ .. }` có thể định nghĩa một block gắn liền với một câu lệnh (như một `if` hoặc `for`), hoặc đứng một mình—xem cặp ngoặc nhọn `{ .. }` ngoài cùng trong đoạn trích trước. Một block rõ ràng kiểu này—nếu nó không có khai báo nào, nó thực sự không phải là một scope—không phục vụ mục đích hoạt động nào, mặc dù nó vẫn có thể hữu ích như một tín hiệu ngữ nghĩa.

Các blocks `{ .. }` đứng một mình rõ ràng đã luôn là cú pháp JS hợp lệ, nhưng vì chúng không thể là một scope trước `let`/`const` của ES6, chúng khá hiếm. Tuy nhiên, sau ES6, chúng đang bắt đầu trở nên phổ biến một chút.

Trong hầu hết các ngôn ngữ hỗ trợ block scoping, một block scope rõ ràng là một mô hình cực kỳ phổ biến để tạo ra một lát cắt scope hẹp cho một hoặc một vài biến. Vì vậy, theo nguyên tắc POLE, chúng ta cũng nên nắm lấy mô hình này rộng rãi hơn trong JS; sử dụng (explicit) block scoping để thu hẹp sự phơi bày của các định danh đến mức tối thiểu thực tế.

Một explicit block scope có thể hữu ích ngay cả bên trong một block khác (cho dù block bên ngoài có phải là một scope hay không).

Ví dụ:

```js
if (somethingHappened) {
  // đây là một block, nhưng không phải là một scope

  {
    // đây vừa là một block vừa là một
    // explicit scope
    let msg = somethingHappened.message();
    notifyOthers(msg);
  }

  // ..

  recoverFromSomething();
}
```

Ở đây, cặp ngoặc nhọn `{ .. }` **bên trong** câu lệnh `if` là một inner explicit block scope thậm chí còn nhỏ hơn cho `msg`, vì biến đó không cần thiết cho toàn bộ block `if`. Hầu hết các nhà phát triển sẽ chỉ block-scope `msg` cho block `if` và tiếp tục. Và công bằng mà nói, khi chỉ có một vài dòng để xem xét, đó là một cuộc gọi phán xét ngang ngửa. Nhưng khi code phát triển, các vấn đề phơi bày quá mức này trở nên rõ rệt hơn.

Vậy có quan trọng đủ để thêm cặp `{ .. }` phụ và mức thụt lề không? Tôi nghĩ bạn nên tuân theo POLE và luôn luôn (trong giới hạn hợp lý!) định nghĩa block nhỏ nhất cho mỗi biến. Vì vậy, tôi khuyên bạn nên sử dụng scope block rõ ràng bổ sung như được hiển thị.

Hãy nhớ lại cuộc thảo luận về lỗi TDZ từ "Uninitialized Variables (TDZ)" (Chương 5). Gợi ý của tôi ở đó là: để giảm thiểu nguy cơ lỗi TDZ với các khai báo `let`/`const`, hãy luôn đặt các khai báo đó ở đầu scope của chúng.

Nếu bạn thấy mình đặt một khai báo `let` ở giữa một scope, trước tiên hãy nghĩ, "Oh, no! TDZ alert!" Nếu khai báo `let` này không cần thiết trong nửa đầu của block đó, bạn nên sử dụng một inner explicit block scope để thu hẹp hơn nữa sự phơi bày của nó!

Một ví dụ khác với một explicit block scope:

```js
function getNextMonthStart(dateStr) {
  var nextMonth, year;

  {
    let curMonth;
    [, year, curMonth] = dateStr.match(/(\d{4})-(\d{2})-\d{2}/) || [];
    nextMonth = (Number(curMonth) % 12) + 1;
  }

  if (nextMonth == 1) {
    year++;
  }

  return `${year}-${String(nextMonth).padStart(2, "0")}-01`;
}
getNextMonthStart("2019-12-25"); // 2020-01-01
```

Đầu tiên hãy xác định các scopes và các định danh của chúng:

1. Outer/global scope có một định danh, hàm `getNextMonthStart(..)`.

2. Function scope cho `getNextMonthStart(..)` có ba: `dateStr` (tham số), `nextMonth`, và `year`.

3. Cặp ngoặc nhọn `{ .. }` định nghĩa một inner block scope bao gồm một biến: `curMonth`.

Vậy tại sao đặt `curMonth` trong một explicit block scope thay vì chỉ cùng với `nextMonth` và `year` trong top-level function scope? Bởi vì `curMonth` chỉ cần thiết cho hai câu lệnh đầu tiên đó; ở cấp độ function scope nó bị phơi bày quá mức.

Ví dụ này nhỏ, vì vậy những nguy hiểm của việc phơi bày quá mức `curMonth` là khá hạn chế. Nhưng lợi ích của nguyên tắc POLE đạt được tốt nhất khi bạn áp dụng tư duy giảm thiểu sự phơi bày scope theo mặc định, như một thói quen. Nếu bạn tuân theo nguyên tắc này một cách nhất quán ngay cả trong các trường hợp nhỏ, nó sẽ phục vụ bạn nhiều hơn khi các chương trình của bạn phát triển.

Bây giờ hãy xem một ví dụ đáng kể hơn nữa:

```js
function sortNamesByLength(names) {
  var buckets = [];

  for (let firstName of names) {
    if (buckets[firstName.length] == null) {
      buckets[firstName.length] = [];
    }
    buckets[firstName.length].push(firstName);
  }

  // một block để thu hẹp scope
  {
    let sortedNames = [];

    for (let bucket of buckets) {
      if (bucket) {
        // sắp xếp mỗi bucket theo thứ tự alpha
        bucket.sort();

        // nối các tên đã sắp xếp vào
        // danh sách đang chạy của chúng ta
        sortedNames = [...sortedNames, ...bucket];
      }
    }

    return sortedNames;
  }
}

sortNamesByLength(["Sally", "Suzy", "Frank", "John", "Jennifer", "Scott"]);
// [ "John", "Suzy", "Frank", "Sally",
//   "Scott", "Jennifer" ]
```

Có sáu định danh được khai báo trên năm scopes khác nhau. Liệu tất cả các biến này có thể tồn tại trong global/outer scope duy nhất không? Về mặt kỹ thuật, có, vì tất cả chúng đều được đặt tên duy nhất và do đó không có xung đột tên. Nhưng điều này sẽ là tổ chức code thực sự kém, và có khả năng dẫn đến cả sự nhầm lẫn và lỗi trong tương lai.

Chúng ta tách chúng ra vào mỗi inner nested scope khi thích hợp. Mỗi biến được định nghĩa ở scope trong cùng nhất có thể để chương trình hoạt động như mong muốn.

`sortedNames` có thể đã được định nghĩa trong top-level function scope, nhưng nó chỉ cần thiết cho nửa sau của hàm này. Để tránh phơi bày quá mức biến đó trong một scope cấp cao hơn, chúng ta lại tuân theo POLE và block-scope nó trong inner explicit block scope.

#### `var` _và_ `let`

Tiếp theo, hãy nói về khai báo `var buckets`. Biến đó được sử dụng trên toàn bộ hàm (ngoại trừ câu lệnh `return` cuối cùng). Bất kỳ biến nào cần thiết trên tất cả (hoặc thậm chí hầu hết) của một hàm nên được khai báo sao cho việc sử dụng như vậy là rõ ràng.

> **LƯU Ý:** Tham số `names` không được sử dụng trên toàn bộ hàm, nhưng không có cách nào giới hạn scope của một tham số, vì vậy nó hoạt động như một khai báo toàn hàm bất kể thế nào.

Vậy tại sao chúng ta sử dụng `var` thay vì `let` để khai báo biến `buckets`? Có cả lý do ngữ nghĩa và kỹ thuật để chọn `var` ở đây.

Về mặt phong cách, `var` luôn luôn, từ những ngày đầu của JS, báo hiệu "biến thuộc về một toàn bộ hàm." Như chúng ta đã khẳng định trong "Lexical Scope" (Chương 1), `var` gắn vào function scope bao quanh gần nhất, bất kể nó xuất hiện ở đâu. Điều đó đúng ngay cả khi `var` xuất hiện bên trong một block:

```js
function diff(x, y) {
  if (x > y) {
    var tmp = x; // `tmp` is function-scoped
    x = y;
    y = tmp;
  }

  return y - x;
}
```

Mặc dù `var` nằm trong một block, khai báo của nó là function-scoped (đối với `diff(..)`), không phải block-scoped.

Mặc dù bạn có thể khai báo `var` bên trong một block (và vẫn có nó là function-scoped), tôi khuyên bạn không nên sử dụng cách tiếp cận này ngoại trừ trong một vài trường hợp cụ thể (được thảo luận trong Phụ lục A). Nếu không, `var` nên được dành riêng cho việc sử dụng trong top-level scope của một hàm.

Tại sao không chỉ sử dụng `let` ở cùng vị trí đó? Bởi vì `var` khác biệt về mặt trực quan so với `let` và do đó báo hiệu rõ ràng, "biến này là function-scoped." Việc sử dụng `let` trong top-level scope, đặc biệt nếu không ở trong vài dòng đầu tiên của một hàm, và khi tất cả các khai báo khác trong blocks sử dụng `let`, không thu hút sự chú ý trực quan đến sự khác biệt với khai báo function-scoped.

Nói cách khác, tôi cảm thấy `var` giao tiếp tốt hơn về function-scoped so với `let`, và `let` vừa giao tiếp (vừa đạt được!) block-scoping nơi `var` là không đủ. Miễn là các chương trình của bạn sẽ cần cả các biến function-scoped và block-scoped, cách tiếp cận hợp lý và dễ đọc nhất là sử dụng cả `var` _và_ `let` cùng nhau, mỗi cái cho mục đích tốt nhất của riêng chúng.

Có những lý do ngữ nghĩa và hoạt động khác để chọn `var` hoặc `let` trong các tình huống khác nhau. Chúng ta sẽ khám phá trường hợp cho `var` _và_ `let` chi tiết hơn trong Phụ lục A.

> **CẢNH BÁO:** Khuyến nghị của tôi về việc sử dụng cả `var` _và_ `let` rõ ràng là gây tranh cãi và mâu thuẫn với số đông. Việc nghe những khẳng định như, "var bị hỏng, let sửa nó" và, "đừng bao giờ sử dụng var, let là sự thay thế" phổ biến hơn nhiều. Những ý kiến đó là hợp lệ, nhưng chúng chỉ là ý kiến, giống như của tôi. `var` không thực sự bị hỏng hoặc bị phản đối; nó đã hoạt động từ JS thời kỳ đầu và nó sẽ tiếp tục hoạt động miễn là JS còn tồn tại.

#### _let_ Ở Đâu? (Where To `let`?)

Lời khuyên của tôi để dành riêng `var` cho (hầu hết) chỉ một top-level function scope có nghĩa là hầu hết các khai báo khác nên sử dụng `let`. Nhưng bạn vẫn có thể tự hỏi làm thế nào để quyết định nơi mỗi khai báo trong chương trình của bạn thuộc về?

POLE đã hướng dẫn bạn về những quyết định đó, nhưng hãy chắc chắn rằng chúng ta nêu rõ nó một cách rõ ràng. Cách để quyết định không dựa trên từ khóa nào bạn muốn sử dụng. Cách để quyết định là hỏi, "Sự phơi bày scope tối thiểu nhất là đủ cho biến này là gì?"

Một khi câu hỏi đó được trả lời, bạn sẽ biết liệu một biến thuộc về một block scope hay function scope. Nếu bạn quyết định ban đầu rằng một biến nên được block-scoped, và sau đó nhận ra nó cần được nâng cao để trở thành function-scoped, thì điều đó ra lệnh thay đổi không chỉ ở vị trí khai báo của biến đó, mà còn cả từ khóa khai báo được sử dụng. Quá trình ra quyết định thực sự nên tiến hành như vậy.

Nếu một khai báo thuộc về một block scope, hãy sử dụng `let`. Nếu nó thuộc về function scope, hãy sử dụng `var` (một lần nữa, chỉ là ý kiến của tôi).

Nhưng một cách khác để hình dung việc ra quyết định này là xem xét phiên bản trước ES6 của một chương trình. Ví dụ, hãy nhớ lại `diff(..)` từ trước đó:

```js
function diff(x, y) {
  var tmp;

  if (x > y) {
    tmp = x;
    x = y;
    y = tmp;
  }

  return y - x;
}
```

Trong phiên bản này của `diff(..)`, `tmp` rõ ràng được khai báo trong function scope. Liệu điều đó có phù hợp với `tmp` không? Tôi sẽ tranh luận, không. `tmp` chỉ cần thiết cho một vài câu lệnh đó. Nó không cần thiết cho câu lệnh `return`. Do đó, nó nên được block-scoped.

Trước ES6, chúng ta không có `let` nên chúng ta không thể _thực sự_ block-scope nó. Nhưng chúng ta có thể làm điều tốt nhất tiếp theo trong việc báo hiệu ý định của mình:

```js
function diff(x, y) {
  if (x > y) {
    // `tmp` vẫn là function-scoped, nhưng
    // vị trí ở đây về mặt ngữ nghĩa
    // báo hiệu block-scoping
    var tmp = x;
    x = y;
    y = tmp;
  }

  return y - x;
}
```

Đặt khai báo `var` cho `tmp` bên trong câu lệnh `if` báo hiệu cho người đọc code rằng `tmp` thuộc về block đó. Mặc dù JS không thực thi scoping đó, tín hiệu ngữ nghĩa vẫn có lợi ích cho người đọc code của bạn.

Theo quan điểm này, bạn có thể tìm bất kỳ `var` nào bên trong một block thuộc loại này và chuyển nó sang `let` để thực thi tín hiệu ngữ nghĩa đã được gửi đi. Đó là cách sử dụng hợp lý của `let` theo ý kiến của tôi.

Một ví dụ khác dựa trên lịch sử của `var` nhưng bây giờ hầu như luôn luôn nên sử dụng `let` là vòng lặp `for`:

```js
for (var i = 0; i < 5; i++) {
  // làm gì đó
}
```

Bất kể vòng lặp như vậy được định nghĩa ở đâu, `i` về cơ bản luôn chỉ nên được sử dụng bên trong vòng lặp, trong trường hợp đó POLE ra lệnh nó nên được khai báo với `let` thay vì `var`:

```js
for (let i = 0; i < 5; i++) {
  // làm gì đó
}
```

Hầu như trường hợp duy nhất mà việc chuyển `var` sang `let` theo cách này sẽ "phá vỡ" code của bạn là nếu bạn đang dựa vào việc truy cập iterator của vòng lặp (`i`) bên ngoài/sau vòng lặp, chẳng hạn như:

```js
for (var i = 0; i < 5; i++) {
  if (checkValue(i)) {
    break;
  }
}

if (i < 5) {
  console.log("The loop stopped early!");
}
```

Mô hình sử dụng này không phải là hiếm gặp, nhưng hầu hết đều cảm thấy nó có mùi cấu trúc code kém. Một cách tiếp cận thích hợp hơn là sử dụng một biến outer-scoped khác cho mục đích đó:

```js
var lastI;

for (let i = 0; i < 5; i++) {
  lastI = i;
  if (checkValue(i)) {
    break;
  }
}

if (lastI < 5) {
  console.log("The loop stopped early!");
}
```

`lastI` cần thiết trên toàn bộ scope này, vì vậy nó được khai báo với `var`. `i` chỉ cần thiết trong (mỗi) lần lặp vòng lặp, vì vậy nó được khai báo với `let`.

#### Có Gì Khuất Tất? (What's the Catch?)

Cho đến nay, chúng ta đã khẳng định rằng `var` và các tham số là function-scoped, và `let`/`const` báo hiệu các khai báo block-scoped. Có một ngoại lệ nhỏ cần gọi ra: mệnh đề `catch`.

Kể từ khi giới thiệu `try..catch` trở lại trong ES3 (năm 1999), mệnh đề `catch` đã sử dụng một khả năng khai báo block-scoping bổ sung (ít được biết đến):

```js
try {
  doesntExist();
} catch (err) {
  console.log(err);
  // ReferenceError: 'doesntExist' is not defined
  // ^^^^ thông báo in từ exception đã bắt

  let onlyHere = true;
  var outerVariable = true;
}

console.log(outerVariable); // true

console.log(err);
// ReferenceError: 'err' is not defined
// ^^^^ đây là một exception ném ra (không bắt được) khác
```

Biến `err` được khai báo bởi mệnh đề `catch` là block-scoped cho block đó. Block mệnh đề `catch` này có thể chứa các khai báo block-scoped khác thông qua `let`. Nhưng một khai báo `var` bên trong block này vẫn gắn vào outer function/global scope.

ES2019 (gần đây, tại thời điểm viết bài) đã thay đổi các mệnh đề `catch` để khai báo của chúng là tùy chọn; nếu khai báo bị bỏ qua, block `catch` không còn (theo mặc định) là một scope; tuy nhiên nó vẫn là một block!

Vì vậy, nếu bạn cần phản ứng với điều kiện _rằng một ngoại lệ đã xảy ra_ (để bạn có thể phục hồi một cách duyên dáng), nhưng bạn không quan tâm đến giá trị lỗi, bạn có thể bỏ qua khai báo `catch`:

```js
try {
  doOptionOne();
} catch {
  // bỏ qua khai báo catch
  doOptionTwoInstead();
}
```

Đây là một sự đơn giản hóa cú pháp nhỏ nhưng thú vị cho một trường hợp sử dụng khá phổ biến, và cũng có thể hiệu quả hơn một chút trong việc loại bỏ một scope không cần thiết!

### Khai Báo Hàm Trong Blocks (FiB) (Function Declarations in Blocks (FiB))

Bây giờ chúng ta đã thấy rằng các khai báo sử dụng `let` hoặc `const` là block-scoped, và các khai báo `var` là function-scoped. Vậy còn các khai báo `function` xuất hiện trực tiếp bên trong các blocks thì sao? Là một tính năng, điều này được gọi là "FiB."

Chúng ta thường nghĩ về các khai báo `function` giống như chúng tương đương với một khai báo `var`. Vậy chúng có phải là function-scoped giống như `var` không?

Không và có. Tôi biết... điều đó thật khó hiểu. Hãy đào sâu vào:

```js
if (false) {
  function ask() {
    console.log("Does this run?");
  }
}
ask();
```

Bạn mong đợi chương trình này sẽ làm gì? Ba kết quả hợp lý:

1. Cuộc gọi `ask()` có thể thất bại với một ngoại lệ `ReferenceError`, bởi vì định danh `ask` là block-scoped cho block scope `if` và do đó không có sẵn trong outer/global scope.

2. Cuộc gọi `ask()` có thể thất bại với một ngoại lệ `TypeError`, bởi vì định danh `ask` tồn tại, nhưng nó là `undefined` (vì câu lệnh `if` không chạy) và do đó không phải là một hàm có thể gọi được.

3. Cuộc gọi `ask()` có thể chạy chính xác, in ra thông báo "Does it run?".

Đây là phần khó hiểu: tùy thuộc vào môi trường JS nào bạn thử đoạn code đó, bạn có thể nhận được các kết quả khác nhau! Đây là một trong số ít những khu vực điên rồ nơi hành vi cũ hiện có phản bội một kết quả có thể dự đoán được.

Đặc tả JS nói rằng các khai báo `function` bên trong các blocks là block-scoped, vì vậy câu trả lời nên là (1). Tuy nhiên, hầu hết các JS engines dựa trên trình duyệt (bao gồm v8, đến từ Chrome nhưng cũng được sử dụng trong Node) sẽ hoạt động như (2), có nghĩa là định danh được scoped bên ngoài block `if` nhưng giá trị hàm không được tự động khởi tạo, vì vậy nó vẫn là `undefined`.

Tại sao các trình duyệt JS engines được phép hành xử trái với đặc tả? Bởi vì các engines này đã có các hành vi nhất định xung quanh FiB trước khi ES6 giới thiệu block scoping, và có lo ngại rằng việc thay đổi để tuân thủ đặc tả có thể phá vỡ một số code JS trang web hiện có. Như vậy, một ngoại lệ đã được thực hiện trong Phụ lục B của đặc tả JS, cho phép các sai lệch nhất định đối với các trình duyệt JS engines (chỉ!).

> **LƯU Ý:** Bạn thường sẽ không phân loại Node là một môi trường JS trình duyệt, vì nó thường chạy trên một máy chủ. Nhưng engine v8 của Node được chia sẻ với các trình duyệt Chrome (và Edge). Vì v8 trước tiên là một browser JS engine, nó áp dụng ngoại lệ Phụ lục B này, điều này sau đó có nghĩa là các ngoại lệ trình duyệt được mở rộng sang Node.

Một trong những trường hợp sử dụng phổ biến nhất để đặt một khai báo `function` trong một block là để định nghĩa có điều kiện một hàm theo cách này hay cách khác (như với một câu lệnh `if..else`) tùy thuộc vào một số trạng thái môi trường. Ví dụ:

```js
if (typeof Array.isArray != "undefined") {
  function isArray(a) {
    return Array.isArray(a);
  }
} else {
  function isArray(a) {
    return Object.prototype.toString.call(a) == "[object Array]";
  }
}
```

Thật hấp dẫn để cấu trúc code theo cách này vì lý do hiệu suất, vì kiểm tra `typeof Array.isArray` chỉ được thực hiện một lần, trái ngược với việc chỉ định nghĩa một `isArray(..)` và đặt câu lệnh `if` bên trong nó—việc kiểm tra sau đó sẽ chạy không cần thiết trên mỗi cuộc gọi.

> **CẢNH BÁO:** Ngoài những rủi ro của các sai lệch FiB, một vấn đề khác với việc định nghĩa có điều kiện các hàm là khó gỡ lỗi một chương trình như vậy hơn. Nếu bạn gặp lỗi trong hàm `isArray(..)`, trước tiên bạn phải tìm ra triển khai `isArray(..)` _nào_ đang thực sự chạy! Đôi khi, lỗi là do cái sai đã được áp dụng vì kiểm tra có điều kiện không chính xác! Nếu bạn định nghĩa nhiều phiên bản của một hàm, chương trình đó luôn khó suy luận và bảo trì hơn.

Ngoài các đoạn trích trước đó, một số trường hợp góc FiB khác đang ẩn nấp; các hành vi như vậy trong các trình duyệt khác nhau và các môi trường JS không phải trình duyệt (các JS engines không dựa trên trình duyệt) có thể sẽ khác nhau. Ví dụ:

```js
if (true) {
  function ask() {
    console.log("Am I called?");
  }
}

if (true) {
  function ask() {
    console.log("Or what about me?");
  }
}

for (let i = 0; i < 5; i++) {
  function ask() {
    console.log("Or is it one of these?");
  }
}

ask();

function ask() {
  console.log("Wait, maybe, it's this one?");
}
```

Hãy nhớ lại rằng function hoisting như được mô tả trong "Khi Nào Tôi Có Thể Sử Dụng Một Biến?" (trong Chương 5) có thể gợi ý rằng `ask()` cuối cùng trong đoạn trích này, với "Wait, maybe..." là thông báo của nó, sẽ hoist lên trên cuộc gọi đến `ask()`. Vì nó là khai báo hàm cuối cùng của tên đó, nó nên "thắng," đúng không? Thật không may, không.

Tôi không có ý định ghi lại tất cả những trường hợp góc kỳ lạ này, cũng như không cố gắng giải thích tại sao mỗi trường hợp trong số chúng hành xử theo một cách nhất định. Thông tin đó, theo ý kiến của tôi, là những câu đố cũ kỹ arcane.

Mối quan tâm thực sự của tôi với FiB là, tôi có thể đưa ra lời khuyên nào để đảm bảo code của bạn hoạt động có thể dự đoán được trong mọi trường hợp?

Theo như tôi quan tâm, câu trả lời thực tế duy nhất để tránh những thay đổi thất thường của FiB là đơn giản tránh FiB hoàn toàn. Nói cách khác, không bao giờ đặt một khai báo `function` trực tiếp bên trong bất kỳ block nào. Luôn đặt các khai báo `function` ở bất cứ đâu trong top-level scope của một hàm (hoặc trong global scope).

Vì vậy, đối với ví dụ `if..else` trước đó, gợi ý của tôi là tránh định nghĩa có điều kiện các hàm nếu có thể. Vâng, nó có thể kém hiệu quả hơn một chút, nhưng đây là cách tiếp cận tổng thể tốt hơn:

```js
function isArray(a) {
  if (typeof Array.isArray != "undefined") {
    return Array.isArray(a);
  } else {
    return Object.prototype.toString.call(a) == "[object Array]";
  }
}
```

Nếu cú đánh hiệu suất đó trở thành vấn đề đường dẫn quan trọng cho ứng dụng của bạn, tôi khuyên bạn nên xem xét cách tiếp cận này:

```js
var isArray = function isArray(a) {
  return Array.isArray(a);
};

// ghi đè định nghĩa, nếu bạn phải làm vậy
if (typeof Array.isArray == "undefined") {
  isArray = function isArray(a) {
    return Object.prototype.toString.call(a) == "[object Array]";
  };
}
```

Điều quan trọng cần lưu ý là ở đây tôi đang đặt một **biểu thức** `function`, không phải một khai báo, bên trong câu lệnh `if`. Điều đó hoàn toàn ổn và hợp lệ, để các biểu thức `function` xuất hiện bên trong các blocks. Cuộc thảo luận của chúng ta về FiB là về việc tránh các **khai báo** `function` trong các blocks.

Ngay cả khi bạn kiểm tra chương trình của mình và nó hoạt động chính xác, lợi ích nhỏ bạn có thể nhận được từ việc sử dụng phong cách FiB trong code của mình bị lu mờ bởi những rủi ro tiềm ẩn trong tương lai về sự nhầm lẫn bởi các nhà phát triển khác, hoặc sự khác biệt trong cách code của bạn chạy trong các môi trường JS khác.

FiB không đáng giá, và nên tránh.

### Kết Thúc (Blocked Over)

Điểm của các quy tắc lexical scoping trong một ngôn ngữ lập trình là để chúng ta có thể tổ chức các biến của chương trình một cách thích hợp, cho cả mục đích hoạt động cũng như giao tiếp code ngữ nghĩa.

Và một trong những kỹ thuật tổ chức quan trọng nhất là đảm bảo rằng không có biến nào bị phơi bày quá mức cho các scopes không cần thiết (POLE). Hy vọng rằng bây giờ bạn đánh giá cao block scoping sâu sắc hơn nhiều so với trước đây.

Hy vọng rằng đến bây giờ bạn cảm thấy như mình đang đứng trên nền tảng vững chắc hơn nhiều với sự hiểu biết về lexical scope. Từ nền tảng đó, chương tiếp theo sẽ nhảy vào chủ đề nặng ký của closure.

[^POLP]: _Principle of Least Privilege_, https://en.wikipedia.org/wiki/Principle_of_least_privilege, 3 March 2020.

---

## Chương 7: Sử Dụng Closures (Using Closures)

Cho đến thời điểm này, chúng ta đã tập trung vào các ngóc ngách của lexical scope, và cách nó ảnh hưởng đến việc tổ chức và sử dụng các biến trong các chương trình của chúng ta.

Sự chú ý của chúng ta lại chuyển sang hướng trừu tượng rộng hơn, đến chủ đề lịch sử có phần đáng sợ của closure. Đừng lo lắng! Bạn không cần một bằng cấp khoa học máy tính cao cấp để hiểu nó. Mục tiêu rộng lớn của chúng ta trong cuốn sách này không chỉ đơn thuần là hiểu scope, mà còn là sử dụng nó hiệu quả hơn trong cấu trúc của các chương trình của chúng ta; closure là trọng tâm của nỗ lực đó.

Hãy nhớ lại kết luận chính của Chương 6: nguyên tắc _phơi bày ít nhất_ (POLE) khuyến khích chúng ta sử dụng block (và function) scoping để giới hạn sự phơi bày scope của các biến. Điều này giúp giữ cho code dễ hiểu và dễ bảo trì, và giúp tránh nhiều cạm bẫy scoping (tức là, xung đột tên, v.v.).

Closure xây dựng dựa trên cách tiếp cận này: đối với các biến chúng ta cần sử dụng theo thời gian, thay vì đặt chúng trong các outer scopes lớn hơn, chúng ta có thể đóng gói (scope hẹp hơn) chúng nhưng vẫn bảo tồn quyền truy cập từ bên trong các hàm, để sử rộng hơn. Các hàm _ghi nhớ_ các biến scoped được tham chiếu này thông qua closure.

Chúng ta đã thấy một ví dụ về loại closure này trong chương trước (`factorial(..)` trong Chương 6), và bạn gần như chắc chắn đã sử dụng nó trong các chương trình của riêng mình. Nếu bạn đã từng viết một callback truy cập các biến bên ngoài scope của chính nó... đoán xem nào!? Đó là closure.

Closure là một trong những đặc điểm ngôn ngữ quan trọng nhất từng được phát minh trong lập trình—nó làm nền tảng cho các mô hình lập trình chính, bao gồm Lập trình Hàm (Functional Programming - FP), modules, và thậm chí một chút thiết kế hướng lớp (class-oriented design). Việc trở nên thoải mái với closure là bắt buộc để làm chủ JS và tận dụng hiệu quả nhiều mẫu thiết kế quan trọng trong code của bạn.

Giải quyết tất cả các khía cạnh của closure đòi hỏi một ngọn núi thảo luận và code đáng sợ trong suốt chương này. Hãy chắc chắn dành thời gian của bạn và đảm bảo bạn thoải mái với từng chút một trước khi chuyển sang phần tiếp theo.

### Nhìn Thấy Closure (See the Closure)

Closure ban đầu là một khái niệm toán học, từ phép tính lambda (lambda calculus). Nhưng tôi sẽ không liệt kê các công thức toán học hoặc sử dụng một loạt các ký hiệu và thuật ngữ chuyên ngành để định nghĩa nó.

Thay vào đó, tôi sẽ tập trung vào một góc nhìn thực tế. Chúng ta sẽ bắt đầu bằng cách định nghĩa closure theo những gì chúng ta có thể quan sát trong các hành vi khác nhau của các chương trình của chúng ta, trái ngược với nếu closure không hiện diện trong JS. Tuy nhiên, sau đó trong chương này, chúng ta sẽ lật ngược closure để nhìn nó từ một _góc nhìn thay thế_.

Closure là một hành vi của các hàm và chỉ các hàm. Nếu bạn không xử lý một hàm, closure không áp dụng. Một object không thể có closure, một class cũng không có closure (mặc dù các hàm/phương thức của nó có thể). Chỉ có các hàm mới có closure.

Để closure được quan sát, một hàm phải được gọi, và cụ thể nó phải được gọi trong một nhánh khác của scope chain so với nơi nó được định nghĩa ban đầu. Một hàm thực thi trong cùng scope nơi nó được định nghĩa sẽ không thể hiện bất kỳ hành vi khác biệt nào có thể quan sát được dù có hay không có closure; theo góc nhìn và định nghĩa quan sát, đó không phải là closure.

Hãy xem xét một số code, được chú thích với các màu bong bóng scope liên quan của nó (xem Chương 2):

```js
// outer/global scope: RED(1)

function lookupStudent(studentID) {
  // function scope: BLUE(2)

  var students = [
    { id: 14, name: "Kyle" },
    { id: 73, name: "Suzy" },
    { id: 112, name: "Frank" },
    { id: 6, name: "Sarah" },
  ];

  return function greetStudent(greeting) {
    // function scope: GREEN(3)

    var student = students.find((student) => student.id == studentID);

    return `${greeting}, ${student.name}!`;
  };
}

var chosenStudents = [lookupStudent(6), lookupStudent(112)];

// truy cập tên của hàm:
chosenStudents[0].name;
// greetStudent

chosenStudents[0]("Hello");
// Hello, Sarah!

chosenStudents[1]("Howdy");
// Howdy, Frank!
```

Điều đầu tiên cần chú ý về code này là outer function `lookupStudent(..)` tạo và trả về một inner function được gọi là `greetStudent(..)`. `lookupStudent(..)` được gọi hai lần, tạo ra hai instance (bản thể) riêng biệt của inner function `greetStudent(..)` của nó, cả hai đều được lưu vào mảng `chosenStudents`.

Chúng ta xác minh trường hợp đó bằng cách kiểm tra thuộc tính `.name` của hàm được trả về được lưu trong `chosenStudents[0]`, và nó thực sự là một instance của `greetStudent(..)` bên trong.

Sau khi mỗi cuộc gọi đến `lookupStudent(..)` kết thúc, có vẻ như tất cả các biến bên trong của nó sẽ bị loại bỏ và GC'd (thu gom rác). Inner function là thứ duy nhất có vẻ được trả về và bảo tồn. Nhưng đây là nơi hành vi khác biệt theo những cách chúng ta có thể bắt đầu quan sát.

Trong khi `greetStudent(..)` nhận một đối số duy nhất làm tham số có tên `greeting`, nó cũng tham chiếu đến cả `students` và `studentID`, các định danh đến từ scope bao quanh của `lookupStudent(..)`. Mỗi tham chiếu đó từ inner function đến biến trong một outer scope được gọi là một _closure_. Theo thuật ngữ học thuật, mỗi instance của `greetStudent(..)` _closes over_ (đóng gói/bao đóng) các biến bên ngoài `students` và `studentID`.

Vậy những closures đó làm gì ở đây, theo một nghĩa cụ thể, có thể quan sát được?

Closure cho phép `greetStudent(..)` tiếp tục truy cập các biến bên ngoài đó ngay cả sau khi outer scope đã kết thúc (khi mỗi cuộc gọi đến `lookupStudent(..)` hoàn thành). Thay vì các instances của `students` và `studentID` bị GC'd, chúng vẫn ở lại trong bộ nhớ. Vào một thời điểm sau đó khi một trong hai instance của hàm `greetStudent(..)` được gọi, các biến đó vẫn ở đó, giữ các giá trị hiện tại của chúng.

Nếu các hàm JS không có closure, việc hoàn thành mỗi cuộc gọi `lookupStudent(..)` sẽ ngay lập tức phá hủy scope của nó và GC các biến `students` và `studentID`. Khi chúng ta gọi một trong các hàm `greetStudent(..)` sau đó, điều gì sẽ xảy ra?

Nếu `greetStudent(..)` cố gắng truy cập những gì nó nghĩ là một viên bi BLUE(2), nhưng viên bi đó thực sự không tồn tại (nữa), giả định hợp lý là chúng ta sẽ nhận được một `ReferenceError`, đúng không?

Nhưng chúng ta không nhận được lỗi. Việc thực thi `chosenStudents[0]("Hello")` hoạt động và trả về cho chúng ta thông báo "Hello, Sarah!", có nghĩa là nó vẫn có thể truy cập các biến `students` và `studentID`. Đây là một quan sát trực tiếp về closure!

#### Closure Chỉ Điểm (Pointed Closure)

Thực ra, chúng ta đã lướt qua một chi tiết nhỏ trong cuộc thảo luận trước mà tôi đoán nhiều độc giả đã bỏ lỡ!

Bởi vì cú pháp cho các mũi tên `=>` quá ngắn gọn, thật dễ quên rằng chúng vẫn tạo ra một scope (như đã khẳng định trong "Arrow Functions" trong Chương 3). Hàm mũi tên `student => student.id == studentID` đang tạo ra một bong bóng scope khác bên trong function scope `greetStudent(..)`.

Xây dựng trên ẩn dụ về các cái xô màu và bong bóng từ Chương 2, nếu chúng ta tạo một sơ đồ màu cho code này, có một scope thứ tư ở cấp độ lồng nhau trong cùng này, vì vậy chúng ta cần một màu thứ tư; có lẽ chúng ta sẽ chọn ORANGE(4) cho scope đó:

```js
var student = students.find(
  (student) =>
    // function scope: ORANGE(4)
    student.id == studentID
);
```

Tham chiếu `studentID` BLUE(2) thực sự nằm bên trong scope ORANGE(4) thay vì scope GREEN(3) của `greetStudent(..)`; ngoài ra, tham số `student` của hàm mũi tên là ORANGE(4), shadowing `student` GREEN(3).

Hậu quả ở đây là hàm mũi tên này được truyền như một callback cho phương thức `find(..)` của mảng phải giữ closure trên `studentID`, thay vì `greetStudent(..)` giữ closure đó. Điều đó không phải là vấn đề quá lớn, vì mọi thứ vẫn hoạt động như mong đợi. Chỉ cần quan trọng là không bỏ qua sự thật rằng ngay cả các hàm mũi tên nhỏ bé cũng có thể tham gia vào bữa tiệc closure.

#### Cộng Dồn Closures (Adding Up Closures)

Hãy xem xét một trong những ví dụ kinh điển thường được trích dẫn cho closure:

```js
function adder(num1) {
  return function addTo(num2) {
    return num1 + num2;
  };
}

var add10To = adder(10);
var add42To = adder(42);

add10To(15); // 25
add42To(9); // 51
```

Mỗi instance của inner function `addTo(..)` đang closing over biến `num1` riêng của nó (với các giá trị `10` và `42`, tương ứng), vì vậy những `num1` đó không biến mất chỉ vì `adder(..)` kết thúc. Khi chúng ta gọi một trong những instance `addTo(..)` bên trong đó sau này, chẳng hạn như cuộc gọi `add10To(15)`, biến `num1` đã được closed-over của nó vẫn tồn tại và vẫn giữ giá trị `10` ban đầu. Do đó, phép toán có thể thực hiện `10 + 15` và trả về câu trả lời `25`.

Một chi tiết quan trọng có thể đã quá dễ bị lướt qua trong đoạn trước, vì vậy hãy củng cố nó: closure được liên kết với một instance (bản thể) của một hàm, thay vì định nghĩa lexical duy nhất của nó. Trong đoạn trích trước, chỉ có một hàm `addTo(..)` bên trong được định nghĩa bên trong `adder(..)`, vì vậy có vẻ như điều đó sẽ ngụ ý một closure duy nhất.

Nhưng thực tế, mỗi khi outer function `adder(..)` chạy, một instance function `addTo(..)` bên trong _mới_ được tạo ra, và đối với mỗi instance mới, một closure mới. Vì vậy, mỗi instance function bên trong (được dán nhãn `add10To(..)` và `add42To(..)` trong chương trình của chúng ta) có closure riêng của nó trên instance riêng của nó về môi trường scope từ việc thực thi đó của `adder(..)`.

Mặc dù closure dựa trên lexical scope, được xử lý tại thời điểm biên dịch, closure được quan sát như một đặc điểm runtime của các function instances.

### Liên Kết Sống, Không Phải Ảnh Chụp (Live Link, Not a Snapshot)

Trong cả hai ví dụ từ các phần trước, chúng ta đã **đọc giá trị từ một biến** được giữ trong một closure. Điều đó làm cho cảm giác như closure có thể là một bản chụp (snapshot) của một giá trị tại một thời điểm nhất định. Thật vậy, đó là một quan niệm sai lầm phổ biến.

Closure thực sự là một liên kết sống (live link), bảo tồn quyền truy cập vào chính biến đầy đủ đó. Chúng ta không bị giới hạn chỉ đọc một giá trị; biến được closed-over có thể được cập nhật (gán lại) nữa! Bằng cách closing over một biến trong một hàm, chúng ta có thể tiếp tục sử dụng biến đó (đọc và ghi) miễn là tham chiếu hàm đó tồn tại trong chương trình, và từ bất cứ đâu chúng ta muốn gọi hàm đó. Đây là lý do tại sao closure là một kỹ thuật mạnh mẽ được sử dụng rộng rãi trên rất nhiều lĩnh vực lập trình!

Hình 4 mô tả các function instances và các liên kết scope:

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig4.png" width="400" alt="Function instances linked to scopes via closure" align="center">
    <figcaption><em>Fig. 4: Trực Quan Hóa Closures</em></figcaption>
    <br><br>
</figure>

Như được hiển thị trong Hình 4, mỗi cuộc gọi đến `adder(..)` tạo ra một scope BLUE(2) mới chứa một biến `num1`, cũng như một instance mới của hàm `addTo(..)` như một scope GREEN(3). Lưu ý rằng các function instances (`addTo10(..)` và `addTo42(..)`) hiện diện trong và được gọi từ scope RED(1).

Bây giờ hãy xem xét một ví dụ nơi biến được closed-over được cập nhật:

```js
function makeCounter() {
  var count = 0;

  return function getCurrent() {
    count = count + 1;
    return count;
  };
}

var hits = makeCounter();

// later

hits(); // 1

// later

hits(); // 2
hits(); // 3
```

Biến `count` được closed over bởi hàm `getCurrent()` bên trong, giữ cho nó tồn tại thay vì bị GC. Các cuộc gọi hàm `hits()` truy cập _và_ cập nhật biến này, trả về một bộ đếm tăng dần mỗi lần.

Mặc dù scope bao quanh của một closure thường là từ một hàm, điều đó thực sự không bắt buộc; chỉ cần có một inner function hiện diện bên trong một outer scope:

```js
var hits;
{
  // một outer scope (nhưng không phải là một hàm)
  let count = 0;
  hits = function getCurrent() {
    count = count + 1;
    return count;
  };
}
hits(); // 1
hits(); // 2
hits(); // 3
```

| LƯU Ý:                                                                                                                                                                                      |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tôi đã cố tình định nghĩa `getCurrent()` là một biểu thức `function` thay vì một khai báo `function`. Đây không phải là về closure, mà với những điều kỳ quặc nguy hiểm của FiB (Chương 6). |

Bởi vì rất phổ biến khi nhầm lẫn closure là hướng giá trị thay vì hướng biến, các nhà phát triển đôi khi bị vấp ngã khi cố gắng sử dụng closure để bảo tồn-snapshot một giá trị từ một thời điểm nào đó. Xem xét:

```js
var studentName = "Frank";

var greeting = function hello() {
  // chúng ta đang closing over `studentName`,
  // không phải "Frank"
  console.log(`Hello, ${studentName}!`);
};

// later

studentName = "Suzy";

// later

greeting();
// Hello, Suzy!
```

Bằng cách định nghĩa `greeting()` (còn gọi là `hello()`) khi `studentName` giữ giá trị `"Frank"` (trước khi gán lại cho `"Suzy"`), giả định sai lầm thường là closure sẽ bắt giữ `"Frank"`. Nhưng `greeting()` được closed over biến `studentName`, không phải giá trị của nó. Bất cứ khi nào `greeting()` được gọi, giá trị hiện tại của biến (`"Suzy"`, trong trường hợp này) được phản ánh.

Minh họa kinh điển về sai lầm này là định nghĩa các hàm bên trong một vòng lặp:

```js
var keeps = [];

for (var i = 0; i < 3; i++) {
  keeps[i] = function keepI() {
    // closure over `i`
    return i;
  };
}

keeps[0](); // 3 -- TẠI SAO!?
keeps[1](); // 3
keeps[2](); // 3
```

| LƯU Ý:                                                                                                                                                                                                                                                                                                                                               |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loại minh họa closure này thường sử dụng một `setTimeout(..)` hoặc một callback khác như một trình xử lý sự kiện, bên trong vòng lặp. Tôi đã đơn giản hóa ví dụ bằng cách lưu trữ các tham chiếu hàm trong một mảng, để chúng ta không cần xem xét thời gian bất đồng bộ trong phân tích của mình. Nguyên tắc closure là giống nhau, bất kể thế nào. |

Bạn có thể đã mong đợi cuộc gọi `keeps[0]()` trả về `0`, vì hàm đó được tạo ra trong lần lặp đầu tiên của vòng lặp khi `i` là `0`. Nhưng một lần nữa, giả định đó bắt nguồn từ việc nghĩ về closure là hướng giá trị thay vì hướng biến.

Điều gì đó về cấu trúc của một vòng lặp `for` có thể lừa chúng ta nghĩ rằng mỗi lần lặp nhận được một biến `i` mới của riêng nó; thực tế, chương trình này chỉ có một `i` duy nhất vì nó được khai báo với `var`.

Mỗi hàm đã lưu trả về `3`, bởi vì vào cuối vòng lặp, biến `i` duy nhất trong chương trình đã được gán `3`. Mỗi trong ba hàm trong mảng `keeps` đều có closure riêng lẻ, nhưng tất cả chúng đều closed over cùng một biến `i` được chia sẻ đó.

Tất nhiên, một biến duy nhất chỉ có thể giữ một giá trị tại bất kỳ thời điểm nào. Vì vậy, nếu bạn muốn bảo tồn nhiều giá trị, bạn cần một biến khác nhau cho mỗi giá trị.

Làm thế nào chúng ta có thể làm điều đó trong đoạn trích vòng lặp? Hãy tạo một biến mới cho mỗi lần lặp:

```js
var keeps = [];

for (var i = 0; i < 3; i++) {
  // `j` mới được tạo mỗi lần lặp, nó nhận
  // một bản sao của giá trị của `i` tại thời điểm này
  let j = i;

  // `i` ở đây không bị closed over, vì vậy
  // hoàn toàn ổn khi sử dụng ngay lập tức
  // giá trị hiện tại của nó trong mỗi lần lặp vòng lặp
  keeps[i] = function keepEachJ() {
    // close over `j`, không phải `i`!
    return j;
  };
}
keeps[0](); // 0
keeps[1](); // 1
keeps[2](); // 2
```

Mỗi hàm bây giờ được closed over một biến (mới) riêng biệt từ mỗi lần lặp, mặc dù tất cả chúng đều được đặt tên là `j`. Và mỗi `j` nhận một bản sao của giá trị của `i` tại điểm đó trong lần lặp vòng lặp; `j` đó không bao giờ được gán lại. Vì vậy, tất cả ba hàm bây giờ trả về các giá trị mong đợi của chúng: `0`, `1`, và `2`!

Một lần nữa hãy nhớ rằng, ngay cả khi chúng ta đang sử dụng bất đồng bộ trong chương trình này, chẳng hạn như truyền mỗi inner function `keepEachJ()` vào `setTimeout(..)` hoặc một đăng ký event handler, cùng một loại hành vi closure vẫn sẽ được quan sát.

Hãy nhớ lại phần "Loops" trong Chương 5, minh họa cách một khai báo `let` trong một vòng lặp `for` thực sự tạo ra không chỉ một biến cho vòng lặp, mà thực sự tạo ra một biến mới cho _mỗi lần lặp_ của vòng lặp. Thủ thuật/sự kỳ quặc đó chính xác là những gì chúng ta cần cho các vòng lặp closure của mình:

```js
var keeps = [];

for (let i = 0; i < 3; i++) {
  // `let i` cung cấp cho chúng ta một `i` mới cho
  // mỗi lần lặp, tự động!
  keeps[i] = function keepEachI() {
    return i;
  };
}
keeps[0](); // 0
keeps[1](); // 1
keeps[2](); // 2
```

Vì chúng ta đang sử dụng `let`, ba `i` được tạo ra, một cho mỗi vòng lặp, vì vậy mỗi trong ba closure _chỉ hoạt động_ như mong đợi.

### Các Closure Phổ Biến: Ajax và Sự Kiện (Common Closures: Ajax and Events)

Closure thường gặp nhất với các callbacks:

```js
function lookupStudentRecord(studentID) {
  ajax(`https://some.api/student/${studentID}`, function onRecord(record) {
    console.log(`${record.name} (${studentID})`);
  });
}

lookupStudentRecord(114);
// Frank (114)
```

Callback `onRecord(..)` sẽ được gọi vào một thời điểm nào đó trong tương lai, sau khi phản hồi từ cuộc gọi Ajax quay trở lại. Cuộc gọi này sẽ xảy ra từ bên trong của tiện ích `ajax(..)`, bất kể nó đến từ đâu. Hơn nữa, khi điều đó xảy ra, cuộc gọi `lookupStudentRecord(..)` đã hoàn thành từ lâu.

Tại sao sau đó `studentID` vẫn còn đó và có thể truy cập được đối với callback? Closure.

Các trình xử lý sự kiện (event handlers) là một cách sử dụng phổ biến khác của closure:

```js
function listenForClicks(btn, label) {
  btn.addEventListener("click", function onClick() {
    console.log(`The ${label} button was clicked!`);
  });
}

var submitBtn = document.getElementById("submit-btn");

listenForClicks(submitBtn, "Checkout");
```

Tham số `label` được closed over bởi callback xử lý sự kiện `onClick(..)`. Khi nút được nhấp, `label` vẫn tồn tại để được sử dụng. Đây là closure.

### Điều Gì Sẽ Xảy Ra Nếu Tôi Không Thể Nhìn Thấy Nó? (What If I Can't See It?)

Bạn có lẽ đã nghe câu ngạn ngữ phổ biến này:

> Nếu một cái cây đổ trong rừng nhưng không có ai ở đó để nghe thấy, nó có tạo ra âm thanh không?

Đó là một chút thể dục dụng cụ triết học ngớ ngẩn. Tất nhiên từ góc độ khoa học, sóng âm thanh được tạo ra. Nhưng điểm thực sự là: _có quan trọng không_ nếu âm thanh xảy ra?

Hãy nhớ rằng, trọng tâm trong định nghĩa của chúng ta về closure là khả năng quan sát (observability). Nếu một closure tồn tại (theo nghĩa kỹ thuật, triển khai, hoặc học thuật) nhưng nó không thể được quan sát trong các chương trình của chúng ta, _có quan trọng không?_ Không.

Để củng cố điểm này, hãy xem xét một số ví dụ _không_ dựa trên closure một cách có thể quan sát được.

Ví dụ, gọi một hàm sử dụng tra cứu lexical scope:

```js
function say(myName) {
  var greeting = "Hello";
  output();

  function output() {
    console.log(`${greeting}, ${myName}!`);
  }
}

say("Kyle");
// Hello, Kyle!
```

Inner function `output()` truy cập các biến `greeting` và `myName` từ scope bao quanh của nó. Nhưng việc gọi `output()` xảy ra trong cùng scope đó, nơi tất nhiên `greeting` và `myName` vẫn có sẵn; đó chỉ là lexical scope, không phải closure.

Bất kỳ ngôn ngữ lexically scoped nào có các hàm không hỗ trợ closure vẫn sẽ hành xử theo cách tương tự này.

Trên thực tế, các biến global scope về cơ bản không thể được (một cách có thể quan sát) closed over, bởi vì chúng luôn có thể truy cập được từ mọi nơi. Không có hàm nào có thể được gọi trong bất kỳ phần nào của scope chain mà không phải là hậu duệ của global scope.

Xem xét:

```js
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getFirstStudent() {
  return function firstStudent() {
    return students[0].name;
  };
}

var student = getFirstStudent();

student();
// Kyle
```

Inner function `firstStudent()` có tham chiếu `students`, là một biến bên ngoài scope của chính nó. Nhưng vì `students` tình cờ đến từ global scope, bất kể hàm đó được gọi ở đâu trong chương trình, khả năng truy cập `students` của nó không có gì đặc biệt hơn lexical scope bình thường.

Tất cả các cuộc gọi hàm đều có thể truy cập các biến toàn cục, bất kể closure có được hỗ trợ bởi ngôn ngữ hay không. Các biến toàn cục không cần phải được closed over.

Các biến chỉ đơn thuần hiện diện nhưng không bao giờ được truy cập không dẫn đến closure:

```js
function lookupStudent(studentID) {
  return function nobody() {
    var msg = "Nobody's here yet.";
    console.log(msg);
  };
}

var student = lookupStudent(112);

student();
// Nobody's here yet.
```

Inner function `nobody()` không close over bất kỳ biến bên ngoài nào—nó chỉ sử dụng biến `msg` của chính nó. Mặc dù `studentID` hiện diện trong scope bao quanh, `studentID` không được tham chiếu bởi `nobody()`. JS engine không cần phải giữ `studentID` xung quanh sau khi `lookupStudent(..)` đã chạy xong, vì vậy GC muốn dọn dẹp bộ nhớ đó!

Cho dù các hàm JS có hỗ trợ closure hay không, chương trình này sẽ hành xử như nhau. Do đó, không có closure nào được quan sát ở đây.

Nếu không có cuộc gọi hàm, closure không thể được quan sát:

```js
function greetStudent(studentName) {
  return function greeting() {
    console.log(`Hello, ${studentName}!`);
  };
}

greetStudent("Kyle");

// không có gì khác xảy ra
```

Cái này khó hiểu, bởi vì outer function chắc chắn được gọi. Nhưng inner function là cái _có thể_ đã có closure, nhưng nó không bao giờ được gọi; hàm được trả về ở đây chỉ bị vứt bỏ. Vì vậy, ngay cả nếu về mặt kỹ thuật JS engine đã tạo ra closure trong một khoảnh khắc ngắn ngủi, nó đã không được quan sát theo bất kỳ cách có ý nghĩa nào trong chương trình này.

Một cái cây có thể đã đổ... nhưng chúng ta không nghe thấy nó, vì vậy chúng ta không quan tâm.

#### Định Nghĩa Có Thể Quan Sát Được (Observable Definition)

Bây giờ chúng ta đã sẵn sàng để định nghĩa closure:

> Closure được quan sát khi một hàm sử dụng (các) biến từ outer scope(s) ngay cả khi đang chạy trong một scope nơi (các) biến đó sẽ không thể truy cập được.

Các phần chính của định nghĩa này là:

- Phải có một hàm liên quan

- Phải tham chiếu ít nhất một biến từ một outer scope

- Phải được gọi trong một nhánh khác của scope chain so với (các) biến

Định nghĩa định hướng quan sát này có nghĩa là chúng ta không nên loại bỏ closure như một chuyện tầm phào học thuật, gián tiếp nào đó. Thay vào đó, chúng ta nên xem xét và lập kế hoạch cho các tác động trực tiếp, cụ thể mà closure có đối với hành vi chương trình của chúng ta.

### Vòng Đời Của Closure và Thu Gom Rác (The Closure Lifecycle and Garbage Collection (GC))

Vì closure vốn gắn liền với một function instance (bản thể hàm), closure của nó trên một biến kéo dài chừng nào vẫn còn một tham chiếu đến hàm đó.

Nếu mười hàm đều close over cùng một biến, và theo thời gian chín trong số các tham chiếu hàm này bị loại bỏ, tham chiếu hàm duy nhất còn lại vẫn bảo tồn biến đó. Một khi tham chiếu hàm cuối cùng đó bị loại bỏ, closure cuối cùng trên biến đó biến mất, và chính biến đó được GC'd.

Điều này có tác động quan trọng đến việc xây dựng các chương trình hiệu quả và hiệu năng cao. Closure có thể bất ngờ ngăn chặn GC của một biến mà bạn lẽ ra đã xong việc với nó, dẫn đến việc sử dụng bộ nhớ tăng vọt theo thời gian. Đó là lý do tại sao điều quan trọng là phải loại bỏ các tham chiếu hàm (và do đó là closures của chúng) khi chúng không còn cần thiết nữa.

Xem xét:

```js
function manageBtnClickEvents(btn) {
  var clickHandlers = [];

  return function listener(cb) {
    if (cb) {
      let clickHandler = function onClick(evt) {
        console.log("clicked!");
        cb(evt);
      };
      clickHandlers.push(clickHandler);
      btn.addEventListener("click", clickHandler);
    } else {
      // truyền không callback sẽ hủy đăng ký
      // tất cả các click handlers
      for (let handler of clickHandlers) {
        btn.removeEventListener("click", handler);
      }

      clickHandlers = [];
    }
  };
}

// var mySubmitBtn = ..
var onSubmit = manageBtnClickEvents(mySubmitBtn);

onSubmit(function checkout(evt) {
  // handle checkout
});

onSubmit(function trackAction(evt) {
  // log action to analytics
});

// sau đó, hủy đăng ký tất cả handlers:
onSubmit();
```

Trong chương trình này, inner function `onClick(..)` giữ một closure trên `cb` được truyền vào (event callback được cung cấp). Điều đó có nghĩa là các tham chiếu biểu thức hàm `checkout()` và `trackAction()` được giữ thông qua closure (và không thể được GC'd) chừng nào các event handlers này còn được đăng ký.

Khi chúng ta gọi `onSubmit()` không có đầu vào ở dòng cuối cùng, tất cả các event handlers được hủy đăng ký, và mảng `clickHandlers` được làm trống. Một khi tất cả các tham chiếu hàm click handler bị loại bỏ, các closures của tham chiếu `cb` đến `checkout()` và `trackAction()` bị loại bỏ.

Khi xem xét sức khỏe tổng thể và hiệu quả của chương trình, việc hủy đăng ký một event handler khi nó không còn cần thiết có thể còn quan trọng hơn cả việc đăng ký ban đầu!

#### Theo Biến Hay Theo Scope? (Per Variable or Per Scope?)

Một câu hỏi khác mà chúng ta cần giải quyết: chúng ta nên nghĩ về closure như chỉ áp dụng cho (các) biến bên ngoài được tham chiếu, hay closure bảo tồn toàn bộ scope chain với tất cả các biến của nó?

Nói cách khác, trong đoạn trích đăng ký sự kiện trước đó, inner function `onClick(..)` có closed over chỉ `cb` không, hay nó cũng closed over `clickHandler`, `clickHandlers`, và `btn`?

Về mặt khái niệm, closure là **theo biến** (per variable) chứ không phải _theo scope_ (per scope). Ajax callbacks, event handlers, và tất cả các hình thức function closures khác thường được giả định chỉ close over những gì chúng tham chiếu rõ ràng.

Nhưng thực tế phức tạp hơn thế.

Một chương trình khác để xem xét:

```js
function manageStudentGrades(studentRecords) {
  var grades = studentRecords.map(getGrade);

  return addGrade;

  // ************************

  function getGrade(record) {
    return record.grade;
  }

  function sortAndTrimGradesList() {
    // sắp xếp theo điểm, giảm dần
    grades.sort(function desc(g1, g2) {
      return g2 - g1;
    });

    // chỉ giữ 10 điểm cao nhất
    grades = grades.slice(0, 10);
  }

  function addGrade(newGrade) {
    grades.push(newGrade);
    sortAndTrimGradesList();
    return grades;
  }
}

var addNextGrade = manageStudentGrades([
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  // ..nhiều bản ghi hơn..
  { id: 6, name: "Sarah", grade: 91 },
]);

// later

addNextGrade(81);
addNextGrade(68);
// [ .., .., ... ]
```

Outer function `manageStudentGrades(..)` nhận một danh sách các hồ sơ học sinh, và trả về một tham chiếu hàm `addGrade(..)`, mà chúng ta dán nhãn bên ngoài là `addNextGrade(..)`. Mỗi khi chúng ta gọi `addNextGrade(..)` với một điểm số mới, chúng ta nhận lại danh sách hiện tại của 10 điểm cao nhất, được sắp xếp theo thứ tự giảm dần (xem `sortAndTrimGradesList()`).

Từ cuối cuộc gọi `manageStudentGrades(..)` ban đầu, và giữa nhiều cuộc gọi `addNextGrade(..)`, biến `grades` được bảo tồn bên trong `addGrade(..)` thông qua closure; đó là cách danh sách điểm số cao nhất đang chạy được duy trì. Hãy nhớ rằng, đó là một closure trên chính biến `grades`, không phải mảng mà nó giữ.

Tuy nhiên, đó không phải là closure duy nhất liên quan. Bạn có thể phát hiện ra các biến khác đang được closed over không?

Bạn có phát hiện ra rằng `addGrade(..)` tham chiếu đến `sortAndTrimGradesList`? Điều đó có nghĩa là nó cũng closed over định danh đó, mà tình cờ giữ một tham chiếu đến hàm `sortAndTrimGradesList()`. Inner function thứ hai đó phải ở lại để `addGrade(..)` có thể tiếp tục gọi nó, điều này cũng có nghĩa là bất kỳ biến nào _nó_ closes over cũng dính lại—mặc dù, trong trường hợp này, không có gì thêm được closed over ở đó.

Còn gì khác được closed over?

Xem xét biến `getGrade` (và hàm của nó); nó có được closed over không? Nó được tham chiếu trong outer scope của `manageStudentGrades(..)` trong cuộc gọi `.map(getGrade)`. Nhưng nó không được tham chiếu trong `addGrade(..)` hoặc `sortAndTrimGradesList()`.

Còn về danh sách (có khả năng) lớn các hồ sơ học sinh mà chúng ta chuyển vào dưới dạng `studentRecords`? Biến đó có được closed over không? Nếu có, mảng hồ sơ học sinh không bao giờ được GC'd, dẫn đến chương trình này giữ một lượng bộ nhớ lớn hơn chúng ta có thể giả định. Nhưng nếu chúng ta nhìn kỹ lại, không có inner functions nào tham chiếu đến `studentRecords`.

Theo định nghĩa closure _theo biến_, vì `getGrade` và `studentRecords` _không_ được tham chiếu bởi các inner functions, chúng không được closed over. Chúng nên có sẵn miễn phí cho GC ngay sau khi cuộc gọi `manageStudentGrades(..)` hoàn thành.

Quả thực, hãy thử gỡ lỗi code này trong một JS engine gần đây, như v8 trong Chrome, đặt một breakpoint bên trong hàm `addGrade(..)`. Bạn có thể nhận thấy rằng inspector **không** liệt kê biến `studentRecords`. Đó là bằng chứng, về mặt gỡ lỗi, rằng engine không duy trì `studentRecords` thông qua closure. Phù!

Nhưng quan sát này đáng tin cậy đến mức nào như một bằng chứng? Xem xét chương trình (khá gượng ép!) này:

```js
function storeStudentInfo(id, name, grade) {
  return function getInfo(whichValue) {
    // cảnh báo:
    //   sử dụng `eval(..)` là một ý tưởng tồi!
    var val = eval(whichValue);
    return val;
  };
}

var info = storeStudentInfo(73, "Suzy", 87);

info("name");
// Suzy

info("grade");
// 87
```

Lưu ý rằng inner function `getInfo(..)` không được closed over một cách rõ ràng bất kỳ biến nào trong số `id`, `name`, hoặc `grade`. Tuy nhiên, các cuộc gọi đến `info(..)` dường như vẫn có thể tiếp cận các biến, mặc dù thông qua việc sử dụng trò gian lận lexical scope `eval(..)` (xem Chương 1).

Vì vậy, tất cả các biến chắc chắn đã được bảo tồn thông qua closure, mặc dù không được tham chiếu rõ ràng bởi inner function. Vậy điều đó có bác bỏ khẳng định _theo biến_ ủng hộ _theo scope_ không? Còn tùy.

Nhiều JS engines hiện đại áp dụng một _tối ưu hóa_ loại bỏ bất kỳ biến nào khỏi closure scope mà không được tham chiếu rõ ràng. Tuy nhiên, như chúng ta thấy với `eval(..)`, có những tình huống mà tối ưu hóa như vậy không thể được áp dụng, và closure scope tiếp tục chứa tất cả các biến ban đầu của nó. Nói cách khác, closure phải là _theo scope_, về mặt triển khai, và sau đó một tối ưu hóa tùy chọn cắt giảm scope xuống chỉ những gì đã được closed over (một kết quả tương tự như closure _theo biến_).

Ngay cả gần đây như một vài năm trước, nhiều JS engines đã không áp dụng tối ưu hóa này; có thể các trang web của bạn vẫn chạy trong các trình duyệt như vậy, đặc biệt là trên các thiết bị cũ hơn hoặc cấp thấp hơn. Điều đó có nghĩa là có thể các closures tồn tại lâu dài như event handlers có thể đang giữ bộ nhớ lâu hơn nhiều so với chúng ta giả định.

Và thực tế là nó là một tối ưu hóa tùy chọn ngay từ đầu, thay vì một yêu cầu của đặc tả, có nghĩa là chúng ta không nên chỉ thản nhiên giả định quá mức khả năng áp dụng của nó.

Trong các trường hợp một biến giữ một giá trị lớn (như một object hoặc array) và biến đó hiện diện trong một closure scope, nếu bạn không cần giá trị đó nữa và không muốn bộ nhớ đó được giữ, an toàn hơn (sử dụng bộ nhớ) là loại bỏ thủ công giá trị thay vì dựa vào tối ưu hóa closure/GC.

Hãy áp dụng một _bản sửa lỗi_ cho ví dụ `manageStudentGrades(..)` trước đó để đảm bảo mảng lớn tiềm năng được giữ trong `studentRecords` không bị bắt trong một closure scope một cách không cần thiết:

```js
function manageStudentGrades(studentRecords) {
  var grades = studentRecords.map(getGrade);

  // unset `studentRecords` để ngăn chặn
  // việc giữ lại bộ nhớ không mong muốn trong closure
  studentRecords = null;

  return addGrade;
  // ..
}
```

Chúng ta không loại bỏ `studentRecords` khỏi closure scope; điều đó chúng ta không thể kiểm soát. Chúng ta đang đảm bảo rằng ngay cả khi `studentRecords` vẫn còn trong closure scope, biến đó không còn tham chiếu đến mảng dữ liệu lớn tiềm năng nữa; mảng có thể được GC'd.

Một lần nữa, trong nhiều trường hợp JS có thể tự động tối ưu hóa chương trình để có cùng hiệu ứng. Nhưng vẫn là một thói quen tốt để cẩn thận và đảm bảo rõ ràng chúng ta không giữ bất kỳ lượng bộ nhớ thiết bị đáng kể nào lâu hơn mức cần thiết.

Thực tế là, về mặt kỹ thuật chúng ta cũng không cần hàm `getGrade()` nữa sau khi cuộc gọi `.map(getGrade)` hoàn thành. Nếu việc lập hồ sơ (profiling) ứng dụng của chúng ta cho thấy đây là một khu vực quan trọng của việc sử dụng bộ nhớ dư thừa, chúng ta có thể có thể eek out (tiết kiệm) thêm một chút bộ nhớ bằng cách giải phóng tham chiếu đó để giá trị của nó cũng không bị trói buộc. Điều đó có thể không cần thiết trong ví dụ đồ chơi này, nhưng đây là một kỹ thuật chung cần ghi nhớ nếu bạn đang tối ưu hóa dấu ấn bộ nhớ của ứng dụng của mình.

Điểm mấu chốt: điều quan trọng là phải biết closures xuất hiện ở đâu trong các chương trình của chúng ta, và những biến nào được bao gồm. Chúng ta nên quản lý các closures này một cách cẩn thận để chúng ta chỉ giữ lại những gì cần thiết tối thiểu và không lãng phí bộ nhớ.

### Một Góc Nhìn Thay Thế (An Alternative Perspective)

Xem xét lại định nghĩa làm việc của chúng ta về closure, khẳng định là các hàm là "giá trị hạng nhất" (first-class values) có thể được truyền xung quanh chương trình, giống như bất kỳ giá trị nào khác. Closure là sự liên kết-kết hợp kết nối hàm đó với scope/biến bên ngoài chính nó, bất kể hàm đó đi đâu.

Hãy nhớ lại một ví dụ code từ đầu chương này, một lần nữa với các màu bong bóng scope liên quan được chú thích:

```js
// outer/global scope: RED(1)

function adder(num1) {
  // function scope: BLUE(2)

  return function addTo(num2) {
    // function scope: GREEN(3)

    return num1 + num2;
  };
}

var add10To = adder(10);
var add42To = adder(42);

add10To(15); // 25
add42To(9); // 51
```

Góc nhìn hiện tại của chúng ta cho thấy rằng bất cứ nơi nào một hàm được truyền và gọi, closure bảo tồn một liên kết ẩn quay trở lại scope ban đầu để tạo điều kiện cho việc truy cập vào các biến được closed-over. Hình 4, lặp lại ở đây để thuận tiện, minh họa khái niệm này:

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig4.png" width="400" alt="Function instances linked to scopes via closure" align="center">
    <figcaption><em>Fig. 4 (lặp lại): Trực Quan Hóa Closures</em></figcaption>
    <br><br>
</figure>

Nhưng có một cách khác để suy nghĩ về closure, và chính xác hơn là bản chất của các hàm được _truyền xung quanh_ (passed around), có thể giúp làm sâu sắc thêm các mô hình tinh thần.

Mô hình thay thế này giảm bớt sự nhấn mạnh "các hàm như các giá trị hạng nhất," và thay vào đó chấp nhận cách các hàm (giống như tất cả các giá trị không nguyên thủy) được giữ bởi tham chiếu trong JS, và được gán/truyền bởi sao chép tham chiếu—xem Phụ lục A của cuốn sách _Get Started_ để biết thêm thông tin.

Thay vì nghĩ về inner function instance của `addTo(..)` di chuyển đến outer scope RED(1) thông qua `return` và gán, chúng ta có thể hình dung rằng các function instances thực sự chỉ ở lại vị trí trong môi trường scope của riêng chúng, tất nhiên với scope-chain của chúng còn nguyên vẹn.

Những gì được _gửi_ đến RED(1) scope là **chỉ một tham chiếu** đến in-place function instance (bản thể hàm tại chỗ), thay vì chính function instance. Hình 5 mô tả các inner function instances còn lại tại chỗ, được trỏ đến bởi các tham chiếu RED(1) `addTo10` và `addTo42`, tương ứng:

<figure>
    <img src="https://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig5.png" width="400" alt="Function instances inside scopes via closure, linked to by references" align="center">
    <figcaption><em>Fig. 5: Trực Quan Hóa Closures (Thay Thế)</em></figcaption>
    <br><br>
</figure>

Như được hiển thị trong Hình 5, mỗi cuộc gọi đến `adder(..)` vẫn tạo ra một scope BLUE(2) mới chứa một biến `num1`, cũng như một instance của scope GREEN(3) `addTo(..)`. Nhưng điều khác biệt so với Hình 4 là, bây giờ các instances GREEN(3) này vẫn ở lại tại chỗ, lồng nhau tự nhiên bên trong các instances scope BLUE(2) của chúng. Các tham chiếu `addTo10` và `addTo42` được di chuyển đến outer scope RED(1), không phải các function instances.

Khi `addTo10(15)` được gọi, `addTo(..)` function instance (vẫn tại chỗ trong môi trường scope BLUE(2) ban đầu của nó) được gọi. Vì chính function instance không bao giờ di chuyển, tất nhiên nó vẫn có quyền truy cập tự nhiên vào scope chain của nó. Tương tự với cuộc gọi `addTo42(9)`—không có gì đặc biệt ở đây ngoài lexical scope.

Vậy thì closure _là gì_, nếu không phải là _phép thuật_ cho phép một hàm duy trì một liên kết đến scope chain ban đầu của nó ngay cả khi hàm đó di chuyển xung quanh trong các scopes khác? Trong mô hình thay thế này, các hàm ở lại tại chỗ và tiếp tục truy cập scope chain ban đầu của chúng giống như chúng luôn có thể.

Closure thay vào đó mô tả _phép thuật_ của việc **giữ cho một function instance tồn tại**, cùng với toàn bộ môi trường scope và chuỗi của nó, chừng nào vẫn còn ít nhất một tham chiếu đến function instance đó trôi nổi trong bất kỳ phần nào khác của chương trình.

Định nghĩa đó của closure ít quan sát hơn và nghe có vẻ ít quen thuộc hơn một chút so với quan điểm học thuật truyền thống. Nhưng nó vẫn hữu ích, bởi vì lợi ích là chúng ta đơn giản hóa việc giải thích closure thành một sự kết hợp đơn giản của các tham chiếu và các in-place function instances.

Mô hình trước đó (Hình 4) không phải là _sai_ khi mô tả closure trong JS. Nó chỉ được truyền cảm hứng về mặt khái niệm hơn, một quan điểm học thuật về closure. Ngược lại, mô hình thay thế (Hình 5) có thể được mô tả là tập trung vào triển khai hơn một chút, cách JS thực sự hoạt động.

Cả hai quan điểm/mô hình đều hữu ích trong việc hiểu closure, nhưng người đọc có thể thấy cái này dễ nắm bắt hơn cái kia. Bất kể bạn chọn cái nào, các kết quả có thể quan sát được trong chương trình của chúng ta là giống nhau.

| LƯU Ý:                                                                                                                                                                                             |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mô hình thay thế này cho closure có ảnh hưởng đến việc liệu chúng ta phân loại các callbacks đồng bộ (synchronous callbacks) là ví dụ của closure hay không. Thêm về sắc thái này trong Phụ lục A. |

### Tại Sao Lại Là Closure? (Why Closure?)

Bây giờ chúng ta đã có một cảm giác toàn diện về closure là gì và cách nó hoạt động, hãy khám phá một số cách nó có thể cải thiện cấu trúc code và tổ chức của một chương trình ví dụ.

Hãy tưởng tượng bạn có một nút trên một trang mà khi được nhấp, nên lấy và gửi một số dữ liệu thông qua một yêu cầu Ajax. Không sử dụng closure:

```js
var APIendpoints = {
  studentIDs: "https://some.api/register-students",
  // ..
};

var data = {
  studentIDs: [14, 73, 112, 6],
  // ..
};

function makeRequest(evt) {
  var btn = evt.target;
  var recordKind = btn.dataset.kind;
  ajax(APIendpoints[recordKind], data[recordKind]);
}

// <button data-kind="studentIDs">
//    Register Students
// </button>
btn.addEventListener("click", makeRequest);
```

Tiện ích `makeRequest(..)` chỉ nhận một object `evt` từ một sự kiện click. Từ đó, nó phải lấy thuộc tính `data-kind` từ phần tử button đích, và sử dụng giá trị đó để tra cứu cả URL cho API endpoint cũng như dữ liệu nào nên được bao gồm trong yêu cầu Ajax.

Điều này hoạt động OK, nhưng thật không may (kém hiệu quả, dễ gây nhầm lẫn hơn) khi event handler phải đọc một thuộc tính DOM mỗi khi nó được kích hoạt. Tại sao một event handler không thể _ghi nhớ_ giá trị này? Hãy thử sử dụng closure để cải thiện code:

```js
var APIendpoints = {
  studentIDs: "https://some.api/register-students",
  // ..
};

var data = {
  studentIDs: [14, 73, 112, 6],
  // ..
};

function setupButtonHandler(btn) {
  var recordKind = btn.dataset.kind;

  btn.addEventListener("click", function makeRequest(evt) {
    ajax(APIendpoints[recordKind], data[recordKind]);
  });
}

// <button data-kind="studentIDs">
//    Register Students
// </button>

setupButtonHandler(btn);
```

Với cách tiếp cận `setupButtonHandler(..)`, thuộc tính `data-kind` được lấy một lần và gán cho biến `recordKind` tại thời điểm thiết lập ban đầu. `recordKind` sau đó được closed over bởi inner click handler `makeRequest(..)`, và giá trị của nó được sử dụng trên mỗi lần kích hoạt sự kiện để tra cứu URL và dữ liệu nên được gửi.

| LƯU Ý:                                                                                                                                                          |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `evt` vẫn được truyền cho `makeRequest(..)`, mặc dù trong trường hợp này chúng ta không sử dụng nó nữa. Nó vẫn được liệt kê, để nhất quán với đoạn trích trước. |

Bằng cách đặt `recordKind` bên trong `setupButtonHandler(..)`, chúng ta giới hạn sự phơi bày scope của biến đó vào một tập hợp con thích hợp hơn của chương trình; lưu trữ nó toàn cục sẽ tồi tệ hơn cho tổ chức code và khả năng đọc. Closure cho phép inner function instance `makeRequest()` _ghi nhớ_ biến này và truy cập bất cứ khi nào nó cần.

Xây dựng trên mô hình này, chúng ta có thể đã tra cứu cả URL và dữ liệu một lần, tại thời điểm thiết lập:

```js
function setupButtonHandler(btn) {
  var recordKind = btn.dataset.kind;
  var requestURL = APIendpoints[recordKind];
  var requestData = data[recordKind];

  btn.addEventListener("click", function makeRequest(evt) {
    ajax(requestURL, requestData);
  });
}
```

Bây giờ `makeRequest(..)` được closed over `requestURL` và `requestData`, điều này dễ hiểu hơn một chút, và cũng hiệu quả hơn một chút.

Hai kỹ thuật tương tự từ mô hình Lập trình Hàm (FP) dựa vào closure là ứng dụng một phần (partial application) và currying. Tóm tắt, với các kỹ thuật này, chúng ta thay đổi _hình dạng_ của các hàm yêu cầu nhiều đầu vào để một số đầu vào được cung cấp trước, và các đầu vào khác được cung cấp sau; các đầu vào ban đầu được ghi nhớ thông qua closure. Một khi tất cả các đầu vào đã được cung cấp, hành động cơ bản được thực hiện.

Bằng cách tạo một function instance đóng gói một số thông tin bên trong (thông qua closure), hàm-với-thông-tin-được-lưu-trữ sau đó có thể được sử dụng trực tiếp mà không cần phải cung cấp lại đầu vào đó. Điều này làm cho phần đó của code sạch hơn, và cũng cung cấp cơ hội để dán nhãn các hàm được ứng dụng một phần với các tên ngữ nghĩa tốt hơn.

Thích ứng ứng dụng một phần, chúng ta có thể cải thiện thêm code trước đó:

```js
function defineHandler(requestURL, requestData) {
  return function makeRequest(evt) {
    ajax(requestURL, requestData);
  };
}

function setupButtonHandler(btn) {
  var recordKind = btn.dataset.kind;
  var handler = defineHandler(APIendpoints[recordKind], data[recordKind]);
  btn.addEventListener("click", handler);
}
```

Các đầu vào `requestURL` và `requestData` được cung cấp trước, dẫn đến việc hàm `makeRequest(..)` được ứng dụng một phần, mà chúng ta dán nhãn cục bộ là `handler`. Khi sự kiện cuối cùng kích hoạt, đầu vào cuối cùng (`evt`, mặc dù nó bị bỏ qua) được truyền cho `handler()`, hoàn thành các đầu vào của nó và kích hoạt yêu cầu Ajax cơ bản.

Về mặt hành vi, chương trình này khá giống với chương trình trước đó, với cùng loại closure. Nhưng bằng cách cô lập việc tạo `makeRequest(..)` trong một tiện ích riêng biệt (`defineHandler(..)`), chúng ta làm cho định nghĩa đó có thể tái sử dụng nhiều hơn trên toàn bộ chương trình. Chúng ta cũng giới hạn rõ ràng scope closure chỉ vào hai biến cần thiết.

### Gần Hơn Với Closure (Closer to Closure)

Khi chúng ta khép lại một chương dày đặc, hãy hít thở sâu và để tất cả ngấm vào. Nghiêm túc mà nói, đó là rất nhiều thông tin cho bất kỳ ai tiêu thụ!

Chúng ta đã khám phá hai mô hình để giải quyết closure về mặt tinh thần:

- Quan sát (Observational): closure là một function instance ghi nhớ các biến bên ngoài của nó ngay cả khi hàm đó được truyền đến và **được gọi trong** các scopes khác.

- Triển khai (Implementational): closure là một function instance và môi trường scope của nó được bảo tồn tại chỗ trong khi bất kỳ tham chiếu nào đến nó được truyền xung quanh và **được gọi từ** các scopes khác.

Tóm tắt các lợi ích đối với các chương trình của chúng ta:

- Closure có thể cải thiện hiệu quả bằng cách cho phép một function instance ghi nhớ thông tin đã được xác định trước đó thay vì phải tính toán lại mỗi lần.

- Closure có thể cải thiện khả năng đọc code, giới hạn phơi bày scope bằng cách đóng gói (các) biến bên trong function instances, trong khi vẫn đảm bảo thông tin trong các biến đó có thể truy cập được cho việc sử dụng trong tương lai. Các function instances hẹp hơn, chuyên biệt hơn kết quả dễ tương tác hơn, vì thông tin được bảo tồn không cần phải được truyền vào mỗi lần gọi.

Trước khi bạn tiếp tục, hãy dành chút thời gian để trình bày lại tóm tắt này _bằng lời của riêng bạn_, giải thích closure là gì và tại sao nó hữu ích trong các chương trình của bạn. Văn bản cuốn sách chính kết thúc với một chương cuối cùng xây dựng trên đỉnh của closure với mô hình module.

---

## Chương 8: Mẫu Module (The Module Pattern)

Trong chương này, chúng ta sẽ kết thúc văn bản chính của cuốn sách bằng cách khám phá một trong những mẫu tổ chức code quan trọng nhất trong tất cả các lập trình: module. Như chúng ta sẽ thấy, các module vốn dĩ được xây dựng từ những gì chúng ta đã đề cập: phần thưởng cho những nỗ lực của bạn trong việc tìm hiểu lexical scope và closure.

Chúng ta đã kiểm tra mọi góc độ của lexical scope, từ bề rộng của global scope xuống qua các block scopes lồng nhau, vào những sự phức tạp của vòng đời biến. Sau đó, chúng ta đã tận dụng lexical scope để hiểu toàn bộ sức mạnh của closure.

Hãy dành một chút thời gian để suy ngẫm xem bạn đã đi bao xa trong hành trình này cho đến nay; bạn đã thực hiện những bước tiến lớn trong việc hiểu sâu hơn về JS!

Chủ đề trung tâm của cuốn sách này là việc hiểu và làm chủ scope và closure là chìa khóa để cấu trúc và tổ chức code của chúng ta một cách đúng đắn, đặc biệt là các quyết định về nơi lưu trữ thông tin trong các biến.

Mục tiêu của chúng ta trong chương cuối cùng này là đánh giá cao cách các modules hiện thân cho tầm quan trọng của các chủ đề này, nâng tầm chúng từ các khái niệm trừu tượng lên thành các cải tiến cụ thể, thiết thực trong việc xây dựng các chương trình.

### Đóng Gói và Phơi Bày Ít Nhất (Encapsulation and Least Exposure - POLE)

Đóng gói (Encapsulation) thường được trích dẫn như một nguyên tắc của lập trình hướng đối tượng (OO), nhưng nó cơ bản hơn và áp dụng rộng rãi hơn thế. Mục tiêu của đóng gói là việc bó, nhóm hoặc đồng vị trí thông tin (dữ liệu) và hành vi (hàm) cùng phục vụ một mục đích chung.

Độc lập với bất kỳ cú pháp hoặc cơ chế code nào, tinh thần của đóng gói có thể được nhận ra trong một cái gì đó đơn giản như sử dụng các file riêng biệt để giữ các bit của chương trình tổng thể với mục đích chung. Nếu chúng ta nhóm mọi thứ hỗ trợ một danh sách kết quả tìm kiếm vào một file duy nhất gọi là "search-list.js", chúng ta đang đóng gói phần đó của chương trình.

Xu hướng gần đây trong lập trình front-end hiện đại để tổ chức các ứng dụng xung quanh kiến trúc Component đẩy đóng gói đi xa hơn nữa. Đối với nhiều người, cảm giác tự nhiên là hợp nhất mọi thứ cấu thành danh sách kết quả tìm kiếm—thậm chí ngoài code, bao gồm markup trình bày và styling—vào một đơn vị logic chương trình duy nhất, một cái gì đó hữu hình mà chúng ta có thể tương tác. Và sau đó chúng ta dán nhãn bộ sưu tập đó là component "SearchList".

Một mục tiêu quan trọng khác là kiểm soát khả năng hiển thị của một số khía cạnh của dữ liệu và chức năng được đóng gói. Hãy nhớ lại từ Chương 6 nguyên tắc _phơi bày ít nhất_ (POLE), tìm cách bảo vệ một cách phòng thủ chống lại các _nguy hiểm_ khác nhau của việc phơi bày scope quá mức; những điều này ảnh hưởng đến cả biến và hàm. Trong JS, chúng ta thường triển khai kiểm soát khả năng hiển thị thông qua cơ chế của lexical scope.

Ý tưởng là nhóm các bit chương trình giống nhau lại với nhau, và giới hạn quyền truy cập lập trình một cách chọn lọc vào các phần mà chúng ta coi là chi tiết _riêng tư_ (private). Những gì không được coi là _riêng tư_ sau đó được đánh dấu là _công khai_ (public), có thể truy cập được cho toàn bộ chương trình.

Hiệu quả tự nhiên của nỗ lực này là tổ chức code tốt hơn. Dễ dàng hơn để xây dựng và bảo trì phần mềm khi chúng ta biết mọi thứ ở đâu, với ranh giới và điểm kết nối rõ ràng và hiển nhiên. Nó cũng dễ dàng hơn để duy trì chất lượng nếu chúng ta tránh những cạm bẫy của dữ liệu và chức năng bị phơi bày quá mức.

Đây là một số lợi ích chính của việc tổ chức các chương trình JS thành các modules.

### Module Là Gì? (What Is a Module?)

Một module là một bộ sưu tập các dữ liệu và hàm liên quan (thường được gọi là phương thức (methods) trong ngữ cảnh này), được đặc trưng bởi sự phân chia giữa các chi tiết _riêng tư_ ẩn và các chi tiết _công khai_ có thể truy cập, thường được gọi là "public API."

Một module cũng có trạng thái (stateful): nó duy trì một số thông tin theo thời gian, cùng với chức năng để truy cập và cập nhật thông tin đó.

| LƯU Ý:                                                                                                                                                                                                                                                                                                                                   |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Một mối quan tâm rộng hơn của mẫu module là hoàn toàn nắm lấy việc mô-đun hóa ở cấp hệ thống (system-level modularization) thông qua loose-coupling (ghép lỏng lẻo) và các kỹ thuật kiến trúc chương trình khác. Đó là một chủ đề phức tạp nằm ngoài giới hạn thảo luận của chúng ta, nhưng đáng để nghiên cứu thêm ngoài cuốn sách này. |

Để có cảm nhận tốt hơn về module là gì, hãy so sánh một số đặc điểm của module với các mẫu code hữu ích không hẳn là modules.

#### Namespaces (Nhóm Không Trạng Thái)

Nếu bạn nhóm một tập hợp các hàm liên quan lại với nhau, mà không có dữ liệu, thì bạn thực sự không có sự đóng gói mong đợi mà một module ngụ ý. Thuật ngữ tốt hơn cho nhóm các hàm _không trạng thái_ (stateless) này là một namespace:

```js
// namespace, không phải module
var Utils = {
  cancelEvt(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  },
  wait(ms) {
    return new Promise(function c(res) {
      setTimeout(res, ms);
    });
  },
  isValidEmail(email) {
    return /[^@]+@[^@.]+\\.[^@.]+/.test(email);
  },
};
```

`Utils` ở đây là một bộ sưu tập các tiện ích hữu ích, nhưng chúng đều là các hàm độc lập với trạng thái. Việc tập hợp chức năng lại với nhau nói chung là thực hành tốt, nhưng điều đó không làm cho cái này thành một module. Thay vào đó, chúng ta đã định nghĩa một `Utils` namespace và tổ chức các hàm dưới nó.

#### Cấu Trúc Dữ Liệu (Nhóm Có Trạng Thái)

Ngay cả khi bạn nhóm dữ liệu và các hàm có trạng thái lại với nhau, nếu bạn không giới hạn khả năng hiển thị của bất kỳ cái nào trong số đó, thì bạn đang dừng lại ngay trước khía cạnh POLE của việc đóng gói; dán nhãn đó là một module không thực sự hữu ích.

Xem xét:

```js
// cấu trúc dữ liệu, không phải module
var Student = {
  records: [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ],
  getName(studentID) {
    var student = this.records.find((student) => student.id == studentID);
    return student.name;
  },
};

Student.getName(73);
// Suzy
```

Vì `records` là dữ liệu có thể truy cập công khai, không bị ẩn sau một public API, `Student` ở đây thực sự không phải là một module.

`Student` có khía cạnh dữ liệu-và-chức năng của việc đóng gói, nhưng không có khía cạnh kiểm soát khả năng hiển thị. Tốt nhất là dán nhãn cái này là một instance của một cấu trúc dữ liệu.

#### Modules (Kiểm Soát Truy Cập Có Trạng Thái)

Để hiện thân hóa toàn bộ tinh thần của mẫu module, chúng ta không chỉ cần nhóm và trạng thái, mà còn cần kiểm soát truy cập thông qua khả năng hiển thị (riêng tư vs. công khai).

Hãy biến `Student` từ phần trước thành một module. Chúng ta sẽ bắt đầu với một hình thức tôi gọi là "module cổ điển" (classic module), ban đầu được gọi là "module bộc lộ" (revealing module) khi nó mới xuất hiện vào đầu những năm 2000. Xem xét:

```js
var Student = (function defineStudent(){\n    var records = [
        { id: 14, name: "Kyle", grade: 86 },
        { id: 73, name: "Suzy", grade: 87 },
        { id: 112, name: "Frank", grade: 75 },
        { id: 6, name: "Sarah", grade: 91 }
    ];

    var publicAPI = {
        getName
    };\n\n    return publicAPI;

    // ************************

    function getName(studentID) {
        var student = records.find(
            student => student.id == studentID
        );
        return student.name;
    }
})();\n\nStudent.getName(73);   // Suzy
```

`Student` bây giờ là một instance của một module. Nó có một public API với một phương thức duy nhất: `getName(..)`. Phương thức này có thể truy cập dữ liệu `records` ẩn riêng tư.

| CẢNH BÁO:                                                                                                                                                                                                                                                                                                                                                                                                           |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tôi nên chỉ ra rằng dữ liệu sinh viên rõ ràng được hard-coded vào định nghĩa module này chỉ là cho mục đích minh họa của chúng ta. Một module điển hình trong chương trình của bạn sẽ nhận dữ liệu này từ một nguồn bên ngoài, thường được tải từ cơ sở dữ liệu, file dữ liệu JSON, cuộc gọi Ajax, v.v. Dữ liệu sau đó được tiêm vào module instance thường thông qua (các) phương thức trên public API của module. |

Định dạng module cổ điển hoạt động như thế nào?

Lưu ý rằng instance của module được tạo ra bởi IIFE `defineStudent()` được thực thi. IIFE này trả về một object (có tên `publicAPI`) có một thuộc tính trên đó tham chiếu đến inner function `getName(..)`.

Đặt tên object là `publicAPI` là sở thích phong cách của tôi. Object có thể được đặt tên bất cứ thứ gì bạn thích (JS không quan tâm), hoặc bạn có thể chỉ trả về một object trực tiếp mà không gán nó cho bất kỳ biến được đặt tên nội bộ nào. Thêm về lựa chọn này trong Phụ lục A.

Từ bên ngoài, `Student.getName(..)` gọi inner function được phơi bày này, duy trì quyền truy cập vào biến `records` bên trong thông qua closure.

Bạn không _buộc phải_ trả về một object với một hàm là một trong các thuộc tính của nó. Bạn có thể chỉ trả về một hàm trực tiếp, thay cho object. Điều đó vẫn thỏa mãn tất cả các phần cốt lõi của một module cổ điển.

Nhờ vào cách lexical scope hoạt động, việc định nghĩa các biến và hàm bên trong hàm định nghĩa module bên ngoài của bạn làm cho mọi thứ _theo mặc định_ là riêng tư. Chỉ các thuộc tính được thêm vào object public API được trả về từ hàm mới được xuất khẩu (exported) để sử dụng công khai bên ngoài.

Việc sử dụng một IIFE ngụ ý rằng chương trình của chúng ta chỉ bao giờ cần một instance trung tâm duy nhất của module, thường được gọi là "singleton" (đơn thể). Quả thực, ví dụ cụ thể này đủ đơn giản để không có lý do rõ ràng nào chúng ta cần bất cứ điều gì hơn chỉ là một instance của module `Student`.

**Nhà Máy Module (Nhiều Instance)**

Nhưng nếu chúng ta muốn định nghĩa một module hỗ trợ nhiều instances (bản thể) trong chương trình của mình, chúng ta có thể chỉnh sửa code một chút:

```js
// hàm factory, không phải singleton IIFE
function defineStudent() {
    var records = [
        { id: 14, name: "Kyle", grade: 86 },
        { id: 73, name: "Suzy", grade: 87 },
        { id: 112, name: "Frank", grade: 75 },
        { id: 6, name: "Sarah", grade: 91 }
    ];

    var publicAPI = {
        getName
    };\n\n    return publicAPI;

    // ************************

    function getName(studentID) {
        var student = records.find(
            student => student.id == studentID
        );
        return student.name;
    }
}

var fullTime = defineStudent();
fullTime.getName(73);            // Suzy
```

Thay vì chỉ định `defineStudent()` như một IIFE, chúng ta chỉ định nghĩa nó như một hàm độc lập bình thường, thường được gọi trong ngữ cảnh này là một hàm "module factory" (nhà máy module).

Sau đó chúng ta gọi module factory, tạo ra một instance của module mà chúng ta dán nhãn `fullTime`. Module instance này ngụ ý một instance mới của inner scope, và do đó một closure mới mà `getName(..)` giữ trên `records`. `fullTime.getName(..)` bây giờ gọi phương thức trên instance cụ thể đó.

**Định Nghĩa Module Cổ Điển**

Vì vậy, để làm rõ điều gì làm cho một cái gì đó trở thành một module cổ điển:

- Phải có một outer scope, thường là từ một hàm module factory chạy ít nhất một lần.

- Inner scope của module phải có ít nhất một thông tin ẩn đại diện cho trạng thái của module.

- Module phải trả về trên public API của nó một tham chiếu đến ít nhất một hàm có closure trên trạng thái module ẩn (để trạng thái này thực sự được bảo tồn).

Bạn có thể sẽ bắt gặp các biến thể khác về cách tiếp cận module cổ điển này, chúng ta sẽ xem xét chi tiết hơn trong Phụ lục A.

### Các Module Node CommonJS (Node CommonJS Modules)

Trong Chương 4, chúng ta đã giới thiệu định dạng module CommonJS được sử dụng bởi Node. Không giống như định dạng module cổ điển được mô tả trước đó, nơi bạn có thể nhóm module factory hoặc IIFE cùng với bất kỳ code nào khác bao gồm các module khác, các module CommonJS dựa trên file (file-based); một module mỗi file.

Hãy chỉnh sửa ví dụ module của chúng ta để tuân thủ định dạng đó:

```js
module.exports.getName = getName;

// ************************

var records = [
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  { id: 6, name: "Sarah", grade: 91 },
];

function getName(studentID) {
  var student = records.find((student) => student.id == studentID);
  return student.name;
}
```

Các định danh `records` và `getName` nằm trong scope cấp cao nhất (top-level scope) của module này, nhưng đó không phải là global scope (như đã giải thích trong Chương 4). Như vậy, mọi thứ ở đây _theo mặc định_ là riêng tư đối với module.

Để phơi bày một cái gì đó trên public API của một module CommonJS, bạn thêm một thuộc tính vào object trống được cung cấp dưới dạng `module.exports`. Trong một số code cũ (legacy), bạn có thể bắt gặp các tham chiếu chỉ đến `exports` trần trụi, nhưng để code rõ ràng, bạn nên luôn luôn định danh đầy đủ tham chiếu đó với tiền tố `module.`.

Đối với mục đích phong cách, tôi thích đặt "exports" của mình ở đầu và việc triển khai module của mình ở dưới cùng. Nhưng những exports này có thể được đặt ở bất cứ đâu. Tôi thực sự khuyên bạn nên thu thập tất cả chúng lại với nhau, hoặc ở đầu hoặc cuối file của bạn.

Một số nhà phát triển có thói quen thay thế object exports mặc định, như thế này:

```js
// định nghĩa một object mới cho API
module.exports = {
  // ..exports..
};
```

Có một số điều kỳ quặc với cách tiếp cận này, bao gồm hành vi không mong muốn nếu nhiều modules như vậy phụ thuộc vòng tròn vào nhau. Như vậy, tôi khuyên không nên thay thế object. Nếu bạn muốn gán nhiều exports cùng một lúc, sử dụng định nghĩa kiểu object literal, bạn có thể làm điều này thay thế:

```js
Object.assign(module.exports, {
  // .. exports ..
});
```

Điều đang xảy ra ở đây là định nghĩa object literal `{ .. }` với public API của module của bạn được chỉ định, và sau đó `Object.assign(..)` đang thực hiện sao chép nông (shallow copy) tất cả các thuộc tính đó vào object `module.exports` hiện có, thay vì thay thế nó. Đây là một sự cân bằng tốt giữa sự tiện lợi và hành vi module an toàn hơn.

Để bao gồm một instance module khác vào module/chương trình của bạn, sử dụng phương thức `require(..)` của Node. Giả sử module này nằm tại "/path/to/student.js", đây là cách chúng ta có thể truy cập nó:

```js
var Student = require("/path/to/student.js");

Student.getName(73);
// Suzy
```

`Student` bây giờ tham chiếu đến public API của module ví dụ của chúng ta.

Các modules CommonJS hoạt động như các instances singleton, tương tự như phong cách định nghĩa module IIFE được trình bày trước đó. Bất kể bạn `require(..)` cùng một module bao nhiêu lần, bạn chỉ nhận được các tham chiếu bổ sung đến instance module được chia sẻ duy nhất.

`require(..)` là một cơ chế tất cả hoặc không có gì (all-or-nothing); nó bao gồm một tham chiếu của toàn bộ public API được phơi bày của module. Để truy cập hiệu quả chỉ một phần của API, cách tiếp cận điển hình trông giống như thế này:

```js
var getName = require("/path/to/student.js").getName;

// hoặc thay vào đó:

var { getName } = require("/path/to/student.js");
```

Tương tự như định dạng module cổ điển, các phương thức được xuất khẩu công khai của API của một module CommonJS giữ các closures trên các chi tiết module bên trong. Đó là cách trạng thái singleton của module được duy trì qua vòng đời của chương trình của bạn.

| LƯU Ý:                                                                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trong các câu lệnh `require("student")` của Node, các đường dẫn không tuyệt đối (`"student"`) giả định một phần mở rộng file ".js" và tìm kiếm "node_modules". |

### Các ES Modules Hiện Đại (Modern ES Modules - ESM)

Định dạng ESM chia sẻ một số điểm tương đồng với định dạng CommonJS. ESM dựa trên file, và các module instances là singletons, với mọi thứ riêng tư _theo mặc định_. Một sự khác biệt đáng chú ý là các file ESM được giả định là strict-mode (chế độ nghiêm ngặt), mà không cần một chỉ thị `\"use strict\"` ở đầu. Không có cách nào để định nghĩa một ESM là non-strict-mode.

Thay vì `module.exports` trong CommonJS, ESM sử dụng từ khóa `export` để phơi bày một cái gì đó trên public API của module. Từ khóa `import` thay thế câu lệnh `require(..)`. Hãy điều chỉnh "students.js" để sử dụng định dạng ESM:

```js
export { getName };

// ************************

var records = [
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  { id: 6, name: "Sarah", grade: 91 },
];

function getName(studentID) {
  var student = records.find((student) => student.id == studentID);
  return student.name;
}
```

Thay đổi duy nhất ở đây là câu lệnh `export { getName }`. Như trước đây, các câu lệnh `export` có thể xuất hiện ở bất cứ đâu trong file, mặc dù `export` phải ở top-level scope; nó không thể ở bên trong bất kỳ block hoặc hàm nào khác.

ESM cung cấp một chút biến thể về cách các câu lệnh `export` có thể được chỉ định. Ví dụ:

```js
export function getName(studentID) {
  // ..
}
```

Mặc dù `export` xuất hiện trước từ khóa `function` ở đây, hình thức này vẫn là một khai báo `function` cũng tình cờ được xuất khẩu. Nghĩa là, định danh `getName` được _function hoisted_ (xem Chương 5), vì vậy nó có sẵn trong toàn bộ scope của module.

Một biến thể được phép khác:

```js
export default function getName(studentID) {
  // ..
}
```

Đây là cái được gọi là "default export" (xuất khẩu mặc định), có các ngữ nghĩa khác với các exports khác. Về bản chất, một "default export" là một cách viết tắt cho những người tiêu dùng của module khi họ `import`, cung cấp cho họ một cú pháp ngắn gọn hơn khi họ chỉ cần thành viên API mặc định duy nhất này.

Các exports không phải `default` được gọi là "named exports" (xuất khẩu được đặt tên).

Từ khóa `import`—giống như `export`, nó phải được sử dụng chỉ ở cấp cao nhất (top level) của một ESM bên ngoài bất kỳ blocks hoặc hàm nào—cũng có một số biến thể trong cú pháp. Cái đầu tiên được gọi là "named import" (nhập khẩu được đặt tên):

```js
import { getName } from "/path/to/students.js";

getName(73); // Suzy
```

Như bạn có thể thấy, hình thức này chỉ nhập khẩu các thành viên public API được đặt tên cụ thể từ một module (bỏ qua bất cứ thứ gì không được đặt tên rõ ràng), và nó thêm các định danh đó vào top-level scope của module hiện tại. Loại nhập khẩu này là một phong cách quen thuộc với những người đã quen đóng gói các nhập khẩu trong các ngôn ngữ như Java.

Nhiều thành viên API có thể được liệt kê bên trong tập hợp `{ .. }`, được phân tách bằng dấu phẩy. Một named import cũng có thể được _đổi tên_ với từ khóa `as`:

```js
import { getName as getStudentName } from "/path/to/students.js";

getStudentName(73);
// Suzy
```

Nếu `getName` là một "default export" của module, chúng ta có thể nhập khẩu nó như thế này:

```js
import getName from "/path/to/students.js";

getName(73); // Suzy
```

Sự khác biệt duy nhất ở đây là bỏ `{ }` xung quanh ràng buộc nhập khẩu. Nếu bạn muốn trộn một default import với các named imports khác:

```js
import { default as getName /* .. others .. */ } from "/path/to/students.js";

getName(73); // Suzy
```

Ngược lại, biến thể chính khác trên `import` được gọi là "namespace import":

```js
import * as Student from "/path/to/students.js";

Student.getName(73); // Suzy
```

Như có thể thấy rõ, `*` nhập khẩu mọi thứ được xuất khẩu sang API, default và named, và lưu trữ tất cả dưới định danh namespace duy nhất như được chỉ định. Cách tiếp cận này khớp chặt chẽ nhất với hình thức của các module cổ điển trong phần lớn lịch sử JS.

| LƯU Ý:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vào thời điểm viết cuốn sách này, các trình duyệt hiện đại đã hỗ trợ ESM trong vài năm nay, nhưng hỗ trợ ổn định của Node cho ESM là khá gần đây, và đã phát triển trong một thời gian khá dài. Sự phát triển có khả năng tiếp tục trong một năm nữa hoặc hơn; việc giới thiệu ESM vào JS trở lại trong ES6 đã tạo ra một số lo ngại tương thích đầy thách thức cho khả năng tương tác của Node với các module CommonJS. Tham khảo tài liệu ESM của Node để biết tất cả các chi tiết mới nhất: https://nodejs.org/api/esm.html |

### Thoát Khỏi Scope (Exit Scope)

Cho dù bạn sử dụng định dạng module cổ điển (trình duyệt hoặc Node), định dạng CommonJS (trong Node), hoặc định dạng ESM (trình duyệt hoặc Node), các module là một trong những cách hiệu quả nhất để cấu trúc và tổ chức chức năng và dữ liệu của chương trình của bạn.

Mẫu module là kết luận của hành trình của chúng ta trong cuốn sách này về việc học cách chúng ta có thể sử dụng các quy tắc của lexical scope để đặt các biến và hàm vào các vị trí thích hợp. POLE là tư thế phòng thủ _riêng tư theo mặc định_ mà chúng ta luôn thực hiện, đảm bảo chúng ta tránh phơi bày quá mức và chỉ tương tác với diện tích bề mặt public API tối thiểu cần thiết.

Và bên dưới các module, _phép thuật_ của cách tất cả trạng thái module của chúng ta được duy trì là các closures tận dụng hệ thống lexical scope.

Đó là tất cả cho văn bản chính. Chúc mừng bạn đã có một hành trình khá dài cho đến nay! Như tôi đã nói nhiều lần trong suốt cuốn sách, đó là một ý tưởng thực sự tốt để tạm dừng, suy ngẫm, và thực hành những gì chúng ta vừa thảo luận.

Khi bạn thoải mái và sẵn sàng, hãy kiểm tra các phụ lục, khám phá sâu hơn vào một số góc của các chủ đề này, và cũng thách thức bạn với một số bài tập thực hành để củng cố những gì bạn đã học.

---

## Phụ Lục A: Khám Phá Xa Hơn (Exploring Further)

Bây giờ chúng ta sẽ khám phá một số sắc thái và khía cạnh xung quanh nhiều chủ đề đã được đề cập trong văn bản chính của cuốn sách này. Phụ lục này là tài liệu bổ sung, không bắt buộc.

Một số người thấy rằng việc đi sâu quá mức vào các trường hợp góc cạnh sắc thái và các ý kiến khác nhau không tạo ra gì ngoài tiếng ồn và sự xao lãng—được cho là, các nhà phát triển được phục vụ tốt hơn bằng cách bám vào các con đường thường đi. Cách tiếp cận của tôi đã bị chỉ trích là không thực tế và phản tác dụng. Tôi hiểu và đánh giá cao quan điểm đó, ngay cả khi tôi không nhất thiết phải chia sẻ nó.

Tôi tin rằng tốt hơn là được trao quyền bởi kiến thức về cách mọi thứ hoạt động hơn là chỉ lướt qua các chi tiết với các giả định và thiếu sự tò mò. Cuối cùng, bạn sẽ gặp phải các tình huống mà một cái gì đó nổi lên từ một mảnh mà bạn chưa khám phá. Nói cách khác, bạn sẽ không dành toàn bộ thời gian của mình để đi trên con đường _hạnh phúc_ (happy path) bằng phẳng. Bạn không muốn chuẩn bị sẵn sàng cho những va chạm không thể tránh khỏi của việc đi off-road sao?

Những cuộc thảo luận này cũng sẽ bị ảnh hưởng nặng nề hơn bởi ý kiến của tôi so với văn bản chính, vì vậy hãy ghi nhớ điều đó khi bạn tiêu thụ và xem xét những gì được trình bày. Phụ lục này hơi giống như một bộ sưu tập các bài đăng mini-blog giải thích chi tiết về các chủ đề sách khác nhau. Nó dài và sâu trong cỏ dại, vì vậy hãy dành thời gian của bạn và đừng vội vàng qua mọi thứ ở đây.

### Các Scope Ngụ Ý (Implied Scopes)

Các scopes đôi khi được tạo ra ở những nơi không rõ ràng. Trong thực tế, các scope ngụ ý (implied scopes) này không thường xuyên ảnh hưởng đến hành vi chương trình của bạn, nhưng vẫn hữu ích khi biết chúng đang xảy ra. Hãy để mắt đến các scope đáng ngạc nhiên sau đây:

- Parameter scope (Scope tham số)
- Function name scope (Scope tên hàm)

#### Parameter Scope (Scope Tham Số)

Ẩn dụ về cuộc trò chuyện trong Chương 2 ngụ ý rằng các tham số hàm về cơ bản giống như các biến được khai báo cục bộ trong function scope. Nhưng điều đó không phải lúc nào cũng đúng.

Xem xét:

```js
// outer/global scope: RED(1)

function getStudentName(studentID) {
  // function scope: BLUE(2)
  // ..
}
```

Ở đây, `studentID` được coi là một tham số "đơn giản" (simple), vì vậy nó hành xử như một thành viên của BLUE(2) function scope. Nhưng nếu chúng ta thay đổi nó thành một tham số không đơn giản (non-simple), về mặt kỹ thuật điều đó không còn đúng nữa. Các dạng tham số được coi là không đơn giản bao gồm các tham số có giá trị mặc định, tham số rest (sử dụng `...`), và các tham số destructuring.

Xem xét:

```js
// outer/global scope: RED(1)

function getStudentName(/*BLUE(2)*/ studentID = 0) {
  // function scope: GREEN(3)
  // ..
}
```

Ở đây, danh sách tham số về cơ bản trở thành scope riêng của nó, và scope của hàm sau đó được lồng bên trong scope _đó_.

Tại sao? Nó tạo ra sự khác biệt gì? Các dạng tham số không đơn giản giới thiệu các trường hợp góc cạnh (corner cases) khác nhau, vì vậy danh sách tham số trở thành scope riêng của nó để đối phó hiệu quả hơn với chúng.

Xem xét:

```js
function getStudentName(studentID = maxID, maxID) {
  // ..
}
```

Giả sử các hoạt động từ trái sang phải, mặc định `= maxID` cho tham số `studentID` yêu cầu một `maxID` đã tồn tại (và đã được khởi tạo). Code này tạo ra lỗi TDZ (Chương 5). Lý do là `maxID` được khai báo trong parameter scope, nhưng nó chưa được khởi tạo vì thứ tự của các tham số. Nếu thứ tự tham số bị đảo ngược, không có lỗi TDZ nào xảy ra:

```js
function getStudentName(maxID, studentID = maxID) {
  // ..
}
```

Sự phức tạp trở nên _rối rắm_ hơn nữa nếu chúng ta giới thiệu một biểu thức hàm vào vị trí tham số mặc định, mà sau đó có thể tạo ra closure của riêng nó (Chương 7) trên các tham số trong scope tham số ngụ ý này:

```js
function whatsTheDealHere(id, defaultID = () => id) {
  id = 5;
  console.log(defaultID());
}

whatsTheDealHere(3);
// 5
```

Đoạn trích đó có lẽ có ý nghĩa, bởi vì hàm mũi tên `defaultID()` closes over tham số/biến `id`, mà chúng ta sau đó gán lại thành `5`. Nhưng bây giờ hãy giới thiệu một định nghĩa shadowing của `id` trong function scope:

```js
function whatsTheDealHere(id, defaultID = () => id) {
  var id = 5;
  console.log(defaultID());
}

whatsTheDealHere(3);
// 3
```

Uh oh! `var id = 5` đang shadowing tham số `id`, nhưng closure của hàm `defaultID()` là trên tham số, không phải biến shadowing trong thân hàm. Điều này chứng minh có một bong bóng scope xung quanh danh sách tham số.

Nhưng nó còn điên rồ hơn thế!

```js
function whatsTheDealHere(id, defaultID = () => id) {
  var id;

  console.log(`local variable 'id': ${id}`);
  console.log(`parameter 'id' (closure): ${defaultID()}`);

  console.log("reassigning 'id' to 5");
  id = 5;

  console.log(`local variable 'id': ${id}`);
  console.log(`parameter 'id' (closure): ${defaultID()}`);
}

whatsTheDealHere(3);
// local variable 'id': 3   <--- Hả!? Kỳ lạ!
// parameter 'id' (closure): 3
// reassigning 'id' to 5
// local variable 'id': 5
// parameter 'id' (closure): 3
```

Chút kỳ lạ ở đây là thông báo console đầu tiên. Tại thời điểm đó, biến cục bộ `id` shadowing vừa mới được khai báo `var id`, mà Chương 5 khẳng định thường được tự động khởi tạo thành `undefined` ở đầu scope của nó. Tại sao nó không in ra `undefined`?

Trong trường hợp góc cạnh cụ thể này (vì lý do tương thích legacy), JS không tự động khởi tạo `id` thành `undefined`, mà thành giá trị của tham số `id` (`3`)!

Mặc dù hai `id` trông có vẻ như tại thời điểm đó chúng là một biến, chúng thực sự vẫn riêng biệt (và trong các scopes riêng biệt). Phép gán `id = 5` làm cho sự khác biệt có thể quan sát được, nơi tham số `id` giữ nguyên `3` và biến cục bộ trở thành `5`.

Lời khuyên của tôi để tránh bị cắn bởi những sắc thái kỳ lạ này:

- Không bao giờ shadow các tham số với các biến cục bộ

- Tránh sử dụng một hàm tham số mặc định closes over bất kỳ tham số nào

Ít nhất bây giờ bạn đã nhận thức được và có thể cẩn thận về thực tế là danh sách tham số là scope riêng của nó nếu bất kỳ tham số nào là không đơn giản.

#### Function Name Scope (Scope Tên Hàm)

Trong phần "Function Name Scope" ở Chương 3, tôi đã khẳng định rằng tên của một biểu thức hàm được thêm vào scope của chính hàm đó. Hãy nhớ lại:

```js
var askQuestion = function ofTheTeacher() {
  // ..
};
```

Đúng là `ofTheTeacher` không được thêm vào enclosing scope (nơi `askQuestion` được khai báo), nhưng nó cũng không _chỉ_ được thêm vào scope của hàm, theo cách bạn có thể đang giả định. Đó là một trường hợp góc cạnh kỳ lạ khác của scope ngụ ý.

Định danh tên của một biểu thức hàm nằm trong scope ngụ ý riêng của nó, lồng giữa outer enclosing scope và main inner function scope.

Nếu `ofTheTeacher` nằm trong scope của hàm, chúng ta sẽ mong đợi một lỗi ở đây:

```js
var askQuestion = function ofTheTeacher() {
  // tại sao đây không phải là lỗi duplicate declaration?
  let ofTheTeacher = "Confused, yet?";
};
```

Dạng khai báo `let` không cho phép khai báo lại (xem Chương 5). Nhưng đây là shadowing hoàn toàn hợp lệ, không phải khai báo lại, bởi vì hai định danh `ofTheTeacher` nằm trong các scopes riêng biệt.

Bạn sẽ hiếm khi gặp phải bất kỳ trường hợp nào mà scope của định danh tên của một hàm quan trọng. Nhưng một lần nữa, tốt hơn là biết các cơ chế này thực sự hoạt động như thế nào. Để tránh bị cắn, đừng bao giờ shadow các định danh tên hàm.

### Hàm Ẩn Danh vs. Hàm Có Tên (Anonymous vs. Named Functions)

Như đã thảo luận trong Chương 3, các hàm có thể được biểu thị ở dạng có tên hoặc ẩn danh. Việc sử dụng dạng ẩn danh phổ biến hơn nhiều, nhưng đó có phải là một ý tưởng hay không?

Khi bạn suy ngẫm về việc đặt tên cho các hàm của mình, hãy xem xét:

- Suy luận tên không đầy đủ
- Tên lexical cho phép tự tham chiếu
- Tên là mô tả hữu ích
- Hàm mũi tên không có tên lexical
- IIFE cũng cần tên

#### Tên Rõ Ràng hay Được Suy Luận? (Explicit or Inferred Names?)

Mọi hàm trong chương trình của bạn đều có một mục đích. Nếu nó không có mục đích, hãy loại nó ra, vì bạn chỉ đang lãng phí không gian. Nếu nó _có_ mục đích, thì _có_ một cái tên cho mục đích đó.

Cho đến nay nhiều độc giả có thể đồng ý với tôi. Nhưng điều đó có nghĩa là chúng ta nên luôn luôn đặt tên đó vào code? Đây là nơi tôi sẽ nhướng mày nhiều hơn một chút. Tôi nói, dứt khoát là, có!

Trước hết, "anonymous" (ẩn danh) hiển thị trong stack traces (dấu vết ngăn xếp) không thực sự hữu ích cho việc gỡ lỗi:

```js
btn.addEventListener("click", function () {
  setTimeout(function () {
    ["a", 42].map(function (v) {
      console.log(v.toUpperCase());
    });
  }, 100);
});
// Uncaught TypeError: v.toUpperCase is not a function
//     at myProgram.js:4
//     at Array.map (<anonymous>)
//     at myProgram.js:3
```

Ugh. So sánh với những gì được báo cáo nếu tôi đặt tên cho các hàm:

```js
btn.addEventListener("click", function onClick() {
  setTimeout(function waitAMoment() {
    ["a", 42].map(function allUpper(v) {
      console.log(v.toUpperCase());
    });
  }, 100);
});
// Uncaught TypeError: v.toUpperCase is not a function
//     at allUpper (myProgram.js:4)
//     at Array.map (<anonymous>)
//     at waitAMoment (myProgram.js:3)
```

Bạn thấy tên `waitAMoment` và `allUpper` xuất hiện và cung cấp cho stack trace thêm thông tin/ngữ cảnh hữu ích cho việc gỡ lỗi không? Chương trình dễ gỡ lỗi hơn nếu chúng ta sử dụng các tên hợp lý cho tất cả các hàm của mình.

| LƯU Ý:                                                                                                                                                                                                                                                                                           |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cái "&lt;anonymous&gt;" đáng tiếc vẫn hiển thị đề cập đến thực tế là việc triển khai `Array.map(..)` không hiện diện trong chương trình của chúng ta, mà được tích hợp vào JS engine. Nó không phải do bất kỳ sự nhầm lẫn nào mà chương trình của chúng ta đưa ra với các phím tắt khả năng đọc. |

Nhân tiện, hãy đảm bảo rằng chúng ta đang cùng quan điểm về việc hàm có tên là gì:

```js
function thisIsNamed() {
  // ..
}

ajax("some.url", function thisIsAlsoNamed() {
  // ..
});

var notNamed = function () {
  // ..
};

makeRequest({
  data: 42,
  cb /* cũng không phải là tên */: function () {
    // ..
  },
});

var stillNotNamed = function butThisIs() {
  // ..
};
```

"Nhưng chờ đã!", bạn nói. Một số trong số đó _được_ đặt tên, phải không!?

```js
var notNamed = function () {
  // ..
};

var config = {
  cb: function () {
    // ..
  },
};

notNamed.name;
// notNamed

config.cb.name;
// cb
```

Những cái này được gọi là tên _được suy luận_ (inferred names). Tên được suy luận là tốt, nhưng chúng thực sự không giải quyết đầy đủ mối quan tâm mà tôi đang thảo luận.

#### Thiếu Tên? (Missing Names?)

Vâng, các tên được suy luận này có thể hiển thị trong stack traces, điều này chắc chắn tốt hơn là "anonymous" hiển thị. Nhưng...

```js
function ajax(url, cb) {
  console.log(cb.name);
}

ajax("some.url", function () {
  // ..
});
// ""
```

Vùng. Các biểu thức `function` ẩn danh được truyền dưới dạng callbacks không có khả năng nhận tên được suy luận, vì vậy `cb.name` chỉ giữ chuỗi rỗng `""`. Đại đa số tất cả các biểu thức `function`, đặc biệt là các biểu thức ẩn danh, được sử dụng làm đối số callback; không ai trong số này có tên. Vì vậy, dựa vào suy luận tên là không đầy đủ, tốt nhất là vậy.

Và không chỉ callbacks mới thiếu sót với suy luận:

```js
var config = {};

config.cb = function () {
  // ..
};

config.cb.name;
// ""

var [noName] = [function () {}];
noName.name;
// ""
```

Bất kỳ việc gán biểu thức `function` nào không phải là một _phép gán đơn giản_ cũng sẽ thất bại trong việc suy luận tên. Vì vậy, nói cách khác, trừ khi bạn cẩn thận và có chủ ý về nó, về cơ bản hầu hết các biểu thức `function` ẩn danh trong chương trình của bạn thực tế sẽ hoàn toàn không có tên nào cả.

Suy luận tên chỉ là... không đủ.

Và ngay cả khi một biểu thức `function` _có_ nhận được một tên được suy luận, điều đó vẫn không được tính là một hàm có tên đầy đủ.

#### Tôi Là Ai? (Who am I?)

Nếu không có định danh tên lexical, hàm không có cách nội bộ nào để tham chiếu đến chính nó. Tự tham chiếu rất quan trọng cho những thứ như đệ quy và xử lý sự kiện:

```js
// hỏng
runOperation(function(num){\n    if (num <= 1) return 1;\n    return num * oopsNoNameToCall(num - 1);\n});\n\n// cũng hỏng
btn.addEventListener("click",function(){\n   console.log("nên chỉ phản hồi một click!");\n   btn.removeEventListener("click",oopsNoNameHere);\n});
```

Bỏ tên lexical khỏi callback của bạn làm cho việc tự tham chiếu hàm một cách đáng tin cậy trở nên khó khăn hơn. Bạn _có thể_ khai báo một biến trong một scope bao quanh tham chiếu đến hàm, nhưng biến này được _kiểm soát_ bởi scope bao quanh đó—nó có thể bị gán lại, v.v.—vì vậy nó không đáng tin cậy bằng việc hàm có tự tham chiếu nội bộ riêng của nó.

#### Tên Là Mô Tả (Names are Descriptors)

Cuối cùng, và tôi nghĩ quan trọng nhất là, bỏ tên khỏi một hàm làm cho người đọc khó biết mục đích của hàm là gì, trong một cái nhìn nhanh chóng. Họ phải đọc thêm code, bao gồm code bên trong hàm, và code xung quanh bên ngoài hàm, để tìm ra nó.

Xem xét:

```js
[ 1, 2, 3, 4, 5 ].filter(function(v){\n    return v % 2 == 1;\n});\n// [ 1, 3, 5 ]\n\n[ 1, 2, 3, 4, 5 ].filter(function keepOnlyOdds(v){\n    return v % 2 == 1;\n});\n// [ 1, 3, 5 ]
```

Chỉ là không có lý lẽ hợp lý nào để thực hiện việc **bỏ qua** tên `keepOnlyOdds` khỏi callback đầu tiên truyền đạt hiệu quả hơn cho người đọc mục đích của callback này. Bạn đã tiết kiệm được 13 ký tự, nhưng mất thông tin khả năng đọc quan trọng. Tên `keepOnlyOdds` cho người đọc biết rất rõ ràng, ngay cái nhìn đầu tiên, chuyện gì đang xảy ra.

JS engine không quan tâm đến tên. Nhưng độc giả con người của code của bạn hoàn toàn quan tâm.

Người đọc có thể nhìn vào `v % 2 == 1` và tìm ra nó đang làm gì không? Chắc chắn. Nhưng họ phải suy luận mục đích (và tên) bằng cách thực thi code trong đầu. Ngay cả một khoảng dừng ngắn để làm như vậy cũng làm chậm việc đọc code. Một cái tên mô tả tốt làm cho quá trình này gần như không tốn sức và ngay lập tức.

Hãy nghĩ theo cách này: tác giả của code này cần phải tìm ra mục đích của một hàm bao nhiêu lần trước khi thêm tên vào code? Khoảng một lần. Có thể hai hoặc ba lần nếu họ cần điều chỉnh tên. Nhưng bao nhiêu lần người đọc code này sẽ phải tìm ra tên/mục đích? Mỗi lần dòng này được đọc. Hàng trăm lần? Hàng nghìn? Hơn nữa?

Bất kể độ dài hay độ phức tạp của hàm, khẳng định của tôi là, tác giả nên tìm ra một cái tên mô tả tốt và thêm nó vào code. Ngay cả các hàm một dòng trong các câu lệnh `map(..)` và `then(..)` cũng nên được đặt tên:

```js
lookupTheRecords(someData)
  .then(function extractSalesRecords(resp) {
    return resp.allSales;
  })
  .then(storeRecords);
```

Tên `extractSalesRecords` cho người đọc biết mục đích của trình xử lý `then(..)` này _tốt hơn_ là chỉ suy luận mục đích đó từ việc thực thi trong đầu `return resp.allSales`.

Cớ duy nhất để không bao gồm tên trên một hàm là lười biếng (không muốn gõ thêm vài ký tự) hoặc không sáng tạo (không thể nghĩ ra một cái tên hay). Nếu bạn không thể tìm ra một cái tên hay, bạn có thể chưa hiểu hàm và mục đích của nó. Hàm có lẽ được thiết kế kém, hoặc nó làm quá nhiều thứ, và nên được làm lại. Một khi bạn có một hàm đơn mục đích, được thiết kế tốt, tên thích hợp của nó sẽ trở nên rõ ràng.

Đây là một mẹo tôi sử dụng: trong khi viết một hàm lần đầu tiên, nếu tôi không hoàn toàn hiểu mục đích của nó và không thể nghĩ ra một cái tên hay để sử dụng, tôi chỉ sử dụng `TODO` làm tên. Bằng cách đó, sau này khi xem xét code của mình, tôi có khả năng tìm thấy những tên giữ chỗ đó, và tôi có xu hướng (và chuẩn bị tốt hơn!) để quay lại và tìm ra một cái tên tốt hơn, thay vì chỉ để nó là `TODO`.

Tất cả các hàm đều cần tên. Mỗi một cái. Không ngoại lệ. Bất kỳ tên nào bạn bỏ qua đều đang làm cho chương trình khó đọc hơn, khó gỡ lỗi hơn, khó mở rộng và bảo trì sau này.

#### Hàm Mũi Tên (Arrow Functions)

Hàm mũi tên **luôn luôn** ẩn danh, ngay cả khi (hiếm khi) chúng được sử dụng theo cách mang lại cho chúng một tên được suy luận. Tôi vừa dành vài trang để giải thích tại sao các hàm ẩn danh là một ý tưởng tồi, vì vậy bạn có thể đoán tôi nghĩ gì về các hàm mũi tên.

Đừng sử dụng chúng như một sự thay thế chung cho các hàm thông thường. Chúng ngắn gọn hơn, vâng, nhưng sự ngắn gọn đó đi kèm với cái giá là bỏ qua các dấu phân cách trực quan chính giúp não bộ của chúng ta nhanh chóng phân tích những gì chúng ta đang đọc. Và, đến điểm thảo luận này, chúng ẩn danh, điều này làm cho chúng tồi tệ hơn về khả năng đọc từ góc độ đó nữa.

Hàm mũi tên có một mục đích, nhưng mục đích đó không phải là để tiết kiệm các lần gõ phím. Hàm mũi tên có hành vi _lexical this_, điều này hơi nằm ngoài giới hạn thảo luận của chúng ta trong cuốn sách này.

Tóm lại: hàm mũi tên hoàn toàn không định nghĩa một từ khóa định danh `this`. Nếu bạn sử dụng một `this` bên trong một hàm mũi tên, nó hành xử chính xác như bất kỳ tham chiếu biến nào khác, đó là scope chain được tham khảo để tìm một function scope (không phải arrow function) nơi nó _được_ định nghĩa, và sử dụng cái đó.

Nói cách khác, hàm mũi tên xử lý `this` giống như mọi biến lexical khác.

Nếu bạn đã quen với các thủ thuật (hacks) như `var self = this`, hoặc nếu bạn thích gọi `.bind(this)` trên các biểu thức `function` bên trong, chỉ để buộc chúng kế thừa một `this` từ một hàm bên ngoài như thể nó là một biến lexical, thì `=>` arrow functions hoàn toàn là lựa chọn tốt hơn. Chúng được thiết kế đặc biệt để khắc phục vấn đề đó.

Vì vậy, trong những trường hợp hiếm hoi bạn cần _lexical this_, hãy sử dụng hàm mũi tên. Nó là công cụ tốt nhất cho công việc đó. Nhưng chỉ cần biết rằng khi làm như vậy, bạn đang chấp nhận những nhược điểm của một hàm ẩn danh. Bạn nên bỏ thêm nỗ lực để giảm thiểu _chi phí_ khả năng đọc, chẳng hạn như tên biến mô tả hơn và chú thích code.

#### Biến Thể IIFE (IIFE Variations)

Tất cả các hàm nên có tên. Tôi đã nói điều đó vài lần rồi, phải không!? Điều đó bao gồm cả các IIFE.

```js
(function () {
  // đừng làm điều này!
})();

(function doThisInstead() {
  // ..
})();
```

Làm thế nào để chúng ta nghĩ ra một cái tên cho một IIFE? Xác định IIFE đó ở đó để làm gì. Tại sao bạn cần một scope ở vị trí đó? Bạn có đang ẩn một biến cache cho các hồ sơ sinh viên không?

```js
var getStudents = (function StoreStudentRecords() {
  var studentRecords = [];

  return function getStudents() {
    // ..
  };
})();
```

Tôi đã đặt tên cho IIFE là `StoreStudentRecords` bởi vì đó là những gì nó đang làm: lưu trữ các hồ sơ sinh viên. Mỗi IIFE nên có một cái tên. Không ngoại lệ.

Các IIFE thường được định nghĩa bằng cách đặt `( .. )` xung quanh biểu thức `function`, như được hiển thị trong các đoạn trích trước đó. Nhưng đó không phải là cách duy nhất để định nghĩa một IIFE. Về mặt kỹ thuật, lý do duy nhất chúng ta đang sử dụng bộ bao quanh đầu tiên của `( .. )` chỉ là để từ khóa `function` không ở vị trí đủ điều kiện là một khai báo `function` đối với trình phân tích cú pháp JS. Nhưng có những cách cú pháp khác để tránh bị phân tích cú pháp như một khai báo:

```js
!(function thisIsAnIIFE() {
  // ..
})();

+(function soIsThisOne() {
  // ..
})();

~(function andThisOneToo() {
  // ..
})();
```

`!`, `+`, `~`, và một số toán tử một ngôi (unary operators) khác (các toán tử với một toán hạng) đều có thể được đặt trước `function` để biến nó thành một biểu thức. Sau đó, cuộc gọi `()` cuối cùng là hợp lệ, làm cho nó thành một IIFE.

Tôi thực sự khá thích sử dụng toán tử một ngôi `void` khi định nghĩa một IIFE độc lập:

```js
void (function yepItsAnIIFE() {
  // ..
})();
```

Lợi ích của `void` là, nó truyền đạt rõ ràng ở đầu hàm rằng IIFE này sẽ không trả về bất kỳ giá trị nào.

Dù bạn định nghĩa IIFEs của mình như thế nào, hãy thể hiện chút tình yêu bằng cách đặt tên cho chúng.

### Hoisting: Hàm và Biến (Hoisting: Functions and Variables)

Chương 5 đã làm rõ cả _function hoisting_ (hoisting hàm) và _variable hoisting_ (hoisting biến). Vì hoisting thường được trích dẫn như một sai lầm trong thiết kế của JS, tôi muốn khám phá ngắn gọn tại sao cả hai hình thức hoisting này _có thể_ có lợi và vẫn nên được xem xét.

Hãy dành cho hoisting một mức độ cân nhắc sâu hơn bằng cách xem xét những điểm mạnh của:

- Code thực thi được đặt trước, khai báo hàm đặt sau
- Vị trí ngữ nghĩa của các khai báo biến

#### Hoisting Hàm (Function Hoisting)

Để ôn lại, chương trình này hoạt động nhờ vào _function hoisting_:

```js
getStudents();

// ..

function getStudents() {
  // ..
}
```

Khai báo `function` được hoisting trong quá trình biên dịch, có nghĩa là `getStudents` là một định danh được khai báo cho toàn bộ scope. Ngoài ra, định danh `getStudents` được tự động khởi tạo với tham chiếu hàm, một lần nữa ở đầu scope.

Tại sao điều này hữu ích? Lý do tôi thích tận dụng _function hoisting_ là nó đặt _code thực thi_ trong bất kỳ scope nào lên đầu, và bất kỳ khai báo nào khác (hàm) ở dưới. Điều này có nghĩa là dễ dàng hơn để tìm code sẽ chạy trong bất kỳ khu vực nhất định nào, thay vì phải cuộn và cuộn, hy vọng tìm thấy dấu `}` cuối cùng đánh dấu sự kết thúc của một scope/hàm ở đâu đó.

Tôi tận dụng vị trí đảo ngược này ở tất cả các cấp độ của scope:

```js
getStudents();

// *************

function getStudents() {
  var whatever = doSomething();

  // những thứ khác

  return whatever;

  // *************

  function doSomething() {
    // ..
  }
}
```

Khi tôi mở một file như thế lần đầu tiên, dòng đầu tiên là code thực thi khởi động hành vi của nó. Điều đó rất dễ nhận ra! Sau đó, nếu tôi cần tìm và kiểm tra `getStudents()`, tôi thích việc dòng đầu tiên của nó cũng là code thực thi. Chỉ khi tôi cần xem chi tiết của `doSomething()` tôi mới đi và tìm định nghĩa của nó ở bên dưới.

Nói cách khác, tôi nghĩ _function hoisting_ làm cho code dễ đọc hơn thông qua một thứ tự đọc trôi chảy, tiến bộ, từ trên xuống dưới.

#### Hoisting Biến (Variable Hoisting)

Còn về _variable hoisting_ thì sao?

Mặc dù `let` và `const` có hoisting, bạn không thể sử dụng các biến đó trong TDZ của chúng (xem Chương 5). Vì vậy, cuộc thảo luận sau đây chỉ áp dụng cho các khai báo `var`. Trước khi tôi tiếp tục, tôi sẽ thừa nhận: trong hầu hết các trường hợp, tôi hoàn toàn đồng ý rằng _variable hoisting_ là một ý tưởng tồi:

```js
pleaseDontDoThis = "bad idea";

// much later
var pleaseDontDoThis;
```

Trong khi loại thứ tự đảo ngược đó hữu ích cho _function hoisting_, ở đây tôi nghĩ nó thường làm cho code khó suy luận hơn.

Nhưng có một ngoại lệ mà tôi đã tìm thấy, hơi hiếm, trong code của riêng tôi. Nó liên quan đến nơi tôi đặt các khai báo `var` của mình bên trong một định nghĩa module CommonJS.

Đây là cách tôi thường cấu trúc các định nghĩa module của mình trong Node:

```js
// dependencies
var aModuleINeed = require("very-helpful");
var anotherModule = require("kinda-helpful");

// public API
var publicAPI = Object.assign(module.exports, {
  getStudents,
  addStudents,
  // ..
});

// ********************************
// private implementation

var cache = {};
var otherData = [];

function getStudents() {
  // ..
}

function addStudents() {
  // ..
}
```

Chú ý cách các biến `cache` và `otherData` nằm trong phần "private" (riêng tư) của bố cục module? Đó là vì tôi không định phơi bày chúng công khai. Vì vậy, tôi tổ chức module để chúng được đặt cùng với các chi tiết triển khai ẩn khác của module.

Nhưng tôi đã có một vài trường hợp hiếm hoi nơi tôi cần các phép gán của những giá trị đó xảy ra ở _phía trên_, trước khi tôi khai báo public API được xuất khẩu của module. Ví dụ:

```js
// public API
var publicAPI = Object.assign(module.exports, {
  getStudents,
  addStudents,
  refreshData: refreshData.bind(null, cache),
});
```

Tôi cần biến `cache` đã được gán một giá trị, bởi vì giá trị đó được sử dụng trong việc khởi tạo public API (ứng dụng một phần `.bind(..)`).

Tôi có nên chỉ chuyển `var cache = { .. }` lên đầu, phía trên việc khởi tạo public API này không? Có lẽ. Nhưng bây giờ ít rõ ràng hơn rằng `var cache` là một chi tiết triển khai _riêng tư_. Đây là sự thỏa hiệp mà tôi (hơi hiếm khi) đã sử dụng:

```js
cache = {}; // được sử dụng ở đây, nhưng khai báo ở dưới

// public API
var publicAPI = Object.assign(module.exports, {
  getStudents,
  addStudents,
  refreshData: refreshData.bind(null, cache),
});

// ********************************
// private implementation

var cache /* = {}*/;
```

Bạn thấy _variable hoisting_ chứ? Tôi đã khai báo `cache` ở dưới nơi nó thuộc về, về mặt logic, nhưng trong trường hợp hiếm hoi này tôi đã sử dụng nó sớm hơn ở phía trên, trong khu vực mà việc khởi tạo của nó là cần thiết. Tôi thậm chí đã để lại một gợi ý về giá trị được gán cho `cache` trong một chú thích code.

Đó thực sự là trường hợp duy nhất tôi từng tìm thấy để tận dụng _variable hoisting_ để gán một biến sớm hơn trong một scope so với khai báo của nó. Nhưng tôi nghĩ đó là một ngoại lệ hợp lý để áp dụng với sự thận trọng.

### Trường Hợp Cho `var` (The Case for `var`)

Nói về _variable hoisting_, hãy nói chuyện thẳng thắn một chút về `var`, một nhân vật phản diện yêu thích mà các devs thích đổ lỗi cho nhiều nỗi đau khổ của việc phát triển JS. Trong Chương 5, chúng ta đã khám phá `let`/`const` và hứa rằng chúng ta sẽ xem xét lại vị trí của `var` trong toàn bộ hỗn hợp.

Khi tôi trình bày trường hợp, đừng bỏ lỡ:

- `var` chưa bao giờ bị hỏng
- `let` là bạn của bạn
- `const` có tiện ích hạn chế
- Tốt nhất của cả hai thế giới: `var` _và_ `let`

#### Đừng Vứt Bỏ `var` (Don't Throw Out `var`)

`var` vẫn ổn, và hoạt động hoàn toàn tốt. Nó đã tồn tại trong 25 năm, và nó sẽ tồn tại và hữu ích và hoạt động trong 25 năm nữa hoặc hơn. Những tuyên bố rằng `var` bị hỏng, lỗi thời, nguy hiểm, hoặc thiết kế kém là sự hùa theo phong trào (bandwagoning) giả tạo.

Điều đó có nghĩa là `var` là từ khóa khai báo đúng cho mọi khai báo duy nhất trong chương trình của bạn? Chắc chắn là không. Nhưng nó vẫn có chỗ đứng trong các chương trình của bạn. Từ chối sử dụng nó vì ai đó trong team đã chọn một ý kiến linter hung hăng nghẹn họng với `var` là đang tự làm hại mình.

OK, bây giờ tôi đã làm bạn thực sự tức giận, hãy để tôi cố gắng giải thích quan điểm của mình.

Để ghi lại, tôi là một fan của `let`, cho các khai báo phạm vi khối (block-scoped). Tôi thực sự không thích TDZ và tôi nghĩ đó là một sai lầm. Nhưng bản thân `let` rất tuyệt. Tôi sử dụng nó thường xuyên. Trên thực tế, tôi có lẽ sử dụng nó nhiều bằng hoặc nhiều hơn tôi sử dụng `var`.

#### `const`-antly Bối Rối (`const`-antly Confused)

`const` mặt khác, tôi không sử dụng thường xuyên. Tôi sẽ không đào sâu vào tất cả các lý do tại sao, nhưng nó quy về việc `const` không _mang lại lợi ích tương xứng_ (carrying its own weight). Nghĩa là, trong khi có một chút lợi ích nhỏ của `const` trong một số trường hợp, lợi ích đó bị lu mờ bởi lịch sử dài của những rắc rối xung quanh sự nhầm lẫn về `const` trong nhiều ngôn ngữ, rất lâu trước khi nó xuất hiện trong JS.

`const` giả vờ tạo ra các giá trị không thể bị thay đổi (mutate)—một quan niệm sai lầm cực kỳ phổ biến trong cộng đồng nhà phát triển trên nhiều ngôn ngữ—trong khi những gì nó thực sự làm là ngăn chặn việc gán lại (re-assignment).

```js
const studentIDs = [14, 73, 112];

// later

studentIDs.push(6); // whoa, chờ đã... cái gì!?
```

Sử dụng một `const` với một giá trị có thể thay đổi (như một mảng hoặc object) là đang yêu cầu một nhà phát triển tương lai (hoặc người đọc code của bạn) rơi vào cái bẫy bạn đã đặt, đó là họ hoặc không biết, hoặc đại loại là quên, rằng _tính bất biến của giá trị_ (value immutability) hoàn toàn không giống với _tính bất biến của phép gán_ (assignment immutability).

Tôi chỉ không nghĩ chúng ta nên đặt những cái bẫy đó. Lần duy nhất tôi sử dụng `const` là khi tôi đang gán một giá trị đã bất biến (như `42` hoặc `"Hello, friends!"`), và khi nó rõ ràng là một "hằng số" (constant) theo nghĩa là một tên giữ chỗ cho một giá trị literal, cho mục đích ngữ nghĩa. Đó là những gì `const` được sử dụng tốt nhất. Tuy nhiên, điều đó khá hiếm trong code của tôi.

Nếu việc gán lại biến là một vấn đề lớn, thì `const` sẽ hữu ích hơn. Nhưng việc gán lại biến chỉ không phải là vấn đề lớn như vậy trong việc gây ra lỗi. Có một danh sách dài những thứ dẫn đến lỗi trong các chương trình, nhưng "vô tình gán lại" nằm ở vị trí rất, rất thấp trong danh sách đó.

Kết hợp điều đó với thực tế là `const` (và `let`) được cho là sử dụng trong các blocks, và các blocks được cho là ngắn, và bạn có một khu vực thực sự nhỏ trong code của bạn nơi một khai báo `const` thậm chí có thể áp dụng. Một `const` ở dòng 1 của block mười dòng của bạn chỉ cho bạn biết điều gì đó về chín dòng tiếp theo. Và điều nó cho bạn biết đã rõ ràng bằng cách liếc xuống chín dòng đó: biến không bao giờ ở phía bên trái của một dấu `=`; nó không được gán lại.

Đó là nó, đó là tất cả những gì `const` thực sự làm. Ngoài điều đó ra, nó không hữu ích lắm. Xếp chồng lên sự nhầm lẫn đáng kể của tính bất biến giá trị vs. phép gán, `const` mất đi nhiều vẻ hào nhoáng của nó.

Một `let` (hoặc `var`!) không bao giờ được gán lại đã hoạt động về mặt hành vi như một "hằng số", ngay cả khi nó không có sự đảm bảo của trình biên dịch. Điều đó là đủ tốt trong hầu hết các trường hợp.

#### `var` _và_ `let` (`var` _and_ `let`)

Trong tâm trí tôi, `const` khá hiếm khi hữu ích, vì vậy đây chỉ là cuộc đua song mã giữa `let` và `var`. Nhưng nó cũng không thực sự là một cuộc đua, bởi vì không nhất thiết chỉ có một người chiến thắng. Cả hai đều có thể thắng... các cuộc đua khác nhau.

Thực tế là, bạn nên sử dụng cả `var` và `let` trong các chương trình của mình. Chúng không thể thay thế cho nhau: bạn không nên sử dụng `var` ở nơi `let` được yêu cầu, nhưng bạn cũng không nên sử dụng `let` ở nơi `var` là thích hợp nhất.

Vậy chúng ta vẫn nên sử dụng `var` ở đâu? Trong những trường hợp nào nó là một lựa chọn tốt hơn `let`?

Thứ nhất, tôi luôn sử dụng `var` trong top-level scope của bất kỳ hàm nào, bất kể đó là ở đầu, giữa, hay cuối hàm. Tôi cũng sử dụng `var` trong global scope, mặc dù tôi cố gắng giảm thiểu việc sử dụng global scope.

Tại sao sử dụng `var` cho scope hàm? Bởi vì đó chính xác là những gì `var` làm. Theo nghĩa đen, không có công cụ nào tốt hơn cho công việc scoping hàm một khai báo hơn một từ khóa khai báo mà, trong 25 năm, đã làm chính xác điều đó.

Bạn _có thể_ sử dụng `let` trong top-level scope này, nhưng nó không phải là công cụ tốt nhất cho công việc đó. Tôi cũng thấy rằng nếu bạn sử dụng `let` ở mọi nơi, thì ít rõ ràng hơn những khai báo nào được thiết kế để được bản địa hóa (localized) và những cái nào được dự định sử dụng trong toàn bộ hàm.

Ngược lại, tôi hiếm khi sử dụng một `var` bên trong một block. Đó là những gì `let` dành cho. Sử dụng công cụ tốt nhất cho công việc. Nếu bạn thấy một `let`, nó cho bạn biết rằng bạn đang đối phó với một khai báo được bản địa hóa. Nếu bạn thấy `var`, nó cho bạn biết rằng bạn đang đối phó với một khai báo toàn hàm (function-wide). Đơn giản như vậy.

```js
function getStudents(data) {
    var studentRecords = [];

    for (let record of data.records) {
        let id = `student-${ record.id }`;
        studentRecords.push({
            id,
            record.name
        });
    }

    return studentRecords;
}
```

Biến `studentRecords` được dự định để sử dụng trên toàn bộ hàm. `var` là từ khóa khai báo tốt nhất để nói với người đọc điều đó. Ngược lại, `record` và `id` được dự định chỉ sử dụng trong scope hẹp hơn của vòng lặp, vì vậy `let` là công cụ tốt nhất cho công việc đó.

Ngoài lập luận ngữ nghĩa _công cụ tốt nhất_ này, `var` có một vài đặc điểm khác mà, trong những trường hợp hạn chế nhất định, làm cho nó mạnh mẽ hơn.

Một ví dụ là khi một vòng lặp đang sử dụng độc quyền một biến, nhưng mệnh đề điều kiện của nó không thể nhìn thấy các khai báo trong block bên trong vòng lặp:

```js
function commitAction() {
  do {
    let result = commit();
    var done = result && result.code == 1;
  } while (!done);
}
```

Ở đây, `result` rõ ràng chỉ được sử dụng bên trong block, vì vậy chúng ta sử dụng `let`. Nhưng `done` thì khác một chút. Nó chỉ hữu ích cho vòng lặp, nhưng mệnh đề `while` không thể thấy các khai báo `let` xuất hiện bên trong vòng lặp. Vì vậy chúng ta thỏa hiệp và sử dụng `var`, để `done` được hoisted lên outer scope nơi nó có thể được nhìn thấy.

Giải pháp thay thế—khai báo `done` bên ngoài vòng lặp—tách biệt nó khỏi nơi nó được sử dụng đầu tiên, và hoặc cần phải chọn một giá trị mặc định để gán, hoặc tệ hơn, để nó không được gán và do đó trông mơ hồ đối với người đọc. Tôi nghĩ `var` bên trong vòng lặp là thích hợp hơn ở đây.

Một đặc điểm hữu ích khác của `var` được nhìn thấy với các khai báo bên trong các blocks không chủ ý (unintended blocks). Các blocks không chủ ý là các blocks được tạo ra bởi vì cú pháp yêu cầu một block, nhưng nơi mục đích của nhà phát triển không thực sự là tạo ra một scope được bản địa hóa. Minh họa tốt nhất về scope không chủ ý là câu lệnh `try..catch`:

```js
function getStudents() {
  try {
    // không thực sự là một block scope
    var records = fromCache("students");
  } catch (err) {
    // oops, dự phòng về một mặc định
    var records = [];
  }
  // ..
}
```

Có những cách khác để cấu trúc code này, có. Nhưng tôi nghĩ đây là cách _tốt nhất_, dựa trên các sự đánh đổi khác nhau.

Tôi không muốn khai báo `records` (với `var` hoặc `let`) bên ngoài block `try`, và sau đó gán cho nó trong một hoặc cả hai blocks. Tôi thích các khai báo ban đầu luôn ở càng gần càng tốt (lý tưởng là cùng dòng) với lần sử dụng đầu tiên của biến. Trong ví dụ đơn giản này, khoảng cách đó chỉ là một vài dòng, nhưng trong code thực tế nó có thể phát triển thành nhiều dòng hơn nữa. Khoảng cách càng lớn, càng khó để tìm ra biến nào từ scope nào bạn đang gán cho. `var` được sử dụng tại phép gán thực tế làm cho nó bớt mơ hồ hơn.

Cũng lưu ý tôi đã sử dụng `var` trong cả hai blocks `try` và `catch`. Đó là vì tôi muốn báo hiệu cho người đọc rằng bất kể con đường nào được thực hiện, `records` luôn được khai báo. Về mặt kỹ thuật, điều đó hoạt động vì `var` được hoisted một lần lên function scope. Nhưng nó vẫn là một tín hiệu ngữ nghĩa tốt để nhắc nhở người đọc `var` đảm bảo điều gì. Nếu `var` chỉ được sử dụng trong một trong các blocks, và bạn chỉ đang đọc block kia, bạn sẽ không dễ dàng khám phá ra `records` đến từ đâu.

Đây là, theo ý kiến của tôi, một siêu năng lực nhỏ của `var`. Nó không chỉ có thể thoát khỏi các blocks `try..catch` không chủ ý, mà nó còn được phép xuất hiện nhiều lần trong scope của một hàm. Bạn không thể làm điều đó với `let`. Nó không tệ, nó thực sự là một tính năng hữu ích nhỏ. Hãy nghĩ về `var` giống như một chú thích khai báo nhắc nhở bạn, mỗi lần sử dụng, biến đến từ đâu. "À ha, đúng rồi, nó thuộc về toàn bộ hàm."

Siêu năng lực chú thích lặp lại này hữu ích trong các trường hợp khác:

```js
function getStudents() {
  var data = [];

  // làm gì đó với data
  // .. 50 dòng code nữa ..

  // hoàn toàn là một chú thích để nhắc nhở chúng ta
  var data;

  // sử dụng data lần nữa
  // ..
}
```

`var data` thứ hai không phải là khai báo lại `data`, nó chỉ đang chú thích cho lợi ích của người đọc rằng `data` là một khai báo toàn hàm. Bằng cách đó, người đọc không cần phải cuộn lên 50+ dòng code để tìm khai báo ban đầu.

Tôi hoàn toàn ổn với việc sử dụng lại các biến cho nhiều mục đích trong suốt một function scope. Tôi cũng hoàn toàn ổn với việc có hai lần sử dụng của một biến được tách biệt bởi khá nhiều dòng code. Trong cả hai trường hợp, khả năng "khai báo lại" (chú thích) một cách an toàn với `var` giúp đảm bảo tôi có thể biết `data` của tôi đến từ đâu, bất kể tôi đang ở đâu trong hàm.

Một lần nữa, đáng buồn thay, `let` không thể làm điều này.

Có những sắc thái và kịch bản khác khi `var` hóa ra cung cấp một số sự hỗ trợ, nhưng tôi sẽ không bàn thêm về điểm này nữa. Bài học rút ra là `var` có thể hữu ích trong các chương trình của chúng ta cùng với `let` (và thỉnh thoảng là `const`). Bạn có sẵn sàng sử dụng một cách sáng tạo các công cụ mà ngôn ngữ JS cung cấp để kể một câu chuyện phong phú hơn cho độc giả của bạn không?

Đừng chỉ vứt bỏ một công cụ hữu ích như `var` vì ai đó đã xấu hổ bạn nghĩ rằng nó không còn hay ho nữa. Đừng tránh `var` vì bạn đã từng bối rối một lần cách đây nhiều năm. Học các công cụ này và sử dụng chúng mỗi cái cho những gì chúng giỏi nhất.

---
