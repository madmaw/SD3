QUnit.module("DD.SD3.UtilSD3 unit tests");
test("search empty array", function (assert) {
    var array = [];
    var e = 1;
    var result = DD.SD3.search(array, e);
    assert.equal(result, 0, "unexpected result");
});
test("search single entry array at end", function (assert) {
    var array = [1];
    var e = 2;
    var result = DD.SD3.search(array, e);
    assert.equal(result, 1, "unexpected index");
});
test("search single entry array at start", function (assert) {
    var array = [1];
    var e = 0;
    var result = DD.SD3.search(array, e);
    assert.equal(result, 0, "unexpected result");
});
test("search multiple entry array with duplicates at start", function (assert) {
    var array = [1, 1, 1, 1, 1, 1, 1];
    var e = 0;
    var result = DD.SD3.search(array, e);
    assert.equal(result, 0, "unexpected result");
});
test("search multiple entry array with duplicates at end", function (assert) {
    var array = [1, 1, 1, 1, 1, 1, 1];
    var e = 2;
    var result = DD.SD3.search(array, e);
    assert.equal(result, array.length, "unexpected result");
});
test("search multiple entry array insert in middle", function (assert) {
    var array = [0, 1, 2, 3, 5, 6, 7, 8];
    var e = 4;
    var result = DD.SD3.search(array, e);
    assert.equal(result, 4, "unexpected result");
});
test("search duplicate at start", function (assert) {
    var array = [0, 0, 0, 0, 1, 2, 3];
    var e = 0;
    var result = DD.SD3.search(array, e);
    assert.equal(true, result >= 0 && result <= 4, "result " + result + " out of bounds");
});
test("search duplicate at end", function (assert) {
    var array = [0, 1, 2, 3, 4, 4, 4, 4, 4];
    var e = 4;
    var result = DD.SD3.search(array, e);
    assert.equal(true, result >= 4 && result <= array.length, "result " + result + " out of bounds");
});
test("search heterogeneous", function (assert) {
    var array = [0, 2, 3, 4, 5, 6];
    var e = '1';
    var result = DD.SD3.search(array, e, function (a, l) {
        return a < parseInt(l);
    });
    assert.equal(result, 1, "unspected result");
});
test("search strings", function (assert) {
    var array = ['a', 'b', 'd', 'e', 'f'];
    var e = 'c';
    var result = DD.SD3.search(array, e);
    assert.equal(result, 2, "unspected result");
});
//# sourceMappingURL=UtilSD3Test.js.map
