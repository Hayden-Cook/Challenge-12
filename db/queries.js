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

const updateEmployeeManager = async (employeeId, managerId) => {
    const result = await pool.query(
        `UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *`,
        [managerId, employeeId]
    );
    return result.rows[0];
};

const getEmployeesbyManager = async (managerId) => {
    const result = await pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE manager_id = $1`,
        [managerId]
    );
    return result.rows;
};

const getEmployeesbyDepartment = async (departmentId) => {
    const result = await pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title,
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
        `SELECT SUM(role.salary) AS total_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE role.department_id = $1`,
        [departmentId]
    );
    return result.rows[0];
};

module.exports = { getDepartments, getRoles, getEmployees, updateEmployeeManager, getEmployeesbyManager, getEmployeesbyDepartment, deleteDepartment, deleteRole, deleteEmployee, getDepartmentBudget };