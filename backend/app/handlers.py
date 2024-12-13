import json

from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.app.entities import *


app = FastAPI()


@app.post('/')
async def get_data(lessons: Lessons):
    f = open('data/export_data.json', 'w')
    f.write(lessons.model_dump_json())
    f.close()


@app.get("/file/download")
def download_file():
    # for test
    return FileResponse(path='data/Расписание 4 курс 7 семестр 2024-2025.xlsx', filename='Расписание.xlsx', media_type='multipart/form-data')
