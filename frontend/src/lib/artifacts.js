export const ARTIFACTS = [
  // ── COMMON ───────────────────────────────────────────────
  {
    id: 'old_dumbbell',
    name: 'Стара Гантеля',
    icon: '🏋️',
    rarity: 'common',
    desc: 'Знайшов у бабусиному підвалі. Пахне совком.',
    effect: '+10 XP, але зроби 10 присідань прямо зараз',
    type: 'debuff_quest',
  },
  {
    id: 'protein_bar_fake',
    name: 'Протеїновий Батончик',
    icon: '🍫',
    rarity: 'common',
    desc: 'На упаковці написано 20г білка. Брехня.',
    effect: '+15 XP бонус до наступного запису',
    type: 'xp_bonus',
    value: 15,
  },
  {
    id: 'motivation_post',
    name: 'Мотивуючий Пост',
    icon: '📱',
    rarity: 'common',
    desc: '"Ти можеш усе!" — написав інфлюенсер з ліпосакцією',
    effect: '+5 XP та нескінченний сором за бездіяльність',
    type: 'xp_bonus',
    value: 5,
  },
  {
    id: 'gym_selfie',
    name: 'Селфі з Тренажерки',
    icon: '🤳',
    rarity: 'common',
    desc: 'Якщо не запостив — ніби й не тренувався',
    effect: 'Дебаф: зроби 15 стрибків на місці',
    type: 'debuff_quest',
  },
  {
    id: 'skuf_belly',
    name: 'Пузо Скуфа',
    icon: '🍺',
    rarity: 'common',
    desc: 'Нажите роками. Тепле. Своє. Рідне.',
    effect: 'Дебаф: з\'їж щось шкідливе і визнай це в журналі',
    type: 'debuff_quest',
  },
  {
    id: 'dirty_underpants',
    name: 'Обісрані Труси',
    icon: '🩲',
    rarity: 'common',
    desc: 'Загадковий артефакт невідомого походження. Нікому не показуй.',
    effect: '-15 XP. Доля глузує. Але ти вижив.',
    type: 'xp_penalty',
    value: -15,
  },
  {
    id: 'mamas_towel',
    name: 'Рушник Мами',
    icon: '🧣',
    rarity: 'common',
    desc: 'Пахне пирогами та любов\'ю. Дає силу.',
    effect: '+10 XP і відчуття що ти потрібний',
    type: 'xp_bonus',
    value: 10,
  },
  {
    id: 'neighbour_bychok',
    name: 'Бичок від Сусіда Петра',
    icon: '🚬',
    rarity: 'common',
    desc: '"Ну візьми, чого ти" — Петро, сходами',
    effect: '+5 XP але покашляй 5 разів для вигляду',
    type: 'debuff_quest',
  },
  { id: 'shaurma_bag', name: 'Шаурма в Пакеті', icon: '🥙', rarity: 'common', desc: 'Полудень скуфа. Пахне часником і рішеннями.', effect: '-10 XP. Але смачно.', type: 'xp_penalty', value: -10 },
  { id: 'dead_phone', name: 'Телефон на 1%', icon: '🔋', rarity: 'common', desc: 'Крокоміру кінець. Кроки не рахуються.', effect: 'Дебаф: зроби 20 стрибків щоб "зарядити"', type: 'debuff_quest' },
  { id: 'borscht_bucket', name: 'Відро Борщу', icon: '🍲', rarity: 'common', desc: 'Бабуся зварила. Відмовити неможливо.', effect: '+20 XP бо борщ — це сила', type: 'xp_bonus', value: 20 },
  { id: 'cat_meme', name: 'Мем з Котом', icon: '🐱', rarity: 'common', desc: 'Замість тренування ти знову дивишся меми.', effect: 'Дебаф: закрий телефон і зроби 10 віджимань', type: 'debuff_quest' },
  { id: 'kovbasa_sandwich', name: 'Бутерброд з Ковбасою', icon: '🥪', rarity: 'common', desc: '"Один не рахується" — так починається кожен злам.', effect: '-10 XP. Доля все бачить.', type: 'xp_penalty', value: -10 },
  { id: 'ozon_dumbbell', name: 'Гантеля з Ozonu', icon: '📦', rarity: 'common', desc: 'Замовив 2 тижні тому. Лежить у коробці розпакованою.', effect: 'Дебаф: розпакуй і зроби 15 підйомів прямо зараз', type: 'debuff_quest' },
  { id: 'straw_hat', name: 'Солом\'яний Капелюх', icon: '👒', rarity: 'common', desc: 'Надів — і вже виглядаєш як людина що слідкує за собою.', effect: '+8 XP духовне схуднення зараховано', type: 'xp_bonus', value: 8 },
  { id: 'expired_kefir', name: 'Прострочений Кефір', icon: '🥛', rarity: 'common', desc: 'Для сміливих. Детокс мимоволі.', effect: 'Рандом: або +15 XP або -15 XP', type: 'gamble', value: 15 },
  { id: 'lays_chips', name: 'Чипси Лейз', icon: '🍟', rarity: 'common', desc: '"Один пакетик" — Famous Last Words.', effect: '-12 XP. Сіль у рані — і на вазі.', type: 'xp_penalty', value: -12 },
  { id: 'grandma_tights', name: 'Колготки Бабусі', icon: '🧦', rarity: 'common', desc: 'Підтримуючі. В обох сенсах. Подаровані з любов\'ю.', effect: '+5 XP та відчуття родинної підтримки', type: 'xp_bonus', value: 5 },
  { id: 'broken_scale', name: 'Зламані Ваги', icon: '⚖️', rarity: 'common', desc: 'Показують одне і те саме. Незалежно від дня.', effect: 'Дебаф: запис ваги на оці без вагів. Як ти?', type: 'debuff_quest' },
  { id: 'diet_cola', name: 'Дієтична Кола', icon: '🥤', rarity: 'common', desc: '"Без цукру" — але з виною.', effect: '+5 XP за вибір менш шкідливого варіанту', type: 'xp_bonus', value: 5 },

  // ── UNCOMMON ─────────────────────────────────────────────
  {
    id: 'adidas_shoes',
    name: 'Кросівки "Адідас"',
    icon: '👟',
    rarity: 'uncommon',
    desc: 'Три смужки — три причини йти гуляти',
    effect: '+25 XP якщо сьогодні 10k+ кроків',
    type: 'steps_bonus',
    value: 25,
  },
  {
    id: 'cossack_thermos',
    name: 'Термос Козака',
    icon: '☕',
    rarity: 'uncommon',
    desc: 'Гарячий чай зігріває тіло і стрік',
    effect: 'Захист стріку: пропусти 1 день без скидання',
    type: 'streak_shield',
    value: 1,
  },
  {
    id: 'premium_buckwheat',
    name: 'Гречка Преміум',
    icon: '🍲',
    rarity: 'uncommon',
    desc: 'Золотий запас нації. Справжня.',
    effect: '+30 XP за правильне харчування сьогодні',
    type: 'xp_bonus',
    value: 30,
  },
  {
    id: 'yoga_mat',
    name: 'Килимок для Йоги',
    icon: '🧘',
    rarity: 'uncommon',
    desc: 'Використовується як підстилка для кота',
    effect: 'Дебаф: 5 хвилин розтяжки або -10 XP',
    type: 'debuff_or_penalty',
    value: 10,
  },
  {
    id: 'grandma_slipper',
    name: 'Тапок Бабусі',
    icon: '🥿',
    rarity: 'uncommon',
    desc: 'Метальна зброя ближнього бою. Боляче.',
    effect: '7 хвилин присідань або -20 XP. Бабуся дивиться.',
    type: 'debuff_or_penalty',
    value: 20,
  },
  {
    id: 'salo_first_grade',
    name: 'Сало Першого Сорту',
    icon: '🥓',
    rarity: 'uncommon',
    desc: 'Домашнє. З часником. Священне.',
    effect: '+35 XP просто тому що ти заслужив',
    type: 'xp_bonus',
    value: 35,
  },
  { id: 'water_bottle_2l', name: 'Пляшка Води 2л', icon: '💧', rarity: 'uncommon', desc: 'Лікар сказав 8 склянок. Вип\'єш 2. Зараховується.', effect: '+25 XP за водний баланс сьогодні', type: 'xp_bonus', value: 25 },
  { id: 'sport_leggings', name: 'Спортивні Лосини', icon: '🩱', rarity: 'uncommon', desc: 'Вдягнув — вже наполовину в тренажерці.', effect: 'Дебаф: 10 хвилин тренування або -15 XP', type: 'debuff_or_penalty', value: 15 },
  { id: 'protein_shaker', name: 'Протеїновий Шейкер', icon: '🧴', rarity: 'uncommon', desc: 'Пахне шоколадом і великими мріями.', effect: '+35 XP за тренування сьогодні', type: 'xp_bonus', value: 35 },
  { id: 'jump_rope', name: 'Скакалка', icon: '🪢', rarity: 'uncommon', desc: 'Дитинство, але болючіше.', effect: 'Дебаф: 100 стрибків або -15 XP', type: 'debuff_or_penalty', value: 15 },
  { id: 'morning_alarm', name: 'Ранковий Будильник', icon: '⏰', rarity: 'uncommon', desc: '5:30. Встав. Переміг ліжко. Ти герой.', effect: '+20 XP за ранній підйом', type: 'xp_bonus', value: 20 },
  { id: 'office_slippers', name: 'Офісні Капці', icon: '🥾', rarity: 'uncommon', desc: 'З офісу не виходив. Фіксується.', effect: 'Дебаф: 15 хвилин прогулянки або -20 XP', type: 'debuff_or_penalty', value: 20 },
  { id: 'homemade_mead', name: 'Медовуха Дідова', icon: '🍯', rarity: 'uncommon', desc: 'З підвалу. Рік витримки. Стрік захищено.', effect: 'Захист стріку: пропусти 1 день без скидання', type: 'streak_shield', value: 1 },
  { id: 'scooter', name: 'Самокат', icon: '🛴', rarity: 'uncommon', desc: 'Їдеш — але виглядаєш як спортсмен.', effect: '+25 XP якщо сьогодні доїхав кудись без машини', type: 'xp_bonus', value: 25 },
  { id: 'vyshyvanka', name: 'Вишиванка', icon: '👕', rarity: 'uncommon', desc: 'В неї хочеться бути кращим. І стрункішим.', effect: '+20 XP національна гордість дає силу', type: 'xp_bonus', value: 20 },
  { id: 'fathers_belt', name: 'Батьківський Ремінь', icon: '🔱', rarity: 'uncommon', desc: '"Доки живеш у моєму домі..." — Тато, завжди.', effect: 'Дебаф: 20 віджимань або вічний сором перед батьком', type: 'debuff_or_penalty', value: 20 },
  { id: 'salmon_piece', name: 'Кусок Лосося', icon: '🐟', rarity: 'uncommon', desc: 'Омега-3. Мозок каже дякую.', effect: '+30 XP за рибний правильний день', type: 'xp_bonus', value: 30 },
  { id: 'garden_shovel', name: 'Лопата Городника', icon: '🪣', rarity: 'uncommon', desc: 'Фізична праця — теж тренування. Дід так казав.', effect: '+25 XP за фізичну роботу замість спортзалу', type: 'xp_bonus', value: 25 },
  { id: 'bike', name: 'Старий Велосипед', icon: '🚲', rarity: 'uncommon', desc: 'Іржавий але їздить. Як і ти.', effect: '+30 XP якщо сьогодні їздив на велосипеді', type: 'steps_bonus', value: 30 },
  { id: 'coffee_thermos', name: 'Термос з Кавою', icon: '☕', rarity: 'uncommon', desc: 'Не спав до 2-ї ночі. Але вагу записав.', effect: '+15 XP за незламну відданість', type: 'xp_bonus', value: 15 },

  // ── RARE ─────────────────────────────────────────────────
  {
    id: 'lviv_beer',
    name: 'Пиво Львівське 1715',
    icon: '🍺',
    rarity: 'rare',
    desc: 'Заслужив, воїне. Місто лева схвалює.',
    effect: 'Дозволяє 1 пиво без жодних штрафів',
    type: 'allow_beer',
    value: 1,
  },
  {
    id: 'magic_burger',
    name: 'Бургер МакМагічний',
    icon: '🍔',
    rarity: 'rare',
    desc: '"Та один бургер не рахується" — Sun Tzu',
    effect: '1 фастфуд без штрафних санкцій',
    type: 'allow_fastfood',
    value: 1,
  },
  {
    id: 'lucky_scales',
    name: 'Щасливі Ваги',
    icon: '⚖️',
    rarity: 'rare',
    desc: 'Показують на 0.5 кг менше. Технічно не брехня.',
    effect: '-0.5 кг від зафіксованої ваги (лише один раз)',
    type: 'weight_reduce',
    value: 0.5,
  },
  {
    id: 'uncle_bob_advice',
    name: 'Порада Дядька Бориса',
    icon: '👴',
    rarity: 'rare',
    desc: '"Я в твої роки 20 км пішки ходив на роботу"',
    effect: '+50 XP, але зроби 20 хвилин прогулянки',
    type: 'debuff_quest_bonus',
    value: 50,
  },
  {
    id: 'gigachad_aura',
    name: 'Аура Гігачада',
    icon: '😤',
    rarity: 'rare',
    desc: 'Ти просто заходиш — і всі мовчать. Поважають.',
    effect: '+60 XP та імунітет до сорому на 1 день',
    type: 'xp_bonus',
    value: 60,
  },
  {
    id: 'shevchenko_icon',
    name: 'Ікона Тараса',
    icon: '📜',
    rarity: 'rare',
    desc: 'Борітеся — поборете. Він про дієту теж так думав.',
    effect: '+50 XP та поетичне натхнення на весь день',
    type: 'xp_bonus',
    value: 50,
  },

  { id: 'sport_medal',       name: 'Медаль "За Спорт"',        icon: '🏅', rarity: 'rare', desc: 'Куплена на ринку але мотивує. Це головне.',             effect: '+70 XP якщо сьогодні побив рекорд кроків',         type: 'xp_bonus', value: 70 },
  { id: 'gym_ticket',        name: 'Квиток у Тренажерку',      icon: '🎟️', rarity: 'rare', desc: 'Ти заплатив за місяць. 2 рази сходив. Давай ще.',        effect: '+60 XP і нагадування що гроші вже сплачені',       type: 'xp_bonus', value: 60 },
  { id: 'zero_soda',         name: 'Газировка Zero',            icon: '🫙', rarity: 'rare', desc: '0 калорій. 100% вини. Але технічно можна.',             effect: '1 солодке без штрафів. Нуль є нуль.',              type: 'allow_fastfood', value: 1 },
  { id: 'buckwheat_diet',    name: 'Гречана Дієта',             icon: '🥣', rarity: 'rare', desc: 'Нація підтримує. Організм — поки теж.',                 effect: '+50 XP за день без шкідливого харчування',        type: 'xp_bonus', value: 50 },
  { id: 'calorie_notebook',  name: 'Блокнот Калорій',           icon: '📓', rarity: 'rare', desc: 'Записуєш все. Навіть той бутерброд о 23:00.',           effect: '+45 XP за чесність перед собою сьогодні',         type: 'xp_bonus', value: 45 },
  { id: 'sauna_pass',        name: 'Пропуск до Сауни',          icon: '🧖', rarity: 'rare', desc: 'Схуд парою. Легально. Доктор схвалює.',                 effect: '-0.5 кг від зафіксованої ваги (один раз)',        type: 'weight_reduce', value: 0.5 },
  { id: 'finish_tape',       name: 'Стрічка Фінішу',            icon: '🎗️', rarity: 'rare', desc: 'Ти дістався. Неважливо якою дорогою.',                  effect: '+65 XP за досягнення тижневої цілі',              type: 'xp_bonus', value: 65 },
  { id: 'healthy_recipe',    name: 'Книга Рецептів',            icon: '📖', rarity: 'rare', desc: 'Відкрив на сторінці 3. Зварив. Їв із задоволенням.',    effect: '+50 XP за приготований корисний обід',            type: 'xp_bonus', value: 50 },
  { id: 'body_tape',         name: 'Сантиметрова Стрічка',      icon: '📏', rarity: 'rare', desc: 'Вимірював талію. Результат несподіваний... в кращий бік.', effect: '-0.5 кг умовно. Ти точно менший.',            type: 'weight_reduce', value: 0.5 },
  { id: 'olive_oil',         name: 'Оливкова Олія',             icon: '🫒', rarity: 'rare', desc: 'Середземноморська дієта схвалена ВООЗ і твоєю совістю.', effect: '+45 XP і повага від дієтолога',                 type: 'xp_bonus', value: 45 },
  { id: 'motivation_kit',    name: 'Аптечка Мотивації',         icon: '🧰', rarity: 'rare', desc: 'Містить: ціль, план, і крихту сорому.',                 effect: '+55 XP та захист стріку 1 день',                  type: 'streak_shield', value: 1 },
  { id: 'protein_powder',    name: 'Протеїновий Порошок',       icon: '🥄', rarity: 'rare', desc: '"Це не замінник їжі" — написано на банці. Ігноруєш.',   effect: '+55 XP за тренування з допомогою науки',          type: 'xp_bonus', value: 55 },
  { id: 'running_watch',     name: 'Розумний Годинник',          icon: '⌚', rarity: 'rare', desc: 'Вібрує кожні 30 хвилин. Ти встаєш. Він перемагає.',    effect: '+50 XP і автоматичне нагадування рухатись',       type: 'xp_bonus', value: 50 },
  { id: 'hiking_boots',      name: 'Трекінгові Черевики',       icon: '🥾', rarity: 'rare', desc: 'Купив у гори. Ходиш до магазину. Але красиво.',         effect: '+50 XP якщо сьогодні 8k+ кроків',                type: 'steps_bonus', value: 50 },

  // ── EPIC ─────────────────────────────────────────────────
  {
    id: 'cheat_ring',
    name: 'Кільце Чіт-Коду',
    icon: '💍',
    rarity: 'epic',
    desc: '↑↑↓↓←→←→BA. Активовано. Штрафи відключені.',
    effect: 'Ігнорує штрафну зону 1 раз (навіть червону)',
    type: 'penalty_immunity',
    value: 1,
  },
  {
    id: 'schwarzenegger_ghost',
    name: 'Привид Шварценеггера',
    icon: '👻',
    rarity: 'epic',
    desc: '"I\'ll be back... після тренування" — Арнольд',
    effect: '+150 XP та 5000 безкоштовних кроків зараховано',
    type: 'xp_bonus',
    value: 150,
  },
  {
    id: 'weight_joystick',
    name: 'Джойстик Ваги',
    icon: '🎮',
    rarity: 'epic',
    desc: 'Press X to lose weight. Press B для бургера.',
    effect: '2x XP за наступний щоденний запис',
    type: 'xp_multiplier',
    value: 2,
  },
  {
    id: 'shaurma_vip',
    name: 'Шаурма VIP',
    icon: '🌯',
    rarity: 'epic',
    desc: 'З подвійним м\'ясом і без каяття',
    effect: 'Один нездоровий прийом їжі без штрафів та сорому',
    type: 'allow_fastfood',
    value: 1,
  },
  {
    id: 'cossack_pipe',
    name: 'Козацька Люлька',
    icon: '🪈',
    rarity: 'epic',
    desc: 'Дим розганяє тривогу і зайві калорії.',
    effect: 'Дозволяє 1 алкоголь без штрафів і з козацькою гідністю',
    type: 'allow_beer',
    value: 1,
  },
  {
    id: 'zaluzhnyi_cap',
    name: 'Кепка Залужного',
    icon: '🧢',
    rarity: 'epic',
    desc: 'Надягнув — і одразу стратег. Поважають.',
    effect: '+100 XP та 10 000 кроків зараховано автоматично',
    type: 'xp_bonus',
    value: 100,
  },
  {
    id: 'ufo_over_ukraine',
    name: 'НЛО над Батьківщиною',
    icon: '🛸',
    rarity: 'epic',
    desc: 'Ніхто не знає звідки. Ніхто не знає навіщо.',
    effect: 'Рандом: або +300 XP або 30 присідань і 10 хв бігу',
    type: 'gamble',
    value: 300,
  },

  { id: 'gold_headphones',   name: 'Золоті Навушники',          icon: '🎧', rarity: 'epic', desc: 'Плейліст підібрано. Тіло вже хоче бігти.',              effect: '3x XP за наступне фізичне тренування',            type: 'xp_multiplier', value: 3 },
  { id: 'marathon_trophy',   name: 'Трофей Марафонця',          icon: '🏆', rarity: 'epic', desc: 'Ти не бігав марафон. Але відчуваєш ніби так.',           effect: '+200 XP за 20k+ кроків сьогодні',                 type: 'xp_bonus', value: 200 },
  { id: 'magic_scales_2',    name: 'Магічні Ваги 2.0',          icon: '🔮', rarity: 'epic', desc: 'Преміум версія. Показують на 1 кг менше.',              effect: '-1 кг від зафіксованої ваги. Преміум обман.',     type: 'weight_reduce', value: 1.0 },
  { id: 'dietologist_cert',  name: 'Сертифікат Дієтолога',      icon: '📋', rarity: 'epic', desc: 'Куплений на Розетці. Але знання справжні.',             effect: '1 тиждень без штрафів за харчування',             type: 'legendary_buff', value: 7 },
  { id: 'balcony_bar',       name: 'Турнік з Балкону',           icon: '🏗️', rarity: 'epic', desc: 'Сусіди знизу нервово дивляться вгору.',                 effect: '2x XP за тренування. Сусіди мовчки заздрять.',    type: 'xp_multiplier', value: 2 },
  { id: 'smaller_pants',     name: 'Штани на 2 Розміри Менше',  icon: '👖', rarity: 'epic', desc: 'Купив авансом. Тепер є стимул. Серйозний.',             effect: '+250 XP за досягнення нової вагової відмітки',    type: 'xp_bonus', value: 250 },
  { id: 'magic_wand',        name: 'Чарівна Паличка Дієти',     icon: '🪄', rarity: 'epic', desc: 'Де замовив — незрозуміло. Але магія є.',               effect: 'Рандом: або -1 кг або 50 присідань прямо зараз',  type: 'gamble', value: 0 },
  { id: 'willpower_cup',     name: 'Кубок Сили Волі',            icon: '🏛️', rarity: 'epic', desc: 'Важкий. Золотий. Заслужений.',                          effect: 'Імунітет до штрафів + 2x XP на 1 день',           type: 'penalty_immunity', value: 1 },
  { id: 'thermonuclear_coffee', name: 'Термоядерна Кава',       icon: '☢️', rarity: 'epic', desc: 'Прокинувся. Побіг. Серце не погоджувалось але ноги побігли.', effect: '+200 XP але зроби 15 стрибків для "виходу заряду"', type: 'debuff_quest_bonus', value: 200 },
  { id: 'borsetka',          name: 'Борсетка Успіху',            icon: '👜', rarity: 'epic', desc: 'Прогулянка стала стильнішою і впевненішою.',            effect: '+180 XP та автоматичні 5000 кроків зараховано',   type: 'xp_bonus', value: 180 },
  { id: 'dragon_kimono',     name: 'Кімоно Дракона',             icon: '🥋', rarity: 'epic', desc: 'Надів — і захотів тренуватись. Це вже перемога.',       effect: '+180 XP та імунітет до дебафів на 2 дні',         type: 'legendary_buff', value: 2 },
  { id: 'fish_tank',         name: 'Акваріум з Коропом',         icon: '🐠', rarity: 'epic', desc: 'Медитація. 5 хвилин дивишся — і спокій у душі.',        effect: '+150 XP та дзен. Стрік захищено.',                type: 'streak_shield', value: 1 },
  { id: 'diet_drop_epic',    name: 'Вільний Прийом Їжі',         icon: '🍽️', rarity: 'epic', desc: '"Чит-міл" — кажуть інфлюенсери. Ти погоджуєшся.',      effect: '1 повноцінний прийом будь-якої їжі без штрафів',  type: 'allow_fastfood', value: 1 },

  // ── LEGENDARY ────────────────────────────────────────────
  {
    id: 'cossack_kettlebell',
    name: 'Золота Гиря Козака',
    icon: '🏅',
    rarity: 'legendary',
    desc: 'Передається від покоління до покоління. Важить 32кг.',
    effect: '+500 XP миттєво. Предки пишаються.',
    type: 'xp_bonus',
    value: 500,
  },
  {
    id: 'anti_burger_sword',
    name: 'Меч Анти-Бургер',
    icon: '⚔️',
    rarity: 'legendary',
    desc: 'Рубає калорії без пощади. +10 до харизми.',
    effect: '2x XP та імунітет до штрафів на наступні 3 дні',
    type: 'legendary_buff',
    value: 3,
  },
  {
    id: 'pandora_box',
    name: 'Скриня Пандори',
    icon: '📦',
    rarity: 'legendary',
    desc: 'Відкрий якщо наважишся. Або не відкривай. Вибір твій.',
    effect: 'Рандом: або +800 XP або 50 присідань прямо зараз',
    type: 'gamble',
    value: 0,
  },
  {
    id: 'gigachad_aura_max',
    name: 'Аура Гігачада MAX',
    icon: '🦁',
    rarity: 'legendary',
    desc: 'Повна форма. Волосся розвівається в безвітряну погоду.',
    effect: '2x XP на наступні 5 днів. Натовп аплодує стоячи.',
    type: 'legendary_buff',
    value: 5,
  },
  {
    id: 'zsu_tractor',
    name: 'Трактор ЗСУ',
    icon: '🚜',
    rarity: 'legendary',
    desc: 'Трофей. Тягне все — танки, калорії, депресію.',
    effect: '+800 XP миттєво. Степові предки схвалюють.',
    type: 'xp_bonus',
    value: 800,
  },
  {
    id: 'zaporizhian_trousers',
    name: 'Шаровари Запорожця',
    icon: '🩳',
    rarity: 'legendary',
    desc: 'Широкі. Вільні. Ніякого дієтичного тиску.',
    effect: 'Всі штрафи та дебафи відключено на 7 днів',
    type: 'legendary_buff',
    value: 7,
  },
  { id: 'hetman_mace',       name: 'Булава Гетьмана',           icon: '🪃', rarity: 'legendary', desc: 'Веди за собою. До перемоги над вагою.',               effect: '+1000 XP миттєво. Народ визнає лідера.',           type: 'xp_bonus', value: 1000 },
  { id: 'mazepas_hat',       name: 'Шапка Мазепи',              icon: '🎩', rarity: 'legendary', desc: 'Стратег. Дипломат. Дієтолог.',                         effect: '+800 XP та всі штрафи скасовано на 3 дні',        type: 'legendary_buff', value: 3 },
  { id: 'dnipro_water',      name: 'Свята Вода Дніпра',         icon: '🌊', rarity: 'legendary', desc: 'Очищає гріхи харчування з 988 року.',                  effect: 'Штрафи за їжу скасовано на 5 днів. Чисто.',       type: 'legendary_buff', value: 5 },
  { id: 'cossack_mustang',   name: 'Кінь Козацький',            icon: '🐎', rarity: 'legendary', desc: 'Скачи вперед. Калорії не встигнуть.',                  effect: '+600 XP та 15 000 кроків зараховано',             type: 'xp_bonus', value: 600 },
  { id: 'fate_finger',       name: 'Перст Долі',                icon: '☝️', rarity: 'legendary', desc: 'Доля вказує. Ти підкоряєшся.',                         effect: 'Рандом: або +1500 XP або 100 присідань і 5 км',   type: 'gamble', value: 0 },
  { id: 'heavenly_trident',  name: 'Тризуб Небесний',           icon: '🔱', rarity: 'legendary', desc: 'Символ нації. Символ твоєї перемоги над вагою.',        effect: '2x XP та захист стріку на 7 днів',                type: 'legendary_buff', value: 7 },
  { id: 'crown_of_slim',     name: 'Корона Схудлих',            icon: '👑', rarity: 'legendary', desc: 'Перша і єдина в Україні. Ти заслужив її.',             effect: '+1200 XP. Легенда фітнес-кімнати.',               type: 'xp_bonus', value: 1200 },
  { id: 'cossack_cross',     name: 'Хрест Козацький',           icon: '✝️', rarity: 'legendary', desc: 'Захищає від всього: штрафів, спокус і лінощів.',       effect: '+900 XP та захист від штрафів на тиждень',        type: 'legendary_buff', value: 7 },
  { id: 'taras_sword',       name: 'Булат Тараса',              icon: '🗡️', rarity: 'legendary', desc: 'Борітеся — поборете. Схуднете — здивуєте.',            effect: 'Безкоштовні 20k кроків + 2x XP на 3 дні',         type: 'legendary_buff', value: 3 },
  { id: 'iron_helmet',       name: 'Козацький Шолом',           icon: '⛑️', rarity: 'legendary', desc: 'Непробивний. Штрафи, дебафи, спокуси — відхиляються.', effect: 'Штрафи та дебафи відхиляються на 5 днів',         type: 'legendary_buff', value: 5 },
  { id: 'hetman_scepter',    name: 'Скіпетр Гетьмана',         icon: '🏺', rarity: 'legendary', desc: 'Влада над вагою і долею.',                             effect: '+800 XP та 3x XP за наступні 2 дні',             type: 'legendary_buff', value: 2 },
  { id: 'cossack_bandura',   name: 'Бандура Козацька',          icon: '🪕', rarity: 'legendary', desc: 'Заграв — і сам схуд від краси музики.',               effect: '+700 XP. Душа співає, тіло худне.',               type: 'xp_bonus', value: 700 },
  { id: 'magic_borsch',      name: 'Магічний Борщ',             icon: '🍜', rarity: 'legendary', desc: 'Рецепт передається 300 років. Нарешті у тебе.',        effect: 'Всі штрафи скасовано + 2x XP на 3 дні',           type: 'legendary_buff', value: 3 },
  { id: 'cossack_eagle',     name: 'Козацький Орел',            icon: '🦅', rarity: 'legendary', desc: 'Летить над степом. Дивиться на тебе. Схвалює.',        effect: '+1500 XP миттєво. Степові предки плачуть від гордості.', type: 'xp_bonus', value: 1500 },
];

