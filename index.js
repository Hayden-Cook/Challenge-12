const inquirer = require('inquirer');
const { getDepartments, getRoles, getEmployees } = require('./db/queries');

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        },
    ]);

    switch (action) {
        case 'View all departments':
            console.table(await getDepartments());
            break;
        case 'View all roles':
            console.table(await getRoles());
            break;
        case 'View all employees':
            console.table(await getEmployees());
            break;
        case 'Add a department':
            console.log('Add a department');
            break;
        case 'Add a role':
            console.log('Add a role');
            break;
        case 'Add an employee':
            console.log('Add an employee');
            break;
        case 'Update an employee role':
            console.log('Update an employee role');
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }

    mainMenu();
};

mainMenu();