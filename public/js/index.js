// Create rooms functionality
async function create(e){
    e.preventDefault();
    var room_name = document.querySelector('#room-name').value;

    var btn = document.createElement('button');
    btn.setAttribute("class", "btn btn-info");
    btn.setAttribute("type", "button");
    btn.innerHTML = room_name;

    var rooms_div = document.querySelector('#rooms-div');
    rooms_div.innerHTML = btn;
}

document.querySelector('.create-form').addEventListener('submit', create);