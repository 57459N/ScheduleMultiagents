from backend.app.entities import *
import pprint
import pandas as pd

class Generator():
    def __init__(self, lessons: list[Lesson], teachers: list[Teacher]):
        self.lessons = lessons
        self.teachers = teachers

        self.dict_group = {str(i): [] for i in range(1, 17)}
        self.dict_table = {str(i): {str(j): [] for j in range(1, 7)} for i in range(1, 17)}
        self.teacher_busy = {}
        for t in teachers:
            # day_str от "1" до "6"
            self.teacher_busy[t.id] = {str(day): set() for day in range(1, 7)}

    def print_dict_group(self):
        pprint.pprint(self.dict_group)

    def fill_dict_group(self, lesson):
        lesson_id = lesson.id
        subject_name = lesson.subject.name
        lesson_type = lesson.type
        teacher_id = lesson.teacher

        for group in lesson.group:
            group_id = str(group.group_id)
            if group_id in self.dict_group:
                self.dict_group[group_id].append({
                    'lesson_id': lesson_id,
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
                        print(f"Преподаватель #{teacher_id} не имеет расписания. Пропускаем...")
                        continue

                    placed = False

                    for day_str in self.dict_table[group_key]:
                        day_index = int(day_str) - 1

                        if (
                                len(self.dict_table[group_key][day_str]) < 5
                                and day_index < len(teacher_schedule)
                                and teacher_schedule[day_index]
                        ):
                            free_pair = teacher_schedule[day_index][0]
                            if free_pair in self.teacher_busy[teacher_id][day_str]:
                                print(f"Конфликт! Преподаватель {teacher_id} уже занят "
                                      f"в день {day_str}, пару {free_pair}. Пробуем следующий день...")
                                continue
                            self.dict_table[group_key][day_str].append({
                                'lesson_id': lesson['lesson_id'],
                                'subject': lesson['subject'],
                                'type': lesson['type'],
                                'pair': free_pair,
                                'teacher': teacher_id
                            })

                            teacher_schedule[day_index].remove(free_pair)

                            self.teacher_busy[teacher_id][day_str].add(free_pair)

                            placed = True
                            print(f"Поставили Лекции #{lesson['lesson_id']} (гр. {group_key}) "
                                  f"на день {day_str} (пара {free_pair}).")
                            break
                        else:
                            print(f"Лекции #{lesson['lesson_id']} (гр. {group_key}) "
                                  f"в день {day_str} не подходят (преп. {teacher_id}). "
                                  f"Пробуем следующий день...")
                            continue

                    if not placed:
                        print(
                            f"Не удалось поставить Лабораторные #{lesson['lesson_id']} (гр. {group_key})."
                        )

    def choose_labs(self):
        for group_key, lessons in self.dict_group.items():
            for lesson in lessons:
                if lesson['type'] == "Лабораторные":
                    teacher_id = lesson['teacher']
                    teacher_schedule = next(
                        (t.schedule for t in self.teachers if t.id == teacher_id), None
                    )

                    if not teacher_schedule:
                        print(f"Преподаватель #{teacher_id} не имеет расписания. Пропускаем...")
                        continue

                    placed = False

                    for day_str in self.dict_table[group_key]:
                        day_index = int(day_str) - 1

                        if (
                                len(self.dict_table[group_key][day_str]) < 5
                                and day_index < len(teacher_schedule)
                                and teacher_schedule[day_index]
                        ):
                            free_pair = teacher_schedule[day_index][0]

                            if free_pair in self.teacher_busy[teacher_id][day_str]:
                                print(f"Конфликт! Преподаватель {teacher_id} уже занят "
                                      f"в день {day_str}, пару {free_pair}. Пробуем следующий день...")
                                continue

                            self.dict_table[group_key][day_str].append({
                                'lesson_id': lesson['lesson_id'],
                                'subject': lesson['subject'],
                                'type': lesson['type'],
                                'pair': free_pair,
                                'teacher': teacher_id
                            })

                            teacher_schedule[day_index].remove(free_pair)

                            self.teacher_busy[teacher_id][day_str].add(free_pair)

                            placed = True
                            print(f"Поставили Лабы #{lesson['lesson_id']} (гр. {group_key}) "
                                  f"на день {day_str} (пара {free_pair}).")
                            break
                        else:
                            print(f"Лабы #{lesson['lesson_id']} (гр. {group_key}) "
                                  f"в день {day_str} не подходят (преп. {teacher_id}). "
                                  f"Пробуем следующий день...")
                            continue

                    if not placed:
                        print(
                            f"Не удалось поставить Лабораторные #{lesson['lesson_id']} (гр. {group_key})."
                        )


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

    def schedule_to_csv(self, filename="schedule.csv"):

        columns = [
            "day",
            "lesson",
            "1 РФ", "2 РФ", "3 РФ", "4 РФ", "8 РФ", "3 ФЭ", "2 АРИСТ", "8 АРИСТ",
            "4 КБ", "5 КБ", "6 КБ", "7 КБ", "1 ПИ", "5 ПИ", "6 ПИ", "7 ПИ"
        ]

        GROUP_COLUMN_NAME = {
            "1": "1 РФ",
            "2": "2 РФ",
            "3": "3 РФ",
            "4": "4 РФ",
            "5": "8 РФ",
            "6": "3 ФЭ",
            "7": "2 АРИСТ",
            "8": "8 АРИСТ",
            "9": "4 КБ",
            "10": "5 КБ",
            "11": "6 КБ",
            "12": "7 КБ",
            "13": "1 ПИ",
            "14": "5 ПИ",
            "15": "6 ПИ",
            "16": "7 ПИ",
        }

        WEEK_DAYS = {
            "1": "ПОНЕДЕЛЬНИК",
            "2": "ВТОРНИК",
            "3": "СРЕДА",
            "4": "ЧЕТВЕРГ",
            "5": "ПЯТНИЦА",
            "6": "СУББОТА"
        }

        rows = []

        for day_str in ["1", "2", "3", "4", "5", "6"]:
            day_name = WEEK_DAYS[day_str]

            for lesson_number in range(1, 9):
                row_data = {
                    "day": day_name,
                    "lesson": lesson_number,
                }

                for col in columns[2:]:
                    row_data[col] = ""

                for group_key, days_dict in self.dict_table.items():
                    if group_key in GROUP_COLUMN_NAME:
                        col_name = GROUP_COLUMN_NAME[group_key]
                    else:
                        continue

                    if day_str not in days_dict:
                        continue

                    lessons_list = days_dict[day_str]
                    found_lesson = None
                    for l in lessons_list:
                        if l.get('pair') == lesson_number:
                            found_lesson = l
                            break

                    if found_lesson:
                        row_data[col_name] = found_lesson['teacher']


                rows.append(row_data)

        df = pd.DataFrame(rows, columns=columns)

        df.to_csv(filename, sep=';', index=False, encoding='utf-8-sig')
        print(f"Сформирован CSV-файл: {filename}")