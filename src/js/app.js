let xhr = new XMLHttpRequest();
let tbody = document.getElementById('tbody');
let header = document.getElementsByClassName('header')[0];
let tr = document.createElement('tr');
let schedule;

function Search(v) {
    return new Promise((resolve, reject) => {
        let td = document.getElementsByClassName('string')
        td = Array.prototype.slice.call(td)
        let value = v.value;
        td.forEach(i => {
            let firstTr = String(i.firstChild.textContent);
            if (firstTr.match(value)) {
                i.setAttribute('style', 'dispaly: ;')
                // console.log(i);
            } else {
                i.setAttribute('style', 'display: none;')
            }     
            resolve();
            reject();
        })
    })
}

function mainComment() {
    let maincomment = document.getElementsByClassName('main-comment')[0];
    maincomment.innerHTML = 'Данные представлены на '  + new Date().toLocaleDateString('ru-Ru')
}

function Arrive() {  
    return new Promise((resolve, reject) => {
        tbody.innerHTML = '';  
        schedule, Request('arrival');
        header.setAttribute("style", "background-image:url(./src/img/arrival.jpg)"); 
        resolve();
        reject();
    })   
}

function Departure() {
    return new Promise((resolve, reject) => {
        tbody.innerHTML = '';
        schedule, Request('departure');   
        header.setAttribute("style", "background-image:url(./src/img/departure.jpg)");
        resolve();
        reject();
    })       
}

function Delayed() {
    return new Promise((resolve, reject) => {
        tbody.innerHTML = '';
        helper(schedule, Request('departure', true)); 
        header.setAttribute("style", "background-image:url(./src/img/delayed.jpg)"); 
        resolve();
        reject();
    })    
}

function push(i, type, fuzzy) {
    let time = type == 'arrival' ? schedule[i].arrival : schedule[i].departure;
        tr.setAttribute('class', 'string');
        tr.innerHTML = '<td>'+schedule[i].thread.number+'</td>'+
        '<td>'+ schedule[i].thread.carrier.title+'</td>'+
        '<td>'+ schedule[i].thread.short_title+'</td>'+
        '<td>'+ time.slice(11, 16) +'</td>'+
        '<td>'+ schedule[i].terminal+'</td>'+
        '<td>'+ fuzzy.toLowerCase() +'</td>';            
        tbody.appendChild(tr.cloneNode(true));
}

function createTable(xhr, type, delayed=false) {
    return new Promise((resolve, reject) => {
        
        schedule = JSON.parse(xhr.responseText)[0].schedule;   
        if (!delayed) {
            for (let i in schedule) {
                let fuzzy = schedule[i].is_fuzzy ? "ЗАДЕРЖАН" : "ОЖИДАЕТСЯ"  
                push(i, type, fuzzy, delayed)          
            }
        } else {
            for (let i in schedule) {
                // console.log(i);
                let fuzzy = schedule[i].is_fuzzy ? "ЗАДЕРЖАН" : "ОЖИДАЕТСЯ"
                if (fuzzy == 'ЗАДЕРЖАН') { 
                    push(i, type, fuzzy, delayed)   
                } else {
                    continue;
                }
            }    
        }
        resolve();
        reject();
    })   
}

function helper(v, func) { // если данные с сервера получены то запрос не делаем повторно
    if (!v) {
        return func;
    } else {
        return v;
    }
}

function Request(type, delayed=false) {  // отправка запроса
    return new Promise((resolve, reject) => {
        xhr.open('GET', 'https://5bbe13d38be32700139e352f.mockapi.io/api/v1/'+type);
        xhr.responseType = 'text';
        document.getElementsByClassName('loading')[0].setAttribute('style', 'display: block;')
        xhr.onload = () => {
            createTable(xhr, type, delayed); 
            document.getElementsByClassName('loading')[0].setAttribute('style', 'display: none;')                   
        }    
        xhr.send();
        resolve();
        reject();
    })               
}

window.onload = ()=> {
    return new Promise((resolve, reject) => {
        mainComment();
        header.setAttribute("style", "background-image:url(./src/img/SVO.png)")
        resolve();
        reject();
    })   
}
