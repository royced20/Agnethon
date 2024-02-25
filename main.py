from flask import Flask, request
import requests
import base64

app = Flask(__name__)

client_id = 'IbhVZRDPQ8SxhphCOt0mHA'
client_secret ='pF3zs8iVhpdlhULrflpdfbhMDJNTgezO'
redirect_uri = ''
#redirect_url='http://localhost:5000'


@app.route('/')
def home():
    code = request.args.get('code')
    if code:
        # Exchange code for token
        response = requests.post('https://zoom.us/oauth/token', params={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri
        }, headers={
            'Authorization': 'Basic ' + base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()
        })
        if response.status_code == 200:
            return 'Token: ' + response.json()['access_token']
        else:
            return 'Error: ' + response.text
    else:
        # Redirect to Zoom OAuth page
        return f'<a href="https://zoom.us/oauth/authorize?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}">Authorize</a>'

if __name__ == '__main__':
    app.run(port=5000)


