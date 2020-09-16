import dummyAdd from "./dummyAdd";

describe("dummy add function", () => {
  test("it should add two numbers", () => {
    const a = 1;
    const b = 2;

    const ans = 3;

    expect(dummyAdd(a, b)).toEqual(ans);
  });
});
