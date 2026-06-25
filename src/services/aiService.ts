/**
 * AI service — MOCK implementation.
 *
 * No ANTHROPIC_API_KEY is configured for this build, so every function here
 * returns simulated data instead of calling the real Claude Vision /
 * Messages API. The function signatures and JSON shapes match the prompts
 * defined in PRD.md section 9, so swapping in a real `anthropic` SDK call
 * (model: "claude-sonnet-4-6") later only requires replacing the body of
 * each function below — callers do not need to change.
 */
import {
  ActivityDay,
  ActivityPlan,
  DishAnalysis,
  Goal,
  Intensity,
  NutritionNorms,
  NutritionPlan,
  PlanDay,
  PlanMeal,
  UserProfile,
} from "../types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_DISHES: DishAnalysis[] = [
  {
    name: "Греческий салат",
    weight_g: 250,
    kcal: 180,
    protein_g: 6,
    fat_g: 14,
    carbs_g: 8,
    note: "Оценочно, без учёта заправки",
  },
  {
    name: "Куриная грудка с рисом",
    weight_g: 320,
    kcal: 450,
    protein_g: 38,
    fat_g: 9,
    carbs_g: 52,
    note: "Оценочно, точный состав гарнира не определён",
  },
  {
    name: "Овсяная каша с фруктами",
    weight_g: 280,
    kcal: 310,
    protein_g: 9,
    fat_g: 6,
    carbs_g: 55,
    note: "Оценочно, без учёта добавленного сахара",
  },
  {
    name: "Паста Карбонара",
    weight_g: 300,
    kcal: 520,
    protein_g: 20,
    fat_g: 24,
    carbs_g: 58,
    note: "Оценочно, калорийность соуса варьируется",
  },
];

/**
 * Mock equivalent of sending the photo to Claude Vision with the prompt
 * from PRD.md §9 ("Анализ фото блюда"). Picks a plausible random dish.
 */
export async function analyzeDishPhoto(_imageUri: string): Promise<DishAnalysis> {
  await delay(1200 + Math.random() * 800);
  const dish = MOCK_DISHES[Math.floor(Math.random() * MOCK_DISHES.length)];
  return { ...dish };
}

