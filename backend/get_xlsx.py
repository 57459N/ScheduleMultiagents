import pandas as pd
from entities import *
import openpyxl as xl
import json

LEC_COLOR = '#a98be5'
LAB_COLOR = '#f7d483'

LESSON_TIME = {
    '1': '9:00 - 10:20',
    '2': '10:30 - 11:50',
    '3': '12:00 - 13:20',
    '4': '13:50 - 15:10',
    '5': '15:20 - 16:40',
    '6': '17:00 - 18:20',
    '7': '18:30 - 19:50',
    '8': '20:00 - 21:20'
}

f = open('data.json', 'r')
data = json.load(f)
f.close()
lessons = Lessons(**data)
schedule_df = pd.read_csv('')
wb = xl.Workbook()
