from ScheduleGenerator import *
from SheetFormater import *

# ? ONLY FOR DEBUG


def main():
    f = open('data/data.json', 'r')
    data = json.load(f)
    f.close()
    lessons = Lessons(**data)
    gen = ScheduleGenerator(lessons.lessons, lessons.teachers)
    gen.generate()
    gen.to_csv('data/example-2.csv')

    formatter = SheetFormater('data/data.json', 'data/example-2.csv')
    formatter.format()
    formatter.save('test2.xlsx')
    subprocess.Popen('open test2.xlsx', shell=True)


if __name__ == '__main__':
    main()
