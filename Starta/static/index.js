function createCalendar(elem, year, month) {

    let mon = month - 1;
    let d = new Date(year, mon);
    const monthName = {
        1: 'Январь',
        2: 'Февраль',
        3: 'Март',
        4: 'Апрель',
        5: 'Май',
        6: 'Июнь',
        7: 'Июль',
        8: 'Август',
        9: 'Сентябрь',
        10: 'Октябрь',
        11: 'Ноябрь',
        12: 'Декабрь'
    }

    let table = `<div class="month"><h3>${monthName[month]}</h3><table><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th class="free">сб</th><th class="free">вс</th></tr><tr>`;

    for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>';
    }

    while (d.getMonth() == mon) {
        table += `<td class="full m${d.getDate()}-${month}-${year}">` + d.getDate() + '</td>';

        if (getDay(d) % 7 == 6) {
            table += '</tr><tr>';
        }

        d.setDate(d.getDate() + 1);
    }

    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>';
        }
    }

    table += '</tr></table></div>';

    elem.innerHTML += table;
}

function getDay(date) {
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}

for (let i = 1; i <= 12; i++) {
    createCalendar(calendar, 2020, i)
}

const day = document.querySelector('#calendar')
day.addEventListener('click', function (e) {
    let target = e.target;
    if (target.tagName != 'TD' || target.classList.length < 1) {
        return
    }
    target.classList.toggle('active')
})

$.fn.setCursorPosition = function (pos) {
    if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
};

$('#phone').click(function () {
    $(this).setCursorPosition(3);
}).mask('+7(999) 999-99-99');

jQuery.validator.addMethod("checkMaskPhone", function(value, element) {
    return /\+\d{1}\(\d{3}\)\d{3}-\d{4}/g.test(value); 
});

var form = $('.reserved_form');

form.validate();

$.validator.addClassRules({
    'phone': {
        checkMaskPhone: true,
    }
});

form.submit(function(e){
    e.preventDefault();
    if (form.valid()) {
        alert('Форма отправлена');
    }
    return;
});


form = document.querySelector('form');
phone = document.querySelector('#phone')

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const reservedDates = document.querySelectorAll('.active')
    let datesClassList = []
    reservedDates.forEach(elem => {
        datesClassList.push(elem.classList[1])
    })
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            phone: `${phone.value}`,
            dates: `${datesClassList}`,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        })
        .then(response => response.json())
        .then(json => {
            [ reservedNumber ]= Object.keys(json)
            reservedClases = Object.values(json)[0].split(',')
            console.log(reservedNumber)
            console.log(reservedClases)
            reservedClases.forEach( elem => {
                const tmp = document.querySelector('.'+elem)
                tmp.classList.add('reserved')
            })
        })
      
    })


document.addEventListener('DOMContentLoaded', function(e) {
    fetch('/reserved')
    .then(response => response.json())
    .then(json => {
        reservedClases = Object.values(json)
        reservedClases.forEach(elem => {
            elem.forEach(splitedDate => {
                let dates = splitedDate.split(',')
                dates.forEach( date => {
                    console.log(date)
                    const addClass = document.querySelector('.'+date)
                    addClass.classList.add('reserved')
                })
            })
        })
    })
})