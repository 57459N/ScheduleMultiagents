from backend.app.ScheduleGenerator import *
from backend.app.Generator import *
from backend.app.SheetFormater import *

# ? ONLY FOR DEBUG

def main():
    f = open('./backend/app/data/data.json', 'r')
    data = json.load(f)
    print(data)
    f.close()
    lessons = Lessons(**data)
    gen = Generator(lessons.lessons, lessons.teachers)
    gen.generate_schedule()
    gen.to_csv('./backend/app/data/example-3.csv')

    formatter = SheetFormater('./backend/app/data/data.json', 'backend/app/data/example-3.csv')
    formatter.format()
    formatter.save('test3.xlsx')
    subprocess.Popen('open test3.xlsx', shell=True)


if __name__ == '__main__':
    main()
