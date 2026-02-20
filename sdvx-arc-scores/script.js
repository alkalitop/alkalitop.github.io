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

    criticalValue = Math.floor(MAX_SCORE / n);
    nearValue = Math.floor(criticalValue / 2);

    const fullCriticalScore = n * criticalValue;

    if (fullCriticalScore < targetScore) {
        document.getElementById("result").innerText = "해당 점수 달성 불가";
        return;
    }

    const requiredLoss = fullCriticalScore - targetScore;

    let best = null;

    for (let near = 0; near <= n; near++) {
        for (let error = 0; error + near <= n; error++) {

            const loss =
                error * criticalValue +
                near * (criticalValue - nearValue);

            if (loss < requiredLoss) continue;

            const imbalance = Math.abs(error - near / 2);

            if (!best || imbalance < best.imbalance) {
                best = { error, near, imbalance };
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