import { environments } from 'environments';

const BASE_URL = environments.serverUrl + '/api';

export default BASE_URL;

export const MaxRetries = 3;
