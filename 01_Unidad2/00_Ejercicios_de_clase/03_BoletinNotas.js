// ## Configuración y datos ##
/**
 * Array de estudiantes por defecto
 */
const STUDENTS = [
    {"name":"Ana","t1":7,"t2":8,"t3":9},
    {"name":"Luis","t1":4,"t2":5,"t3":6},
    {"name":"Marta","t1":3,"t2":4,"t3":2},
    {"name":"Pablo","t1":9,"t2":10,"t3":9},
    {"name":"Sara","t1":5,"t2":4,"t3":6},
    {"name":"Lamin","t1":3,"t2":4,"t3":3},
    {"name":"Joselito","t1":3,"t2":4,"t3":3},
];

/**
 * Array de posibles relaciones entre nota y calificación
 */
const GRADE_THRESHOLD = [
    { limit: 5, label: "Insuficiente" },
    { limit: 6, label: "Suficiente" },
    { limit: 7, label: "Bien" },
    { limit: 9, label: "Notable" },
    { limit: 11, label: "Sobresaliente" },
];

// ## Gestión de estudiantes ##
/**
 * Gestor de estudiantes. Lo uso para usar encapsulación y relegar le responsabilidad
 * del reset, el add o el getAll a esta clase en lugar de llamarlos en otras funciones
 */
class StudentsManager {
    /**
     * Los datos iniciales se guardan en initialData y luego activeData contiene initialData
     * más todo lo que se vaya añadiendo. Eso es para poder usar luego el botón de reset.
     * @param {*} initialData 
     */
    constructor(initialData) {
        this.initialData = initialData;
        this.activeData = [...initialData];
    }

    /**
     * Incluye un estudiante dentro de activeData
     * @param {*} student 
     */
    add(student) {
        this.activeData.push(student);
    }

    /**
     * Reinicia activeData a initialData
     */
    reset() {
        this.activeData = [...this.initialData];
    }

    /**
     * Devuelve activeData
     * @returns 
     */
    getAll() {
        return this.activeData;
    }

    /**
     * Devuelve el número de alumnos
     * @returns 
     */
    count() {
        return this.activeData.length;
    }
}

// Instancio studentsManager. Lo usaré para gestionar activeData, es decir, la el array activo
// de estudiantes.
const studentsManager = new StudentsManager(STUDENTS);

// ## DOM Cache
const tbody = document.getElementById("studentsTable");
const studentForm = document.getElementById("studentForm");
const resetBtn = document.getElementById("resetBtn");
const outputField = document.getElementById("output");
const countBtn = document.getElementById("countPassed");
const bestGradeStudentBtn = document.getElementById("getBestGrade");
const avgTrimestreSelect = document.getElementById("trimestreSelect");
const avgTrimestreBtn = document.getElementById("avgTrimestre");

// ## Utilidades ##
/**
 * Calcula la media de notas de un alumno
 * @param {} student 
 * @returns 
 */
function getGradeAverage(student) {
    return ((student.t1 + student.t2 + student.t3) / 3);
}

/**
 * Función para obtener la columna "Calificación" en función de la nota media del alumno (avg)
 * @param {*} avg 
 * @returns 
 */
function getGradeLabel(avg) {
    const grade = GRADE_THRESHOLD.find(threshold => avg < threshold.limit);
    return grade.label;
}

/**
 * Crea una fila de la tabla de alumnos.
 * 
 * @param {*} student 
 * @returns 
 */
function createStudentRow(student) {
    // Descargo el objeto alumno en estas constantes
    const { name, t1, t2, t3 } = student;

    // Calculo la media de las 3 evaluaciones
    const avg = getGradeAverage(student);

    // Genero los datos de una fila
    const rowData = [name, t1, t2, t3, avg.toFixed(2), getGradeLabel(avg)]

    // Uso createElement para crear una fila vacía
    const tr = document.createElement("tr");

    // Para cada campo en rowData (6), creo una celda con createElement
    rowData.forEach(data => {
        const td = document.createElement("td");
        // Uso textContent en lugar de innerHTML
        td.textContent = data;
        // Esto incluye la celda como hijo de la columna
        tr.appendChild(td);
    })

    // Devuelvo la columna creada
    return tr;
}

/**
 * Cuenta los alumnos aprobados
 * @returns 
 */
