// Service Worker registrieren
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}


function update_app() {
    window.location.reload(true);
}

const updateBtn = document.getElementById("update-btn");
updateBtn.addEventListener("click", async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration?.waiting) {
      // Neuer SW wartet → sofort aktivieren
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      registration.waiting.addEventListener("statechange", e => {
        if (e.target.state === "activated") {
          window.location.reload(); // Seite neu laden
        }
      });
    } else {
      // Kein SW waiting → einfach normal reload
      window.location.reload(true);
    }
  } else {
    // Fallback
    window.location.reload(true);
  }
});



//////////////////////////////////


const checkInTimeElement = document.getElementById("check-in-datetime")
const checkInTimeZoneElement = document.getElementById("check-in-timezone-select")
const timeZoneElement = document.getElementById("time-zone-select")
const legsElement = document.getElementById("leg-count")
const latestOnBlockElement = document.getElementById("on-block-time")

checkInTimeZoneElement.addEventListener("click", function () {
    if (checkInTimeZoneElement.value == "local") {
        document.getElementById("time-zone-label").style.visibility = "visible"
        document.getElementById("time-zone-select").style.visibility = "visible"
    }else {
        document.getElementById("time-zone-label").style.visibility = "hidden"
        document.getElementById("time-zone-select").style.visibility = "hidden"
    }
    
})

function calculate_final_data() {
    var checkInTime = new Date(checkInTimeElement.value)
    var latestOnBlock = new Date(checkInTime)
    var depTimeZoneDiff = timeZoneElement.value
    var maxFDP = latestOnBlock.getTime() - checkInTime.getTime()

    if (checkInTime.getHours() >= 6 && (checkInTime.getHours() < 13 || (checkInTime.getHours() === 13 && checkInTime.getMinutes() <= 29) )){
        latestOnBlock.setHours(latestOnBlock.getHours() + 13) //max fdp
    }else if (checkInTime.getHours() === 13 && (checkInTime.getMinutes() >= 30 && checkInTime.getMinutes() <= 59)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 45) 
    }else if (checkInTime.getHours() === 14 && checkInTime.getMinutes() <= 29){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 30) 
    }else if (checkInTime.getHours() === 14 && (checkInTime.getMinutes() >= 30 && checkInTime.getMinutes() <= 59)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 15) 
    }else if (checkInTime.getHours() === 15 && checkInTime.getMinutes() <= 29){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12) 
    }else if (checkInTime.getHours() === 15 && (checkInTime.getMinutes() >= 30 && checkInTime.getMinutes() <= 59)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 11)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 45) 
    }else if (checkInTime.getHours() === 16 && checkInTime.getMinutes() <= 29){
        latestOnBlock.setHours(latestOnBlock.getHours() + 11)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 30) 
    }else if (checkInTime.getHours() === 16 && (checkInTime.getMinutes() >= 30 && checkInTime.getMinutes() <= 59)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 11)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 15) 
    }else if (checkInTime.getHours() >= 17 || checkInTime.getHours() < 5){
        latestOnBlock.setHours(latestOnBlock.getHours() + 11)
    }else if (checkInTime.getHours() === 5 && checkInTime.getMinutes() <= 14){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
    }else if (checkInTime.getHours() === 5 && (checkInTime.getMinutes() >= 15 && checkInTime.getMinutes() <= 29)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 15)
    }else if (checkInTime.getHours() === 5 && (checkInTime.getMinutes() >= 30 && checkInTime.getMinutes() <= 44)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 30)
    }else if (checkInTime.getHours() === 5 && (checkInTime.getMinutes() >= 45 && checkInTime.getMinutes() <= 59)){
        latestOnBlock.setHours(latestOnBlock.getHours() + 12)
        latestOnBlock.setMinutes(latestOnBlock.getMinutes() + 45)
    }

    var latestOnBlockUTC = new Date(latestOnBlock)

    if (checkInTimeZoneElement.value == "local"){
        if (depTimeZoneDiff){
            var tzOperator = depTimeZoneDiff[0]
            var tzHours = depTimeZoneDiff.substring(1, 3)
            var tzMinutes = depTimeZoneDiff.substring(4)

            if (tzOperator == "-"){
                latestOnBlockUTC.setHours(latestOnBlockUTC.getHours() + tzHours)
                latestOnBlockUTC.setMinutes(latestOnBlockUTC.getMinutes() + tzMinutes)
            }else if(tzOperator == "+") {
                latestOnBlockUTC.setHours(latestOnBlockUTC.getHours() - tzHours)
                latestOnBlockUTC.setMinutes(latestOnBlockUTC.getMinutes() - tzMinutes)
            }
        }
    }
    

    maxFDP = latestOnBlock.getTime() - checkInTime.getTime()
    var diffMinutes = Math.floor(maxFDP / 1000 / 60);
    var diffHours = Math.floor(diffMinutes / 60);
    var remainingMinutes = diffMinutes % 60;
    
    var legCount = legsElement.value
    if (legCount >= 3) {
        for (let i = 0; i < legCount - 2; i++){
            

            console.log("Max FDP: "+diffHours+":"+remainingMinutes)

            if (diffHours > 9) {
                latestOnBlock.setMinutes(latestOnBlock.getMinutes() - 30)
                latestOnBlockUTC.setMinutes(latestOnBlockUTC.getMinutes() - 30)
            }else if (diffHours === 9 && remainingMinutes >= 30){
                latestOnBlock.setMinutes(latestOnBlock.getMinutes() - 30)
                latestOnBlockUTC.setMinutes(latestOnBlockUTC.getMinutes() - 30)
            }else if (diffHours === 9 && remainingMinutes < 30){
                latestOnBlock.setMinutes(latestOnBlock.getMinutes() - remainingMinutes)
                latestOnBlockUTC.setMinutes(latestOnBlockUTC.getMinutes() - remainingMinutes)

            }else {
                maxFDP = latestOnBlock.getTime() - checkInTime.getTime()
                diffMinutes = Math.floor(maxFDP / 1000 / 60);
                diffHours = Math.floor(diffMinutes / 60);
                remainingMinutes = diffMinutes % 60;
                break
            }
                
            maxFDP = latestOnBlock.getTime() - checkInTime.getTime()
            diffMinutes = Math.floor(maxFDP / 1000 / 60);
            diffHours = Math.floor(diffMinutes / 60);
            remainingMinutes = diffMinutes % 60;
        }
    }
    
    

    
    const year = latestOnBlockUTC.getFullYear();
    const month = String(latestOnBlockUTC.getMonth() + 1).padStart(2, "0");
    const day = String(latestOnBlockUTC.getDate()).padStart(2, "0");
    const hours = String(latestOnBlockUTC.getHours()).padStart(2, "0");
    const minutes = String(latestOnBlockUTC.getMinutes()).padStart(2, "0");
    

    console.log("Maximum FDP: "+diffHours+":"+remainingMinutes)
    console.log("Latest On-Block: "+day+"."+month+"."+year+" at "+hours+":"+minutes+" UTC")
    latestOnBlockElement.textContent = `${day}.${month}.${year} at ${hours}:${minutes} UTC`
}