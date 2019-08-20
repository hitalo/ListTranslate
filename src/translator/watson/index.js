import base64 from 'react-native-base64';


class TanslatorWatson {

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + base64.encode('apikey:'+credentials.LANGUAGE_TRANSLATOR_IAM_APIKEY),
}

dataString = '{"text": ["Hello, world! ", "How are you?"], "model_id":"en-es"}';

constructor() {
}

test() {
    fetch(credentials.LANGUAGE_TRANSLATOR_URL+'/v3/translate?version=2018-05-01', {
        method: 'POST',
        headers: this.headers,
        body: this.dataString,
    }).then((response) => response.json())
    .then((responseJson) => {

      console.warn(responseJson);

    })
    .catch((error) =>{
      console.error(error);
    });
}


}

export default TanslatorWatson;
