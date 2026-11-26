import { ExamYear, Question, QuestionType } from '../types';

type RawMC = [
  type: QuestionType,
  year: ExamYear,
  topic: string,
  prompt: string,
  options: [string, string, string, string],
  answerIndex: 0 | 1 | 2 | 3,
  explanation: string
];

const RAW_MC: RawMC[] = [
  // === 2024-2025 Cấp Xã / Cấp Trường ===
  [
    'multiple_choice', '2024-2025', 'Quá khứ đơn',
    'The exercise ________ very easy yesterday.',
    ['is', 'was', 'are', 'were'], 1,
    'Có "yesterday" (hôm qua) -> thì quá khứ đơn. Chủ ngữ số ít "The exercise" đi với "was".'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Động vật',
    'A baby dog is called a ________.',
    ['chicken', 'kitten', 'puppy', 'panda'], 2,
    '"Puppy" nghĩa là chó con (kitten: mèo con, panda: gấu trúc).'
  ],
  [
    'multiple_choice', '2024-2025', 'Liên môn - Địa lý',
    'What is the capital city of South Korea?',
    ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'], 2,
    'Thủ đô của Hàn Quốc (South Korea) là Seoul.'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - V-ing',
    'The children enjoy ________ to traditional stories.',
    ['to listen', 'listened', 'listen', 'listening'], 3,
    'Cấu trúc: enjoy + V-ing (thích làm gì).'
  ],
  [
    'multiple_choice', '2024-2025', 'Giới từ',
    'Last night he didn\'t go home ________ 10 o\'clock.',
    ['until', 'at', 'after', 'in front of'], 0,
    'Cấu trúc: not ... until ... (mãi cho đến khi...).'
  ],
  [
    'multiple_choice', '2024-2025', 'Giới từ chỉ nơi chốn',
    'Where does he live? – He lives ________ 16 Nguyen Du Street.',
    ['on', 'in', 'at', 'under'], 2,
    'Trước địa chỉ có số nhà cụ thể (16 Nguyen Du Street) ta dùng giới từ "at".'
  ],
  [
    'multiple_choice', '2024-2025', 'Giới từ',
    'Look! The boys are talking ________ the football match.',
    ['on', 'at', 'about', 'in'], 2,
    'Cụm từ: talk about something (nói về điều gì đó).'
  ],
  [
    'multiple_choice', '2024-2025', 'Câu hỏi Wh-',
    'What ________ does your family have breakfast? – At 7 o\'clock.',
    ['time', 'color', 'subject', 'day'], 0,
    'Hỏi giờ dùng "What time...?" (mấy giờ).'
  ],
  [
    'multiple_choice', '2024-2025', 'Tương lai đơn',
    'What ________ you do next weekend?',
    ['are', 'do', 'will', 'did'], 2,
    'Có "next weekend" (cuối tuần tới) -> dùng thì tương lai đơn với "will".'
  ],
  [
    'multiple_choice', '2024-2025', 'Trái nghĩa',
    'The OPPOSITE of "easy" is ________.',
    ['simple', 'difficult', 'short', 'cheap'], 1,
    'Trái nghĩa với "easy" (dễ) là "difficult" (khó).'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Gia đình',
    'My mother\'s sister is my ________.',
    ['uncle', 'cousin', 'aunt', 'grandmother'], 2,
    'Chị/em gái của mẹ gọi là "aunt" (dì/cô).'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Mạo từ',
    'My father is ________ engineer in a big company.',
    ['a', 'an', 'the', 'some'], 1,
    '"engineer" bắt đầu bằng nguyên âm /e/ nên dùng mạo từ "an".'
  ],
  [
    'multiple_choice', '2024-2025', 'Giao tiếp',
    'Would you like some orange juice? – ________.',
    ['Yes, please.', 'Yes, I do.', 'No, I am not.', 'Here you are.'], 0,
    'Đáp lại lời mời "Would you like...?" lịch sự dùng "Yes, please." hoặc "No, thanks."'
  ],
  [
    'multiple_choice', '2024-2025', 'Hiện tại tiếp diễn',
    'Listen! The birds ________ in the garden.',
    ['sing', 'sings', 'are singing', 'sang'], 2,
    'Có từ "Listen!" -> diễn tả hành động đang diễn ra -> thì hiện tại tiếp diễn "are singing".'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Should',
    'You have a toothache. You ________ eat too many sweets.',
    ['should', 'shouldn\'t', 'must', 'can'], 1,
    'Bị đau răng (toothache) thì không nên (shouldn\'t) ăn quá nhiều kẹo.'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Nghề nghiệp',
    'A person who flies a plane is a ________.',
    ['driver', 'pilot', 'architect', 'farmer'], 1,
    'Người lái máy bay là phi công -> "pilot".'
  ],
  [
    'multiple_choice', '2024-2025', 'Liên môn - Toán',
    'How many sides does a triangle have?',
    ['Two', 'Three', 'Four', 'Five'], 1,
    'Hình tam giác (triangle) có 3 cạnh (three sides).'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Thời tiết',
    'It is very cold and ________ in winter in some countries.',
    ['sunny', 'hot', 'snowy', 'warm'], 2,
    'Mùa đông (winter) ở nhiều nước rất lạnh và có tuyết (snowy).'
  ],
  [
    'multiple_choice', '2024-2025', 'Câu hỏi tần suất',
    '________ do you go to the library? – Twice a week.',
    ['How many', 'How much', 'How often', 'How far'], 2,
    'Trả lời "Twice a week" (2 lần/tuần) -> hỏi tần suất bằng "How often".'
  ],
  [
    'multiple_choice', '2024-2025', 'So sánh hơn',
    'Ho Chi Minh City is ________ than Da Nang.',
    ['big', 'biger', 'bigger', 'biggest'], 2,
    'So sánh hơn của tính từ ngắn "big" (gấp đôi phụ âm g) là "bigger".'
  ],
  [
    'odd_one_out', '2024-2025', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['football', 'song', 'tennis', 'badminton'], 1,
    '"song" là bài hát, các từ còn lại là môn thể thao.'
  ],
  [
    'odd_one_out', '2024-2025', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['Vietnamese', 'April', 'Australian', 'American'], 1,
    '"April" là tháng 4, các từ còn lại chỉ quốc tịch.'
  ],
  [
    'odd_one_out', '2024-2025', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['teacher', 'nurse', 'cooker', 'cook'], 2,
    '"cooker" là cái nồi/bếp nấu, các từ còn lại chỉ nghề nghiệp (cook: đầu bếp).'
  ],
  [
    'odd_one_out', '2024-2025', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['write', 'sing', 'read', 'friend'], 3,
    '"friend" là danh từ (người bạn), các từ còn lại là động từ.'
  ],
  [
    'odd_one_out', '2024-2025', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['sometimes', 'always', 'often', 'now'], 3,
    '"now" là trạng từ chỉ thời điểm hiện tại, các từ còn lại là trạng từ tần suất.'
  ],
  [
    'pronunciation', '2024-2025', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: c(a)mp, t(a)ble, tr(a)vel, m(a)tch',
    ['camp', 'table', 'travel', 'match'], 1,
    '"table" phát âm chữ "a" là /eɪ/, các từ còn lại phát âm là /æ/.'
  ],
  [
    'pronunciation', '2024-2025', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: d(o), m(o)ther, br(o)ther, s(o)metimes',
    ['do', 'mother', 'brother', 'sometimes'], 0,
    '"do" phát âm chữ "o" là /uː/, các từ còn lại phát âm là /ʌ/.'
  ],
  [
    'pronunciation', '2024-2025', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: b(oo)k, l(oo)k, g(oo)d, sch(oo)l',
    ['book', 'look', 'good', 'school'], 3,
    '"school" phát âm "oo" là /uː/ (dài), các từ còn lại là /ʊ/ (ngắn).'
  ],
  [
    'pronunciation', '2024-2025', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: h(ea)d, br(ea)d, t(ea)cher, w(ea)ther',
    ['head', 'bread', 'teacher', 'weather'], 2,
    '"teacher" phát âm "ea" là /iː/, các từ còn lại là /e/.'
  ],
  [
    'pronunciation', '2024-2025', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: watch(ed), play(ed), wash(ed), stopp(ed)',
    ['watched', 'played', 'washed', 'stopped'], 1,
    '"played" phát âm đuôi -ed là /d/, các từ còn lại là /t/.'
  ],
  [
    'multiple_choice', '2024-2025', 'Đọc hiểu ngắn / Giao tiếp',
    'Excuse me, ________ is the post office? – It\'s next to the bank.',
    ['what', 'where', 'when', 'who'], 1,
    'Hỏi vị trí địa điểm dùng "Where".'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Sức khỏe',
    'He can\'t speak loudly because he has a ________.',
    ['sore throat', 'stomachache', 'backache', 'fever'], 0,
    'Đau họng (sore throat) nên không thể nói to.'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Quá khứ đơn',
    'Did you ________ to Nha Trang last summer?',
    ['went', 'go', 'going', 'goes'], 1,
    'Sau trợ động từ "Did" động từ luôn ở dạng nguyên mẫu -> "go".'
  ],
  [
    'multiple_choice', '2024-2025', 'Liên môn - Khoa học',
    'Which planet is known as the Red Planet?',
    ['Earth', 'Venus', 'Mars', 'Jupiter'], 2,
    'Sao Hỏa (Mars) được gọi là Hành tinh Đỏ (Red Planet).'
  ],
  [
    'multiple_choice', '2024-2025', 'Giới từ thời gian',
    'My birthday is ________ the 5th of May.',
    ['in', 'on', 'at', 'for'], 1,
    'Trước ngày cụ thể (the 5th of May) dùng giới từ "on".'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Lễ hội',
    'Children often carry lanterns and eat mooncakes at ________.',
    ['Tet Holiday', 'Christmas', 'Mid-Autumn Festival', 'Teachers\' Day'], 2,
    'Rước đèn lồng và ăn bánh trung thu vào Tết Trung Thu (Mid-Autumn Festival).'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - There is/are',
    '________ any milk left in the fridge?',
    ['Are there', 'Is there', 'There is', 'There are'], 1,
    '"milk" là danh từ không đếm được nên dùng câu hỏi "Is there".'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Phương tiện',
    'How did you get to Phu Quoc Island? – I went ________ plane.',
    ['on', 'in', 'by', 'with'], 2,
    'Đi bằng phương tiện gì dùng "by + phương tiện" (by plane).'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Want to',
    'Mai wants ________ a doctor when she grows up.',
    ['be', 'being', 'to be', 'is'], 2,
    'Cấu trúc: want + to V (muốn trở thành...).'
  ],
  [
    'multiple_choice', '2024-2025', 'Giao tiếp',
    'Thank you very much for your help! – ________.',
    ['You\'re welcome.', 'Yes, I do.', 'Good luck!', 'See you.'], 0,
    'Đáp lại lời cảm ơn dùng "You\'re welcome." (Không có gì).'
  ],

  // === 2023-2024 Cấp Xã / Cấp Trường ===
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Hiện tại đơn',
    'My sister ________ her teeth twice a day.',
    ['brush', 'brushes', 'brushing', 'brushed'], 1,
    'Chủ ngữ số ít "My sister" ở thì hiện tại đơn, động từ kết thúc bằng -sh thêm -es -> "brushes".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Môn học',
    'We learn about numbers and shapes in ________ lessons.',
    ['Music', 'Art', 'Maths', 'History'], 2,
    'Học về con số và hình khối trong môn Toán (Maths).'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Quá khứ đơn',
    'Last Sunday, we ________ a lot of photos at the zoo.',
    ['take', 'takes', 'took', 'taken'], 2,
    'Quá khứ đơn của động từ bất quy tắc "take" là "took".'
  ],
  [
    'multiple_choice', '2023-2024', 'Câu hỏi Wh-',
    '________ is your favourite fairy tale? – Snow White.',
    ['Who', 'What', 'Where', 'When'], 1,
    'Hỏi truyện cổ tích yêu thích dùng "What".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Tính cách',
    'Tuan always helps his friends. He is very ________.',
    ['kind', 'lazy', 'greedy', 'rude'], 0,
    'Luôn giúp đỡ bạn bè -> tốt bụng ("kind").'
  ],
  [
    'multiple_choice', '2023-2024', 'Giới từ',
    'My school is opposite ________ the stadium.',
    ['to', 'at', 'in', 'with'], 0,
    'Có thể dùng "opposite" hoặc "opposite to" (đối diện với).'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - How much/many',
    'How ________ water do you drink every day?',
    ['many', 'much', 'often', 'long'], 1,
    '"water" là danh từ không đếm được nên dùng "How much".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Đồ ăn',
    'I\'d like a ________ of chocolate, please.',
    ['glass', 'bottle', 'bar', 'bowl'], 2,
    'Một thanh sô-cô-la gọi là "a bar of chocolate".'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Must/Mustn\'t',
    'Don\'t touch the stove! You may ________ yourself.',
    ['cut', 'burn', 'break', 'fall'], 1,
    'Chạm vào bếp nóng có thể bị bỏng -> "burn yourself".'
  ],
  [
    'multiple_choice', '2023-2024', 'Liên môn - Địa lý',
    'Which is the longest river in the world?',
    ['The Red River', 'The Mekong River', 'The Nile River', 'The Thames'], 2,
    'Sông Nile (The Nile River) là con sông dài nhất thế giới.'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Tương lai gần',
    'They are going ________ a picnic next Sunday.',
    ['have', 'to have', 'having', 'had'], 1,
    'Cấu trúc tương lai gần: be going to + V nguyên mẫu.'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Thời gian',
    'There are ________ months in a year.',
    ['ten', 'eleven', 'twelve', 'thirteen'], 2,
    'Một năm có 12 tháng (twelve months).'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Sở hữu',
    'This is Linda\'s ruler. That ruler is ________.',
    ['my', 'me', 'mine', 'I'], 2,
    'Đại từ sở hữu thay cho "my ruler" là "mine".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Địa điểm',
    'You can borrow books from the ________.',
    ['bakery', 'pharmacy', 'library', 'cinema'], 2,
    'Mượn sách ở thư viện -> "library".'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Liên từ',
    'I like learning English ________ it is very interesting.',
    ['but', 'or', 'because', 'so'], 2,
    'Nêu lý do dùng liên từ "because" (bởi vì).'
  ],
  [
    'multiple_choice', '2023-2024', 'Giao tiếp',
    'What\'s the weather like in Ha Noi today? – ________.',
    ['It\'s sunny and warm.', 'I like summer.', 'It\'s Monday.', 'Yes, it is.'], 0,
    'Hỏi thời tiết hôm nay -> trả lời "It\'s sunny and warm."'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Like + V-ing',
    'What do you like ________ in your free time?',
    ['do', 'doing', 'did', 'does'], 1,
    'Sau "like" dùng V-ing -> "doing".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Động vật',
    'Which animal has a very long neck?',
    ['Elephant', 'Giraffe', 'Monkey', 'Tiger'], 1,
    'Hươu cao cổ (Giraffe) có chiếc cổ rất dài.'
  ],
  [
    'multiple_choice', '2023-2024', 'So sánh hơn',
    'This book is ________ than that one.',
    ['more interesting', 'interestinger', 'most interesting', 'interesting'], 0,
    'Tính từ dài "interesting" khi so sánh hơn dùng "more interesting".'
  ],
  [
    'multiple_choice', '2023-2024', 'Liên môn - Toán',
    'What is 15 multiplied by 4?',
    ['45', '50', '60', '65'], 2,
    '15 nhân 4 bằng 60 (15 × 4 = 60).'
  ],
  [
    'odd_one_out', '2023-2024', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['spring', 'summer', 'season', 'winter'], 2,
    '"season" là mùa nói chung, các từ còn lại là tên các mùa cụ thể.'
  ],
  [
    'odd_one_out', '2023-2024', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['apple', 'banana', 'orange', 'carrot'], 3,
    '"carrot" là rau củ, các từ còn lại là trái cây.'
  ],
  [
    'odd_one_out', '2023-2024', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['fever', 'headache', 'doctor', 'cough'], 2,
    '"doctor" là bác sĩ, các từ còn lại là triệu chứng bệnh.'
  ],
  [
    'odd_one_out', '2023-2024', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['went', 'saw', 'ate', 'play'], 3,
    '"play" ở dạng nguyên mẫu, các từ còn lại là động từ quá khứ đơn.'
  ],
  [
    'odd_one_out', '2023-2024', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['museum', 'pagoda', 'bridge', 'happy'], 3,
    '"happy" là tính từ, các từ còn lại là danh từ chỉ địa điểm.'
  ],
  [
    'pronunciation', '2023-2024', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: s(u)n, b(u)s, p(u)t, c(u)p',
    ['sun', 'bus', 'put', 'cup'], 2,
    '"put" phát âm chữ "u" là /ʊ/, các từ còn lại là /ʌ/.'
  ],
  [
    'pronunciation', '2023-2024', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: (ch)air, (ch)icken, s(ch)ool, (ch)ildren',
    ['chair', 'chicken', 'school', 'children'], 2,
    '"school" phát âm "ch" là /k/, các từ còn lại là /tʃ/.'
  ],
  [
    'pronunciation', '2023-2024', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: (th)ank, (th)ree, (th)is, (th)ink',
    ['thank', 'three', 'this', 'think'], 2,
    '"this" phát âm "th" là /ð/ (hữu thanh), các từ còn lại là /θ/ (vô thanh).'
  ],
  [
    'pronunciation', '2023-2024', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: k(i)te, b(i)ke, r(i)de, s(i)t',
    ['kite', 'bike', 'ride', 'sit'], 3,
    '"sit" phát âm chữ "i" là /ɪ/, các từ còn lại là /aɪ/.'
  ],
  [
    'pronunciation', '2023-2024', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: book(s), pen(s), bag(s), dog(s)',
    ['books', 'pens', 'bags', 'dogs'], 0,
    '"books" phát âm đuôi -s là /s/, các từ còn lại là /z/.'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Giao thông',
    'We must stop when the traffic light turns ________.',
    ['green', 'red', 'blue', 'white'], 1,
    'Đèn đỏ (red) thì phải dừng lại.'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Can',
    'Can you play the guitar? – No, I ________.',
    ['can', 'don\'t', 'can\'t', 'am not'], 2,
    'Câu hỏi bắt đầu bằng "Can you..." -> trả lời phủ định là "No, I can\'t."'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Quần áo',
    'In winter, I often wear a warm ________ around my neck.',
    ['scarf', 'shorts', 'skirt', 'sandals'], 0,
    'Quàng quanh cổ vào mùa đông là khăn quàng cổ -> "scarf".'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Quá khứ đơn',
    'Where ________ you yesterday afternoon?',
    ['was', 'were', 'are', 'did'], 1,
    'Chủ ngữ "you" ở thì quá khứ đơn với động từ to be dùng "were".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Nhà cửa',
    'We cook meals in the ________.',
    ['bedroom', 'bathroom', 'kitchen', 'garage'], 2,
    'Nấu ăn trong nhà bếp -> "kitchen".'
  ],

  // === 2022-2023 Cấp Xã / Cấp Trường ===
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Hiện tại đơn',
    'She ________ to school by bike every day.',
    ['go', 'goes', 'going', 'went'], 1,
    'Có "every day" -> thì hiện tại đơn, chủ ngữ "She" -> "goes".'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Quốc gia',
    'Akiko is from Japan. She is ________.',
    ['Japanese', 'Chinese', 'English', 'Korean'], 0,
    'Người đến từ Nhật Bản (Japan) có quốc tịch là Japanese.'
  ],
  [
    'multiple_choice', '2022-2023', 'Giới từ',
    'He is very good ________ playing chess.',
    ['in', 'on', 'at', 'with'], 2,
    'Cụm từ: be good at + V-ing/N (giỏi về việc gì).'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Trường học',
    'Our classroom is on the ________ floor.',
    ['three', 'third', 'thirteen', 'thirty'], 1,
    'Chỉ tầng mấy dùng số thứ tự -> "the third floor" (tầng 3).'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Let\'s',
    'Let\'s ________ swimming this afternoon!',
    ['go', 'to go', 'going', 'went'], 0,
    'Cấu trúc: Let\'s + V nguyên mẫu -> "Let\'s go".'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - An toàn',
    'Don\'t ride your bike too fast! You may ________ off your bike.',
    ['fall', 'climb', 'jump', 'run'], 0,
    'Đi xe đạp quá nhanh có thể bị ngã xe -> "fall off".'
  ],
  [
    'multiple_choice', '2022-2023', 'Câu hỏi Wh-',
    '________ is it from your house to school? – About 2 kilometres.',
    ['How long', 'How far', 'How old', 'How tall'], 1,
    'Hỏi khoảng cách dùng "How far".'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Bữa ăn',
    'We have ________ at 12 o\'clock at noon.',
    ['breakfast', 'lunch', 'dinner', 'supper'], 1,
    'Bữa trưa lúc 12 giờ gọi là "lunch".'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - So sánh nhất',
    'Mount Everest is the ________ mountain in the world.',
    ['high', 'higher', 'highest', 'most high'], 2,
    'So sánh nhất của tính từ ngắn "high" là "the highest".'
  ],
  [
    'multiple_choice', '2022-2023', 'Liên môn - Khoa học',
    'How many days are there in a leap year?',
    ['364', '365', '366', '360'], 2,
    'Năm nhuận (leap year) có 366 ngày.'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Some/Any',
    'I would like ________ apples, please.',
    ['any', 'some', 'a', 'an'], 1,
    'Trong lời đề nghị/yêu cầu lịch sự "Would like..." dùng "some" với danh từ số nhiều.'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Thời gian',
    'The day after Wednesday is ________.',
    ['Tuesday', 'Thursday', 'Friday', 'Monday'], 1,
    'Ngày sau Thứ Tư (Wednesday) là Thứ Năm (Thursday).'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Quá khứ đơn',
    'We ________ a birthday party for Nam last week.',
    ['have', 'has', 'had', 'having'], 2,
    'Có "last week" -> quá khứ đơn của "have" là "had".'
  ],
  [
    'multiple_choice', '2022-2023', 'Giao tiếp',
    'How do you practise speaking English? – ________.',
    ['I speak English every day.', 'I like English.', 'It is on Monday.', 'Yes, I am.'], 0,
    'Hỏi cách luyện nói tiếng Anh -> trả lời "I speak English every day."'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Truyện cổ tích',
    'Who is the main character in "The Story of Mai An Tiem"?',
    ['Tam', 'Mai An Tiem', 'Aladdin', 'Cinderella'], 1,
    'Nhân vật chính trong "Sự tích quả dưa hấu" là Mai An Tiêm.'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Hiện tại tiếp diễn',
    'What ________ your brother doing right now?',
    ['am', 'is', 'are', 'do'], 1,
    'Chủ ngữ số ít "your brother" đi với "is" trong thì hiện tại tiếp diễn.'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Nghề nghiệp',
    'A ________ designs buildings and houses.',
    ['nurse', 'architect', 'writer', 'singer'], 1,
    'Kiến trúc sư (architect) là người thiết kế nhà cửa, công trình.'
  ],
  [
    'multiple_choice', '2022-2023', 'Giới từ',
    'My grandparents live ________ a small village.',
    ['in', 'on', 'at', 'to'], 0,
    'Sống trong một ngôi làng dùng "in a small village".'
  ],
  [
    'multiple_choice', '2022-2023', 'Trái nghĩa',
    'The OPPOSITE of "noisy" is ________.',
    ['loud', 'busy', 'quiet', 'big'], 2,
    'Trái nghĩa với "noisy" (ồn ào) là "quiet" (yên tĩnh).'
  ],
  [
    'multiple_choice', '2022-2023', 'Liên môn - Địa lý',
    'Ha Long Bay is in ________ province, Viet Nam.',
    ['Quang Ninh', 'Nghe An', 'Dong Nai', 'Ca Mau'], 0,
    'Vịnh Hạ Long thuộc tỉnh Quảng Ninh.'
  ],
  [
    'odd_one_out', '2022-2023', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['bus', 'train', 'underground', 'ticket'], 3,
    '"ticket" là vé xe, các từ còn lại là phương tiện giao thông.'
  ],
  [
    'odd_one_out', '2022-2023', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['clever', 'brave', 'hard-working', 'story'], 3,
    '"story" là danh từ (câu chuyện), các từ còn lại là tính từ chỉ tính cách.'
  ],
  [
    'odd_one_out', '2022-2023', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['eyes', 'ears', 'nose', 'shoes'], 3,
    '"shoes" là giày dép, các từ còn lại là bộ phận trên khuôn mặt.'
  ],
  [
    'odd_one_out', '2022-2023', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['first', 'second', 'four', 'fifth'], 2,
    '"four" là số đếm, các từ còn lại là số thứ tự.'
  ],
  [
    'odd_one_out', '2022-2023', 'Odd One Out',
    'Choose the odd one out (Chọn từ khác loại):',
    ['noodles', 'rice', 'milk', 'bread'], 2,
    '"milk" là đồ uống, các từ còn lại là đồ ăn.'
  ],
  [
    'pronunciation', '2022-2023', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: c(a)ke, m(a)ke, l(a)ke, c(a)t',
    ['cake', 'make', 'lake', 'cat'], 3,
    '"cat" phát âm chữ "a" là /æ/, các từ còn lại là /eɪ/.'
  ],
  [
    'pronunciation', '2022-2023', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: (h)our, (h)ouse, (h)appy, (h)at',
    ['hour', 'house', 'happy', 'hat'], 0,
    '"hour" có chữ "h" câm, các từ còn lại phát âm /h/.'
  ],
  [
    'pronunciation', '2022-2023', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: n(i)ce, f(i)ne, l(i)ve, f(i)ve',
    ['nice', 'fine', 'live', 'five'], 2,
    '"live" (động từ sống) phát âm "i" là /ɪ/, các từ còn lại là /aɪ/.'
  ],
  [
    'pronunciation', '2022-2023', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: (c)ity, (c)inema, (c)at, (c)entre',
    ['city', 'cinema', 'cat', 'centre'], 2,
    '"cat" phát âm chữ "c" là /k/, các từ còn lại là /s/.'
  ],
  [
    'pronunciation', '2022-2023', 'Phát âm',
    'Choose the word whose underlined part is pronounced differently: g(o), n(o), h(o)me, h(o)t',
    ['go', 'no', 'home', 'hot'], 3,
    '"hot" phát âm chữ "o" là /ɒ/, các từ còn lại là /əʊ/.'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Giới từ',
    'Turn left ________ the corner and you will see the museum.',
    ['at', 'in', 'under', 'between'], 0,
    'Cụm chỉ đường: turn left at the corner (rẽ trái ở góc đường).'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Mùa',
    'In ________, the leaves fall from the trees.',
    ['spring', 'summer', 'autumn', 'winter'], 2,
    'Vào mùa thu (autumn), lá cây rụng.'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Quá khứ đơn',
    'What did you ________ at the party? – We sang and danced.',
    ['do', 'did', 'done', 'doing'], 0,
    'Sau "did" dùng động từ nguyên mẫu "do".'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Thể thao',
    'Nam is playing ________ with his friends in the yard.',
    ['swimming', 'badminton', 'cycling', 'skating'], 1,
    'Động từ "play" đi với môn thể thao dùng bóng/cầu -> "play badminton".'
  ],
  [
    'multiple_choice', '2022-2023', 'Giao tiếp',
    'What\'s the matter with you? – ________.',
    ['I have a fever.', 'I\'m ten years old.', 'I go to school.', 'I like apples.'], 0,
    '"What\'s the matter with you?" dùng để hỏi thăm sức khỏe -> "I have a fever."'
  ],
  // Extra 15 rich questions across years
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Mệnh lệnh',
    '________ play with the knife! It\'s very sharp.',
    ['Not', 'No', 'Don\'t', 'Doesn\'t'], 2,
    'Câu mệnh lệnh cấm đoán bắt đầu bằng "Don\'t + V nguyên mẫu".'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Địa điểm',
    'We can see many wild animals at the ________.',
    ['zoo', 'hospital', 'post office', 'stadium'], 0,
    'Xem động vật hoang dã ở sở thú -> "zoo".'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Quá khứ đơn',
    'Yesterday morning, Hoa ________ a letter to her pen friend.',
    ['write', 'writes', 'wrote', 'writing'], 2,
    'Quá khứ đơn của "write" là "wrote".'
  ],
  [
    'multiple_choice', '2024-2025', 'Từ vựng - Đồ uống',
    'Would you like a ________ of orange juice?',
    ['packet', 'glass', 'bar', 'loaf'], 1,
    'Một ly nước cam là "a glass of orange juice".'
  ],
  [
    'multiple_choice', '2024-2025', 'Ngữ pháp - Trạng từ tần suất',
    'My brother ________ goes to bed late. He always sleeps at 9 p.m.',
    ['always', 'usually', 'never', 'often'], 2,
    'Anh ấy luôn ngủ lúc 9 giờ tối -> không bao giờ (never) đi ngủ muộn.'
  ],
  [
    'multiple_choice', '2023-2024', 'Liên môn - Toán',
    'Half of 100 is ________.',
    ['25', '40', '50', '75'], 2,
    'Một nửa (half) của 100 là 50.'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Màu sắc',
    'When you mix blue and yellow, you get ________.',
    ['red', 'green', 'purple', 'orange'], 1,
    'Pha xanh dương (blue) và vàng (yellow) ra màu xanh lá (green).'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Câu hỏi Yes/No',
    '________ your parents work in a hospital?',
    ['Do', 'Does', 'Is', 'Are'], 0,
    'Chủ ngữ số nhiều "your parents" với động từ thường "work" -> dùng trợ động từ "Do".'
  ],
  [
    'multiple_choice', '2023-2024', 'Từ vựng - Hoạt động',
    'I often ________ cartoons on TV after dinner.',
    ['look', 'see', 'watch', 'read'], 2,
    'Xem phim hoạt hình trên TV dùng động từ "watch".'
  ],
  [
    'multiple_choice', '2023-2024', 'Ngữ pháp - Tính từ sở hữu',
    'Phong and Quan are my friends. ________ school is very big.',
    ['His', 'Her', 'Our', 'Their'], 3,
    'Sở hữu của "Phong and Quan" (họ) là "Their".'
  ],
  [
    'multiple_choice', '2022-2023', 'Liên môn - Địa lý',
    'London is the capital of ________.',
    ['France', 'England', 'America', 'Australia'], 1,
    'Luân Đôn (London) là thủ đô của nước Anh (England).'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Học tập',
    'I write new words in my ________ and read them aloud.',
    ['notebook', 'eraser', 'ruler', 'schoolbag'], 0,
    'Viết từ mới vào vở ghi chép -> "notebook".'
  ],
  [
    'multiple_choice', '2022-2023', 'Ngữ pháp - Quá khứ đơn',
    'Did they ________ fun at the festival? – Yes, they did.',
    ['had', 'has', 'have', 'having'], 2,
    'Sau "Did" động từ chia nguyên mẫu -> "have".'
  ],
  [
    'multiple_choice', '2022-2023', 'Từ vựng - Trường học',
    'English is my favourite ________ at school.',
    ['sport', 'subject', 'food', 'animal'], 1,
    'Tiếng Anh là môn học (subject) yêu thích.'
  ],
  [
    'multiple_choice', '2022-2023', 'Giao tiếp',
    'Nice to meet you, Tony! – ________.',
    ['Nice to meet you, too.', 'I\'m fine, thanks.', 'Goodbye!', 'Yes, please.'], 0,
    'Đáp lại "Nice to meet you" dùng "Nice to meet you, too."'
  ],
];

export const MC_QUESTIONS: Question[] = RAW_MC.map((item, idx) => ({
  id: `mc_${idx + 1}`,
  type: item[0],
  year: item[1],
  topic: item[2],
  prompt: item[3],
  options: item[4],
  answer: item[4][item[5]],
  explanation: item[6],
}));
