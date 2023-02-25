
const string = "sebastian";

const characterRepeated = {}

for (let char of string) {
    characterRepeated[char] = characterRepeated[char] + 1 || 1;
}

// console.log(characterRepeated);

const hamming = (string1, string2) => {
    if (string1 === string2 || string1.length !== string2.length) return "";

    const differences = {}

    for (let string = 0; string < string1.length; string ++) {
        if (string1[string] !== string2[string]) {
            differences[ string1[string] ] = string2[string];
        }
    }
    return differences;
}

// console.log(hamming("sebastian", "sebqstñan"));

const wordsCounter = (words) => {
    words = words.replace(/\s+/g, " ");
    return words.split(" ").length;
}

// console.log(wordsCounter("hello                                     world from my interview session                   "));

const countNumberInnerString = (string) => {
    // string = string.replace(/\s+/, "");
    // const numbers = string.replace(/\d+/, "");
    let numbers = 0;
    for (let char of string) {
        if (char === "0" || parseInt(char)) numbers++
    }
    return numbers;
    // return string.length - numbers.length;
}

let s = "059620";
// console.log(countNumberInnerString(s));
// console.log(s);