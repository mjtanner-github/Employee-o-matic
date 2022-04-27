const express = require('express');
const dotenv = require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const prettyPrintTitle = require('./prettyPrintTitle.js');
const cTable = require('console.table');
const pressAnyKey = require('press-any-key');
const PORT = process.env.PORT || 3001;

// Returns an mysql2 database connection    
function get_connection() {
    return(mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "employee_management_db"  
        })
    );
};

// Ends a mysql2 database connection
function kill_connection(connection) {
    connection.end();
};
 
// Returns lists for list choice inquirer prompts
function get_special_lists(_callback) {   
    
    const mysql_connection = get_connection();
    mysql_connection.promise().query(   'DROP TABLE IF EXISTS manager_list ;');
    mysql_connection.promise().query(   'CREATE TABLE manager_list SELECT DISTINCT employee.manager_id as id FROM employee ');
    mysql_connection.promise().query(   'SELECT CONCAT(employee.last_name, ", ", employee.first_name) ' +
                                        'AS manager_name, employee.last_name AS sort_field FROM employee ' +
                                        'JOIN manager_list ON employee.id = manager_list.id ORDER BY sort_field')
    .then(([results,fields]) => {
        let manager_names = [];
        for(let i = 0; i < results.length; i++)
           manager_names.push(results[i].manager_name);
        mysql_connection.promise().query(   'SELECT CONCAT(employee.last_name, ", ", employee.first_name) '+
                                            'AS employee_name FROM employee ORDER BY employee.last_name ')
    .then(([results,fields]) => {
        let employee_names = [];
        for(let i = 0; i < results.length; i++)
            employee_names.push(results[i].employee_name);
        mysql_connection.promise().query(   'SELECT department.department_name ' +
                                            'FROM department ORDER BY department_name ')
    .then(([results,fields]) => {
        let department_names = [];
        for(let i = 0; i < results.length; i++)
            department_names.push(results[i].department_name);
        mysql_connection.promise().query(   'SELECT employee_role.title FROM employee_role ORDER BY title ')
    .then(([results,fields]) => {
        let role_names = [];
        for(let i = 0; i < results.length; i++)
            role_names.push(results[i].title);
        kill_connection(mysql_connection);
        return(_callback(manager_names, employee_names, department_names, role_names));
    })})})});
};

// All inquirer prompt bodies
function get_questions(manager_list, employee_list, department_list, role_list){
    const questions_array = 
    [
        {
            name: 'options',
            type: 'list',
            message: 'Please choose from the following options:',
            choices: 
            [
            'View All Departments',
            'View All Roles', 
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role',
            'Exit The System'  
            ],
        },
        {
            name: 'new_department',
            message: 'Please enter the name of the new department to be added:',
            when: (answers) => answers.options === 'Add A Department'
        },
        {
            name: 'new_role',
            message: 'Please enter the name of the new role to be added:',
            when: (answers) => answers.options === 'Add A Role'
        },
        {
            name: 'new_salary',
            message: 'Please enter the salary associated with the new role:',
            when: (answers) => answers.options === 'Add A Role'
        },
        {
            name: 'new_department',
            type: 'list',
            message: 'Please select the department for the new role:',
            choices: department_list,
            when: (answers) => answers.options === 'Add A Role'
        },
        {
            name: "first_name",
            type: "input",
            message: "Please enter the new employee's first name:",
            when: (answers) => answers.options === 'Add An Employee'
        },
        {
            name: "last_name",
            type: "input",
            message: "Please enter the new employee's last name:",
            when: (answers) => answers.options === 'Add An Employee'
        },
        {
            name: "role_name",
            type: "list",
            message: "Please select the employee's role:",
            choices: role_list,
            when: (answers) => answers.options === 'Add An Employee'
        },
        {
            name: "manager_name",
            type: "list",
            message: "Please enter the new employee's manager:",
            choices: manager_list,
            when: (answers) => answers.options === 'Add An Employee'
        },
        {
            name: 'employee',
            type: 'list',
            message: 'Please select the employee:',
            choices: employee_list,
            when: (answers) => answers.options === 'Update An Employee Role'
        },
        {
            name: "new_role",
            type: "list",
            message: "Please select the employee's new role:",
            choices: role_list,
            when: (answers) => answers.options === 'Update An Employee Role'
        },
        {
            name: "new_manager",
            type: "list",
            message: "Please select the employee's new manager:",
            choices: manager_list,
            when: (answers) => answers.options === 'Update An Employee Role'
        }
    ]
    return questions_array;
}

