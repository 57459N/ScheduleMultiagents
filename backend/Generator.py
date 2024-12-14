from entities import *
import pandas as pd
import json
from constants import *

class Generator():
    def __init__(self, lessons: list[Lesson], teachers: list[Teacher]):
        self.lessons = lessons
        self.teachers = teachers

        self.dict_group = {str(i): [] for i in range(1, 17)}
        self.dict_table = {str(i): {str(j): [] for j in range(1, 7)} for i in range(1, 17)}

    def fill_dict_group(self, lesson):
        lesson_id = lesson.id
        subject_name = lesson.subject.name
        lesson_type = lesson.type
        teacher_id = lesson.teacher

        for group in lesson.group:
            group_id = str(group.group_id)
            if group_id in self.dict_group:
                self.dict_group[group_id].append({
                    'id': lesson_id,
                    'subject': subject_name,
                    'type': lesson_type,
                    'teacher': teacher_id
                })

    def find_teacher(self, teacher_id):
        for teacher in self.teachers:
            if teacher.id == teacher_id:
                return teacher.id
        return None

    def choose_lecture(self):
        for group_key, lessons in self.dict_group.items():
            for lesson in lessons:
                if lesson['type'] == "Лекция":
                    teacher_id = lesson['teacher']
                    teacher_schedule = next(
                        (t.schedule for t in self.teachers if t.id == teacher_id), None
                    )
                    if not teacher_schedule:
                        continue
                    for day_index, day in enumerate(self.dict_table[group_key].keys()):
                        # Проверяем наличие свободного времени у преподавателя
                        if (
                                isinstance(self.dict_table[group_key][day], list)
                                and len(self.dict_table[group_key][day]) < 5
                                and day_index < len(teacher_schedule)
                                and len(teacher_schedule[day_index]) > 0  # У преподавателя есть свободное время
                        ):
                            # Добавляем занятие и удаляем одно время из расписания
                            self.dict_table[group_key][day].append(lesson)
                            teacher_schedule[day_index].pop(0)  # Удаляем первое доступное время
                            break


    def choose_labs(self):
        for group_key, lessons in self.dict_group.items():
            for lesson in lessons:
                if lesson['type'] == "Лабораторные":
                    teacher_id = lesson['teacher']
                    teacher_schedule = next(
                        (t.schedule for t in self.teachers if t.id == teacher_id), None
                    )
                    if not teacher_schedule:
                        continue
                for day_index, day in enumerate(self.dict_table[group_key].keys()):
                    # Проверяем наличие свободного времени у преподавателя
                    if (
                            isinstance(self.dict_table[group_key][day], list)
                            and len(self.dict_table[group_key][day]) < 5
                            and day_index < len(teacher_schedule)
                            and len(teacher_schedule[day_index]) > 0  # У преподавателя есть свободное время
                    ):
                        # Добавляем занятие и удаляем одно время из расписания
                        self.dict_table[group_key][day].append(lesson)
                        teacher_schedule[day_index].pop(0)  # Удаляем первое доступное время
                        break



    def generate_schedule(self):
        for lesson in self.lessons:
            self.fill_dict_group(lesson)

        self.choose_lecture()

        self.choose_labs()

    def print_schedule(self):
        WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

        for group_key, schedule in self.dict_table.items():
            print(f"Группа {group_key}:")
            for day_index, lessons in schedule.items():
                day_name = WEEK_DAYS[int(day_index) - 1]
                print(f"Lessons: {lessons}")
                lesson_info = ", ".join([lesson.get('subject', 'Неизвестный предмет') for lesson in lessons])
                print(f"  {day_name}: {lesson_info if lesson_info else 'Нет занятий'}")
            print("-" * 40)

    def schedule_csv(self, path):
        WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

        data = []

        # Список групп
        groups = ['1 РФ', '2 РФ', '3 РФ', '4 РФ', '8 РФ', '3 ФЭ', '2 АРИСТ', '8 АРИСТ', '4 КБ', '5 КБ', '6 КБ', '7 КБ',
                  '1 ПИ', '5 ПИ', '6 ПИ', '7 ПИ']

        # Проходим по каждой группе
        for group_id, days in self.dict_table.items():
            for day_index in range(1, 7):  # 1 - Понедельник, 6 - Суббота
                day_name = WEEK_DAYS[day_index - 1]  # Получаем название дня
                lessons = days.get(str(day_index), [])  # Получаем предметы за день

                # Собираем список ID предметов за текущий день
                lesson_ids = [str(lesson.get('id', '')) for lesson in lessons]

                # Для каждого номера пары (1-6) формируем строку
                for pair_number in range(1, 7):
                    row = {'Day': day_name, 'Lesson': pair_number}

                    # Если есть предметы, заполняем для текущей группы
                    row[group_id] = ', '.join(lesson_ids) if lesson_ids else ''

                    # Добавляем строку в итоговый список
                    data.append(row)

        # Создаем DataFrame и заполняем пустыми значениями для остальных групп
        df = pd.DataFrame(data)

        # Заполняем пустые ячейки для всех остальных групп
        for group in groups:
            if group not in df.columns:
                df[group] = ''

        # Сохраняем таблицу в CSV
        df.to_csv(path, sep=';', index=False)
