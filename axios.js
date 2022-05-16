const axios = require("axios");
const request = axios.create({
    headers: {
        post: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        "X-Requested-With": "XMLHttpRequest",
      },
      timeout: 1000000,
      responseType: "json",
});

request.interceptors.request.use(config => {
    return config
}, error => {
    Promise.reject(error)
})

request.interceptors.response.use(
    (response) => {
        const res = response.data;
        return Promise.resolve(res);
    },
    (err) => {
        console.log(err);
    }
);


export default request;