"use client";

import {
  Glossary,
  GlossaryTermTooltip,
  InteractiveDemo,
  Quiz,
} from "@/components/mdx";
import { GlossaryTerm } from "@/types/content";
import { QuizQuestion } from "@/components/mdx/Quiz";

export default function TestInteractiveComponentsPage() {
  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "Closure",
      definition: {
        en: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
        vi: "Closure là một hàm có quyền truy cập vào các biến trong phạm vi từ vựng bên ngoài (enclosing), ngay cả sau khi hàm bên ngoài đã trả về.",
      },
    },
    {
      term: "Hoisting",
      definition: {
        en: "JavaScript's default behavior of moving declarations to the top of the current scope.",
        vi: "Hành vi mặc định của JavaScript là di chuyển các khai báo lên đầu phạm vi hiện tại.",
      },
    },
    {
      term: "Event Loop",
      definition: {
        en: "The mechanism that handles asynchronous operations in JavaScript by continuously checking the call stack and callback queue.",
        vi: "Cơ chế xử lý các hoạt động bất đồng bộ trong JavaScript bằng cách liên tục kiểm tra call stack và callback queue.",
      },
    },
    {
      term: "Promise",
      definition: {
        en: "An object representing the eventual completion or failure of an asynchronous operation.",
        vi: "Một đối tượng đại diện cho sự hoàn thành hoặc thất bại cuối cùng của một hoạt động bất đồng bộ.",
      },
    },
    {
      term: "Prototype",
      definition: {
        en: "An object from which other objects inherit properties and methods in JavaScript.",
        vi: "Một đối tượng mà từ đó các đối tượng khác kế thừa thuộc tính và phương thức trong JavaScript.",
      },
    },
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: "q1",
      type: "multiple-choice",
      question: {
        en: "What is a closure in JavaScript?",
        vi: "Closure trong JavaScript là gì?",
      },
      options: {
        en: [
          "A function that returns another function",
          "A function that has access to variables in its outer scope",
          "A function that is immediately invoked",
          "A function that uses the this keyword",
        ],
        vi: [
          "Một hàm trả về một hàm khác",
          "Một hàm có quyền truy cập vào các biến trong phạm vi bên ngoài",
          "Một hàm được gọi ngay lập tức",
          "Một hàm sử dụng từ khóa this",
        ],
      },
      correctAnswer: 1,
      explanation: {
        en: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
        vi: "Closure là một hàm có quyền truy cập vào các biến trong phạm vi từ vựng bên ngoài, ngay cả sau khi hàm bên ngoài đã trả về.",
      },
    },
    {
      id: "q2",
      type: "true-false",
      question: {
        en: "JavaScript is a single-threaded language.",
        vi: "JavaScript là ngôn ngữ đơn luồng.",
      },
      correctAnswer: "true",
      explanation: {
        en: "JavaScript is indeed single-threaded, meaning it can only execute one piece of code at a time. However, it can handle asynchronous operations through the event loop.",
        vi: "JavaScript thực sự là đơn luồng, có nghĩa là nó chỉ có thể thực thi một đoạn mã tại một thời điểm. Tuy nhiên, nó có thể xử lý các hoạt động bất đồng bộ thông qua event loop.",
      },
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: {
        en: "Which of the following is NOT a primitive data type in JavaScript?",
        vi: "Kiểu dữ liệu nào sau đây KHÔNG phải là kiểu dữ liệu nguyên thủy trong JavaScript?",
      },
      options: {
        en: ["String", "Number", "Object", "Boolean"],
        vi: ["String", "Number", "Object", "Boolean"],
      },
      correctAnswer: 2,
      explanation: {
        en: "Object is not a primitive data type. The primitive types in JavaScript are: string, number, bigint, boolean, undefined, symbol, and null.",
        vi: "Object không phải là kiểu dữ liệu nguyên thủy. Các kiểu nguyên thủy trong JavaScript là: string, number, bigint, boolean, undefined, symbol, và null.",
      },
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Interactive MDX Components Test</h1>

      {/* Glossary Component */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Glossary Component</h2>
        <p>Full glossary with search and expandable terms:</p>
        <Glossary terms={glossaryTerms} locale="en" />

        <h3 style={{ marginTop: "2rem" }}>Inline Glossary Terms</h3>
        <p>
          In JavaScript, understanding{" "}
          <GlossaryTermTooltip
            term="Closure"
            definition={glossaryTerms[0].definition}
            locale="en"
          />{" "}
          and{" "}
          <GlossaryTermTooltip
            term="Hoisting"
            definition={glossaryTerms[1].definition}
            locale="en"
          />{" "}
          is essential for mastering the language.
        </p>
      </section>

      {/* Interactive Demo - Sorting */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Interactive Demo - Bubble Sort</h2>
        <InteractiveDemo
          type="sorting"
          title="Bubble Sort Visualization"
          description="Watch how bubble sort compares and swaps elements to sort an array"
          locale="en"
          initialData={[64, 34, 25, 12, 22, 11, 90]}
        />
      </section>

      {/* Interactive Demo - Stack */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Interactive Demo - Stack</h2>
        <InteractiveDemo
          type="stack"
          title="Stack Data Structure"
          description="Visualize push and pop operations on a stack (LIFO)"
          locale="en"
          initialData={[10, 20, 30, 40]}
        />
      </section>

      {/* Interactive Demo - Queue */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Interactive Demo - Queue</h2>
        <InteractiveDemo
          type="queue"
          title="Queue Data Structure"
          description="Visualize enqueue and dequeue operations on a queue (FIFO)"
          locale="en"
          initialData={[10, 20, 30, 40]}
        />
      </section>

      {/* Interactive Demo - Tree */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Interactive Demo - Binary Search Tree</h2>
        <InteractiveDemo
          type="tree"
          title="Binary Search Tree"
          description="Watch how elements are inserted into a binary search tree"
          locale="en"
          initialData={[50, 30, 70, 20, 40, 60, 80]}
        />
      </section>

      {/* Interactive Demo - Linked List */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Interactive Demo - Linked List</h2>
        <InteractiveDemo
          type="linked-list"
          title="Linked List"
          description="Visualize how nodes are added to a linked list"
          locale="en"
          initialData={[10, 20, 30, 40, 50]}
        />
      </section>

      {/* Quiz Component */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Quiz Component</h2>
        <Quiz
          id="javascript-basics-quiz"
          questions={quizQuestions}
          locale="en"
          passingScore={70}
          onComplete={(score, passed) => {
            console.log(`Quiz completed! Score: ${score}%, Passed: ${passed}`);
          }}
        />
      </section>

      {/* Vietnamese Version */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Vietnamese Version - Phiên bản Tiếng Việt</h2>
        <h3>Glossary - Thuật ngữ</h3>
        <Glossary terms={glossaryTerms} locale="vi" />

        <h3 style={{ marginTop: "2rem" }}>Quiz - Câu hỏi</h3>
        <Quiz
          id="javascript-basics-quiz-vi"
          questions={quizQuestions}
          locale="vi"
          passingScore={70}
        />
      </section>
    </div>
  );
}
