const matrix = Array(3).fill(null);

for (let i = 0; i < matrix.length; i++)
    matrix[i] = Array(3).fill(null);

for (let i = 0; i < matrix.length; i++)
    for (let j = 0; j < matrix.length; j++)
        console.log(matrix[i][j]);