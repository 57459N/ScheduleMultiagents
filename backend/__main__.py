import json

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.app.entities import *
from backend.app.Generator import *
from backend.app.SheetFormater import *

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/')
async def get_data(lessons: Lessons):
    json_path = 'backend/data/temp.json'
    schedule_path = 'backend/data/schedule.csv'
    export_path = 'backend/data/export.xlsx'

    with open(json_path, 'w', encoding="utf-8") as f:
        json.dump(lessons.model_dump_json(), f)

    gen = Generator(lessons.lessons, lessons.teachers)
    gen.generate_schedule()
    gen.schedule_to_csv(schedule_path)

    formatter = SheetFormater(json_path, schedule_path)
    formatter.format()
    formatter.save(export_path)

    return FileResponse(path=export_path, filename='schedule.xlsx', media_type='multipart/form-data')

@app.get('/')
async def get_data():
    json_path = 'backend/data/second_course.json'
    with open(json_path, 'r', encoding="utf-8") as f:
        lessons = Lessons(**json.load(f))

    gen = Generator(lessons.lessons, lessons.teachers)
    gen.generate_schedule()
    gen.schedule_to_csv("backend/data/schedule.csv")

    formatter = SheetFormater(json_path, 'backend/data/schedule.csv')
    formatter.format()
    formatter.save('backend/data/export.xlsx')
    return FileResponse(path='backend/data/export.xlsx', filename='schedule.xlsx', media_type='multipart/form-data')


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False, log_level="debug")