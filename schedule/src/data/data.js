export const groups = [
    {
      id: 1,
      flow: 1,
      specialty: 'ПИ',
      number: '5',
      subgroup: 1,
      name: '1 - ПИ - 5 (подгр. 1)'
    },
    {
        id: 2,
        flow: 1,
        specialty: 'КБ',
        number: '6',
        subgroup: '',
        name: '1 - КБ - 6'
      },
  ];
  
  export const subjects = [
    { id: 1, name: 'Стат РФ' },
    { id: 2, name: 'ЦОС' },
    { id: 3, name: 'МАИС' },
  ];
  
  export const teachers = [
    {
      id: 1,
      name: 'Хейдоров И. Э.',
      schedule: [
        [1, 4], // Понедельник, 4 пара
        [1, 4], // Вторник, 4 пара
        [1, 2, 3], // Среда, 2, 3, 4 пара
        [1, 4], // Четверг, 4 пара
        [1, 4], // Пятница, 4 пара
        [1, 4], // Суббота, 4 пара
      ],
    },
    {
        id: 2,
        name: 'Полещук Н. Н.',
        schedule: [
          [1, 4], // Понедельник, 4 пара
          [1, 4], // Вторник, 4 пара
          [1, 2, 3], // Среда, 2, 3, 4 пара
          [1, 4], // Четверг, 4 пара
          [1, 4], // Пятница, 4 пара
          [1, 4], // Суббота, 4 пара
        ],
      },
  ];
  
  export const lessons = [
    {
      id: 1,
      group: [
        {
          id: 1,
          flow: 1,
          specialty: 'ПИ',
          number: '5',
          subgroup: 1,
        },
      ],
      subject: { id: 1, name: 'Стат РФ' },
      type: 'Лекция',
      length: 1,
      teacher: 1,
    },
  ];
  
  export const lengthOfLessons = [
    { id: 1, name: 1 }, // 1 час
    { id: 2, name: 2 }, // 2 часа
  ];
  
  export const typeOfLessons = [
    { id: 1, name: 'Лекция' },
    { id: 2, name: 'Лабораторные' },
  ];
  