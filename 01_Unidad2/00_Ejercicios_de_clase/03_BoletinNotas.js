const alumnos = [
    {"name":"Ana","1t":7,"2t":8,"3t":9},
    {"name":"Luis","1t":4,"2t":5,"3t":6},
    {"name":"Marta","1t":3,"2t":4,"3t":2},
    {"name":"Pablo","1t":9,"2t":10,"3t":9},
    {"name":"Sara","1t":5,"2t":4,"3t":6},
    {"name":"Lamin","1t":3,"2t":4,"3t":3},
    {"name":"Joselito","1t":3,"2t":4,"3t":3},
]

let alumnosTemp = []

function getRating(avg) {
    if (avg < 5) return "Insuficiente"
    else if (avg < 6) return "Suficiente"
    else if (avg < 7) return "Bien"
    else if (avg < 9) return "Notable"
    else return "Sobresaliente"
}

function renderAlumno(alumno) {
    const { name, "1t": t1, "2t": t2, "3t": t3 } = alumno;
    const avg = (t1+t2+t3)/3;
    return `<tr>
                <td>${name}</td>
                <td>${t1}</td>
                <td>${t2}</td>
                <td>${t3}</td>
                <td>${avg.toFixed(2)}</td>
                <td>${getRating(avg)}</td>
            </tr>`;
}

function renderTable(alumnos) {
    let body = "";
    for (const alumno of alumnos) {
        body += renderAlumno(alumno)
    }
    return body
}

function renderForm() {
    const alumno = {
        name: document.getElementById("nombre").value.trim(),
        "1t": Number(document.getElementById("1t").value),
        "2t": Number(document.getElementById("2t").value),
        "3t": Number(document.getElementById("3t").value),
    }
    
    alumnosTemp.push(alumno);
    document.getElementById("alumnosTable").innerHTML = renderTable(alumnos);
}

function printTable() {
    document.getElementById("alumnosTable").innerHTML = renderTable(alumnos);
}

document.addEventListener("DOMContentLoaded", () => {
    printTable()
    document.getElementById("alumnoForm").addEventListener("submit", renderForm);
    document.getElementById("reset").addEventListener("click", renderTable)
});

