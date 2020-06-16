import axios from 'axios';

export default axios.create({           // The base url of external api
  baseURL: `http://dev.klh-competence.com/sparklane-api/public/api`
});