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
                    teacher_id = lesson.teacher
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
                            self.dict_table[group_key][day].append(lesson)

                            # Удаляем свободное время преподавателя для этого дня и пары
                            if teacher_schedule[day_index]:
                                teacher_schedule[day_index] = [
                                    subject for subject in teacher_schedule[day_index] if subject != lesson.id
                                ]
                            break

    def choose_labs(self):
        for group_key, lessons in self.dict_group.items():
            for lesson in lessons:
                if lesson.type == "Лабораторные":
                    teacher_id = lesson.teacher
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
                            self.dict_table[group_key][day].append(lesson)

                            # Удаляем свободное время преподавателя для этого дня и пары
                            if teacher_schedule[day_index]:
                                teacher_schedule[day_index] = [
                                    subject for subject in teacher_schedule[day_index] if subject != lesson.id
                                ]
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

        for group, days in dict_table.items():
            for day_index, lessons in days.items():
                # Проверяем, есть ли занятия в этот день
                day_name = WEEK_DAYS[int(day_index) - 1]
                subject_list = ', '.join([lesson['subject'] for lesson in lessons]) if lessons else ''

                data.append({
                    'Group': group,
                    'Day': day_name,
                    'Lessons': subject_list
                })

        df = pd.DataFrame(data)

        df.to_csv('data/schedule.csv', sep=';', index=False)
