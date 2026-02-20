const MAX_SCORE = 10000000;

let noteCount;
let criticalValue, nearValue;

let errorCount, nearCount;
let targetScore;

function setScore(score) {
    document.getElementById("targetScore").value = score;
}

function calculate() {
    const n = parseInt(document.getElementById("noteCount").value);
    const target = parseInt(document.getElementById("targetScore").value);

    if (!n || !target || n <= 0 || target > MAX_SCORE) {
        document.getElementById("result").innerText = "올바른 값을 입력하세요.";
        return;
    }

    noteCount = n;
    targetScore = target;

    criticalValue = MAX_SCORE / noteCount;
    nearValue     = MAX_SCORE / (2 * noteCount);

    const requiredLoss = MAX_SCORE - targetScore;

    let best = null;

    for (let error = 0; error <= noteCount; error++) {
        for (let near = 0; near + error <= noteCount; near++) {

            const loss = criticalValue * (error + near / 2);

            const distance = Math.abs(loss - requiredLoss);

            const imbalance = Math.abs(
                (error * criticalValue) -
                (near  * criticalValue / 2)
            );

            if (!best ||
                distance < best.distance ||
                (Math.abs(distance - best.distance) < 1e-9 && imbalance < best.imbalance)
            ) {
                best = { error, near, distance, imbalance };
            }
        }
    }

    if (!best) {
        document.getElementById("result").innerText = "조합 계산 실패";
        return;
    }

    errorCount = best.error;
    nearCount = best.near;

    updateDisplay();

    document.getElementById("controls").classList.remove("hidden");
    document.getElementById("result").innerText = "계산 완료";
}

function changeError(delta) {
    let newError = errorCount + delta;
    let newNear = nearCount - delta * 2;

    if (!isValid(newError, newNear)) return;

    errorCount = newError;
    nearCount = newNear;

    updateDisplay();
}

function changeNear(delta) {
    let newNear = nearCount + delta;
    let newError = errorCount - delta / 2;

    if (!isValid(newError, newNear)) return;

    errorCount = newError;
    nearCount = newNear;

    updateDisplay();
}

function isValid(error, near) {
    if (error < 0 || near < 0) return false;
    else return true;
}

function updateDisplay() {
    document.getElementById("errorValue").innerText = errorCount;
    document.getElementById("nearValue").innerText = nearCount;
}
