export function applyLolGrowStatistic(base, grow, level) {
    level--
    return base + grow * level * (0.7025 + 0.0175 * level)
}

export function convertProxy(data) {
    return JSON.parse(JSON.stringify(data))
}
export function round(value, decimal = 0) {

    return decimal === 0 ? Math.round(value) : Math.round(value * 10 * decimal) / (10 * decimal)
}
