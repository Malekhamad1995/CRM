
const flatten = (input, reference, output) => {
    output = output || {};
    for (var key in input) {
        var value = input[key];
        key = reference ? reference + '.' + key : key;
        if (typeof value === 'object' && value !== null) {
            flatten(value, key, output);
        } else {
            output[key] = value;
        }
    }
    return output;
}

const CountCoverage = (obj) => {
    const flat = flatten(obj);
    const notEmptyAfterFlat = Object.keys(flat).filter(item => {

    if (flat[item])
            return flat[item]
    })
    return `${Math.floor((Object.keys(notEmptyAfterFlat).length / Object.keys(flat).length) * 100)}%`
}

export { CountCoverage }