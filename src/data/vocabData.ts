import { VocabTheme, VocabWord } from '../types';

export const VOCAB_THEMES: VocabTheme[] = [
  {
    id: 'school',
    title: 'Trường Học & Môn Học',
    emoji: '🏫',
    color: 'from-blue-500 to-indigo-600',
    desc: 'Từ vựng lớp học, môn học và luyện tiếng Anh',
  },
  {
    id: 'family_jobs',
    title: 'Gia Đình & Nghề Nghiệp',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-pink-500 to-rose-500',
    desc: 'Người thân và các nghề nghiệp mơ ước',
  },
  {
    id: 'health_safety',
    title: 'Sức Khỏe & An Toàn',
    emoji: '🩺',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Các bệnh thường gặp và lời khuyên an toàn',
  },
  {
    id: 'places_directions',
    title: 'Địa Điểm & Chỉ Đường',
    emoji: '🗺️',
    color: 'from-amber-500 to-orange-600',
    desc: 'Nơi chốn quanh em và cách hỏi đường',
  },
  {
    id: 'weather_seasons',
    title: 'Thời Tiết & Các Mùa',
    emoji: '🌤️',
    color: 'from-sky-500 to-cyan-600',
    desc: '4 mùa trong năm và dự báo thời tiết',
  },
  {
    id: 'travel_holidays',
    title: 'Du Lịch & Lễ Hội',
    emoji: '✈️',
    color: 'from-purple-500 to-violet-600',
    desc: 'Đi chơi cuối tuần, kỳ nghỉ và lễ hội Việt Nam',
  },
  {
    id: 'animals_food',
    title: 'Động Vật & Đồ Ăn',
    emoji: '🐼',
    color: 'from-lime-500 to-green-600',
    desc: 'Con vật ở sở thú, món ăn và đồ uống quen thuộc',
  },
  {
    id: 'past_verbs',
    title: 'Động Từ Quá Khứ Hay Thi IOE',
    emoji: '⚡',
    color: 'from-orange-500 to-red-500',
    desc: 'Các động từ bất quy tắc siêu hay ra trong đề Cấp Xã',
  },
];

type RawVocab = [
  themeId: string,
  word: string,
  phonetic: string,
  meaningVi: string,
  emoji: string,
  exampleEn: string,
  exampleVi: string
];

