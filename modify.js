var elements = require("./data/elements");
var fs = require("fs");



function access(element, prop) {
    if (element[prop]) {
        return element[prop]
    } else {
        return "";
    }
}

function parseIsotopes(iso, symbol) {
    var list = isolateIsotopes(iso.split(", "), symbol);
    return Array(list.length - 1).fill({}).map( (a,i,v) => ({
        "isotope": list[i+1][0] || "No Data/NA",
        "abundance": list[i+1][1] || "No Data/NA",
        "halfLife": 
            ~(v=~(list[i+1][2] || "No Data/NA").indexOf("stable") ? "stable" : list[i+1][2] || "").indexOf("�") ? `${v.split("�")[0]}*10^${v.split(/(10)| /g)[2]}` :  v,
        "decayEnergy": list[i+1][4] || "No Data/NA",
        "decayProduct": list[i+1][5 || "No Data/NA"]
    }))
}

function isolateIsotopes(iso, symbol) {
    var indicies = [0, ...iso.filter((v, i, a) => new RegExp(`[0-9]+${symbol}`).test(v) && !~v.indexOf("is stable")).map( v => iso.indexOf(v) )];
    return indicies.map( (v, i, a) => 
        iso.slice(v, a[i + 1])
    )
}

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    element.name = element.name.charAt(0).toUpperCase() + element.name.substring(1, element.name.length);
    element.atomic_weight = access(element, "atomic_weight").split(" (")[0];
    element.melting_point = access(element, "melting_point").replace(/[?]/g, "-").replace(/[�]/g, "°");
    element.boiling_point = access(element, "boiling_point").replace(/[?]/g, "-").replace(/[�]/g, "°");
    element.electronegativity = +access(element, "electronegativity").split(": ")[1];
    element.iso = parseIsotopes(element.iso, element.symbol);
    element.ionization_energies = element.ionisation_energies = access(element, "ionization_energies").split(", ").map( a => (a.split(": ")[1] || "").replace(" kJ/mol", "") )
    element.atomic_radius = access(element, "atomic_radius").split(": ")[1];
    element.group = element.group_block.split(/[ ,]/g)[1]
    
}

fs.writeFile("data/elements.json", JSON.stringify(elements, null, "\t"), () => console.log("Done"));