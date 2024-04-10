from dotenv import load_dotenv
import os
import requests
import http.client

def nba_api():
    conn = http.client.HTTPSConnection("api-nba-v1.p.rapidapi.com")

    headers = {
        'X-RapidAPI-Key': f"{os.getenv('api_key')}",
        'X-RapidAPI-Host': "api-nba-v1.p.rapidapi.com"
    }

    conn.request("GET", "/seasons", headers=headers)

    res = conn.getresponse()
    data = res.read()

    print(data.decode("utf-8"))

def configure():
    load_dotenv()

def main():
    configure()
    nba_api()

main()