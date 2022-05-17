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
        oleAddress: "0xa865197a84e780957422237b5d152772654341f3"
    },
    ETH: {
        link: "https://eth.openleverage.finance/api",
        oleAddress: "0x92CfbEC26C206C90aeE3b7C66A9AE673754FaB7e"
    },
    KCC: {
        link: "https://kcc.openleverage.finance/api",
        oleAddress: "0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4"
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