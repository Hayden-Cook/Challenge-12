const inquirer = require('inquirer');
const {
    getDepartments,
    getRoles,
    getEmployees,
    updateEmployeeRole,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeManager,
    getEmployeesByManager,
    getEmployeesByDepartment,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    getDepartmentBudget,
} = require('./db/queries');

const mainMenu = async () => {
    const departments = await getDepartments();
    const roles = await getRoles();
    const employees = await getEmployees();

    const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const managerChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

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
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'Get Department Budget',
                'Exit',
            ],
        },
    ]);

    switch (action) {
        case 'View all departments':
            console.table(departments);
            break;

        case 'View all roles':
            console.table(roles);
            break;

        case 'View all employees':
            console.table(employees);
            break;

        case 'Add a department':
            const { departmentName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'Enter the department name:',
                },
            ]);
            await addDepartment(departmentName);
            console.log('Department added successfully!');
            break;

        case 'Add a role':
            const { roleName, roleSalary, roleDepartment } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter the role name:',
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: 'Enter the role salary:',
                },
                {
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'Select the department:',
                    choices: departmentChoices,
                },
            ]);
            await addRole(roleName, roleSalary, roleDepartment);
            console.log('Role added successfully!');
            break;

        case 'Add an employee':
            const { employeeFirstName, employeeLastName, employeeRole, employeeManager } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'employeeFirstName',
                    message: 'Enter the employee first name:',
                },
                {
                    type: 'input',
                    name: 'employeeLastName',
                    message: 'Enter the employee last name:',
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: 'Select the employee role:',
                    choices: roleChoices,
                },
                {
                    type: 'list',
                    name: 'employeeManager',
                    message: 'Select the employee manager:',
                    choices: managerChoices,
                },
            ]);
            await addEmployee(employeeFirstName, employeeLastName, employeeRole, employeeManager);
            console.log('Employee added successfully!');
            break;

        case 'Update an employee role':
            const { employeeId, newRoleId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee to update:',
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'newRoleId',
                    message: 'Select the new role:',
                    choices: roleChoices,
                },
            ]);
            await updateEmployeeRole(employeeId, newRoleId);
            console.log('Employee role updated successfully!');
            break;

        case 'Update Employee Manager':
            const { updateEmployeeId, newManagerId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee to update:',
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Select the new manager:',
                    choices: managerChoices,
                },
            ]);
            await updateEmployeeManager(updateEmployeeId, newManagerId);
            console.log('Employee manager updated successfully!');
            break;

        case 'View Employees by Manager':
            const { managerId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Select a manager to view their employees:',
                    choices: managerChoices,
                },
            ]);
            console.table(await getEmployeesByManager(managerId));
            break;

        case 'View Employees by Department':
            const { departmentId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select a department to view their employees:',
                    choices: departmentChoices,
                },
            ]);

            console.table(await getEmployeesByDepartment(departmentId));
            break;

        case 'Delete Department':
            const { departmentIdToDelete } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'departmentIdToDelete',
                    message: 'Select a department to delete:',
                    choices: departmentChoices,
                },
            ]);
            await deleteDepartment(departmentIdToDelete);
            console.log('Department deleted successfully!');
            break;

        case 'Delete Role':
            const { roleIdToDelete } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleIdToDelete',
                    message: 'Select a role to delete:',
                    choices: roleChoices,
                },
            ]);
            await deleteRole(roleIdToDelete);
            console.log('Role deleted successfully!');
            break;

        case 'Delete Employee':
            const { employeeIdToDelete } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeIdToDelete',
                    message: 'Select an employee to delete:',
                    choices: employeeChoices,
                },
            ]);
            await deleteEmployee(employeeIdToDelete);
            console.log('Employee deleted successfully!');
            break;

        case 'Get Department Budget':
            const { departmentIdForBudget } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'departmentIdForBudget',
                    message: 'Select a department to view their budget:',
                    choices: departmentChoices,
                },
            ]);
            const totalBudget = await getDepartmentBudget(departmentIdForBudget);
            console.log(
                `The total utilized budget for the ${departments.find((department) => department.id === departmentIdForBudget).name} department is $${totalBudget.toLocaleString('en-US')}.`
            );
            break;

        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }

    mainMenu();
};

mainMenu();