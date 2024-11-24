INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Finance'),
    ('HR'),
    ('Sales');

INSERT INTO role (title, salary, department_id) VALUES
    ('Engineer', 100000, 1),
    ('Accountant', 80000, 2),
    ('HR Specialist', 60000, 3),
    ('Sales Lead', 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Ryan', 'Reynolds', 1, NULL),
    ('Hugh', 'Jackman', 2, 1),
    ('Stephen', 'Amell', 3, NULL),
    ('Robert', 'Downey', 4, 3);