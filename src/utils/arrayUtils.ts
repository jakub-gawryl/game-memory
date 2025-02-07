  export const shuffleArray = <T>(input: T[]): T[] => {
    const output = input.slice();
    let m = output.length;
    let t: T;
    let i: number;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = output[m];
      output[m] = output[i];
      output[i] = t;
    }

    return output;
  }