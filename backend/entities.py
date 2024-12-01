from pydantic import BaseModel


class Group(BaseModel):
    group_id: int
    flow: int
    speciality: str
    number: str
    subgroup: int


class Subject(BaseModel):
    sub_id: int
    name: str


class Teacher(BaseModel):
    id: int
    name: str
    schedule: list[list[int]]


class Lesson(BaseModel):
    id: int
    group: list[Group]
    subject: Subject
    type: str
    length: int
    teacher: int


class Lessons(BaseModel):
    lessons: list[Lesson]
    teachers: list[Teacher]
