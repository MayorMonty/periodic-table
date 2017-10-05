window.addEventListener("load", function() {
    var elements = document.getElementsByClassName("element");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function(e) {
            var number = this.classList.item(4).split("-")[1];
            e.stopPropagation(); // Stop event propagation so body listener doesn't trigger
            if(window.table) {
                makeDialog(number)
            } else {
                window.onTableLoad = makeDialog.bind(this, number);
            }
        });
    }
});

var dialog = document.querySelector(".element-dialog");
var atomic = document.querySelectorAll(".element-data-atomic");
var mass   = document.querySelectorAll(".element-data-mass");
var iso    = document.querySelectorAll(".element-data-iso");
var electrons = document.querySelectorAll(".element-data-electronconfig");
function makeDialog(number) {
    var data = window.table[number - 1];
    
    substitute(atomic, data.number);
    substitute(mass, data.atomic_weight);
    substitute(iso, data.iso);
    substitute(electrons, data.electron_configuration);

    dialog.classList.toggle("active");
}

function substitute(nodelist, value) {
    nodelist.forEach(function(element) {
        element.innerText = value;
    }, this);
}

document.body.addEventListener("click", function() {
    dialog.classList.remove("active");
});


fetch("data/elements.json")
    .then( r => r.json() )
    .then( table => window.table = table ) // This is bad, I know
    .then( a => window.onTableLoad ? window.onTableLoad() : null );