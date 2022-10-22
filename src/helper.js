exports.serverReq = async (method = "GET", url, bodyData = null, queryParams = null) => {
    try{
        if(queryParams){
        url = new URL(url);
        for (let k in queryParams) { url.searchParams.append(k, queryParams[k]); }
    }
    let req = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: bodyData ? JSON.stringify(bodyData) : null,
    });
    let res = await req.json();
    return res;
    }
    catch(_){
        return {success:0,message:"Error in network",error:_};
    }
}