function countPass() {
    return studentsManager.getAll().filter(s => {
        return getGradeAverage(s) >= 5;
    }).length;
}

/**
 * Obtiene la mejor nota de la clase
 */
function getBestGradeStudent() {
    const students = studentsManager.getAll();
    return students.reduce((best, current) =>
        getGradeAverage(best) > getGradeAverage(current) ? best : current,
        students[0]
    );
}

/**
 * Calcula la media de nota de un trimestre
 */
function getAvgTrimestre() {
    const students = studentsManager.getAll();
    const tri = avgTrimestreSelect.value
    
    let sum = 0;
    students.forEach(s => {sum += s[tri]});

    return sum / students.length;
}

// ## Funciones principales ##
/**
 * Añade a la tabla del html el tbody con los alumnos
 */
function printStudentsTbody() {
    // Vacío el tbody con replaceChildren()
    tbody.replaceChildren();
    
    // Creo un fragment html para poder contener las filas
    const fragment = document.createDocumentFragment();

    // Añado todas las filas al fragment. Esto evita meter el DOM en un bucle
    studentsManager.getAll().forEach(student => {
        fragment.appendChild(createStudentRow(student));
    })

    // Añado las filas del fragment a tbody
    tbody.appendChild(fragment);
}

/**
 * Esta función maneja la lógica que muestra filas nuevas en la página. e es el evento
 * que pasa el navegador automáticamente cuando se llama esta función y lo necesitamos
 * para evitar que la página recarge. Por defecto, cuando un formulario es enviado, la
 * página recarga. Lo que hago aquí es evitar el comportamiento por defecto con preventDefault()
 * @param {*} e 
 */
function processStudentForm(e) {
    e.preventDefault();

    // Creo un objeto estudiante con los valores del formulario
    const student = {
        name: document.getElementById("name").value.trim(),
        t1: Number(document.getElementById("t1").value),
        t2: Number(document.getElementById("t2").value),
        t3: Number(document.getElementById("t3").value),
    }
    
    // Añado el estudiante al activeData
    studentsManager.add(student);

    // Creo una fila nueva de estudiante
    const newRow = createStudentRow(student);

    // Añado la nueva fila al final de tbody
    tbody.appendChild(newRow);

    // Vacío el formulario
    studentForm.reset();
}

/**
 * Imprime en la salida los alumnos aprobados
 */
function outputCountPass() {
    const pass = countPass();
    const fail = studentsManager.getAll().length - pass;
    
    const passElement = document.createElement("p");
    passElement.textContent = `Aprobados: ${pass}`;
    
    const failElement = document.createElement("p");
    failElement.textContent = `Suspensos: ${fail}`;
    
    outputField.replaceChildren();
    outputField.appendChild(passElement);
    outputField.appendChild(failElement);
}

/**
 * Imprime en la salida el alumno con mejor nota media
 */
function outputBestGradeStudent() {
    const bestStudent = getBestGradeStudent();

    const bestGradeStudentElement = document.createElement("p");
    bestGradeStudentElement.textContent = `El mejor alumno es ${bestStudent.name.trim()}. T1: ${bestStudent.t1}, T2: ${bestStudent.t2}, T3: ${bestStudent.t3}, Final: ${getGradeAverage(bestStudent).toFixed(2)}`;

    outputField.replaceChildren();
    outputField.appendChild(bestGradeStudentElement);
}

/**
 * Imprime la media del trimestre
 */
function outputAvgTrimestre() {
    const avg = getAvgTrimestre().toFixed(2);

    const avgTrimestreElement = document.createElement("p");
    avgTrimestreElement.textContent = `La media del trimestre es ${avg}.`

    outputField.replaceChildren();
    outputField.appendChild(avgTrimestreElement);
}

// ## Executions & Listeners ##
// Imprime la tabla completa usando el array inicial
printStudentsTbody();

// Añade un listener al botón "Añadir" que llame a la función que procesa el formulario
studentForm.addEventListener("submit", processStudentForm);

// Añade un listener que resetea el formulario y elimina toda la información que no se 
// encontrase en el formulario inicial
resetBtn.addEventListener("click", () => {
    studentsManager.reset();
    printStudentsTbody();
});

countBtn.addEventListener("click", outputCountPass);
bestGradeStudentBtn.addEventListener("click", outputBestGradeStudent);
avgTrimestreBtn.addEventListener("click", outputAvgTrimestre);