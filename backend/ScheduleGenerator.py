from entities import *
import pandas as pd
import json
from constants import *


class ScheduleGenerator():
    def __init__(self, lessons: list[Lesson], teachers: list[Teacher]):
        # * first colum – lesson counter in day
        # * others – lessons ids
        self.table = [[None] * 48 for _ in range(17)]
        for i in range(0, 48):
            self.table[0][i] = i % 8 + 1
        self.lessons = lessons
        for lesson in self.lessons:
            lesson.is_set = False
        self.teachers = teachers

    def __get_teacher_schedule(self, teacher_id: int, day: int):
        for teacher in self.teachers:
            if teacher.id == teacher_id:
                return teacher.schedule[day]

    def __get_lesson_by_type(self, type: str):
        lessons = []
        for lesson in self.lessons:
            if lesson.type == type:
                lessons.append(lesson)
        return lessons
        # def __get_group_id()

    def generate(self):
        lectures = self.__get_lesson_by_type('Лекция')
        labs = self.__get_lesson_by_type('Лабораторные')
        for day in range(0, 6):
            for group in range(1, 15):
                for lesson in range(0, 8):
                    idx = (day * 8) + lesson
                    if self.table[group][idx] == None:
                        for lec in lectures:
                            if lec.is_set:
                                continue
                            groups = lec.get_groud_ids()
                            if group not in groups:  # check is group in lecture
                                continue
                            # check is teacher available in this time
                            if lesson not in self.__get_teacher_schedule(lec.teacher, day):
                                continue
                            for group in groups:
                                # todo: add check for all groups i lec
                                self.table[group][idx] = lec.id
                                lec.is_set = True
                    if self.table[group][idx] == None:
                        for lab in labs:
                            if lab.is_set:
                                continue
                            groups = lab.get_groud_ids()
                            if group not in groups:  # check is group in lecture
                                continue
                            # check is teacher available in this time
                            if lesson not in self.__get_teacher_schedule(lec.teacher, day):
                                continue
                            for group in groups:
                                # todo: add check for all groups i lec
                                # todo: add lesson len
                                self.table[group][idx] = lab.id
                                lab.is_set = True
        return self.table

    def to_csv(self, path):
        days = []
        for day in WEEK_DAYS:
            for _ in range(8):
                days.append(day)
        schedule = pd.DataFrame({'day': days})
        schedule = schedule.assign(lesson=self.table[0])
        for group, group_schedule in zip(GROUPS, self.table[1:]):
            schedule[group] = group_schedule

        # ! DEBUG
        print(schedule)
        print(schedule.count().sum() - 48 * 2)
        schedule.to_csv(path, sep=';', index=False)
