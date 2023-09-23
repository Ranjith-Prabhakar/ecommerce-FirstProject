let timerEl = document.getElementById("timer");
let resendOTP = document.getElementById('resendOTP')
let timeInterval;
let countDown = 20;
let isCounting = false;
function startCountDown() {
  if (!isCounting) {
    isCounting = true;
    timeInterval = setInterval(updateCountDown, 1000)
  }
}

function updateCountDown() {
  if (isCounting && countDown >= 0) {
    const minutes = String(Math.floor(countDown / 60)).padStart(2, '0');
    const seconds = String(Math.floor(countDown % 60)).padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;
    countDown--;

    if (countDown < 0) {
      stopCountDown();
      resendOTP.classList.toggle('d-none')
    }
  }
}


function stopCountDown() {
  clearInterval(timeInterval)
  isCounting = false
}
// making the timer start once the page reloaded
document.addEventListener('DOMContentLoaded', startCountDown)

// resend button clicking event
resendOTP.addEventListener('click',async(event)=>{
  
  try {
    let response = await fetch('/resendOtp',{
      method:'get',
      headers:{
        'content-type':'application/json'
      },
      
    })
    let data = await response.json()
    if(data.success){
    window.location.reload()
    }
  } catch (error) {
    console.log(error.message)
    
  }
  
})      
