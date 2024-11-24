const pool = require('./connection');

const getDepartments = async () => {
    const result = await pool.query('SELECT * FROM department');
    return result.rows;
};

const getRoles = async () => {
    const result = await pool.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id`
    );
    return result.rows;
};

const getEmployees = async () => {
    const result = await pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
    );
    return result.rows;
};

const updateEmployeeRole = async (employeeId, roleId) => {
    const result = await pool.query(
        `UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *`,
        [roleId, employeeId]
    );
    return result.rows[0];
};

const addDepartment = async (departmentName) => {
    const result = await pool.query(
        'INSERT INTO department (name) VALUES ($1) RETURNING *',
        [departmentName]
    );
    return result.rows[0];
};

const addRole = async (title, salary, departmentId) => {
    const result = await pool.query(
        'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
        [title, salary, departmentId]
    );
    return result.rows[0];
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
    const result = await pool.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [firstName, lastName, roleId, managerId]
    );
    return result.rows[0];
};

const updateEmployeeManager = async (employeeId, managerId) => {
    const result = await pool.query(
        `UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *`,
        [managerId, employeeId]
    );
    return result.rows[0];
};

const getEmployeesByManager = async (managerId) => {
    const result = await pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE manager_id = $1`,
        [managerId]
    );
    return result.rows;
};

const getEmployeesByDepartment = async (departmentId) => {
    const result = await pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE department_id = $1`,
        [departmentId]
    );
    return result.rows;
};

const deleteDepartment = async (id) => {
    const result = await pool.query('DELETE FROM department WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

const deleteRole = async (id) => {
    const result = await pool.query('DELETE FROM role WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

const deleteEmployee = async (id) => {
    const result = await pool.query('DELETE FROM employee WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

const getDepartmentBudget = async (departmentId) => {
    const result = await pool.query(
        `SELECT COALESCE(SUM(role.salary), 0) AS total_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE role.department_id = $1`,
        [departmentId]
    );
    return result.rows[0].total_budget;
};

module.exports = { getDepartments, getRoles, getEmployees, updateEmployeeRole, addDepartment, addRole, addEmployee, updateEmployeeManager, getEmployeesByManager, getEmployeesByDepartment, deleteDepartment, deleteRole, deleteEmployee, getDepartmentBudget };