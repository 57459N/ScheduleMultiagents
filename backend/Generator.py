from entities import *
import pandas as pd
import json
from constants import *


class Generator():
    def __init__(self, lessons, teachers):
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
                if lesson.type == "Лекция":
                    teacher_id = lesson.type
                    teacher_schedule = next(
                        (t.schedule for t in self.teachers if t.id == teacher_id), None
                    )
                    if not teacher_schedule:
                        continue
                    for day in self.dict_table[group_key]:
                        day_index = int(day) - 1
                        if (
                                isinstance(self.dict_table[group_key][day], list)
                                and len(self.dict_table[group_key][day]) < 5
                                and day_index < len(teacher_schedule)
                                and lesson.id in teacher_schedule[day_index]
                        ):
                            self.dict_table[group_key][day].append(lesson['lesson_id'])
                            break

    def choose_labs(self):
        for group_key, lessons in self.dict_group.items():
            for lesson in lessons:
                if lesson.type == "Лабораторные":
                    for day in self.dict_table[group_key]:
                        day_index = int(day) - 1
                        if (
                                isinstance(self.dict_table[group_key][day], list) and
                                len(self.dict_table[group_key][
                                        day]) < 5 and
                                day_index < len(self.teachers[0]['schedule'])
                        ):
                            is_conflict = False
                            for other_group_key in self.dict_table:
                                if other_group_key != group_key:
                                    if lesson.id in self.dict_table[other_group_key][day]:
                                        is_conflict = True
                                        break
                            if not is_conflict:
                                self.dict_table[group_key][day].append(lesson.id)
                                break

    def generate_schedule(self):
        for lesson in self.lessons:
            self.fill_dict_group(lesson)

        self.choose_lecture()

        self.choose_labs()

    def to_csv(self, path):
        WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        GROUPS = [str(i) for i in range(1, 17)]  # Группы от 1 до 16

        days = []
        for _ in range(6):  # 6 дней недели
            for _ in range(8):  # 8 занятий в день
                days.append(_)

        schedule_data = []

        for group in GROUPS:
            group_schedule = []
            for day in range(1, 7):  # Для каждого дня недели
                day_schedule = self.dict_table[group].get(str(day), [])
                group_schedule.extend(
                    [lesson.get('subject', '') for lesson in day_schedule] + [''] * (8 - len(day_schedule)))

            schedule_data.append(group_schedule)

        schedule = pd.DataFrame(schedule_data, columns=[f'Занятие {i + 1}' for i in range(8)] * 6, index=GROUPS)

        schedule = schedule.transpose().reset_index()
        schedule.columns = ['День недели'] + [f'Группа {i}' for i in range(1, 17)]

        schedule.to_csv(path, sep=';', index=False)

        print(schedule)
        print(schedule.count().sum() - 48 * 2)
        print(f"CSV файл '{path}' успешно создан!")

