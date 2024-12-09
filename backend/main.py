from ScheduleGenerator import *
from Generator import *
from SheetFormater import *

# ? ONLY FOR DEBUG


def main():
    f = open('data/data.json', 'r')
    data = json.load(f)
    f.close()
    lessons = Lessons(**data)
    gen = Generator(lessons.lessons, lessons.teachers)
    gen.generate_schedule()
    gen.to_csv('data/example-3.csv')

    formatter = SheetFormater('data/data.json', 'data/example-3 .csv')
    formatter.format()
    formatter.save('test3.xlsx')
    subprocess.Popen('open test3.xlsx', shell=True)


if __name__ == '__main__':
    main()
