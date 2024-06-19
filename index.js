const fs = require('fs');
const errorLoggingMiddleware = async (err, req, res, next) => {
    const statusCode = parseInt(res.statusCode)
    if(statusCode>=500){
        const filePath = './err-500.txt'
        let newData = {
            code: statusCode,
            err: JSON.stringify(err).slice(0,30),
            api: req.url,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            date: new Date()
        }
        if(fs.existsSync(filePath)){
            let serializedData = JSON.stringify(newData)
            fs.appendFileSync(filePath, serializedData + ',' , err => {
                if(err){console.log(err.message);
                 next(err)};
            });
        }else{
            let serializedData = JSON.stringify(newData)
            fs.writeFileSync(filePath, serializedData + ',' , err => {
                if(err){console.log(err.message);
                 next(err)};
            });
        }
    }else if(statusCode>=400 && statusCode<500){
        const filePath = './err-400.txt'
        let newData = {
            code: statusCode,
            err: JSON.stringify(err).slice(0,30),
            api: req.url,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            date: new Date()
        }
        if(fs.existsSync(filePath)){
            let serializedData = JSON.stringify(newData)
            fs.appendFileSync(filePath, serializedData + ',' , err => {
                if(err){console.log(err.message);
                 next(err)};
            });
        }else{
            let serializedData = JSON.stringify(newData)
            fs.writeFileSync(filePath, serializedData + ',' , err => {
                if(err){console.log(err.message);
                 next(err)};
            });
        }
    }
    next()
}


const getLatestErrors = async(statusType, countFromLast) => {
    const filePath = parseInt(statusType) == 500 ? './err-500.txt' : './err-400.txt'
    let dataInFile = fs.readFileSync(filePath,{encoding:"utf-8"});

    let len = dataInFile.length
    let finalArr = []
    let startIdx = 0, endIdx = 0;
    for(let i=0;i<len-4;++i){
        if(dataInFile[i]=='}' && dataInFile[i+1]==',' && dataInFile[i+2]=='{'){
            endIdx = i;
            let segment = dataInFile.slice(startIdx, endIdx+1);
            startIdx = i+2;
            finalArr.push(await JSON.parse(segment))
        }
    }
    let segment = dataInFile.slice(startIdx, len-1);
    finalArr.push(await JSON.parse(segment))
    return finalArr.slice(1).slice(-1* countFromLast)
}

const getApiWithMostError = async(statusType) => {
    const filePath = parseInt(statusType) == 500 ? './err-500.txt' : './err-400.txt'
    let dataInFile = fs.readFileSync(filePath,{encoding:"utf-8"});
    let mp = new Map();
    let len = dataInFile.length;
    let finalArr = [];
    let startIdx = 0, endIdx = 0;
    let arrIdx = 0
    for(let i=0;i<len-4;++i){
        if(dataInFile[i]=='}' && dataInFile[i+1]==',' && dataInFile[i+2]=='{'){
            endIdx = i;
            let segment = dataInFile.slice(startIdx, endIdx+1);
            startIdx = i+2;
            finalArr.push(await JSON.parse(segment))
            if(mp.has(finalArr[arrIdx].api)){
                mp.set(finalArr[arrIdx].api, mp.get(finalArr[arrIdx].api) + 1);
            }else{
                mp.set(finalArr[arrIdx].api,1);
            }
            ++arrIdx;
        }
    }
    let segment = dataInFile.slice(startIdx, len-1);
    finalArr.push(await JSON.parse(segment));
    if(mp.has(finalArr[arrIdx].api)){
        mp.set(finalArr[arrIdx].api, mp.get(finalArr[arrIdx].api) + 1);
    }else{
        mp.set(finalArr[arrIdx].api,1);
    }
    return [...mp.entries()].reduce((a,b) => a[1] > b[1] ? a: b)
}

module.exports = {errorLoggingMiddleware,getLatestErrors,getApiWithMostError}