const DAY_NAMES = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const MEAL_NAME_POOL: Record<Goal, { breakfast: string[]; lunch: string[]; dinner: string[]; snack: string[] }> = {
  lose: {
    breakfast: ["Овсянка с ягодами", "Омлет с овощами", "Греческий йогурт с орехами"],
    lunch: ["Куриная грудка с овощами", "Салат с тунцом", "Гречка с рыбой на пару"],
    dinner: ["Запечённая рыба с брокколи", "Творог с зеленью", "Овощной суп с курицей"],
    snack: ["Яблоко", "Горсть миндаля", "Морковные палочки с хумусом"],
  },
  maintain: {
    breakfast: ["Овсянка с бананом", "Яичница с тостом", "Сырники со сметаной"],
    lunch: ["Куриный суп", "Паста с овощами", "Плов с курицей"],
    dinner: ["Стейк с овощами на гриле", "Запеканка с творогом", "Рыба с рисом"],
    snack: ["Йогурт", "Банан", "Сэндвич с индейкой"],
  },
  gain: {
    breakfast: ["Овсянка с орехами и мёдом", "Омлет с сыром и беконом", "Творог с гранолой"],
    lunch: ["Паста с мясным соусом", "Бурito с курицей и рисом", "Гречка с говядиной"],
    dinner: ["Стейк с картофелем", "Лосось с киноа", "Курица с пастой"],
    snack: ["Протеиновый батончик", "Орехи и сухофрукты", "Бутерброд с арахисовой пастой"],
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Mock equivalent of the "План питания" prompt from PRD.md §9.
 * Distributes the daily kcal norm across breakfast/lunch/dinner/snack.
 */
export async function generateNutritionPlan(
  _profile: UserProfile,
  norms: NutritionNorms
): Promise<NutritionPlan> {
  await delay(1500 + Math.random() * 1000);

  const goal: Goal = _profile.goal;
  const split = { breakfast: 0.25, lunch: 0.35, dinner: 0.3, snack: 0.1 };

  const days: PlanDay[] = DAY_NAMES.map((day) => {
    const meals: PlanMeal[] = [
      {
        type: "breakfast",
        name: pick(MEAL_NAME_POOL[goal].breakfast),
        kcal: Math.round(norms.kcal * split.breakfast),
      },
      {
        type: "lunch",
        name: pick(MEAL_NAME_POOL[goal].lunch),
        kcal: Math.round(norms.kcal * split.lunch),
      },
      {
        type: "dinner",
        name: pick(MEAL_NAME_POOL[goal].dinner),
        kcal: Math.round(norms.kcal * split.dinner),
      },
      {
        type: "snack",
        name: pick(MEAL_NAME_POOL[goal].snack),
        kcal: Math.round(norms.kcal * split.snack),
      },
    ];
    const total_kcal = meals.reduce((sum, m) => sum + m.kcal, 0);
    return { day, meals, total_kcal };
  });

  const tips = [
    "Пейте достаточно воды — не менее 1.5–2 литров в день.",
    "Старайтесь есть в одно и то же время для стабилизации обмена веществ.",
    "Добавляйте овощи к каждому приёму пищи для клетчатки и микроэлементов.",
  ];

  return { days, tips, generatedAt: new Date().toISOString() };
}

const ACTIVITY_POOL: Record<Goal, { activity: string; description: string }[]> = {
  lose: [
    { activity: "Бег трусцой", description: "Лёгкий бег в комфортном темпе для жиросжигания" },
    { activity: "Силовая тренировка", description: "Базовые упражнения на все группы мышц" },
    { activity: "Велопрогулка", description: "Кардионагрузка низкой ударности на суставы" },
    { activity: "Плавание", description: "Равномерная нагрузка на всё тело" },
    { activity: "Йога", description: "Восстановление и гибкость" },
  ],
  maintain: [
    { activity: "Силовая тренировка", description: "Поддержание мышечного тонуса" },
    { activity: "Пробежка", description: "Поддержание сердечно-сосудистой системы в тонусе" },
    { activity: "Функциональная тренировка", description: "Круговая тренировка на выносливость" },
    { activity: "Прогулка быстрым шагом", description: "Активное восстановление" },
    { activity: "Растяжка", description: "Поддержание подвижности суставов" },
  ],
  gain: [
    { activity: "Силовая тренировка (база)", description: "Жим, тяга, приседания с прогрессией веса" },
    { activity: "Силовая тренировка (верх тела)", description: "Грудь, спина, плечи, руки" },
    { activity: "Силовая тренировка (низ тела)", description: "Ноги и ягодичные мышцы" },
    { activity: "Лёгкое кардио", description: "Поддержание выносливости без сжигания мышечной массы" },
    { activity: "Отдых / растяжка", description: "Восстановление перед следующим циклом нагрузок" },
  ],
};

function intensityForGoal(goal: Goal): Intensity {
  const options: Intensity[] = goal === "lose" ? ["средняя", "высокая"] : goal === "gain" ? ["высокая", "средняя"] : ["низкая", "средняя"];
  return pick(options);
}

/**
 * Mock equivalent of the "План активности" prompt from PRD.md §9.
 */
export async function generateActivityPlan(profile: UserProfile): Promise<ActivityPlan> {
  await delay(1500 + Math.random() * 1000);

  const goal = profile.goal;
  const pool = ACTIVITY_POOL[goal];

  const schedule: ActivityDay[] = DAY_NAMES.map((day, idx) => {
    const item = pool[idx % pool.length];
    const intensity = intensityForGoal(goal);
    const duration_min = intensity === "высокая" ? 45 : intensity === "средняя" ? 35 : 20;
    const caloriesPerMinute = intensity === "высокая" ? 9 : intensity === "средняя" ? 6 : 3;
    return {
      day,
      activity: item.activity,
      duration_min,
      intensity,
      calories_burned: Math.round(duration_min * caloriesPerMinute),
      description: item.description,
    };
  });

  const weekly_tips = [
    "Разминка перед тренировкой снижает риск травм.",
    "Соблюдайте хотя бы 1 день полного отдыха в неделю.",
    "Следите за восстановлением: сон не менее 7–8 часов.",
  ];

  return { schedule, weekly_tips, generatedAt: new Date().toISOString() };
}
