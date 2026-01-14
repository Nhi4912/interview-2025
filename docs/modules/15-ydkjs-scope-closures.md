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
