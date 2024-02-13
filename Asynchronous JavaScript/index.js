const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject('Error Happened.');
            }

            resolve(data);
        });
    });
};

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) {
                reject('Error Happened.');
            }

            resolve('Success');
        });
    });
};

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res1 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const all = await Promise.all([res1, res2, res3]);
        const imgs = all.map((img) => img.body.message);
        console.log(imgs);

        await writeFilePro('dog-img.txt', imgs.join('\n'));
        console.log('Random Image Saved To The New File.');
    } catch (err) {
        console.log('Error..!');
        throw (err);
    }

    return 'Ready';
};

(async () => {
    try {
        const data = await getDogPic();
        console.log(data);
    } catch (err) {
        console.log('Error Happened.');
    }
})();

// getDogPic().then(data => {
//     console.log(data);
// }).catch(err => {
//     console.log('Error');
// });
// readFilePro(`${__dirname}/dog.txt`).then(data => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
// })
//     .then((res) => {
//         console.log(res.body.message);

//         return writeFilePro('dog-img.txt', res.body.message);

//         // fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         //     console.log('Random Image Saved To The New File.');
//         // });
//     })
//     .then((res) => {
//         console.log('Random Image Saved To The New File.');
//     })
//     .catch(err => {
//         return console.log(err.message);
//     });

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log(`Breed: ${data}`);

//     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then((res) => {
//         console.log(res.body.message);

//         fs.writeFile('dog-img.txt', res.body.message, (err) => {
//             console.log('Random Image Saved To The New File.');
//         });
//     })
//         .catch(err => {
//             return console.log(err.message);
//         });
// });