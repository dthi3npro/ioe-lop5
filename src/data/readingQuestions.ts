import { ExamYear, Question } from '../types';

interface RawReading {
  year: ExamYear;
  topic: string;
  passage: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const PASSAGE_1 =
  'Hello! My name is Minh. I am a student in class 5A at Nguyen Trai Primary School. Every day, I get up at 6:00 a.m., do morning exercise, and have breakfast with my family. I walk to school because my house is near the school. My favourite subject is English because I love talking with foreign friends. After school, I often play badminton with my classmates.';

const PASSAGE_2 =
  'Last summer, Mai and her family went to Ha Long Bay for three days. They went there by car. On the first day, they swam in the sea and built sandcastles on the beach. On the second day, they took a boat trip around the bay and explored beautiful caves. They also ate a lot of delicious seafood. Mai bought some keychains for her best friends. It was a wonderful trip!';

const PASSAGE_3 =
  'There are four seasons in the north of Viet Nam: spring, summer, autumn and winter. Spring is warm and there are many flowers. Summer is very hot and sunny, so children love going swimming. Autumn is cool and windy. Winter is cold and sometimes rainy. Lan likes spring best because Tet Holiday is in spring and she gets lucky money from her grandparents.';

const PASSAGE_4 =
  'Yesterday, Phong stayed at home because he had a fever and a sore throat. His mother took him to the doctor in the morning. The doctor checked him and gave him some medicine. The doctor told Phong to drink warm water, take a rest, and not to eat ice cream. Today, Phong feels much better and he hopes to go back to school tomorrow.';

const PASSAGE_5 =
  'Tom is from Australia, but now he lives in Da Nang with his parents. His father is an engineer and his mother is a teacher at an international school. On weekends, Tom likes visiting Marble Mountains or riding his bike along the Han River. He thinks Da Nang is a clean, modern and friendly city. In the future, Tom wants to become a tour guide.';

const RAW_READING: RawReading[] = [
  // Passage 1 (2024-2025)
  {
    year: '2024-2025', topic: 'Đọc hiểu - Trường học', passage: PASSAGE_1,
    prompt: 'How does Minh go to school every day?',
    options: ['By bike', 'By bus', 'On foot', 'By car'],
    answerIndex: 2,
    explanation: 'Trong bài: "I walk to school" (đi bộ = on foot).'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - Trường học', passage: PASSAGE_1,
    prompt: 'Why does Minh like English?',
    options: ['Because it is easy', 'Because he loves talking with foreign friends', 'Because his teacher is kind', 'Because he likes singing'],
    answerIndex: 1,
    explanation: 'Trong bài: "because I love talking with foreign friends."'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - True/False', passage: PASSAGE_1,
    prompt: 'True or False: Minh gets up at 6:30 a.m. every day.',
    options: ['True', 'False'],
    answerIndex: 1,
    explanation: 'Sai (False) vì trong bài Minh thức dậy lúc 6:00 a.m.'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - True/False', passage: PASSAGE_1,
    prompt: 'True or False: After school, Minh often plays badminton with his classmates.',
    options: ['True', 'False'],
    answerIndex: 0,
    explanation: 'Đúng (True) - câu cuối của đoạn văn.'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - Trường học', passage: PASSAGE_1,
    prompt: 'Which class is Minh in?',
    options: ['Class 5A', 'Class 5B', 'Class 5C', 'Class 4A'],
    answerIndex: 0,
    explanation: 'Trong bài: "I am a student in class 5A".'
  },

  // Passage 2 (2024-2025)
  {
    year: '2024-2025', topic: 'Đọc hiểu - Du lịch', passage: PASSAGE_2,
    prompt: 'How long did Mai\'s family stay in Ha Long Bay?',
    options: ['Two days', 'Three days', 'Four days', 'A week'],
    answerIndex: 1,
    explanation: 'Trong bài: "went to Ha Long Bay for three days."'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - Du lịch', passage: PASSAGE_2,
    prompt: 'What did they do on the second day?',
    options: ['Built sandcastles', 'Visited a museum', 'Took a boat trip and explored caves', 'Went shopping'],
    answerIndex: 2,
    explanation: 'Trong bài: "On the second day, they took a boat trip around the bay and explored beautiful caves."'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - True/False', passage: PASSAGE_2,
    prompt: 'True or False: Mai and her family went to Ha Long Bay by train.',
    options: ['True', 'False'],
    answerIndex: 1,
    explanation: 'Sai (False) vì họ đi bằng ô tô ("by car").'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - Du lịch', passage: PASSAGE_2,
    prompt: 'What did Mai buy for her best friends?',
    options: ['Seafood', 'T-shirts', 'Keychains', 'Postcards'],
    answerIndex: 2,
    explanation: 'Trong bài: "Mai bought some keychains for her best friends."'
  },
  {
    year: '2024-2025', topic: 'Đọc hiểu - True/False', passage: PASSAGE_2,
    prompt: 'True or False: They ate a lot of delicious seafood.',
    options: ['True', 'False'],
    answerIndex: 0,
    explanation: 'Đúng (True) - có nêu rõ trong bài.'
  },

  // Passage 3 (2023-2024)
  {
    year: '2023-2024', topic: 'Đọc hiểu - Thời tiết', passage: PASSAGE_3,
    prompt: 'How many seasons are there in the north of Viet Nam?',
    options: ['Two', 'Three', 'Four', 'Five'],
    answerIndex: 2,
    explanation: 'Trong bài: "There are four seasons in the north of Viet Nam."'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - Thời tiết', passage: PASSAGE_3,
    prompt: 'What is autumn like in the north of Viet Nam?',
    options: ['Hot and sunny', 'Cool and windy', 'Cold and rainy', 'Warm and dry'],
    answerIndex: 1,
    explanation: 'Trong bài: "Autumn is cool and windy."'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - Thời tiết', passage: PASSAGE_3,
    prompt: 'Which season does Lan like best?',
    options: ['Spring', 'Summer', 'Autumn', 'Winter'],
    answerIndex: 0,
    explanation: 'Trong bài: "Lan likes spring best".'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - True/False', passage: PASSAGE_3,
    prompt: 'True or False: Children love going swimming in winter.',
    options: ['True', 'False'],
    answerIndex: 1,
    explanation: 'Sai (False) vì trẻ em thích đi bơi vào mùa hè ("Summer").'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - True/False', passage: PASSAGE_3,
    prompt: 'True or False: Lan gets lucky money from her grandparents at Tet.',
    options: ['True', 'False'],
    answerIndex: 0,
    explanation: 'Đúng (True) - câu cuối đoạn văn.'
  },

  // Passage 4 (2023-2024)
  {
    year: '2023-2024', topic: 'Đọc hiểu - Sức khỏe', passage: PASSAGE_4,
    prompt: 'What was the matter with Phong yesterday?',
    options: ['A toothache', 'A stomachache', 'A fever and a sore throat', 'A backache'],
    answerIndex: 2,
    explanation: 'Trong bài: "he had a fever and a sore throat."'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - Sức khỏe', passage: PASSAGE_4,
    prompt: 'Who took Phong to the doctor?',
    options: ['His father', 'His mother', 'His sister', 'His teacher'],
    answerIndex: 1,
    explanation: 'Trong bài: "His mother took him to the doctor".'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - Sức khỏe', passage: PASSAGE_4,
    prompt: 'What did the doctor tell Phong NOT to eat?',
    options: ['Warm soup', 'Fruit', 'Ice cream', 'Rice'],
    answerIndex: 2,
    explanation: 'Trong bài: "and not to eat ice cream."'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - True/False', passage: PASSAGE_4,
    prompt: 'True or False: Phong went to school yesterday.',
    options: ['True', 'False'],
    answerIndex: 1,
    explanation: 'Sai (False) vì hôm qua Phong ở nhà ("stayed at home").'
  },
  {
    year: '2023-2024', topic: 'Đọc hiểu - True/False', passage: PASSAGE_4,
    prompt: 'True or False: Today Phong feels much better.',
    options: ['True', 'False'],
    answerIndex: 0,
    explanation: 'Đúng (True) - "Today, Phong feels much better".'
  },

  // Passage 5 (2022-2023)
  {
    year: '2022-2023', topic: 'Đọc hiểu - Bạn bè', passage: PASSAGE_5,
    prompt: 'Where is Tom from?',
    options: ['England', 'America', 'Australia', 'Viet Nam'],
    answerIndex: 2,
    explanation: 'Trong bài: "Tom is from Australia".'
  },
  {
    year: '2022-2023', topic: 'Đọc hiểu - Bạn bè', passage: PASSAGE_5,
    prompt: 'What does Tom\'s father do?',
    options: ['A teacher', 'An engineer', 'A tour guide', 'A doctor'],
    answerIndex: 1,
    explanation: 'Trong bài: "His father is an engineer".'
  },
  {
    year: '2022-2023', topic: 'Đọc hiểu - Bạn bè', passage: PASSAGE_5,
    prompt: 'What does Tom want to be in the future?',
    options: ['A pilot', 'An architect', 'A tour guide', 'A singer'],
    answerIndex: 2,
    explanation: 'Trong bài: "In the future, Tom wants to become a tour guide."'
  },
  {
    year: '2022-2023', topic: 'Đọc hiểu - True/False', passage: PASSAGE_5,
    prompt: 'True or False: Tom\'s mother works at a hospital.',
    options: ['True', 'False'],
    answerIndex: 1,
    explanation: 'Sai (False) vì mẹ Tom là giáo viên ở trường quốc tế.'
  },
  {
    year: '2022-2023', topic: 'Đọc hiểu - True/False', passage: PASSAGE_5,
    prompt: 'True or False: Tom thinks Da Nang is a clean, modern and friendly city.',
    options: ['True', 'False'],
    answerIndex: 0,
    explanation: 'Đúng (True) - có nêu rõ trong bài.'
  },
];

export const READING_QUESTIONS: Question[] = RAW_READING.map((item, idx) => ({
  id: `read_${idx + 1}`,
  type: 'reading',
  year: item.year,
  topic: item.topic,
  passage: item.passage,
  prompt: item.prompt,
  options: item.options,
  answer: item.options[item.answerIndex],
  explanation: item.explanation,
}));
