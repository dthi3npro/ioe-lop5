import { ExamYear, Question } from '../types';

type RawReorder = [
  year: ExamYear,
  topic: string,
  words: string[],
  answer: string,
  explanation: string
];

const RAW_REORDER: RawReorder[] = [
  // === 2024-2025 ===
  [
    '2024-2025', 'Sắp xếp câu',
    ['What\'s', 'Bat Trang', 'Village', 'like?'],
    'What\'s Bat Trang Village like?',
    'Mẫu câu hỏi đặc điểm một nơi chốn: What\'s + địa điểm + like?'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['We', 'are', 'watching', 'a film', 'in', 'the movie', 'theatre.'],
    'We are watching a film in the movie theatre.',
    'Thì hiện tại tiếp diễn: S + am/is/are + V-ing + O + nơi chốn.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Our classroom', 'is', 'on', 'the', 'third', 'floor.'],
    'Our classroom is on the third floor.',
    'Giới từ "on" dùng với tầng lầu: on the third floor.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Do', 'you', 'know', 'Tom', 'and', 'Jerry?'],
    'Do you know Tom and Jerry?',
    'Câu hỏi Yes/No thì hiện tại đơn: Do + you + V nguyên mẫu?'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['My little sister', 'gets dressed', 'at 6 o\'clock', 'every morning.'],
    'My little sister gets dressed at 6 o\'clock every morning.',
    'Trật tự: Chủ ngữ + động từ + giờ giấc + trạng từ thời gian.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['How many', 'big hotels', 'are there', 'in', 'your city?'],
    'How many big hotels are there in your city?',
    'Câu hỏi số lượng: How many + danh từ số nhiều + are there + nơi chốn?'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['I don\'t', 'know how', 'you celebrated', 'your', 'birthday.'],
    'I don\'t know how you celebrated your birthday.',
    'Mệnh đề danh ngữ: I don\'t know how + S + V.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['The weather', 'was fine', 'enough for', 'us to', 'go camping.'],
    'The weather was fine enough for us to go camping.',
    'Cấu trúc: adj + enough + for sb + to V.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Our teacher', 'always', 'encourages us', 'to', 'work', 'hard.'],
    'Our teacher always encourages us to work hard.',
    'Cấu trúc: encourage somebody to do something (khuyến khích ai làm gì).'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Where', 'will', 'you', 'be', 'this', 'weekend?'],
    'Where will you be this weekend?',
    'Câu hỏi thì tương lai đơn: Where + will + S + be + thời gian?'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['I think', 'I\'ll', 'explore', 'the caves', 'in', 'Ha Long Bay.'],
    'I think I\'ll explore the caves in Ha Long Bay.',
    'Diễn tả dự đoán/kế hoạch: I think I\'ll + V nguyên mẫu.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['How often', 'do you', 'have', 'English', 'lessons?'],
    'How often do you have English lessons?',
    'Câu hỏi tần suất: How often + do/does + S + V?'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Why', 'do you', 'learn', 'English?'],
    'Why do you learn English?',
    'Hỏi lý do: Why + do/does + S + V?'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Because', 'I want', 'to read', 'English', 'comic books.'],
    'Because I want to read English comic books.',
    'Cấu trúc trả lời lý do: Because + S + want to + V.'
  ],
  [
    '2024-2025', 'Sắp xếp câu',
    ['Don\'t', 'climb', 'the tree', 'because', 'you may', 'fall.'],
    'Don\'t climb the tree because you may fall.',
    'Câu cảnh báo: Don\'t + V + because + S + may + V.'
  ],

  // === 2023-2024 ===
  [
    '2023-2024', 'Sắp xếp câu',
    ['My house', 'is', 'in', 'the', 'city.'],
    'My house is in the city.',
    'Câu miêu tả vị trí: S + is + in the city.'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['What', 'did you', 'see', 'at', 'the zoo?'],
    'What did you see at the zoo?',
    'Câu hỏi quá khứ đơn: What + did + S + V nguyên mẫu?'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['The peacocks', 'moved', 'beautifully', 'when', 'I was', 'there.'],
    'The peacocks moved beautifully when I was there.',
    'Trạng từ "beautifully" đứng sau động từ thường "moved".'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['When', 'will', 'Sports Day', 'be?'],
    'When will Sports Day be?',
    'Hỏi thời gian sự kiện tương lai: When + will + sự kiện + be?'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['What', 'would you', 'like', 'to be', 'in the', 'future?'],
    'What would you like to be in the future?',
    'Mẫu câu hỏi ước mơ nghề nghiệp lớp 5.'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['I\'d like', 'to be', 'a pilot', 'because', 'I want', 'to fly a plane.'],
    'I\'d like to be a pilot because I want to fly a plane.',
    'Trả lời về nghề nghiệp mơ ước kèm lý do.'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['How', 'can I', 'get to', 'the', 'bus stop?'],
    'How can I get to the bus stop?',
    'Mẫu câu hỏi đường: How can I get to + địa điểm?'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['Go straight', 'ahead', 'and', 'turn right', 'at the', 'corner.'],
    'Go straight ahead and turn right at the corner.',
    'Câu chỉ đường: Đi thẳng và rẽ phải ở góc đường.'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['What', 'do you', 'do', 'in your', 'free time?'],
    'What do you do in your free time?',
    'Hỏi hoạt động vào thời gian rảnh.'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['I often', 'surf', 'the Internet', 'and', 'watch', 'cartoons.'],
    'I often surf the Internet and watch cartoons.',
    'Trạng từ tần suất "often" đứng trước động từ thường "surf".'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['What\'s', 'the matter', 'with', 'your', 'brother?'],
    'What\'s the matter with your brother?',
    'Hỏi thăm sức khỏe của anh/em trai bạn.'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['He has', 'a fever', 'and', 'should', 'take a', 'rest.'],
    'He has a fever and should take a rest.',
    'Lời khuyên sức khỏe: should + V nguyên mẫu (take a rest).'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['How much', 'rice', 'do you', 'eat', 'every day?'],
    'How much rice do you eat every day?',
    '"rice" không đếm được nên dùng "How much rice".'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['I eat', 'three bowls', 'of rice', 'every', 'day.'],
    'I eat three bowls of rice every day.',
    'Cụm chỉ số lượng đồ ăn: three bowls of rice (3 bát cơm).'
  ],
  [
    '2023-2024', 'Sắp xếp câu',
    ['Which', 'place', 'would you', 'like to', 'visit?'],
    'Which place would you like to visit?',
    'Hỏi địa điểm muốn tham quan: Which place would you like to visit?'
  ],

  // === 2022-2023 ===
  [
    '2022-2023', 'Sắp xếp câu',
    ['What', 'will', 'the weather', 'be like', 'tomorrow?'],
    'What will the weather be like tomorrow?',
    'Hỏi dự báo thời tiết ngày mai.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['It will', 'be', 'cold', 'and', 'windy', 'tomorrow.'],
    'It will be cold and windy tomorrow.',
    'Trả lời dự báo thời tiết: It will be + tính từ.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['What\'s', 'summer', 'like', 'in', 'your country?'],
    'What\'s summer like in your country?',
    'Hỏi đặc điểm mùa hè ở đất nước bạn.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['Which one', 'is', 'bigger,', 'Ha Noi', 'or', 'Hue?'],
    'Which one is bigger, Ha Noi or Hue?',
    'Câu hỏi so sánh hơn giữa 2 địa danh.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['I think', 'Ha Noi', 'is', 'bigger', 'than', 'Hue.'],
    'I think Ha Noi is bigger than Hue.',
    'Câu trả lời so sánh hơn: S1 + is + adj-er + than + S2.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['My hometown', 'is', 'small', 'and', 'very', 'quiet.'],
    'My hometown is small and very quiet.',
    'Miêu tả quê hương: small and very quiet.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['Yesterday,', 'we went', 'to the', 'book fair', 'by', 'bus.'],
    'Yesterday, we went to the book fair by bus.',
    'Thì quá khứ đơn kết hợp phương tiện "by bus".'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['Did you', 'enjoy', 'the', 'party', 'last', 'night?'],
    'Did you enjoy the party last night?',
    'Câu hỏi Yes/No quá khứ đơn.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['She', 'always', 'brushes', 'her teeth', 'after', 'meals.'],
    'She always brushes her teeth after meals.',
    'Thói quen hằng ngày với "always".'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['How do', 'you', 'practise', 'listening', 'to', 'English?'],
    'How do you practise listening to English?',
    'Sau "practise" dùng V-ing (listening).'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['I watch', 'English', 'cartoons', 'on', 'TV.'],
    'I watch English cartoons on TV.',
    'Cụm từ: watch ... on TV.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['What', 'are you', 'reading,', 'Phong?'],
    'What are you reading, Phong?',
    'Thì hiện tại tiếp diễn: hỏi bạn đang đọc truyện gì.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['I\'m reading', 'The Fox', 'and', 'the', 'Crow.'],
    'I\'m reading The Fox and the Crow.',
    'Tên truyện ngụ ngôn quen thuộc lớp 5: Con cáo và con quạ.'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['The', 'post office', 'is', 'opposite', 'the', 'supermarket.'],
    'The post office is opposite the supermarket.',
    'Chỉ vị trí: opposite (đối diện).'
  ],
  [
    '2022-2023', 'Sắp xếp câu',
    ['I\'m going', 'to visit', 'my grandparents', 'next', 'Sunday.'],
    'I\'m going to visit my grandparents next Sunday.',
    'Thì tương lai gần: be going to + V.'
  ],
];

export const REORDER_QUESTIONS: Question[] = RAW_REORDER.map((item, idx) => ({
  id: `re_${idx + 1}`,
  type: 'reorder',
  year: item[0],
  topic: item[1],
  prompt: 'Sắp xếp các từ/cụm từ sau thành câu hoàn chỉnh:',
  words: item[2],
  answer: item[3],
  explanation: item[4],
}));
