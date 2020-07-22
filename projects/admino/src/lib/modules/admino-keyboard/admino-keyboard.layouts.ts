import * as KEY from "@angular/cdk/keycodes";
export const LAYOUT1 = {
  columns: [
    {
      rows: [
        {
          keys: [
            { character: "q" },
            { character: "w" },
            { character: "e" },
            { character: "r" },
            { character: "t" },
            { character: "z" },
            { character: "u" },
            { character: "i" },
            { character: "o" },
            { character: "p" },
          ],
        },
        {
          keys: [
            { character: "a" },
            { character: "s" },
            { character: "d" },
            { character: "f" },
            { character: "g" },
            { character: "h" },
            { character: "j" },
            { character: "k" },
            { character: "l" },
          ],
        },
        {
          keys: [
            { character: "í" },
            { character: "y" },
            { character: "x" },
            { character: "c" },
            { character: "v" },
            { character: "b" },
            { character: "n" },
            { character: "m" },
          ],
        },
        {
          keys: [{ character: "/" }, { label: "␣", character: " ", width: 5 }],
        },
      ],
    },

    {
      rows: [
        {
          keys: [{ character: "7" }, { character: "8" }, { character: "9" }],
        },
        {
          keys: [{ character: "4" }, { character: "5" }, { character: "6" }],
        },
        {
          keys: [{ character: "1" }, { character: "2" }, { character: "3" }],
        },
        {
          keys: [{ character: "0" }],
        },
      ],
    },
  ],
};

export const layout2 = {
  columns: [
    {
      rows: [
        {
          keys: [{ character: 1 }, { character: 2 }, { character: 3 }],
        },
        {
          keys: [{ character: 4 }, { character: 5 }, { character: 6 }],
        },
        {
          keys: [{ character: 7 }, { character: 8 }, { character: 9 }],
        },
        {
          keys: [{ character: 0 }],
        },
      ],
    },
  ],
};
