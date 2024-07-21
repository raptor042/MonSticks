import WebSocket from "ws"

const ws = new WebSocket("ws://localhost:3001/ws")


ws.onopen = () => {
    console.log("Opened")
    const defaultInitData = "query_id=AAFBP7FLAgAAAEE_sUvtcvwS&user=%7B%22id%22%3A5564874561%2C%22first_name%22%3A%22Elite%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22teddo510%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721427969&hash=7f78cccca3924b61ea0a723346088735edd849e90d48eb77172bcd2ecd612fa9"
    ws.send(JSON.stringify({type : "subscribe", initData : defaultInitData}))
    ws.send(JSON.stringify({type : "upgradeRechargeSpeed", initData : defaultInitData}))
}
ws.onmessage =  (message) => {
    const data = JSON.parse(message.data)
    if(data['field'] == "energy") return 
    console.log(data)
}