// Copy the following to NUS source 4, Runes, Runtime at 100,000
// Util functions
function fst (ls) {
    return head(ls);
}

function pop (ls) {
    const n1 = head(ls);
    return remove(n1, ls);
}

// [a] -> a
function snd (ls) {
    const newLs = pop(ls);
    return head(newLs);
}

// [a] -> a
function thd (ls) {
    const newLs = pop(pop(ls));
    return head(newLs);
}

// Adds a single black rune
// Rune -> Rune
function addBlack (rune) {
    return overlay(rune, square);
}

// Adds a single color rune
// (Rune -> Rune) -> Rune -> Rune
function addColor (color, rune) {
    return overlay(rune, color(square));
}

// Layers runes n times
// Rune -> Int -> Rune
function layerRune (rune, n) {
    return repeat_pattern(n, addBlack, rune);
}

// Layers colored runes n times
// Rune -> Int -> Rune
function layerColor (rune, color, n) {
    function adder (rune) { return addColor(color, rune); }
    return repeat_pattern(n, adder, rune);
}

// Converts an integer to rune
// Int -> Rune
function intToRune (n) {
    if (n === 0) { return blank; }
    else { return layerRune(blank, n); }
}

// Converts a RGB list to rune
// [Int] -> Rune
function rgbToRune (rgb) {
    const r = layerColor(blank, red, fst(rgb));
    const g = layerColor(blank, green, snd(rgb));
    const b = layerColor(blank, blue, thd(rgb));
    const rg = overlay(r, g);
    const rGB = overlay(rg, b);
    return rGB;
}

// Converts row to Rune map
// [Int] -> [Rune]
function rowToRunes (list) {
    // Gray-Scale
    // return map(intToRune, list);
    return list;
}

// Converts col to Rune map
// [[Int]] -> [Rune]
function rowsToRunes (lists) {
    return map(rowToRunes, lists);
}

// Add rune beside another rune
// Rune -> Rune
function addSideRune (rune, rune2, num_rune) {
    return beside_frac(1 - 1 / num_rune , rune, rune2);
}

// Add rune below another rune
// Rune -> Rune
function addBelowRune (rune, rune2, num_rune) {
    return stack_frac(1 - 1 / num_rune , rune, rune2);
}

// Combines a list of runes into a single list with combine function
// [Rune] -> Rune
function combineRuneList (combine_func, list, rune, counter) {
    if (length(list) === 0) {
        return rune;
    } else {
        return combineRuneList(
            combine_func, 
            pop(list), 
            combine_func(rune, fst(list), counter), 
            counter + 1
            );
    }
}

// Combines a list of runes into a single rune with beside
// [Rune] -> Rune
function concatRow (list) {
    return combineRuneList(addSideRune, pop(list), fst(list), 2); 
}

// Combines a list of runes into a single rune with stack
// [Rune] -> Rune
function concatCol (list) {
    return combineRuneList(addBelowRune, pop(list), fst(list), 2);
}

// Combine a list of rune rows into a single rune
// [[Rune]] -> Rune
function concatRuneMap (runeMap) {
    const runeCol = map(concatRow, runeMap);
    return concatCol(runeCol);
}

// Combine
// [[Int]] -> Rune
function generateImage (bitmap) {
    const runeMap = rowsToRunes(bitmap);
    return concatRuneMap(runeMap);
}

const testRow1 = list(1, 2, 100, 0);
const testRow2 = list(0, 1, 0, 1);
const testRows = list(testRow1, testRow2, testRow1, testRow2);

//show(generateImage(testRows));
show(generateImage(
    // input the output from conversion lib here
));
