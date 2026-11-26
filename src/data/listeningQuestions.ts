import { ExamYear, Question } from '../types';

interface RawListeningMC {
  year: ExamYear;
  topic: string;
  audioText: string;
  prompt: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

interface RawListeningFill {
  year: ExamYear;
  topic: string;
  audioText: string;
  prompt: string;
  hint: string;
  answer: string;
  explanation: string;
}

const RAW_LISTENING_MC: RawListeningMC[] = [
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Đi biển',
    audioText: "We're going to the beach with my friend today. I'm going to take my doll. Her name is Carrie. We've got sandwiches, cheese, carrots and cherries for our picnic.",
    prompt: 'Listen and choose: Where are they going today?',
    options: ['To the mountains', 'To the beach', 'To the zoo', 'To the cinema'],
    answerIndex: 1,
    explanation: 'Trong bài nghe có câu: "We\'re going to the beach with my friend today."'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Đi biển',
    audioText: "I'm going to take my doll to the beach. Her name is Carrie. She wears a pretty pink dress.",
    prompt: 'Listen and choose: What is the name of her doll?',
    options: ['Carrie', 'Cherry', 'Cassie', 'Mary'],
    answerIndex: 0,
    explanation: 'Trong bài nghe nói rõ: "Her name is Carrie."'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Thời tiết',
    audioText: "Hello! Here is the weather forecast for tomorrow. In Ha Noi, it will be cold and windy. In Ho Chi Minh City, it will be hot and sunny.",
    prompt: 'Listen and choose: What will the weather be like in Ha Noi tomorrow?',
    options: ['Hot and sunny', 'Warm and rainy', 'Cold and windy', 'Cool and foggy'],
    answerIndex: 2,
    explanation: 'Bài nghe: "In Ha Noi, it will be cold and windy."'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Nghề nghiệp',
    audioText: "Hi, I'm Phong. I love designing beautiful houses and bridges. In the future, I would like to be an architect.",
    prompt: 'Listen and choose: What would Phong like to be in the future?',
    options: ['A pilot', 'A doctor', 'An architect', 'A writer'],
    answerIndex: 2,
    explanation: 'Phong nói: "In the future, I would like to be an architect."'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Sức khỏe',
    audioText: "Nam didn't go to school yesterday because he had a bad toothache. He went to see the dentist with his mother.",
    prompt: 'Listen and choose: Why didn\'t Nam go to school yesterday?',
    options: ['He had a fever', 'He had a toothache', 'He had a stomachache', 'He had a sore throat'],
    answerIndex: 1,
    explanation: 'Bài nghe: "because he had a bad toothache."'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Môn học',
    audioText: "My favourite subject is English. I have English four times a week, on Monday, Tuesday, Thursday and Friday.",
    prompt: 'Listen and choose: How often does the speaker have English?',
    options: ['Once a week', 'Twice a week', 'Three times a week', 'Four times a week'],
    answerIndex: 3,
    explanation: 'Bài nghe: "I have English four times a week."'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - Du lịch',
    audioText: "Last summer holiday, my family went to Da Nang by plane. We stayed in a hotel near My Khe Beach and ate delicious seafood.",
    prompt: 'Listen and choose: How did the family go to Da Nang?',
    options: ['By train', 'By car', 'By plane', 'By coach'],
    answerIndex: 2,
    explanation: 'Bài nghe: "my family went to Da Nang by plane."'
  },
  {
    year: '2023-2024',
    topic: 'Nghe hiểu - Sở thú',
    audioText: "Yesterday, Quan went to the zoo with his classmates. He saw tigers, monkeys and peacocks. The monkeys jumped up and down quickly.",
    prompt: 'Listen and choose: What did the monkeys do at the zoo?',
    options: ['They slept quietly', 'They jumped up and down quickly', 'They roared loudly', 'They danced beautifully'],
    answerIndex: 1,
    explanation: 'Bài nghe: "The monkeys jumped up and down quickly."'
  },
  {
    year: '2023-2024',
    topic: 'Nghe hiểu - Chỉ đường',
    audioText: "Excuse me, where is the museum? Go straight ahead for two minutes, then turn left at the traffic lights. The museum is on your right.",
    prompt: 'Listen and choose: Where should you turn left?',
    options: ['At the corner', 'At the traffic lights', 'At the bus stop', 'At the bakery'],
    answerIndex: 1,
    explanation: 'Bài nghe: "then turn left at the traffic lights."'
  },
  {
    year: '2023-2024',
    topic: 'Nghe hiểu - Thời gian rảnh',
    audioText: "In my free time, I usually ride my bike in the park with my brother. Sometimes I play chess with my grandfather.",
    prompt: 'Listen and choose: What does the speaker usually do in free time?',
    options: ['Play football', 'Ride a bike in the park', 'Go swimming', 'Read comic books'],
    answerIndex: 1,
    explanation: 'Bài nghe: "I usually ride my bike in the park with my brother."'
  },
  {
    year: '2023-2024',
    topic: 'Nghe hiểu - Ăn uống',
    audioText: "For lunch, Mai eats two bowls of rice, some fish and vegetables. She drinks a glass of orange juice every day.",
    prompt: 'Listen and choose: How much rice does Mai eat for lunch?',
    options: ['One bowl', 'Two bowls', 'Three bowls', 'Four bowls'],
    answerIndex: 1,
    explanation: 'Bài nghe: "Mai eats two bowls of rice."'
  },
  {
    year: '2023-2024',
    topic: 'Nghe hiểu - Sự kiện trường',
    audioText: "Sports Day will be on Saturday next week. Tony is going to play table tennis and Peter is going to play basketball.",
    prompt: 'Listen and choose: What is Tony going to play on Sports Day?',
    options: ['Football', 'Basketball', 'Table tennis', 'Badminton'],
    answerIndex: 2,
    explanation: 'Bài nghe: "Tony is going to play table tennis."'
  },
  {
    year: '2023-2024',
    topic: 'Nghe hiểu - Truyện cổ tích',
    audioText: "I'm reading The Story of Mai An Tiem. He was very hard-working and clever. He grew delicious watermelons on an island.",
    prompt: 'Listen and choose: What did Mai An Tiem grow on the island?',
    options: ['Apples', 'Bananas', 'Watermelons', 'Oranges'],
    answerIndex: 2,
    explanation: 'Bài nghe: "He grew delicious watermelons on an island."'
  },
  {
    year: '2022-2023',
    topic: 'Nghe hiểu - Mùa trong năm',
    audioText: "My favourite season is autumn because the weather is cool and nice. The leaves turn yellow and red.",
    prompt: 'Listen and choose: Why does the speaker like autumn?',
    options: ['Because it is snowy', 'Because it is cool and nice', 'Because it is very hot', 'Because it is rainy'],
    answerIndex: 1,
    explanation: 'Bài nghe: "because the weather is cool and nice."'
  },
  {
    year: '2022-2023',
    topic: 'Nghe hiểu - Địa chỉ',
    audioText: "Hello, my name is Trung. I live at 81 Tran Hung Dao Street in Ha Noi. My flat is on the second floor of Ha Noi Tower.",
    prompt: 'Listen and choose: Which floor is Trung\'s flat on?',
    options: ['The first floor', 'The second floor', 'The third floor', 'The fifth floor'],
    answerIndex: 1,
    explanation: 'Bài nghe: "My flat is on the second floor of Ha Noi Tower."'
  },
  {
    year: '2022-2023',
    topic: 'Nghe hiểu - Quê hương',
    audioText: "My hometown is a small village in Thai Binh province. It is quiet and peaceful, with green rice fields.",
    prompt: 'Listen and choose: What is the speaker\'s hometown like?',
    options: ['Big and busy', 'Noisy and crowded', 'Quiet and peaceful', 'Modern and large'],
    answerIndex: 2,
    explanation: 'Bài nghe: "It is quiet and peaceful."'
  },
  {
    year: '2022-2023',
    topic: 'Nghe hiểu - Sinh nhật',
    audioText: "We went to Hoa's birthday party last Sunday. We ate birthday cake, sang Happy Birthday and played hide-and-seek.",
    prompt: 'Listen and choose: When was Hoa\'s birthday party?',
    options: ['Last Friday', 'Last Saturday', 'Last Sunday', 'Yesterday'],
    answerIndex: 2,
    explanation: 'Bài nghe: "last Sunday."'
  },
  {
    year: '2022-2023',
    topic: 'Nghe hiểu - Học tiếng Anh',
    audioText: "Akiko practises reading English by reading short stories every evening. She writes new words in her notebook.",
    prompt: 'Listen and choose: How does Akiko practise reading English?',
    options: ['By watching TV', 'By reading short stories', 'By singing songs', 'By talking to friends'],
    answerIndex: 1,
    explanation: 'Bài nghe: "by reading short stories every evening."'
  },
  {
    year: '2022-2023',
    topic: 'Nghe hiểu - Lễ hội',
    audioText: "Teachers' Day in Viet Nam is on the twentieth of November. Students give flowers and cards to their teachers.",
    prompt: 'Listen and choose: When is Teachers\' Day in Viet Nam?',
    options: ['November 10th', 'November 20th', 'December 20th', 'October 20th'],
    answerIndex: 1,
    explanation: 'Bài nghe: "on the twentieth of November" (20/11).'
  },
  {
    year: '2024-2025',
    topic: 'Nghe hiểu - An toàn',
    audioText: "Peter, don't run down the stairs! You may fall and break your leg.",
    prompt: 'Listen and choose: What shouldn\'t Peter do?',
    options: ['Climb the tree', 'Play with matches', 'Run down the stairs', 'Ride a bike too fast'],
    answerIndex: 2,
    explanation: 'Bài nghe: "don\'t run down the stairs!"'
  },
];

