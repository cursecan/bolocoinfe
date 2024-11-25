const calculateMineValue = (mineStartedTime, mineRate) => {
    if (!mineStartedTime || !mineRate) return 0

    const now = Date.now()
    const totalMiningTime = 6 * 60 * 60 * 1000  // set max 6 hours
    let elapsedTime = now - mineStartedTime

    elapsedTime = Math.round(elapsedTime / 1000) * 1000

    if (elapsedTime < 0) return 0

    if (elapsedTime >= totalMiningTime) {
        return mineRate * (totalMiningTime / 1000)
    }

    const mineValue = mineRate * (elapsedTime / 1000)

    return Math.round(mineValue * 1000) / 1000
}


const formatNumber = (num) => {
    let numStr = num.toFixed(3)

    let [intPart, decPart] = numStr.split('.')
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    if (num < 0.01) {
        return `${intPart},${decPart}`
    }

    decPart = decPart.slice(0,2)
    return `${intPart},${decPart}`
}


export  {
    calculateMineValue,
    formatNumber,
}