export const CHESTS = [
  {
    id: 'chest_wood',
    name: 'Дерев\'яний Ящик',
    icon: '📫',
    rarity: 'common',
    desc: 'Знайшов на смітнику. Всередині щось брязкає.',
    rarityPool: ['common', 'uncommon'],
  },
  {
    id: 'chest_iron',
    name: 'Залізний Куфр',
    icon: '🗃️',
    rarity: 'uncommon',
    desc: 'Бабусин. Пахне нафталіном та таємницями.',
    rarityPool: ['uncommon', 'rare'],
  },
  {
    id: 'chest_gold',
    name: 'Козацька Скриня',
    icon: '🧰',
    rarity: 'rare',
    desc: 'Знайшов у степу. Поруч не було нікого... або було?',
    rarityPool: ['rare', 'epic'],
  },
  {
    id: 'chest_epic',
    name: 'Гетьманська Скарбниця',
    icon: '💼',
    rarity: 'epic',
    desc: 'З особистих покоїв. Печатка Мазепи не зламана.',
    rarityPool: ['epic', 'legendary'],
  },
  {
    id: 'chest_legendary',
    name: 'Скриня Мамая',
    icon: '🎁',
    rarity: 'legendary',
    desc: 'Мамай грав бандуру і посміхався. Ти теж посміхнешся.',
    rarityPool: ['legendary'],
  },
];

