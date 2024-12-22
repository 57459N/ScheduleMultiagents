from Generator import *
from SheetFormater import *

# ? ONLY FOR DEBUG


def main():
    f = open('data/data.json', 'r', encoding="utf-8")
    data = json.load(f)
    f.close()
    lessons = Lessons(**data)
    gen = Generator(lessons.lessons, lessons.teachers)
    gen.generate_schedule()
    gen.schedule_to_csv("schedule.csv")

    formatter = SheetFormater('data/data.json', 'schedule.csv')
    formatter.format()
    formatter.save('test3.xlsx')
    subprocess.Popen('open test3.xlsx', shell=True)


if __name__ == '__main__':
    main()
