import base64 from 'react-native-base64';
import credentials from './ibm-credentials';


class TanslatorWatson {

  headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + base64.encode('apikey:' + credentials.LANGUAGE_TRANSLATOR_IAM_APIKEY),
  }

  constructor() {
  }

  translate(item) {

    dataString = {
      text: item.text,
      model_id: item.model
    }
    
    return fetch(credentials.LANGUAGE_TRANSLATOR_URL + '/v3/translate?version=2018-05-01', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(dataString),
    }).then((response) => response.json())
      // .then((responseJson) => {

      //   console.warn(responseJson);

      // })
      .catch((error) => {
        console.log('Translate error: ', error);
      });
  }


}

export default TanslatorWatson;