export const ARTIFACT_SETS = [
  {
    id: 'total_skuf',
    name: 'Тотальний Скуф',
    icon: '🍺',
    desc: 'Зібрав увесь набір справжнього скуфа. Нація впізнає свого.',
    pieces: ['skuf_belly', 'dirty_underpants', 'kovbasa_sandwich'],
    bonus: 'Жиробас 3 Рівня: +200 XP але зроби 30 присідань і поважай себе',
    bonusType: 'debuff_quest_bonus',
  },
  {
    id: 'simp_normis',
    name: 'Сімп Норміс',
    icon: '🧣',
    desc: 'Мама схвалює. Подружка не знає. Інстаграм в курсі.',
    pieces: ['mamas_towel', 'motivation_post', 'gym_selfie'],
    bonus: 'Схвалений Мамою: стрік захищено 3 дні + +300 XP',
    bonusType: 'streak_shield',
  },
  {
    id: 'sigma_grindset',
    name: 'Сигма Грайндсет',
    icon: '😤',
    desc: 'Одиночка. Хижак. Дієта без компромісів.',
    pieces: ['gigachad_aura', 'gigachad_aura_max', 'zaluzhnyi_cap'],
    bonus: 'Сигма Максимум: +500 XP та всі штрафи знімаються на 3 дні',
    bonusType: 'legendary_buff',
  },
  {
    id: 'cossack_glory',
    name: 'Козацька Слава',
    icon: '🚜',
    desc: 'Чотири символи сили. Запорізька Січ схвалила твій фітнес.',
    pieces: ['zsu_tractor', 'cossack_kettlebell', 'zaporizhian_trousers', 'heavenly_trident'],
    bonus: '+2000 XP миттєво. Предки зі степу пишаються і плачуть.',
    bonusType: 'xp_bonus',
  },
  {
    id: 'beer_puzzle',
    name: 'Пивний Пазл',
    icon: '🍻',
    desc: 'Три артефакти — одна велика любов до напою.',
    pieces: ['lviv_beer', 'cossack_pipe', 'homemade_mead'],
    bonus: 'Тиждень Свободи: пиво та алкоголь без штрафів 7 днів',
    bonusType: 'allow_beer',
  },
  {
    id: 'dream_dietologist',
    name: 'Дієтолог Мрії',
    icon: '📋',
    desc: 'Ти знаєш більше за лікаря. І менше їси за нього.',
    pieces: ['calorie_notebook', 'buckwheat_diet', 'healthy_recipe'],
    bonus: 'Ліцензія Здоров\'я: всі харчові штрафи знімаються на 14 днів',
    bonusType: 'legendary_buff',
  },
  {
    id: 'olympic_team',
    name: 'Олімпійська Збірна',
    icon: '🏅',
    desc: 'Чотири атрибути спортсмена. Золото для України.',
    pieces: ['running_watch', 'hiking_boots', 'marathon_trophy', 'gold_headphones'],
    bonus: 'Золота Медаль: 2x XP за кроки та +500 XP бонус',
    bonusType: 'legendary_buff',
  },
  {
    id: 'fate_master',
    name: 'Майстер Долі',
    icon: '🎲',
    desc: 'Три рандомних артефакти — одна непередбачувана людина.',
    pieces: ['fate_finger', 'pandora_box', 'expired_kefir'],
    bonus: 'Улюбленець Долі: наступний гембл-ефект завжди дає максимум',
    bonusType: 'gamble',
  },
];