const RAW_LISTENING_FILL: RawListeningFill[] = [
  {
    year: '2024-2025',
    topic: 'Nghe và điền từ',
    audioText: 'My name is Linda. Tomorrow, I will visit my grandparents in the countryside.',
    prompt: 'Listen and fill in the blank: Linda will visit her grandparents in the ________.',
    hint: '1 từ (11 chữ cái)',
    answer: 'countryside',
    explanation: 'Bài nghe: "in the countryside" (vùng nông thôn).'
  },
  {
    year: '2024-2025',
    topic: 'Nghe và điền từ',
    audioText: 'Her grandparents live in a small house near a big river.',
    prompt: 'Listen and fill in the blank: Her grandparents live in a small house near a big ________.',
    hint: '1 từ (5 chữ cái)',
    answer: 'river',
    explanation: 'Bài nghe: "near a big river" (gần một con sông lớn).'
  },
  {
    year: '2024-2025',
    topic: 'Nghe và điền từ',
    audioText: 'In the morning, I will help my grandfather feed the chickens.',
    prompt: 'Listen and fill in the blank: In the morning, she will help her grandfather feed the ________.',
    hint: '1 từ (8 chữ cái)',
    answer: 'chickens',
    explanation: 'Bài nghe: "feed the chickens" (cho gà ăn).'
  },
  {
    year: '2024-2025',
    topic: 'Nghe và điền từ',
    audioText: 'My brother gets up at six o\'clock and brushes his teeth.',
    prompt: 'Listen and fill in the blank: My brother gets up at ________ o\'clock.',
    hint: 'Điền số bằng chữ (3 chữ cái)',
    answer: 'six|6',
    explanation: 'Bài nghe: "at six o\'clock" (6 giờ).'
  },
  {
    year: '2024-2025',
    topic: 'Nghe và điền từ',
    audioText: 'I would like to visit Phu Quoc Island this summer.',
    prompt: 'Listen and fill in the blank: I would like to visit Phu Quoc ________ this summer.',
    hint: '1 từ (6 chữ cái)',
    answer: 'Island',
    explanation: 'Bài nghe: "Phu Quoc Island" (Đảo Phú Quốc).'
  },
  {
    year: '2023-2024',
    topic: 'Nghe và điền từ',
    audioText: 'The library is between the supermarket and the cinema.',
    prompt: 'Listen and fill in the blank: The ________ is between the supermarket and the cinema.',
    hint: '1 từ (7 chữ cái)',
    answer: 'library',
    explanation: 'Bài nghe: "The library is between..." (Thư viện).'
  },
  {
    year: '2023-2024',
    topic: 'Nghe và điền từ',
    audioText: 'My favourite animal at the zoo is the elephant.',
    prompt: 'Listen and fill in the blank: My favourite animal at the zoo is the ________.',
    hint: '1 từ (8 chữ cái)',
    answer: 'elephant',
    explanation: 'Bài nghe: "the elephant" (con voi).'
  },
  {
    year: '2023-2024',
    topic: 'Nghe và điền từ',
    audioText: 'You shouldn\'t carry heavy things when you have a backache.',
    prompt: 'Listen and fill in the blank: You shouldn\'t carry heavy things when you have a ________.',
    hint: '1 từ (8 chữ cái)',
    answer: 'backache',
    explanation: 'Bài nghe: "a backache" (đau lưng).'
  },
  {
    year: '2023-2024',
    topic: 'Nghe và điền từ',
    audioText: 'We are going to build sandcastles on the beach tomorrow.',
    prompt: 'Listen and fill in the blank: We are going to build ________ on the beach tomorrow.',
    hint: '1 từ (11 chữ cái)',
    answer: 'sandcastles',
    explanation: 'Bài nghe: "build sandcastles" (xây lâu đài cát).'
  },
  {
    year: '2023-2024',
    topic: 'Nghe và điền từ',
    audioText: 'My father is a farmer. He works in a big field.',
    prompt: 'Listen and fill in the blank: My father is a ________. He works in a big field.',
    hint: '1 từ (6 chữ cái)',
    answer: 'farmer',
    explanation: 'Bài nghe: "a farmer" (nông dân).'
  },
  {
    year: '2022-2023',
    topic: 'Nghe và điền từ',
    audioText: 'I always do my homework after dinner.',
    prompt: 'Listen and fill in the blank: I always do my ________ after dinner.',
    hint: '1 từ (8 chữ cái)',
    answer: 'homework',
    explanation: 'Bài nghe: "do my homework" (làm bài tập về nhà).'
  },
  {
    year: '2022-2023',
    topic: 'Nghe và điền từ',
    audioText: 'In winter, it is very cold and snowy in London.',
    prompt: 'Listen and fill in the blank: In ________, it is very cold and snowy in London.',
    hint: '1 từ (6 chữ cái)',
    answer: 'winter',
    explanation: 'Bài nghe: "In winter" (vào mùa đông).'
  },
  {
    year: '2022-2023',
    topic: 'Nghe và điền từ',
    audioText: 'Please turn right at the next corner.',
    prompt: 'Listen and fill in the blank: Please turn ________ at the next corner.',
    hint: '1 từ (5 chữ cái)',
    answer: 'right',
    explanation: 'Bài nghe: "turn right" (rẽ phải).'
  },
  {
    year: '2022-2023',
    topic: 'Nghe và điền từ',
    audioText: 'My mother bought a packet of biscuits at the shop.',
    prompt: 'Listen and fill in the blank: My mother bought a packet of ________ at the shop.',
    hint: '1 từ (8 chữ cái)',
    answer: 'biscuits',
    explanation: 'Bài nghe: "a packet of biscuits" (một gói bánh quy).'
  },
  {
    year: '2022-2023',
    topic: 'Nghe và điền từ',
    audioText: 'English is an international language around the world.',
    prompt: 'Listen and fill in the blank: ________ is an international language around the world.',
    hint: '1 từ (7 chữ cái)',
    answer: 'English',
    explanation: 'Bài nghe: "English" (Tiếng Anh).'
  },
];

export const LISTENING_QUESTIONS: Question[] = [
  ...RAW_LISTENING_MC.map((item, idx) => ({
    id: `lmc_${idx + 1}`,
    type: 'listening_mc' as const,
    year: item.year,
    topic: item.topic,
    audioText: item.audioText,
    audioUrl: `./audio/lmc_${idx + 1}.mp3`,
    prompt: item.prompt,
    options: item.options,
    answer: item.options[item.answerIndex],
    explanation: item.explanation,
  })),
  ...RAW_LISTENING_FILL.map((item, idx) => ({
    id: `lfill_${idx + 1}`,
    type: 'listening_fill' as const,
    year: item.year,
    topic: item.topic,
    audioText: item.audioText,
    audioUrl: `./audio/lfill_${idx + 1}.mp3`,
    prompt: item.prompt,
    hint: item.hint,
    answer: item.answer,
    explanation: item.explanation,
  })),
];
