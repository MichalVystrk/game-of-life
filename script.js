let sloupce = 20,
    radky = 20,
    časovač = 200  ,
    hrajeSe = false,
    tabulka = Array(radky),
    dalsiTabulka = Array(radky);

function vsechnyMrtve() {
    for (let r = 0; r < radky; r++) {
        for (let s = 0; s < sloupce; s++) {
            tabulka[r][s] = 0;
            dalsiTabulka[r][s] = 0;
        }
    }
}

function vytvorTabulku() {
    aktualizaceHodnot();
    vytvoritSeznam();
    let tabulka = document.querySelector("#tabulka");
    tabulka.innerHTML = "";
    alerter = document.querySelector('#alerter')
    alerter.innerHTML = "";
    if (sloupce < 1 || radky < 1) {
        alerter.innerHTML = "Zadejte prosím číslo větší než 0";
        buttonDisable()
        return;
    } else if (sloupce > 100 || radky > 100) {
        alerter.innerHTML = "Zadejte prosím menší než 100";
        buttonDisable()
        return;
    } else {
        for (let r = 0; r < radky; r++) {
            let tr = document.createElement("tr");
            for (let s = 0; s < sloupce; s++) {
                let cell = document.createElement("td");
                cell.setAttribute("id", r + "_" + s);
                cell.setAttribute("class", "dead");
                cell.onclick = zmenaZivota;
                tr.appendChild(cell);
            }
            tabulka.appendChild(tr);
        }
    }
    buttonDisable()
}


function aktualizaceHodnot() {
    sloupce = Number(document.querySelector("#sloupce").value);
    radky = Number(document.querySelector("#radky").value);
    tabulka = Array(radky);
    dalsiTabulka = Array(radky);
}

function enterPress(event) {
    if (event.key === "Enter") {
        vytvorTabulku();
    }
}


function buttonDisable() {
    const table = document.querySelector("#tabulka");
    const tableButtons = document.querySelectorAll(".tableButtons");
    tableButtons.forEach(button => {
        if (table.rows.length === 0) {
            button.style.display = 'none';
        } else {
            button.style.display = 'block';
        }
    });
}

function zmenaZivota() {
    let classList = this.classList;
    let [row, col] = this.id.split("_").map(Number);
    if (classList.contains("dead")) {
        this.setAttribute("class", "alive");
        tabulka[row][col] = 1;
    } else {
        this.setAttribute("class", "dead");
        tabulka[row][col] = 0;
    }
}

function clear() {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        cell.setAttribute("class", "dead");
    });
    vsechnyMrtve()
    buttonDisable()
}

function startToggle() {
    let start = document.querySelector("#start");
    if (start.innerHTML === "Start") {
        start.innerHTML = "Stop";
    } else {
        start.innerHTML = "Start";
    }
    if (hrajeSe) {
        clearInterval(hrajeSe);
        hrajeSe = false;
    } else {
        hrajeSe = setInterval(computeNextGen, časovač);
    }
}

function borderToggle() {
    const cells = document.querySelectorAll("td");
    const buttonIcon = document.querySelector('#buttonIcon');   
    cells.forEach(cell => {
        const currentBorder = getComputedStyle(cell).border;
        console.log(currentBorder);
        if (currentBorder.indexOf('solid') > -1 ) {
            cell.style.border = 'none';
            
        } else {
            cell.style.border = '1px solid rgb(0, 0, 0)';
        }
    });

    if (buttonIcon.classList.contains('fa-border-all')) {
        buttonIcon.classList.remove('fa-solid', 'fa-border-all');
        buttonIcon.classList.add('fa-regular', 'fa-square');
    } else {
        buttonIcon.classList.remove('fa-regular', 'fa-square');
        buttonIcon.classList.add('fa-solid', 'fa-border-all');
    }
}

function randomizeCells() {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        let [row, col] = cell.id.split("_").map(Number);
        if (Math.random() < 0.3) { // 30% chance to be alive
            cell.setAttribute("class", "alive");
            tabulka[row][col] = 1;
        } else {
            cell.setAttribute("class", "dead");
            tabulka[row][col] = 0;
        }
    })
    console.log(tabulka);
}


function vytvoritSeznam() {
    for (let r = 0; r < radky; r++) {
        tabulka[r] = Array(sloupce);
        dalsiTabulka[r] = Array(sloupce);
    }
    vsechnyMrtve();
}

function countNeighbors(row, col) {
    let count = 0;
    if (row - 1 >= 0) {
        if (tabulka[row - 1][col] == 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (tabulka[row - 1][col - 1] == 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < sloupce) {
        if (tabulka[row - 1][col + 1] == 1) count++;
    }
    if (col - 1 >= 0) {
        if (tabulka[row][col - 1] == 1) count++;
    }
    if (col + 1 < sloupce) {
        if (tabulka[row][col + 1] == 1) count++;
    }
    if (row + 1 < radky) {
        if (tabulka[row + 1][col] == 1) count++;
    }
    if (row + 1 < radky && col - 1 >= 0) {
        if (tabulka[row + 1][col - 1] == 1) count++;
    }
    if (row + 1 < radky && col + 1 < sloupce) {
        if (tabulka[row + 1][col + 1] == 1) count++;
    }
    return count;
};

function applyRules(row, col) {
    const numNeighbors = countNeighbors(row, col);
    if (tabulka[row][col] == 1) {
        if (numNeighbors < 2) {
            dalsiTabulka[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            dalsiTabulka[row][col] = 1;
        } else if (numNeighbors > 3) {
            dalsiTabulka[row][col] = 0;
        }
    } else if (tabulka[row][col] == 0) {
        if (numNeighbors == 3) {
            dalsiTabulka[row][col] = 1;
        }
    }
};

function computeNextGen() {
    for (let i = 0; i < radky; i++) {
        for (let j = 0; j < sloupce; j++) {
            applyRules(i, j);
        }
    }
    console.log('vypočteno');
    copyAndResetGrid();
    updateView();
};

function updateView() {
    for (let i = 0; i < radky; i++) {
        for (let j = 0; j < sloupce; j++) {
            const cell = document.getElementById(`${i}_${j}`);
            if (tabulka[i][j] == 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'alive');
            }
        }
        console.log('aktualizováno');
    }
};

function copyAndResetGrid() {
    for (let i = 0; i < radky; i++) {
        for (let j = 0; j < sloupce; j++) {
            tabulka[i][j] = dalsiTabulka[i][j];
            dalsiTabulka[i][j] = 0;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    buttonDisable();
    document.querySelector("#vytvorit").onclick = vytvorTabulku;
    document.addEventListener('keydown', enterPress);
    document.querySelector("#clear").onclick = clear;
    document.querySelector("#start").onclick = startToggle;
    document.querySelector("#borderTog").onclick = borderToggle;
    document.querySelector("#random").onclick = randomizeCells;
});