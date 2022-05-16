const axios = require("axios");
const request = axios.create({
    headers: {
        post: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        "X-Requested-With": "XMLHttpRequest"
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


const chainInfoMap = {
    BNB: {
        link: "https://bnb.openleverage.finance/api",
        oleAddress: ""
    },
    ETH: {
        link: "https://eth.openleverage.finance/api",
        oleAddress: ""
    },
    KCC: {
        link: "https://kcc.openleverage.finance/api",
        oleAddress: ""
    },
}






// get bnb chain data
const chainLink = chainInfoMap["BNB"].link;
const oleAddress = chainInfoMap["BNB"].oleAddress;

const getPoolList = async () => {
    try {
        const result = await request.get(chainLink + "/info/pools");
        // console.log("pool list == ", JSON.stringify(result));
        if(result?.data?.pools && result?.data?.pools.length>0){
            getPoolDetail(result.data.pools[0].poolAddr);
        }
    } catch (err) {
        console.error("get pool list error", err);
    }
}



const getPoolDetail = async (poolId) => {
    try {
        const result = await request(chainLink + "/info/pool/" + poolId);
        // - pool name
        // - tokens
        // - smart-contract address
        // - base APY
        // - reward APY
        // - reward tokens
        // - TVL in USD
        const poolDetail = {
            poolName: result.data.poolName,
            address: result.data.depositTokenAddr,
            token: result.data.depositTokenSymbol,
            rewardToken: oleAddress,
            baseAPY: result.data.currentLendingAPY,
            tvlUSD: result.data.currentTVLUsd
        }

        console.log("pool detail == ", JSON.stringify(poolDetail));
    } catch (err) {
        console.error("get pool info detail error", err);
    }
}

getPoolList();