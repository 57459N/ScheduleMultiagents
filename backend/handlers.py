from entities import *
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json

app = FastAPI()


@app.post('/')
async def get_data(lessons: Lessons):
    f = open('test', 'w')
    f.write(lessons.model_dump_json())
    f.close()


@app.get("/file/download")
def download_file():
    return FileResponse(path='Расписание 4 курс 7 семестр 2024-2025.xlsx', filename='Расписание.xlsx', media_type='multipart/form-data')