const RAW_VOCAB: RawVocab[] = [
  // 1. School (8)
  ['school', 'subject', '/ˈsʌb.dʒekt/', 'môn học', '📚', 'English is my favourite subject.', 'Tiếng Anh là môn học yêu thích của em.'],
  ['school', 'library', '/ˈlaɪ.brər.i/', 'thư viện', '🏛️', 'I borrow books from the library.', 'Em mượn sách ở thư viện.'],
  ['school', 'notebook', '/ˈnəʊt.bʊk/', 'quyển vở ghi chép', '📓', 'I write new words in my notebook.', 'Em viết từ mới vào quyển vở.'],
  ['school', 'practise', '/ˈpræk.tɪs/', 'luyện tập', '🎯', 'I practise speaking English every day.', 'Em luyện nói tiếng Anh mỗi ngày.'],
  ['school', 'homework', '/ˈhəʊm.wɜːk/', 'bài tập về nhà', '✏️', 'I do my homework after dinner.', 'Em làm bài tập về nhà sau bữa tối.'],
  ['school', 'classroom', '/ˈklɑːs.ruːm/', 'phòng học', '🏫', 'Our classroom is on the third floor.', 'Phòng học của chúng em ở tầng ba.'],
  ['school', 'cartoon', '/kɑːˈtuːn/', 'phim hoạt hình', '📺', 'I watch English cartoons on TV.', 'Em xem phim hoạt hình tiếng Anh trên TV.'],
  ['school', 'comic book', '/ˈkɒm.ɪk bʊk/', 'truyện tranh', '📖', 'She likes reading English comic books.', 'Bạn ấy thích đọc truyện tranh tiếng Anh.'],

  // 2. Family & Jobs (8)
  ['family_jobs', 'pilot', '/ˈpaɪ.lət/', 'phi công', '✈️', 'I want to be a pilot in the future.', 'Em muốn làm phi công trong tương lai.'],
  ['family_jobs', 'architect', '/ˈɑː.kɪ.tekt/', 'kiến trúc sư', '🏗️', 'An architect designs beautiful houses.', 'Kiến trúc sư thiết kế những ngôi nhà đẹp.'],
  ['family_jobs', 'engineer', '/ˌen.dʒɪˈnɪər/', 'kỹ sư', '👷', 'My father is an engineer.', 'Bố của em là kỹ sư.'],
  ['family_jobs', 'nurse', '/nɜːs/', 'y tá', '👩‍⚕️', 'A nurse looks after patients.', 'Y tá chăm sóc các bệnh nhân.'],
  ['family_jobs', 'farmer', '/ˈfɑː.mər/', 'nông dân', '🌾', 'My grandfather is a hard-working farmer.', 'Ông em là một bác nông dân chăm chỉ.'],
  ['family_jobs', 'aunt', '/ɑːnt/', 'cô / dì', '👩', 'My mother\'s sister is my aunt.', 'Chị/em gái của mẹ là dì của em.'],
  ['family_jobs', 'hometown', '/ˈhəʊm.taʊn/', 'quê hương', '🏡', 'My hometown is small and peaceful.', 'Quê hương em nhỏ bé và yên bình.'],
  ['family_jobs', 'village', '/ˈvɪl.ɪdʒ/', 'ngôi làng', '🌳', 'My grandparents live in a quiet village.', 'Ông bà em sống ở một ngôi làng yên tĩnh.'],

  // 3. Health & Safety (8)
  ['health_safety', 'toothache', '/ˈtuːθ.eɪk/', 'đau răng', '🦷', 'He shouldn\'t eat sweets because he has a toothache.', 'Bạn ấy không nên ăn kẹo vì bị đau răng.'],
  ['health_safety', 'stomachache', '/ˈstʌm.ək.eɪk/', 'đau bụng', '🤕', 'I have a stomachache today.', 'Hôm nay em bị đau bụng.'],
  ['health_safety', 'sore throat', '/ˌsɔː ˈθrəʊt/', 'đau họng', '😷', 'Drink warm water if you have a sore throat.', 'Hãy uống nước ấm nếu em bị đau họng.'],
  ['health_safety', 'fever', '/ˈfiː.vər/', 'bị sốt', '🤒', 'She has a fever and should take a rest.', 'Bạn ấy bị sốt và nên nghỉ ngơi.'],
  ['health_safety', 'backache', '/ˈbæk.eɪk/', 'đau lưng', '💆', 'Don\'t carry heavy things when you have a backache.', 'Đừng bê đồ nặng khi bị đau lưng.'],
  ['health_safety', 'dentist', '/ˈden.tɪst/', 'nha sĩ (bác sĩ răng)', '🏥', 'You should go to the dentist.', 'Em nên đi khám nha sĩ.'],
  ['health_safety', 'sharp knife', '/ʃɑːp naɪf/', 'con dao sắc', '🔪', 'Don\'t play with a sharp knife!', 'Đừng nghịch dao sắc nhé!'],
  ['health_safety', 'burn yourself', '/bɜːn jɔːˈself/', 'bị bỏng', '🔥', 'Don\'t touch the stove or you may burn yourself.', 'Đừng chạm vào bếp kẻo bị bỏng.'],

  // 4. Places & Directions (8)
  ['places_directions', 'post office', '/ˈpəʊst ˌɒf.ɪs/', 'bưu điện', '📮', 'The post office is next to the bank.', 'Bưu điện nằm ngay cạnh ngân hàng.'],
  ['places_directions', 'museum', '/mjuːˈziː.əm/', 'viện bảo tàng', '🏺', 'Let\'s visit the history museum.', 'Chúng mình cùng đi thăm bảo tàng lịch sử nhé.'],
  ['places_directions', 'pharmacy', '/ˈfɑː.mə.si/', 'hiệu thuốc', '💊', 'My mother buys medicine at the pharmacy.', 'Mẹ em mua thuốc ở hiệu thuốc.'],
  ['places_directions', 'supermarket', '/ˈsuː.pəˌmɑː.kɪt/', 'siêu thị', '🛒', 'The bakery is opposite the supermarket.', 'Tiệm bánh nằm đối diện siêu thị.'],
  ['places_directions', 'opposite', '/ˈɒp.ə.zɪt/', 'đối diện', '↔️', 'My school is opposite the stadium.', 'Trường em nằm đối diện sân vận động.'],
  ['places_directions', 'between', '/bɪˈtwiːn/', 'ở giữa (hai vật)', '📍', 'The cinema is between the park and the bank.', 'Rạp chiếu phim ở giữa công viên và ngân hàng.'],
  ['places_directions', 'turn right', '/tɜːn raɪt/', 'rẽ phải', '➡️', 'Go straight and turn right at the corner.', 'Đi thẳng và rẽ phải ở góc đường.'],
  ['places_directions', 'traffic lights', '/ˈtræf.ɪk laɪts/', 'đèn giao thông', '🚦', 'Stop when the traffic lights turn red.', 'Dừng lại khi đèn giao thông chuyển đỏ.'],

  // 5. Weather & Seasons (8)
  ['weather_seasons', 'spring', '/sprɪŋ/', 'mùa xuân', '🌸', 'Spring is warm and full of flowers.', 'Mùa xuân ấm áp và ngập tràn hoa.'],
  ['weather_seasons', 'summer', '/ˈsʌm.ər/', 'mùa hè', '☀️', 'It is hot and sunny in summer.', 'Mùa hè trời nóng và có nắng.'],
  ['weather_seasons', 'autumn', '/ˈɔː.təm/', 'mùa thu', '🍂', 'In autumn, the weather is cool and windy.', 'Mùa thu trời mát mẻ và có gió.'],
  ['weather_seasons', 'winter', '/ˈwɪn.tər/', 'mùa đông', '❄️', 'It is very cold and snowy in winter.', 'Mùa đông trời rất lạnh và có tuyết.'],
  ['weather_seasons', 'weather', '/ˈweð.ər/', 'thời tiết', '🌦️', 'What will the weather be like tomorrow?', 'Ngày mai thời tiết sẽ thế nào?'],
  ['weather_seasons', 'windy', '/ˈwɪn.di/', 'có gió', '💨', 'It will be cold and windy in Ha Noi.', 'Hà Nội sẽ lạnh và có gió.'],
  ['weather_seasons', 'umbrella', '/ʌmˈbrel.ə/', 'cái ô / cái dù', '☂️', 'Take an umbrella because it is raining!', 'Mang ô theo vì trời đang mưa!'],
  ['weather_seasons', 'scarf', '/skɑːf/', 'khăn quàng cổ', '🧣', 'I wear a warm scarf in winter.', 'Em quàng khăn ấm vào mùa đông.'],

  // 6. Travel & Holidays (8)
  ['travel_holidays', 'island', '/ˈaɪ.lənd/', 'hòn đảo', '🏝️', 'We went to Phu Quoc Island last summer.', 'Hè năm ngoái nhà em đi đảo Phú Quốc.'],
  ['travel_holidays', 'sandcastle', '/ˈsændˌkɑː.səl/', 'lâu đài cát', '🏰', 'Children love building sandcastles on the beach.', 'Trẻ em rất thích xây lâu đài cát trên biển.'],
  ['travel_holidays', 'explore', '/ɪkˈsplɔːr/', 'khám phá', '🧭', 'I think I\'ll explore the caves in Ha Long Bay.', 'Em nghĩ mình sẽ khám phá hang động ở Vịnh Hạ Long.'],
  ['travel_holidays', 'seafood', '/ˈsiː.fuːd/', 'hải sản', '🦐', 'We ate a lot of delicious seafood.', 'Chúng em đã ăn rất nhiều hải sản ngon.'],
  ['travel_holidays', 'countryside', '/ˈkʌn.tri.saɪd/', 'vùng nông thôn', '🌄', 'Tomorrow I will visit my grandparents in the countryside.', 'Ngày mai em sẽ về quê thăm ông bà.'],
  ['travel_holidays', 'holiday', '/ˈhɒl.ə.deɪ/', 'kỳ nghỉ lễ', '🎉', 'Where did you go on holiday?', 'Kỳ nghỉ vừa rồi em đã đi đâu?'],
  ['travel_holidays', 'lantern', '/ˈlæn.tən/', 'đèn lồng', '🏮', 'Children carry lanterns at Mid-Autumn Festival.', 'Trẻ em rước đèn lồng vào Tết Trung Thu.'],
  ['travel_holidays', 'celebrate', '/ˈsel.ə.breɪt/', 'tổ chức ăn mừng', '🎂', 'How did you celebrate your birthday?', 'Bạn đã tổ chức sinh nhật như thế nào?'],

  // 7. Animals & Food (8)
  ['animals_food', 'puppy', '/ˈpʌp.i/', 'chó con', '🐶', 'A baby dog is called a puppy.', 'Chó con được gọi là puppy.'],
  ['animals_food', 'kitten', '/ˈkɪt.ən/', 'mèo con', '🐱', 'A baby cat is called a kitten.', 'Mèo con được gọi là kitten.'],
  ['animals_food', 'peacock', '/ˈpiː.kɒk/', 'con công', '🦚', 'The peacocks moved beautifully at the zoo.', 'Những chú công di chuyển rất đẹp ở sở thú.'],
  ['animals_food', 'giraffe', '/dʒɪˈrɑːf/', 'hươu cao cổ', '🦒', 'A giraffe has a very long neck.', 'Hươu cao cổ có chiếc cổ rất dài.'],
  ['animals_food', 'elephant', '/ˈel.ɪ.fənt/', 'con voi', '🐘', 'An elephant is bigger than a mouse.', 'Con voi to hơn con chuột.'],
  ['animals_food', 'biscuits', '/ˈbɪs.kɪts/', 'bánh quy', '🍪', 'My mother bought a packet of biscuits.', 'Mẹ em đã mua một gói bánh quy.'],
  ['animals_food', 'watermelon', '/ˈwɔː.təˌmel.ən/', 'quả dưa hấu', '🍉', 'Mai An Tiem grew sweet watermelons.', 'Mai An Tiêm đã trồng những quả dưa hấu ngọt.'],
  ['animals_food', 'hungry', '/ˈhʌŋ.ɡri/', 'đói bụng', '😋', 'I\'m hungry. I\'d like a sandwich.', 'Em đói bụng quá. Em muốn ăn một cái bánh kẹp.'],

  // 8. Past Irregular Verbs (8)
  ['past_verbs', 'went', '/went/', 'đã đi (quá khứ của go)', '🚶', 'Yesterday, I went to the bookstore.', 'Hôm qua em đã đi hiệu sách.'],
  ['past_verbs', 'saw', '/sɔː/', 'đã thấy (quá khứ của see)', '👀', 'We saw two big elephants at the zoo.', 'Chúng em đã thấy hai chú voi lớn ở sở thú.'],
  ['past_verbs', 'ate', '/eɪt/', 'đã ăn (quá khứ của eat)', '🍽️', 'She ate a bowl of noodles this morning.', 'Sáng nay bạn ấy đã ăn một bát phở.'],
  ['past_verbs', 'bought', '/bɔːt/', 'đã mua (quá khứ của buy)', '🛍️', 'My mother bought me a new schoolbag.', 'Mẹ đã mua cho em một chiếc cặp mới.'],
  ['past_verbs', 'took', '/tʊk/', 'đã chụp/đưa (quá khứ của take)', '📸', 'We took a lot of photos last Sunday.', 'Chủ nhật trước chúng em đã chụp rất nhiều ảnh.'],
  ['past_verbs', 'wrote', '/rəʊt/', 'đã viết (quá khứ của write)', '✍️', 'Hoa wrote a letter to her pen friend.', 'Hoa đã viết thư cho người bạn qua thư.'],
  ['past_verbs', 'drank', '/dræŋk/', 'đã uống (quá khứ của drink)', '🥛', 'My sister drank a glass of milk.', 'Chị em đã uống một ly sữa.'],
  ['past_verbs', 'had', '/hæd/', 'đã có (quá khứ của have)', '🎁', 'We had a fun birthday party last week.', 'Tuần trước chúng em có một bữa tiệc sinh nhật vui vẻ.'],
];

export const VOCAB_WORDS: VocabWord[] = RAW_VOCAB.map((item, idx) => ({
  id: `v_${idx + 1}`,
  themeId: item[0],
  word: item[1],
  phonetic: item[2],
  meaningVi: item[3],
  emoji: item[4],
  exampleEn: item[5],
  exampleVi: item[6],
  audioUrl: `./audio/vocab/v_${idx + 1}.mp3`,
}));
