# Employee-o-matic
Student toy dedicated employed management database management system
![Title Screen](./resources/images/fig_1.png)

####GitHub Repository(https://github.com/mjtanner-github/Employee-o-matic).

## Introduction

Employee-o-matic is a student toy dedicated employee management database management system (DBMS) intended to exercise command line interface and fundamental database interaction (record creation, retrieval, alteration and deletion) as well as rootamentary logical operations with "join".

## Installation

Before using the Employee Management Database Management System (DBMS), some assembly is required.  
1. Connect to the MySQL server.

![Connect to the MySQL server.](./resources/images/fig_21.png)

2. Build the database sourcing schema.sql file.

![Build the database sourcing schema.sql file.](./resources/images/fig_22.png)

3. Populate the database with mock data by sourcing the seeds.sql file.

![Populate the database with mock data by sourcing the seeds.sql file.](./resources/images/fig_23.png)

4. Close the mysql connection.

![Close the mysql connection.](./resources/images/fig_24.png)

5. Install the program dependancies.

![Install the program dependancies.](./resources/images/fig_25.png)

6. Finally run the program with 'node'. 

![Run the program with 'node'.](./resources/images/fig_26.png)

## Operation

The main menu is presented showing all the assignment requirements.

![Main Menu](./resources/images/fig_3.png)

#### Select "Display All Departments".

![Select "Display All Departments"](./resources/images/fig_2.png)

All departments are displayed.

####  Press any key. Then main menu reappears.

![Main Menu](./resources/images/fig_3.png)

####  Select "Display All Roles".

All roles are displayed. 

![Select "Display All Roles"](./resources/images/fig_4.png)

Again press any key and the main menu again reappears.

####  Select "Display All Employees".

All employees are displayed.

![Select "Display All Employees"](./resources/images/fig_5.png)

Again press any key and the main menu again reappears.

####  Select "Add A Department".

You are prompted to enter the name for the new department and the new department is added to the database.  

![Select "Add A Department"](./resources/images/fig_6.png)

Again press any key and the main menu again reappears.

####  Select "Add A New Role".

You are prompted to enter a name and salary for the new role and select the department for which the role is to be associated. The new role is added to the database.

![Select "Add A New Role"](./resources/images/fig_7.png)

Again press any key and the main menu again reappears.

#### Select "Add A New Employee". 

You are prompted to enter the new employee's first and last name, select the new employee's role and manager. The new employee is added to the database. 

![Select "Add A New Employee"](./resources/images/fig_8.png)

#### Select "Update An Employee's Role".

You are promted to select the employee's name, select the employee's new role and manager. The employee's role is updated in the database.

![Select "Update An Employee's Role"](./resources/images/fig_9.png)

#### Select "Exit The System".

The database connection and application are closed.

![Select "Exit The System"](./resources/images/fig_10.png)
