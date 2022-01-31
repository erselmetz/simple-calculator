const button = document.querySelectorAll('#c')
const equal = document.getElementById('equal')
const textArea = document.getElementById('textarea')
const clear = document.getElementById('clear')
const back = document.getElementById('back')

back.addEventListener('click',()=>{
    if(textArea.value == 'undefined'){
        textArea.value = ''
    }
    textArea.value = textArea.value.slice(0, -1)
});

button.forEach(function(button){
    button.addEventListener("click",function(){
        textArea.value += this.value
    });
});

equal.addEventListener('click',function(e) {
    try{
        textArea.value = eval(textArea.value)
    }catch{
        textArea.value = "undefined"
    }
});

clear.addEventListener("click",function() {
    textArea.value = ''
});