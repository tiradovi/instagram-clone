import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
? 'http://15.164.170.48' //AWS
: 'http://localhost:3000';