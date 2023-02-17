
let reg = />.+</
let h2 = '<h2 style="text-align:left;">test</h2>'
let label = '<label style="text-align:left;">test</label>'
let text = '<input type="text">'
let width = '140px'
let str = h2.match(reg)
// console.log(str);
let result = str[0].substring(1, str[0].length - 1).trim()
// console.log(result);

let t = width.split('p')[0]
console.log(t);


let obj = {
    "cellrow": 1,
    "cellcol": 1,
    "cellwidth": 135,
    "celltype": "title",
    "cellname": "test",
    "cellrowspan": 1,
    "cellcolspan": 4
}
let obj2 = {
    "cellrow": 1, 
    "cellcol": 1, 
    "cellwidth": "135", 
    "celltype": "title", 
    "cellname": "test", 
    "cellrowspan": 1, 
    "cellcolspan": 4
}
let a = '<input type=\"text\" id=\"0-0-i\">'
let input = 'input type="text" id="[object'
let labelReg = /<.+ \s*/
let result2 = a.match(labelReg)[0].split(' ')
console.log(result2[0].substring(1, result2[0].length).trim());

