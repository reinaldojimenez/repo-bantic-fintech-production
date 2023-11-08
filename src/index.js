import app from "./app.js";
//import './database/database.js';

const main = () => {
    app.listen(app.get('PORT'), () => {
        console.log(`Server on port ${app.get('PORT')}...`);
    });
};

main();