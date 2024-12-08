import json
import csv

# Загрузка данных из JSON файла
with open('data.json', 'r', encoding='utf-8') as file:
    input_data = json.load(file)

lessons = input_data['lessons']
teachers = input_data['teachers']
#todo записки сумасшедшего 4 час ночи - мы создаём буферку-словарь, где ключ - id группы, значение список занятий у этой группы
dict_group = {
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': [],
    '9': [],
    '10': [],
    '11': [],
    '12': [],
    '13': [],
    '14': [],
    '15': [],
    '16': []
}

#todo эта шляпа для норм работы с данными, здесь мы работаем с ключом - id группы, значение - предметы для этой группы
def fill_dict_group(dict_group, lesson):
    lesson_id = lesson['id']
    subject_name = lesson['subject']['name']
    lesson_type = lesson['type']
    teacher_id = lesson['teacher']

    for group in lesson['group']:
        group_id = str(group['group_id'])
        if group_id in dict_group:
            dict_group[group_id].append({
                'lesson_id': lesson_id,
                'subject': subject_name,
                'type': lesson_type,
                'teacher': teacher_id
            })

def find_teacher(teachers, id):
    for teacher in teachers:
        if teacher['id'] == id:
            return teacher['id']


# todo эта шляпа - неделя для всех групп, ключ - id_группы, значение - ещё один словарь в котором ключ - id дня а значение - пары(занятия), которые стоят в этот день
dict_table = {
        '1': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '2': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '3': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '4': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '5': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '6': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '7': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '8': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '9': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '10': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '11': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '12': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '13': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '14': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '15': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        },
        '16': {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        }
}
for lesson in lessons:
    fill_dict_group(dict_group, lesson)
print(dict_group)
print(dict_group['1'][0]['teacher'])

def choose_lecture(dict_group, teachers, dict_table):
    for group_key, lessons in dict_group.items():
        for lesson in lessons:
            if lesson['type'] == "Лекция":
                teacher_id = lesson['teacher']
                teacher_schedule = next(
                    (t['schedule'] for t in teachers if t['id'] == teacher_id), None
                )
                if not teacher_schedule:
                    continue
                for day in dict_table[group_key]:
                    day_index = int(day) - 1
                    if (
                            isinstance(dict_table[group_key][day], list)
                            and len(dict_table[group_key][day]) < 5
                            and day_index < len(teacher_schedule)
                            and lesson['lesson_id'] in teacher_schedule[day_index]
                    ):
                        dict_table[group_key][day].append(lesson['lesson_id'])
                        break

# на выходе - заполненный словарь dict_table, в котором ключ - id_group, значение - словарь, в котором ключ - day, значение - id_lesson
# матюша, не бей палкой пж
# по идее, нельзя заполнять в одном цикле лабы и лекции,
# тогда лабы будут накладываться в один день у других групп(лаб1 у 1-ой группы и лаб1 у 4-ой группы в одно время в один день) либо я осёл
# (чек пример матюши)
#todo или в начале заполнить лабы а потом начать их менять
# def check_labs_intersections():
# я доделаю



choose_lecture(dict_group, teachers, dict_table)

for i in range(1, len(dict_table) + 1):
    print(dict_table[str(i)])

csv_file = "output.csv"
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(dict_table.keys())
    writer.writerow(dict_table.values())
print(f"CSV файл '{csv_file}' успешно создан!")