// Main program cycle
function cycle() {

// Returns lists for list choice inquirer prompts
        get_special_lists(function(managers, employees, departments, roles) {
            inquirer.prompt(get_questions(managers, employees, departments, roles)).then((responses) => {
                const mysql_connection = get_connection();

// Switch according to main list choice prompt for functions 
                switch(responses.options) {
// View All Departments                    
                    case 'View All Departments':
                        mysql_connection.query('SELECT department.department_name AS "Department Name", department.id AS "Department ID" FROM department', function (err, results) {
                        console.clear();  
                        console.table(results);
                        console.log('Press any key to continue:\n');
                    });    
                        pressAnyKey()
                        .then(() => {
                            console.clear();
                            kill_connection(mysql_connection);  
                            cycle();
                        });
                        break;
// View All Roles                        
                    case 'View All Roles': 
                        mysql_connection.query( 'SELECT employee_role.title AS Title, ' + 
                                                'employee_role.id AS "Role ID", ' + 
                                                'department.department_name AS Department, ' +
                                                'concat("$", FORMAT(employee_role.salary, 0, "en_US")) AS Salary ' +
                                                'FROM employee_role JOIN department ' +
                                                'ON employee_role.department_id = department.id ORDER BY title', function (err, results) {
                        console.clear();  
                        console.table(results);
                        console.log('Press any key to continue:\n');
                        });    
                        pressAnyKey()
                        .then(() => {
                            console.clear();
                            kill_connection(mysql_connection);  
                            cycle();
                        });
                        break;
// View All Employees                        
                    case 'View All Employees':
                      mysql_connection.query( 'DROP TABLE IF EXISTS interim ;', function (err, results) {
                      });
                      mysql_connection.query( 'CREATE TABLE interim ' + 
                                              'SELECT employee.id, ' + 
                                              'employee.first_name, ' +  
                                              'employee.last_name, ' +                            
                                              'employee.role_id, ' +                            
                                              'employee.manager_id, ' +                            
                                              'employee_role.title, ' +
                                              'employee_role.department_id ' +
                                              'FROM employee JOIN employee_role ' + 
                                              'ON employee.role_id = employee_role.id ', function (err, results) {
                      });
                      mysql_connection.query( 'ALTER TABLE interim ADD department VARCHAR(50) ', function (err, results) {
                      });
                      mysql_connection.query( 'UPDATE interim ' + 
                                              'INNER JOIN department ON interim.department_id = department.id ' +
                                              'SET department = department.department_name ', function (err, results) {
                      });
                      mysql_connection.query( 'ALTER TABLE interim ADD salary DECIMAL ', function (err, results) {
                      });
                      mysql_connection.query( 'UPDATE interim ' + 
                                              'INNER JOIN employee_role ON interim.role_id = employee_role.id ' +
                                              'SET interim.salary = employee_role.salary ', function (err, results) {
                      });
                      mysql_connection.query( 'ALTER TABLE interim ' +
                                              'ADD manager_name VARCHAR(70)', function (err, results) {
                      });
                      mysql_connection.query( 'UPDATE interim ' + 
                                              'INNER JOIN employee ON interim.manager_id = employee.id ' +
                                              'SET interim.manager_name = CONCAT(employee.first_name, " ",employee.last_name) ', function (err, results) {
                      });
                      mysql_connection.query( 'SELECT '+
                                                'first_name AS "First Name", ' +
                                                'last_name AS "Last Name", ' +
                                                'title AS Title, ' +
                                                'department AS Department, ' +
                                                'concat("$", FORMAT(salary, 0, "en_US")) AS Salary, ' +
                                                'manager_name AS Manager ' +
                                              'FROM interim ORDER BY last_name, first_name', function (err, results) {
                        console.clear();  
                        console.table(results);
                        console.log('Press any key to continue:\n');
                      });
                      pressAnyKey()
                        .then(() => {
                          console.clear();
                          kill_connection(mysql_connection);  
                          cycle();
                        });
                      break;
// Add A Department                      
                    case 'Add A Department':
                        mysql_connection.promise().query(`INSERT INTO department (department_name) VALUES ('${responses.new_department}')`);    
                        pressAnyKey()
                        .then(() => {
                            console.clear();
                            kill_connection(mysql_connection);  
                            cycle();
                        });
                      break;
// Add A Role 
                      case 'Add A Role':
                        mysql_connection.promise().query(`SELECT department.id FROM department WHERE department.department_name = '${responses.new_department}'`)
                        .then(([results,fields]) => {
                            mysql_connection.promise().query(`INSERT INTO employee_role (title, salary, department_id) VALUES ('${responses.new_role}','${responses.new_salary}','${results[0].id}')`);    
                        });
                        pressAnyKey()
                        .then(() => {
                            console.clear();
                            kill_connection(mysql_connection);  
                            cycle();
                        });
                      break;
// Add An Employee                           
                    case 'Add An Employee':
                        mysql_connection.promise().query(`SELECT employee_role.id FROM employee_role WHERE employee_role.title = '${responses.role_name}'`)
                        .then(([results_1,fields_1]) => {
                            let manager_split = responses.manager_name.split(', ');
                            mysql_connection.promise().query(`SELECT employee.id FROM employee WHERE employee.last_name = '${manager_split[0]}' AND employee.first_name = '${manager_split[1]}'`)
                        .then(([results_2,fields_2]) => {
                            mysql_connection.promise().query(   `INSERT INTO employee (first_name, last_name, role_id, manager_id) ` + 
                                                                `VALUES('${responses.first_name}','${responses.last_name}','${results_1[0].id}','${results_2[0].id}')`)
                        })});
                        pressAnyKey()
                        .then(() => {
                            console.clear();
                            kill_connection(mysql_connection);  
                            cycle();
                        });
                      break;
// Update An Employee Role                          
                    case 'Update An Employee Role':      
                        let employee_split = responses.employee.split(", ");
                        mysql_connection.promise().query(`SELECT employee.id FROM employee WHERE employee.last_name  = '${employee_split[0]}' AND employee.first_name  = '${employee_split[1]}'`)
                        .then(([results_1,fields_1]) => {
                            let manager_split = responses.new_manager.split(', ');
                            mysql_connection.promise().query(`SELECT employee.id FROM employee WHERE employee.last_name = '${manager_split[0]}' AND employee.first_name = '${manager_split[1]}'`)
                        .then(([results_2,fields_2]) => {
                            mysql_connection.promise().query(`SELECT employee_role.id FROM employee_role WHERE employee_role.title = '${responses.new_role}'`)
                        .then(([results_3,fields_3]) => {
                            mysql_connection.promise().query(`UPDATE employee SET role_id = '${results_3[0].id}', manager_id = '${results_2[0].id}' WHERE employee.id = '${results_1[0].id}'`)  
                        })})});
                        
                        pressAnyKey()
                        .then(() => {
                            console.clear();
                            kill_connection(mysql_connection);  
                            cycle();
                        });            
                      break;
// Exit The System                      
                    case 'Exit The System':
                      console.clear();
                      kill_connection(mysql_connection);
                      break;          
                  }
            })    
        });
};
console.clear();
prettyPrintTitle.pretty_print_title()
cycle();
        