export function checkSets(inventoryItems) {
  const owned = new Set(inventoryItems.map(i => i.artifact_id));
  return ARTIFACT_SETS.map(set => ({
    ...set,
    ownedCount: set.pieces.filter(p => owned.has(p)).length,
    completed: set.pieces.every(p => owned.has(p)),
  }));
}

export const RARITY_CONFIG = {
  common:    { label: 'Звичайний',   color: 'text-slate-400',   border: 'border-slate-600',    bg: 'bg-slate-800/30',    glow: '' },
  uncommon:  { label: 'Незвичайний', color: 'text-green-400',   border: 'border-green-600/60', bg: 'bg-green-900/20',   glow: '' },
  rare:      { label: 'Рідкісний',   color: 'text-blue-400',    border: 'border-blue-500/60',  bg: 'bg-blue-900/20',    glow: '' },
  epic:      { label: 'Епічний',     color: 'text-purple-400',  border: 'border-purple-500/70', bg: 'bg-purple-900/20', glow: 'shadow-purple-500/20 shadow-md' },
  legendary: { label: 'Легендарний', color: 'text-yellow-400',  border: 'border-yellow-400/80', bg: 'bg-yellow-900/20', glow: 'shadow-yellow-400/40 shadow-lg' },
};

const RARITY_WEIGHTS = { common: 45, uncommon: 30, rare: 17, epic: 6, legendary: 2 };
const CHEST_WEIGHTS  = { common: 50, uncommon: 30, rare: 14, epic: 5, legendary: 1 };
const DROP_CHANCE    = 0.25; // 25% artifact per log
const CHEST_CHANCE   = 0.10; // 10% chest per log

function pickRarity(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let roll = Math.random() * total;
  for (const [r, w] of entries) {
    roll -= w;
    if (roll <= 0) return r;
  }
  return entries[0][0];
}

export function rollArtifact() {
  if (Math.random() > DROP_CHANCE) return null;
  const rarity = pickRarity(RARITY_WEIGHTS);
  const pool = ARTIFACTS.filter(a => a.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

export function rollChest() {
  if (Math.random() > CHEST_CHANCE) return null;
  const rarity = pickRarity(CHEST_WEIGHTS);
  const pool = CHESTS.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

export function openChest(chest) {
  const pool = ARTIFACTS.filter(a => chest.rarityPool.includes(a.rarity));
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getArtifact(id) {
  return ARTIFACTS.find(a => a.id === id);
}

export function getChest(id) {
  return CHESTS.find(c => c.id === id);
}

export function getItem(id) {
  return getChest(id) || getArtifact(id);
}
