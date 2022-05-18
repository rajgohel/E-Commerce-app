import { AsyncStorage } from 'react-native';
import axios from 'axios';
import NavigationService from './service/navigation.service';

axios.interceptors.request.use(async (config) => {
    // Do something before request is sent 
    // console.log('config in interseptor======================>', config.url);
    // const urlArray = config.url.split('/');
    // console.log("urlArray==============>", urlArray);
    // if (urlArray[urlArray.length - 1] === 'login' || urlArray[urlArray.length - 1] === 'signUp') {
    //     return config;
    // }
    //If the header does not contain the token and the url not public, redirect to login  
    const token = await AsyncStorage.getItem('token');
    // console.log('curuuntuser---------------------------->', JSON.parse(curruntUser).token);
    console.log('token-=-=', token);
    // const token = JSON.parse(curruntUser).token;
    // if token is found add it to the header
    if (token) {
        if (config.method !== 'OPTIONS') {
            config.headers.Authorization = token;
        }
    }
    // console.log('config in interseptor====={{{}}}===========>', config)
    return config;
}, function (error) {
    // Do something with request error 
    console.log('how are you error: ', error);
    return promise.reject(error);
});

axios.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        // const originalRequest = error.config
        console.log("error in interceptors=============>", error);
        // token expired
        if (error.response.status === 500 && (error.response.data.message == "jwt must be provided" )) {
            await AsyncStorage.setItem('token', '');
            const token = await AsyncStorage.getItem('token');
            console.log(']]]]]]]]]]]]]]]]]]', token);
            alert(error.response.data.message);
            NavigationService.navigate('Login');
        } else {
            return Promise.reject(error)
        }
    }
)

export default axios;
