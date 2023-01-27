import axios from 'axios';

const URL = "https://nhaphangv2.monamedia.net/api/menu/config?id=1";

const configHomeData = {
  get: async () => {
    return axios.get(URL)
  }
}

export default configHomeData;
