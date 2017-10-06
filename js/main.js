window.addEventListener("load", function() {
    var elements = document.getElementsByClassName("element");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function(e) {
            var number = this.dataset.element
            e.stopPropagation(); // Stop event propagation so body listener doesn't trigger
            if(window.table) {
                makeDialog(number)
            } else {

            }
        });
    }
    document.body.addEventListener("click", function() {
        dialog.classList.remove("active");
    });
    window.dialog = document.querySelector(".element-dialog");
    window.atomic = document.querySelectorAll(".element-data-atomic");
    window.mass   = document.querySelectorAll(".element-data-mass");
    window.iso    = document.querySelectorAll(".element-data-iso");
    window.electrons = document.querySelectorAll(".element-data-electronconfig");
});

function makeDialog(number) {
    try {
        var data = window.table[number - 1];
        var isotopes = parseIsotopes(access(data, "iso"), data.symbol);
        console.log(isotopes)
        substitute(atomic, data.number);
        substitute(mass, data.atomic_weight);
        substitute(iso, data.iso);
        substitute(electrons, data.electron_configuration);
        document.querySelector(".element-data-name").innerText = data.name;
    } catch(e) {
        console.log(e);
    }

    dialog.classList.toggle("active");
}

function parseIsotopes(iso, symbol) {
    var list = isolateIsotopes(iso.split(","), symbol);
    return Array(list.length - 1).fill({}).map( (a,i,v) => ({
        "isotope": list[i+1][0],
        "abundance": list[i+1][1],
        "halfLife": list[i+1][2],
        "spin": list[i+1][3],
        "decayEnergy": list[i+1][4],
        "decayProduct": list[i+1][5]
    }))
}

function isolateIsotopes(iso, symbol) {
    var indicies = [0, ...iso.filter((v, i, a) => new RegExp(`[0-9]+${symbol}`).test(v) && !~v.indexOf("is stable")).map( v => iso.indexOf(v) )];
    return indicies.map( (v, i, a) => 
        iso.slice(v, a[i + 1])
    )
}

function splitEvery(n, list) {
    var result = [];
    var idx = 0;
    while (idx < list.length) {
      result.push(list.slice(idx, idx += n));
    }
    return result;
}

function access(data, prop) {
    return data && data[prop] ? data[prop] : "No Data"
}

function substitute(nodelist, value) {
    if (!nodelist instanceof NodeList) nodelist = [nodelist];
    nodelist.forEach(function(element) {
        element.innerText = value;
    }, this);
}


fetch("data/elements.json")
    .then( r => r.json() )
    .then( table => window.table = table ) // This is bad, I know
    .then( a => console.log("Loaded") )