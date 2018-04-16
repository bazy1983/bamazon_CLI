var arr = [1,2,3,4,5,6,7, "s", "e"];
var x = 2;
function test(item){
    return !isNaN(item)
}

console.log(arr.filter(test));
